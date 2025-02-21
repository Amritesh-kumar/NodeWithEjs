// const { addUser, getUserByUsername } = require('../models/userModel');
// const sql = require('mssql');

// // Mock mssql to avoid real database connection
// jest.mock('mssql');

// describe('User Model Tests', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); // Reset mocks before each test
//   });

//   test('✅ Successfully adds a user (Mocked)', async () => {
//     const mockRequest = {
//       input: jest.fn().mockReturnThis(),
//       query: jest.fn().mockResolvedValue({}),
//     };

//     const mockPool = {
//       request: jest.fn().mockReturnValue(mockRequest),
//     };

//     sql.connect.mockResolvedValue(mockPool);

//     await expect(addUser('testuser', 'hashedpassword')).resolves.toBeUndefined();
//     expect(mockRequest.input).toHaveBeenCalledTimes(3); // Ensure input bindings were made
//   });

//   test('✅ Fetch user by username (Mocked)', async () => {
//     const mockRequest = {
//       input: jest.fn().mockReturnThis(),
//       query: jest.fn().mockResolvedValue({
//         recordset: [{ name: 'testuser', Password: 'hashedpassword' }],
//       }),
//     };

//     const mockPool = {
//       request: jest.fn().mockReturnValue(mockRequest),
//     };

//     sql.connect.mockResolvedValue(mockPool);

//     const user = await getUserByUsername('testuser');
//     expect(user).toBeDefined();
//     expect(user.Username).toBe('testuser');
//   });

//   test('❌ Fetch non-existent user (Mocked)', async () => {
//     const mockRequest = {
//       input: jest.fn().mockReturnThis(),
//       query: jest.fn().mockResolvedValue({ recordset: [] }),
//     };

//     const mockPool = {
//       request: jest.fn().mockReturnValue(mockRequest),
//     };

//     sql.connect.mockResolvedValue(mockPool);

//     const user = await getUserByUsername('nonexistentuser');
//     expect(user).toBeNull();
//   });

//   test('❌ Database Error Handling (Mocked)', async () => {
//     sql.connect.mockRejectedValue(new Error('Database connection failed'));

//     await expect(getUserByUsername('testuser')).rejects.toThrow('Database connection failed');
//   });
// });


const { addUser, getUserByUsername } = require('../models/userModel');
const sql = require('mssql');

// ✅ Mock `mssql` to prevent real database calls
jest.mock('mssql');

describe('User Model Tests', () => {
  let mockRequest, mockPool;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    };

    mockPool = {
      request: jest.fn().mockReturnValue(mockRequest),
      connect: jest.fn().mockResolvedValue(mockPool),
    };

    sql.connect.mockResolvedValue(mockPool);
  });

  test('✅ Successfully adds a user (Mocked)', async () => {
    mockRequest.query.mockResolvedValue({});

    await expect(addUser('testuser', 'hashedpassword', 'test@example.com')).resolves.toBeUndefined();
    expect(mockRequest.input).toHaveBeenCalledTimes(3);
  });

  test('✅ Fetch user by username (Mocked)', async () => {
    mockRequest.query.mockResolvedValue({
      recordset: [{ Username: 'testuser', Email: 'test@example.com' }],
    });

    const user = await getUserByUsername('testuser');
    expect(user).toBeDefined();
    expect(user.Username).toBe('testuser');
  });

  test('❌ Fetch non-existent user (Mocked)', async () => {
    mockRequest.query.mockResolvedValue({ recordset: [] });

    const user = await getUserByUsername('nonexistentuser');
    expect(user).toBeNull();
  });

  test('❌ Database Error Handling (Mocked)', async () => {
    sql.connect.mockRejectedValue(new Error('Database connection failed'));

    await expect(getUserByUsername('testuser')).rejects.toThrow('Database connection failed');
  });
});
