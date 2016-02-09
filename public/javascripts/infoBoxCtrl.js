myApp.controller('infoBox',function($scope,usrSvc,store){
  // this gets the JWT from the store factory and uses it
  // to retrieve the personal data from the database.
  var jwt = store.getToken;
  var userId = usrSvc.openJWT(jwt)
  store.setId(userId);
  usrSvc.getUserDetails(jwt,userId)
  .then(function success(user){
    $scope.myLocalDetails ={
      username: user.data.username,
      fullname: user.data.fullname.join(' '),
      email: user.data.email,
      friends: user.data.friends
    }
  })

  $scope.usernameEdit = false;
  $scope.name = false;
  $scope.email=false;

  $scope.unfriend = function(id,index){
    usrSvc.unfriend(userId, id._id)
    $scope.$emit('friendRemoved',$scope.myLocalDetails.friends[index])
    $scope.myLocalDetails.friends.splice(index,1)
  }

  $scope.$on('addFriend', function(result,other){
    $scope.myLocalDetails.friends.push(other)
  })

  // The following functions are to change the user information 
  // in the database
  $scope.changeUsername = function(){
    usrSvc.edit(userId,"username",$scope.myLocalDetails.username)
    .then(function success(){
      $scope.usernameEdit = !$scope.usernameEdit;
    }, function error(){
      console.log("The data was not saved")
    })
  }
  $scope.changeEmail = function(){
    usrSvc.edit(userId,"email",$scope.myLocalDetails.email)
    .then(function success(){
      $scope.emailEdit = !$scope.emailEdit;
    }, function error(){
      console.log("The data was not saved")
    })
  }
  $scope.changeFullname = function(){
    usrSvc.edit(userId,"fullname",$scope.myLocalDetails.fullname)
    .then(function success(){
      $scope.nameEdit = !$scope.nameEdit;

      // $emit('update',$scope.myLocalDetails)// Try ////////
    

    }, function error(){
      console.log("The data was not saved")
    })
  }

})