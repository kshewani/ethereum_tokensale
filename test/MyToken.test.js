require("dotenv").config({ path: "../.env"});

const Token = artifacts.require("MyToken");

const BN = web3.utils.BN;

//const chai = require("./setupChai");
var chai = require("chai");
const expect = chai.expect;

contract("Token test", (accounts) => {
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;
    const INITIAL_TOKENS = process.env.INITIAL_TOKENS;

    beforeEach(async () => {
        this.myToken = await Token.new(INITIAL_TOKENS);
    });

    it("all tokens should be in my account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        // let balance = await instance.balanceOf(accounts[0]);
        // assert.equal(balance.valueOf(), initialSuppy.valueOf(), "The balance does not match");
        // instance.balanceOf(deployerAccount).then((b) => console.log('balance: ', b));
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("is possible to send tokens between accounts", async() => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipientAccount, sendTokens)).to.eventually.to.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("is not possible to send more tokens than total supply of tokens", async () => {
        let instance = this.myToken;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipientAccount, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;
        expect(instance.balanceOf(deployerAccount)).to.eventually.to.be.a.bignumber.equal(balanceOfDeployer);
    });
});