import { verifyToken } from "../utils/verifyUser";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("verifyToken Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {
        access_token: "valid_token",
      },
    };
    res = {};
    next = jest.fn();
  });

  it("should call next with an error if no token is provided", () => {
    req.cookies.access_token = null;

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "Not authorized to access this route",
      })
    );
  });

  it("should call next with an error if the token is invalid", () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Token Invalid or Expired"), null);
    });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: "Token Invalid or Expired",
      })
    );
  });

  it("should call next without error if the token is valid", () => {
    const mockUser = { id: "123", username: "testuser" };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual(mockUser);
  });
});
