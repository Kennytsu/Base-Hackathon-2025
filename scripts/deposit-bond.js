const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0x15ae73296Ebc62c47bd6760Cc0E99eDb73259283";
  
  console.log("Deployer address:", deployer.address);
  console.log("Contract address:", contractAddress);
  
  // Get the contract
  const SwearJar = await ethers.getContractFactory("SwearJar");
  const swearJar = SwearJar.attach(contractAddress);
  
  // Deposit 0.001 ETH as bond
  const bondAmount = ethers.parseEther("0.001");
  console.log("Depositing bond:", ethers.formatEther(bondAmount), "ETH");
  
  try {
    const tx = await swearJar.depositBond({ value: bondAmount });
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // Check new bond balance
    const bondBalance = await swearJar.getBond(deployer.address);
    console.log("New bond balance:", ethers.formatEther(bondBalance), "ETH");
    
    console.log("\n🔗 View on BaseScan:");
    console.log(`https://sepolia.basescan.org/tx/${tx.hash}`);
    
  } catch (error) {
    console.error("❌ Transaction failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
