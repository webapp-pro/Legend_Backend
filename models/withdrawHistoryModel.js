import mongoose from "mongoose";

const WithdrawHistorySchema = new mongoose.Schema({
        walletAddress: {type: String, required: true},
        amount: {type:String, required: true},
        txId: {type: String, required: true},
    },
    { timestamps: true},
);

const WithdrawHistory = mongoose.model("WithdrawHistory", WithdrawHistorySchema);

export default WithdrawHistory;
