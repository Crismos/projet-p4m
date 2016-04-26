'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MorpionCtrl', function ($scope, $routeParams) {
  	// if user is not connected then redirect him to login
  	if(!socket.isLogged()) {
  		$location.path('/');
  	}
  	$scope.idGame = idGame;
  });
