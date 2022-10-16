var express = require('express');
var router = express.Router();
var haversine = require('haversine');
var fs = require('fs-extra');
var db = require('../db');
const { ObjectFlags } = require('typescript');
router.use(express.json());

var backup = (backup) => {
    db.any(`CREATE TABLE ${backup}_stops AS TABLE stops;`).then(() => {
        db.any(`CREATE TABLE ${backup}_annotations AS TABLE annotations;`).then(() => {
            db.any(`CREATE TABLE ${backup}_routes AS TABLE routes;`).then(() => {
                fs.copy(`${process.cwd()}/videos`, `${process.cwd()}/${backup}_videos`, { errorOnExist: true }, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        db.any(`INSERT INTO backups(backup) VALUES ('${backup}');`).catch(e => {
                            console.log(e);
                        });
                    }
                });
            }).catch(e => {
                console.log(e);
            });
        }).catch(e => {
            console.log(e);
        });
    }).catch(e => {
        console.log(e)
    });
}

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
            parameter: parameter,
            location: {
                x: new_x,
                y: new_y
            },
            number: new_people
        }
        new_stops.push(new_stop)
    }
    return (new_stops)
}
const getRandRange = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const shuffleStops = (stops) => {
    for (let i = stops.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        [stops[i], stops[j]] = [stops[j], stops[i]];
    }
}

const reduce = (stops) => {
    let temp = [];
    let cumu = 0;
    shuffleStops(stops);
    for (let i = 0; i < stops.length; i++) {
        if (cumu >= 1800) {
            break;
        }
        temp.push(stops[i]);
        cumu += parseInt(stops[i].duration);
    }
    return temp;
}

router.get('/', function (req, res, next) {
    console.log(req.params)
    db.manyOrNone('SELECT * FROM complete_stops;').then(data => {
        res.json(data);
    })
        .catch(error => {
            res.send(error)
            console.log(error)
        });
});

router.post('/filtered', function (req, res, next) {
    body = req.body;

    const { route, filter, time } = body

    let filteredData = [];
    let followingData = [];
    let response = {};

    let additionalQuery = ""
    if (time) {
        switch (time) {
            case 'morning':
                additionalQuery = "time::time between '00:00:00' and '08:00:00'"
                break
            case 'noon':
                additionalQuery = "time::time between '08:00:00' and '16:00:00'"
                break
            case 'evening':
                additionalQuery = "time::time between '16:00:00' and '23:59:59'"
                break
            default:
                additionalQuery = ""
        }
    }

    if (route == 'All') {
        db.manyOrNone(`SELECT * FROM complete_stops${additionalQuery !== "" ? ` WHERE ${additionalQuery}` : additionalQuery};`).then(data => {
            for (const key of Object.keys(filter)) {
                let tempData = JSON.parse(JSON.stringify(data))
                if (filter[key]) {
                    if (key == 'following') {
                        for (let i of data) {
                            if (i.following == false) {
                                followingData.push(i);
                            }
                        }
                    } else {
                        filteredData = filteredData.concat(clean(tempData, key));
                    }
                }
            }
            response = {
                filtered: filteredData,
                following: followingData
            }
            res.json(response);
        }).catch(e => {
            res.send(e);
        });
    } else {
        db.manyOrNone(`SELECT * FROM complete_stops WHERE route = '${route}'${additionalQuery !== "" ? ` AND ${additionalQuery}` : additionalQuery};`).then(data => {
            for (const key of Object.keys(filter)) {
                let tempData = JSON.parse(JSON.stringify(data))
                if (filter[key]) {
                    if (key == 'following') {
                        for (let i of data) {
                            if (i.following == false) {
                                followingData.push(i);
                            }
                        }
                        console.log(followingData.length)
                    } else {
                        filteredData = filteredData.concat(clean(tempData, key));
                    }
                }
            }
            response = {
                filtered: filteredData,
                following: followingData
            }
            res.json(response);
        }).catch(e => {
            res.send(e);
        });
    }
});

router.get('/reduced', function (req, res, next) {
    db.manyOrNone('SELECT * FROM complete_stops ORDER BY url;').then(data => {
        // shuffleStops(data);
        let newData = reduce(data)
        res.json(newData);
    })
        .catch(error => {
            res.send(error)
            console.log(error)
        });
});

router.post('/reduced', function (req, res, next) {
    body = req.body;
    code = body.code;
    console.log(body);
    db.one(`SELECT * FROM codes WHERE code = '${code}';`).then(data => {
        batch = parseInt(data.batch);
        threshold = parseInt(data.threshold);
        route = data.route;
        // console.log(`SELECT * FROM complete_stops ${batch == 0 ? '' : `and batch = ${batch}`} and route = '${route}' and temp_number < ${threshold} ORDER BY url;`)
        console.log(`SELECT * FROM complete_stops ${batch == 0 ? '' : `and batch = ${batch}`} ${route == 'All' ? '' : `and route = '${route}'`} and temp_number < ${threshold} ORDER BY url;`)
        db.manyOrNone(`SELECT * FROM complete_stops ${batch == 0 ? '' : `and batch = ${batch}`} ${route == 'All' ? '' : `and route = '${route}'`} and temp_number < ${threshold} ORDER BY url;`).then(data => {
            let newData = reduce(data)
            res.json(newData);
        })
    }).catch((e) => {
        res.send([])
    })
});

