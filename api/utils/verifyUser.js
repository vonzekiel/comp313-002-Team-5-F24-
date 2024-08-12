/**
 * Author: Von Manaois
 *
 * This module defines a middleware function for verifying JSON Web Tokens (JWT).
 * It checks for the presence of a token in the request cookies and verifies it.
 * If the token is valid, the user information is attached to the request object.
 * If the token is missing or invalid, an appropriate error is passed to the next middleware.
 */

import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token)
    return next(errorHandler(401, "Not authorized to access this route"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Token Invalid or Expired"));

    req.user = user;
    next();
  });
};
