const http = require('http')
const express = require('express');
const cors = require('cors')
const { WebSocketServer } = require('ws')
const fs = require('fs')
require('dotenv').config();
const { uuid } = require('uuidv4');

const maintab = require('./routes/api/maintab');
const mempooltab = require('./routes/api/mempooltab');

const app = express();

app.use(express.json());
app.use(cors())
app.options("*", cors());

app.use('/maintab', maintab);
app.use('/mempooltab', mempooltab);

global.clients = {}

const save = (type, data) => {
  let myJSON = JSON.stringify(data)
  fs.writeFile(`./${type}.json`, myJSON, (err) => {
    if(err) console.log(err);
    console.log(`${type} Saved!`);
  })
}

/*****************************************************************************************************
 * Get the message from the frontend and analyze that, start mempool scan or stop.
 * ***************************************************************************************************/
const server = http.createServer();
const wsServer = new WebSocketServer( {server} )
server.listen(8007, () => {
  console.log(`WebSocket server is running on port 8007`);
});

wsServer.on('connection', (connection) => {
    const userId = uuid();
    global.clients[userId] = connection
    // clients[userId] = connection;
})

const port = 8008;
app.listen(port, () => console.log(`Server running on port ${port}`));