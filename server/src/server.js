const http = require('http');
const env = require('dotenv')
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const { mongoConnect } = require('../src/services/mongo');

env.config();
const PORT = process.env.PORT || 8000;
// mongoose.connection.once('open', () => {
//   console.log('Mongo Connected');
// });

// mongoose.connection.on('error', (err) => {
//   console.error(err);
// })


async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`App is listening on: ${PORT}...`)
  })
}
startServer();






