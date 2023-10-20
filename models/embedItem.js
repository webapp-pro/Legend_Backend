import mongoose from "mongoose";
const embeditemSchema = new mongoose.Schema({
    user: {type: String, required: true},
    character: {type: String, default: 'siren-1' },
    item: {type: String, default: 0 },
    stock: {type: Number, default: 1 },
});

const Embeditem = mongoose.model("Embeditem", embeditemSchema);

export default Embeditem;