router.get('/:route', function (req, res, next) {
    console.log(req.params)
    route = req.params.route;
    console.log(route)
    db.manyOrNone(`SELECT * FROM complete_stops WHERE route = '${route}'`).then(data => {
        res.json(data);
    }).catch(e => {
        res.send(e);
    });
});



router.post('/update', function (req, res, next) {
    body = req.body;
    db.any(`UPDATE stops SET annotated = ${body.annotated}, boarding = ${body.boarding}, alighting = ${body.alighting} WHERE location ~= point(${body.location.x}, ${body.location.y});`).then(data => {
        res.send('Success!');
    })
        .catch(error => {
            console.log(error);
        });
});

router.post('/annotate', function (req, res, next) {
    body = req.body;
    if (body.code == 'Cs198ndsg!') { // for testing
        console.log('ignoring!');
        res.send('Success!');
        return;
    }
    db.any(`INSERT INTO annotations VALUES (${body.annotated}, ${body.boarding}, ${body.alighting}, ${body.following}, '${body.url}', '${body.code}') ON CONFLICT (code, url) DO UPDATE SET annotated = ${body.annotated}, boarding = ${body.boarding}, alighting = ${body.alighting}, following = ${body.following} WHERE (annotations.url = '${body.url}' AND annotations.code = '${body.code}');`).then(data => {
        res.send('Success!');
    })
        .catch(error => {
            res.send(error);
            console.log(error);
        });
});

router.post('/insert', function (req, res, next) {
    body = req.body;
    const { location, people, url, duration, route, batch, source_file, time } = body
    if (time) {
        db.any(`INSERT INTO stops(location, people, url, duration, route, batch, source_file, time) values (point(${location.x}, ${location.y}), ${people}, '${url}', ${duration}, '${route}', ${batch}, '${source_file}', TO_TIMESTAMP('${time}', 'YYYY:MM:DD HH24:MI:SS'));`)
            .then(() => {
                res.send("Success!");
            })
            .catch(error => {
                res.send(error)
                console.log(error)
            });
    } else {
        db.any(`INSERT INTO stops(location, people, url, duration, route, batch, source_file, time) values (point(${location.x}, ${location.y}), ${people}, '${url}', ${duration}, '${route}', ${batch}, '${source_file}');`)
            .then(() => {
                res.send("Success!");
            })
            .catch(error => {
                res.send(error)
                console.log(error)
            });
    }
});

router.get('/check/:code&:file', (req, res, next) => {
    code = req.params.code;
    file = req.params.file
    console.log(code, file);
    db.one(`SELECT * FROM annotations WHERE code = '${code}' AND url = '${file}';`).then(() => {
        res.send({ status: true });
    }).catch(e => {
        if (code == 'Cs198ndsg!') {
            res.send({ status: true })
        } else {
            res.send({ status: false });
        }
    })
});

router.get('/file/:filename', (req, res, next) => {
    console.log(req.params, req.query)
    const { filename } = req.params;
    const { route, batch } = req.query;

    console.log(filename, route, batch)

    db.manyOrNone(`SELECT url, duration, time, location FROM stops WHERE source_file = '${filename}' and route = '${route}' and batch = ${batch} ORDER BY time ASC;`).then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e)
    })
})

router.get('/test/testing', (req, res, next) => {
    db.oneOrNone(`SELECT * FROM backups WHERE backup = 'auto3';`).then(data => {
        res.send('yo');
    });
});


async function deleteCascade(stop) {
    console.log(stop)
    try {
        await db.any(`DELETE FROM stops WHERE url = '${stop.url}' and route = '${stop.route}' and batch = ${stop.batch};`);
        await db.any(`DELETE FROM annotations WHERE url = '${stop.url}' and route = '${stop.route}' and batch = ${stop.batch};`);
        fs.removeSync(`${process.cwd()}/${stop.url}`);
    } catch (e) {
        return e
    }
}

router.post('/delete', (req, res, next) => {
    const { source_file, batch, route, tracking } = req.body
    console.log(source_file, route, batch, tracking)
    db.manyOrNone(`SELECT * FROM stops WHERE source_file = '${source_file}' and route = '${route}' and batch = ${batch};`).then(async (data) => {
        let error
        for (let i of data) {
            error = await deleteCascade(i)
        }
        await db.any(`DELETE FROM tracking WHERE id = ${tracking};`)
        console.log(error)
        if (error) {
            res.send(error)
        } else {
            res.send('Success!')
        }
    })
})

module.exports = router;
//SELECT stops.location, stops.people, stops.url, stops.route, CASE WHEN a.annotated is NULL then 0 ELSE a.annotated END, CASE WHEN a.boarding is NULL then 0 ELSE a.boarding END, CASE WHEN a.alighting is NULL then 0 ELSE a.alighting END, a.following FROM stops FULL OUTER JOIN (SELECT url, AVG(annotated) AS annotated, AVG(boarding) as boarding, AVG(alighting) as alighting, BOOL_AND(following) as following FROM annotations GROUP BY url) a ON a.url = stops.url;