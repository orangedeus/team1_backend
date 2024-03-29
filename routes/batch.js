var express = require('express');
var router = express.Router();
var db = require('../db');

var fs = require('fs-extra');

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.manyOrNone(`SELECT DISTINCT ON (batch) batch FROM stops;`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e);
        res.send('error');
    });
});

router.get('/current', function (req, res, next) {
    db.one(`SELECT * FROM variables WHERE var_name = 'current';`).then((data) => {
        response = {}
        response[`${data.var_name}`] = parseInt(data.var_value)
        res.send(response);
    }).catch(() => {
        res.send('error');
    });
});

router.post('/set', function (req, res, next) {
    body = req.body;
    db.any(`UPDATE variables set var_value = '${body.new_batch}' WHERE var_name = 'current';`).then(() => {
        res.send('ok');
    }).catch((e) => {
        console.log(e);
        res.send('error');
    });
});


router.post('/retire', function (req, res, next) {
    body = req.body;
    route = body.route;
    batch = body.batch;
    db.manyOrNone(`SELECT * FROM complete_stops WHERE batch = ${batch};`).then((data) => {
        db.any(`UPDATE batches SET retired = 1 WHERE route = '${route}' and batch = ${batch};`).then(() => {
            res.send('ok');
        }).catch(() => {
            res.send('error');
        });
        // for (const i of data) {
        //     if (!i.following) {
        //         fs.removeSync(`${process.cwd()}/${i.url}`);
        //     }
        // }
    }).catch(() => {
        res.send('error');
    });
});

router.post('/delete', function (req, res, next) {
    body = req.body;
    const { route, batch } = body;
    console.log(`[DELETING] DELETING route: ${route}, batch: ${batch}`);
    if (route && batch) {
        db.manyOrNone(`SELECT * FROM stops WHERE route = '${route}' and batch = ${batch};`).then((data) => {
            for (const i of data) {
                fs.removeSync(`${process.cwd()}/videos/${i.url}`);
                db.any(`DELETE FROM annotations WHERE url = '${i.url}';`);
            }
            db.any(`DELETE FROM stops WHERE route = '${route}' and batch = ${batch};`).then(() => {
                db.any(`DELETE FROM tracking WHERE route = '${route}' and batch = ${batch};`).then(() => {
                    db.any(`DELETE from batches WHERE route = '${route}' and batch = ${batch};`).then(() => {
                        res.send('ok');
                    });
                });
            });
        }).catch(() => {
            res.send('error');
        });

    }
});

router.post('/route', function (req, res, next) {
    body = req.body;
    route = body.route;
    db.manyOrNone(`SELECT batch FROM batches WHERE route = '${route}' AND retired = 0;`).then((data) => {
        res.send(data);
    }).catch(e => {
        res.send('error');
    });
});

router.post('/route2', function (req, res, next) {
    body = req.body;
    route = body.route;
    db.manyOrNone(`SELECT batch FROM batches WHERE route = '${route}' AND retired = 0 ORDER BY batch DESC;`).then((data) => {
        res.send(data);
    }).catch(e => {
        res.send('error');
    });
});

router.post('/max', function (req, res, next) {
    body = req.body;
    route = body.route;
    db.oneOrNone(`SELECT MAX(batch) FROM batches WHERE route = '${route}' GROUP BY route;`).then((data) => {
        console.log(route, data);
        if (data == null) {
            res.send({ max: 0 });
        } else {
            res.send(data);
        }
    }).catch(e => {
        console.log(e);
        res.send('error');
    });
});

router.post('/insert', function (req, res, next) {
    body = req.body;
    route = body.route;
    batch = body.batch;
    db.any(`INSERT INTO batches VALUES (${batch}, '${route}');`).then(() => {
        res.send('ok');
    }).catch(e => {
        res.send('error');
    });
});

module.exports = router;