import mongoose, { Document, Schema, Types, PopulatedDoc } from "mongoose";
import { ICharacter } from "./characterSchema";
import { IUser } from "./userSchema";

export interface Participant extends Document {
  userToSiteId: Map<Types.ObjectId, number>;
}

const ParticipantSchema = new Schema({
  userToSiteId: {
    type: Map,
    of: Number,
    default: new Map(),
  },
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
  this.participants.set(user._id, this.participants.size + 1);
  user.documentsParticipantIn.push(this._id);
};

documentSchema.methods.addAdmin = function (user: IUser) {
  this.admins.push(user);
  user.documentsParticipantIn.push(this._id);
};

export const Documents = mongoose.model<IDocument>("Document", documentSchema);
