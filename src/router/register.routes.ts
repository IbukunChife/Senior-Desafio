import { Router } from "express";
import { RegisterController } from "../controller/register/RegisterController";

const registerRoutes = Router();
const registerContoller = new RegisterController();

registerRoutes.post("/point", registerContoller.handle);

export { registerRoutes };
