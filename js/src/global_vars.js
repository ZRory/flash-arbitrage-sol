import {getGasPrice, getTransactionCount} from "./web3_utils.js";
import {BUY_OPERATOR_ADDRESS, SELL_OPERATOR_ADDRESS} from "./config.js";
import fs from "fs";

export let GAS_PRICE = await getGasPrice();

export let BUY_OPERATOR_NONCE = await getTransactionCount(BUY_OPERATOR_ADDRESS);

export let SELL_OPERATOR_NONCE = await getTransactionCount(SELL_OPERATOR_ADDRESS);

//一分钟更新一次gas费率
setInterval(async function () {
    GAS_PRICE = await getGasPrice();
}, 60 * 1000)

export function incrGetBuyOperatorNonce() {
    return BUY_OPERATOR_NONCE++;
}

export function incrGetSellOperatorNonce() {
    return SELL_OPERATOR_NONCE++;
}

//export const TRUST_TOKENS = JSON.parse(await fs.readFileSync('./tokens/trust.json'));

//export const FAKE_TOKENS = JSON.parse(await fs.readFileSync('./tokens/fake.json'));

export const NEW_TOKEN_LOCK = {};

//一分钟存储一次json交易对信息
// setInterval(async function () {
//     fs.writeFileSync("./tokens/trust.json", JSON.stringify(TRUST_TOKENS));
//     fs.writeFileSync("./tokens/fake.json", JSON.stringify(FAKE_TOKENS));
// }, 60 * 1000)