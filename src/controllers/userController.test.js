const mongoose = require('mongoose');
const request = require('supertest');
require('dotenv').config();

const app = require('../../app');
const User = require('../models/usersModels');

mongoose.set('strictQuery', false);

const { MONGOURI, PORT } = process.env;

describe('test auth routes', () => {
  let server;
  beforeAll(() => (server = app.listen(PORT)));
  afterAll(() => server.close());

  beforeEach(done => {
    mongoose.connect(MONGOURI).then(() => done());
  });
  afterEach(done => {
    mongoose.connection.close();
    done();
  });

  test('test right login route', async () => {
    const newUser = {
      email: 'test@gmail.com',
      avatarURL: 'testavatar',
      password: 'testpassword',
    };

    const user = await User.create({ ...newUser });

    const loginUser = {
      email: 'test@gmail.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(loginUser);

    expect(response.statusCode).toBe(200);
    const { body } = response;
    expect(body.token).toBeTruthy();
    const { token } = await User.findById(user._id);
    expect(body.token).toBe(token);
    expect(typeof body.user).toBe('object');

    expect(body.user.hasOwnProperty('email')).toBe(true);
    expect(body.user.hasOwnProperty('subscription')).toBe(true);
    expect(body.user.hasOwnProperty('avatarURL')).toBe(true);

    expect(typeof body.user.email).toBe('string');
    expect(typeof body.user.subscription).toBe('string');
    expect(typeof body.user.avatarURL).toBe('string');

    await User.findByIdAndDelete(user._id);
  });
});
