import { sendBroadCastEvent, sendEvent } from "../../helper/socketHelper.js";
import BattleModel from "../../models/battleModel.js";
import User from "../../models/userModel.js";
import { pvpLog } from "../../utiles/logController.js";
import { PLAYER_SOCKET, UNIT_SOCKET } from "../../utiles/socket_api.js";
import { bonusDamage, spellTypes, unitTypes } from "../../utiles/weapon.js";
import { removeCreatedUserRoom, sendPvpReward } from "../web3Helper.js";

let lastEmitTime = 0;
let timer = null;

export const handleAttack = async function (data, callback) {
    const socket = this;

    const currentTime = new Date().getTime();
    if(currentTime - lastEmitTime < 500) return; 
    lastEmitTime = currentTime;

    const {
        roomid,
        address,
        type
    } = data;

    let battle = await BattleModel.findOne({roomid});
    let localHp = battle.localHp, remoteHp = battle.remoteHp;

    let localBonusDamage = battle.localBonusDamage;
    if(!localBonusDamage) localBonusDamage = 0;

    let remoteBonusDamage = battle.remoteBonusDamage;
    if(!remoteBonusDamage) remoteBonusDamage = 0;

    const {damage, health, bonus} = getAttackDetail(type, roomid == address ? localBonusDamage : remoteBonusDamage);

    data['damage'] = damage;
    data['health'] = health;

    console.log("damage, health, bonus", damage, health, bonus);

    try{
        if(roomid == address) { // local player attack remote player
            
            if(battle.turn != "local") {
                console.log("scam attack detected!");
                return;
            }

            remoteHp = battle.remoteUnitHp > 0 ? battle.remoteHp : Math.max(0, battle.remoteHp - damage);
            await BattleModel.findOneAndUpdate({ roomid }, { 
                localHp: Math.min(1000, battle.localHp + health),
                remoteHp: remoteHp,
                remoteUnitHp: Math.max(0, battle.remoteUnitHp - damage),
                localBonusDamage: bonus,

                turn: nextTurn(battle.turn)
            }, { new: true, upsert: true });

        } else { // remote player attack local player

            if(battle.turn != "remote") {
                console.log("scam attack detected!");
                return;
            }

            localHp = battle.localUnitHp > 0 ? battle.localHp : Math.max(0, battle.localHp - damage);
            await BattleModel.findOneAndUpdate({ roomid }, { 
                remoteHp: Math.min(1000, battle.remoteHp + health),
                localHp: localHp,
                localUnitHp: Math.max(0, battle.localUnitHp - damage),
                remoteBonusDamage: bonus,

                turn: nextTurn(battle.turn)
            }, { new: true, upsert: true });
        }
    

        if(remoteHp == 0 || localHp == 0) {
            sendEvent(socket, PLAYER_SOCKET.FINISHED, {winner:localHp == 0 ? battle.remoteAddress : battle.roomid});
            sendBroadCastEvent(socket, roomid, PLAYER_SOCKET.FINISHED, {winner:localHp == 0 ? battle.remoteAddress : battle.roomid});

            const winner = localHp == 0 ? battle.remoteAddress : roomid;

            console.log("send reward to winner", winner, roomid);

            pvpLog(battle.roomid, battle.remoteAddress, battle.localUnit, battle.remoteUnit, battle.localAbility, battle.remoteAbility, battle.price, winner);
            //sendPvpReward(roomid, winner, battle.price);

        } else {
            sendEvent(socket, PLAYER_SOCKET.ATTACK, data);
            sendBroadCastEvent(socket, roomid, PLAYER_SOCKET.ATTACK, data);
        }
    } catch(e) {
        console.log(e);
    }

    return;
};

