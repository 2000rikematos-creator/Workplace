import {type EditOperatorRequest,type addOperatorType,type AuthMiddlewareRequest, type Operator, DeleteOperatorType} from "../types/types.js"
import { Response,Request, NextFunction, RequestHandler } from "express"
import httpError from "../utils/customError.js"
import { v4 as uuid} from "uuid"
import pool from "../utils/db.js"





async function getAllOperators(req:Request,res:Response,next:NextFunction){
    try{
    const customReq = req as AuthMiddlewareRequest
    const correspondingWorkplaceOperators = await pool.query(`SELECT id, first_name AS "firstName",last_name AS "lastName",phone AS "phone",workplace_id AS "workplaceId",internal_number AS "internalNumber" FROM operators WHERE workplace_id = $1`,[customReq.workplace.id])
    res.status(200).json({message:"success",data:correspondingWorkplaceOperators.rows})
    }catch(error){
        return next(error)
    }
}

async function addOperator(req:Request,res:Response,next:NextFunction){
const customReq = req as addOperatorType
    try{
    if(customReq.workplace.id !== customReq.managerAuth.workplace){throw new httpError("Não autorizado",401)}    
    const operatorData = req.body
    const correspondingWorkplace = await pool.query("SELECT * FROM operators WHERE workplace_id = $1",[customReq.workplace.id])
    const operators = correspondingWorkplace.rows
   
    const internalNumber = operators.length === 0 ? 1 : Math.max(...operators.map((op)=> op.internal_number)) + 1
   

    const newOperator:Operator = {...operatorData,id:uuid(),workplaceId:customReq.workplace.id,internalNumber:internalNumber}
        
    const insertOperator = await pool.query("INSERT INTO operators (id,first_name,last_name,phone,workplace_id,internal_number) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [newOperator.id,newOperator.firstName,newOperator.lastName,newOperator.phone,newOperator.workplaceId,newOperator.internalNumber])
    
    res.status(201).json({message:"Novo colaborador adicionado", data:newOperator})
    }catch(error){
        return next(error)
    }
    
}

async function deleteOperator(req:Request,res:Response,next:NextFunction){
    const customReq = req as DeleteOperatorType
    try{
        if(customReq.workplace.id !== customReq.managerAuth.workplace){throw new httpError("Não autorizado",401)}
        const id = req.params.id
        const operatorIsActive = await pool.query("SELECT * FROM active_tasks where operator_id = $1",[id])
        if(operatorIsActive.rows.length>0){throw new httpError("Por favor termine primeiro a tarefa ativa deste colaborador!",422)}
        const operatorExists = await pool.query("SELECT * FROM operators WHERE id = $1",[id])
        if(operatorExists.rows.length<1){throw new httpError("Operador não encontrado",404)}
         await pool.query("DELETE FROM operators WHERE id = $1",[id])
        res.status(200).json({message:"Colaborador eliminado"})
    }catch(error){
        return next(error)
    }
    
}

async function editOperator(req:Request,res:Response,next:NextFunction){
const customReq = req as EditOperatorRequest
try{
    if(customReq.workplace.id !== customReq.managerAuth.workplace){throw new httpError("Não autorizado",401)}
const id = req.params.id
    const {firstName,lastName,phone} = req.body
    const operatorExists = await pool.query("SELECT * FROM operators WHERE id = $1",[id])
        if(operatorExists.rows.length<1){throw new httpError("Operador não encontrado",404)}
    const updated = await pool.query("UPDATE operators SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4 RETURNING *",[firstName,lastName,phone,id])
    const data = updated.rows[0]
    
    const updatedData:Operator = {firstName:data.first_name,lastName:data.last_name,phone:data.phone,id:data.id,internalNumber:data.internal_number,workplaceId:data.workplace_id}
    res.status(200).json({message:"Informações atualizadas", data:updatedData})
}catch(error){
    return next(error)
}
    
}

export {addOperator, getAllOperators, deleteOperator, editOperator}
