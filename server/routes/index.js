var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var drops = require('./drops.js');
var user = require('./users.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', user.create);
router.post('/resetpassword', user.sendPasswordLink);
router.post('/changepassword/:token', user.changePassword);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/drops', drops.getAll);
router.get('/api/v1/drop/:id', drops.getOne);
router.post('/api/v1/drop/', drops.create);
router.put('/api/v1/drop/:id', drops.update);
router.delete('/api/v1/drop/:id', drops.delete);
router.post('/api/v1/drop/range', drops.getRange);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
//router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);

module.exports = router;
