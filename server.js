var express = require('express');
const router = express.Router();
var app = express();
var http = require('http').Server(app);

var bodyParser = require('body-parser');
app.use(bodyParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static('views'));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Application";
ObjectId = module.exports = require('mongodb').ObjectId;

MongoClient.connect(url, function (err, database) {
    db = module.exports = database
    console.log('connected with database', err);
    db.collection('table_data').remove();
    db.collection('user_data').remove();
});

http.listen(11000, function () {
    setTimeout(function () {
        console.log("\n------------------------------------------------------------------------------------------");
        console.log('Server is properly working on port 11000.');
    }, 2000);
});