import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });

// export const chainId = 97;
// export const PREMIUM_COST = 0.01;
// export const LAND_COST = 0.01;

// export const chainId = 97; // Binance Smart Chain Testnet ChainId
export const chainId = 56; // Binance Smart Chain Mainnet ChainId

export const PREMIUM_COST = chainId==97 ? 1 : 25; // 50
export const LAND_COST = chainId==97 ? [1, 1, 1] : [4320, 1000, 3240]; // 25
export const MINING_COST = chainId==97 ? 1 : 150; // 200
export const MINING_CLAIM = 3000; // 3000
export const MINING_TIMER = 24 * 60 * 60;
export const WEEKLY_SWAP_LIMIT = 20000;

export const WITHDRAW_TIMER = 8 * 24 * 60 * 60;

export const MINING = {
    "default" : {
        COST: chainId==97 ? 1 : 8100,
        CLAIM: 3000,
        REQUEST: 300,
        TIMER: 24*60*60,
        TOKEN: "BCS",
    },
    "gold" : {
        COST: chainId==97 ? 1 : 5040,
        CLAIM: 300,
        REQUEST: 20,
        TIMER: 3*60*60,
        TOKEN: "BCS",
    },
    "uranium" : {
        COST: chainId==97 ? 1 : 6700,
        CLAIM: 400,
        REQUEST: 30,
        TIMER: 3*60*60,
        TOKEN: "BCS",
    },
    "power" : {
        COST: chainId==97 ? 1 : 40000,
        CLAIM: 9000,
        REQUEST: 3000,
        TIMER: 12*60*60,
        TOKEN: "BCS",
    }
}
// export const STAKE_TIMER = 3 * 60 * 60;
export const STAKE_TIMER = 30;


export const RPC_URL = {
    56: "https://bsc-dataseed1.binance.org:443",
    97: "https://data-seed-prebsc-1-s3.binance.org:8545/",
};

export const NETWORK_NAMES = {
    56: "BSC Mainnet",
    97: "BSC Testnet",
};

export const ADMIN_WALLET_ADDRESS = {
    56: process.env.ADMINISTRATOR_WALLET_MAINNET,
    97: process.env.ADMINISTRATOR_WALLET_TESTNET,
};

export const BUSD_CONTRACT_ADDRESS = {
    56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    97: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
};

export const TOKEN_CONTRACT_ADDRESS = {
    56: "0x06362babf34aa1880d9669c3793e1c03062ff200",
    97: "0x06362babf34aa1880d9669c3793e1c03062ff200",
};

export const PVP_CONTRACT_ADDRESS = {
    56: "0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0",
    97: "0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0",
};

export const BCS_CONTRACT_ADDRESS = {
    56: '0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B',
    97: '0xE606cFd86d134b16178b95bf6E5ee8A3F55d8B4F',
}

// export const POOL_WALLET_ADDRESS = {
//     56: "0xAccEe92795919145843132a3E6c135f27c897C6E", // INCORRECT
//     97: "0x0a28e740F270e2c25646F5E0189CDFE175546E29",
// };

export const POOL_WALLET_ADDRESS = {
    // 56: process.env.POOL_WALLET_ADDRESS_MAINNET, // INCORRECT
    // 97: process.env.POOL_WALLET_ADDRESS_TESTNET,
    56: '0xcCd8d09590D5207E823Ab688636aF2F23B6B6DcE', // INCORRECT
    97: '0xcCd8d09590D5207E823Ab688636aF2F23B6B6DcE',
};

export const POOL_WALLET_PVK = {
    // 56: process.env.POOL_WALLET_PRIVATE_KEY, // INCORRECT
    // 97: process.env.POOL_WALLET_PRIVATE_KEY,
    56: '039606c4f024a39ef24be660ed272ae317cbb74c148443ec4c1373e47611d6b7',
    97: '039606c4f024a39ef24be660ed272ae317cbb74c148443ec4c1373e47611d6b7',
};

export const PANCAKE_LP_ADDRESS = {
    56: '0xA36624401BA2a19b819ff41fE954673F49631F8a',
    97: '0xA36624401BA2a19b819ff41fE954673F49631F8a',
}

export const WBNB_ADDRESS = {
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    97: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
}
