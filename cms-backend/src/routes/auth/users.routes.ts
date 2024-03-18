import { handleLogIn, handleSignUp,handleForgotPassword, handleEnterSecurityAns, handleResetPassword} from "./users.controllers";

const {Router} = require("express");

const authRouter = Router();

authRouter.post('/signup',handleSignUp);
authRouter.post('/login',handleLogIn);

authRouter.post('/forgotPassword',handleForgotPassword);
authRouter.post('/forgotPassword/enterAns',handleEnterSecurityAns);
authRouter.post('/forgotPassword/resetPass',handleResetPassword);

export{authRouter}