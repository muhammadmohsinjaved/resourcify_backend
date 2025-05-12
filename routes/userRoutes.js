import express from "express";
import {
  getMyProfile,
  getMyRequests,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getMyProfile);
router.get("/my-requests", isAuthenticated, getMyRequests);
router.get("/logout", isAuthenticated, logout);

export default router;
