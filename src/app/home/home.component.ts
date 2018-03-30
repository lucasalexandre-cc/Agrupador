import { Component, OnInit } from '@angular/core';
import { Autenticacao } from '../auth.service';
import { Router } from '@angular/router';
import { Bd } from '../bd.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

  //Animação da imagem do topo
  animations: [
    trigger('slide-topo', [
      state('criado', style({ opacity:1 })),
      transition('void => criado', [
        style({opacity:0, transform: 'translate(0, -50px)'}),
        animate('1.5s 0s ease-in-out') //duracao, delay e aceleracao
      ])
    ])
  ]
})

export class HomeComponent implements OnInit {

  constructor(private autenticacao:Autenticacao, private router:Router, private bd:Bd) { }

  public latitude:number;
  public longitude:number;
  public data:any[] = [];
  public email:string;
  public carregando:boolean = true; 
  public queryVazia:boolean = false; //Usada para mostrar uma mensagem caso nenhum grupo tenha sido encontrado
  public estadoTopo:string = 'criado';
  public estado:string = 'todos';//Usada para saber qual estado atual da tabela.

  ngOnInit() {

    /* 
      1)Assim que o usuario conseguir entrar em 'home', tentaremos pegar sua geolocalizacao.
      2)Em caso de erro, emitimos um alerta, cancelamos a secao do usuario e mandamos ele de volta para o painel de 'login'
      3)Em caso de sucesso, setaremos seu lat/long em variaveis locais e no localStorage.
        Após isso, fazemos uma consulta com o servico ('bd.service').
        Quando concluido a consulta, ele atribui o resultado a variavel 'data', que é usada para popular a tabela no html.
    */
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( 
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          localStorage.setItem('lat', this.latitude.toString());
          localStorage.setItem('long', this.longitude.toString());

          firebase.auth().onAuthStateChanged( (user) => {
            if(user !== null) this.bd.consultarGrupos1km(this.latitude, this.longitude, user.email)
              .then( (grupos:any) => {
                this.email = user.email;
                this.data = grupos;
                this.queryVazia = this.data.length ? false : true;
                this.carregando = false;
              })
              .catch( () => {alert("Erro em nossos servidores!")} )
          })
        },
        (erroPosition) => {//Normalmente, erro de permisao
          alert(erroPosition.message);
          localStorage.removeItem('idToken');
          this.router.navigate(['/']);
          console.log(erroPosition);
        })
    }else{//Normalmente, erro com relacao ao suporte oferecido pelo navegador
        alert("Seu navegador não suporta a geolocalização.") 
        localStorage.removeItem('idToken');
        this.router.navigate(['/']);
    }

  }


  /*
    Chamando o servico de logout.
  */
  public sair():void{
    this.autenticacao.sair();
  }


  /* 
    Abrindo link em uma nova aba. Chamado pelo botao de link contido na tabela.
  */
  public abrirLink(link){
    window.open(link, "_blank"); 
  }


  /* 
    Apagando um grupo no banco de dados e também no front
  */
  public apagarGrupo(key:string, index:number):void {
    this.bd.apagarGrupo(this.email, key)
      .then( () => {
        this.data.splice(index, 1);
        this.queryVazia = this.data.length ? false : true;
        alert("Grupo removido com sucesso!");
      })
      .catch( (erro) => {alert("Erro ao remover o grupo!")} )
  }

  /* 
    Muda o valor de valid de todos os grupos para 1.
  Todos os grupos irão aparecer na tabela
  */
  public exibirTodos():void {
    if(this.estado == 'todos') return;
    this.estado = 'todos';
    for(let i = 0; i<this.data.length; i++) this.data[i].valid = 1;
  }


  /* 
    Muda o valor de dos grupos criados por email diferente do usuário logado para 0.
  Só irá aparecer os grupos que foram criados pelo usuário logado na seção.
  */
  public exibirMeus():void{
    if(this.estado == 'meus') return ;
    this.estado = 'meus';
    for(let i = 0; i<this.data.length; i++) if(this.data[i].email != this.email) this.data[i].valid = 0;
  }

  /* 
    Emitido quando clicamos no botão de 'refresh' dos grupos.
  Irá ser feita uma nova consulta no banco de dados para atualizar possiveis alterações.
  */
  public recarregarGrupos():void {
    this.carregando = true;
    this.bd.consultarGrupos1km(this.latitude, this.longitude, this.email)
    .then( (grupos:any) => { 
      this.data = grupos; 
      this.queryVazia = this.data.length ? false : true;
      this.estado = 'todos';
      this.carregando = false;
    })
    .catch( () => {alert("Erro em nossos servidores!")} );
  }


  /* 
    Método costumizado de comparação, usado para ordenar o '.sort()' pelo tempo.
  Os grupos mais recentemente postados aparecerão primeiro na tabela.
  Esse 'sort(compare)' é feito em 'home.component.html'.
  */
  public compare(a,b):number {
    if (new Date(a.tempo).getTime() < new Date(b.tempo).getTime())
      return 1;
    if (new Date(a.tempo).getTime() > new Date(b.tempo).getTime())
      return -1;
    return 0;
  }
}