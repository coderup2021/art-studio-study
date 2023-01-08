import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("MyNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMyNFT() {
    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccount] = await ethers.getSigners();

    const MyNFT = await ethers.getContractFactory("MyNFT");
    const token = await MyNFT.deploy(owner.address);

    return { token, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("mint", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployMyNFT);
      const url = "http://com.byq/image/1.png";
      const mintFee = (10 * 10 ** 15).toString();
      const tokenId = await token.mint(otherAccount[0].address, url, {
        value: mintFee,
      });
      const tokenOwner = await token.ownerOf(0);
      expect(tokenOwner).to.equal(otherAccount[0].address);
      const tokenUrl = await token.tokenURI(0);
      expect(tokenUrl).to.equal(url);
      const balanceOf = await token.balanceOf(tokenOwner);
      expect(balanceOf.toNumber()).to.equal(1);

      await expect(
        token.connect(otherAccount[0]).withdraw()
      ).to.be.revertedWith("no permission to withdraw");

      await expect(
        token.connect(otherAccount[0]).getBalance()
      ).to.be.revertedWith("not owner");
    });

    it("提款后的金额应该是OK的", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployMyNFT);
      const url = "http://com.byq/image/1.png";
      const mintFee = "100000000000000";
      await token.mint(otherAccount[0].address, url, {
        value: mintFee,
      });

      //原金额
      let signerBalance1 = await owner.getBalance();
      console.log("原金额:", signerBalance1.toString());

      //提款金额
      const balance = await token.connect(owner).getBalance();
      expect(balance.toString()).to.equal(mintFee);
      console.log("提款金额:", balance.toString());
      const transaction = await token.connect(owner).withdraw();
      const ts = await transaction.wait();

      //使用的gas费用
      const gasUsed = ts.cumulativeGasUsed.mul(ts.effectiveGasPrice);
      console.log("使用的gas费用:", gasUsed.toString());
      expect((await token.getBalance()).toNumber()).to.equal(0);

      //提款后的金额
      const signerBalance2 = await owner.getBalance();
      console.log("提款后的金额:", signerBalance2.toString());

      expect(signerBalance1.add(balance).sub(gasUsed)).to.equal(signerBalance2);
    });

    it("mint should emit event Mint", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployMyNFT);
      const url = "http://com.byq/image/1.png";
      const tokenId = await token.mint(otherAccount[0].address, url, {
        value: 1000000000,
      });
      await expect(
        token.mint(otherAccount[0].address, url, { value: 1000000000 })
      )
        .to.emit(token, "Mint")
        .withArgs(otherAccount[0].address, url);
    });
  });
});
