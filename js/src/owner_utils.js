import {
    BUY_OPERATOR_ADDRESS, NETWORK_ID, OWNER_ADDRESS, ROYAL_MINT_ADDRESS, SELL_OPERATOR_ADDRESS, WEI
} from "./config.js";
import {OWNER_WALLET, OWNER_WEB3} from "./web3_utils.js"; // 以promise的方式引入 readFile API
import fs from "fs";
import {GAS_PRICE} from "./global_vars.js";

const RoyalMint = JSON.parse(fs.readFileSync('./contracts/RoyalMint.json'));

const contract = new OWNER_WEB3.eth.Contract(RoyalMint.abi, ROYAL_MINT_ADDRESS);

/**
 * 获取合约owner
 */
async function getOwner() {
    let owner;
    await contract.methods.owner().call().then(_owner => {
        console.log("owner:", _owner);
        owner = _owner;
    });
    return owner;
}

/**
 * 获取合约操作员
 */
async function isOperator(address) {
    let status;
    await contract.methods.operators(address).call().then(_status => {
        console.log("operatorStatus:", _status);
        status = _status === 1;
    });
    return status;
}

/**
 * 检查是否是主用户
 */
async function isOwner() {
    let owner = await getOwner();
    if (OWNER_WALLET.address !== owner) {
        console.error("NOT_OWNER");
        return false;
    }
    return true;
}

/**
 * 更新主用户
 * @param newOwner
 * @returns {Promise<void>}
 */
async function updateOwner(newOwner) {
    if (!await isOwner()) {
        return;
    }
    let data = contract.methods.updateOwner(newOwner);
    call(data);
}

/**
 * 确认主用户
 * @param newOwner
 * @returns {Promise<void>}
 */
async function confirmOwner() {
    if (!await isOwner()) {
        return;
    }
    let data = contract.methods.confirmOwner();
    call(data);
}

/**
 * 新增操作员
 * @returns {Promise<void>}
 */
async function addOperators(operators) {
    if (!await isOwner()) {
        return;
    }
    let data = contract.methods.addOperators(operators);
    call(data);
}

/**
 * 删除操作员
 * @returns {Promise<void>}
 */
async function removeOperators(operators) {
    if (!await isOwner()) {
        return;
    }
    let data = contract.methods.removeOperators(operators);
    call(data);
}

/**
 * 提款方法 只支持owner
 * token:要提币的币种address
 * amount:要提币的数量
 */
async function withdraw(token, amount) {
    if (!await isOwner()) {
        return;
    }
    let data = contract.methods.withdraw(token, amount.toString());
    call(data);
}

async function royalMint(amountIn, amountOutMin, token, swapFees, pairs) {
    if (!await isOwner()) {
        return;
    }
    let data = contract.methods.royalMint(amountIn, amountOutMin, token, swapFees, pairs);
    call(data);
}

async function call(data) {
    let dataEncode = data.encodeABI();
    let nonce = OWNER_WEB3.eth.getTransactionCount(OWNER_WALLET.address);
    let tx = {
        from: OWNER_ADDRESS,
        to: contract.options.address,
        gas: "800000",
        gasPrice: GAS_PRICE,
        data: dataEncode,
        value: 0,
        chainId: NETWORK_ID,
        nonce: nonce,
    };
    let encodeTx;
    let txHash;
    await OWNER_WALLET.signTransaction(tx).then((encodedTransaction) => {
        encodeTx = encodedTransaction.rawTransaction;
        txHash = encodedTransaction.transactionHash;
    });
    OWNER_WEB3.eth
        .sendSignedTransaction(encodeTx)
        .on("transactionHash", hash => {
            console.log(`owner transaction with ${hash}`);
        })
        .on("error", (error, receipt) => {
            console.error("owner transaction error: ", error.message);
        }).then();
}

//console.log(getOwner());

//withdraw("0x0000000000004946c0e9F43F4Dee607b0eF1fA1c", "0");

//updateOwner("0xA68f34Dd5E03cD336EDFeb1C1B935855cE416D0e");

//confirmOwner();

//addOperators([BUY_OPERATOR_ADDRESS, SELL_OPERATOR_ADDRESS]).then(r => console.log(r));

// console.log(await isOperator(BUY_OPERATOR_ADDRESS));
// console.log(await isOperator(SELL_OPERATOR_ADDRESS));

//removeOperators(["0xe98495bEc8DE9C2962da91d9Df4D54cf3ad13456", "0xA68f34Dd5E03cD336EDFeb1C1B935855cE416D0e"])

//sandrichBuy("0xdacbdecc2992a63390d108e8507b98c7e2b5584a", 0.01, 0);

//sandrichSell("0x8a9424745056eb399fd19a0ec26a14316684e274", WBNB_ADDRESS, 0);

//royalMint(BigInt(3 * WEI), 0, "0x55d398326f99059fF775485246999027B3197955", [25, 30], ["0x5bdea30054030cdaa4ed2ad0813ae0eb33add41e", "0x29ca5DaE2082F99adca32D530a7254192Cb86739"]);