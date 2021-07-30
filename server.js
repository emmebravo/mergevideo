const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const https = require('https');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { randomUUID } = require('crypto');

// list and stuff for ffmpeg
let listToMerge = '';
let listFilePath = `download/${Date.now()}list.txt`;
let mergedVideoPath = `${randomUUID}.mp4`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      sourceObj[videoId] = videos[i].src;
    }
  }
  console.log(`the object is: \n ${sourceObj}`);
});

// @POST Route
app.post('/video/fused', (request, response) => {
  const arrayVideoIds = request.body;
});

//download the videos to fuse
let videosURL = ``;
const fileName = path.basename(videosURL);

function downloadVideo(videosURL) {
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
}

// @GET Route
app.get('/video/fused/:id', (request, response) => {
  const newVideoId = request.params.id;
  response.send(`future binary response`);
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
