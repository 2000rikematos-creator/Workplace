import { Router } from "express"
import managerAuthorization from "../middleware/managerAuthorization.js"
import auth from "../middleware/authorization.js"
import { RequestHandler } from "express"
import * as allowedDevicesControllers from "../controllers/allowedDevicesControllers.js"
import { body } from "express-validator"
import errorsValidation from "../middleware/errorsValidation.js"


const router = Router()

router.post("/add-device",[body("name").trim().notEmpty().withMessage("Please name this device")],errorsValidation,allowedDevicesControllers.addDeviceFingerprint)


router.post("/verify-device",allowedDevicesControllers.verifyDeviceFingerprint)

router.use(auth as RequestHandler)


router.use(managerAuthorization)


router.get("/all",allowedDevicesControllers.getAllAllowedDevices)
router.delete("/delete/:id",allowedDevicesControllers.deleteAllowedDevice)

export default router