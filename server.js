const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const https = require('https');
const fs = require('fs');
const { randomUUID } = require('crypto');

// list and stuff for ffmpeg
let listToMerge = '';
let listFilePath = `download/${Date.now()}list.txt`;
let mergedVideoPath = `${randomUUID}.mp4`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create an obj to hold ids nad video?

//read contents of db.json
fs.readFile('./db.json', (error, data) => {
  if (error) throw error;
  //JSON object
  let { videos } = JSON.parse(data);
  //console.log(videos);
  for (let i = 0; i < videos.length; i++) {
    console.log(`${videos[i].id}: ${videos[i].source}`);
  }
});

// @POST Route
app.post('/video/fused', (request, response) => {
  const arrayVideoIds = request.body;

  listToMerge = '';
  arrayVideoIds.forEach((videoId) => {
    // when videoId sent from client matches the one in db, download video
    if (videoId === videos[i].id) {
      videosURL += videos[i].source;
      videosURL = '';
    }
  });
});

//download the videos to fuse
let videosURL = ``;
function download(url, filepath) {
  https.get(videosURL, (response) => {
    const path = `${__dirname}/download`;
    const filePath = fs.createWriteStream(path);
    response.pipe(filePath);
    filePath.on('finish', () => {
      filePath.close();
      console.log(`working... 123`);
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
