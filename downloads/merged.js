const https = require('https');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid');

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
  .mergeToFile('../out.mp4', 'downloads/', function () {
    console.log('files has been merged succesfully');
  });
