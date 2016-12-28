angular
.module('messageService', [])
.factory('Messages', function($http) {
	return {
		getConversation: function(sender, receiver) {
			return $http.get(`/messages/${sender}/${receiver}`);
		},
		sendMessage: function(sender, receiver, message, socket) {
			var conversation = {
				sender: sender,
				receiver: receiver,
				message: message	
			};
			$http.post('/messages/send', conversation)
				.success(successHandler);
			
			function successHandler(response) {
				if(response.status == true) {
					return {
						status: true, 
						message: message
					};
				}
				else {
					return {
						status: false,
						message: "Message sending failed. Try again."
					}
				}
			}
		}
	};
});