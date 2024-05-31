import { requestType, responseType, nextFunctionType } from "../types";

export const userSession = (
  req: requestType,
  res: responseType,
  next: nextFunctionType
) => {
  if (!req.session.isLoggedIn) {
    res.status(403).send("You are not authorized to access this page.");
    res.redirect("/login");
  }
  next();
};
