var express = require('express');
var router = express.Router();
var db = require('../db');
var fs = require('fs-extra');
var { exec } = require('child_process');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.manyOrNone(`SELECT * FROM backups;`).then((data) => {
    res.send(data);
  }).catch(e => {
    res.send(e);
  });
});

router.post('/backup', function(req, res, next) {
    body = req.body;
    backup = body.backup;
    db.any(`CREATE TABLE ${backup}_stops AS TABLE stops;`).then(() => {
        db.any(`CREATE TABLE ${backup}_annotations AS TABLE annotations;`).then(() => {
            db.any(`CREATE TABLE ${backup}_routes AS TABLE routes;`).then(() => {
                console.log("copying...")
                fs.copy(`${process.cwd()}/videos`, `${process.cwd()}/${backup}_videos`, {errorOnExist: true}, (err) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        db.any(`INSERT INTO backups(backup) VALUES ('${backup}');`).then(() => {
                            res.send(
                                {
                                    status: 'Success',
                                    backup: backup
                                }
                            );
                        }).catch(e => {
                            console.log(e);
                            res.send(e);
                        });
                    }
                    
                });
            }).catch(e => {
                console.log(e);
                res.send(e);
            });
        }).catch(e => {
            console.log(e);
            res.send(e);
        });
    }).catch(e => {
        console.log(e);
        res.send(e);
    });
});

router.post('/restore', function(req, res, next) {
    body = req.body;
    backup = body.backup;
    db.any(`TRUNCATE stops;`).then(() => {
        db.any(`INSERT INTO stops SELECT * FROM ${backup}_stops;`).then(() => {
            db.any(`TRUNCATE annotations;`).then(() => {
                db.any(`INSERT INTO annotations SELECT * FROM ${backup}_annotations;`).then(() => {
                    db.any(`TRUNCATE routes;`).then(() => {
                        db.any(`INSERT INTO routes SELECT * FROM ${backup}_routes;`).then(() => {
                            fs.copy(`${process.cwd()}/${backup}_videos`, `${process.cwd()}/videos`, {overwrite: true}, (err) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send(
                                        {
                                            status: 'Success',
                                            backup: backup
                                        }
                                    );
                                }
                            });
                        }).catch(e => {
                            res.send(e);
                        });
                    }).catch(e => {
                        res.send(e);
                    });
                }).catch(e => {
                    res.send(e);
                });
            }).catch(e => {
                res.send(e);
            });
        }).catch(e => {
            res.send(e);
        });
    }).catch(e => {
        res.send(e);
    });
});

router.post('/delete', function(req, res, next) {
    body = req.body;
    backup = body.backup;
    db.any(`DROP TABLE IF EXISTS ${backup}_stops;`).then((data) => {
        db.any(`DROP TABLE IF EXISTS ${backup}_annotations;`).then((data) => {
            db.any(`DROP TABLE IF EXISTS ${backup}_routes;`).then((data) => {
                fs.remove(`${process.cwd()}/${backup}_videos`, (err) => {
                    if (err) {
                        res.send(err);
                    } else {
                        db.any(`DELETE FROM backups WHERE backup = '${backup}'`).then(() => {
                            res.send(
                                {
                                    status: 'Success',
                                    backup: backup
                                }
                            );
                        });
                    }
                });
            }).catch(e => {
              res.send(e);
            });
        }).catch(e => {
          res.send(e);
        });
    }).catch(e => {
      res.send(e);
    });
  });

router.post('/download', function(req, res, next) {
    body = req.body;
    backup = body.backup;
    zip_command = `zip -r -j ${__dirname}/${backup}_videos.zip ${process.cwd()}/${backup}_videos`
    console.log(zip_command);
    let zipping = exec(zip_command, (error, stdout, stderr) => {
        if (error) {
            res.send(error);
        } else {
            console.log(stdout)
            res.download(`${__dirname}/${backup}_videos.zip`, `${backup}_download.zip`, (err) => {
                fs.unlink(`${__dirname}/${backup}_videos.zip`);
            });
        }
    });
});

router.get('/', function(req, res, next) {
    res.send('backup route reached!');
});

module.exports = router;