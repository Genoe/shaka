var DB = require('../modules/sqlPool.js');
var bcrypt = require('bcrypt');
var validator = require('validator');
var crypto = require('crypto');
var AWS = require('aws-sdk');
var emailParams = require('../config/passwordResetEmail.js');
AWS.config.update({region: 'us-west-2'});

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
/*
Use when a user wants to reset their password. A hash is stored in the database with a timestamp/expiration
and an email is sent to the user.
*/

  sendPasswordLink: function (req, res) {
    DB.query('SELECT * FROM users WHERE email = ' + DB.escape(req.body.email), function(error, userResult) {
      if (!error && userResult.length > 0) {
        var token = crypto.randomBytes(128).toString('hex'); //convert to hex to make it url safe
        DB.query('INSERT INTO pass_reset_tokens SET ? ', {
          user_id: userResult[0].id,
          token: token
        }, function(error, result) {
          if (!error) {
            //send email
            var ses = new AWS.SES();
            emailParams.Message.Body.Html.Data = "Click the link to reset your password: http://ec2-52-89-103-111.us-west-2.compute.amazonaws.com:3000/changepassword:" + token;
            ses.sendEmail(emailParams, function(error, data) {
              if (error) {
                console.log("Problem with sending email: " + error + "\n" + error.stack);
                res.json(false);
              } else {
                res.json(true);
              }
            });
          } else {
            console.log("Error storing token in DB: " + error);
            res.json(false);
          }
        });
      } else {
        console.log("Problem finding user: " + error);
        res.json("Could not find user");
      }
    });
  },

  changePassword: function(req, res) {
    var token = req.params.token;
    var password = req.body.password;
    if (validator.isAlphanumeric(password) && validator.isLength(password, { min: 8, max: 60 })) {
      DB.query('SELECT user_id, creation_time FROM pass_reset_tokens WHERE token = ' + DB.escape(token) + ' AND creation_time > NOW() - 1800', function(error, result) {
        if (!error && result.length > 0) {
          bcrypt.genSalt(10, function(error, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              DB.query('UPDATE users SET password = ' + DB.escape(hash) + ' WHERE id = ' + result[0].user_id, function(error, result) {
                if (!error) {
                  res.json(true);
                } else {
                  console.log("Error changing password: " + error);
                  res.json(false);
                }
              });
            });
          });
        } else {
          res.json(false);
          console.log("Problem getting token or not found" + error);
        }
      })
    } else {
      res.json("Invalid Input");
    }
  },

  delete: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  },

  update: function(req,res) {

  }
};

function validateInput(username, password, email, firstName, lastName) {
  if ((validator.isAlpha(username) || validator.isAlphanumeric(username)) &&
    validator.isLength(username, {
      min: 4,
      max: 20
    }) &&
    validator.isAlphanumeric(password) &&
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
