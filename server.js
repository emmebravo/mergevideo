const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const db = require('./db.json');

app.use(express.json());

//@GET root
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

//@GET show videos to user
app.get('/video', (request, response) => {
  response.end(JSON.stringify(db));
});

// @POST Route
app.post('/video/fused', (request, response) => {
  //
});

// @GET Route
app.get('/video/fused/:id', (request, response) => {
  response.send(`future binary response`);
});

app.listen(PORT, () => {
  console.log(`your ${PORT} server is running...`);
});
