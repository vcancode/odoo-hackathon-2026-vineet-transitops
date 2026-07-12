import express from "express";

import {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehiclecontroller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Anyone logged in can view vehicles
router.get("/",authMiddleware, getVehicles);

// Only Fleet Manager can modify vehicles
router.post(
  "/",
  authMiddleware,
  roleMiddleware("FleetManager"),
  addVehicle
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("FleetManager"),
  updateVehicle
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("FleetManager"),
  deleteVehicle
);

export default router;