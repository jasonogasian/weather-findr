const config = {
  PORT: process.env.PORT || 3001,
  logs: {
    error: 'logs/error.log',
    combined: 'logs/combined.log',
    access: 'logs/access.log',
  }
}

module.exports = config;