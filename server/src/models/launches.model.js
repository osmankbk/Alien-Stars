const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
// const launches = new Map();


const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true, 
  success: true,

};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

function launchWithIdExist(launchId) {
  return launches.has(launchId);
}

async function getLattestFlightNumber() {
  try {
    const latestLaunch = await launches.findOne().sort('-flightNumber');

    if(!latestLaunch) {
      return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
  } catch(err) {
    console.error(`${err}`)
  }
}

async function getAllLaunches() {
  return await launches.find({}, {
    '_id': 0,
    '__v': 0,
  });
};

async function saveLaunch(launch) {
  try {
    const planet = await planets.findOne({
      keplerName: launch.target
    })
    
    if(!planet) throw new Error('No matching planet found!');

    await launches.updateOne({
      flightNumber: launch.flightNumber,
    }, launch, {
      upsert: true,
    })
  } catch(err) {
    console.error(`Launch was not saved ${err}`)
  }

}

async function scheduleNewLaunch(launch) {

  const newFlightNumber = await getLattestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customers: ['Zero To Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
};


function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  launchWithIdExist,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
}