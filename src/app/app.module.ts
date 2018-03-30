import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { Autenticacao } from './auth.service';
import { ROUTES } from './app.routes';
import { AutenticacaoGuard } from './auth-guard.service';
import { Bd } from './bd.service';

import { AppComponent } from './app.component';
import { AcessoComponent } from './acesso/acesso.component';
import { BannerComponent } from './acesso/banner/banner.component';
import { LoginComponent } from './acesso/login/login.component';
import { CadastroComponent } from './acesso/cadastro/cadastro.component';
import { HomeComponent } from './home/home.component';
import { IncluirGrupoComponent } from './home/incluir-grupo/incluir-grupo.component';


@NgModule({
  declarations: [
    AppComponent,
    AcessoComponent,
    BannerComponent,
    LoginComponent,
    CadastroComponent,
    HomeComponent,
    IncluirGrupoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, //Modulo para animacao
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES), //Configurando as rotas de acesso
    HttpModule
  ],
  providers: [ Autenticacao, AutenticacaoGuard, Bd ],
  bootstrap: [AppComponent]
})
export class AppModule { }
