var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var db = require('../db');
var haversine = require('haversine');
router.use(express.json());

const dataPath = `${process.cwd()}/data`

const clean = (stops, parameter) => {

    let new_stops = []
    for (var i = 0; i < stops.length; i++) {
        let curr_num_x = (stops[i][parameter] * stops[i].location.x)
        let curr_num_y = (stops[i][parameter] * stops[i].location.y)
        let curr_den = Number(stops[i][parameter])
        let gathered_n = 1
        for (var j = 0; j < stops.length; j++) {
            if (i == j) {
                continue;
            }
            let coord1 = {
                latitude: stops[i].location.x,
                longitude: stops[i].location.y
            }
            let coord2 = {
                latitude: stops[j].location.x,
                longitude: stops[j].location.y
            }
            let dist = haversine(coord1, coord2)
            if (dist < 0.1) {
                curr_num_x += (stops[j][parameter] * stops[j].location.x)
                curr_num_y += (stops[j][parameter] * stops[j].location.y)
                curr_den += Number(stops[j][parameter])
                gathered_n += 1
                stops.splice(j, 1)
                j = j - 1
            }
        }
        if (curr_den == 0) {
            continue
        }
        let new_x = curr_num_x / curr_den
        let new_y = curr_num_y / curr_den
        let new_people = curr_den / gathered_n
        let new_stop = 
        {
            lat: new_x,
            long: new_y
        }
        new_stop[parameter] = new_people
        new_stops.push(new_stop)
    }
    return (new_stops)
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('data route reached');
});

router.get('/histogram', function(req, res, next) {


    const {route, batch} = req.query;
    console.log(`SELECT CASE WHEN temp_number IS null THEN 0 else temp_number END AS annotation_count, count(CASE WHEN temp_number IS null THEN 0 else temp_number END) AS number FROM complete_stops ${batch != 0 || route != 'All' ? 'WHERE' : ''} ${batch == 0 ? '' : `batch = ${batch}`} ${batch != 0 && route != 'All' ? 'AND' : ''} ${route == 'All' ? '' : `route = '${route}'`} GROUP BY temp_number ORDER BY annotation_count;`);
    db.manyOrNone(`SELECT CASE WHEN temp_number IS null THEN 0 else temp_number END AS annotation_count, count(CASE WHEN temp_number IS null THEN 0 else temp_number END) AS number FROM complete_stops ${batch != 0 || route != 'All' ? 'WHERE' : ''} ${batch == 0 ? '' : `batch = ${batch}`} ${batch != 0 && route != 'All' ? 'AND' : ''} ${route == 'All' ? '' : `route = '${route}'`} GROUP BY temp_number ORDER BY annotation_count;`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e);
        res.send('error');
    });
});

router.get('/survey', function(req, res, next) {
    db.manyOrNone(`SELECT survey.code, survey.name, survey.age, survey.education, codes.route, codes.batch, codes.threshold FROM survey LEFT OUTER JOIN codes ON survey.code = codes.code WHERE survey.code IN (SELECT * FROM valid);`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e)
    })
});

router.get('/survey/:route', function(req, res, next) {
    route = req.params.route;
    db.manyOrNone(`SELECT survey.code, survey.name, survey.age, survey.education, codes.route, codes.batch, codes.threshold FROM survey LEFT OUTER JOIN codes ON survey.code = codes.code WHERE survey.code IN (SELECT * FROM valid) and route = '${route}';`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e)
    })
});

router.get('/survey/:route/:batch', function(req, res, next) {
    route = req.params.route;
    batch = req.params.batch;
    db.manyOrNone(`SELECT survey.code, survey.name, survey.age, survey.education, codes.route, codes.batch, codes.threshold FROM survey LEFT OUTER JOIN codes ON survey.code = codes.code WHERE survey.code IN (SELECT * FROM valid) and route = '${route}' and batch = ${batch};`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e)
    })
});

router.get('/stops', function(req, res, next) {
    db.manyOrNone(`SELECT location[0] as lat, location[1] as long, people, annotated, boarding, alighting, url, route, batch, duration FROM complete_stops WHERE url NOT IN (SELECT duplicate FROM duplicates);`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e)
    })
});

