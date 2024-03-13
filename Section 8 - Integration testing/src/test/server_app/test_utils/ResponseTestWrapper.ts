import {HTTP_CODES} from "../../../app/model/ServerModel";

export class ResponseTestWrapper {

    public statusCode :HTTP_CODES;
    public headers = new Array<object>()
    public body:object;

    public writeHead(statusCode:HTTP_CODES,header:object){
        this.statusCode = statusCode
        this.headers.push(header)
    }
    public write(stringifiesBody:string){
        this.body = JSON.parse(stringifiesBody)
    }
    public end(){

    }
    public clearFields(){
        this.statusCode=undefined
        this.body=undefined
        this.headers.length =0
    }
}