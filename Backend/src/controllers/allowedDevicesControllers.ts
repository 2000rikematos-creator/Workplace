import {Request,Response, NextFunction } from "express";
import { addDeviceRequest, AllowedDevices, AuthMiddlewareRequest, RemoveAllowedDevice, verifyDeviceRequest } from "../types/types.js";
import pool from "../utils/db.js";
import httpError from "../utils/customError.js";
import { v4 as uuid } from "uuid";

async function verifyDeviceFingerprint(req: Request,res: Response,next: NextFunction){
  const customReq = req as verifyDeviceRequest;
  
  try{
    const response = await pool.query("SELECT * FROM allowed_devices WHERE company_id = $1 AND fingerprint = $2",[customReq.body.companyId,customReq.body.fingerprint])
    if(response.rows.length<1){
      throw new httpError("Device not allowed",401)
    }
  }catch(error){
    if(error instanceof Error){
      return next(new Error(error.message))
    }
    
  }
  res.status(200).json({ message: "Device allowed" });
}

async function addDeviceFingerprint(req:Request,res:Response,next:NextFunction) {
const customReq = req as addDeviceRequest
const device = {id:uuid(),fingerprint:customReq.body.fingerprint,companyId:customReq.body.companyId,name:customReq.body.name}
try{
  await pool.query("INSERT INTO allowed_devices (id,fingerprint,name,company_id) values ($1,$2,$3,$4)",[device.id,device.fingerprint,device.name,device.companyId])
}catch(error){
  return next(new httpError("Internal Error",500))
}
  res.status(200).json({message:"Device added"})
}

async function getAllAllowedDevices(req:Request,res:Response,next:NextFunction){
  const customReq = req as AuthMiddlewareRequest
  try{
    const response = await pool.query("SELECT id,name,fingerprint FROM allowed_devices WHERE company_id = $1",[customReq.workplace.id])
    const allowedDevices:AllowedDevices[] = response.rows
    res.status(200).json({data:allowedDevices,message:"success"})
  }catch(error){
    return next(new httpError("Internal Error",500))
  }
}

async function deleteAllowedDevice(req:Request,res:Response,next:NextFunction){
  
  const customReq = req as RemoveAllowedDevice
   const {id} = customReq.params
   const workplace = customReq.workplace.id

    try{
        await pool.query("DELETE FROM allowed_devices WHERE id = $1 AND company_id = $2",[id,workplace])
        res.status(200).json({message:"Removed successfully"})
    }catch(error){
        return next(new httpError("Internal error",500))
    }
}

export {
    deleteAllowedDevice,
    addDeviceFingerprint,
    getAllAllowedDevices,
    verifyDeviceFingerprint
}