import mongoose, { Document, PopulatedDoc} from "mongoose";
import { IUser } from "./userSchema";

const { Schema, Types } = mongoose;

export interface ICharacter extends Document {
  key: number[],
  siteId: number,
  digitList: number[],
  letter: string,
  createdBy: PopulatedDoc<IUser>,
  createdAt: string,
  deletedBy: PopulatedDoc<IUser>,
  deletedAt: string,
  isPersisted: boolean
}


const characterSchema = new Schema<ICharacter>({
  key: [{
      type: Number,
      required: true
    }],
  siteId: {
    type: Number
  },
  digitList:[
    {
      type: Number
    }
  ],
  letter: {
    type: String,
    max: 1
  },
  createdBy:{
    type: Types.ObjectId
  },
  createdAt: {
    type: String
  },
  deletedBy: {
    type: Types.ObjectId
  },
  deletedAt: {
    type: String
  },
  isPersisted: {
    type: Boolean
  }
})

characterSchema.post<ICharacter>('save', function() {
  if(!this.isPersisted){
    const date = new Date();
    this.createdAt = date.toLocaleDateString() + '-' + date.toLocaleTimeString;
    const [siteId, ...digitList] = this.key.slice(-1);
    this.siteId = siteId
    this.digitList = digitList
  }
})

export const Character = mongoose.model<ICharacter>('Character', characterSchema)