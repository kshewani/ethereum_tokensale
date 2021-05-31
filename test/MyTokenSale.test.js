require("dotenv").config({ path: "../.env"});

const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");

//const chai = require("./setupChai");
var chai = require("chai");
const expect = chai.expect;

const BN = web3.utils.BN;

contract("TokenSale Test", (accounts) => {
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;
    const INITIAL_TOKENS = process.env.INITIAL_TOKENS;

    it("should not have any tokens in my deployerAccount", async () => {
        let instance = await Token.deployed();
        // expect(true).to.be.true;
        //return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens to be in the TokenSale Smart Contract by default", async () => {
        let instance = await Token.deployed();
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy tokens", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let kycInstance = await KycContract.deployed();
        await kycInstance.setKycCompleted(deployerAccount, { from: deployerAccount });
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        expect(tokenSaleInstance.sendTransaction({ from:deployerAccount, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled;
        balanceBefore = balanceBefore.add(new BN(1));
        expect(tokenSaleInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);
    });
});