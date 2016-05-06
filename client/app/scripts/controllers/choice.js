'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ChoiceCtrl', function ($scope, $location) {
  	// if user is not connected then redirect him to login
  	if(!socket.isLogged()) {
  		$location.path('/');
  	}

  	$scope.games = [
  		{name:'Puissance', value:'puissance'},
  		{name:'Morpion', value:'morpion'},
      {name:'UltimateMorpion', value:'ultimateMorpion'}
  	];
  	// remove blnk option
  	$scope.select = $scope.games[0].value;

    $scope.click = function() {
    	if($scope.select === 'puissance') {
        currentGame = $scope.select;
    		socket.bind().on('server accept request : create p4 game', function(id) {
    			idGame = id;
    			$location.path('/'+id);
    			$scope.$apply();
    		});
    		socket.bind().emit('client wants to create p4 game');
    	}
      else if($scope.select === 'morpion') {
        currentGame = $scope.select;
        socket.bind().on('server accept request : create morpion game', function(id) {
          idGame = id;
          $location.path('/'+id);
          $scope.$apply();
        });
        socket.bind().emit('client wants to create morpion game');
      }
      else if($scope.select === 'ultimateMorpion') {
        currentGame = $scope.select;
        socket.bind().on('server accept request : create ultimate morpion game', function(id) {
          console.log("yep");
          idGame = id;
          $location.path('/'+id);
          $scope.$apply();
        });

        socket.bind().emit('client wants to create ultimate morpion game');
      }
  	}
  });
