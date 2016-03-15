var DB = require('../modules/sqlPool.js');
var jwt = require('jwt-simple');

var drops = {

  getAll: function(req, res) {
    DB.query('SELECT * FROM events', function(error, results) {
      if (!error) {
        console.log("Got all events! \n");
        res.json(results);
      } else {
        console.log("Error in getAll events query" + error);
      }
    });
  },

  getOne: function(req, res) {
    DB.query('SELECT * FROM events WHERE id = ' + DB.escape(req.params.id), function(error, results) {
      if (!error) {
        res.json(results);
      } else {
        console.log("Error in getOne events: " + error);
      }
    })
  },

  create: function(req, res) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var decoded = jwt.decode(token, require('../config/secret.js')());
    DB.query('INSERT INTO events SET ?', {
      user_id: decoded.user[0].id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      note: req.body.note
    }, function(error, result) {
      if (!error) {
        res.json(true);
      } else {
        console.log("Error creating drop: " + error);
        res.json(false);
      }
    });
  },

  update: function(req, res) {
    var updateProduct = req.body;
    var id = req.params.id;
    data[id] = updateProduct // Spoof a DB call
    res.json(updateProduct);
  },

  delete: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  }
};

var data = [{
  name: 'product 1',
  id: '1'
}, {
  name: 'product 2',
  id: '2'
}, {
  name: 'product 3',
  id: '3'
}];

module.exports = drops;
