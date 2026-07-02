import {createWorkplaceRequest, DeleteProfileRequest, LoginManagerRequest, openWorkplaceCredsRequest, UpadateWorkplaceDataRequest, UpdateWorkplaceRequestManagerPassword, UpdateWorkplaceRequestOperatorPassword, workplaceData, type workplaceCreateCreds} from "../types/types.js"
import {v4 as uuid} from "uuid"
import httpError from "../utils/customError.js"
import jwt from "jsonwebtoken"
import { Response,Request, NextFunction } from "express"
import bcrypt from "bcrypt";
import pool from "../utils/db.js"
import { json } from "node:stream/consumers"


interface PostgresError extends Error {
    code?: string;
    detail?: string;
    constraint?: string;
}


let workplaces: workplaceData[] = []

async function createWorkplace(req:createWorkplaceRequest,res:any,next:(error:Error)=>void){

   try{

    const secretKey = process.env.SECRET_TOKEN_KEY
    const creds = req.body

    const saltRounds = 12
    const managerPasswordHashed = await bcrypt.hash(creds.managerPassword,saltRounds)
    const operatorPasswordHashed = await bcrypt.hash(creds.operatorPassword,saltRounds)

    if (creds.loginName.includes(" ")){throw new httpError("The login name cannot contain spaces!",422)}
    const newWorkplace:workplaceData = {...creds,managerPassword:managerPasswordHashed,operatorPassword:operatorPasswordHashed, id:uuid()}
    const loginNameExists = await pool.query("SELECT * FROM workplaces WHERE login_name = $1",[newWorkplace.loginName])
    if(loginNameExists.rows.length > 0){throw new httpError("This login name is already being used!",422)}

    const insertWorkplace = await pool.query("INSERT INTO workplaces (id,manager_password,operator_password,company_name,login_name) values ($1,$2,$3,$4,$5) RETURNING *",
        [newWorkplace.id,newWorkplace.managerPassword,newWorkplace.operatorPassword,newWorkplace.companyName,newWorkplace.loginName])
    
    const insertedWorkplace = insertWorkplace.rows[0]
    
    const workplaceCreatedInfo:Partial<Omit<workplaceData,"managerPassword"|"operatorPassword">> = {companyName:insertedWorkplace.company_name,loginName:insertedWorkplace.login_name,id:insertedWorkplace.id} 
    const token = jwt.sign(workplaceCreatedInfo,secretKey!,{expiresIn:"24h"})

    res.status(201).json({message:"workplace created",data:workplaceCreatedInfo, token:token})
   }catch(error){
    if(error instanceof httpError){
        return next(new httpError(error.message,error.status))
    }else if(error instanceof Error){
        return next(Error("Error creating the workplace"))
    }
   }   
}

async function openWorkplace(req:openWorkplaceCredsRequest,res:any,next:(error:Error)=>void){
try{
const secretKey = process.env.SECRET_TOKEN_KEY
const creds = req.body

const workplaceExists = await pool.query("SELECT * FROM workplaces WHERE login_name = $1",[creds.loginName])

if(workplaceExists.rows.length < 1){throw new httpError("Wrong name or password",401)}
const workplace = workplaceExists.rows[0]
const storedPassword = workplace.operator_password

const passwordIscorrect = await bcrypt.compare(creds.operatorPassword,storedPassword)
if(!passwordIscorrect){throw new httpError("Wrong name or password",401)}

const workplaceInfo:Partial<Omit<workplaceData,"managerPassword"|"operatorPassword">> = {companyName:workplace.company_name,loginName:workplace.login_name,id:workplace.id} 
const token = jwt.sign(workplaceInfo,secretKey!,{expiresIn:"24h"})

res.status(200).json({message:"Logged in successfully",data:workplaceInfo, token:token})
}catch(error){
if(error instanceof httpError){
    return next(new httpError(error.message,error.status))
}else if(error instanceof Error){
    return next(Error(error.message))
}else{
    return next(Error("Internal error"))
}
}
    
}

async function loginManager(req:Request,res:Response,next:NextFunction){
   try{
        const customReq = req as LoginManagerRequest
        const {companyId,password} = req.body
     if(customReq.workplace.id !== companyId){throw new httpError("Not authorized",401)}   

     const workplaceExists = await pool.query("SELECT * FROM workplaces WHERE id = $1",[companyId])

    if(workplaceExists.rows.length<1){
        throw new httpError("Wrong data",401)
    }

     const workplace = workplaceExists.rows[0]   

    
    const passwordIsCorrect =await bcrypt.compare(password,workplace.manager_password)
    if(!passwordIsCorrect){throw new httpError("Wrong password",401)}

    const managerInfo = {role:"manager",workplace:customReq.workplace.id,}

    const managerToken = jwt.sign(managerInfo,process.env.SECRET_TOKEN_KEY!,{expiresIn:"1h"})

    res.status(200).json({message:"Manager logged in successfully",token:managerToken})
   }catch(error){
    console.log(error)
    if(error instanceof httpError){
        return next(new httpError(error.message,error.status))
    }else if(error instanceof Error){
        return next(error)
    }
   }
    

}

