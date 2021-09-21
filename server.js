const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');

const { videos } = require('./db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// @POST Route
app.post('/video/fused', async (request, response) => {
  const arrayVideoIds = request.body.data;
  const videoSources = retrieveVidSource(arrayVideoIds);

  //map through array of videoSources to download + resolve with the movie file paths in file system
  const movieFilePaths = await Promise.all(videoSources.map(downloadVideo));

  //number of videos to merge could be anything
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

function retrieveVidSource(keycode) {
  let newArray = [];

  //array off db.json
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

  //returns last portion of path
  const fileName = path.basename(url);

  //path where solved promise will save video
  const localFilePath = path.resolve(__dirname, 'downloads', fileName);

  //wrap event listener with a promise so the promise only resolves once the stream completely finishes writing
  const end = await new Promise((resolve, reject) => {
    const writeStream = response.data.pipe(fs.createWriteStream(localFilePath));
    writeStream.on('finish', () => {
      console.log('Successfully downloaded file!');
      //resolve with the localFilePath of videos so these can then be passed as params to the merging fct
      resolve(localFilePath);
    });
  });
  return end;
}

// @GET Route
app.get('/video/fused/:id', (request, response) => {
  const mergedVideoId = request.params.id;

  //file in root directory
  const options = { root: path.join(__dirname) };
  const fileName = `${mergedVideoId}.mp4`;
  response.sendFile(fileName, options, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Sent: ', mergedVideoId);
    }
  });
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
