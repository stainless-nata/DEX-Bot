const express = require('express');
const cors = require('cors')
var bodyParser = require('body-parser')
const BlocknativeSDK = require('bnc-sdk')
const WebSocket = require('ws')
const chalk = require('chalk')
const fs = require('fs')
require('dotenv').config();

const maintab = require('./routes/api/maintab');
const mempooltab = require('./routes/api/mempooltab');

const app = express();

app.use(express.json());
app.use(cors())
app.options("*", cors());

app.use('/maintab', maintab);
app.use('/mempooltab', mempooltab);



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
}
  
const scanMempool = async () => {
    const blocknative = new BlocknativeSDK({
        dappId: process.env.BLOCKNATIVE_KEY,
        networkId: 1,
        transactionHandlers: [handleTransactionEvent],
        ws: WebSocket,
        onerror: (error) => {console.log(error)}
    })
    console.log(
        chalk.red(`\nMempool Scanner Started ... `),
    )
    const configuration = JSON.parse(fs.readFileSync('configuration.json', 'utf-8'))
    sdkSetup(blocknative, configuration)
}

// scanMempool()

const port = process.env.PORT || 8008;
app.listen(port, () => console.log(`Server running on port ${port}`));