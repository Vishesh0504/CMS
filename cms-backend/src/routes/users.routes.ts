import { handleLogIn, handleSignUp } from "./users.controllers";

const {Router} = require("express");

const authRouter = Router();

authRouter.post('/signup',handleSignUp);
authRouter.post('/login',handleLogIn);


export{authRouter}