// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

// configuracion de enrrutamiento de las vistas
app.config(function($stateProvider, $urlRouterProvider){
  // vista principal de la app
  $stateProvider.state('home',{
    url:'/home',
    templateUrl:'templates/home.html'
  });

  // vista del perfil
  $stateProvider.state('perfil',{
    url:'/perfil',
    templateUrl:'templates/perfil.html'
  });

  // vista de los ajustes
  $stateProvider.state('ajustes',{
    url:'/ajustes',
    templateUrl:'templates/ajustes.html'
  });

  $urlRouterProvider.otherwise('/home');
});

// controlador para cambiar de vistas con las pestañas del submenu horizontal
app.controller('principal', function ($scope,$state, $ionicSlideBoxDelegate) {
  $scope.eventos = function() {
    $ionicSlideBoxDelegate.slide(0);
  };
  $scope.partidos = function() {
    $ionicSlideBoxDelegate.slide(1);
  };
  $scope.busqueda = function() {
    $ionicSlideBoxDelegate.slide(2);
  };

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
});

// controlador para ocultar el menu lateral al cambiar de vista
app.controller('ocultaMenuVista', function ($scope) {
  $scope.$on("$ionicView.enter", function (event, data) {
    ocultaMenu();
  });
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
