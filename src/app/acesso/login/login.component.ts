import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Autenticacao } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})

export class LoginComponent implements OnInit {
  
  //Variavel usada para emitir evento para o componente pai (no caso, 'acesso').
  @Output() public exibirPainel:EventEmitter<string> = new EventEmitter<string>();

  public formulario:FormGroup = new FormGroup({
    'email': new FormControl(null),
    'senha': new FormControl(null)
  })

  constructor(private autenticacao:Autenticacao) { }

  ngOnInit() {
    
  }

  /* 
    Disparar um evento para o componente pai ('acesso') exibir o painel de cadastro. 
  */
  public exibirPainelCadastro():void {
    this.exibirPainel.emit('cadastro');
  }

  /* 
    Recebera os dados do formulario e chamara o metodo de login do servico ('auth.service')
  */
  public autenticar():void {
    this.autenticacao.autenticar(
      this.formulario.value.email,
      this.formulario.value.senha
    )
      .catch( (erro:Error) => { alert(erro.message); })
  }

}
