var jwt = require('jwt-simple');
var DB = require('../modules/sqlPool.js');
var bcrypt = require('bcrypt');

var auth = {
    login: function(req, res) {
      var username = req.body.username || '';
      var password = req.body.password || '';
      if (username == '' || password == '') {
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }

      DB.query('SELECT * FROM users WHERE username = ' + DB.escape(username), function(error, result) {
        bcrypt.compare(password, result[0].password, function(error, match) {
          if (!error) {
            if (match) {
              console.log("BELOW IS THE RESULT OF THE QUERY: \n" + result[0].last_name);
              res.json(genToken(result));
            } else {
              res.status(401);
              res.json({
                "status": 401,
                "message": "Invalid credentials!"
              });
            }
          } else {
            res.status(500);
            res.json({
              "status": 500,
              "message": "Server Error!!"
            });
          }
        });
      });


    },
    validate: function(username, password) {
      /*
        DB.query('SELECT * FROM users WHERE username = ' + DB.escape(username), function(error, result) {
              bcrypt.compare(password, result[0].password, function(error, match) {
                if (!error) {
                  if (match) {
                    console.log("BELOW IS THE RESULT OF THE QUERY: \n" + result[0].password);
                    res.json(genToken(dbUserObj));
                  } else {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid credentials!"
                      }
                    }
                    else {
                      res.status(500);
                      res.json({
                        "status": 500,
                        "message": "Server Error!!"
                      });
                    }
                  });
              });
              */
            },
            validateUser: function(username) {
              // spoofing the DB response for simplicity
              var dbUserObj = { // spoofing a userobject from the DB.
                name: 'arvind',
                role: 'admin',
                username: 'arvind@myapp.com'
              };
              return dbUserObj;
            },
          }
          // private method
        function genToken(user) {
          var expires = expiresIn(7); // 7 days
          var token = jwt.encode({
            exp: expires
          }, require('../config/secret')());
          return {
            token: token,
            expires: expires,
            user: user
          };
        }

        function expiresIn(numDays) {
          var dateObj = new Date();
          return dateObj.setDate(dateObj.getDate() + numDays);
        }
        module.exports = auth;
