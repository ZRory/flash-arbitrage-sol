const Eagle = artifacts.require("Eagle");

module.exports = function (deployer) {
    deployer.deploy(Eagle);
};
