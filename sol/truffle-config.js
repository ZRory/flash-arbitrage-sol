/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {

    networks: {
        mainnet: {
            provider: () => new HDWalletProvider("", "https://speedy-nodes-nyc.moralis.io/3eaa52f6335d5c0d9b1117ed/bsc/mainnet"),
            network_id: 56
        },

        testnet: {
            provider: () => new HDWalletProvider("", "https://data-seed-prebsc-1-s1.binance.org:8545/"),
            network_id: 97
        },
    },

    mocha: {
        timeout: 1000000
    },

    compilers: {
        solc: {
            version: ">=0.5.0 <0.8.0",
        }
    },

};
