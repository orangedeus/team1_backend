var express = require('express');
var router = express.Router();
var db = require('../db');
var { nanoid } = require('nanoid');

router.post('/', function(req, res, next) {
    body = req.body;
    code = body.code;
    console.log(body);
    number = parseInt(body.number);
    threshold = parseInt(body.threshold);
    batch = parseInt(body.batch);
    route = body.route;
    db.one(`SELECT * FROM codes WHERE code = '${code}';`).then(data => {
        console.log(data);
        insert_codes = []
        if (data.admin == true) {
            for (i = 0; i < number; i++) {
                insert_codes.push(nanoid(12));
            };
            db.tx(t => {
                const queries = insert_codes.map(code => {
                    return t.none(`INSERT INTO codes(code, route, batch, threshold) VALUES ('${code}', '${route}', ${batch}, ${threshold});`);
                });
                return t.batch(queries);
            }).then(() => {
                res.send(
                    {
                        inserted_codes: insert_codes
                    }
                );
            }).catch(e => {
                console.log(e);
            });
        } else {
            res.send({user: 1, admin: 0})
        }
    }).catch((e) => {
        res.send("error")
    })
});

router.get('/test', function(req, res, next) {
    res.send('generate route reached');
});

module.exports = router;