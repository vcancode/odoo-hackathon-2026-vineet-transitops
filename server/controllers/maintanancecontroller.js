import Maintenance from "../models/Maintanance.js";
import Vehicle from "../models/Vehicle.js";

/* ---------------------------------------
   CREATE MAINTENANCE
--------------------------------------- */

export const createMaintenance = async (req, res) => {

    try {

        const {
            vehicle,
            issue,
            description,
            cost
        } = req.body;

        const vehicleData = await Vehicle.findById(vehicle);

        if (!vehicleData) {

            return res.status(404).json({
                success: false,
                message: "Vehicle Not Found"
            });

        }

        if (vehicleData.status === "Retired") {

            return res.status(400).json({
                success: false,
                message: "Retired Vehicle Cannot Be Maintained"
            });

        }

        if (vehicleData.status === "In Shop") {

            return res.status(400).json({
                success: false,
                message: "Vehicle Already In Maintenance"
            });

        }

    const existingMaintenance = await Maintenance.findOne({
    vehicle,
    status: { $ne: "Completed" }
});

if (existingMaintenance) {
    return res.status(400).json({
        success: false,
        message: "Vehicle already has an active maintenance record"
    });
}

        const maintenance = await Maintenance.create({

            vehicle,

            issue,

            description,

            cost,

            status: "Pending"

        });

        vehicleData.status = "In Shop";

        await vehicleData.save();

        return res.status(201).json({

            success: true,

            message: "Maintenance Created Successfully",

            maintenance

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

/* ---------------------------------------
   GET MAINTENANCE
--------------------------------------- */

export const getMaintenances = async (req, res) => {

    try {

        const maintenances = await Maintenance.find()

            .populate("vehicle")

            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            count: maintenances.length,

            maintenances

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

/* ---------------------------------------
   COMPLETE MAINTENANCE
--------------------------------------- */

export const completeMaintenance = async (req, res) => {

    try {

        const maintenance = await Maintenance.findById(req.params.id);

        if (!maintenance) {

            return res.status(404).json({

                success: false,

                message: "Maintenance Record Not Found"

            });

        }

        maintenance.status = "Completed";

        maintenance.completionDate = new Date();

        await maintenance.save();

        await Vehicle.findByIdAndUpdate(

            maintenance.vehicle,

            {

                status: "Available"

            }

        );

        return res.status(200).json({

            success: true,

            message: "Maintenance Completed Successfully",

            maintenance

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

/* ---------------------------------------
   DELETE MAINTENANCE
--------------------------------------- */

export const deleteMaintenance = async (req, res) => {

    try {

        const maintenance = await Maintenance.findById(req.params.id);

        if (!maintenance) {

            return res.status(404).json({

                success: false,

                message: "Maintenance Record Not Found"

            });

        }

        await maintenance.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Maintenance Deleted Successfully"

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};