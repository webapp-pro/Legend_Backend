import mongoose from "mongoose";
const referalSchema = new mongoose.Schema({
    referalId: {type: Number, required: true},
    guest: {type: String},
    introducer: {type: String },
});

const Referal = mongoose.model("Referal", referalSchema);

export default Referal;
