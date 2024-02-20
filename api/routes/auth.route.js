import express from "express"
import { google, signOut, signin, signup } from "../controller/auth.controller.js" //put js to avoid possible errors

const router = express.Router()

router.post("/signup",signup)
router.post("/signin",signin)
router.post("/google",google)
router.get("/signout",signOut)


export default router;