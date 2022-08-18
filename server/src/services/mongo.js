const mongoose = require('mongoose');
const env = require('dotenv')
env.config();

async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo Connected');
  }).catch((err) => {
    console.error(err);
  });
}

module.exports = {
  mongoConnect,
}