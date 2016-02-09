myApp.service('usrSvc',function($http,store){

  this.signup = function(newUser){
    return $http.post('users/signup', newUser)
  }

  this.signin = function(userDetails){
    return $http.post('users/signin', userDetails)
  }
  this.edit = function(userId, field, newVal){
    return $http.put('users/changedata/'+ userId + '/' + field, {new:newVal})
  }

  this.addFriend = function(userId, friendId){
    return $http.put('users/addFriend/' + userId, {newFriend: friendId})
  }
  this.unfriend = function(userId, friendId){
    return $http.put('users/unfriend/'+ userId + '/' + friendId)
  }

  this.openJWT = function(jwt){
    // this will take the middle section of the JWT, where the user
    // name and id are and base64 decode it
    var middleSegment = jwt.match(/\.(.+)\./)[1];
    var decodedJwt = JSON.parse(atob(middleSegment));
    return decodedJwt._id
  }

  this.getUsers = function(searchitem){
    if(searchitem){
      return $http.get('users/userlist/'+ searchitem)
    }else{
      return $http.get('users/allUsers/'+ store.getId )
    }
  }

  this.getUserDetails = function(jwt,userId){
    return $http({
      method: 'GET',
      url: 'users/mydetails/'+ userId,
      headers:{
        "Authorization": "Bearer " + jwt
      }
    })

  }

})