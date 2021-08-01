const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { videos } = require('./db.json');

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// @POST Route
app.post('/video/fused', async (request, response) => {
  const arrayVideoIds = request.body.data;

  const videoSources = retrieveVidSource(arrayVideoIds);
  const movieFilePaths = await Promise.all(videoSources.map(downloadVideo));

  const chainedInputs = movieFilePaths.reduce(
    (result, inputItem) => result.addInput(inputItem),
    ffmpeg()
  );
  const newVidId = uuidv4();
  chainedInputs.mergeToFile(`./${newVidId}.mp4`, function () {
    console.log('files has been merged successfully');
  });
  response.send(newVidId);
});

//read contents of db.json + retrieve vid src based off id
function retrieveVidSource(keycode) {
  let newArray = [];

  for (let i = 0; i < videos.length; i++) {
    if (keycode.includes(videos[i].id)) {
      newArray.push(videos[i].source);
    }
  }
  return newArray;
}

async function downloadVideo(url) {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
  });

  const fileName = path.basename(url);
  const localFilePath = path.resolve(__dirname, 'downloads', fileName);
  const end = await new Promise((resolve, reject) => {
    const writeStream = response.data.pipe(fs.createWriteStream(localFilePath));
    writeStream.on('finish', () => {
      console.log('Successfully downloaded file!');
      resolve(localFilePath); // you can return the path here
    });
  });
  return end;
}

// @GET Route
app.get('/video/fused/:id', (request, response) => {
  const mergedVideoId = request.params.id;
  console.log(mergedVideoId);
  response.render('index.ejs', { video: mergedVideoId });
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
