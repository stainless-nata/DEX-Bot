const express = require('express');
const router = express.Router();

const fs = require('fs')
const Web3 = require('web3')
const ethers = require('ethers')
const equal = require('../../utils/EqualString')
const { uniswapRouter } = require('../../utils/constants')

var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));

const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
const account = wallet.connect(provider)

const executeTrade = async (data) => {
    try {
        const contract = new ethers.Contract(
            data.pairAddr,
            [
                {
                    "constant": true,
                    "inputs": [],
                    "name": "token0",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "token1",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            account
        )
        
        const token0 = await contract.token0()
        const token1 = await contract.token1()
        const token = equal(token0, config.WETH) == true ? token1 : token0
        
        console.log("----- Buy -----")
        const ethPrice = (await uniswapRouter.getAmountsOut(1000000000, [
            config.WETH,
            config.DAI,
        ]))[1].toNumber() / 1000000000;

        const ethAmount = parseInt(data.amountSpend)/ethPrice
        console.log(ethAmount)
        var amountIn = ethers.utils.parseUnits(
            ethAmount.toString(),
            "ether"
        );
        var amounts = await uniswapRouter.getAmountsOut(amountIn, [
            config.WETH,
            token,
        ]);
        var amountOutMin = amounts[1].sub(
            amounts[1].mul(`${parseInt(data.slippage)*10}`).div(1000)
        );
        uniswapRouter.swapExactETHForTokens(
            amountOutMin,
            [config.WETH, token],
            process.env.PUBLIC_KEY,
            Date.now() + 5 * 60 * 1000,
            {
                gasPrice: 5e9,
                gasLimit: 400000,
                value: amountIn,
            }
        )
        console.log("----- Sell -----")
        const tokenContract = new ethers.Contract(
            token,
            [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        }
                    ],
                    "name": "allowance",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "balanceOf",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ],
            account
        )
        const balance = await tokenContract.balanceOf(process.env.PUBLIC_KEY);
        let tokenAmount;
        tokenAmount = parseInt(ethers.utils.formatEther(balance))

        if(balance == 0) {
            console.log('Low Token Balance');
            return;
        }
    
        let allow = await tokenContract.allowance(process.env.PUBLIC_KEY, config.UniswapRouter)
        allow = parseFloat(ethers.utils.formatEther(allow));
        if(tokenAmount > allow) {
            console.log("Approve...");
            const approve_tx = await tokenContract.approve(
                config.UniswapRouter,
                ethers.utils.parseUnits(
                    tokenAmount.toString(),
                    "ether"
                ),
                {
                    gasPrice: 5e9,
                    gasLimit: 400000,
                },
            )
            const result = await approve_tx.wait();
            console.log(result);
        }
        
        let buy_tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            ethers.utils.parseUnits(
                tokenAmount.toString(),
                "ether"
            ),
            0,
            [address, config.WETH],
            process.env.PUBLIC_KEY,
            Date.now() + 5 * 60 * 1000,
            {
                gasPrice: 5e9,
                gasLimit: 400000,
            }
        )
        if(!buy_tx) return;
        let tx = await buy_tx.wait();
        console.log(tx);
    } catch (e) {
        console.log(e)
    }
}

router.post('/set', async (req, res) => {
    console.log(req.body)
    await executeTrade(req.body)
})

module.exports = router;