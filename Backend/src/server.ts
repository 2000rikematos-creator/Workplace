import dotenv from 'dotenv';
dotenv.config();

import express, {Request,Response, NextFunction } from "express";
import settingsRoutes from "./routes/settingsRoutes.js"
import operatorRoutes from "./routes/operatorRoutes.js"
import activeTasksRoutes from "./routes/activeTasksRoutes.js"
import tasksRoutes from "./routes/tasksRoutes.js"
import cors from "cors";
import httpError from "./utils/customError.js";
import auth from './middleware/authorization.js';
import { body } from 'express-validator';
import errorsValidation from './middleware/errorsValidation.js';
import * as allowedDevicesControllers from "./controllers/allowedDevicesControllers.js"
import allowedDevicesRoutes from "./routes/allowedDevicesRoutes.js"



const port = process.env.PORT
const app = express()


const frontendURL = process.env.FRONTEND_URL;


app.use(cors({ origin: frontendURL }));
app.use(express.json())


app.use("/allowed-devices",allowedDevicesRoutes)
app.use("/settings",settingsRoutes)

app.use(auth as express.RequestHandler)
app.use("/operators",operatorRoutes)
app.use("/tasks",tasksRoutes)
app.use("/active-tasks",activeTasksRoutes)


app.use((error:httpError|Error,req:Request,res:Response,next:NextFunction)=>{
    console.log(error)
    const statusCode = error instanceof httpError ? error.status : 500
    const errorMessage = error.message || "algo correu mal"
    res.status(statusCode).json({message:errorMessage})
})

app.listen(port,()=>{console.log(`server running on port ${port}`)})