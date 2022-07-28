//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.6;

import "./interfaces/IPair.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/CHI.sol";
import "./libraries/SafeMath.sol";

contract Eagle {

    using SafeMath for uint;

    //拥有权限的操作人
    mapping(address => uint) public operators;

    //合约拥有人
    address public owner = msg.sender;

    //更新合约拥有人时的临时变量
    address private newOwner;

    bytes constant private zeroBytes = new bytes(0);

    CHI constant private chi = CHI(0x0000000000004946c0e9F43F4Dee607b0eF1fA1c);

    constructor() {
        operators[msg.sender] = 1;
    }

    //方法onlyBy
    modifier onlyByOwner() {
        require(
            msg.sender == owner,
            "Owner not authorized."
        );
        _;
    }

    modifier onlyByNewOwner() {
        require(
            msg.sender == newOwner,
            "NewOwner not authorized."
        );
        _;
    }

    modifier onlyByOperator() {
        require(
            operators[msg.sender] != 0,
            "Operator not authorized."
        );
        _;
    }

    modifier onlyByOperatorAndDiscountGas {
        uint gasStart = gasleft();
        require(
            operators[msg.sender] != 0,
            "Operator not authorized."
        );
        _;
        uint initialGas = 21000 + 16 * msg.data.length;
        uint gasSpent = initialGas + gasStart - gasleft();
        uint freeUpValue = (gasSpent + 14154) / 41947;
        chi.free(freeUpValue);
    }

    //支持转账操作
    receive() external payable {}

    //提币方法(只支持到owner用户)
    function withdraw(address token, uint amount) public onlyByOwner() {
        if (amount == 0) {
            amount = IERC20(token).balanceOf(address(this));
        }
        IERC20(token).transfer(address(owner), amount);
    }

    //更新Owner（Owner调用）
    function updateOwner(address _newOwner) public onlyByOwner() {
        newOwner = _newOwner;
    }

    //确认更新Owner（新Owner调用） 防止地址输入错误 二次确认
    function confirmOwner() public onlyByNewOwner() {
        owner = newOwner;
        operators[newOwner] = 1;
    }

    //新增操作员
    function addOperators(address[] memory _operators) public onlyByOwner() {
        for (uint i = 0; i < _operators.length; i++) {
            operators[_operators[i]] = 1;
        }
    }

    //删除操作员
    function removeOperators(address[] memory _operators) public onlyByOwner() {
        for (uint i = 0; i < _operators.length; i++) {
            //owner不支持删除
            if (_operators[i] == owner) {
                continue;
            }
            operators[_operators[i]] = 0;
        }
    }

    function huntingV1(uint amountIn, uint amountOutMin, address token, uint[] memory swapFees, address[] memory pairs) external onlyByOperatorAndDiscountGas {
        //前置预计算能买到的金额，如果不能盈利則直接報錯
        (address[] memory tokens, uint[][] memory reserves) = getTokensAndReserves(token, pairs);
        //通过reserves进行前置校验
        uint tempAmount = amountIn;
        for (uint i; i < tokens.length - 1; i++) {
            tempAmount = getAmountOut(tempAmount, reserves[i][0], reserves[i][1], swapFees[i]);
        }
        require(tempAmount >= amountOutMin, "#1");
        //IERC20(token).transfer(pairs[0], amountIn);
        safeTransfer(token, pairs[0], amountIn);
        uint balanceBefore = IERC20(token).balanceOf(address(this));
        for (uint i; i < tokens.length - 1; i++) {
            //(address input, address output) = (tokens[i], tokens[i + 1]);
            (address token0,) = sortTokens(tokens[i], tokens[i + 1]);
            IPair pair = IPair(pairs[i]);
            //实际到账的金额
            uint amountInput = IERC20(tokens[i]).balanceOf(address(pair)).sub(reserves[i][0]);
            uint amountOutput = getAmountOut(amountInput, reserves[i][0], reserves[i][1], swapFees[i]);
            (uint amount0Out, uint amount1Out) = tokens[i] == token0 ? (uint(0), amountOutput) : (amountOutput, uint(0));
            address to = i < tokens.length - 2 ? pairs[i + 1] : address(this);
            pair.swap(amount0Out, amount1Out, to, zeroBytes);
        }
        //保证盈利
        require(
            IERC20(token).balanceOf(address(this)).sub(balanceBefore) >= amountOutMin,
            'INSUFFICIENT_OUTPUT_AMOUNT'
        );
    }

    //在循环中判断path和reserve
    function huntingV2(uint amountIn, uint amountOutMin, address token, uint[] memory swapFees, address[] memory pairs) external onlyByOperatorAndDiscountGas {
        //前置预计算能买到的金额，如果不能盈利則直接報錯
        //通过reserves进行前置校验
        address tempTokenIn = token;
        //解決 stack too deep
        {
            uint tempAmount = amountIn;
            for (uint i; i < pairs.length; i++) {
                IPair pair = IPair(pairs[i]);
                address token0 = pair.token0();
                (uint reserve0, uint reserve1,) = pair.getReserves();
                (uint reserveIn, uint reserveOut) = token0 == tempTokenIn ? (reserve0, reserve1) : (reserve1, reserve0);
                //更新临时变量信息
                tempTokenIn = token0 == tempTokenIn ? pair.token1() : token0;
                tempAmount = getAmountOut(tempAmount, reserveIn, reserveOut, swapFees[i]);
            }
            require(tempAmount >= amountOutMin, "#1");
        }
        //IERC20(token).transfer(pairs[0], amountIn);
        safeTransfer(token, pairs[0], amountIn);
        uint balanceBefore = IERC20(token).balanceOf(address(this));
        //初始化tempTokenIn
        tempTokenIn = token;
        for (uint i; i < pairs.length; i++) {
            IPair pair = IPair(pairs[i]);
            address token0 = pair.token0();
            uint reserveIn;
            uint reserveOut;
            {
                (uint reserve0, uint reserve1,) = pair.getReserves();
                (reserveIn, reserveOut) = token0 == tempTokenIn ? (reserve0, reserve1) : (reserve1, reserve0);
            }
            uint amountOutput;
            {
                uint amountInput = IERC20(tempTokenIn).balanceOf(address(pair)).sub(reserveIn);
                amountOutput = getAmountOut(amountInput, reserveIn, reserveOut, swapFees[i]);
            }
            (uint amount0Out, uint amount1Out) = token0 == tempTokenIn ? (uint(0), amountOutput) : (amountOutput, uint(0));
            address to = i < pairs.length - 1 ? pairs[i + 1] : address(this);
            pair.swap(amount0Out, amount1Out, to, zeroBytes);
            //更新tempTokenIn 信息
            tempTokenIn = token0 == tempTokenIn ? pair.token1() : token0;
        }
        //保证盈利
        //'INSUFFICIENT_OUTPUT_AMOUNT'
        require(
            IERC20(token).balanceOf(address(this)).sub(balanceBefore) >= amountOutMin,
            '#2'
        );
    }

    //获取token路径
    function getTokensAndReserves(address token, address[] memory pairs) internal view returns (address[] memory tokens, uint[][] memory reserves) {
        tokens = new address[](pairs.length + 1);
        reserves = new uint[][](pairs.length);
        tokens[0] = token;
        for (uint i; i < pairs.length; i++) {
            IPair pair = IPair(pairs[i]);
            address token0 = pair.token0();
            address token1 = pair.token1();
            //tokens[i] = tokenIn
            //当token0 = tokenIn 时候 tokenOut = token1,reserve0=tokenIn,reserve1 = tokenOut
            (uint reserve0, uint reserve1,) = pair.getReserves();
            reserves[i] = new uint[](2);
            (tokens[i + 1], reserves[i][0], reserves[i][1]) = token0 == tokens[i] ? (token1, reserve0, reserve1) : (token0, reserve1, reserve0);
        }
    }

    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'ZERO_ADDRESS');
    }

    //计算能买多少资产(根据reserve)
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut, uint swapFee) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn.mul(10000 - swapFee);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(10000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    function safeTransfer(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TRANSFER_FAILED');
    }

}
