import { ethers } from "hardhat";
import fse from "fs-extra";
import path from "path";

async function main() {
  const [signer] = await ethers.getSigners();
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const withdrawer = await signer.getAddress();
  const myNFT = await MyNFT.deploy(withdrawer);

  await myNFT.deployed();

  console.log(
    `MyNFT deployed with withdrawer: ${withdrawer}  

Contract Address: ${myNFT.address}`
  );
  const filePath = path.resolve(__dirname, "../address.json");
  fse.removeSync(filePath);
  fse.writeJSONSync(filePath, { address: myNFT.address });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
