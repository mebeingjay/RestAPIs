var router = express.Router();

router.post('/register', function (req, res) {
	console.log("/register API data ", req.body);

	if (commonClass.validateParams(req.body.email, req.body.name, req.body.password)) {
		db.collection('users').findOne({
			email: req.body.email
		}, function (error, response) {
			if (error) {
				console.log("/register user finding error ", error);
				res.send({ error: 'Something went wrong', data: null });
				return;
			} else {
				if (response) {
					console.log("user is exist.");
					res.send({ error: 'Email address is already existed.' });
					return;
				} else {
					console.log("new user");

					db.collection('users').insertOne({
						email: req.body.email,
						name: req.body.name,
						password: req.body.password
					}, function (err, resp) {
						if (err || !resp.ops[0]) {
							console.log("/register user insert error ", err);
							res.send({ error: 'Something went wrong' });
							return;
						}
						console.log("new user has been inserted ", resp.ops[0]);
						res.send({ error: null, data: resp.ops[0] });
					})
				}
			}
		});
	} else {
		console.log("/register API data missing ", req.body);
		res.send({ error: 'Something went wrong' });
		return;
	}
});

router.post('/login', function (req, res) {
	console.log("/login API data ", req.body);

	if (commonClass.validateParams(req.body.email, req.body.password)) {
		db.collection('users').findOne({
			email: req.body.email
		}, function (error, response) {
			if (error) {
				console.log("/login user finding error ", error);
				res.send({ error: 'Something went wrong', data: null });
				return;
			} else {
				console.log("\n/login get data ", response)
				if (!response) {
					console.log("/login user not exist ");
					res.send({ error: 'User not found', data: null });
					return;
				} else {
					if (response.password !== req.body.password) {
						console.log("/login password wrong.");
						res.send({ error: 'Password not match', data: null });
						return;
					} else {
						console.log("/login password match.");
						delete response.password;
						res.send({ error: null, data: response });
						return;
					}
				}
			}
		});
	} else {
		console.log("/login API data missing ", req.body);
		res.send({ error: 'Something went wrong', data: null });
		return;
	}
});

router.post('/getUserList', function (req, res) {
	if (commonClass.validateParams(req.body.uid)) {
		db.collection('users').find({}).project({
			password: 0
		}).sort({
			name: 1
		}).toArray(function (error, response) {
			if (error) {
				console.log("/getUserList users finding error ", error);
				res.send('<h2>Something went wrong</h2>');
				return;
			} else {

				response = response.filter(user => {
					if (req.body.uid.toString() != user._id.toString())
						return user;
				});

				console.log("/getUserList users finding response ", response);

				res.send({
					userList: response
				});
			}
		})
	} else {
		console.log("/getUserList API data missing ", req.body);
		res.send('<h2>Something went wrong</h2>');
		return;
	}
});

router.post('/sendMessage', function (req, res) {
	if (commonClass.validateParams(req.body.uid, req.body.receiverId, req.body.message)) {
		var condition = {
			_id: {
				$in: [ObjectId(req.body.uid.toString()), ObjectId(req.body.receiverId.toString())]
			}
		};

		db.collection('users').find(condition).toArray(function (error, response) {
			if (error || response.length < 2) {
				console.log("/sendMessage sender and receiver finding data error ", error);
				res.send('<h2>Something went wrong</h2>');
				return;
			} else {
				console.log("/sendMessage sender and receiver finding data response ", response);

				var senderName, receiverName;

				if (response[0]._id.toString() === req.body.uid.toString()) {
					senderName = response[0].name;
					receiverName = response[1].name;
				} else {
					senderName = response[1].name;
					receiverName = response[0].name;
				}

				console.log("\n/sendMessage senderName " + senderName + " receiverName " + receiverName);

				var insertData = {
					senderId: ObjectId(req.body.uid.toString()),
					senderName: senderName,
					receiverId: ObjectId(req.body.receiverId.toString()),
					receiverName: receiverName,
					message: req.body.message,
					cd: new Date()
				}

				db.collection('user_messages').insertOne(insertData, function (err, resp) {
					if (err || !resp.ops[0]) {
						console.log("/sendMessage insert message error ", error);
						res.send('<h2>Something went wrong</h2>');
						return;
					} else {
						console.log("/sendMessage insert message response ", resp.ops[0]);
						res.send(resp.ops[0]);
					}
				});
			}
		});
	} else {
		console.log("/sendMessage API data missing ", req.body);
		res.send('<h2>Something went wrong</h2>');
		return;
	}
});

router.post('/getAllMessages', function (req, res) {
	if (commonClass.validateParams(req.body.uid)) {
		var condition = {
			$or: [{
				senderId: ObjectId(req.body.uid)
			}, {
				receiverId: ObjectId(req.body.uid)
			}]
		};

		db.collection('user_messages').find(condition).sort({
			cd: -1
		}).toArray(function (error, response) {
			if (error) {
				console.log("/getAllMessages finding messages error ", error);
				res.send('<h2>Something went wrong</h2>');
				return;
			}
			console.log("/getAllMessages finding messages response ", response);
			res.send({
				messageList: response
			});
		});
	} else {
		console.log("/getAllMessages API data missing ", req.body);
		res.send('<h2>Something went wrong</h2>');
		return;
	}
});

module.exports = router;