const {
  getCredentials,
  saveCredentials,
} = require('../controllers/credentials');
const axios = require('axios');

const sampleDataSourceAuthCallbackHandler = async (code) => {
  // get access token and other credentials with the code

  // return credential response required to refresh and access auth later
}

const getSampleDataSourceCredentials = async (authId) => {
  // get the access token here
  // let dataSourceType = authId.split('-')[0];
  // let credentials = await getCredentials(authId)
  // credentials = JSON.parse(credentials?.credentials)

  // let access_token = credentials.access_token

  // Check if access_token is valid or expired
  // if valid
  //    return access_token

  // else
  //    refresh the token

  //    saveCredentials(authId, JSON.stringify(newCredentials), dataSourceType)   // save new access_token    
  //    return new access token
}

const getFieldMetaData = () => {
  // get meta data from '../routes/dataSources/data/sampleFormData'
  
}

module.exports = {
  getSampleDataSourceCredentials,
  sampleDataSourceAuthCallbackHandler,
  getFieldMetaData
};
