const { 
  getAllLaunches, 
  scheduleNewLaunch,
  launchWithIdExist,
  abortLaunchById,
} = require('../../models/launches.model')

const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  console.log(req.query);
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
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
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch).end();
}

async function httpAbortLaunchById(req, res) {
  const launchId = Number(req.params.id);
  
  const launchExist = await launchWithIdExist(launchId);
  if(!launchExist) {
    return res.status(404).json({
      error: 'Launch Not Found!',
    });
  }
  const aborted = await abortLaunchById(launchId);
  if(!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted!',
    }).end(); 
  }
  return res.status(200).json({
    Success: 'Launch was aborted!'
  }).end();
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunchById,
}