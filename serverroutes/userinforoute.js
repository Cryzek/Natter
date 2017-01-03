var model = require('../models');
var User = model.user;

module.exports = function(express, io) {

	var userInfoRouter = express.Router();

	userInfoRouter.get('/currentuser', function(req, res) {
		if(req.session.user_id && req.session.user_name) {
			User.findOne({ username: req.session.user_name}, function(err, dbuser) {
				if(err) {
					console.log(`Error in database.\n${err}.`);
					res.status(500).end();
				}
				else {
					res.send({
						username: dbuser.username,
						image: dbuser.image
					});
				}
			});
		}
		else {
			console.log("Not logged in.");
			res.send("Go to hell");
		}
	});	
	
	userInfoRouter.get('/userinfo/:username', function(req, res) {
		if(req.params.username) {
			var username = req.params.username;
			User.findOne({username: username}, function(err, dbuser) {
				if(err) {
					console.log(`Error in database.\n${err}.`);
					res.status(500).end();
				}
				else {
					res.send({
						username: dbuser.username,
						image: dbuser.image
					});
				}
			});
		}
		else {
			res.send(404, "Not found");
		}
	});

	userInfoRouter.get('/all', function(req, res) {
		User.find({}, function(err, users) {
			if(err) {
				console.log(`Error in database.\n${err}.`);
				res.status(500).end();
			}
			else {
				var userdetails = users.map(function(item) {
											return {
												username: item.username,
												image: item.image
											}
										}).filter(function(item) {
											/*Return all except the logged in one*/
											if(req.session.user_id) {
												return req.session.user_name != item.username
											}
											else {
												return true;
											}
										});
				res.send(userdetails);
			}
		});
	});

	return {
		Router: userInfoRouter
	};
};