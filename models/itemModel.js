import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    user: {type: String, required: true},
    item: {type: String, default: 0 },
    stock: {type: Number, default: 0 },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
