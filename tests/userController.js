const { createUser } = require('../controllers/userController');
const { addUser } = require('../models/userModel');
const bcrypt = require('bcrypt');

// Mock the database model and bcrypt
jest.mock('../models/userModel');
jest.mock('bcrypt');

describe('User Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'Password123!',
      },
    };

    res = {
      render: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('✅ Successfully registers a user (Mocked)', async () => {
    bcrypt.hash.mockResolvedValue('hashedpassword'); // Mock bcrypt hash
    addUser.mockResolvedValue(); // Mock database function

    await createUser(req, res);

    expect(addUser).toHaveBeenCalledWith('testuser', 'hashedpassword');
    expect(res.render).toHaveBeenCalledWith('success', { message: 'User registered successfully!' });
  });

  test('❌ Registration fails due to DB error (Mocked)', async () => {
    bcrypt.hash.mockResolvedValue('hashedpassword');
    addUser.mockRejectedValue(new Error('Database error'));

    await createUser(req, res);

    expect(res.render).toHaveBeenCalledWith('register', { message: 'Error registering user. Try again!' });
  });
});
