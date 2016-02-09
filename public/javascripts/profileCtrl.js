myApp.controller('profileCtrl',function($scope,store,$state, usrSvc){
  // stop people getting access to this page if no JWT is stored
  if(!store.getToken){
    $state.go('home')
  }

  $scope.$on('friendAdded', function(_,result){
    $scope.$broadcast('addFriend', result)

  })
  $scope.$on('friendRemoved', function(_,result){
    console.log("This on!!!!:",result)
    $scope.$broadcast('removeFriend', result)

  })

  
})