import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";

/* -------------------------------------
   CREATE TRIP
--------------------------------------*/

export const createTrip = async (req, res) => {

    try {

        const {
            vehicle,
            driver,
            source,
            destination,
            cargoWeight,
            plannedDistance,
        } = req.body;

        // Vehicle Exists
        const vehicleData = await Vehicle.findById(vehicle);

        if (!vehicleData) {
            return res.status(404).json({
                success: false,
                message: "Vehicle Not Found"
            });
        }

        // Driver Exists
        const driverData = await Driver.findById(driver);

        if (!driverData) {
            return res.status(404).json({
                success: false,
                message: "Driver Not Found"
            });
        }

        // Vehicle Available?
        if (vehicleData.status !== "Available") {
            return res.status(400).json({
                success: false,
                message: "Vehicle Not Available"
            });
        }

        // Driver Available?
        if (driverData.status !== "Available") {
            return res.status(400).json({
                success: false,
                message: "Driver Not Available"
            });
        }

        // License Expired?
        if (new Date(driverData.licenseExpiry) < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Driver License Expired"
            });
        }

        // Capacity Check
        if (cargoWeight > vehicleData.capacity) {
            return res.status(400).json({
                success: false,
                message: "Cargo exceeds vehicle capacity"
            });
        }

        const trip = await Trip.create({

            vehicle,

            driver,

            source,

            destination,

            cargoWeight,

            plannedDistance,

            status: "Dispatched",

            dispatchTime: new Date()

        });

        vehicleData.status = "On Trip";
        await vehicleData.save();

        driverData.status = "On Trip";
        await driverData.save();

        return res.status(201).json({

            success: true,

            message: "Trip Created Successfully",

            trip

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/* -------------------------------------
   GET TRIPS
--------------------------------------*/

export const getTrips = async (req, res) => {

    try {

        const trips = await Trip.find()

            .populate("vehicle")

            .populate("driver")

            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            count: trips.length,

            trips

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/* -------------------------------------
   COMPLETE TRIP
--------------------------------------*/

export const completeTrip = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {

            return res.status(404).json({

                success: false,

                message: "Trip Not Found"

            });

        }

        trip.status = "Completed";

        trip.completionTime = new Date();

        await trip.save();

        await Vehicle.findByIdAndUpdate(

            trip.vehicle,

            {

                status: "Available"

            }

        );

        await Driver.findByIdAndUpdate(

            trip.driver,

            {

                status: "Available"

            }

        );

        return res.status(200).json({

            success: true,

            message: "Trip Completed Successfully",

            trip

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/* -------------------------------------
   DELETE TRIP
--------------------------------------*/

export const deleteTrip = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {

            return res.status(404).json({

                success: false,

                message: "Trip Not Found"

            });

        }

        await trip.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Trip Deleted"

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};