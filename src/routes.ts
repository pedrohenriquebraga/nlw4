import { Router } from "express"
import { SendMailController } from "./controllers/SendMailController"
import { SurveyController } from "./controllers/SurveyController"
import { UserController } from "./controllers/UserController"

const router = Router()
const userController = new UserController()
const surveysController = new SurveyController()
const sendMailController = new SendMailController()

router.post("/users", userController.create)
router.post("/surveys", surveysController.create)
router.get("/surveys", surveysController.show)

router.post("/sendMail", sendMailController.execute)

export { router }