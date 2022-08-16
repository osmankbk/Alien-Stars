const { 
  getAllLaunches, 
  addNewLaunch,
  launchWithIdExist,
  abortLaunchById,
} = require('../../models/launches.model')

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  let launch = req.body;
  let { mission, rocket, launchDate, target } = launch;

  if( !mission || !rocket || !launchDate || !target ) {
    return res.status(400).json({
      error: 'Missing Required launch property'
    });
  }

  launchDate = new Date(launchDate);
  if(isNaN(launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date!'
    })
  }
  addNewLaunch(launch);
  return res.status(201).json(launch).end();
}

function httpAbortLaunchById(req, res) {
  const launchId = Number(req.params.id);
  
  const launchExist = launchWithIdExist(launchId);
  if(!launchExist) {
    return res.status(404).json({
      error: 'Launch Not Found!',
    });
  }
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted).end();
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunchById,
}