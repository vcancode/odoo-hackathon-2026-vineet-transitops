import express from "express";

import {
    createTrip,
    getTrips,
    completeTrip,
    deleteTrip,
} from "../controllers/tripController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTrips);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("Dispatcher"),
    createTrip
);

router.put(
    "/:id/complete",
    authMiddleware,
    roleMiddleware("Dispatcher"),
    completeTrip
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Dispatcher"),
    deleteTrip
);

export default router;