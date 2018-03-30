import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Usuario } from '../usuario.model';
import { Autenticacao } from '../../auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})

export class CadastroComponent implements OnInit {

  //Variavel usada para emitir evento para o componente pai (nesse caso, 'acesso')
  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>();

  public formulario:FormGroup = new FormGroup({
    'email': new FormControl(null),
    'nome_completo': new FormControl(null),
    'nome_usuario': new FormControl(null),
    'senha': new FormControl(null)
  })

  constructor(private autenticacao:Autenticacao) { }

  ngOnInit() {
  }


  /* Dispara um evento para o componente pai ('acesso') exibir o painel de login. */
  public exibirPainelLogin():void{
    this.exibirPainel.emit('login');
  }


  /* 
    Cadastrando usuario no banco de dados (a partir de auth.service).
    Em caso de sucesso, trocamos o painel de 'cadastrar' para 'login', como uma forma de indicar
  que o processo ocorreu sem erros, além de emitir um alerta de sucesso.
    Em caso de algum erro, emite um alerta informando sobre.
    Posteriormente, atualizar os alertas para algo visualmente mais agradavel.
  */
  public cadastrarUsuario():void {
    let usuario:Usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.nome_completo,
      this.formulario.value.nome_usuario,
      this.formulario.value.senha
    )

    this.autenticacao.cadastrarUsuario(usuario)
      .then( ()=> { 
        this.exibirPainelLogin(); 
        alert("Usuario cadastrado com sucesso!");
      })
      .catch( (erro:any) => { alert(erro.message) })
  }
}
