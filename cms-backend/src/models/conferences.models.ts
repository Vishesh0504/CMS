import { Schema,model } from "mongoose";


const ConferenceSchema = new Schema({
    CreatedBy:{
        type:String,
        required:true
    },
    EventName: {
      type: String,
      required: true,
      trim: true
    },
    Description:{type:String,required:true},
    date: {
      type: String,
      required: true
    },
    startTimeString: {
      type: String,
      required: true
    },
    startTimeObj: {
      type: Date,
    },
    endTimeString: {
      type: String,
      required: true
    },
    endTimeObj: {
      type: Date,
      required: true
    },
    room:{
        type:Number,
        required:true
    },
    invitedUsers:{
        type:[{
            name:String,
            email:String
        }],
    }
  });


const Conference = model('Conference',ConferenceSchema);
export default Conference;