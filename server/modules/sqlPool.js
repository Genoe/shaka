/*
Creates a mysql connection pool which can be used throught the program.
*/
var mysql      = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 100, //will need aditional testing. Arbitrary number at this point
  host     : 'localhost', //ignored. Using socketPath
  user     : 'root',
  password : 'xxxx',
  database : 'shaka',
  debug    : 'false'
});

module.exports = pool;
