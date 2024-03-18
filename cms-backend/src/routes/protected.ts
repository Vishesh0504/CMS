import { Request,Response,NextFunction } from "express";
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const verifyAuth =(req:Request,res:Response,next:NextFunction)=>{
    const access_token = req.cookies.access_token;
    // console.log(access_token);
    if(!access_token)
    {
        return res.status(403).json({error:"User is not authorized to access"});
    }else{
        const privateKey = fs.readFileSync(
            path.join(__dirname, "../../certificates/server.key"),);
            let decodedUser = jwt.verify(access_token,  privateKey,{algorithm:'HS256'});
            req.body.user = decodedUser;
            next()
    }
}

export default verifyAuth;