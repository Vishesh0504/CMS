const mongoose = require("mongoose");
require("dotenv").config({path:"../../.env"});
const connectDB = async()=>{
    const MongoConnectionURI = process.env.MongoConnectionURI;
    try{
        await mongoose.connect(MongoConnectionURI);
        console.log("DB connected");
    }catch(err)
    {
        throw err;
    }
}

const disconnectDB = async()=>{
    if(mongoose.connection)
    {
        try{
        await mongoose.connection.close();
        console.log("DB connection closed");
        }catch(err)
        {
            throw err;
        }
    }
    else{
        console.warn("DB connection doesn't exist");
    }
}
export{
    connectDB,
    disconnectDB
}