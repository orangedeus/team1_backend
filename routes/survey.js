var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res, next) {
    res.send('survey route reached! yo');
  });
  
router.post('/submit', function(req, res, next) {
    body = req.body;
    console.log(body.code);
    db.any(`INSERT INTO survey VALUES ('${body.code}', '${body.name}', ${body.age}, '${body.sex}', '${body.educ}')`).then(() => {
      db.any(`UPDATE codes SET surveyed = true WHERE code = '${body.code}'`).then(() => {
        res.send('Success!');
      }).catch(e => {
        res.send(e);
      });
    }).catch(e => {
      res.send(e);
    });
});

  module.exports = router;