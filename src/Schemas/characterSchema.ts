import mongoose, {Document} from "mongoose";

const { Schema } = mongoose;

export interface ICharacter extends Document {
  key: number[],
  siteId: number,
  digitList: number[],
  letter: string
}


const characterSchema = new Schema<ICharacter>({
  key: [
    {
      type: Number,
      required: true
    }  
  ],
  siteId: {
    type: Number,
    default: null
  },
  digitList:[
    {
      type: Number,
      default: null
    }
  ],
  letter: {
    type: String,
    max: 1
  }
})

// characterSchema.pre('save', function (next: (err?: Error) => void) {
//   if(this.key){
//     const [ siteId, digitList ] = this.key.split('.').map(Number);
//     this.siteId = siteId;
//     this.digitList = digitList;
//   }
//   next()
// });

export const Character = mongoose.model<ICharacter>('Character', characterSchema)