import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Bd } from '../../bd.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-incluir-grupo',
  templateUrl: './incluir-grupo.component.html',
  styleUrls: ['./incluir-grupo.component.css']
})
export class IncluirGrupoComponent implements OnInit {

  //Emitindo um evento para o componente pai ('home')
  @Output() public atualizarGrupos:EventEmitter<any> = new EventEmitter<any>();

  //Variavel que indica o estado que o Modal deve aparecer
  public progressoCompartilhamento:string = 'pendente';

  public formulario:FormGroup = new FormGroup({
    'nome': new FormControl(null),
    'descricao': new FormControl(null),
    'link': new FormControl(null)
  })

  public email:string;

  constructor(private bd:Bd) {}

  ngOnInit() {
    /* Recuperando o valor de email da secao */
    firebase.auth().onAuthStateChanged( (user) => {
      if(user !== null){ this.email = user.email; } 
    })
  }
  

  /* 
    Recuperar valor do formulario.
    Adicionar o novo grupo no banco de dados, por meio do servico ('bd.service').
    Emite um evento para 'home', para que ele atualize a lista de grupos. Quando ele emite esse
  evento para 'home', ele irá refazer todo o request, pegar todos os grupos, fazer ou calculos novamente,
  etc. Sem duvida não é a melhor forma de se fazer isso. Poderiamos apenas fazer o POST no servidor
  e atualizar o front sem fazer outro request, já que temos os dados do grupo que foi adicionado.
  Contudo, optei por essa implementação por falta de tempo.
  */
  public compartilhar():void {
    this.progressoCompartilhamento = 'andamento';
    this.bd.compartilhar( 
      {
        email: this.email, 
        nome: this.formulario.value.nome, 
        descricao:this.formulario.value.descricao,
        link:this.formulario.value.link,
        latitude:localStorage.getItem('lat'),
        longitude:localStorage.getItem('long')
      } 
    )
    .then(() => { 
      this.progressoCompartilhamento = 'concluido';
      this.atualizarGrupos.emit();
    });
  }


  /* 
    Limpa o formulário e seta 'progressoCompartilhamento' para seu valor inicial ('pendente').
  */
  public resetandoProgresso():void{ 
    this.progressoCompartilhamento = 'pendente'; 
    this.formulario.reset();
  }

}
