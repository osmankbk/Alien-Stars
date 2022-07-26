// const { rejects } = require('assert');
const path = require('path')
const fs = require('fs');
const { parse } = require('csv-parse');
// const { resolve } = require('path');
const habitablePlanets = [];

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
    .on('data', (data) => {
        if(isHabitablePlanets(data)) {
          habitablePlanets.push(data);
        }
    })
    .on('error', (error) => {
        reject(error);
    })
    .on('end', () => {
        console.log(`This is the list of habitable planets: ${habitablePlanets.length}`)
        resolve()
    });
    });
}

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};