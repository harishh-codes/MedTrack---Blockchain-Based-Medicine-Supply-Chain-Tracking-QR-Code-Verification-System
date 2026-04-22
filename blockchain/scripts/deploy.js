const hre = require("hardhat");

async function main() {
  const MedicineTracker = await hre.ethers.getContractFactory("MedicineTracker");
  const tracker = await MedicineTracker.deploy();

  await tracker.waitForDeployment();

  console.log(`MedicineTracker deployed to: ${await tracker.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
