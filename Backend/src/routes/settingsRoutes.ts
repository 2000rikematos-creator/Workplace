import { RequestHandler, Router } from "express";
import * as settingsControllers from "../controllers/settingsControllers.js"
import auth from "../middleware/authorization.js";
import managerAuthorization from "../middleware/managerAuthorization.js";
import { body } from "express-validator";
import errorsValidation from "../middleware/errorsValidation.js";

const router = Router()



router.post("/create-workplace",[body("companyName").notEmpty().withMessage("Please fill the company name"),body("loginName").notEmpty().withMessage("PLease fill the staff username, it will be used to open the workplace").isLength({min:6}).withMessage("For safety reasons the staff username needs to have at least 6 characters"),body("managerPassword").notEmpty().withMessage("Please fill the manager password").isLength({min:7}).withMessage("Password too short"),body("operatorPassword").notEmpty().withMessage("Please fill the staff password").isLength({min:7}).withMessage("Password too short")],errorsValidation,settingsControllers.createWorkplace)
router.post("/open-workplace",[body("loginName").notEmpty().withMessage("Please fill the staff username"),body("operatorPassword").notEmpty().withMessage("Please fill the password")],errorsValidation,settingsControllers.openWorkplace)
router.post("/manager",settingsControllers.loginManager)

router.use(auth as RequestHandler)

router.get("/verify-session",settingsControllers.verifySession)

router.use(managerAuthorization)

router.get("/manager-session",settingsControllers.managerSession)

router.patch("/update/data",
    [body("companyName").notEmpty().withMessage("Please fill the company name")
    ,body("loginName").notEmpty().withMessage("Please fill the staff username")
    .isLength({min:6}).withMessage("For safety reasons, the staff username has to have at least 6 characters")],
    errorsValidation,settingsControllers.updateWorkplaceData)
router.patch("/update/manager-password",[body("currentManagerPassword").trim(" ").notEmpty().withMessage("Please fill the current manager password"),body("newManagerPassword").trim(" ").notEmpty().withMessage("Please fill the new manager password").isLength({min:7}).withMessage("For safety reasons the manager password needs to have at least 6 characters")],errorsValidation,settingsControllers.updateManagerPassword)
router.patch("/update/operator-password",[body("currentOperatorPassword").trim(" ").notEmpty().withMessage("Please fill the current staff password"),body("newOperatorPassword").trim(" ").notEmpty().withMessage("Please fill the new staff password").isLength({min:7}).withMessage("For safety reasons the staff password needs to have at least 6 characters")],errorsValidation,settingsControllers.updateOperatorPassword);
router.delete("/delete-profile",settingsControllers.deleteProfile)
export default router