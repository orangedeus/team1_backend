var express = require('express');
var router = express.Router();

var db = require('../db');
router.use(express.json());

/* GET users listing. */

router.get('/', function(req, res, next) {
    db.oneOrNone(`SELECT * FROM dashboard;`).then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e)
    });
  });

router.get('/stops', function(req, res, next) {
  db.any(`SELECT count(stops) FROM stops;`).then((data) => {
      res.send(data)
  }).catch((e) => {
      res.send(e)
  });
});

router.get('/codes', function(req, res, next) {
    db.any(`SELECT count(codes) FROM codes;`).then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e)
    });
});

router.get('/annotations', function(req, res, next) {
    db.any(`SELECT count(annotations) FROM annotations;`).then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e)
    });
});

router.get('/videos', function(req, res, next) {
    db.any(`SELECT count(distinct filename) FROM tracking WHERE status = 'Done!';`).then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e)
    });
});
module.exports = router;