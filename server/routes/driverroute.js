import express from "express";

import {
  addDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
} from "../controllers/driverController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Any logged in user
router.get("/", authMiddleware, getDrivers);

// Fleet Manager only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("FleetManager"),
  addDriver
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("FleetManager"),
  updateDriver
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("FleetManager"),
  deleteDriver
);

export default router;