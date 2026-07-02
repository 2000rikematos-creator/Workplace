import express, { Router } from "express";
import * as operatorControllers from "../controllers/operatorControllers.js"
import { body } from "express-validator";
import errorsValidation from "../middleware/errorsValidation.js";
import managerAuthorization from "../middleware/managerAuthorization.js";
const router = Router()


router.get("/all",operatorControllers.getAllOperators)
router.use(managerAuthorization)
router.post("/add",[body("firstName").notEmpty().withMessage("Please fill the first name").trim(),
    body("lastName").trim().notEmpty().withMessage("Please fill the last name"), body("phone").notEmpty().withMessage("Please fill the phone number").trim()],errorsValidation,operatorControllers.addOperator)
router.delete("/delete/:id", operatorControllers.deleteOperator)
router.patch("/edit/:id",[body("firstName").notEmpty().withMessage("Please fill the first name").trim(),
    body("lastName").trim().notEmpty().withMessage("Please fill the last name"), body("phone").notEmpty().withMessage("Please fill the phone number").trim()],errorsValidation,operatorControllers.editOperator)


export default router