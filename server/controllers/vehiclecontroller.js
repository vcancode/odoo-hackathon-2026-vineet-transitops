import Vehicle from "../models/Vehicle.js";

/* ---------------------------------------------
   CREATE VEHICLE
--------------------------------------------- */

export const addVehicle = async (req, res) => {
  try {
    const {
      registrationNumber,
      model,
      type,
      capacity,
      odometer,
      acquisitionCost,
      status,
    } = req.body;

    // Check if registration already exists
    const existingVehicle = await Vehicle.findOne({
      registrationNumber,
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle already exists",
      });
    }

    const vehicle = await Vehicle.create({
      registrationNumber,
      model,
      type,
      capacity,
      odometer,
      acquisitionCost,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Add Vehicle Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------------------------------------
   GET ALL VEHICLES
--------------------------------------------- */

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error("Get Vehicles Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------------------------------------
   UPDATE VEHICLE
--------------------------------------------- */

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Update Vehicle Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------------------------------------
   DELETE VEHICLE
--------------------------------------------- */

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    await vehicle.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete Vehicle Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};