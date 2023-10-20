import express from "express";
const router = express.Router();

import { authAdmin, authUser } from '../middleWare/authorization.js';

import { 
    getBalance,
    buyLevel,
    swapResource, 
    swapEgg, 
    deposit,
    withdraw,

    stakebird,
    stakediamond,
    claimbird,
    claimdiamond,

    getPremium,
    buyLand,

    buyMining,
    claimMining,
    requestMining,
    saveDiscord,

    myAction,

    plantResource,
    getResource,
    getCheckWithdrawable,
    login,
    update,
    get24Withdrew,
    getBcsTokenPrice,
    getProfile,
    modifyItem,
    reviveItem,
    referalAdd,
    resource,
    upgradeWall,
    swapEnergy,
    setCurrentCharacter,
    checkCoolDown,
    setCoolDown,
    claimSiren,
    checkUpgradeAvailable,
    startHunterUpgradeCooldown,
    claimHunter,
    hunterLevelUp,
    getHistory,
    getHistoryByWallet,
} from '../controllers/userActions.js';
import {  setRoomData } from "../controllers/roomActions.js";


/* Working with the route. */
router.post('/login', login)
// router.post('/update', authAdmin, update)
router.post('/update', update)
router.post('/', getBalance);
router.post('/buy/level', buyLevel);
router.post('/claim/siren', claimSiren);
router.post('/claim/hunter', claimHunter);
router.post('/levelup/hunter', hunterLevelUp);
router.post('/check/upgradeavailable',checkUpgradeAvailable)
router.post('/check/cooldown', checkCoolDown);
router.post('/start/hunter-upgrade-cooldown',startHunterUpgradeCooldown)
router.post('/set/cooldown', setCoolDown);

router.post('/swap/resource', swapResource);
router.post('/swap/energy', swapEnergy);
router.post('/upgrade/wall', upgradeWall);
router.post('/swap/egg', swapEgg);
router.post('/myaction', myAction);
router.post('/deposit', deposit);
router.post('/resource', resource);
router.post('/withdraw', withdraw);

router.post('/stake/bird', stakebird);
router.post('/stake/diamond', stakediamond);

router.post('/claim/bird', claimbird);
router.post('/claim/diamond', claimdiamond);

router.post('/buypremium', getPremium);
router.post('/buymap', buyLand);
router.post('/buymining', buyMining);
router.post('/requestmining', requestMining);
router.post('/claimmining', claimMining);

router.post('/plant/set', plantResource);
router.post('/plant/get', getResource);

router.post('/discord', saveDiscord);
router.post('/check-withdrawable', getCheckWithdrawable);
router.post('/get-withdrew-amount', get24Withdrew)
router.get('/get-bcs-price', getBcsTokenPrice)

router.post('/room', setRoomData)
router.post('/current-character', setCurrentCharacter)
router.post('/profile', getProfile)
router.post('/item/revive', reviveItem)
router.post('/item', modifyItem)
router.post('/referal', referalAdd)

router.post('/history',getHistory)
router.post('/history-by-wallet',getHistoryByWallet)
export default router;
