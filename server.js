const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const https = require('https');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

// list and stuff for ffmpeg
let listToMerge = '';
let listFilePath = `download/${Date.now()}list.txt`;
let mergedVideoPath = `${randomUUID}.mp4`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create an obj to hold ids and video?

//read contents of db.json
const sourceObject = {}; // possibly use, possibly not; don't know yet
fs.readFile('./db.json', (error, data) => {
  if (error) throw error;
  //JSON object holding the IDs, video src, and img src
  let { videos } = JSON.parse(data);
  for (let i = 0; i < videos.length; i++) {
    console.log(`${videos[i].id}: ${videos[i].source}`);
    //create a hash map of this info? IDK :()
  }
});

// @POST Route
app.post('/video/fused', (request, response) => {
  const arrayVideoIds = request.body;

  arrayVideoIds.forEach((videoId) => {
    // when videoId sent from client matches the one in db, download video
    if (videoId === videos[i].id) {
      videosURL += videos[i].source;
      videosURL = '';
      downloadVideo();
    }
  });
});

//download the videos to fuse
let videosURL = ``;
const fileName = path.basename(videosURL);

function downloadVideo(videosURL, callback) {
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
