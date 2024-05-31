import { IUser, User } from "../Schemas/userSchema";
import { requestType, responseType } from "../types";
import mongoose from "mongoose";

export const registerUser = async (req: requestType, res: responseType) => {
  const { userName, email, password } = req.body;

  const emailCheck = await User.exists({ email: email });
  if (emailCheck) {
    res.status(409).send("This email is already in use.");
    return;
  }

  const usernameCheck = await User.findOne({ userName: userName });
  if (usernameCheck) {
    res
      .status(409)
      .send("This Username is taken. Please try with a different username");
    return;
  }
  try {
    const newUser: IUser | null = await User.create({
      userName: userName,
      email: email,
      password: password,
    });
    req.session.userName = userName;
    req.session.email = email;
    req.session.isLoggedIn = true;
    res.send({
      status: 200,
      data: `User has been created successfully. ${newUser}`,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const validationError = Object.values(err.errors).map(
        (err) => err.message
      );
      res.status(400).send({ errors: validationError });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
};

export const login = async (req: requestType, res: responseType) => {
  const { userName, password } = req.body;
  const user: IUser | null = await User.findOne({ userName: userName }).select(
    "+password"
  );
  if (!user) {
    res.send({
      status: 404,
      message: `The ${
        userName ? "username" : "email"
      } and/or password you specified are not correct.`,
    });
    return;
  }
  const passwordCheck: boolean = await user.comparePassword(password);
  if (!passwordCheck) {
    res.send({
      status: 404,
      message: `The ${
        userName ? "username" : "email"
      } and/or password you specified are not correct.`,
    });
    return;
  }

  req.session.userName = user.userName;
  req.session.isLoggedIn = true;
  req.session.email = user.email;
  res.send({
    status: 200,
    message: "You are successfully logged in.",
  });
};

export const logout = async (req: requestType, res: responseType) => {
  req.session.destroy((err) => {
    if (err) {
      res.send({
        status: 500,
        message: "Logout failed.",
      });
    }
    res.send({
      status: 200,
      message: "Logout successful.",
    });
  });
};
