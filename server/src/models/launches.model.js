const launches = new Map();
let lattestflightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
   rocket: 'Explorer IS1',
   launchDaate: new Date('December 27, 2030'),
   destination: 'Kepler-422 b',
   customer: ['ZTM', 'NASA'],
   upcoming: true, 
   success: true,

};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  lattestflightNumber++;
  return launches.set(
    launch.flightNumber, 
    Object.assign(launch, {
    flightNumber: lattestflightNumber,
    customer: ['Zero To Mastery', 'NASA'],
     upcoming: true,
     success: true,
  }));
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
}