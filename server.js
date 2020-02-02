require("dotenv").config();
// config = module.exports = require('./config.json');

PORT = process.env.PORT || 3000;

express = module.exports = require('express');
app = module.exports = express();
var http = require('http').Server(app);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.use(express.static('views'));

app.get('/', function (req, res) {
    res.render('./home.html');
});

// app.get('/', function (req, res) {
//     res.sendfile('home.html');
// });

commonClass = module.exports = require('./classes/commonClass');
var userRoutes = require('./routes/usersRoutes.js');

app.use('/users', userRoutes);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
ObjectId = module.exports = require('mongodb').ObjectId;

if (process.env.IS_LIVE == 1)
    url = "mongodb+srv://" + process.env.DBUSER + ":" + process.env.DBPWD + "@project-a3m4n.mongodb.net/test?retryWrites=true&w=majority";

console.log("mongo URL ::: " + url);

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log("error in mongo connection ", err);
        return;
    }
    db = module.exports = database.db(process.env.DBNAME);
    console.log('connected with database', err);
    db.collection('table_data').remove();
    db.collection('user_data').remove();
});

http.listen(PORT, function () {
    setTimeout(function () {
        console.log("\n------------------------------------------------------------------------------------------");
        console.log('Server is properly working on port ' + PORT);
    }, 2000);
});