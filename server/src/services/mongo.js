const mongoose = require('mongoose');
require('dotenv').config();

async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo Connected');
  }).catch((err) => {
    console.error(err);
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect()
  .then(() => {
    console.log('Mongo Disconnected!')
  }).catch((err) => {
    console.error(err);
  });
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
}