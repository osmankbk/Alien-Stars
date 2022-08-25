const dotevn = require('dotenv');
dotevn.config();

const { 
  DEFAULT_LIMIT,
  DEFAULT_PAGE 
} = process.env;
 
function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE;
  const limit = Math.abs(query.limit) || DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  return {
    limit,
    skip
  }
}

module.exports = {
  getPagination,
};