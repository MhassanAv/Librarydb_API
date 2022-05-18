import supertest from 'supertest';
import app from '../app';

const request = supertest(app);
describe('Test endpoint responses', () => {
  it('gets the main app endpoint', async () => {
    const response = await request.get('/welcome');
    expect(response.status).toBe(200);
  });
});
