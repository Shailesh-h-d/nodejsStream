const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.listen(3001, () => console.log(`server is running in port 3001`));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
})



app.get('/video', async (req, res) => {
    const range = req.headers.range;
    // fs.readdir('./video', async (err, files) => {
    //     if(err) throw(err);
    //     for(let file of files) {
    //         let videoFile = path.join(__dirname, `./video/${file}`);
    //         let renameTo = path.join(__dirname, './video/testVideo.mp4');
    //         fs.rename(videoFile, renameTo, (err) => {
    //             if(err) throw(err);
    //         })
    //     }
    // })
    // if(!range) return res.sendFile(path.join(__dirname, './video/testVideo.mp4'));
    console.log(path.resolve(__dirname, './video/batman.mp4'));

    const videoPath = `./video/testVideo.mp4`;
    const videoSize = fs.statSync(videoPath).size;
    const chunkSize = 1 + 0.1e+6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range" : `bytes ${start} - ${end}/${videoSize}`,
        "Accept-Ranges" : 'bytes',
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4"
    }
    res.writeHead(206, headers);
    const stream = fs.createReadStream('./video/testVideo.mp4', {start, end});
    stream.pipe(res);
})

