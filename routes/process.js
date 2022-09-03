var express = require('express');
var router = express.Router();
const fs = require("fs");
var path = require('path');
const { exec } = require('child_process');
var db = require('../db');
const { query } = require('../db');
router.use(express.json());

const uploadPath = path.join(process.cwd(), 'process');


router.post('/', function(req, res) {
    let busboy = req.busboy;
    let body = req.body;
    console.log(body);

    let xFileName = req.headers['x-file-name'];
    let xStartByte = parseInt(req.headers['x-start-byte'], 10);
    let xFileSize = parseInt(req.headers['x-file-size'], 10);

    console.log(xFileName, xStartByte, xFileSize);  

    if (xFileSize <= xStartByte) {
        return res.send("File already uploaded");
    }

    req.pipe(busboy);

    busboy.on("file", (fieldname, file, filename) => {
        let filePath = path.join(uploadPath, filename);
        let fstream;
        if (xStartByte) {
            fstream = fs.createWriteStream(filePath, {
                flags: "a"
            });
        } else {
            fstream = fs.createWriteStream(filePath, {
                flags: "w"
            });
        }
        file.pipe(fstream);

        file.on("error", (e) => {console.log(e)});
        file.on("limit", (e) => {console.log(e)});

        fstream.on("close", () => {
            console.log("finished");
        });
    });

    busboy.on("finish", function(a) {
        return res.send("ok");
    });
    busboy.on("error", function(a) {
        return res.send("ok");
    });

});

router.get('/tracking', function(req, res) {
    let db_query = ''
    if (req.query.route) {
        db_query = `SELECT * FROM tracking WHERE route = '${req.query.route}' ${(req.query.batch == 0 || req.query.batch == null || req.query.batch == undefined) ? '' : `and batch = ${req.query.batch}`};`
    } else {
        db_query = `SELECT * FROM tracking;`
    }
    console.log(db_query)
    db.manyOrNone(db_query).then(data => {
        res.send(data);
    }).catch(e => {
        res.send(e);
    })
})

router.get('/tracking', function(req, res) {
    let { route, batch, filename } = req.query;
    let db_query = ''
    if (req.query.route) {
        db_query = `SELECT * FROM tracking WHERE route = '${req.query.route}' ${(req.query.batch == 0 || req.query.batch == null || req.query.batch == undefined) ? '' : `and batch = ${req.query.batch}`};`
    } else {
        db_query = `SELECT * FROM tracking;`
    }
    console.log(db_query)
    db.manyOrNone(db_query).then(data => {
        res.send(data);
    }).catch(e => {
        res.send(e);
    })
})

router.get('/tracking_status', (req, res, next) => {
    let { route, batch, filename } = req.query;
    let db_query = `SELECT * FROM tracking WHERE filename = '${filename}' and route = '${route}' and batch = ${batch};`
    db.many(db_query).then((data) => {
        let firstResult = data[0]
        res.send({status: firstResult.status, tracking: firstResult.id})
    }).catch((e) => {
        res.send({status: 0})
    })
});


router.post('/tracking', function(req, res) {
    body = req.body;
    if (body.stage == 'initial') {
        db.one(`INSERT INTO tracking(filename, status, route, batch) VALUES ('${body.fileName}', '${body.status}', '${body.route}', ${body.batch}) RETURNING id;`).then((data) => {
            res.send({
                tracking: data.id
            });
        }).catch(e => {
            res.send(e);
        })
    } else if (body.stage == 'update') {
        db.any(`UPDATE tracking SET status = '${body.status}' WHERE id = ${body.tracking};`).then(() => {
            res.send('Success!');
        }).catch(e => {
            res.send(e);
        })
    }
})


router.get('/tracking/stats', function(req, res, next) {
    db.manyOrNone(`SELECT DISTINCT ON (filename) * FROM tracking WHERE status = 'Done!';`).then(data => {
        res.send(data);
    }).catch(e => {
        res.send(e);
    });
});

router.post('/tracking/stats', function(req, res, next) {
    body = req.body;
    db.any(`UPDATE tracking AS t SET splices = t2.splices, duration = t2.duration, resulting = t2.resulting FROM (values(${body.splices}, ${body.duration}, ${body.resulting})) AS t2(splices, duration, resulting) WHERE filename = '${body.filename}';`).then((data) => {
        console.log(data);
        res.send('Success');
    }).catch(e => {
        console.log(e);
        res.send(e);
    })
});

router.post('/tracking/resume', function(req, res, next) {
    body = req.body;
    db.manyOrNone(`SELECT id FROM tracking WHERE filename = '${body.filename}' and route = '${body.route}' and batch = ${body.batch};`).then(data => {
        if (data.length) {
            res.send({tracking: data[0].id});
        } else {
            res.send({tracking: 0})
        }
    }).catch(e => {
        console.log(e);
        res.send(e);
    })
});

router.get('/tracking_process', function(req, res, next) {
    db.oneOrNone(`SELECT status FROM tracking WHERE id = ${req.query.tracking};`).then((data) => {
        res.send({
            status: data.status
        })
    }).catch(e => {
        res.send(e)
    })
})

/* "conda run python \"C:\\Users\\jpcha\\Tree\\Files\\Acad\\CS198-199\\ExtendedTinyFaces\\process.py\"" */
module.exports = router;