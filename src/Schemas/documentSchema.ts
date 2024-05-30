import mongoose, { Document, Schema, Types } from "mongoose";
import {ICharacter, Character} from './characterSchema'

export interface IDocument extends Document {
  content: ICharacter[]
}

export const documentSchema = new Schema<IDocument>({
  content: [{
    type: Character.schema,
    ref: "Character",
    default: ''
  }]
})

export const Documents = mongoose.model<IDocument>('Document', documentSchema);