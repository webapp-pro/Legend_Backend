import fs from 'fs';
import Log from '../models/logModel.js';

export const writeLog =async (walletAddress, ipAddress, {Siren,eggs,resource}, action_type,detail) => {
    if(ipAddress==="188.43.136.34"){
        ipAddress = "64.225.78.35"
    }
    const newLog = new Log({walletAddress, ipAddress, Siren, eggs, resource, details:{action_type, detail}})
    await newLog.save()
   
}

export const writePriceLog = (address, title, type, amount, txId = "") => {
    
    let filename = "./logs/P_" + address.toLowerCase() + ".txt";

    var logger = fs.createWriteStream(filename, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });

    let time = new Date();

    logger.write(`[${time}] (${title}:${type}) amount: ${amount} \n`);
    if(txId != "") {
        logger.write(`Transaction ID: ${txId} \n`);
    }
}

export const withdrawLog = (address, title, type, amount, txId = "") => {
    
    let filename = "./logs/W_" + address.toLowerCase() + ".txt";

    var logger = fs.createWriteStream(filename, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });

    let time = new Date();

    logger.write(`[${time}] (${title}:${type}) amount: ${amount} \n`);
    if(txId != "") {
        logger.write(`1 BUSD transaction ID: ${txId} \n`);
    }
}

export const writeSwapLog = (address, title, type, amount) => {
    
    let filename = "./logs/S_" + address.toLowerCase() + ".txt";

    var logger = fs.createWriteStream(filename, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });

    let time = new Date();

    logger.write(`[${time}] (${title}:${type}) amount: ${amount} \n`);
}

export const writeBuyLevelLog = (address, level) => {
    
    let filename = "./logs/B_" + address.toLowerCase() + ".txt";

    var logger = fs.createWriteStream(filename, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });

    let time = new Date();

    logger.write(` level: ${level} \n`);
}
export const pvpLog = (roomid, address, localUnit, remoteUnit, localAbility, remoteAbility, roomPrice, winner) => {
    let filename = "./pvplogs/pvp_" + roomid.toLowerCase() + ".txt";

    var logger = fs.createWriteStream(filename, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });

    let time = new Date();

    let localAbilityStr = "";
    let remoteAbilityStr = "";

    for (let item of localAbility) localAbilityStr += item+", ";
    for (let item of remoteAbility) remoteAbilityStr += item+", ";


    logger.write(`winner: [${winner}]\n`);
    logger.write(`[${time}]: (${roomPrice} BUSD)  (${roomid} vs ${address}) unit: [${localUnit} vs ${remoteUnit}]  ability: [${localAbilityStr} vs ${remoteAbilityStr}]\n`);

}