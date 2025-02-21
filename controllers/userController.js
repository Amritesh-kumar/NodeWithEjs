const {addUser } = require('../models/userModel');
const bcrypt = require('bcrypt');

async function showRegisterForm(req, res) {
    res.render('register', { message: null });
  }

async function createUser(req, res) {
    const { username, password } = req.body;
    try {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      await addUser(username, hashedPassword);
  
      res.render('success', { message: 'User registered successfully!' });
    } catch (error) {
      res.render('register', { message: 'Error registering user. Try again!' });
    }
  }
  
module.exports = { showRegisterForm, createUser };