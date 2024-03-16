import { handleLogIn, handleSignUp,handleForgotPassword} from "./users.controllers";

const {Router} = require("express");

const authRouter = Router();

authRouter.post('/signup',handleSignUp);
authRouter.post('/login',handleLogIn);

authRouter.post('/forgotPassword',handleForgotPassword);

export{authRouter}