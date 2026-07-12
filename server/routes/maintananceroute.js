import express from "express";

import {
    createMaintenance,
    getMaintenances,
    completeMaintenance,
    deleteMaintenance,
} from "../controllers/maintanancecontroller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Everyone logged in
router.get("/", authMiddleware, getMaintenances);

// Fleet Manager only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("FleetManager"),
    createMaintenance
);

router.put(
    "/:id/complete",
    authMiddleware,
    roleMiddleware("FleetManager"),
    completeMaintenance
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("FleetManager"),
    deleteMaintenance
);

export default router;