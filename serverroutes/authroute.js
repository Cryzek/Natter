var model = require('../models.js');
var passwordSec = require('../passwordSec');
var User = model.user;

module.exports = function(express) {
	var authRouter = express.Router();

	/*Routes*/
	authRouter.post('/login', function(req, res) {
		var user = req.body;

		if(user.username == "" || user.password == "") {
			console.log("Empty fields. SOS. We have been hacked.");
			res.send({
				status : false,
				message : "Cannot authenticate"
			});
		}

		User.findOne({ username : user.username }, handleUserAuthentication);
		
		function handleUserAuthentication(err, dbuser) {
			if(err) {
				console.log(err);
				res.send(500, `Error in database : ${err} `);
			}
			else{
				if(dbuser != null) {
					/*Verify the user*/
					var salt = dbuser.salt, hash = dbuser.passwordHash;
					if( passwordSec.verify(salt, hash, user.password) ) {
						req.session.user_id = user.username;
						console.log(`User logged with session id - ${req.session.user_id}`);
						res.json({
							status: true,
							message: "Successfully logged in."
						});
					}
					else{
						console.log("Wrong password");
						res.json({
							status: false,
							message: "Wrong password."
						})
					}
				}
				else {
					/*Add new user*/
					var passwordData = passwordSec.saltAndHash(user.password);
					/*passwordData will contain salt and passwordHash that'll go in the database for new users */
					// console.log(`Salt: ${passwordData.salt}\nHash : ${passwordData.passwordHash}\n`);
					var newuser = new User({ 
						username: user.username,
						salt: passwordData.salt,
						passwordHash: passwordData.passwordHash
					});

					newuser.save(function(err, dbuser) {
						req.session.user_id = user.username;
						console.log(`User logged with session id - ${req.session.user_id}`);
						res.json({
							status: true,
							message: "New user added" 
						})
					});	
				}	
			}
		};

	});

	authRouter.post('/logout', function(req, res) {
		console.log("${req.session.user_id} logged out.");
		delete req.session.user_id;
		req.session.destroy();
		res.clearCookie('connect.sid', { path: '/' });
		res.redirect('login');
	});

	authRouter.post('/check', function(req, res) {
		if(req.session.user_id) {
			console.log("Already logged in.");
			res.json({
				status: true,
				message: "Already logged in."
			});
		}
		else {
			console.log("Not logged in.");
			res.json({
				status: false,
				message: "Not logged in."
			});
		}
	});

	return {
		Router: authRouter
	};
};