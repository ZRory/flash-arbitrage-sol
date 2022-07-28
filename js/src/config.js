//网络id
export const NETWORK_ID = 56;
//网络接口地址
export const NETWORK_HTTPS_HOST = "https://bsc-dataseed1.defibit.io/";
export const PUBLIC_HTTPS_HOST = "https://bsc-dataseed1.defibit.io/";
export const NETWORK_WSS_HOST = "ws://5.9.104.24:8899";

//印钞厂地址
export const ROYAL_MINT_ADDRESS = "0x4E434787789cBC29e5600F7695aA107821B2b81e";
//合约owner信息
export const OWNER_ADDRESS = "0x03a18e99093c0fbe4de8f00528488a388429ea28";
export const OWNER_PRIVATE_KEY = "";
//买入操作员信息
export const BUY_OPERATOR_ADDRESS = "0x042c14308aa468eea68a7b3b6f05f4e4b30c3620";
export const BUY_OPERATOR_PRIVATE_KEY = "";
//卖出操作员信息
export const SELL_OPERATOR_ADDRESS = "0x05dc5885b426c0100c216bcb3e3b2a0de913699a";
export const SELL_OPERATOR_PRIVATE_KEY = "";

export const WEI = 10 ** 18;

export const BASE_TOKENS = [
    {name: "WBNB", address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"},
    {name: "USDC", address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"},
    {name: "USDT", address: "0x55d398326f99059ff775485246999027b3197955"},
    {name: "BUSD", address: "0xe9e7cea3dedca5984780bafc599bd69add087d56"},
]

export const FINANCES = [
    {
        name: "pancakeSwap",
        url: "https://pancakeswap.finance/swap",
        tokenAddress: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
        factoryAddress: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
        routerAddress: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
        hex: "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5",
        fee: 25
    },
    {
        name: "biSwap",
        url: "https://exchange.biswap.org/#/swap",
        tokenAddress: "0x965f527d9159dce6288a2219db51fc6eef120dd1",
        factoryAddress: "0x858e3312ed3a876947ea49d572a7c42de08af7ee",
        routerAddress: "0x3a6d8ca21d1cf76f653a67577fa0d27453350dd8",
        hex: "0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf",
        fee: 10
    },
    {
        name: "apeSwap",
        url: "https://apeswap.finance/swap",
        tokenAddress: "0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95",
        factoryAddress: "0x0841bd0b734e4f5853f0dd8d7ea041c241fb0da6",
        routerAddress: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
        hex: "0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b",
        fee: 20
    },
    {
        name: "pandoraSwap",
        url: "https://pandora.digital/swap",
        tokenAddress: "0xb72ba371c900aa68bb9fa473e93cfbe212030fcb",
        factoryAddress: "0xff9a4e72405df3ca3d909523229677e6b2b8dc71",
        routerAddress: "0xc2426f2018f13fdc5b260bd0a88be753ee7fafc5",
        hex: "0xef0d2ab30aac9d18fa917ec5b914cd6bdaa7590990542a9b68a26c8f100e1a9a",
        fee: 30
    },
    {
        name: "babySwap",
        url: "https://exchange.babyswap.finance/#/swap",
        tokenAddress: "0x53e562b9b7e5e94b81f10e96ee70ad06df3d2657",
        factoryAddress: "0x86407bea2078ea5f5eb5a52b2caa963bc1f889da",
        routerAddress: "0x325e343f1de602396e256b67efd1f61c3a6b38bd",
        hex: "0x48c8bec5512d397a5d512fbb7d83d515e7b6d91e9838730bd1aa1b16575da7f5",
        fee: 30
    },
    {
        name: "fstSwap",
        url: "https://www.fstswap.pro/?v=1#/",
        tokenAddress: "0x04fa9eb295266d9d4650edcb879da204887dc3da",
        factoryAddress: "0x9a272d734c5a0d7d84e0a892e891a553e8066dce",
        routerAddress: "0x1b6c9c20693afde803b27f8782156c0f892abc2d",
        hex: "0xa09f7ad489ebacc50d67f97c0fe03a38d38ddbbbb56d1cf44cd44317f5d59fdb",
        fee: 30
    },
    {
        name: "fastSwap",
        url: "https://fastswap.finance/#/swap",
        tokenAddress: "0x2322afaac81697e770c19a58df587d8739777536",
        factoryAddress: "0x59da12bdc470c8e85ca26661ee3dcd9b85247c88",
        routerAddress: "0x211a47a691c84d3576ff081ff9709f19f0813983",
        hex: "0x6ba45ffdbc5955062c10bf8338ed95d4a1872ee259eb9712e08631bb451d19f0",
        fee: 30
    },
    {
        name: "nomiSwap",
        url: "https://nomiswap.io/swap",
        tokenAddress: "0xd32d01a43c869edcd1117c640fbdcfcfd97d9d65",
        factoryAddress: "0xd6715a8be3944ec72738f0bfdc739d48c3c29349",
        routerAddress: "0xd654953d746f0b114d1f85332dc43446ac79413d",
        hex: "0x83eb759f5ea0525124f03d4ac741bb4af0bb1c703d5f694bd42a8bd72e495a01",
        fee: 10
    }
    ,
    {
        name: "jetSwap",
        url: "https://exchange.jetswap.finance/#/swap",
        tokenAddress: "0x0487b824c8261462f88940f97053e65bdb498446",
        factoryAddress: "0x0eb58e5c8aa63314ff5547289185cc4583dfcbd5",
        routerAddress: "0xbe65b8f75b9f20f4c522e0067a3887fada714800",
        hex: "3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651",
        fee: 30
    }
]
