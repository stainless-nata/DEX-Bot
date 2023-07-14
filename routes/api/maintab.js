const express = require('express');
const fs = require('fs')

const router = express.Router();

var mainData = JSON.parse(fs.readFileSync('./config/main/config.json', 'utf-8'));
const saveConfig = () => {
  let myJSON = JSON.stringify(mainData)
  fs.writeFile(`./config/main/config.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log('Config Saved!');
  })
}

router.post('/set_regular_trades', (req, res) => {
    console.log("Set Regular Trades environments")

    mainData.baseFeePlus = req.body.baseFeePlus
    mainData.minerTip = req.body.minerTip
    mainData.gasLimit = req.body.gasLimit

    saveConfig()
    res.json('Success');
});

router.post('/set_frontrun_trades', (req, res) => {
    console.log("Set Front-run Trades environments")

    mainData.baseFeePlusFR = req.body.baseFeePlusFR
    mainData.minerTipFR = req.body.minerTipFR
    mainData.gasLimitFR = req.body.gasLimitFR

    saveConfig()
    res.json('Success');
});

module.exports = router;