const express = require('express');
const fs = require('fs')
const Web3 = require('web3')

const web3 = new Web3(process.env.MAINNET_URL)

const router = express.Router();

var mempoolData = JSON.parse(fs.readFileSync('./config/mempool/config.json', 'utf-8'));
const saveConfig = () => {
  let myJSON = JSON.stringify(mempoolData)
  fs.writeFile(`./config/mempool/config.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log('Config Saved!');
  })
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
      ], mempoolData.pairAddr)
      mempoolData.token0 = await contract.methods.token0().call()
      mempoolData.token1 = await contract.methods.token1().call()
    } catch (e) {
      console.log("Not Contract Pair Address")
      res.json('Failed')
      return;
    }

    mempoolData.pairAddr = req.body.pairAddr
    mempoolData.filterAmount = req.body.filterAmount
    mempoolData.filter = req.body.action

    saveConfig()
    res.json('Success');
});

module.exports = router;