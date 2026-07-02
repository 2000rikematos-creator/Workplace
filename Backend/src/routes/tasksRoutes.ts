import Express, { Router } from "express";
import * as tasksControllers from "../controllers/tasksControllers.js"
import auth from "../middleware/authorization.js";
import { body } from "express-validator";
import errorsValidation from "../middleware/errorsValidation.js";
import managerAuthorization from "../middleware/managerAuthorization.js";


const router = Router()


router.use(auth as Express.RequestHandler)
router.get("/all",tasksControllers.getAllTasks)
router.use(managerAuthorization)
router.post("/add",[body("task").notEmpty().withMessage("Please fill the task name")],errorsValidation,tasksControllers.addNewTask)
router.delete("/delete/:id",tasksControllers.deleteTask)

export default router