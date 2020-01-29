express = module.exports = require('express');
// var router = express.Router();
app = module.exports = express();
var http = require('http').Server(app);

var bodyParser = require('body-parser');
// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static(__dirname + '/public'));
// app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.use(express.static('views'));

app.get('/', function (req, res) {
    res.render('./index.html');
});

commonClass = module.exports = require('./classes/commonClass');
var userRoutes = require('./routes/usersRoutes.js');

app.use('/users', userRoutes);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
ObjectId = module.exports = require('mongodb').ObjectId;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log("error in mongo connection ", err);
        return;
    }
    db = module.exports = database.db('Application');
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