import mongoose, { Document, Schema, PopulatedDoc } from "mongoose";
import { IDocument } from "./documentSchema";
import bcrypt from "bcrypt";

const SALT_SIZE = 10;

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  documentsCreated: PopulatedDoc<IDocument>[];
  documentsParticipantIn: PopulatedDoc<IDocument>[];
  comparePassword(providedPassword: string): Promise<boolean>;
  public: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address.",
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
    length: [7, "Password must be at least"],
  },
  documentsCreated: [
    {
      type: Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  documentsParticipantIn: [
    {
      type: Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  public: {
    type: Boolean,
  },
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const generateSalt = await bcrypt.genSalt(SALT_SIZE);
    this.password = await bcrypt.hash(this.password, generateSalt);
    next();
  } catch (err) {
    console.error(err);
    throw new Error("Error saving password: " + err);
  }
});

userSchema.methods.comparePassword = function (providedPassword: string) {
  try {
    return bcrypt.compare(providedPassword, this.password);
  } catch (err) {
    console.error("Error comparing passwords", err);
    throw err;
  }
};

export const User = mongoose.model("User", userSchema);
