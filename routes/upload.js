var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var fs = require('fs-extra');
var path = require('path');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: 'videos/',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

const uploadPath = path.join(process.cwd(), 'videos');

const generateChecksum = (data, algo, enc) => {
    return crypto.createHash(algo || 'md5').update(data, 'utf8').digest(enc || 'hex');
}

router.post('/', upload.single('upload_file'), function(req, res) {
    const md5 = req.headers['x-md5']
    const filePath = req.file.path

    const buffer = fs.readFileSync(path.join(process.cwd(), filePath))

    const checksum = generateChecksum(buffer)

    if (checksum === md5) {
        res.send({status: 1})
    } else {
        res.send({status: 0})
    }
});

// let busboy = req.busboy;
//     let md5 = req.headers['x-md5']
//     let filename = req.headers['x-filename']

//     const filePath = path.join(uploadPath, filename)

//     req.pipe(busboy)

//     busboy.on('file', (filename, file, fileinfo) => {
//         console.log('file received!', filename)

//         let fstream = fs.createWriteStream(filePath,
//             {flags: 'w'}
//         );

//         file.pipe(fstream)

//         file.on("error", (e) => {console.log(e)});
//         file.on("limit", (e) => {console.log(e)});

//         fstream.on("close", () => {
//             console.log("File stream finished!");
//         });
//     })

//     busboy.on('finish', () => {
//         let fileSize = fs.statSync(filePath).size
//         fs.open(filePath, 'r', (errOpen, fd) => {
//             if (errOpen) {
//                 throw errOpen;
//             }
//             fs.read(fd, Buffer.alloc(fileSize), 0, fileSize, 0, (errRead, _bytesRead, buffer) => {
//                 if (errRead) {
//                     throw errRead;
//                 }

//                 let checksum = generateChecksum(buffer)

//                 if (checksum === md5) {
//                     res.send({status: 1})
//                 } else {
//                     res.send({status: 0, md5: checksum})
//                 }
//             })

//         })
//     })

//     busboy.on("error", function(a) {
//         return res.send({status: 0});
//     });

module.exports = router;