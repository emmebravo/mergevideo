## Back-End Video Fuse

### Run API Locally

To run the code:

- Clone the repo
- Run `npm install`
- Install `ffmpeg` via their [download link](https://ffmpeg.org/download.html) or through `homebrew`

```bash
$ brew install ffmpeg
```

- `PORT` is set to `5000`

### Sample POST Request/Response

- From the [db.json](db.json) you can choose two, or more, `{id}`s to pass as an array in a POST request
- You can use cURL or Postman to run API

```
curl -d "data=["25ff984c-e79d-460c-a75f-489e58425656","67a702b9-1787-4c4b-bee2-b391806b803d"]" http://localhost:5000/video/fused
```

- You'll receive a `uuid` as a response, which you'll need to make a GET Request
  - the following `uuid` is invalid, please don't use to retrieve video as it'll give you an error. 

```
d080003e-6041-41d6-8981-3236700c81ef
```

#### Sample GET Request

- Run the following code in your CLI

```
curl http://localhost:5000/video/fused/d080003e-6041-41d6-8981-3236700c81ef --output -
```

- You'll receive back binary data.
