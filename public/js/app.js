// Declares the initial angular module "geotime". Module grabs other controllers and services.
var app = angular.module('geotime', ['ngRoute', 'geotimeServices', 'geotimeControllers', 'geolocation', '720kb.datepicker']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, locationProvider) {
  $routeProvider.

  when('/mapping', {
    templateUrl: 'partials/mapping.html',
    controller: 'addCtrl'
  }).
  when('/firstview', {
    templateUrl: 'partials/firstview.html',
    controller: ''
  }).
  when('/about', {
    templateUrl: 'partials/about.html',
    controller: ''
  }).
  when('/visuals', {
    templateUrl: 'partials/visuals.html',
    controller: 'visualsCtrl'
  }).
  when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginCtrl'
  }).
  /*
  when('/details/:id', {
        templateUrl: 'partials/userdetails.html',
        controller: 'UserDetailsController'
    }).
    when('/adduser', {
        templateUrl: 'partials/adduser.html',
        controller: 'AddUserController'
    }).
    when('/tasklist', {
        templateUrl: 'partials/tasklist.html',
        controller: 'TasksListController'
    }).
    when('/addtask', {
        templateUrl: 'partials/addtask.html',
        controller: 'AddTaskController'
    }).
    when('/taskdetails/:id', {
        templateUrl: 'partials/taskdetails.html',
        controller: 'TaskDetailsController'
    }).
    when('/edittask/:id', {
        templateUrl: 'partials/edittask.html',
        controller: 'EditTaskController'
    }).*/
  otherwise({
    redirectTo: '/firstview'
  });
}]);
