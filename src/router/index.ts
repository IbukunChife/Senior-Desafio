import {Router, Request, Response} from "express";
import {registerRoutes} from "./register.routes"

const router = Router()
router.use("/register",registerRoutes)
router.use("/",(request: Request, response: Response) =>{
  console.log('funcionando')
  response.send("funcionado")
})

export {router};