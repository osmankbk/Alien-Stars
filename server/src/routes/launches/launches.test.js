const request = require('supertest');

const app = require('../../app');
const { 
  mongoConnect, 
  mongoDisconnect 
} = require('../../services/mongo');


describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('TEST Get /launches', () => {

    test('It should return 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
  
    });
  });
  
  describe('TEST Post /launches', () => {
  
    const compleLaunchWithData = {
      mission: 'World Domination',
      rocket: " Oz Space-Craft",
      launchDate: "August 4, 2033",
      target: "Kepler-62 f"
    }
  
    const launchDataWithoutDate = {
      mission: 'World Domination',
      rocket: " Oz Space-Craft",
      target: "Kepler-62 f"
    }
  
    const launchWithInvalidDate = {
      mission: 'World Domination',
      rocket: " Oz Space-Craft",
      launchDate: "nodate",
      target: "Kepler-62 f"
    }
  
    test('It should return 201 success', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(compleLaunchWithData)
        .expect('Content-Type', /json/)
        .expect(201)
  
        const requestDate = new Date(compleLaunchWithData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf()
  
        expect(requestDate).toBe(responseDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
        console.log('middle');
    });
  
    test('It should catch missing properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)
  
        expect(response.body).toStrictEqual({
          error: 'Missing Required launch property'
        })
        console.log('middle');
    });
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchWithInvalidDate)
      .expect('Content-Type', /json/)
      .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date!'
      })
      console.log('middle');
    });
  });
});


