/**
 * Author: Von Manaois
 *
 * This module defines the routes for user operations using Express.
 * It includes routes for testing, updating user information, deleting a user, and retrieving user listings.
 * The routes for updating user information, deleting a user, and retrieving user listings are protected by a token verification middleware.
 */

import express from "express";
import {
  test,
  updateUserInfo,
  deleteUser,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route for testing the API
router.get("/test", test);

// Route for updating user information by ID (protected)
router.post("/update/:id", verifyToken, updateUserInfo);

// Route for deleting a user by ID (protected)
router.delete("/delete/:id", verifyToken, deleteUser);

// Route for retrieving user listings by user ID (protected)
router.get("/listings/:id", verifyToken, getUserListings);

export default router;
