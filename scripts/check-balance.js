const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log("Deployer address:", deployer.address);
  console.log("Balance:", balanceInEth, "ETH");
  
  if (balanceInEth < 0.001) {
    console.log("❌ Insufficient balance for transaction");
    console.log("Get more ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet");
  } else {
    console.log("✅ Sufficient balance for transaction");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
