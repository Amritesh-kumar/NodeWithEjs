const express = require('express');
const { showRegisterForm, createUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

router.get('/register', showRegisterForm);
router.post('/register', validateUser, createUser);

module.exports = router;