router.get('/stops/:route', function(req, res, next) {
    route = req.params.route;
    db.manyOrNone(`SELECT location[0] as lat, location[1] as long, people, annotated, boarding, alighting, url, route, batch, duration FROM complete_stops WHERE url NOT IN (SELECT duplicate FROM duplicates) and route = '${route}';`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e)
    })
});

router.get('/stops/:route/:batch', function(req, res, next) {
    route = req.params.route;
    batch = req.params.batch;
    db.manyOrNone(`SELECT location[0] as lat, location[1] as long, people, annotated, boarding, alighting, url, route, batch, duration FROM complete_stops WHERE url NOT IN (SELECT duplicate FROM duplicates) and route = '${route}' and batch = ${batch};`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e)
    })
});

router.get('/videos', function(req, res, next) {
    db.manyOrNone(`SELECT DISTINCT ON (filename) * FROM tracking WHERE status = 'Done!';`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e);
    })
});

router.get('/videos/:route', function(req, res, next) {
    route = req.params.route;
    db.manyOrNone(`SELECT DISTINCT ON (filename) * FROM tracking WHERE status = 'Done!' and route = '${route}';`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e);
    })
});

router.get('/videos/:route/:batch', function(req, res, next) {
    route = req.params.route;
    batch = req.params.batch;
    db.manyOrNone(`SELECT DISTINCT ON (filename) * FROM tracking WHERE status = 'Done!' and route = '${route}' and batch = ${batch};`).then((data) => {
        res.send(data);
    }).catch((e) => {
        console.log(e);
    })
});

router.get('/annotations', function(req, res, next) {
    db.manyOrNone(`select * from annotations right outer join ( SELECT code, file, avg(time) AS time, avg(duration) AS duration FROM instrumentation WHERE code IN (SELECT * FROM valid) GROUP BY code, file ) as instrumentation on annotations.code = instrumentation.code AND annotations.url = instrumentation.file;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/stop_codes', function(req, res, next) {
    db.manyOrNone(`select * from annotations left outer join stops on annotations.url = stops.url where url not in (select duplicate from duplicates);`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/deviation', function(req, res, next) {
    db.manyOrNone(`select url, count(code), stddev(annotated) as annotated, stddev(boarding) as boarding, stddev(alighting) as alighting, stddev(case when following = true then 1 else 0 end) as following from annotations where url not in (select duplicate from duplicates) and code in (select * from valid) group by url having count(code) > 1;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/distribution', function(req, res, next) {
    db.manyOrNone(`select url, count(code) from annotations where code in (select * from valid) group by url;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/difference', function(req, res, next) {
    db.manyOrNone(`select people, annotated, url from complete_stops where url not in (select duplicate from duplicates) group by url;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/falsepositives', function (req, res, next) {
    db.manyOrNone(`select location[0] as lat, location[1] as long, url, case when boarding = 0 and alighting = 0 then true else false end as false_positive from complete_stops where url not in (select duplicate from duplicates);`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/total', function(req, res, next) {
    db.manyOrNone(`select sum(stops.duration), count(location), annotations.code, stops.route, stops.batch from stops left outer join annotations on stops.url = annotations.url where code in (select * from valid) group by code, stops.route, stops.batch;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/total/:route', function(req, res, next) {
    route = req.params.route;
    db.manyOrNone(`select sum(stops.duration), count(location), annotations.code, stops.route, stops.batch from stops left outer join annotations on stops.url = annotations.url where code in (select * from valid) and stops.route = '${route}' group by code, stops.route, stops.batch;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/total/:route/:batch', function(req, res, next) {
    route = req.params.route;
    batch = req.params.batch;
    db.manyOrNone(`select sum(stops.duration), count(location), annotations.code, stops.route, stops.batch from stops left outer join annotations on stops.url = annotations.url where code in (select * from valid) and stops.route = '${route}' and stops.batch = ${batch} group by code, stops.route, stops.batch;`).then(data => {
        res.send(data);
    }).catch(e => {
        console.log(e);
    });
});


router.get('/:parameter', function(req, res, next) {
    let parameter = req.params.parameter;
    db.manyOrNone(`SELECT * FROM complete_stops;`).then(data => {
        let compiledData = clean(data, parameter);
        res.send(compiledData);
    }).catch(e => {
        console.log(e);
    });
});


module.exports = router;