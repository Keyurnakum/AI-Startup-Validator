const request = require('supertest');
const app = require('../src/app');
const { users, ideas } = require('../src/storage/memoryStore');

describe('auth routes', () => {
  beforeEach(() => {
    users.length = 0;
    ideas.length = 0;
  });

  test('registers and logs in user', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jane', email: 'jane@example.com', password: 'secret123' });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeTruthy();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'secret123' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.email).toBe('jane@example.com');
  });

  test('prevents duplicate registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jane', email: 'jane@example.com', password: 'secret123' });

    const duplicateResponse = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jane 2', email: 'jane@example.com', password: 'secret123' });

    expect(duplicateResponse.status).toBe(409);
  });
});
