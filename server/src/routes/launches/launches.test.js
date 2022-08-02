const request = require('supertest');
const { response } = require('../../app');
const app = require('../../app');

describe('TEST Get /launches', () => {
  
  test('It should return 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);

  });
});

describe('TEST Post /launches', () => {

  const compleLaunchWithData = {
    mission: 'World Domination',
    rocket: " Oz Space-Craft",
    launchDate: "August 4, 2033",
    target: "Sun"
  }

  const launchDataWithoutDate = {
    mission: 'World Domination',
    rocket: " Oz Space-Craft",
    target: "Sun"
  }

  const launchWithInvalidDate = {
    mission: 'World Domination',
    rocket: " Oz Space-Craft",
    launchDate: "nodate",
    target: "Sun"
  }

  test('It should return 201 success', async () => {
    const response = await request(app)
      .post('/launches')
      .send(compleLaunchWithData)
      .expect('Content-Type', /json/)
      .expect(201)

      const requestDate = new Date(compleLaunchWithData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf()

      expect(requestDate).toBe(responseDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test('It should catch missing properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Missing Required launch property'
      })
  });

  test('It should catch invalid dates', async () => {
    const response = await request(app)
    .post('/launches')
    .send(launchWithInvalidDate)
    .expect('Content-Type', /json/)
    .expect(400)

    expect(response.body).toStrictEqual({
      error: 'Invalid launch date!'
    })
  });
});
