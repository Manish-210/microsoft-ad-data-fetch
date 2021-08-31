
// Import client id, client secret
const {
  HOST,
  SAMPLE_CLIENT_ID,
  SAMPLE_CLIENT_SECRET
} = require('./config');

module.exports = {
  defaults: { state: true, transport: 'session' },
  server: {
    protocol: 'https',
    host: HOST,
  },

  // config client id, client secret, scope, redirect uri here.
  sample: {
    client_id: SAMPLE_CLIENT_ID,
    client_secret: SAMPLE_CLIENT_SECRET,
    redirect_uri: `${HOST}/auth/callback`,
  },
};
