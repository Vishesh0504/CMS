import { connectDB } from "../../utils/db"
import { Request,Response } from "express";
import User from "../../models/users.models";
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync(
    path.join(__dirname, "../../../certificates/server.key"),
  );

interface User{
    name:string;
    email:string;
}
//generate JWT token on successful sign in
async function generateJWT(user:User) {
    try {
      let token = await jwt.sign(user, privateKey, { algorithm: "RS256" });
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
            user = req.body;
            // console.log(user);
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
                    name:user.name,
                    email:user.email,
                    password:user.password,
                    securityQues:user.securityQues,
                    securityAns:user.securityAns,
                    createdAt:new Date(),
                })
                res.status(200).json({message:"User successfully created,Login to continue"})
                // console.log(newUser);
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
        const user = req.body;
        await connectDB();
        if(await User.exists({email:user.email}))
        {
            const existingUser= await User.findOne({email:user.email})
            const name = existingUser?.name
            const existingPass = existingUser?.password;
            const enteredPass = user.password
            if(await bcrypt.compare(enteredPass,existingPass))
            {
                const foundUser ={
                    name:name!,
                    email:user.email
                }
                let jwtToken = await generateJWT(foundUser);
                // console.log(foundUser)
                res.cookie('user',JSON.stringify(foundUser),{secure:false,sameSite:'lax'});
                res
                .cookie('access_token',jwtToken,{secure:false,httpOnly:true,sameSite:'lax'})
                .json({message:"user successfully logged in"})
            }else{
                res.status(403).json({error:"Incorrect password provided by user"})
            }
        }else{
            res.status(400).json({error:"User doesn't exist please Sign up first"})
        }
    }catch(err){
        console.error(err);
        res.status(500).json({error:err})
    }
}

const handleForgotPassword= async (req:Request,res:Response)=>{
    try{
        await connectDB();
    const email = req.body.email;
    if(await User.exists({email:email}))
    {
        const user = await User.findOne({email:email})
        res.status(200).json({
            securityQues:user?.securityQues,
        })
    }else{
        res.status(400).json({error:"user doesnt exist try Sign Up"})
    }
    }catch(err)
    {
        res.send(500).json({error:err})
    }

}

const handleEnterSecurityAns=async(req:Request,res:Response)=>{
    try{
        await connectDB();
        const ans = req.body;
        const user = await User.findOne({email:ans.email});
        let provideAns = ans.securityAns;
        provideAns = provideAns.toLowerCase();
        console.log(provideAns);
        let fetchedAns = user?.securityAns;
        fetchedAns = fetchedAns?.toLowerCase();
        if((fetchedAns) === (provideAns))
        {
            res.status(200).json({message:"Correct answer provided,User may reset the password"})
        }else{
            res.status(400).json({error:"wrong answer provided,try again"})
        }
    }catch(err)
    {
        res.status(500).json({error:err})
    }
}

const handleResetPassword=async(req:Request,res:Response)=>{
    try{
        await connectDB();
        const request = req.body;
        console.log(request);
        const user = await User.findOne({email:request.email})
        if(user)
        {
            console.log(user);
            user.password = request.password;
            await user.save();
            res.status(200).json({message:"Password successfully updated,try logging in"})
        }
    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:err})
    }
}
export{
    handleSignUp,handleLogIn,handleForgotPassword,handleEnterSecurityAns,handleResetPassword
}