import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Autenticacao } from './auth.service';

/* 
    Servico de autenticacao para acesso a rota '/home'.
    So vai conseguir acessar quem estiver logado.
*/

@Injectable()
export class AutenticacaoGuard implements CanActivate{

    constructor(private autenticacao:Autenticacao){}

    /* 
        Liberando (ou nao) acesso a pagina principal.
        Vai fazer a interacao com o servico 'auth.service.ts', por isso do 'Injectable()'
    */
    canActivate():boolean {
        return this.autenticacao.autenticado();
    }
}