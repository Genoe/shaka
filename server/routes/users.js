var DB = require('../modules/sqlPool.js');

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
    DB.query('INSERT INTO users SET ?', {first_name: req.body.first_name}, function(error, result) {
      if (!error) {
        res.json(true);
      } else {
        console.log("Error creating user: " + error);
      }
    })
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
