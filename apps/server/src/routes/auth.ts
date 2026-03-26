import { Router } from "express";
import { validate } from "../middleware/validate";
import { getMe, login, loginSchema, register, registerSchema } from "../controllers/authController";

const authRouter=Router();

authRouter.post('/register',validate(registerSchema),register);
authRouter.post('/login',validate(loginSchema),login);
authRouter.get('/me',getMe);

export default authRouter;