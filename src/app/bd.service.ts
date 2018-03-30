import * as firebase from 'firebase';

export class Bd {

    constructor(){}

    /* 
        Recebe um 'grupo', com seus atributos. Envia esses atributos para o banco de dados ('push').
    */
    public compartilhar(post:any):Promise<any>{
        return new Promise( (resolve, reject) => {
            firebase.database().ref(`grupos/${btoa(post.email)}`)
            .push( 
                { 
                    nome:post.nome, 
                    descricao:post.descricao, 
                    link:post.link,
                    email:post.email,
                    lat:post.latitude,
                    long:post.longitude,
                    tempo:new Date().toLocaleString()
                } 
            )
            .then( () => { resolve() } );
        } )     
        
    }


    /*
        Faz uma consulta no banco de dados, onde se retorna todos os 'grupos' cadastrados.
        Depois, executa uma logica que calcula a distancia entre o usuario logado e esses grupos.
        Retorna aqueles que estão à menos de 1km de distância.
    */
    public consultarGrupos1km(lat:number, long:number, email:string):Promise<any> {
        return new Promise( (resolve, reject) => {
            firebase.database().ref('grupos/')
            .once('value')
            .then((snapshot:any) => {

                // Organiza os dados retornados pelo firebase.
                //O dado bruto é um vetor de objetos que contem objetos dentro dele, por isso os 2 loops.
                let dado_bruto:any[] = snapshot.val();
                let dado_limpo:any[] = [];
                let keys:string[] = []
                for(let key in dado_bruto){
                    for(let key_child in dado_bruto[key]){
                        keys.push(key_child); //Gambiarra para auxiliar uma posterior possivel exclusao
                        dado_limpo.push(dado_bruto[key][key_child]);
                    }
                }
                
                /*
                    Fazendo os calculos manualmente para calcular a distancia entre o usuario e os grupos cadastrados,
                e adicionando em 'dado_final'.
                    A primeira tentativa foi usar a API do google maps, contudo o firebase
                em sua versão gratuita não permite que eu faça requisições no back. E quando tentei
                fazer diretamente pelo front, ocorre um erro de permisao que nao consegui solucionar.
                */
                let dado_final:any[] = []
                for(let i = 0; i<dado_limpo.length; i++){
                    let dist:number = this.distanciaEntreDoisPontos(lat, long,dado_limpo[i].lat, dado_limpo[i].long);
                    if(dist <= 1){
                        dado_final.push({
                            email:dado_limpo[i].email,
                            nome:dado_limpo[i].nome,
                            link:dado_limpo[i].link,
                            descricao: dado_limpo[i].descricao,
                            distancia: Math.round(dist*1000),
                            excValid: email === dado_limpo[i].email ? 1 : 0, //Validando exclusao cado o email do login for igual ao do post
                            key:keys[i],
                            valid: 1,
                            tempo:dado_limpo[i].tempo
                        })
                    }   
                }
                resolve(dado_final);//Processo finalizado
            })
            
        })   
    }


    /* 
        Apagando um grupo da base de dados
    */
    public apagarGrupo(email:string, key:string):Promise<any>{
        return new Promise( (resolve, reject) => {
            firebase.database().ref(`grupos/${btoa(email)}/`+key).remove()
            .then( () => {
                resolve();
            })
            .catch( (erro:any) => {
                reject(erro);
            } );
        } )    
    }


    /* 
        Método que só sera usado dentro do nosso proprio serviço.
        Calcula a distância entre dois pontos geoespaciais.
    */
    private distanciaEntreDoisPontos(lat1:number, long1:number, lat2:number, long2:number):number{
        var R = 6371; // Raio da terra em km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(long2-long1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; //em km
        return d;
    }
    /* Convertendo para rad. Usado em 'distanciaEntreDoisPontos()' */
    private deg2rad(deg:number):number {
        return deg * (Math.PI/180)
    }
}