require('dotenv').config({ path: '.env.local' })

var config = {
    development: {
        database: {
            host: "localhost",
            port: "5432",
            db: process.env.WAYPOINT_DATABASE_DB || "",
            username: process.env.WAYPOINT_DATABASE_USER || "",
            password: process.env.WAYPOINT_DATABASE_PASSWORD || "",
        },
        processing: {
            url: process.env.WAYPOINT_PROCESSING_INSTANCE_URL || "",
            instanceId: process.env.WAYPOINT_PROCESSING_INSTANCE_ID || ""
        }
    },
    production: {
        database: {
            host: "localhost",
            port: "5432",
            db: process.env.WAYPOINT_DATABASE_DB || "",
            username: process.env.WAYPOINT_DATABASE_USER || "",
            password: process.env.WAYPOINT_DATABASE_PASSWORD || "",
        },
        processing: {
            url: process.env.WAYPOINT_PROCESSING_INSTANCE_URL || "",
            instanceId: process.env.WAYPOINT_PROCESSING_INSTANCE_ID || ""
        }
    }
}

module.exports = config