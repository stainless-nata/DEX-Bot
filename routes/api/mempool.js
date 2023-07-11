const express = require('express');
const fs = require('fs')

const router = express.Router();

var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const saveConfig = () => {
  let myJSON = JSON.stringify(config)
  fs.writeFile(`./config.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log('Config Saved!');
  })
}

router.post('/set_regular_trades', (req, res) => {
    console.log("Set Regular Trades environments")

    config.baseFeePlus = req.body.baseFeePlus
    config.minerTip = req.body.minerTip
    config.gasLimit = req.body.gasLimit

    saveConfig()
    res.json('Success');
});

module.exports = router;