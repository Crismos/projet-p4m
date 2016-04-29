'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $location, $routeParams) {
  	socket.bind().on('connection success', function() {
  		if(idGame === '0') {
  			$location.path('/choice');
  		} else {
  			socket.bind().on('server accept request : want to join game', function(o) {
          currentGame = o.typeGame;
  				$location.path('/'+o.id);
  				$scope.$apply();
  			});
  			socket.bind().emit('client wants to join game', idGame);
  		} 		

  		$scope.$apply();
  	});
  	$scope.click = function() {
  		socket.bind().emit('user sends his pseudo to server', {name: $scope.pseudo});
  	}
  });
