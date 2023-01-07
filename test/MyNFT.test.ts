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
      const mintFee = 1000000000;
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

    it("测试提款", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployMyNFT);
      const url = "http://com.byq/image/1.png";
      const mintFee = 1000000000;
      await token.mint(otherAccount[0].address, url, {
        value: mintFee,
      });
      await token.mint(otherAccount[0].address, url, {
        value: mintFee,
      });
      await token.mint(otherAccount[0].address, url, {
        value: mintFee,
      });
      await token.mint(otherAccount[0].address, url, {
        value: mintFee,
      });
      let signerBalance = await owner.getBalance();
      console.log("signerBalance1", signerBalance.toString());
      const balance = await token.connect(owner).getBalance();
      expect(balance.toNumber()).to.equal(mintFee * 4);
      console.log("transfer", balance.toString());
      const res = await token.connect(owner).withdraw();
      console.log("gas11111", res.gasPrice?.toString());
      expect((await token.getBalance()).toNumber()).to.equal(0);
      signerBalance = await owner.getBalance();
      console.log("signerBalance2", signerBalance.toString());
      console.log("此处还有问题，提款后 账户金额还变少了");
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
