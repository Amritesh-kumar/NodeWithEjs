function validateUser(req, res, next) {
    const { username, password } = req.body;
  
    if (!username || !password ) {
      return res.render('register', { message: 'All fields are required' });
    }
  
    next();
  }
  
  module.exports = { validateUser };
  