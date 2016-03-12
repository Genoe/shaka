/*
Creates a mysql connection pool which can be used throught the program.
*/
var mysql      = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 100, //will need aditional testing. Arbitrary number at this point
  host     : 'localhost', //ignored. Using socketPath
  user     : 'root',
  password : 'Blue55',
  socketPath: "/opt/lampp/var/mysql/mysql.sock",
  database : 'shaka',
  debug    : 'false'
});

module.exports = pool;
