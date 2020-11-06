const winston = require('winston');
const expressWinston = require('express-winston');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const apiRouter = require('./routers/apiRouter');


//
// Create the app and apply basic middlewares
//
const app = express();
app.use(compression());
app.use(bodyParser.json());


//
// Logging
//
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: config.logs.error, level: 'error' }),
    new winston.transports.File({ filename: config.logs.combined }),
  ],
});
 
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Request logging
const accessTransport = process.env.NODE_ENV === 'production' ?
  new winston.transports.File({ filename: config.logs.access }) :
  new winston.transports.Console();
app.use(expressWinston.logger({
  transports: [ accessTransport ],
  format: winston.format.json(),
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));


//
// APIs
//
app.use('/api', apiRouter(logger));
 

//
// Serve the React App
//
app.use(express.static(path.join(__dirname, 'app/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/build', 'index.html'));
});


//
// 404 Not Found
//
app.use((req, res, next) => {
  res.status(404).send("<h1>Oops, where'd you get that link??</h1>");
});


//
// Start the server
//
app.listen(config.PORT);
logger.log({
  level: 'info',
  message: `Server listening on port ${config.PORT}`
});
