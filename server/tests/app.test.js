const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app, helpers } = require('../src/app');

test('slugify handles special branch names', () => {
  assert.equal(helpers.slugify('CSE(AI&ML)'), 'cse-ai-and-ml');
  assert.equal(helpers.slugify('Computer Science & Networks'), 'computer-science-and-networks');
});

test('GET /api/branches returns branch list with expected structure', async () => {
  const response = await request(app).get('/api/branches').expect(200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);

  const branch = response.body.find((item) => item.code === 'CSE(AI&ML)');
  assert.ok(branch, 'Expected CSE(AI&ML) branch to be present');
  assert.equal(branch.id, 'cse-ai-and-ml');
});

test('POST /api/auth/login accepts any credentials and returns token', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      name: 'Test User',
      email: 'test@kitsw.ac.in',
      password: 'anything',
      branch: 'cse-ai-and-ml'
    })
    .expect(200);

  assert.ok(response.body.token, 'Token should be returned');
  assert.equal(response.body.user.branchSlug, 'cse-ai-and-ml');
});

test('GET /api/subjects returns subjects for branch and semester', async () => {
  const response = await request(app)
    .get('/api/subjects')
    .query({ branch: 'cse-ai-and-ml', semester: '1' })
    .expect(200);

  assert.equal(response.body.semester, '1');
  assert.ok(Array.isArray(response.body.subjects));
  assert.ok(response.body.subjects.length > 0);
});

