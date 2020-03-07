const express = require('express');
const router = express.Router();
const logger = require('../middleware/logger');
const path = require('path');
const fs = require('fs');

function sendStream(req,res,filepath){
    const stat = fs.statSync(filepath)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(filepath, {start, end})
        const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(filepath).pipe(res)
    }
}
function fileExtension(file){
    var mkv = ['peaky','logan','breaking','got','sherlock','house'];
    // var avi = ['house'];
    var mp4 = ['hollywood','endgame','knight','interstellar'];
    if (mkv.includes(file)){
        return '.mkv';
    }
    else{
        return '.mp4';
    }
}
function parseVideoPath(compID){
    var temp = compID.split("_");
    var markup = temp[1] + "_" + temp[2] + "_" + temp[3] + fileExtension(temp[1]);
    return [temp[0], temp[1], temp[2], temp[3], markup];
}

router.use(logger);

router.get('/:id', function(req,res){

    var [titleID, title, season, episode, markup] = parseVideoPath(req.params.id);
    const filepath = path.join(__dirname,'..','public','VIDEOS',title,season,markup);
    sendStream(req,res,filepath);
    

});

module.exports = router;