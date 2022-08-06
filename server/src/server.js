const http = require('http');
const env = require('dotenv')
const app = require('./app');
const mongoose = require('mongoose');
const { loadPlanetsData } = require('./models/planets.model')
const PORT = process.env.PORT || 8000;
env.config();

// mongoose.connection.once('open', () => {
//   console.log('Mongo Connected');
// });

// mongoose.connection.on('error', (err) => {
//   console.error(err);
// })


async function startServer() {
  await mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo Connected');
  }).catch((err) => {
    console.error(err);
  });
  await loadPlanetsData();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`App is listening on: ${PORT}...`)
  })
}
startServer();






