const express = require('express');
const cors = require('cors')
var bodyParser = require('body-parser')

const maintab = require('./routes/api/maintab');
const mempooltab = require('./routes/api/mempooltab');

const app = express();

app.use(express.json());
app.use(cors())
app.options("*", cors());

app.use('/maintab', maintab);
app.use('/mempooltab', mempooltab);


const port = process.env.PORT || 8008;
app.listen(port, () => console.log(`Server running on port ${port}`));