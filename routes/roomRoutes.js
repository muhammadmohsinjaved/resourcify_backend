import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
import {
  changeBookingStatus,
  createRoom,
  deleteRoom,
  getAllBookings,
  getAllRooms,
  getRoomById,
  requestBooking,
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.post(
  "/room",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  singleUpload,
  createRoom
);

router.get("/rooms", getAllRooms);
router.get("/room/:id", isAuthenticated, getRoomById);
router.put(
  "/room/:id",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  singleUpload,
  updateRoom
);

router.delete(
  "/room/:id",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  deleteRoom
);

router.get(
  "/bookings",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  getAllBookings
);

router.post("/booking", isAuthenticated, requestBooking);

router.put(
  "/booking/:id",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  changeBookingStatus
);

export default router;
