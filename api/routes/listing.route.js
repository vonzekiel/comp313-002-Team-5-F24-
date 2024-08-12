/**
 * Author: Von Manaois
 *
 * This module defines the routes for listing operations using Express.
 * It includes routes for creating, deleting, updating, and retrieving listings.
 * The routes for creating, deleting, and updating listings are protected by a token verification middleware.
 */

import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route for creating a new listing (protected)
router.post("/create-listing", verifyToken, createListing);

// Route for deleting a listing by ID (protected)
router.delete("/delete/:id", verifyToken, deleteListing);

// Route for updating a listing by ID (protected)
router.post("/update/:id", verifyToken, updateListing);

// Route for retrieving a single listing by ID
router.get("/get/:id", getListing);

// Route for retrieving multiple listings
router.get("/get", getListings);

export default router;
