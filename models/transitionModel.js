import mongoose from "mongoose";
const transitionSchema = new mongoose.Schema({
    transitionId: {type: Number, required: true},
    walletAddress: {type: String},
    amount: {type: Number },
    txID: {type: String },
});

const Transition = mongoose.model("Transition", transitionSchema);

export default Transition;
