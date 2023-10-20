import { getUnitHealth, handleAttack, handleCloseSocket, handleUnitAttack } from "./controllers/socket/BattleController.js";
import { sendBroadCastEvent, sendEvent } from "./helper/socketHelper.js";
import BattleModel from "./models/battleModel.js";

import User from "./models/userModel.js";
import { UNIT_SOCKET, PLAYER_SOCKET } from "./utiles/socket_api.js";

global.onlineUsers = new Map();
global.onlineSupports = new Map();

const socketConnectionManager = function (socket, io) {

    socket.on(PLAYER_SOCKET.CREATE_ROOM, async (roomData) => {

        //console.log(roomData);
        const {roomid, price} = roomData;

        // If room is already created, don't create room
        if (io.sockets.adapter.rooms.has(roomid)) {
            console.log('Can\'t create same room');
            return ;   
        }
        socket.join(roomid);

        if(BattleModel.findOne({roomid})) {
            await BattleModel.findOneAndUpdate({ roomid }, { 
                price: price,
                localSocketId: socket.id,

                localUnit: "",
                localAbility: [],
                localHp: 1000,
                localBonusDamage: 0,
                
                remoteAddress: "",
                remoteUnit: "",
                remoteAbility: [],
                remoteHp: 1000,
                remoteBonusDamage: 0,
            }, {
                new: true,
                upsert: true // Make this update into an upsert
            });
        } else {
            const battle = new BattleModel({
                roomid: roomid, 
                price: price,
                localSocketId: socket.id
            });
            await battle.save();
        }

        sendEvent(socket, PLAYER_SOCKET.CREATE_ROOM, roomData);
        
    });

    socket.on(PLAYER_SOCKET.JOIN_ROOM, async (roomData) => {

        const {roomid, address} = roomData;
        let turn = "local";
        
        if(Math.random * 100 > 50) {
            turn = "remote";
        }

        turn = "remote";

        // If room does not exist, can't join the room
        console.log(io.sockets.adapter.rooms);
        if (!io.sockets.adapter.rooms.has(roomid)) {
            console.log('Room does not exist that you want to join');
            return ;
        } 
        
        const roomUsers = io.sockets.adapter.rooms.get(roomid);
        if(roomUsers.size > 1) {
            console.log('Someone already joined the room');
            return;
        }         
        socket.join(roomid);

        let results = await BattleModel.findOneAndUpdate({ roomid }, { 
            remoteAddress: address,
            remoteSocketId: socket.id,
            turn: turn,
            unitTurn: turn,
        }, {
            new: true,
            upsert: true // Make this update into an upsert
        });
        
        roomData["turn"] = turn;
        sendEvent(socket, PLAYER_SOCKET.JOIN_ROOM, roomData);
        sendBroadCastEvent(socket, roomid, PLAYER_SOCKET.JOIN_ROOM, roomData);
    });

    socket.on(PLAYER_SOCKET.SELECT_UNIT, async (data) => {
        
        const {roomid, address, unit} = data;

        if(roomid == address) {
            await BattleModel.findOneAndUpdate({ roomid }, { 
                localUnit: unit,
                localUnitHp: getUnitHealth(unit)
            }, {
                new: true,
                upsert: true // Make this update into an upsert
            });
        } else {
            await BattleModel.findOneAndUpdate({ roomid }, { 
                remoteUnit: unit,
                remoteUnitHp: getUnitHealth(unit)
            }, {
                new: true,
                upsert: true // Make this update into an upsert
            });
        }
        
        sendEvent(socket, PLAYER_SOCKET.SELECT_UNIT, data);
        sendBroadCastEvent(socket, roomid, PLAYER_SOCKET.SELECT_UNIT, data);
    });

    socket.on(PLAYER_SOCKET.SELECT_ABILITY, async (data) => {
        
        const {roomid, address, ability} = data;

        if(roomid == address) {
            await BattleModel.findOneAndUpdate({ roomid }, { 
                localAbility: ability
            }, {
                new: true,
                upsert: true // Make this update into an upsert
            });
        } else {
            await BattleModel.findOneAndUpdate({ roomid }, { 
                remoteAbility: ability
            }, {
                new: true,
                upsert: true // Make this update into an upsert
            });


            /// Start the game 
        }

        sendEvent(socket, PLAYER_SOCKET.SELECT_ABILITY, data);
        sendBroadCastEvent(socket, roomid, PLAYER_SOCKET.SELECT_ABILITY, data);
    });

    socket.on(PLAYER_SOCKET.ATTACK, handleAttack);

    socket.on(UNIT_SOCKET.ATTACK, handleUnitAttack);

    socket.on('disconnect', handleCloseSocket);
};

export default socketConnectionManager;
