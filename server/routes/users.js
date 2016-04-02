var DB = require('../modules/sqlPool.js');
var bcrypt = require('bcrypt');
var validator = require('validator');

var users = {

  getAll: function(req, res) {
    /*
    var allusers = data; // Spoof a DB call
    res.json(allusers);
    */
    DB.query('SELECT * FROM users', function(error, results, fields) {
      if (!error) {
        console.log("Got the users");
        res.json(results);
      } else {
        console.log("Error in getAll users query" + error);
      }
    });
  },

  getOne: function(req, res) {
    /*
    var id = req.params.id;
    var user = data[0]; // Spoof a DB call
    res.json(user);
    */
    DB.query('SELECT * FROM users WHERE id = ' + DB.escape(req.params.id), function(error, results, fields) {
      if (!error) {
        res.json(results);
      } else {
        console.log("Error in getOne users: " + error);
      }
    })
  },

  create: function(req, res) {
    if (validateInput(req.body.username, req.body.password, req.body.email, req.body.first_name, req.body.last_name)) {
      bcrypt.genSalt(10, function(error, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          DB.query('INSERT INTO users SET ?', {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            role: "user",
            email: req.body.email,
            password: hash
          }, function(error, result) {
            if (!error) {
              res.json(true);
            } else {
              console.log("Error creating user: " + error);
              res.json(false);
            }
          })
        });
      });
    } else {
      res.json("Invalid Input");
    }

  },

  update: function(req, res) {
    var updateuser = req.body;
    var id = req.params.id;
    data[id] = updateuser // Spoof a DB call
    res.json(updateuser);
  },

  delete: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  }
};

function validateInput(username, password, email, firstName, lastName) {
  if (validator.isAlpha(username) &&
    validator.isLength(username, {
      min: 4,
      max: 20
    }) &&
    validator.isAlphanumberic(password) &&
    validator.isLength(password, {
      min: 8,
      max: 60
    }) &&
    validator.isEmail(email) &&
    validator.isAlpha(firstName) &&
    validator.isLength(firstName, {
      min: 1,
      max: 50
    }) &&
    validator.isAlpha(lastName) &&
    validator.isLength(lastName, {
      min: 1,
      max: 50
    })
  ) {
    return true;
  } else {
    return false;
  }
}

var data = [{
  name: 'user 1',
  id: '1'
}, {
  name: 'user 2',
  id: '2'
}, {
  name: 'user 3',
  id: '3'
}];

module.exports = users;
