'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PuissanceCtrl', function ($scope, $routeParams, $location) {
  	// if user is not connected then redirect him to login
  	if(!socket.isLogged()) {
  		$location.path('/');
  	}
  	$scope.players = ['Player 1', 'Player 2'];
  	$scope.gameStatus = 'Attente d\'un adversaire';

  	$scope.idGame = idGame;

  	$scope.surrender = function() {
  		idGame = 0;
  		socket.bind().emit('surrend game');
  		$location.path('/choice');
  		$scope.$apply();
  	}
  });
