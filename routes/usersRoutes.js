// var app = express();
var router = express.Router();

router.post('/register', function (req, res) {
	console.log("/register API data ", req.body);

	if (commonClass.validateParams(req.body.email, req.body.name, req.body.password)) {
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

					db.collection('users').insertOne({
						email: req.body.email,
						name: req.body.name,
						password: req.body.password
					}, function (err, resp) {
						if (err || !resp.ops[0]) {
							console.log("/register user insert error ", err);
							res.status(404).send('<h2>Something went wrong</h2>');
							return;
						}
						console.log("new user has been inserted ", resp.ops[0]);
						res.status(200).send(resp.ops[0]);
					})
				}
			}
		});
	}
	else {
		console.log("/register API data missing ", req.body);
		res.status(404).send('<h2>Something went wrong</h2>');
		return;
	}
});

router.post('/login', function (req, res) {
	console.log("/register API data ", req.body);

	if (commonClass.validateParams(req.body.email, req.body.password)) {
		db.collection('users').findOne({email: req.body.email}, function (error, response) {
			if (error) {
				console.log("/login user finding error ", error);
				res.status(404).send('<h2>Something went wrong</h2>');
				return;
			}
			else {
				if (!response) {
					console.log("/login user not exist ", error);
					res.status(404).send('<h2>User is not exist</h2>');
					return;
				}
				else {
					if (response.password !== req.body.password) {
						console.log("/login password wrong.");
						res.status(404).send('<h2>Wrong Password</h2>');
						return;
					}
					else {
						console.log("/login password match.");
						delete response.password;
						res.status(200).send(response);
						return;
					}
				}
			}
		});
	}
	else {
		console.log("/login API data missing ", req.body);
		res.status(404).send('<h2>Something went wrong</h2>');
		return;
	}
});

module.exports = router;