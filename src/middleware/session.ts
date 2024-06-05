import { IUser, User } from "../Schemas/userSchema";
import { requestType, responseType, nextFunctionType } from "../types";

export const userSession = async (
  req: requestType,
  res: responseType,
  next: nextFunctionType
) => {
  if (!req.session.isLoggedIn) {
    res.status(403).send("You are not authorized to access this page.");
    return;
  }
  const user: IUser | null = await User.findOne({ email: req.session.email });
  if (!user) {
    throw new Error("User not found with email: " + req.session.email);
  }
  req.user = user;
  next();
};