function verifySession(req:Request,res:Response,next:NextFunction){
    const secret = process.env.SECRET_TOKEN_KEY
    try{
        const bearerToken = req.headers["authorization"]
        const tokenSplit = bearerToken?.split(" ")
        const token = tokenSplit![1]
        const decoded = jwt.verify(token,secret!)
        res.status(200).json({message:"sessão ativa"})
    }catch(error){
        if(error instanceof jwt.TokenExpiredError){
            return next(new httpError("Session expired",409))
        }else if(error instanceof Error){
            return next(error)
        }else{
            return next(new httpError("Internal error",401))
        }
    }
    
}


async function updateWorkplaceData(req:Request,res:Response,next:NextFunction){
    
    const customReq = req as UpadateWorkplaceDataRequest

    try{
        if(customReq.workplace.id !== customReq.managerAuth.workplace){throw Error("Not authorized")}
     const {companyName,loginName} = req.body
    if (loginName.includes(" ")){throw new httpError("The login name cannot contain spaces",422)}
   const workplace = await pool.query("SELECT * FROM workplaces WHERE id = $1",[customReq.workplace.id])
    if(workplace.rows.length<1){return next(new httpError("Data not found",404))}
    const loginNameExists = await pool.query("SELECT * FROM workplaces WHERE login_name = $1",[loginName])
    if(loginNameExists.rows.length>0 && workplace.rows[0].id !== customReq.workplace.id){throw new httpError("This login name is already being used!",422)}
        try{
        await pool.query("UPDATE workplaces SET company_name = $1, login_name = $2 WHERE id = $3",[companyName,loginName,customReq.workplace.id])
        }catch(rawError){
            const error = rawError as PostgresError;
                if(error.code){
        switch (error.code) {
            case "23505":
                return res.status(400).json({ message: "This login name is already being used" });
            case "23502":
                return res.status(400).json({ message: "All fields have to be filled!" });
            default:
                return res.status(500).json({ message: `Internal error` });
        }
    
            }
            
        }
    
    res.status(200).json({message:"Informações atualizadas",data:{companyName:companyName,loginName:loginName,id:customReq.workplace.id}})
    }catch(error){
        
        if(error instanceof Error){
            return next(new httpError(error.message,401))
        }else{
            return next(new httpError("Not authorized",401))
        }
    }
    
    }

 async function updateManagerPassword(req:Request,res:Response,next:NextFunction){
    const customReq = req as UpdateWorkplaceRequestManagerPassword
    try{
        if(customReq.workplace.id !== customReq.managerAuth.workplace){throw new httpError("Not authorized",401)}
     
        const response = await pool.query("SELECT * FROM workplaces WHERE id = $1",[customReq.workplace.id])
        if(response.rows.length<1){throw new httpError("Data not found",422)}
        const workplace = response.rows[0]

        const passwordIsCorrect = await bcrypt.compare(customReq.body.currentManagerPassword,workplace.manager_password)
        if(!passwordIsCorrect){throw new httpError("Wrong password",401)}

        const saltRounds = 12;
        const newHash = await bcrypt.hash(customReq.body.newManagerPassword,saltRounds)
           
        await pool.query("UPDATE workplaces SET manager_password = $1 WHERE id = $2",[newHash,customReq.workplace.id])
   
        res.status(200).json({message:"Password updated successfully"})      
    }catch(error){
        console.log(error)
        if(error instanceof httpError){
            return next(new httpError(error.message,error.status))
        }else if(error instanceof Error){return next(new httpError(error.message,422))
        }else{
            return next(new httpError("Data not found",422))
        }
    }

 } 
 
 async function updateOperatorPassword(req:Request,res:Response,next:NextFunction){
    const customReq = req as UpdateWorkplaceRequestOperatorPassword
    try{
        if(customReq.workplace.id !== customReq.managerAuth.workplace){throw new httpError("Not authorized",401)}

    const response = await pool.query("SELECT * FROM workplaces WHERE id = $1",[customReq.workplace.id])
        if(response.rows.length<1){throw new httpError("Data not found",422)}
        const workplace = response.rows[0]

        const passwordIsCorrect = await bcrypt.compare(customReq.body.currentOperatorPassword,workplace.operator_password)
        if(!passwordIsCorrect){throw new httpError("Wrong password",401)}

        const saltRounds = 12
        const newHash = await bcrypt.hash(customReq.body.newOperatorPassword,saltRounds)

        await pool.query("UPDATE workplaces SET operator_password = $1 WHERE id = $2",[newHash,customReq.workplace.id])

        res.status(200).json({message:"Updated password"})      
    }catch(error){
        if(error instanceof httpError){
            return next(new httpError(error.message,error.status))
        }else if(error instanceof Error){return next(new httpError(error.message,422))
        }else{
            return next(new httpError("Internal error",422))
        }
    }
 }

 function managerSession(req:Request,res:Response,next:NextFunction){

    res.status(200).json({message:"Active session"})
 }

 async function deleteProfile(req:Request,res:Response,next:NextFunction){
    const customReq = req as DeleteProfileRequest
    try{
        if(customReq.managerAuth.workplace !== customReq.workplace.id){
            throw new httpError("Not authorized",401)
    }
    await pool.query("DELETE FROM workplaces WHERE id = $1",[customReq.workplace.id]);
    res.status(200).json({message:"Profile deleted"})
    }catch(error){
        return next(error)
    }
    
 }



export {createWorkplace, openWorkplace,loginManager, verifySession, updateWorkplaceData, updateManagerPassword, updateOperatorPassword,managerSession, deleteProfile}