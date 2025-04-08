require('dotenv').config();

module.exports = {
  apiBaseUrl: process.env.API_BASE_URL,
  apiCredentials: {
    userName: process.env.API_USERNAME ,
    password: process.env.API_PASSWORD
  },
  userId: process.env.API_USERID
};