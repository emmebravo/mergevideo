const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let id = '';
let url = '';

// @POST Route
//app.post('/video/fused', async (request, response) => {
const arrayVideoIds = request.body;

for (let i = 0; i < arrayVideoIds.length; i++) {
  id += arrayVideoIds[i];
}

//const response = await {};
//});

//read contents of db.json + retrieve vid src based off id
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

async function downloadVideo() {
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
}
downloadVideo(url);

let videoNames = [];

// read directory for filenames
fs.readdir(__dirname, (err, files) => {
  if (err) console.log(err);
  else {
    console.log('\nCurrent directory filenames:');
    files.map((file) => {
      if (path.extname(file) === '.mp4') {
        videoNames.push(file);
      }
    });
  }
  console.log(videoNames);
});

const proc = new ffmpeg(videoNames[0])
  .mergeAdd(videoNames[1])
  .mergeToFile(`./${Date.now()}out.mp4`, function () {
    console.log('files has been merged succesfully');
  });

// @GET Route
app.get('/video/fused/:id', (request, response) => {
  const newVideoId = request.params.id;
  response.send(`future binary response`);
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
