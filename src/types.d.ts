import {
  Request as requestType,
  Response as responseType,
  NextFunction as nextFunctionType,
} from "express";
import "express-session";
import { IUser } from "./Schemas/userSchema";
import { IDocument } from "./Schemas/documentSchema";

declare module "express-session" {
  interface SessionData {
    userName: string | null;
    email: string | null;
    isLoggedIn: boolean;
  }
}

declare module "express-serve-static-core" {
  export interface Request {
    user: IUser;
    document: IDocument;
  }
}

export { requestType, responseType, nextFunctionType };
