const http = require('http');
const env = require('dotenv')
const app = require('./app');
const mongoose = require('mongoose');
const { loadPlanetsData } = require('./models/planets.model')
const MONGO_URI = 'mongodb+srv://nasa-api:tPZ9HtjrmDgyPw6b@nasacluster.ngfxjkw.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 8000;

// mongoose.connection.once('open', () => {
//   console.log('Mongo Connected');
// });

// mongoose.connection.on('error', (err) => {
//   console.error(err);
// })


async function startServer() {
  await mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongo Connected');
  }).catch(() => {
    console.error(err);
  });
  await loadPlanetsData();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`App is listening on: ${PORT}...`)
  })
}
startServer();






