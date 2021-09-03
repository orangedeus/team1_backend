var express = require('express');
var router = express.Router();
var db = require('../db');

var fs = require('fs-extra');

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.manyOrNone(`SELECT DISTINCT ON (batch) batch FROM stops;`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e);
        res.send('error');
    });
});

router.get('/current', function(req, res, next) {
    db.one(`SELECT * FROM variables WHERE var_name = 'current';`).then((data) => {
        response = {}
        response[`${data.var_name}`] = parseInt(data.var_value)
        res.send(response);
    }).catch(() => {
        res.send('error');
    });
});

router.post('/set', function(req, res, next) {
    body = req.body;
    db.any(`UPDATE variables set var_value = '${body.new_batch}' WHERE var_name = 'current';`).then(() => {
        res.send('ok');
    }).catch((e) => {
        console.log(e);
        res.send('error');
    });
});


router.post('/retire', function(req, res, next) {
    body = req.body;
    console.log(body);
    db.manyOrNone(`SELECT * FROM complete_stops WHERE batch = ${body.batch};`).then((data) => {
        console.log(data);
        res.send('ok')
        // for (const i of data) {
        //     if (!i.following) {
        //         fs.removeSync(`${process.cwd()}/${i.url}`);
        //     }
        // }
    }).catch(() => {
        res.send('error');
    });
});

router.post('/delete', function(req, res, next) {
    body = req.body;
    console.log(body);
    db.manyOrNone(`SELECT * FROM stops WHERE batch = ${body.batch};`).then((data) => {
        console.log(data);
        res.send('ok')
        // for (const i of data) {
        //     fs.removeSync(`${process.cwd()}/${i.url}`);
        // }
        // db.any(`DELETE FROM stops WHERE batch = ${body.batch};`).then(() => {
        //     res.send('ok');
        // })
    }).catch(() => {
        res.send('error');
    });
}); 


module.exports = router;