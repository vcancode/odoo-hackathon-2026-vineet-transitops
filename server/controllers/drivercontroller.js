import Driver from "../models/Driver.js";

/* ---------------------------------------
   ADD DRIVER
--------------------------------------- */

export const addDriver = async (req, res) => {
  try {

    const {
    name,
    licenseNumber,
    licenseCategory,
    licenseExpiry,
    phone,
    tripCompletion,
    safetyScore,
    status,
} = req.body;

    const existingDriver = await Driver.findOne({
      licenseNumber,
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver already exists",
      });
    }

    const driver = await Driver.create({
      name,
      licenseNumber,
      licenseExpiry,
      licenseCategory,
      phone,
      tripCompletion,
      safetyScore,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Driver Added Successfully",
      driver,
    });

  } catch (error) {

    console.log("Add Driver Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


/* ---------------------------------------
   GET DRIVERS
--------------------------------------- */

export const getDrivers = async (req, res) => {

  try {

    const drivers = await Driver.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });

  } catch (error) {

    console.log("Get Driver Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};


/* ---------------------------------------
   UPDATE DRIVER
--------------------------------------- */

export const updateDriver = async (req, res) => {

  try {

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Driver Updated Successfully",
      driver,
    });

  } catch (error) {

    console.log("Update Driver Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};


/* ---------------------------------------
   DELETE DRIVER
--------------------------------------- */

export const deleteDriver = async (req, res) => {

  try {

    const driver = await Driver.findById(req.params.id);

    if (!driver) {

      return res.status(404).json({
        success: false,
        message: "Driver Not Found",
      });

    }

    await driver.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Driver Deleted Successfully",
    });

  } catch (error) {

    console.log("Delete Driver Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};