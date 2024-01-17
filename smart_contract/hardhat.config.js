require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/m7E3m1Q5MnjRIgvcS3TJrPFLHiBdeJuO",
      accounts: [
        "23fad07150ae3937fbfc81be2c724a69c7604b7eb6307ae192b1e321cf56ce30",
      ],
    },
  },
};
