class httpError extends Error {
    status:number
    constructor(message:string,code:number){
        super(message);
        this.status = code
    }
}

export default httpError