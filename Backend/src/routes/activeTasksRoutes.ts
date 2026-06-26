import { Router } from "express";
import * as activeTasksControllers from "../controllers/activeTasksControllers.js"
import { body } from "express-validator";

const router = Router()

router.get("/all",activeTasksControllers.getAllActiveTasks)
router.post("/add",activeTasksControllers.addActiveTask)
router.post("/end/:id",activeTasksControllers.endActiveTask)



export default router