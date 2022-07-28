import {WEBSOCKET_WEB3} from "./web3_utils.js";


async function start() {
    WEBSOCKET_WEB3.eth
        .subscribe("logs", {topics: ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"]})
        .on("data", function (result) {
            //console.log(result);
            WEBSOCKET_WEB3.eth.getTransaction(result.transactionHash).then(async (transaction) => {
                console.log(transaction);
            })
        })
}

start();