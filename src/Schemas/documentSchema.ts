import mongoose, { Document, Schema, Types, PopulatedDoc } from "mongoose";
import { ICharacter } from "./characterSchema";
import { IUser } from "./userSchema";
import { generateRandomValue } from "../helper/operationHelper";

export interface Participant extends Document {
  userId: PopulatedDoc<IUser>;
  siteId: number;
}

const ParticipantSchema = new Schema<Participant>({
  userId: Types.ObjectId,
  siteId: Number,
});

export interface IDocument extends Document {
  content: PopulatedDoc<ICharacter>[];
  createdBy: PopulatedDoc<IUser>;
  createdAt: string;
  participants: Participant[];
  deletedBy: PopulatedDoc<IUser>;
  deletedAt: string;
  admins: PopulatedDoc<IUser>[];
  isPersisted: boolean;
  public: boolean;
  addAdmin(user: IUser): void;
  addUser(user: IUser): void;
  checkUserAccess(user: IUser): boolean;
  isAdmin(user: IUser): boolean;
}

export const documentSchema = new Schema<IDocument>({
  content: [
    {
      type: Types.ObjectId,
      ref: "Character",
      default: "",
    },
  ],
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: String,
  },
  participants: [
    {
      type: ParticipantSchema,
    },
  ],
  deletedBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  deletedAt: {
    type: String,
  },
  admins: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  isPersisted: {
    type: Boolean,
    default: false,
  },
  public: {
    type: Boolean,
    default: true,
  },
});

documentSchema.post<IDocument>("save", function () {
  if (!this.isPersisted) {
    const date = new Date();
    this.createdAt =
      date.toLocaleDateString() + "-" + date.toLocaleTimeString();
    this.isPersisted = true;
  }
});

documentSchema.methods.addUser = function (user: IUser) {
  this.participants.push({
    userId: user._id,
    siteId: generateRandomValue(10000, 99999),
  });
  user.documentsParticipantIn.push(this._id);
};

documentSchema.methods.addAdmin = function (user: IUser) {
  this.admins.push(user);
};

documentSchema.methods.checkUserAccess = function (user: IUser) {
  console.log(user);
  const canAccess = this.participants.find(
    (participant: Participant) =>
      JSON.stringify(participant.userId) === JSON.stringify(user._id)
  );
  return !!canAccess;
};

documentSchema.methods.isAdmin = function (user: IUser) {
  const canAccess = this.admins.find(
    (admin: IUser) => JSON.stringify(admin._id) === JSON.stringify(user._id)
  );
  return !!canAccess;
};

export const Documents = mongoose.model<IDocument>("Document", documentSchema);
