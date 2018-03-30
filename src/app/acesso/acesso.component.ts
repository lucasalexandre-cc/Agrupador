import { Component, OnInit } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css'],
  animations:[

    //Animacao de transicao do banner (imagem da lateral esquerda)
    trigger('slide-banner', [
      state('criado', style({ opacity:1 })),
      transition('void => criado', [
        style({opacity:0, transform: 'translate(0, -50px)'}),
        animate('500ms 0s ease-in-out') //duracao, delay e aceleracao
      ])
    ]),

    //Animacao de transicao do painel (login ou cadastro da lateral direita)
    trigger('slide-painel', [
      state('criado', style({ opacity:1 })),
      transition('void => criado', [
        style({opacity:0, transform: 'translate(0, 50px)'}),
        animate('500ms 0s ease-in-out')
      ])
    ])
  ]
})

export class AcessoComponent implements OnInit {

  //Usadas na logica da animacao do painel de acesso
  public estadoBanner:string = 'criado';
  public estadoPainel:string = 'criado';

  //Usado para a troca de componente no painel (de login para cadastro e vice-versa)
  public cadastro:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  
  /* 
    Recebe um evento do componente filho 'login' ou 'cadastro'.
    Se o evento for disparado por 'login', o componente do painel sera trocado para 'cadastro'.
    Se o evento for disparado por 'cadastro', o componente do painel sera trocado para 'login'
  */
  public exibirPainel(event:string):void{
    this.cadastro = event === 'cadastro' ? true : false;
  }

}
