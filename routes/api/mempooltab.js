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

router.post('/set', (req, res) => {
    console.log("Set Mempool environments")

    config.pairAddr = req.body.pairAddr
    config.filterAmount = req.body.filterAmount
    config.filter = req.body.action

    saveConfig()
    res.json('Success');
});

module.exports = router;