/**
 * Author: Von Manaois
 *
 * This module defines a utility function for handling errors.
 * It creates a new Error object, sets its status code and message, and returns it.
 * This function can be used to standardize error handling across the application.
 */

export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
