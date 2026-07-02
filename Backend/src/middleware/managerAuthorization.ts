import { NextFunction, Request,RequestHandler,Response } from "express";
import httpError from "../utils/customError.js";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { ManagerMiddlewareAuth, type ManagerToken } from "../types/types.js";

function managerAuthorization(req:Request,res:Response,next:NextFunction){
    try{
        const authorization = req.headers["manager-authorization"]
    if (typeof authorization !== "string"|| !authorization){throw new Error("Not authorized")}
    const tokenSplit = authorization.split(" ")
    const token = tokenSplit[1]
    const decoded = jwt.verify(token,process.env.SECRET_TOKEN_KEY!) as ManagerToken

    if(decoded.role !== "manager"){throw Error("Not authorized")}
    const costumeReq = req as ManagerMiddlewareAuth
     costumeReq.managerAuth = decoded
    next()
    }catch(error){
        if(error instanceof jwt.TokenExpiredError){
            return next(new httpError("Manager session expired",401))
        }
       else if(error instanceof Error){
            return next(new httpError(error.message,401))
        }else{
            return next(new httpError("Not authorized",401))
        }
        
    }
    


}

export default managerAuthorization