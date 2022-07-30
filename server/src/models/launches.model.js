const launches = new Map();
let lattestflightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
   rocket: 'Explorer IS1',
   launchDaate: new Date('December 27, 2030'),
   target: 'Kepler-422 b',
   customer: ['ZTM', 'NASA'],
   upcoming: true, 
   success: true,

};

launches.set(launch.flightNumber, launch);

function launchWithIdExist(launchId) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  lattestflightNumber++;
  return launches.set(
    lattestflightNumber, 
    Object.assign(launch, {
    upcoming: true,
    success: true,
    customer: ['Zero To Mastery', 'NASA'],
    flightNumber: lattestflightNumber,
    
  }));
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  launchWithIdExist,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
}