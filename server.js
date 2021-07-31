const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const https = require('https');
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// @POST Route
app.post('/video/fused', async (request, response) => {
  const arrayVideoIds = [
    '25ff984c-e79d-460c-a75f-489e58425656',
    '67a702b9-1787-4c4b-bee2-b391806b803d',
  ];
  //request.body;

  for (let i = 0; i < arrayVideoIds.length; i++) {
    id += arrayVideoIds[i];
  }

  //const response = await {};
});

//download the videos to fuse
let id = '';
let url = '';

//read contents of db.json
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

// @GET Route
app.get('/video/fused/:id', (request, response) => {
  const newVideoId = request.params.id;
  response.send(`future binary response`);
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
