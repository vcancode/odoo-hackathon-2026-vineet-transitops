import mongoose from "mongoose";

const maintenanceSchema=new mongoose.Schema(
{
    vehicle:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vehicle",
        required:true
    },

    issue:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    cost:{
        type:Number
    },

    status:{
        type:String,
        enum:[
            "Pending",
            "In Progress",
            "Completed"
        ],
        default:"Pending"
    },

    startDate:{
        type:Date,
        default:Date.now
    },

    completionDate:{
        type:Date
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Maintenance",maintenanceSchema);