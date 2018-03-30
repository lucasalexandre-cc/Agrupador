import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './acesso/usuario.model';
import * as firebase from 'firebase';

/* 
    Servico para intermediar as operacoes da aplicacao com o banco de dados ('firebase')
*/

@Injectable() //Interacao entre 'auth.service' e 'auth-guard.service'
export class Autenticacao{
    
    public token_id:string;

    constructor(private router:Router){}

    /* 
        Cadastrando usuario no banco de dados (na Autentication e na Database).
    */
    public cadastrarUsuario(usuario: Usuario):Promise<any> {
        return new Promise( (resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
                .then((resposta:any) => {
                    delete usuario.senha;
                    firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                        .set(usuario);
                    resolve();
                })
                .catch((erro:Error) => {
                    reject(erro);
                })
        }) 
    }


    /* 
        Fazer a autenticacao de login do usuario e redireciona-lo para home em caso de sucesso.
    */
    public autenticar(email:string, senha:string):Promise<any> {
        return new Promise( (resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta:any) => firebase.auth().currentUser.getIdToken()
                    .then((idToken:string) => {
                        this.token_id = idToken;
                        localStorage.setItem('idToken', idToken);
                        this.router.navigate(['/home']);
                        resolve()
                    })
            )
            .catch((erro:Error) => {
                reject(erro);
            })
        } )
    }


    /* 
        Verificando se o usuario está autenticado.
        Retorna 'true' se o usuario estiver autenticado.    
        Caso contrario, redireciona a pagina para o painel de acesso.
    */
    public autenticado():boolean{
        if(this.token_id === undefined && localStorage.getItem('idToken') !== null){
            this.token_id = localStorage.getItem('idToken');
        }
        if(this.token_id === undefined){
            this.router.navigate(['/']);
        }
        return this.token_id !== undefined;
    }
    

    /* 
        Logica para o logout.
    */
    public sair():void {
        firebase.auth().signOut()   //Desconectando no firebase
            .then( () => {  
                localStorage.removeItem('idToken'); //Removendo do cache
                this.token_id = undefined;
                this.router.navigate(['/']);
            } )   
    }
}