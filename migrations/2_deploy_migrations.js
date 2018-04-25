var Migrations = artifacts.require("./Lottery.sol");

module.exports = function(deployer , network, accounts) {
  deployer.deploy(Migrations , '9' , {from : accounts[0]});
};
