const request = require('supertest');
const app = require('../src/app');
const { users, ideas } = require('../src/storage/memoryStore');

async function getToken() {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Founder', email: 'founder@example.com', password: 'secret123' });

  return response.body.token;
}

describe('idea validation routes', () => {
  beforeEach(() => {
    users.length = 0;
    ideas.length = 0;
  });

  test('validates startup idea and returns analysis sections', async () => {
    const token = await getToken();
    const authHeaderValue = 'Bearer ' + token;

    const response = await request(app)
      .post('/api/ideas/validate')
      .set('Authorization', authHeaderValue)
      .send({
        startupName: 'PilotAI',
        idea: 'AI copilot for startup founders to validate ideas and automate market research.',
        industry: 'SaaS',
        targetAudience: 'Early-stage founders',
      });

    expect(response.status).toBe(201);
    expect(response.body.analysis.summary).toBeTruthy();
    expect(Array.isArray(response.body.analysis.swot.strengths)).toBe(true);
    expect(response.body.analysis.marketResearch).toBeTruthy();
    expect(response.body.analysis.competitorAnalysis).toBeTruthy();
    expect(typeof response.body.analysis.startupScore).toBe('number');
    expect(Array.isArray(response.body.analysis.growthRecommendations)).toBe(true);
  });

  test('returns dashboard metrics for authenticated user', async () => {
    const token = await getToken();
    const authHeaderValue = 'Bearer ' + token;

    await request(app)
      .post('/api/ideas/validate')
      .set('Authorization', authHeaderValue)
      .send({ startupName: 'PilotAI', idea: 'Automate startup validation workflow' });

    const dashboardResponse = await request(app)
      .get('/api/dashboard')
      .set('Authorization', authHeaderValue);

    expect(dashboardResponse.status).toBe(200);
    expect(dashboardResponse.body.totalIdeas).toBe(1);
    expect(Array.isArray(dashboardResponse.body.recentIdeas)).toBe(true);
  });
});
