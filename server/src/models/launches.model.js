const axios = require('axios');
require('dotenv').config();

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = process.env.PORT || 8000;
const { SPACEX_API_URL } = process.env;

async function loadLaunchData(){

  const spaceXLaunchData = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if(spaceXLaunchData) {
    console.log('Space X launch data already in database!');
  } else {
    await populateLauchesDatabase();
  }
  
};

async function populateLauchesDatabase() {
  console.log('...loading SpaceX Launches');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  if(response.status !== 200) {
    console.log('An Error occured downloading launch data!');
    throw new Error('SPACEX API Error Occured!');
  }
  const launchDocs = response.data.docs;
  for(const launchDoc of launchDocs) {

    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((load) => load.customers);

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: new Date(launchDoc['date_local']), // date_local
      customers, // payload.customers for each customer.
      upcoming: launchDoc['upcoming'], // upcoming
      success: launchDoc['success'], // success

    }
    console.log(`${launch.flightNumber}, ${launch.mission}`);
    await saveLaunch(launch);
  }
}

async function findLaunch(filter){
  return await launches.findOne(filter);
}

async function launchWithIdExist(launchId) {
  const doesLaunchExist = findLaunch({
    flightNumber: launchId
  });
  return doesLaunchExist;
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

async function getAllLaunches(skip, limit) {
  return await launches.find({}, {
    '_id': 0,
    '__v': 0,
  })
  .sort({
    flightNumber: 1
  })
  .skip(skip)
  .limit(limit);
};

async function saveLaunch(launch) {

  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function scheduleNewLaunch(launch) {

  try {
    const planet = await planets.findOne({
      keplerName: launch.target
    })
    
    if(!planet) throw new Error('No matching planet found!');
  
    const newFlightNumber = await getLattestFlightNumber() + 1;
  
    const newLaunch = Object.assign(launch, {
      upcoming: true,
      success: true,
      customers: ['Zero To Mastery', 'NASA'],
      flightNumber: newFlightNumber,
    });
    await saveLaunch(newLaunch);
  } catch(err) {
    console.error(`Launch was not saved ${err}`)
  }

};


async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  launchWithIdExist,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
}