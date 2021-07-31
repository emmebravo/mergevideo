const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');

const https = require('https');
const fs = require('fs');
const path = require('path');

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
    const videoSource = videos[i].source;
    console.log(videos[i].source);
    if (!(videoId in sourceObj)) {
      sourceObj[videoId] += videoSource;
    }
  }
  console.log(JSON.stringify(sourceObj));
});

let id = '';
let url =
  'https://video-fuse-footage.s3.us-east-1.amazonaws.com/camera-positioned-on-rocket-during-take-off.mp4';

// // @POST Route
// //app.post('/video/fused', (request, response) => {
const arrayVideoIds = [
  //'25ff984c-e79d-460c-a75f-489e58425656',
  '67a702b9-1787-4c4b-bee2-b391806b803d',
]; //request.body;

for (let i = 0; i < arrayVideoIds.length; i++) {
  id += arrayVideoIds[i];
}

function retrieveVidSource() {
  fs.readFile('./db.json', (error, data) => {
    if (error) throw error;
    //JSON object holding the IDs, video src, and img src
    let { videos } = JSON.parse(data);
    for (let i = 0; i < videos.length; i++) {
      if (id === videos[i].id) {
        url += videos[i].source;
        console.log(url);
      }
    }
  });
}
retrieveVidSource(id);

//download the videos to fuse
async function downloadVideo() {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });
    const fileName = path.basename(url);
    const localFilePath = path.resolve(__dirname, 'downloads', fileName);
    const writeStream = response.data.pipe(fs.createWriteStream(localFilePath));
    writeStream.on('finish', () => {
      console.log('Successfully downloaded file!');
    });
  } catch (error) {
    console.log(error);
  }
}
downloadVideo(url);

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
