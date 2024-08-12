// errorHandler.test.js

import { errorHandler } from "../utils/error";

describe("errorHandler", () => {
  it("should return an error object with the given statusCode and message", () => {
    const statusCode = 404;
    const message = "Not Found";

    const error = errorHandler(statusCode, message);

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
  });

  it("should return an error object with undefined statusCode and message if not provided", () => {
    const error = errorHandler();

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBeUndefined();
    expect(error.message).toBeUndefined();
  });
});
