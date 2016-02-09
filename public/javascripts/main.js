'use strict'

var myApp = angular.module('myApp',['ui.router'])

.directive('usersInfo',function(){
  return {
    templateUrl: "../templates/userInfo.html",
    scope:true,
    controller:"infoBox"
  }
})

.directive('userSearch',function(){
  return {
    templateUrl: "../templates/searchPanel.html",
    scope:true,
    controller:"searchCtrl"
  }
})
