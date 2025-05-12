import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
import {
  changeLendItemRequestStatus,
  createLibraryItem,
  deleteLibraryItem,
  getAllLendItemsRequest,
  getAllLibraryItems,
  lendLibraryItem,
  updateLibraryItem,
} from "../controllers/libraryItemsController.js";

const router = express.Router();

router.post(
  "/create-library-item",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  singleUpload,
  createLibraryItem
);

router.get("/library-items", getAllLibraryItems);
router.put(
  "/library-item/:id",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  singleUpload,
  updateLibraryItem
);

router.delete(
  "/library-item/:id",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  deleteLibraryItem
);

router.post(
  "/lend-library-item",
  isAuthenticated,
  isAuthorized("student", "teacher"),
  lendLibraryItem
);

router.put(
  "/lend-library-item/:id",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  changeLendItemRequestStatus
);

router.get(
  "/lend-library-items",
  isAuthenticated,
  isAuthorized("admin", "librarian"),
  getAllLendItemsRequest
);

export default router;
