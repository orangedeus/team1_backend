var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.post('/', function(req, res, next) {
    body = req.body;
    db.any(`INSERT INTO instrumentation values ('${body.code}', '${body.file}', ${body.time}, ${body.duration});`)
    .then(() => {
        res.send("Success!")
    })
    .catch(error => {
        console.log(error)
        res.send('error')
    });
});

router.get('/', function(req, res, next) {
    db.manyOrNone(`SELECT code, file, avg(time) AS time, avg(duration) AS duration FROM instrumentation WHERE code != 'Cs198ndsg!' GROUP BY code, file;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/code/:code', function(req, res, next) {
    code = req.params.code;
    db.manyOrNone(`SELECT file, avg(time) AS time FROM instrumentation WHERE (code = '${code}' AND code != 'Cs198ndsg!') GROUP BY code, file;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/codes', function(req, res, next) {
    db.manyOrNone(`SELECT code, accessed, surveyed FROM codes WHERE admin = false;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
        res.send('fail');
    });
});

router.get('/codes2', function(req, res, next) {
    db.manyOrNone(`SELECT DISTINCT code FROM instrumentation WHERE code != 'Cs198ndsg!';`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
        res.send('fail');
    })
});

router.get('/splices', function(req, res, next) {
    db.manyOrNone(`SELECT DISTINCT file FROM instrumentation;`).then(data => {
        res.send(data.map((entry) => {return entry.file}));
    }).catch(e => {
        console.log(e);
        res.send('fail');
    })
});

router.get('/annotations', function(req, res, next) {
    db.manyOrNone(`SELECT * FROM annotations WHERE code != 'Cs198ndsg!';`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
})

router.get('/test', function(req, res, next) {
    res.send('instrumentation route reached');
});

module.exports = router;

