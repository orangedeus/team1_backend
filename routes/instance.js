var express = require('express');
var router = express.Router();
var AWS = require('../aws');
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});



router.get('/test', function(req, res, next) {
    res.send('instance route reached');
});

router.get('/check', function(req, res, next) {
  var params = {
      InstanceIds: [
        'i-0fadb39a4b7a5d959'
      ],
      DryRun: false
  };

  ec2.describeInstances(params, function(err, data) {
      if (err) {
          res.send("Error");
      } else {
          res.send(data)
      }
  });
});

router.get('/start', function(req, res, next) {
    var params = {
        InstanceIds: [
          'i-0fadb39a4b7a5d959'
        ],
        DryRun: true
    };
    ec2.startInstances(params, function(err, data) {
        if (err && err.code === 'DryRunOperation') {
          params.DryRun = false;
          ec2.startInstances(params, function(err, data) {
              if (err) {
                res.send(err);
              } else if (data) {
                  var response = data.StartingInstances;
                ec2.waitFor('instanceRunning', { InstanceIds: ['i-0fadb39a4b7a5d959']}, function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(data.Reservations[0].Instances[0]);
                    }
                });
              }
          });
        } else {
          console.log("You don't have permission to start instances.");
          res.send("You don't have permission to start instances.")
        }
    });
});

router.get('/stop', function(req, res, next) {
    var params = {
        InstanceIds: [
          'i-0fadb39a4b7a5d959'
        ],
        DryRun: true
    };
    ec2.stopInstances(params, function(err, data) {
        if (err && err.code === 'DryRunOperation') {
          params.DryRun = false;
          ec2.stopInstances(params, function(err, data) {
              if (err) {
                console.log("Error", err);
                res.send(err);
              } else if (data) {
                console.log("Success", data.StoppingInstances);
                res.send(data.StoppingInstances);
              }
          });
        } else {
          console.log("You don't have permission to stop instances.");
          res.send("You don't have permission to stop instances.")
        }
    });
});



module.exports = router;