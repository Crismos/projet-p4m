'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngRoute'
  ])
  .config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/choice', {
        templateUrl: 'app/views/choice.html',
        controller: 'ChoiceCtrl',
        controllerAs: 'choice'
      })
      .when('/:id', {
        templateUrl: function() {
          if(currentGame === 'puissance') {
            return '../app/views/puissance.html';
          }
          if(currentGame === 'morpion') {
            return '../app/views/morpion.html';
          }
          return '../app/views/puissance.html';
        },
        controller: 'GameCtrl'
      })
      .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
