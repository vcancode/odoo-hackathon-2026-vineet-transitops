import mongoose from "mongoose";

const tripSchema=new mongoose.Schema(
{
    vehicle:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vehicle",
        required:true
    },

    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Driver",
        required:true
    },

    source:{
        type:String,
        required:true
    },

    destination:{
        type:String,
        required:true
    },

    cargoWeight:{
        type:Number,
        required:true
    },

    plannedDistance:{
        type:Number
    },

    actualDistance:{
        type:Number
    },

    status:{
        type:String,
        enum:[
            "Draft",
            "Dispatched",
            "Completed",
            "Cancelled"
        ],
        default:"Draft"
    },

    dispatchTime:{
        type:Date
    },

    completionTime:{
        type:Date
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Trip",tripSchema);