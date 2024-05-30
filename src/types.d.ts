import {Request as requestType, Response as responseType, NextFunction as nextFunctionType} from 'express';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userName: string,
    email: string,
    isLoggedIn: boolean
  }
}

export {requestType, responseType, nextFunctionType};