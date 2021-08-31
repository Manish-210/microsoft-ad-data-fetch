// config.js

const dotenv = require('dotenv')
const result = dotenv.config({ path: __dirname + "/.env" });
if (result.error) {
    throw result.error;
}
const { parsed: envs } = result;
console.log("env variables set");
module.exports = envs;