import mongoose from "mongoose";

const driverSchema=new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    licenseNumber:{
        type:String,
        unique:true,
        required:true
    },

    licenseCategory:{
        type:String,
        required:true
    },

    licenseExpiry:{
        type:Date,
        required:true
    },

    safetyScore:{
        type:Number,
        default:100
    },

    status:{
        type:String,
        enum:[
            "Available",
            "On Trip",
            "Off Duty",
            "Suspended"
        ],
        default:"Available"
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Driver",driverSchema);