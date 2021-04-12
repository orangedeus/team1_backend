var express = require('express');
var router = express.Router();
var db = require('../db');
var fs = require('fs-extra');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.any('TRUNCATE stops, routes;').then(() => {
    db.any('DELETE from codes where admin = false;').then(() => {
        fs.emptyDir('videos');
        res.send("Done");
    }).catch(e => {
        res.send(e);
    });
  }).catch(e => {
    res.send(e);
  });
});

module.exports = router;