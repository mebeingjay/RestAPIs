// var app = express();
var router = express.Router();

router.post('/register', function (req, res) {
	console.log("/register API data ", req.query);

	db.collection('users').findOne({email: req.body.email}, function (error, response) {
		if (error) {
			console.log("/register user finding error ", error);
			res.status(404).send('<h2>Something went wrong</h2>');
			return;
		}
		else {
			if (response) {
				console.log("user is exist.");
				res.status(404).send('<h2>404 Email is already existing</h2>');
				return;
			}
			else {
				console.log("new user");

				db.collection('users').insertOne({email: req.body.email, name: req.body.name}, function (err, resp) {
					if (err || !resp.ops[0]) {
						console.log("/register user insert error ", err);
						res.status(404).send('<h2>Something went wrong</h2>');
						return;
					}
					console.log("new user has been inserted ", resp.ops[0]);
					res.send(resp.ops[0]);
				})
			}
		}
	})
});

module.exports = router;