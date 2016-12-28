var model = require('../models');
var User = model.user;
var UserMessage = model.userMessages;

module.exports = function(express) {
	var messageRouter = express.Router();

	messageRouter.get('/:sender/:receiver', function(req, res) {
		if(!req.session.user_id) res.send("You need to login");
		/*Need to check if the same user is requesting for information*/
		var sender = req.params.sender, receiver = req.params.receiver;
		var messages = [];

		UserMessage.findOne({user: sender}, filterSenderMessages);
		function filterSenderMessages(err, senderMsgs){	
			if(err) {
				console.log(err);
				res.send(500, "Internal Server Error");
			}
			else {
				if(senderMsgs) {
					/*If the sender has ever sent a message.*/
					fileredMessages = senderMsgs.messagesSent.filter(function(item) {
						return item.receiver == receiver;
					});
					messages = messages.concat(fileredMessages);
					UserMessage.findOne({user: receiver}, filterReceiverMessages);
				}
				else {
					/*No messages ever sent by sender. Find those sent by receiver*/
					UserMessage.findOne({user: receiver}, filterReceiverMessages);
				}
			}
		}

		function filterReceiverMessages(err, receiverMsgs) {
			if(err) {
				console.log(err);
				res.send(500, "Internal Server Error");
			}
			else {
				if(receiverMsgs) {
					/*If the receiver has ever sent a message.*/
					fileredMessages = receiverMsgs.messagesSent.filter(function(item) {
						return item.receiver == sender;
					});
					console.log("receiverFilteredMessages");
					console.log(fileredMessages);
					messages = messages.concat(fileredMessages);
					console.log("Final messages ");
					console.log(messages);
					res.send(messages);
				}
				else {
					/*No messages ever sent by receiver.*/
					res.send(messages);
				}
			}
		}
	});

	messageRouter.post('/send', function(req, res) {
		var conversation = req.body;
		console.log(conversation);
		var sender = conversation.sender,
			receiver = conversation.receiver,
			message = conversation.message;

		UserMessage.findAndAddMessage(sender, receiver, message);
	});

	return {
		Router: messageRouter
	}
};
