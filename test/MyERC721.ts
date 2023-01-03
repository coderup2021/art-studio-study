import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("MyERC721", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMyERC721() {
    const totalSupply = 100000000;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const MyNFT = await ethers.getContractFactory("MyERC721");
    const token = await MyNFT.deploy();

    return { token, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("mint", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployMyERC721);
      const url = "http://com.byq/image/1.png";
      const tokenId = await token.mint(url);
      //   console.log("tokenId", tokenId);
      const tokenOwner = await token.ownerOf(0);
      //   console.log("tokenOwner", tokenOwner);
      expect(tokenOwner).to.equal(owner.address);
      const tokenUrl = await token.tokenURI(0);
      expect(tokenUrl).to.equal(url);
      const balanceOf = await token.balanceOf(tokenOwner);
      expect(balanceOf).to.equal(1);
    });
    it("mint list", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployMyERC721);
      const url1 = "http://com.byq/image/1.png";
      const url2 = "http://com.byq/image/2.png";
      const url3 = "http://com.byq/image/3.png";
      await token.mint(url1);
      await token.mint(url2);
      await token.mint(url3);
      const balance: BigNumber = await token.balanceOf(owner.address);
      expect(balance.toNumber()).to.equal(3);
      const tokenURIS = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await token.tokenOfOwnerByIndex(owner.address, i);
        const tokenURI = await token.tokenURI(tokenId);
        tokenURIS.push(tokenURI);
      }
      expect(tokenURIS[0]).to.equal(url1);
      expect(tokenURIS[1]).to.equal(url2);
      expect(tokenURIS[2]).to.equal(url3);
    });
  });
});
