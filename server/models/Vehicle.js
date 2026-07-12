import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
{
    registrationNumber:{
        type:String,
        unique:true,
        required:true
    },

    model:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:["Van","Mini","Truck"],
        required:true
    },

    capacity:{
        type:Number,
        required:true
    },

    fuelType:{
        type:String,
        enum:["Petrol","Diesel","Electric","CNG"],
        default:"Diesel"
    },

    acquisitionCost:{
        type:Number
    },

    odometer:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:[
            "Available",
            "On Trip",
            "In Shop",
            "Retired"
        ],
        default:"Available"
    }

},
{
    timestamps:true
}
);

export default mongoose.model("Vehicle",vehicleSchema);