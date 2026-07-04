import {ManagerAuthResponse,ActiveTaskRequest, ActiveTasks,ActiveTasksWithData, AuthMiddlewareRequest, EndActiveTaskRequest, FinishedTasks } from "../types/types.js";
import { Request,Response,NextFunction } from "express";
import { v4 as uuid } from "uuid";
import httpError from "../utils/customError.js";
import pool from "../utils/db.js";

let finishedTasks:FinishedTasks[] = []

async function getAllActiveTasks(req:Request,res:Response,next:NextFunction){
    const customReq = req as AuthMiddlewareRequest
    try{
    const joined = await pool.query(`SELECT internal_number AS "internalNumber", active_tasks.id AS "id",active_tasks.operator_id AS "operatorId", active_tasks.task_id AS "taskId",active_tasks.time_start AS "timeStart", active_tasks.workplace_id AS "workplaceId", operators.first_name AS "operatorFirstName", operators.last_name AS "operatorLastName", tasks.task AS "taskName" FROM active_tasks INNER JOIN operators ON active_tasks.operator_id = operators.id INNER JOIN tasks ON active_tasks.task_id = tasks.id WHERE active_tasks.workplace_id = $1`,[customReq.workplace.id])
    const correspondingActiveTasks:ActiveTasksWithData[] = joined.rows

    res.status(200).json({message:"success", data:correspondingActiveTasks})
    }catch(error){
        return next(error)
    }
    
}

async function addActiveTask(req:Request,res:Response,next:NextFunction){
    try{

    const currentTimeInMilliseconds = Date.now()
    const customReq = req as ActiveTaskRequest
    const newActiveTask:ActiveTasks = {id:uuid(),operatorId:customReq.body.operatorId,taskId:customReq.body.taskId,timeStart:currentTimeInMilliseconds,workplaceId:customReq.workplace.id}
    
    const operatorIsAlreadyActive =  await pool.query("SELECT * FROM active_tasks WHERE operator_id = $1",[newActiveTask.operatorId])
    if (operatorIsAlreadyActive.rows.length>1){throw new httpError("Termina primeiro a tarefa atual",401)}

    await pool.query("INSERT INTO active_tasks (id,operator_id,task_id,time_start,workplace_id) VALUES ($1,$2,$3,$4,$5)",
     [newActiveTask.id,newActiveTask.operatorId,newActiveTask.taskId,newActiveTask.timeStart,newActiveTask.workplaceId])

    const joined = await pool.query(`SELECT active_tasks.id AS "id",active_tasks.operator_id AS "operatorId", active_tasks.task_id AS "taskId",active_tasks.time_start AS "timeStart", active_tasks.workplace_id AS "workplaceId", operators.first_name AS "operatorFirstName", operators.last_name AS "operatorLastName", tasks.task AS "taskName" FROM active_tasks INNER JOIN operators ON active_tasks.operator_id = operators.id INNER JOIN tasks ON active_tasks.task_id = tasks.id WHERE active_tasks.operator_id = $1 AND active_tasks.task_id = $2`,
        [newActiveTask.operatorId,newActiveTask.taskId])
        

    res.status(201).json({message:"New task added",data:joined.rows[0]})
    }catch(error){
       return next(error)
    }
   
}

async function endActiveTask(req:EndActiveTaskRequest,res:Response,next:NextFunction){
   
   try{
 const id = req.params.id
    const {timeEnd} = req.body
    const activeTaskResponse = await pool.query("SELECT * FROM active_tasks WHERE id = $1",[id])
    const activeTask = activeTaskResponse.rows[0];
    const finishedTask:FinishedTasks = {id,operatorId:activeTask.operator_id,
        taskId:activeTask.task_id,
        workplaceId:activeTask.workplace_id,
        timeStart:activeTask.time_start,
        timeEnd}
    await pool.query("INSERT INTO finished_tasks (id,operator_id,task_id,workplace_id,time_start,time_end) values($1,$2,$3,$4,$5,$6)",[finishedTask.id,finishedTask.operatorId,finishedTask.taskId,finishedTask.workplaceId,finishedTask.timeStart,finishedTask.timeEnd])

    await pool.query("DELETE FROM active_tasks WHERE id = $1",[id])
    
    res.status(200).json({message:"Task deleted successfully"})
   }catch(error){
    return next(error)
   }
   
}

async function getFinishedTasks(req:Request,res:Response,next:NextFunction){
    const customReq = req as ManagerAuthResponse
    try{
        if(customReq.workplace.id !== customReq.managerAuth.workplace){throw new httpError("Not authorized",401)}
        const response = await pool.query("SELECT * FROM finished_tasks WHERE workplace_id = $1",[customReq.workplace.id])
        console.log(response.rows)
    }catch(error){
        console.log(error)
    }
}

export {getAllActiveTasks, addActiveTask, endActiveTask,getFinishedTasks}

