import { Request,Response} from "express";
import { connectDB } from "../../utils/db";
import Conference from "../../models/conferences.models";
import User from "../../models/users.models";


interface Conference {
    CreatedBy:string;
    EventName: string;
    Description: string;
    date: string;
    startTimeString: string;
    startTimeObj: Date;
    endTimeString: string;
    endTimeObj: Date;
    room: number;
    invitedUsers?: { name: string; email: string }[];
  }

  function convertTimesToDateObj(dateString: string, startTimeString: string, endTimeString: string): { startTimeObj: Date; endTimeObj: Date } {
    const parsedDate = new Date(dateString);

    const startTimeObj = new Date(parsedDate.getTime());
    startTimeObj.setHours(parseInt(startTimeString.slice(0, 2), 10));
    startTimeObj.setMinutes(parseInt(startTimeString.slice(3), 10));

    const endTimeObj = new Date(parsedDate.getTime());

    endTimeObj.setHours(parseInt(endTimeString.slice(0, 2), 10));
    endTimeObj.setMinutes(parseInt(endTimeString.slice(3), 10));

    return {
      startTimeObj,
      endTimeObj
    };
  }


const createConference =async(req:Request,res:Response)=>{
    try{
        await connectDB()
        const conference:Conference = req.body;
        const {startTimeObj,endTimeObj} = convertTimesToDateObj(conference.date,conference.startTimeString,conference.endTimeString);
        console.log(conference);
        if(conference)
        {
            const createdConf = await Conference.create({
                ...conference,
                endTimeObj:endTimeObj,
                startTimeObj:startTimeObj,
                CreatedBy:req.body.user.email
            })
            console.log(createdConf);
            res.status(200).json({message:"Conference created successfully"})
        }
    }catch(err)
    {
        console.log(err)
    }
}

const fetchConferences=async(req:Request,res:Response)=>{
    try{
        await connectDB();
        const query = {
            $or: [
              { CreatedBy: req.body.user.email },
              { invitedUsers: { $elemMatch: { email: req.body.user.email } } },
            ],
          };
        const conferences = await Conference.find(query);
        console.log(conferences);
        const upcomingConferences:any= [];
        const pastConferences:any = [];

        conferences.forEach(conference => {
        const now = new Date();
        if (conference.startTimeObj! > now) {
          upcomingConferences.push(conference);
        } else if ( (conference.endTimeObj! <= now)) {
          pastConferences.push(conference);
        }
        });
        res.status(200).json({upcomingConferences:upcomingConferences,pastConferences:pastConferences});

    }catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
}

const fetchAllUsers=async(req:Request,res:Response)=>{
  try{
    await connectDB();
    const allUser = await User.find({email:{$ne : req.body.user.email}},{name:1,email:1});
    console.log(allUser);
    if(allUser)
    {
      res.status(200).json({message:allUser});
    }else{
      res.status(200).json({message:"No users found"});
    }
  }catch(err)
  {
    console.log(err);
    res.status(500).send({erro:err})
  }
}

const handleDeleteConference=async(req:Request,res:Response)=>{
  try{
    await connectDB();
    const conference = await Conference.deleteOne({_id:req.body._id});
    console.log(conference);
    res.status(200).json({message:"Conference successfully deleted"})
  }catch(err){
    console.log(err);
    res.status(500).json({error:err})
  }
}

const handleEditConference = async(req:Request,res:Response)=>{
  try{
    await connectDB();
    const updatedConf = req.body;
    let conference = await Conference.findById(updatedConf._id).exec()
    conference = {...updatedConf}
    await conference?.save();
    res.status(200).json({message:"Conference edited successfully"});
  }catch(err)
  {
    console.log(err);
    res.status(500).json({error:err})
  }
}

export{
    createConference,fetchConferences,fetchAllUsers,handleDeleteConference,handleEditConference
}