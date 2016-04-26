'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ChatCtrl', function ($scope, $location, $element) {

    /*
    * Class Conversation: user {id:int, name:String: status:int}
    *
    * prototype user.getStatus -> online/ongame/afk
    * Conversation.messages.new -> []: new messages (not read yet)
    * Conversation.messages.old -> []: old messages (already read)
    * 
    * prototype messages.notif() -> int: number of not read messages
    * prototype open(): read all not read messages & set currentConversation to this
    * prototype close(): set currentConversation to null
    */
  	var Conversation = function(user) {
  		this.user = user;
  		var that = this;
  		this.user.getStatus = function() {
  			if(that.user.status == 0) {
  				return 'online';
  			} else if (that.user.status == 1) {
  				return 'ongame';
  			} else {
  				return 'afk';
  			}
  		}
  		this.messages = {};
  		this.messages.new = [];
  		this.messages.old = [];
  		this.read = function() {
  			while(that.messages.new.length > 0) {
				that.messages.old.push(that.messages.new.splice(0,1).pop());
			}
  		}
  		this.messages.notif = function() {
  			return that.messages.new.length > 0 ? that.messages.new.length : '';
  		}

  		this.open = function() {
  			$scope.currentConversation = that;
  			$scope.currentConversation.read();
  			$("#msg").focus();
  		}
  		this.close = function() {
  			$scope.currentConversation = null;
  		}
  	}

    // update when user choose a conversation
  	$scope.currentConversation = null;

    // update when user open/close chat tab
  	$scope.open = false;

    // update when user login in
  	$scope.active = false;

    // update when users updates
  	$scope.conversations = [];

  	socket.bind().on('connection success', function() {
  		$scope.active = true;
  	});

  	$scope.toggle = function() {
  		if($scope.open) {
  			$scope.open = false;
  		}
  		else {
  			$scope.open = true;
  		}
  	}

  	$scope.send = function() {
  		console.log({text: $scope.message, to: $scope.currentConversation.user.id});
  		socket.bind().emit('message', {text: $scope.message, to: $scope.currentConversation.user.id});
  		$scope.message = '';
  	}

  	socket.bind().on('welcome', function(o) {
  		if(socket.isLogged()) {
	  		for(var key in o) {
	  			$scope.conversations.push(new Conversation(o[key]));
	  		}
	  		$scope.$apply();
	  	}
  	});
  	socket.bind().on('upUser', function(o) {
  		if(socket.isLogged()) {
	  		for(var key in $scope.conversations) {
	  			if(o.id == $scope.conversations[key].user.id) {
	  				$scope.conversations[key].user.id = o.id;
	  				$scope.conversations[key].user.name = o.name;
	  				$scope.conversations[key].user.status = o.status;
	  			}
	  		}
	  		$scope.$apply();
	  	}
  	});
  	socket.bind().on('rmUser', function(o) {
  		if(socket.isLogged()) {
			   for(var key in $scope.conversations) {
	  			if(o.id == $scope.conversations[key].user.id) {
	  				$scope.conversations.splice($scope.conversations.indexOf($scope.conversations[key]),1);
	  			}
	  		}
	  		$scope.$apply();
	  	}
  	});
  	socket.bind().on('newUser', function(o) {
  		if(socket.isLogged()) {
	  		$scope.conversations.push(new Conversation(o));
	  		$scope.$apply();
  		}
  	});
  	socket.bind().on('message', function(o) {
  		if(socket.isLogged()) {
  			var conv = null;
  			for(var key in $scope.conversations) {
  				if($scope.conversations[key].user.id == o.from) {
  					conv = $scope.conversations[key];
  				}
  			}
  			if(conv) {
  				if($scope.currentConversation && conv.user.id == $scope.currentConversation.user.id) {
  					// if it's not the openned conversation
  					conv.messages.old.push({me: o.to, text: o.text});
  				} else {
  					conv.messages.new.push({me: o.to, text: o.text});
  				}
  			}
  			$scope.$apply();
  		}
  	});
  });