import express from 'express';
import operationsRoutes from "./routes/operationsRoute";
import mongoose from "mongoose";
import cors from "cors";
import { client } from './redis-setup'
import userRoutes from './routes/userRoute';
import session from 'express-session';
import 'dotenv/config'
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo'

const app = express();
const mongoURI = 'mongodb://127.0.0.1:27017/CollaborateNow';
app.use(cors());
app.use(session({
  secret: process.env.SECRET_KEY || "thisIsYourTemporaryPassword",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10800000
  },
  store: MongoStore.create({
    mongoUrl: mongoURI
  })
}))
app.use(bodyParser.json())

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

client.connect().then(() => {
  console.log('connected to Redis via port: 6379')
}).catch((error: unknown) => {
  console.log('unable to connect to Redis. Because of error:', error);
})

app.listen(3001, () => {
  console.log('listening on port 3001');
})

app.use('/', operationsRoutes);
app.use('/', userRoutes)

export default app;