var express = require('express');
var router = express.Router();
var db = require('../db');
var fs = require('fs-extra');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.any('TRUNCATE stops, routes, annotations, tracking;').then(() => {
    db.any('ALTER SEQUENCE tracking_id_seq RESTART;').then(() => {
      db.any('DELETE FROM codes WHERE admin = false;').then(() => {
        fs.emptyDir('videos');
        res.send("Done");
      }).catch(e => {
          res.send(e);
      });
    });
  }).catch(e => {
    res.send(e);
  });
});

router.get('/annotations', function(req, res, next) {
  db.any('TRUNCATE annotations;').then(() => {
    res.send('Success!');
  }).catch(e => {
    res.send(e);
  })
});

module.exports = router;