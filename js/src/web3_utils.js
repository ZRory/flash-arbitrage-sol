import {
    BUY_OPERATOR_PRIVATE_KEY,
    NETWORK_HTTPS_HOST,
    NETWORK_WSS_HOST,
    OWNER_PRIVATE_KEY,
    PUBLIC_HTTPS_HOST,
    SELL_OPERATOR_PRIVATE_KEY
} from "./config.js";
import Web3 from 'web3';

export const PUBLIC_HTTP_WEB3 = new Web3(
    new Web3.providers.HttpProvider(
        PUBLIC_HTTPS_HOST, {
            reconnect: {
                auto: true,
                delay: 5000, // ms
                maxAttempts: 30,
                onTimeout: false
            }
        })
);

export const HTTP_WEB3 = new Web3(
    new Web3.providers.HttpProvider(
        NETWORK_HTTPS_HOST, {
            reconnect: {
                auto: true,
                delay: 5000, // ms
                maxAttempts: 30,
                onTimeout: false
            }
        })
);

export const WEBSOCKET_WEB3 = new Web3(
    new Web3.providers.WebsocketProvider(
        NETWORK_WSS_HOST, {
            reconnect: {
                auto: true,
                delay: 5000, // ms
                maxAttempts: 30,
                onTimeout: false
            }
        }
    )
);

export const OWNER_WEB3 = new Web3(
    new Web3.providers.HttpProvider(
        NETWORK_HTTPS_HOST, {
            reconnect: {
                auto: true,
                delay: 5000, // ms
                maxAttempts: 30,
                onTimeout: false
            }
        })
);

export const OWNER_WALLET = OWNER_WEB3.eth.accounts.privateKeyToAccount(
    OWNER_PRIVATE_KEY
);

export const BUY_OPERATOR_WALLET = PUBLIC_HTTP_WEB3.eth.accounts.privateKeyToAccount(
    BUY_OPERATOR_PRIVATE_KEY
);

export const SELL_OPERATOR_WALLET = PUBLIC_HTTP_WEB3.eth.accounts.privateKeyToAccount(
    SELL_OPERATOR_PRIVATE_KEY
);


/**
 * 获取gas费
 */
export async function getGasPrice() {
    let gasPrice;
    await HTTP_WEB3.eth.getGasPrice((error, _gasPrice) => {
        gasPrice = _gasPrice;
    })
    return gasPrice;
}

export async function getTransactionCount(address) {
    let nonce;
    await HTTP_WEB3.eth.getTransactionCount(address).then(_nonce => {
        nonce = Number(_nonce);
    });
    return nonce;
}

export async function estimateGas(transaction) {
    //预估GAS费
    let tx = {
        from: transaction.from,
        to: transaction.to,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        data: transaction.input,
        value: transaction.value
    };
    let estimateGas;
    await HTTP_WEB3.eth.estimateGas(tx).then(r =>
        estimateGas = r
    );
    return estimateGas;
}

// HTTP_WEB3.eth.getTransaction("0x51ee533edb39eb819d4538297c19c7f46c5a671a9eda35520942ccaf9c7a9d45").then(async (transaction) => {
//     let estimateGass = await estimateGas(transaction);
//     console.log(estimateGass);
// });

// let transactionCount = await getTransactionCount("0x8757656c0033D9761726d4d6F0d807D4411769FF");
// console.log(transactionCount);
