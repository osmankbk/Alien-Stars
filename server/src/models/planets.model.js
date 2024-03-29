const path = require('path')
const fs = require('fs');
const planets = require('./planets.mongo');
const { parse } = require('csv-parse');

const isHabitablePlanets = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
     && planet['koi_insol'] > 0.36 
     && planet['koi_insol'] < 1.11
     && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on('data', async (data) => {
        if(isHabitablePlanets(data)) {
          savePlanet(data)
        }
    })
    .on('error', (error) => {
        reject(error);
    })
    .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`This is the list of habitable planets: ${countPlanetsFound}`)
        resolve()
    });
    });
}

async function getAllPlanets() {
  return await planets.find({}, {
    '__v': 0,
    '_id': 0,
    });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch(err) {
    console.error(`Could not save planet ${err}`);
  }
  
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};