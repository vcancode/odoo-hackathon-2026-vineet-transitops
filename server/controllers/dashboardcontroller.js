import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import Maintenance from "../models/Maintanance.js";

export const getDashboardStats = async (req, res) => {
    try {

        // ---------------- VEHICLES ----------------

        const totalVehicles = await Vehicle.countDocuments();

        const availableVehicles = await Vehicle.countDocuments({
            status: "Available"
        });

        const vehiclesOnTrip = await Vehicle.countDocuments({
            status: "On Trip"
        });

        const vehiclesInShop = await Vehicle.countDocuments({
            status: "In Shop"
        });

        // ---------------- DRIVERS ----------------

        const totalDrivers = await Driver.countDocuments();

        const availableDrivers = await Driver.countDocuments({
            status: "Available"
        });

        const driversOnTrip = await Driver.countDocuments({
            status: "On Trip"
        });

        const suspendedDrivers = await Driver.countDocuments({
            status: "Suspended"
        });

        // ---------------- TRIPS ----------------

        const totalTrips = await Trip.countDocuments();

        const activeTrips = await Trip.countDocuments({
            status: "Dispatched"
        });

        const completedTrips = await Trip.countDocuments({
            status: "Completed"
        });

        // ---------------- MAINTENANCE ----------------

        const totalMaintenance = await Maintenance.countDocuments();

        const pendingMaintenance = await Maintenance.countDocuments({
            status: "Pending"
        });

        const completedMaintenance = await Maintenance.countDocuments({
            status: "Completed"
        });

        // ---------------- RECENT DATA ----------------

        const recentTrips = await Trip.find()
            .populate("vehicle")
            .populate("driver")
            .sort({ createdAt: -1 })
            .limit(5);

        const recentMaintenance = await Maintenance.find()
            .populate("vehicle")
            .sort({ createdAt: -1 })
            .limit(5);

        // ---------------- RESPONSE ----------------

        return res.status(200).json({

            success: true,

            stats: {

                totalVehicles,
                availableVehicles,
                vehiclesOnTrip,
                vehiclesInShop,

                totalDrivers,
                availableDrivers,
                driversOnTrip,
                suspendedDrivers,

                totalTrips,
                activeTrips,
                completedTrips,

                totalMaintenance,
                pendingMaintenance,
                completedMaintenance

            },

            recentTrips,
            recentMaintenance

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }
};