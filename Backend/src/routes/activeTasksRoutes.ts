import { Router } from "express";
import * as activeTasksControllers from "../controllers/activeTasksControllers.js"
import { body } from "express-validator";
import managerAuthorization from "../middleware/managerAuthorization.js";

const router = Router()

router.get("/all",activeTasksControllers.getAllActiveTasks)
router.get("/current-time",activeTasksControllers.getCurrentTime)
router.post("/add",activeTasksControllers.addActiveTask)
router.post("/end/:id",activeTasksControllers.endActiveTask)

router.use(managerAuthorization)
router.get("/finished-tasks/:option",activeTasksControllers.getFinishedTasks)



export default router