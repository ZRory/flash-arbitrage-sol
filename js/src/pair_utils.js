import {HTTP_WEB3} from "./web3_utils.js";
import fs from "fs";
import {WEI} from "./config.js";

const Pair = JSON.parse(fs.readFileSync("./contracts/IPair.json"));

function sortTokens(tokenA, tokenB) {
    return tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
}

export function calPairAddress(tokenA, tokenB, factoryAddress, hex) {
    let token0;
    let token1;
    [token0, token1] = sortTokens(tokenA, tokenB);
    let abiEncoded1 = HTTP_WEB3.eth.abi.encodeParameters(['address', 'address'], [token0, token1]);
    abiEncoded1 = abiEncoded1.split("0".repeat(24)).join("");
    let salt = HTTP_WEB3.utils.soliditySha3(abiEncoded1);
    let abiEncoded2 = HTTP_WEB3.eth.abi.encodeParameters(['address', 'bytes32'], [factoryAddress, salt]);
    abiEncoded2 = abiEncoded2.split("0".repeat(24)).join("").substr(2);
    let pair = '0x' + HTTP_WEB3.utils.soliditySha3('0xff' + abiEncoded2, hex).substr(26);
    return pair;
}

export function getAmountIn(amountOut, reserveIn, reserveOut, swapFee) {
    let numerator = reserveIn * amountOut * BigInt(10000);
    let denominator = (reserveOut - amountOut) * BigInt(10000 - swapFee);
    let amountIn = (numerator / denominator) + BigInt(1);
    return amountIn;
}

export async function getReserves(tokenA, tokenB, factoryAddress, hex) {
    let pairAddress = calPairAddress(tokenA, tokenB, factoryAddress, hex);
    //console.log(pairAddress);
    let pair = new HTTP_WEB3.eth.Contract(Pair.abi, pairAddress);
    let reserve0;
    let reserve1;
    await pair.methods.getReserves().call().then((result) => {
        reserve0 = BigInt(result.reserve0);
        reserve1 = BigInt(result.reserve1);
    });
    let token0;
    let token1;
    [token0, token1] = sortTokens(tokenA, tokenB);
    return tokenA == token0 ? [reserve0, reserve1] : [reserve1, reserve0];
}

export function getAmountOut(amountIn, reserveIn, reserveOut, swapFee) {
    let amountInWithFee = amountIn * BigInt(10000 - swapFee);
    let numerator = amountInWithFee * (reserveOut);
    let denominator = reserveIn * BigInt(10000) + (amountInWithFee);
    let amountOut = numerator / denominator;
    return amountOut;
}

export async function getAmountsOut(amountIn, path, factoryAddress, hex, swapFee) {
    let amounts = [];
    let reserves = [];
    amounts[0] = amountIn;
    for (let i = 0; i < path.length - 1; i++) {
        let [reserveIn, reserveOut] = await getReserves(path[i], path[i + 1], factoryAddress, hex);
        reserves.push([reserveIn, reserveOut]);
        amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut, swapFee);
    }
    return [amounts, reserves];
}


//tokenA = token1 = WBNB
//tokenB = token0 = CAKE
let pairAddress = calPairAddress("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", "0xca143ce32fe78f1f7019d7d551a6402fc5350c73", "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5");
console.log(pairAddress);

//
// let [reserveA, reserveB] = await getReserves("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", "0xca143ce32fe78f1f7019d7d551a6402fc5350c73", "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5");
// console.log("reserveA:" + reserveA);
// console.log("reserveB:" + reserveB);
//
// let amountOut = getAmountOut(BigInt(1 * WEI), reserveA, reserveB, "25");
// console.log("1个BNB可以买到多少cake？" + Number(amountOut) / WEI);

