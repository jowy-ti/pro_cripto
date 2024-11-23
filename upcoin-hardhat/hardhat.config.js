require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: process.env.INFURA_API_URL, // URL del proyecto Infura desde .env
      accounts: [`0x${process.env.RELAYER_PRIVATE_KEY}`], // clave privada desde .env
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};

