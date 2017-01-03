var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*User document schema*/
var userSchema = new Schema({
	"username": {
		type: String,
		unique: true
	},
	"passwordHash": String,
	"salt": String,
	"image": String
});

var user = mongoose.model('User', userSchema);

/*Document schema for storing user sent messages*/
var userMessagesSchema = new Schema({
	"user": String,
	"messagesSent": [{
		"receiver": String,
		"message": String,
		"timeStamp": Date
	}]
});

userMessagesSchema.statics.findAndAddMessage = function(sender, receiver, message) {
	var self = this;
	self.findOne({user: sender}, addMessage);

	function addMessage(err, conversation) {
		if(conversation) {
			/*Found a document-> Add to messagesSent array.*/
			// conversation = conversation.toJSON();
			var newMessage = {
				"receiver": receiver,
				"message": message,
				"timeStamp": Date.now()
			};

			conversation.messagesSent.push(newMessage);
			conversation.save(function(err, conversation) {
				if(err) {
					console.log(error);
				}
			});
		}
		else {
			/*No messages sent by user. Create and add one.*/
			var conversation = {
				"user": sender,
				"messagesSent": [{
					"receiver": receiver,
					"message": message,
					"timeStamp": Date.now()
				}]
			};

			self.create(conversation, function(err, conversation) {
				if(err) {
					console.log(err);
				}
			})
		}
	};
};
var userMessages = mongoose.model('UserMessage', userMessagesSchema);

module.exports = {
	user: user,
	userMessages: userMessages
};