import {estimateGas, HTTP_WEB3, WEBSOCKET_WEB3} from "./web3_utils.js";
import {GAS_PRICE} from "./global_vars.js";
import {BASE_TOKENS, FINANCES} from "./config.js";

import fs from "fs";
import InputDataDecoder from "ethereum-input-data-decoder";
import {getAmountsOut} from "./pair_utils.js";

const Router = JSON.parse(fs.readFileSync("./contracts/IRouter.json"));

const RouterDecoder = new InputDataDecoder(Router.abi);

async function start() {
    WEBSOCKET_WEB3.eth
        .subscribe("pendingTransactions")
        .on("data", function (transactionHash) {
            HTTP_WEB3.eth.getTransaction(transactionHash).then(async (transaction) => {
                //1.transaction为空 过滤
                if (transaction == null) {
                    return [false];
                }
                //GAS费过低 过滤
                if (transaction.gasPrice < GAS_PRICE) {
                    return [false];
                }
                if (transaction.to == null) {
                    return [false];
                }
                //2.目标地址不是swap_router 过滤
                let targetFinance = FINANCES.find(x => {
                    return transaction.to.toLowerCase() === x.routerAddress
                });
                if (targetFinance == null) {
                    return [false];
                }
                //3.tx已经成交，过滤
                if (transaction.blockHash != null) {
                    return [false];
                }
                //5.如果调用的方法不是以下几种 过滤
                let decodedData = RouterDecoder.decodeData(transaction.input);
                let path;
                let amountIn;
                if (decodedData.method == "swapETHForExactTokens"
                    || decodedData.method == "swapExactETHForTokens") {
                    path = decodedData.inputs[1];
                    amountIn = BigInt(transaction.value);
                } else if (decodedData.method == "swapExactTokensForTokens"
                    || decodedData.method == "swapExactTokensForETH") {
                    path = decodedData.inputs[2];
                    amountIn = BigInt(decodedData.inputs[0]);
                } else if (decodedData.method == "swapTokensForExactTokens"
                    || decodedData.method == "swapTokensForExactETH") {
                    path = decodedData.inputs[2];
                    amountIn = BigInt(decodedData.inputs[1]);
                } else {
                    return [false];
                }
                for (let i = 0; i < path.length; i++) {
                    path[i] = "0x" + path[i].toLowerCase();
                }
                console.log(await estimateGas(transaction));
                calMint(amountIn, path, targetFinance);
            })
        })
}

start().then();

async function calMint(targetAmountIn, targetPath, targetFinance) {
    //获取可能的交易币种类
    let pairs = [];
    let [amounts, reserves] = await getAmountsOut(targetAmountIn, targetPath, targetFinance.factoryAddress, targetFinance.hex, targetFinance.fee);
    for (let i = 0; i < targetPath.length; i++) {
        let token = BASE_TOKENS.find(x => x.address === targetPath[i]);
        if (token != null) {
            //console.log("所有交易对：", targetPath);
            //找到可能為目標的token
            if (i == 0) {
                let outToken = BASE_TOKENS.find(x => x.address === targetPath[i + 1]);
                if (outToken == null) {
                    //console.log("可能的交易对为：", targetPath[i], targetPath[i + 1]);
                    //pairs.push([targetPath[i], targetPath[i + 1], amounts[i], amounts[i + 1], "buy"])
                    pairs.push({
                        "tokenIn": targetPath[i],
                        "tokenOut": targetPath[i + 1],
                        "amountIn": amounts[i],
                        "amountOut": amounts[i + 1],
                        "reserveIn": reserves[i][0] - amounts[i],
                        "reserveOut": reserves[i][1] - amounts[i + 1],
                        "type": "buy"
                    })
                }
            } else if (i > 0 && i < targetPath.length - 1) {
                let inToken = BASE_TOKENS.find(x => x.address === targetPath[i - 1]);
                let outToken = BASE_TOKENS.find(x => x.address === targetPath[i + 1]);
                if (inToken == null) {
                    //console.log("可能的交易对为：", targetPath[i - 1], targetPath[i]);
                    //pairs.push([targetPath[i - 1], targetPath[i], "sell"])
                    pairs.push({
                        "tokenIn": targetPath[i - 1],
                        "tokenOut": targetPath[i],
                        "amountIn": amounts[i - 1],
                        "amountOut": amounts[i],
                        "reserveIn": reserves[i - 1][0] - amounts[i - 1],
                        "reserveOut": reserves[i - 1][1] - amounts[i],
                        "type": "sell"
                    })
                }
                if (outToken == null) {
                    //console.log("可能的交易对为：", targetPath[i], targetPath[i + 1]);
                    //pairs.push([targetPath[i], targetPath[i + 1], "buy"])
                    pairs.push({
                        "tokenIn": targetPath[i],
                        "tokenOut": targetPath[i + 1],
                        "amountIn": amounts[i],
                        "amountOut": amounts[i + 1],
                        "reserveIn": reserves[i][0] - amounts[i],
                        "reserveOut": reserves[i][1] - amounts[i + 1],
                        "type": "buy"
                    })
                }
            } else if (i == targetPath.length - 1) {
                let inToken = BASE_TOKENS.find(x => x.address === targetPath[i - 1]);
                if (inToken == null) {
                    //console.log("可能的交易对为：", targetPath[i - 1], targetPath[i]);
                    //pairs.push([targetPath[i - 1], targetPath[i], "sell"])
                    pairs.push({
                        "tokenIn": targetPath[i - 1],
                        "tokenOut": targetPath[i],
                        "amountIn": amounts[i - 1],
                        "amountOut": amounts[i],
                        "reserveIn": reserves[i - 1][0] - amounts[i - 1],
                        "reserveOut": reserves[i - 1][1] - amounts[i],
                        "type": "sell"
                    })
                }
            }
        }
    }
    if (pairs.length == 0) {
        return;
    }
    console.log(pairs);
    //开始处理交易对
    for (let pair of pairs) {
        if (pair.type === "buy") {
            //用baseToken->买入其他token
            //在同一交易所卖出这个token
            //寻找最优交换交易对
            for (let token of BASE_TOKENS) {
                if (token.address === pair.tokenIn) {
                    continue;
                }
                let profit = 0;
                while (true) {

                }
            }
        }
    }
}