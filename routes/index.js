const express = require('express');

let router = express.Router();

// import dataSource sub-routers
const sampleRouter = require('./dataSources/sample')

// import auth sub-routers
const authCallbackRouter = require('./auth/callback');
const authCredentialsRouter = require('./auth/credentials');

router.use('/authorize', async (req, res) => {
  const checkurl = res.redirect(
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=892d14ee-4671-4bd3-976a-45798e81241a&client_secret=.T82z445_orLnKHjLmQbMmv_I1N0bw.k2~&scope=https%3A%2F%2Fads.microsoft.com%2Fmsads.manage%20offline_access&response_type=code&redirect_uri=https%3A%2F%2Flogin.microsoftonline.com%2Fcommon%2Foauth2%2Fnativeclient&state=ClientStateGoesHere');
});

router.use('/auth', authCallbackRouter);
router.use('/auth', authCredentialsRouter);

router.use('/sample', sampleRouter)


module.exports = router;
