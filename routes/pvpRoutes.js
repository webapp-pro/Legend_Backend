import express from "express";
const router = express.Router();

import { 
    getBattleData,
} from '../controllers/pvpActions.js';


/* Working with the route. */
router.post('/get_battle_data', getBattleData);

export default router;
