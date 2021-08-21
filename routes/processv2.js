var express = require('express');
var router = express.Router();
const fs = require("fs");
var path = require('path');
const { exec } = require('child_process');
var db = require('../db');
router.use(express.json());

const uploadPath = path.join(process.cwd(), 'process');

router.get('/check/:filename', (req, res, next) => {
    const filename = req.params.filename;
    let bytes = 0;
    let filePath = path.join(uploadPath, filename);
    if (fs.existsSync(filePath)) {
        try {
            const fd = fs.openSync(filePath, "r");
            const fileStat = fs.fstatSync(fd);
            bytes = fileStat.size;
        } catch (error) {
            console.log(error);
        }
    }
    res.send({bytes: bytes});
});

router.post('/', function(req, res) {
    let busboy = req.busboy;
    let body = req.body;
    console.log(body);

    let xFileName = req.headers['x-file-name'];
    let xStartByte = parseInt(req.headers['x-start-byte'], 10);
    let xFileSize = parseInt(req.headers['x-file-size'], 10);

    console.log(xFileName, xStartByte, xFileSize);  

    if (xFileSize <= xStartByte) {
        return res.send("File already uploaded");
    }

    req.pipe(busboy);

    busboy.on("file", (fieldname, file, filename) => {
        let filePath = path.join(uploadPath, filename);
        let fstream;
        if (xStartByte) {
            fstream = fs.createWriteStream(filePath, {
                flags: "a"
            });
        } else {
            fstream = fs.createWriteStream(filePath, {
                flags: "w"
            });
        }
        file.pipe(fstream);

        file.on("error", (e) => {console.log(e)});
        file.on("limit", (e) => {console.log(e)});

        fstream.on("close", () => {
            console.log("finished");
        });
    });

    busboy.on("finish", function(a) {
        return res.send("ok");
    });
    busboy.on("error", function(a) {
        return res.send("error");
    });

});

module.exports = router;