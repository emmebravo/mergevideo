const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');

//require the db.json file
//destructured object for easier access to videos array
const { videos } = require('./db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// @POST Route
app.post('/video/fused', async (request, response) => {
  //array of video ids sent from client-side
  const arrayVideoIds = request.body.data;

  //retrieveVidSource fct with arrayVideoIds as params
  const videoSources = retrieveVidSource(arrayVideoIds);

  //map through array of videoSources to download videos
  //wait for all promises to resolve with the movie file paths in the file system
  const movieFilePaths = await Promise.all(videoSources.map(downloadVideo));

  //number of videos to merge could be anything
  //chainedInputs will run to create as many inputs needed
  const chainedInputs = movieFilePaths.reduce(
    (result, inputItem) => result.addInput(inputItem),
    ffmpeg()
  );
  //use uuid fct to create new uuid
  const newVidId = uuidv4();
  //merging videos!
  //based off the inputs from chainedInputs, merge videos + send uuid of video client-side
  chainedInputs.mergeToFile(`./${newVidId}.mp4`, function () {
    console.log('files has been merged successfully');
  });
  response.send(newVidId);
});

//fct to retrieve vid src based off vid id
function retrieveVidSource(keycode) {
  let newArray = [];

  //loop through videos array (off db.json) and...
  for (let i = 0; i < videos.length; i++) {
    //if keycode (id from client-side) includes an id inside db.json
    if (keycode.includes(videos[i].id)) {
      //then push the corresponding video source into newArray
      newArray.push(videos[i].source);
    }
  }
  return newArray;
}

//fct to download videos off cloud into local file system
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
  //id of fused video to play
  const mergedVideoId = request.params.id;

  //tells express file is found in the root directory
  const options = { root: path.join(__dirname) };
  const fileName = `${mergedVideoId}.mp4`;
  response.sendFile(fileName, options, (error) => {
    if (error) {
      next(error);
    } else {
      console.log('Sent: ', mergedVideoId);
    }
  });
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});

module.exports = app;
