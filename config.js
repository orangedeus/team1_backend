require('dotenv').config()

var config = {
    development: {
        database: {
            host: "localhost",
            port: "5432",
            db: "cs199ndsg",
            username: process.env.WAYPOINT_DATABASE_USER || "cs199ndsg",
            password: process.env.WAYPOINT_DATABASE_PASSWORD || "ndsg",
        }
    },
    production: {
        database: {
            host: "localhost",
            port: "5432",
            db: "cs199ndsg",
            username: process.env.WAYPOINT_DATABASE_USER || "cs199ndsg",
            password: process.env.WAYPOINT_DATABASE_PASSWORD || "ndsg",
        }
    }
}

module.exports = config