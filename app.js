

/*
var fs = require('fs');
var https = require('https');
var http = require('http');
var privateKey  = fs.readFileSync('selfsigned.key', 'utf8');
var certificate = fs.readFileSync('selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
*/


//var runNutbot = require("./Discord/index")
var express = require('express');
var cors = require('cors')
var app = express();
var getUpcoming = require('./Startgg/getUpcoming')
const port = process.env.PORT || 4000;
app.use(cors())

app.use(express.json());

app.get('/', (req, res) => {
    res.send('MA Smash Website Start.gg Server')
})

app.get('/getUpcoming', (req, res) => {
    getUpcoming().then((result) => res.send(result))
})


const server = app.listen(port, () => console.log(`App listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

//runNutbot()
