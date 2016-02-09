myApp.config(function($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home',{
      url:'/',
      templateUrl: "./templates/home.html",
      controller: "homeCtrl"
    })
    .state('profile',{
      url:'/profile',
      templateUrl: "./templates/accountPage.html",
      controller: "profileCtrl"
    })
})