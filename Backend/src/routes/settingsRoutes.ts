import { RequestHandler, Router } from "express";
import * as settingsControllers from "../controllers/settingsControllers.js"
import auth from "../middleware/authorization.js";
import managerAuthorization from "../middleware/managerAuthorization.js";
import { body } from "express-validator";
import errorsValidation from "../middleware/errorsValidation.js";

const router = Router()

router.post("/create-workplace",[body("companyName").notEmpty().withMessage("O nome da empresa é obrigatório"),body("loginName").notEmpty().withMessage("O nome para login é obrigatório e será necessário ao iniciar sessão"),body("managerPassword").notEmpty().withMessage("Por favor preencha a password do gerente").isLength({min:7}).withMessage("Password muito curta"),body("operatorPassword").notEmpty().withMessage("Por favor preencha a password do operador").isLength({min:7}).withMessage("Password muito curta")],errorsValidation,settingsControllers.createWorkplace)
router.post("/open-workplace",[body("loginName").notEmpty().withMessage("Por favor preenche o nome da empresa").isLength({min:6}).withMessage("Por questões de segurança o nome para login precisa de ser maior"),body("operatorPassword").notEmpty().withMessage("Por favor preencha a password")],errorsValidation,settingsControllers.openWorkplace)

router.use(auth as RequestHandler)

router.post("/manager",settingsControllers.loginManager)
router.get("/verify-session",settingsControllers.verifySession)

router.use(managerAuthorization)

router.get("/manager-session",settingsControllers.managerSession)

router.patch("/update/data",
    [body("companyName").notEmpty().withMessage("Por favor preencha o nome da empresa")
        .isLength({min:6}).withMessage("A palavra tem que ter um minimo de 6 caracteres")
    ,body("loginName").notEmpty().withMessage("Por favor preencha o nome para login")
    .isLength({min:6}).withMessage("A palavra tem que ter um minimo de 6 caracteres")],
    errorsValidation,settingsControllers.updateWorkplaceData)
router.patch("/update/manager-password",[body("currentManagerPassword").trim(" ").notEmpty().withMessage("Por favor preencha a palavra-passe atual"),body("newManagerPassword").trim(" ").notEmpty().withMessage("Por favor preencha a nova palavra-passe").isLength({min:7}).withMessage("Palavra passe muito curta")],errorsValidation,settingsControllers.updateManagerPassword)
router.patch("/update/operator-password",[body("currentOperatorPassword").trim(" ").notEmpty().withMessage("Por favor preencha a palavra-passe atual"),body("newOperatorPassword").trim(" ").notEmpty().withMessage("Por favor preencha a nova palavra-passe").isLength({min:7}).withMessage("Palavra passe muito curta")],errorsValidation,settingsControllers.updateOperatorPassword)

export default router