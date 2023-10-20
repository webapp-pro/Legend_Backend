import asyncHandler from 'express-async-handler';
import BattleModel from '../models/battleModel.js';

export const getBattleData = asyncHandler(async(req, res) =>{
    
    let {roomid} = req.body;
    
    const room = await BattleModel.findOne({roomid}, {
        localUnit: 1,
        localAbility: 1,
        remoteAddress: 1,
        remoteUnit: 1,
        remoteAbility: 1,
        _id: 0
    });

    return res.json(room);
});