import express, { Router } from "express";
import * as operatorControllers from "../controllers/operatorControllers.js"
import { body } from "express-validator";
import errorsValidation from "../middleware/errorsValidation.js";
import managerAuthorization from "../middleware/managerAuthorization.js";
const router = Router()


router.get("/all",operatorControllers.getAllOperators)
router.use(managerAuthorization)
router.post("/add",[body("firstName").notEmpty().withMessage("O primeiro nome é obrigatório").trim(),
    body("lastName").trim().notEmpty().withMessage("O apelido é obrigatório"), body("phone").notEmpty().withMessage("O número de telefone é obrigatório").trim().isMobilePhone("pt-PT").withMessage("Número de telefone não é válido")],errorsValidation,operatorControllers.addOperator)
router.delete("/delete/:id", operatorControllers.deleteOperator)
router.patch("/edit/:id",[body("firstName").notEmpty().withMessage("O primeiro nome é obrigatório").trim(),
    body("lastName").trim().notEmpty().withMessage("O apelido é obrigatório"), body("phone").notEmpty().withMessage("O número de telefone é obrigatório").trim().isMobilePhone("pt-PT").withMessage("Número de telefone não é válido")],errorsValidation,operatorControllers.editOperator)


export default router