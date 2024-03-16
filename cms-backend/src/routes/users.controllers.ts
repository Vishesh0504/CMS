import { connectDB } from "../utils/db"
import { Request,Response, json } from "express";
import User from "../models/users.models";
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync(
    path.join(__dirname, "../../certificates/server.key"),
  );


//generate JWT token on successful sign in
async function generateJWT(userEmail:string) {
    try {
      let token = await jwt.sign(userEmail, privateKey, { algorithm: "RS256" });
      return token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

const handleSignUp= async(req:Request,res:Response)=>{
    try {
        let user;
        if(req.body)
        {
            user = req.body.user;
        }
        if(user)
        {
            await connectDB();
            if(await User.exists({ email: user.email }))
            {
                return res.status(409).json({error:"User already exists,Please Login instead"});
            }
            else{
                const newUser = await User.create({
                    email:user.email,
                    password:user.password,
                    securityQues:user.securityQues,
                    securityAnd:user.securityAns,
                    createdAt:new Date(),
                })
                res.status(200).json({message:"User successfully created,Login to continue"})
                console.log(newUser);
            }
        }
        else{
            return res.status(400).json({error:"empty user sent"});
        }
    }catch(err)
    {
        res.status(500).json({error:err})
    }
}

const handleLogIn= async(req:Request,res:Response)=>{
    try{
        const user = req.body.user;
        if(await User.exists({email:user.email}))
        {
            const existingUser= await User.findOne({email:user.email})
            const existingPass = existingUser?.password;
            const enteredPass = await bcrypt.hash(user.password,10);
            if(await bcrypt.compare(existingPass,enteredPass))
            {
                let jwtToken = await generateJWT(user.email);
                res
                .cookie('access_token',jwtToken,{secure:true,httpOnly:true,sameSite:true})
                .status(200)
                .json({message:"user successfully logged in"})
            }else{
                res.status(403).json({error:"Incorrect password provided by user"})
            }
        }else{
            res.status(400).json({error:"User doesn't exist please Sign up first"})
        }
    }catch(err){
        res.status(500).json({error:err})
    }
}

export{
    handleSignUp,handleLogIn
}