export const handleUnitAttack = async function (data, callback) {
    const socket = this;

    const {
        roomid,
        address,
        type
    } = data;
    const {damage, isBattle, health} = getUnitDamage(type);

    if(damage == 0) return;

    let battle = await BattleModel.findOne({roomid});
    let localHp = battle.localHp, remoteHp = battle.remoteHp;

    data['damage'] = damage;
    data['health'] = health;

    try{

        if(roomid == address) { // local player attack remote player
            
            if(battle.unitTurn != "local") {
                console.log("scam attack detected(local)!");
                return;
            }




            if(battle.remoteUnitHp == 0 || isBattle) {
                remoteHp = Math.max(0, remoteHp - damage);
            }

            await BattleModel.findOneAndUpdate({ roomid }, { 
                remoteHp: remoteHp,
                remoteUnitHp: Math.max(0, battle.remoteUnitHp - damage),

                unitTurn: nextTurn(battle.unitTurn)
            }, { new: true, upsert: true });

        } else { // remote player attack local player

            if(battle.unitTurn != "remote") {
                console.log("scam attack detected (remote)!");
                return;
            }
            if(battle.localUnitHp == 0 || isBattle) {
                localHp = Math.max(0, localHp - damage);
            }

            await BattleModel.findOneAndUpdate({ roomid }, { 
                localHp: localHp,
                localUnitHp: Math.max(0, battle.localUnitHp - damage),

                unitTurn: nextTurn(battle.unitTurn)
            }, { new: true, upsert: true });
        }


        if(remoteHp == 0 || localHp == 0) {
            sendEvent(socket, PLAYER_SOCKET.FINISHED, {winner:localHp == 0 ? battle.remoteAddress : battle.roomid});
            sendBroadCastEvent(socket, roomid, PLAYER_SOCKET.FINISHED, {winner:localHp == 0 ? battle.remoteAddress : battle.roomid});

            const winner = localHp == 0 ? battle.remoteAddress : roomid;

            console.log("send reward to winner", winner, roomid);

            pvpLog(battle.roomid, battle.remoteAddress, battle.localUnit, battle.remoteUnit, battle.localAbility, battle.remoteAbility, battle.price, winner);
            sendPvpReward(roomid, winner, battle.price);

        } else {
            sendEvent(socket, UNIT_SOCKET.ATTACK, data);
            sendBroadCastEvent(socket, roomid, UNIT_SOCKET.ATTACK, data);
        }


    } catch(e) {

    }

}

export const handleCloseSocket = async function (data, callback) {

    let socket = this;
    let socketId = socket.id;


    let closedPlayer = "local";
    let battle = await BattleModel.findOne({localSocketId:socketId});
    if(!battle) {
        battle = await BattleModel.findOne({remoteSocketId:socketId});
        closedPlayer = "remote";
    }
    
    if(!battle) {
        console.log("battle is null, ", socketId);
        return;
    }

    const winner = closedPlayer == 'local' ? battle.remoteAddress : battle.roomid;
    const roomid = battle.roomid;

    console.log("send reward to winner", winner, roomid);

    if(winner) {
        sendBroadCastEvent(socket, roomid, PLAYER_SOCKET.FINISHED, {winner: winner});
        sendPvpReward(roomid, winner, battle.price);
    } else {
        removeCreatedUserRoom(roomid);
    }
    
}


const getAttackDetail = (type, stakedDamage) => {

    let dRand = Math.floor(Math.random() * spellTypes[type].damage.length);
    let hRand = Math.floor(Math.random() * spellTypes[type].health.length);
    
    let damage = spellTypes[type].damage[dRand];
    let health = spellTypes[type].health[hRand];
    let bonus  = spellTypes[type].bonus;

    if(bonus >= 0) {
        bonus = stakedDamage | (1<<bonus);
    } else {
        bonus = stakedDamage;
    }

    for (var i = 0; i < 32; i ++) {
        if(bonus > 0 && (bonus & (1<<i))) {
            damage += bonusDamage[i];
        }
    }

    return {damage, health, bonus};
}

export const getUnitHealth = (type) => {
    if(unitTypes[type]) return unitTypes[type].health;
    return 500;
}

export const getUnitDamage = (type) => {
    let damage = 0;
    let isBattle = false;

    if(unitTypes[type]) {
        damage = unitTypes[type].attack;
        isBattle = unitTypes[type].isBattle;
    }

    return {damage: damage, isBattle: isBattle, health: 0};
}

export const nextTurn = (currentTurn) => {

    if(currentTurn == "local") return "remote";
    return 'local';
}