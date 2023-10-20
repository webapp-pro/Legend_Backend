import { DateTime } from "luxon";
import mongoose from "mongoose";
const logSchema = new mongoose.Schema({
    walletAddress: {type: String, required: true},
    ipAddress: { type: String, default: "" },
    Siren: { type: Number, default: 0 },
    eggs: { type: Number, default: 0 },
    resource: { type: Number, default: 0 },
    details:{
      updatedAt: {type: Date},
      action_type: {type: String},
      detail: {type: String}
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
});

logSchema.pre('save', function (next) {
  if (this.isModified('details')) {
    this.details.updatedAt = new Date();
  }
  
  next();
});
const Log = mongoose.model('Log', logSchema);

export default Log;
