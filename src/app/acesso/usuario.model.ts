/* 
  Usado no componente cadastro, como boa pratica de programacao.
  Nada mais é que uma classe para o retorno do resultado do formulario.
*/

export class Usuario {
    constructor(
      public email:string,
      public nome_completo:string,
      public nome_usario:string,
      public senha:string
    ){}
}