import axios from 'axios'
import Web3 from 'web3';
import BCS_ABI from "../utiles/bcs_abi.js";
import Provider from '@truffle/hdwallet-provider';
import PVP_CONTRACT_ABI from "../utiles/pvp_abi.js"
// import { withdrawLog, writeLog, writePriceLog, writeSwapLog } from '../utiles/logController.js';
import WBNB_ABI from '../utiles/wbnb_abi.js'

import { 
    chainId,
    RPC_URL,
    // NETWORK_NAMES,
    ADMIN_WALLET_ADDRESS,
    // BUSD_CONTRACT_ADDRESS,
    // TOKEN_CONTRACT_ADDRESS,
    POOL_WALLET_ADDRESS,
    POOL_WALLET_PVK ,
    // PREMIUM_COST,
    // LAND_COST,
    // MINING_TIMER,
    // STAKE_TIMER,
    // MINING_COST,
    // MINING_CLAIM,
    // MINING,
    // WITHDRAW_TIMER,
    // WEEKLY_SWAP_LIMIT,
    PVP_CONTRACT_ADDRESS,
    BCS_CONTRACT_ADDRESS,
    PANCAKE_LP_ADDRESS,
    WBNB_ADDRESS
} from '../utiles/constants.js';
import { RESPONSE } from '../utiles/response.js';
import Withdraw from '../models/withdrawModel.js';

export const handleTransaction = async (web3, tx, contract, from, to, pk) => {

    const gas = await tx.estimateGas({ from: from });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(from);

    const signedTx = await web3.eth.accounts.signTransaction({
        to: contract,
        data,
        gas,
        gasPrice,
        nonce,
        chainId
    }, pk)

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}
export const sendPvpReward = async (roomid, winner, rawAmount) => {

    let from = POOL_WALLET_ADDRESS[chainId];

    try {
        const provider = new Provider(POOL_WALLET_PVK[chainId], RPC_URL[chainId]);
        const web3 = new Web3(provider);
    
        var pvpContract = new web3.eth.Contract(PVP_CONTRACT_ABI, PVP_CONTRACT_ADDRESS[chainId]);

        const tx = pvpContract.methods.sendReward(winner, roomid);

        const gas = await tx.estimateGas({ from: from });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(from);
    
        const signedTx = await web3.eth.accounts.signTransaction({
          to: PVP_CONTRACT_ADDRESS[chainId],
          data,
          gas,
          gasPrice,
          nonce,
          chainId
        }, POOL_WALLET_PVK[chainId])

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return receipt;

    } catch (e) {
        console.log("SendToken Error:", rawAmount, e);
    }

    return true;
}

export const sendBCS = async (spender, rawAmount) => {
    
    const from = ADMIN_WALLET_ADDRESS[chainId];

    const contractAddress = BCS_CONTRACT_ADDRESS[chainId]
    console.log('from ', from, ', to ', spender, ', amount ', rawAmount, contractAddress)
    try {
        const provider = new Provider(POOL_WALLET_PVK[chainId], RPC_URL[chainId]);
        const web3 = new Web3(provider);
        
        var bcsContract = new web3.eth.Contract(BCS_ABI, contractAddress);
        
        let amount = web3.utils.toWei(rawAmount.toString(), "gwei")
        const tx = bcsContract.methods.transfer(spender, amount);
        
        return await handleTransaction(web3, tx, contractAddress, from, spender, POOL_WALLET_PVK[chainId])
    } catch (e) {
        console.log("SendToken Error:", rawAmount, e);
    }
}

export const removeCreatedUserRoom = async (roomid) => {

    let from = POOL_WALLET_ADDRESS[chainId];

    try {
        const provider = new Provider(POOL_WALLET_PVK[chainId], RPC_URL[chainId]);
        const web3 = new Web3(provider);
    
        var pvpContract = new web3.eth.Contract(PVP_CONTRACT_ABI, PVP_CONTRACT_ADDRESS[chainId]);

        const tx = pvpContract.methods.removeLeftRoom(roomid);

        const gas = await tx.estimateGas({ from: from });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(from);
    
        const signedTx = await web3.eth.accounts.signTransaction({
          to: PVP_CONTRACT_ADDRESS[chainId],
          data,
          gas,
          gasPrice,
          nonce,
          chainId
        }, POOL_WALLET_PVK[chainId])

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return receipt;

    } catch (e) {
        console.log("SendToken Error:", e);
    }

    return true;
}

export const getTokenBalance = async (contract, abi, holder) => {
    console.log('get token balance of: ', contract, ' holder ', holder)
    const provider = new Provider(POOL_WALLET_PVK[chainId], RPC_URL[chainId]);
    const web3 = new Web3(provider);

    const tokenContract = new web3.eth.Contract(abi, contract)

    const balance = await tokenContract.methods.balanceOf(holder).call()

    return balance
}

export const getBnbPrice = async () => {
    // return await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd')
    // const res = await axios.get('https://rest.coinapi.io/v1/exchangerate/BNB/USD', {
    //     headers: {
    //         'X-CoinAPI-Key': process.env.COINAPI_API_KEY,
    //     }
    // })
    // console.log('get bnb price ', res.data)
    // return res.data.rate;
    return 247
}

export const getBcsPrice = async () => {
    // return 0.01 ;
    
    const bcsDecimals = 9
    const wbnbDecimals = 18

    const bcsBalance = await getTokenBalance(BCS_CONTRACT_ADDRESS[chainId], BCS_ABI, PANCAKE_LP_ADDRESS[chainId])
    
    const wbnbBalance = await getTokenBalance(WBNB_ADDRESS[chainId], WBNB_ABI, PANCAKE_LP_ADDRESS[chainId])
    // const res = await getBnbPrice()
    // console.log('bnb price ', res.data.binancecoin)
    const bnbPrice = await getBnbPrice()

    return (wbnbBalance / Math.pow(10, wbnbDecimals)) / (bcsBalance / Math.pow(10, bcsDecimals)) * parseInt(bnbPrice);
}

export const getTokenPrice = async (contract, abi, holder) => {
    
}
