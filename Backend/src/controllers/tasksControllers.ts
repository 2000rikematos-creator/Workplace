import { Request,Response,NextFunction } from "express";
import { addTaskRequest, AuthMiddlewareRequest, deleteTaskRequest, Task } from "../types/types.js";
import httpError from "../utils/customError.js";
import { v4 as uuid } from "uuid";
import { header, validationResult } from "express-validator";
import pool from "../utils/db.js";




async function getAllTasks(req:Request,res:Response,next:NextFunction){
    const customReq = req as AuthMiddlewareRequest
    try{
        const response = await pool.query("SELECT id AS id, task AS task, workplace_id AS workplaceId FROM tasks WHERE workplace_id = $1",[customReq.workplace.id])
        const tasks = response.rows
        res.status(200).json({message:"retrieved sucessfully",data:tasks})
    }catch(error){
        return next(error)
    }
   
}

async function addNewTask(req:Request,res:Response,next:NextFunction){
    const customReq = req as addTaskRequest
    try{
        if(customReq.workplace.id !== customReq.managerAuth.workplace){throw Error("Não autorizado")}
    const taskExists = await pool.query("SELECT * from tasks where task = $1 AND workplace_id = $2",[customReq.body.task,customReq.workplace.id])
        if(taskExists.rows.length>0){throw new httpError("Já existe uma tarefa com esse nome",422)}
    const newtask:Task = {task:req.body.task, id:uuid(), workplaceId:customReq.workplace.id}
     await pool.query("INSERT INTO tasks (task,id,workplace_id) VALUES($1,$2,$3)",[newtask.task,newtask.id,newtask.workplaceId]) 
    res.status(201).json({message:"Nova tarefa adicionada", data:newtask})
    }catch(error){
        return next(error)
    }
    

}

async function deleteTask(req:Request,res:Response,next:NextFunction){
const customReq = req as deleteTaskRequest

    try{
    if(customReq.workplace.id !== customReq.managerAuth.workplace){throw Error("Não autorizado")}
    const id = customReq.params.id
        const taskExists = await pool.query("SELECT * from tasks where id = $1 AND workplace_id = $2",[id,customReq.workplace.id])
        const taskIsActive = await pool.query("SELECT * from active_tasks WHERE task_id = $1",[id])
    if(taskIsActive.rows.length>0){throw new httpError("Esta tarefa está a ser desempenhada por um ou mais colaboradores, termine primeiro!",422)}    
    if(taskExists.rows.length<1){throw new httpError("Tarefa não encontrada", 404)}
        await pool.query("DELETE FROM tasks WHERE id = $1",[id])
    res.status(200).json({message:"Tarefa eliminada"})
    }catch(error){
        return next(error)
    }
    
    
    
}

export {getAllTasks,addNewTask, deleteTask}