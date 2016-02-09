var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('./authMiddleware');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// This is the initial signing up and creation of new user in the database

router.post('/signup', function(req,res){
  console.log(req.body)
  var user = new User();
  user.username= req.body.username;
  user.email= req.body.email;

  // I initially thought the search was for the name, so I split the fullname into
  // an array of the name parts so that any one part searched for would match. But, after
  // rereading the task, it is only the username I need to implement a search for.
  user.fullname= req.body.fullname.split(' ');
  user.setPassword(req.body.password);
  user.save(function(err,user){
    if (err){
      res.send(err)
    }else{
      var jwt = user.generateJWT();
      res.send(jwt);
    }
  })
})

router.post('/signin', function(req,res){
  User.findOne({
    username: req.body.username
  } , function(err,user){
    if(!user || !user.validatePassword(req.body.password)){
      res.status(401).send('Invalid login credentials')
    }else{
      var jwt = user.generateJWT();
      res.send(jwt); 
    }
  })
})

// This uses the auth middleware to check the logged in user
// has a valid JWT. Then returns the logged on users details
router.get('/mydetails/:id',auth, function(req,res){
  User.findById(req.params.id)
    .populate('friends')
    .exec(function(err,user){
      if(err){
        res.send(err)
      }else{
        res.send(user)  
      }
      
    })

})

// Although there are only a few fields in each record, I just want to demonstrate
// that I know how to return a selected few, so here I explicitly tell the db to return three 
// named fields 
router.get('/members/:name', function(req,res){
  User.findOne({
    fullname: req.params.name
  },'fullname email username',function(err, user){
    if(err){
      res.send('Error: ', err)
    }
    res.send(user)
  })
})

// This route will return all the users in the database after filtering out your own
// details
router.get('/allUsers/:ownId',function(req,res){
  // User.findById(req.params.ownId, function(err, mainUser){
    User.find({}, function(err, users){
      var ownNameRemoved =users.filter(function(user){
        // var userId = user._id;
        if(user._id != req.params.ownId){
          // if(mainUser.friends.indexOf(userId)){
            if(user.friends.indexOf(req.params.ownId))
            return user;
        }
      })
    res.send(ownNameRemoved)
  })
})

// This route will search for a user by username and return the
// file. Username is unique so this will never return more than one
router.get('/userlist/:name',function(req,res){
  User.find({username:req.params.name}, function(err, user){
    console.log(user)
    res.send(user)
  })
})


// This route will update any changes to the users data
router.put('/changedata/:id/:field',function(req,res){
  User.findById(req.params.id, function(err, user){
    user[req.params.field] = req.body.new;
    user.save(function(err,success){
      if(err){
        res.send("Change not saved")
      }else{
        res.send("success")      
      }
    })
  })
})


// This will add a friend and also add you to their list of friends
// Don't know if I'll have time to implement mutual agreement, so for now,
// it is assumed everyone agrees to a friendship request
router.put('/addFriend/:id', function(req,res){
  User.findById(req.params.id, function(err,user){
    user.friends.push(req.body.newFriend);
    User.findById(req.body.newFriend, function(err, friend){
      friend.friends.push(req.params.id);
      friend.save()
    })
    user.save(function(err,success){
      if(err){
        res.send("Change not saved")
      }else{
        res.send("success")      
      }
    })

  })
})

 router.put('/unfriend/:id/:friend', function(req,res){
  User.findById(req.params.id, function(err, user){
    User.findById(req.params.friend, function(err, friend){
      var indexToDelete = user.friends.indexOf(req.params.friend);
      if(indexToDelete >= 0){
        user.friends.splice(indexToDelete,1)
      }
      indexToDelete = friend.friends.indexOf(req.params.id);
      if(indexToDelete >= 0){
        friend.friends.splice(indexToDelete,1)
      }
      user.save()
      friend.save()
      res.send('Success')
    })
  })
})




module.exports = router;
