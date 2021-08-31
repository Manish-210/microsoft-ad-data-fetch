const express = require('express');
const cors = require('cors');

var SequelizeConfig = require('./config/sequelize');
var morgan = require('morgan');

const {
  SERVER_PORT,
  HOST,
} = require('./config/config');

const routes = require('./routes');
require('dotenv').config();

var session = require('cookie-session');

const sequelize = SequelizeConfig;
console.log(process.version);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

//SETUP SERVER
const app = express();
const port = SERVER_PORT;
var Grant = require('grant').express(),
  grant = new Grant(require('./config/grantconfig'));

  app
  .use(session({ secret: 'grant', saveUninitialized: true, resave: false }))
  .use('/connect/SOURCE_CONNECTION_HERE', (req, res, next) => {
    console.log(req.query);
    next();
  })

// mount grant
app.use(grant);

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public')); //Serving static files in Express
app.use(morgan('dev'));


app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});