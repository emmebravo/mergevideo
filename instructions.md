## Back-End Coding Challenge (Video Fuse)

### Description

A friend of yours has an idea for a new video editing app, and they need your help building out the back-end! The eventual goal is to allow users to search for videos based on objects that appear in the video, trim those videos into clips, and then fuse those clips into a new video. Getting early and fast feedback is crucial, so the first version of the app will be _greatly_ simplified. Your goal is to implement the first version of the Video Fuse API that will fuse videos together and send the result back to the client.

The steps below help explain the interactions between the client and API:

1. Client displays source videos to the user.
2. User selects source videos to fuse, and then the client sends those video IDs to the API to create a newly fused video.
3. API creates the fused video and sends the ID for that newly fused video back to the client.
4. Client loads the newly fused video via ID.

### Tasks

- [ ] Create an API using Node.js and a framework of your choosing, implementing the following routes:
  - [ ] `POST /video/fused`
    - Create fused video based on the body param, which is an array of `{id}`s to fuse, and store the video on the local file system. You can find the corresponding video for an `{id}` in [db.json](./db.json).
    - Return `id` of newly fused video. It should be a randomly generated UUID.
  - [ ] `GET /video/fused/{id}`
    - Return binary data of fused video with id `{id}` (this id is generated in `POST /video`).
    - Opening `http://localhost:<port>/video/{id}` in a web browser should load the video.
- [ ] Add at least one automated test.
- [ ] Add instructions on how to run the API locally.
- [ ] Provide an explanation for what you would do to make the site production ready.

#### Sample Requests/Responses

> `POST /video/fused`
> Sample Request

```
curl -d "data=["25ff984c-e79d-460c-a75f-489e58425656","67a702b9-1787-4c4b-bee2-b391806b803d"]" http://localhost:5000/video/fused
```

Sample Response

```
"c4007ff6-514d-46c7-86ae-313748888422"
```

> `GET /video/fused/{id}`
> Sample Request

```
curl http://localhost:5000/video/fused/d080003e-6041-41d6-8981-3236700c81ef --output -
```

Sample Response

```
<binary data>
```

### Evaluation Criteria

- API implemented and working as expected.
- Code is written in a clean, modern, and maintainable way.
- Sufficient documentation provided for running the site locally.

### Additional Information

- We recommend using FFmpeg, specifically the [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) library to fuse videos together.
- Feel free to start your project from scratch or use boilerplate code.