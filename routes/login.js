var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.post('/', function(req, res, next) {
    body = req.body;
    console.log(req.body);
    db.one(`SELECT * FROM codes WHERE code = '${body.code}';`).then(data => {
        console.log(data);
        if (data.admin == true) {
            res.send({user: 1, admin: 1, code: body.code, surveyed: 1})
        } else {
            let now = new Date();
            console.log(now);
            if (data.accessed) {
                let surveyed;
                if (data.surveyed) {
                    surveyed = 1
                } else {
                    surveyed = 0
                }
                console.log('already accessed')
                if ((now - data.accessed) < 28800000) {
                    res.send({code: body.code, user: 1, admin: 0, surveyed: surveyed});
                } else {
                    res.send({code: body.code, user: 0, admin: 0, surveyed: surveyed});
                }
            } else {
                let surveyed;
                if (data.surveyed) {
                    surveyed = 1
                } else {
                    surveyed = 0
                }
                console.log('not yet accessed', new Date(Date.now()).toISOString().replace('T',' ').replace('Z',''));
                db.any(`UPDATE codes SET accessed = (to_timestamp(${Date.now()} / 1000.0)) WHERE code = '${body.code}'`).then(data => {
                    res.send({code: body.code, user: 1, admin: 0, surveyed: surveyed});
                })
                .catch(error => {
                    console.log(error)
                    res.send({code: body.code, user: 0, admin: 0, surveyed: surveyed});
                });
            }
        }
    })
    .catch(error => {
        console.log(error);
        res.send({user: 0, admin: 0})
    });
});

router.get('/test', function(req, res, next) {
    res.send('login route reached');
});

module.exports = router;