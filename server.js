const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');
const db = require('./db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

  let videosSource = ``;
  arrayVideoIds.forEach((videoId) => {
    if (videoId === videos[i].id) {
      //the source of that id gets downloaded + added to text file
    }
  });
});

// @GET Route
app.get('/video/fused/:id', (request, response) => {
  const newVideoId = request.params.id;
  response.send(`future binary response`);
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
