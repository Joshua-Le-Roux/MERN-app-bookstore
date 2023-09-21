// addUserController.test.js
const controller  = require('../controllers/userController');
const addUsers = controller.addUser
const User = require('../models/userModel'); // Import your User model

jest.mock('../models/userModel'); // Mock the User model

describe('addUser controller', () => {
  it('should add a new user', async () => {
    // Mock the request and response objects
    const req = {
      body: {
        username: 'testuser',
        password: 'testpass_customer',
        security: 'testsecurity',
      },
    };
    const res = {
      send: jest.fn(),
      json: jest.fn(),
    };

    // Mock the User.find method to return an empty array (no existing user)
    User.find.mockResolvedValue([]);

    // Mock the User.save method to return the user data
    User.prototype.save.mockResolvedValue({
      _id: '123',
      username: 'testuser',
      password: 'testpass_customer',
      security: 'testsecurity',
      userType: 'customer',
    });

    // Call the addUser controller
    await addUsers(req, res);

    // Assert that the response matches the snapshot
    expect(res.json).toMatchSnapshot();
  });
});