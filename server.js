const express = require('express');
const cors = require('cors')
var bodyParser = require('body-parser')
const BlocknativeSDK = require('bnc-sdk')
const WebSocket = require('ws')
const Web3 = require('web3')
// const chalk = require('chalk')
const fs = require('fs')
require('dotenv').config();
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const maintab = require('./routes/api/maintab');
const mempooltab = require('./routes/api/mempooltab');

const app = express();

app.use(express.json());
app.use(cors())
app.options("*", cors());

app.use('/maintab', maintab);
app.use('/mempooltab', mempooltab);

var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
var test = JSON.parse(fs.readFileSync('test.json', 'utf-8'));
const save = (type, data) => {
  let myJSON = JSON.stringify(data)
  fs.writeFile(`./${type}.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log(`${type} Saved!`);
  })
}

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

    // const coinPrice = await getPrice(chainid);

    const contractCall = tx.contractCall
    console.log(contractCall)

    if(!contractCall.methodName.includes('swap')) {
        console.log("No swap functions")
        return;
    }
    const params = contractCall.params

    let amount
    let token
    if(params.amountIn) amount = params.amountIn, token = params.path[0]
    else if(params.amountOut) amount = params.amountOut, token = params.path[1]
    else if(params.amountInMax) amount = params.amountInMax, token = params.path[0]
    else if(params.amountOutMin) amount = params.amountOutMin, token = params.path[1]
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
    if(amount < config.filterAmount) {
        console.log("Not enough amount")
        return;
    }

    // config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

    // test[tx.hash] = tx;
    // save('test', test);
}

const scanMempool = async () => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY
    })

    const blocknative = new BlocknativeSDK({
        dappId: process.env.BLOCKNATIVE_KEY,
        networkId: 1,
        transactionHandlers: [handleTransactionEvent],
        ws: WebSocket,
        onerror: (error) => {console.log(error)}
    })
    console.log(`\nMempool Scanner Started ... `)
    const configuration = JSON.parse(fs.readFileSync('configuration.json', 'utf-8'))
    sdkSetup(blocknative, configuration)
}

scanMempool()

const port = process.env.PORT || 8008;
app.listen(port, () => console.log(`Server running on port ${port}`));