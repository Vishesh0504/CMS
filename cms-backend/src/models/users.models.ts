import { Schema, model} from "mongoose";
const bcrypt = require('bcrypt');



const userSchema = new Schema({
    name:{type:String,required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    securityQues: { type: String, required: true },
    securityAns: { type: String, required: true },
    createdAt: Date,
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try{
        const hashedPass = await bcrypt.hash(this.password,10)
        this.password = hashedPass;
    }catch(error)
    {
        throw error;
    }
    next();
});

const User = model('User', userSchema);
export default User;
