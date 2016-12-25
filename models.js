var mongoose = require('mongoose');

var userSchema = {
	"username": {
		type: String,
		unique: true
	},
	"passwordHash": String,
	"salt": String
};
var user = mongoose.model('User', userSchema);

var userMessagesSchema = {
	"userId": mongoose.Schema.Types.ObjectId,
	messages: [{
		"receiver": mongoose.Schema.Types.ObjectId,
		"message": String,
		"timeStamp": Date
	}]
};
var userMessages = mongoose.model('UserMessage', userMessagesSchema);

module.exports = {
	user: user,
	userMessages: userMessages
};