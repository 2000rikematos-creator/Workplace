import {ManagerAuthResponse,ActiveTaskRequest, ActiveTasks,ActiveTasksWithData, AuthMiddlewareRequest, EndActiveTaskRequest, FinishedTasks, GetFinishedTasksRequest } from "../types/types.js";
import { Request,Response,NextFunction } from "express";
import { v4 as uuid } from "uuid";
import httpError from "../utils/customError.js";
import pool from "../utils/db.js";
import { finished } from "node:stream";


async function getAllActiveTasks(req:Request,res:Response,next:NextFunction){
    const customReq = req as AuthMiddlewareRequest
    try{
    const joined = await pool.query(`SELECT internal_number AS "internalNumber", active_tasks.id AS "id",active_tasks.operator_id AS "operatorId", active_tasks.task_id AS "taskId",active_tasks.time_start AS "timeStart", active_tasks.workplace_id AS "workplaceId", operators.first_name AS "operatorFirstName", operators.last_name AS "operatorLastName", tasks.task AS "taskName" FROM active_tasks INNER JOIN operators ON active_tasks.operator_id = operators.id INNER JOIN tasks ON active_tasks.task_id = tasks.id WHERE active_tasks.workplace_id = $1`,[customReq.workplace.id])
    const correspondingActiveTasks:ActiveTasksWithData[] = joined.rows

    res.status(200).json({message:"success", data:correspondingActiveTasks})
    }catch(error){
        return next(new httpError("Internal error",500))
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
    const customReq = req as GetFinishedTasksRequest
    const optionInSeconds = (parseInt(customReq.params.option)*60)*60
    const nowInSeconds = Math.floor(Date.now() / 1000)
    const timeIntervalInSeconds = nowInSeconds - optionInSeconds
    const timeIntervalInMillieSeconds = timeIntervalInSeconds *1000
    console.log(timeIntervalInMillieSeconds)
    try{
        if(customReq.workplace.id !== customReq.managerAuth.workplace){throw new httpError("Not authorized",401)}
        const response = await pool.query(`SELECT finished_tasks.id AS "id", operators.first_name AS "firstName", operators.last_name AS "lastName", operators.internal_number AS "internalNumber", tasks.task AS "task", finished_tasks.time_start AS "timeStart", finished_tasks.time_end AS "timeEnd" FROM finished_tasks INNER JOIN tasks ON tasks.id = finished_tasks.task_id INNER JOIN operators ON operators.id = finished_tasks.operator_id WHERE finished_tasks.workplace_id = $1 AND finished_tasks.time_end > $2 ORDER BY finished_tasks.time_end DESC`,[customReq.workplace.id,timeIntervalInMillieSeconds])
        const finishedTasks = response.rows
        console.log(finishedTasks)
        res.status(200).json({message:"Success",data:finishedTasks})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal error"})
    }
}

async function getCurrentTime(req:Request,res:Response,next:NextFunction) {
    const currentTime = Date.now();
    res.status(200).json({message:"success",data:currentTime}) 
}

export {getAllActiveTasks, addActiveTask, endActiveTask,getFinishedTasks, getCurrentTime}

