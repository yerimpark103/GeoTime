// Dependencies
var mongoose        = require('mongoose');
var User            = require('./user.js');
var Login           = require('./login.js')


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                return res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err)
                return res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });


// // GET Routes
// // --------------------------------------------------------
// // for user id
// app.get('/users' + _id, function(req, res){
//
//     // Uses Mongoose schema to run the search (empty conditions)
//     var query = User.find({});
//     query.exec(function(err, users){
//         if(err)
//             return res.send(err);
//
//         // If no errors are found, it responds with a JSON of all users
//         res.json(users);
//     });
// });

// GET Routes
// --------------------------------------------------------
// Retrieve records for all logins in the db
app.get('/logins', function(req, res){

    // Uses Mongoose schema to run the search (empty conditions)
    var query = Login.find({});
    query.exec(function(err, logins){
        if(err)
            return res.send(err);

        // If no errors are found, it responds with a JSON of all logins
        res.json(logins);
    });
});
// POST Routes
// --------------------------------------------------------
// Provides method for saving new logins in the db
app.post('/logins', function(req, res){

    // Creates a new User based on the Mongoose schema and the post bo.dy
    var newlogin = new Login(req.body);

    // New User is saved in the db.
    newlogin.save(function(err){
        if(err)
            return res.send(err);

        // If no errors are found, it responds with a JSON of the new user
        res.json(req.body);
    });
});
app.put('/logins', function(req, res){
  var group = req.params.group;
  var maps = req.params.maps;
  User.update(
      {'_id':_id},
      {$set:{'group':group, 'maps':maps}},
      function(err, user){
        if (err){
          res.status(400);
          return res.json({message: 'User not found', data:{}});
        }
        else{
          res.status(200);
          return res.json({message: "OK", data:user});
        }
      }
    );

});
};
