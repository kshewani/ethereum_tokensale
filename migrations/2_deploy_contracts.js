var MyToken = artifacts.require("MyToken");
var MyTokenSale = artifacts.require("MyTokenSale");
var MyKycContract = artifacts.require("KycContract");
require("dotenv").config({ path: "../.env"});

module.exports = async (deployer) => {
    let addr = await web3.eth.getAccounts();
    const INITIAL_TOKENS = process.env.INITIAL_TOKENS;
    await deployer.deploy(MyToken, INITIAL_TOKENS);
    await deployer.deploy(MyKycContract);
    await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, MyKycContract.address);
    let instance = await MyToken.deployed();
    instance.transfer(MyTokenSale.address, INITIAL_TOKENS);
}