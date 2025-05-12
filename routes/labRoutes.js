import express from "express";
import {
  changeLendLabResourceStatus,
  createLabResource,
  createLabResourceRequest,
  deleteLabResource,
  getAllLabResourceById,
  getAllLabResourceRequests,
  getAllLabResources,
  updateLabResource,
} from "../controllers/labResourceController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.get("/lab-resources", getAllLabResources);
router.get("/lab-resource/:id", getAllLabResourceById);
router.post(
  "/create-lab-resource",
  isAuthenticated,
  isAuthorized("lab_attendant", "admin"),
  singleUpload,
  createLabResource
);

router.put(
  "/lab-resource/:id",
  isAuthenticated,
  isAuthorized("lab_attendant", "admin"),
  singleUpload,
  updateLabResource
);

router.delete(
  "/lab-resource/:id",
  isAuthenticated,
  isAuthorized("lab_attendant", "admin"),
  deleteLabResource
);

router.post(
  "/lend-lab-resource",
  isAuthenticated,
  isAuthorized("student", "teacher"),
  createLabResourceRequest
);

router.get(
  "/lend-lab-resources",
  isAuthenticated,
  isAuthorized("lab_attendant", "admin"),
  getAllLabResourceRequests
);

router.put(
  "/lend-lab-resource/:id",
  isAuthenticated,
  isAuthorized("lab_attendant", "admin"),
  changeLendLabResourceStatus
);
export default router;
