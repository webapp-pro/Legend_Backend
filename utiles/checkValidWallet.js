import Web3 from 'web3'

const checkValidWallet = (wallet) => {
  return Web3.utils.isAddress(wallet)
}

export default checkValidWallet;
