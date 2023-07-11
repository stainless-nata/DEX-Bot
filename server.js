const express = require('express');
const cors = require('cors')
const fs = require('fs')
var bodyParser = require('body-parser')

const app = express();

app.use(express.json());
app.use(cors())
app.options("*", cors());

var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const saveConfig = () => {
  let myJSON = JSON.stringify(config)
  fs.writeFile(`./config.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log('Config Saved!');
  })
}

app.post('/set_regular_trades', (req, res) => {
    console.log("Set Regular Trades environments")

    config.baseFeePlus = req.body.baseFeePlus
    config.minerTip = req.body.minerTip
    config.gasLimit = req.body.gasLimit

    saveConfig()
    res.json('Success');
});

app.post('/set_frontrun_trades', (req, res) => {
    console.log("Set Front-run Trades environments")

    config.frBaseFeePlus = req.body.frBaseFeePlus
    config.frMinerTip = req.body.frMinerTip
    config.frGasLimit = req.body.frGasLimit

    saveConfig()
    res.json('Success');
});

const port = process.env.PORT || 8008;
app.listen(port, () => console.log(`Server running on port ${port}`));