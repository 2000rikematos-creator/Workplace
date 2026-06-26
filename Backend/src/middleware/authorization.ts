import {NextFunction, Request,Response} from "express"
import {type token as tokenType } from "../types/types.js"
import jwt from "jsonwebtoken"
import httpError from "../utils/customError.js"
import { AuthMiddlewareRequest } from "../types/types.js"
import dotenv from "dotenv"

dotenv.config()

function auth(req:AuthMiddlewareRequest,res:Response,next:NextFunction){
    const secret = process.env.SECRET_TOKEN_KEY
    try{
        const bearerToken = req.headers["authorization"]
       if(!bearerToken){throw Error("sessão não existe")}
        const tokenSplit = bearerToken.split(" ")
        const token = tokenSplit[1]
        const decoded = jwt.verify(token,secret!)
        const customReq = req as AuthMiddlewareRequest
        customReq.workplace = decoded as tokenType
        next()
    }catch(error){
        if(error instanceof jwt.TokenExpiredError){
            return next(new httpError("sessão expirada",401))
        }else if(error instanceof Error){
            return next(error)
        }else{
            return next(new httpError("ocorreu um erro, por favor inicie sessão novamente",401))
        }
        
    }
}


export default auth