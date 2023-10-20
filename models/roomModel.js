import mongoose from "mongoose";
const roomSchema = new mongoose.Schema({
    roomId: {type: Number, required: true},
    chapter: {type: Number},
    section: {type: Number },
    level: {type: Number },
    hp: {type: Number },
    damage: {type: Number },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
