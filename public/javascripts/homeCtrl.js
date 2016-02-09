myApp.controller('homeCtrl', function($scope,usrSvc,store,$state){
  var signUpOrIn;
  $scope.memberStatus = false;

  $scope.submit = function(){
    var wrapObj = {
      username: $scope.username,
      password: $scope.password,
      fullname: $scope.fullname,
      email: $scope.email
    }
    signUpOrIn = $scope.memberStatus ? "signin" : "signup";
    usrSvc[signUpOrIn](wrapObj)
    .then(function success(data){
      // The JWT is returned in the response and stored in a factory for global access
      // and then the page is redirected to the users page
      store.setToken(data)
      $state.go('profile')


    }, function error(err){
      $scope.password = '';
      var passwordBox = document.getElementById('password');
      passwordBox.style.borderColor = "red"

      console.log(err.data || err)
    })
  }
})