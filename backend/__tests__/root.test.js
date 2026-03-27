const request = require('supertest');

// Import app without starting server/DB sync (see require.main guard in app.js)
const app = require('../src/app');

describe('Backend smoke tests', () => {
  test('GET / returns basic info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Hệ thống Quản lý Đào tạo & Điểm danh Sinh viên');
    expect(res.body).toHaveProperty('docs');
    expect(res.body).toHaveProperty('health');
  });

  test('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

