import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "Api Route is working" });
};
export const updateUserInfo = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "Not authorized to update this user"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    // new : true is used to return the updated document

    const { password, ...info } = updatedUser._doc;

    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Not authorized to delete this user"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};
