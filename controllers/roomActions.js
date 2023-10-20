import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Item from '../models/itemModel.js';
import path from 'path';
import Web3 from 'web3';
import BCS_ABI from "../utiles/bcs_abi.js";
import Provider from '@truffle/hdwallet-provider';
import cron from "cron";
import checkValidWallet from '../utiles/checkValidWallet.js'

import { RESPONSE } from '../utiles/response.js';
import Withdraw from '../models/withdrawModel.js';
import { getBcsPrice, getTokenBalance, sendBCS } from './web3Helper.js';
import Embeditem from '../models/embedItem.js';
import Room from '../models/roomModel.js';

export const setRoomData = asyncHandler(async (req, res) => {
    const seedPattern = await Room.findOne({chapter: 6, section: 4});
    
    const roomSeed = [
        {chapter: 1, section: 1, level: 1, hp: 1200, damage: 150},
        {chapter: 1, section: 2, level: 2, hp: 1300, damage: 160},
        {chapter: 1, section: 3, level: 3, hp: 1400, damage: 170},
        {chapter: 1, section: 4, level: 4, hp: 1500, damage: 180},
        {chapter: 2, section: 1, level: 1, hp: 800, damage: 150},
        {chapter: 2, section: 2, level: 1, hp: 900, damage: 160},
        {chapter: 2, section: 3, level: 1, hp: 1050, damage: 180},
        {chapter: 2, section: 4, level: 1, hp: 1150, damage: 190},
        {chapter: 3, section: 1, level: 1, hp: 800, damage: 150},
        {chapter: 3, section: 2, level: 1, hp: 900, damage: 160},
        {chapter: 3, section: 3, level: 1, hp: 1050, damage: 180},
        {chapter: 3, section: 4, level: 1, hp: 1150, damage: 190},
        {chapter: 4, section: 1, level: 1, hp: 800, damage: 150},
        {chapter: 4, section: 2, level: 1, hp: 900, damage: 160},
        {chapter: 4, section: 3, level: 1, hp: 1050, damage: 180},
        {chapter: 4, section: 4, level: 1, hp: 1150, damage: 190},
        {chapter: 5, section: 1, level: 1, hp: 800, damage: 150},
        {chapter: 5, section: 2, level: 1, hp: 900, damage: 160},
        {chapter: 5, section: 3, level: 1, hp: 1050, damage: 180},
        {chapter: 5, section: 4, level: 1, hp: 1150, damage: 190},
        {chapter: 6, section: 1, level: 1, hp: 800, damage: 150},
        {chapter: 6, section: 2, level: 1, hp: 900, damage: 160},
        {chapter: 6, section: 3, level: 1, hp: 1050, damage: 180},
        {chapter: 6, section: 4, level: 1, hp: 1150, damage: 190},
    ]

    if (!seedPattern) {
        for (let i = 0 ; i < roomSeed.length ; i++) {
            const newRoom = new Room({
                roomId: i,
                chapter: roomSeed[i].chapter,
                section: roomSeed[i].section,
                level: roomSeed[i].level,
                hp: roomSeed[i].hp,
                damage: roomSeed[i].damage,
            })
            await newRoom.save()
        }        
    }
    const room = await Room.find()
    RESPONSE(res, 200, { room}, "")
})