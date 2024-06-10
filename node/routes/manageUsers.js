var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');
const userController = require('../controllers/userController');

// GET manageUsers page
router.get('/', checkAuthenticated, userController.getUsers);

// POST add user
router.post('/add', checkAuthenticated, userController.addUser);

// POST delete user
router.post('/delete', checkAuthenticated, userController.deleteUser);

module.exports = router;
