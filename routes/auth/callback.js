const router = require('express').Router();
const { saveCredentials } = require('../../controllers/credentials');
const { sampleDataSourceAuthCallbackHandler } = require('../../utils/sample-helper')

router.get('/callback', async (req, res) => {
  let authId;
  try {
    if (req.session && req.session.grant) {
      let commonEmailId;
      authId = req.session.grant.dynamic.authId;
      let dataSourceType = authId.split('-')[0];
      let credentials = {};

      // Make credential requests here and store the response in the object 'credentials'
      if(dataSourceType === 'sample') {
        // The redirect URL contains the code to get the access token
        // if additional authorization data is required, pass them in the parameters and handle them in that function definition
        const response = await sampleDataSourceAuthCallbackHandler(req.query.code)
        credentials = response
      }


      if (
        credentials &&
        (credentials.access_token || credentials.oauth_token)
      ) {
        let email = commonEmailId;
        if (credentials.id_token) {
          let data = credentials.id_token.split('.')[1];
          data = Buffer.from(data, 'base64').toString('utf-8');

          data = JSON.parse(data);

          email = commonEmailId ?? data.email;

          console.log(email);
        }

        let credentialsResponse = saveCredentials(
          authId,
          JSON.stringify(credentials),
          dataSourceType,
          email
        );
        credentialsResponse.then((cret) => {
          console.log(cret);
          res.end('Signed in! , you may close this tab now.');
        });
      } else {
        res.end(
          `Sign in failed ${credentials.errorMessage ? '. ' + credentials.errorMessage : ','
          } Please close this tab and try again.`
        );
      }
    } else {
      res.end('Sign in failed, please try again');
    }
  } catch (error) {
    console.log(error);
    res.end('An error has occured , Please close this tab and try again.');
  }
});

module.exports = router;