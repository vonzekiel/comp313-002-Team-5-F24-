/**
 * Author: Von Manaois
 *
 * This module defines the routes for user authentication using Express.
 * It includes routes for signup, signin, Google OAuth, and logout.
 */

import express from "express";
import {
  google,
  signin,
  signup,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user signin
router.post("/signin", signin);

// Route for Google OAuth
router.post("/google", google);

// Route for user logout
router.get("/logout", logout);

export default router;
