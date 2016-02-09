myApp.controller('searchCtrl',function($scope,usrSvc,store){
  

  usrSvc.getUsers()
  .then(function success(users){
    if(users){
      $scope.people = users.data  
    }
  })


  $scope.search = function(searchterm){
    usrSvc.getUsers(searchterm)
    .then(function success(users){
      if(users){
        console.log(users.data)
        $scope.people = users.data  
      }
    })
  }

  $scope.$on('removeFriend',function(_,person){
   usrSvc.getUsers()
   .then(function success(users){
    if(users){
      $scope.people = users.data  
    }
   $scope.people.push(person)
  })
 })

  $scope.addFriend = function(friend,index){
    usrSvc.addFriend(store.getId,friend._id)
    $scope.people.splice(index,1);

    $scope.$emit('friendAdded',friend)
    console.log(friend)

  }


})