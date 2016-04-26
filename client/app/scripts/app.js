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
        templateUrl: '../app/views/puissance.html',
        controller: 'PuissanceCtrl',
        controllerAs: 'puissance'
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
