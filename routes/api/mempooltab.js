const express = require('express');
const fs = require('fs')
const BlocknativeSDK = require('bnc-sdk')

const router = express.Router();

var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const saveConfig = () => {
  let myJSON = JSON.stringify(config)
  fs.writeFile(`./config.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log('Config Saved!');
  })
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
}

const scanMempool = async () => {
  const blocknative = new BlocknativeSDK({
    dappId: data.blockKey ,
    networkId: 1,
    transactionHandlers: [handleTransactionEvent],
    ws: WebSocket,
    onerror: (error) => {console.log(error)}
  })

  console.log(
    chalk.red(`\nService Start ... `),
  )

  sdkSetup(blocknative, configuration)
}

router.post('/set', (req, res) => {
    console.log("Set Mempool environments")

    config.pairAddr = req.body.pairAddr
    config.filterAmount = req.body.filterAmount
    config.filter = req.body.action

    saveConfig()
    res.json('Success');
});

module.exports = router;