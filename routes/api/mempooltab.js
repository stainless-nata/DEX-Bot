const express = require('express');
const fs = require('fs')
const BlocknativeSDK = require('bnc-sdk')
const Web3 = require('web3')
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const WebSocket = require('ws')
const equal = require('../../utils/EqualString')

const web3 = new Web3(process.env.MAINNET_URL)
const router = express.Router();

var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));
const configuration = JSON.parse(fs.readFileSync('./config/configuration.json', 'utf-8'))
var mempoolData = JSON.parse(fs.readFileSync('./config/mempool/config.json', 'utf-8'));
const saveConfig = () => {
  let myJSON = JSON.stringify(mempoolData)
  fs.writeFile(`./config/mempool/config.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log('Config Saved!');
  })
}

let isRunning = false;
let blocknative;

var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));
// var clients = {};
var list = [];

const getDecimals = async (address, web3) => {
    const contract = new web3.eth.Contract([
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        }
    ], address)

    let decimals = parseInt(await contract.methods.decimals().call());
    return decimals;
}

const getSymbol = async (address, web3) => {
    const contract = new web3.eth.Contract([
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ], address)

    let symbol = parseInt(await contract.methods.symbol().call());
    return symbol;
}

const getTokenPrice = async (address, chainid) => {
    try {
        const response = (await Moralis.EvmApi.token.getTokenPrice({
            address: address,
            chain: chainid=='ETH' ? EvmChain.ETHEREUM : EvmChain.BSC
        })).toJSON();
        
        return response.usdPrice
    } catch (e) {
        return 0;
    }
}

async function sdkSetup(sdk, configuration) {
    const parsedConfiguration = typeof configuration === 'string' ? JSON.parse(configuration) : configuration
    const globalConfiguration = parsedConfiguration.find(({ id }) => id === 'global')
    const addressConfigurations = parsedConfiguration.filter(({ id }) => id !== 'global')
  
    // save global configuration first and wait for it to be saved
    globalConfiguration && await sdk.configuration({scope: 'global', filters: globalConfiguration.filters})
  
    addressConfigurations.forEach(({id, filters, abi}) => {
      const abiObj = abi ? { abi } : {}
      sdk.configuration({...abiObj, filters, scope: id, watchAddress: true})
    })
}
  
async function handleTransactionEvent(transaction) {
    let tx = transaction.transaction;
    console.log(tx.hash);

    let chainid
    if(tx.watchedAddress.toLowerCase() == config.UniswapRouter.toLowerCase())   chainid = 'ETH';
    if(tx.watchedAddress.toLowerCase() == config.PancakeswapRouter.toLowerCase())   chainid = 'BNB';

    let web3;
    if(chainid == "ETH") {
        web3 = new Web3(process.env.MAINNET_URL);
    } else {
        web3 = new Web3(process.env.BSC_URL);
    }

    const contractCall = tx.contractCall
    console.log(contractCall)

    // if(!contractCall.methodName.includes('swap')) {
    //     console.log("No swap functions")
    //     return;
    // }
    const params = contractCall.params
    const path = params.path;
    // if(!(
    //     (path[0].toLowerCase() == mempoolData.token0.toLowerCase() && path[path.length -1].toLowerCase == mempoolData.token1.toLowerCase()) ||
    //     (path[0].toLowerCase() == mempoolData.token1.toLowerCase() && path[path.length -1].toLowerCase == mempoolData.token0.toLowerCase())
    // )) {
    //     console.log("Not matched Pair")
    //     return;
    // }
    
    // if ((mempoolData.filter == 'Buy' && path[0] !== config.WETH) || (mempoolData.filter == 'Sell' && path[path.length -1] !== config.WETH)) {
    //     console.log("Not matched Filter")
    //     return;
    // }

    let amount
    let token
    if(params.amountIn) amount = params.amountIn, token = params.path[0]
    else if(params.amountOut) amount = params.amountOut, token = params.path[path.length -1]
    else if(params.amountInMax) amount = params.amountInMax, token = params.path[0]
    else if(params.amountOutMin) amount = tx.value, token = config.WETH
    else {
        console.log("No AmountIn, AmountOut, AmountOutMin, AmountInMax")
        return;
    }

    const tokenPrice = await getTokenPrice(token, chainid)
    console.log("Token Price: ", tokenPrice)

    let decimals = await getDecimals(token, web3)
    console.log("Decimals: ", decimals)

    amount = parseFloat(web3.utils.fromWei(amount, 'ether'))
    amount = amount * (10 ** (18-decimals))
    amount = parseFloat(amount) * tokenPrice

    console.log("Amount USD: ", amount)
    if(amount < mempoolData.filterAmount) {
        console.log("Not enough amount")
        return;
    }

    let type, symbol
    if(path[0].toLowerCase() == config.WETH) type = 'BUY', symbol = await getSymbol(path[path.length -1], web3)
    else type = 'SELL', symbol = await getSymbol(path[0], web3)

    let date = new Date(Date.now())
    let obj = {
        key: list.length + 1,
        time: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        type: type,
        symbol: symbol,
        amount: parseInt(amount),
        maker: tx.from
    }
    list.push(obj);
    const jsonData = JSON.stringify(list)

    const clients = global.clients
    for(let userId in clients) {
        let client = clients[userId]
        if(client.readyState == WebSocket.OPEN)
            client.send(jsonData)
    }
    console.log('sent')

    // test[tx.hash] = tx;
    // save('test', test);
}

const scanMempool = async () => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY
    })

    blocknative = new BlocknativeSDK({
        dappId: process.env.BLOCKNATIVE_KEY,
        networkId: 1,
        transactionHandlers: [handleTransactionEvent],
        ws: WebSocket,
        onerror: (error) => {console.log(error)}
    })

    console.log(`\nMempool Scanner Started ... `)
    await sdkSetup(blocknative, configuration)
}

router.post('/set', async (req, res) => {
    console.log("Set Mempool environments")

    try {
      const contract = new web3.eth.Contract([
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
      ], req.body.pairAddr)
      mempoolData.token0 = await contract.methods.token0().call()
      mempoolData.token1 = await contract.methods.token1().call()
    } catch (e) {
      console.log(e)
      console.log("Not Contract Pair Address")
      res.json('Failed')
      return;
    }

    mempoolData.pairAddr = req.body.pairAddr
    mempoolData.filterAmount = req.body.filterAmount
    mempoolData.filter = req.body.action

    for (let i=1;i<=2;i++) {
      configuration[i].filters[0]["contractCall.methodName"] = mempoolData.filter == 'All'
      ? [
        "swapETHForExactTokens",
        "swapExactETHForTokens",
        "swapExactETHForTokensSupportingFeeOnTransferTokens",
        "swapExactTokensForETH",
        "swapExactTokensForETHSupportingFeeOnTransferTokens",
        "swapExactTokensForTokens",
        "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        "swapTokensForExactETH",
        "swapTokensForExactTokens"
      ] : mempoolData.filter == 'Buy'
      ? [
        "swapETHForExactTokens",
        "swapExactETHForTokens",
        "swapExactETHForTokensSupportingFeeOnTransferTokens",
      ] : [
        "swapExactTokensForETH",
        "swapExactTokensForETHSupportingFeeOnTransferTokens",
        "swapTokensForExactETH",
      ]
      configuration[i].filters[1]["contractCall.params.path"] = equal(mempoolData.token0, config.WETH) ? mempoolData.token0 : mempoolData.token1
    }

    if(isRunning)
      await sdkSetup(blocknative, configuration);
    else {
      isRunning = true;
      scanMempool()
    }

    saveConfig()
    res.json('Success');
});

router.get('/get', async (req, res) => {
    res.json(JSON.stringify(list))
})


module.exports = router;