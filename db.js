var env = process.env.NODE_ENV || 'development';
var config = (require('./config'))[env];
var pgp = require('pg-promise')({});

var db = pgp(`postgresql://${config.database.username}:${encodeURIComponent(config.database.password)}@${config.database.host}:${config.database.port}/${config.database.db}`);

module.exports = db;