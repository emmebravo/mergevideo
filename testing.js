const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const https = require('https');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { randomUUID } = require('crypto');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create an obj to hold ids and video?

//read contents of db.json
//create an obj to hold ids and video?
const sourceObj = {}; // use hashmap to have IDs: URLs

//read contents of db.json
fs.readFile('./db.json', (error, data) => {
  if (error) throw error;
  //JSON object holding the IDs, video src, and img src
  let { videos } = JSON.parse(data);
  for (let i = 0; i < videos.length; i++) {
    const videoId = videos[i].id;
    if (!(videoId in sourceObj)) {
      sourceObj[videoId] = videos[i].source;
    }
  }
});

// @POST Route
//app.post('/video/fused', (request, response) => {
const arrayVideoIds = [
  '25ff984c-e79d-460c-a75f-489e58425656',
  'd584c1b8-6c87-432c-a14c-db14577e5408',
]; //request.body;

arrayVideoIds.forEach((vidIds) => {
  if (vidIds in sourceObj) {
    console.log(vidIds);
    videosURL = sourceObj[vidIds];
    console.log(videosURL);
  }
});
//});

//download the videos to fuse
let videosURL = ``;
const fileName = path.basename(videosURL);

//function downloadVideo(videosURL) {
https.get(videosURL, (response) => {
  const path = `${__dirname}/downloads/${fileName}`;
  const filePath = fs.createWriteStream(path);
  response.pipe(filePath);
  filePath.on('error', (err) => {
    console.log(err);
  });
  filePath.on('finish', () => {
    filePath.close();
    console.log(`donezo`);
  });
});
//}

// concat videos

// const proc = new ffmpeg({ source: 'title.mp4' })
//   .mergeAdd('source.mp4')
//   .mergeToFile('out.mp4', 'myTempFolder/', function () {
//     console.log('files has been merged succesfully');
//   });

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
