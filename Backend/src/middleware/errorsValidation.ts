import { Express, NextFunction,Request,Response } from "express";
import { validationResult } from "express-validator";
import httpError from "../utils/customError.js";

function errorsValidation(req:Request,res:Response,next:NextFunction){
    const errors = validationResult(req)
    const errorsArray = errors.array()
    if(!errors.isEmpty()){return next(new httpError(errorsArray[0].msg,409))}
    next()
}

export default errorsValidation