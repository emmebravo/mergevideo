// display videos off db.json
async function fetchDB() {
  try {
    const response = await fetch('/video');
    const data = await response.json();
    const videoDisplay = document.getElementById('videosDB');
    data.videos.forEach((clip) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${clip.id}`;
      const div = document.createElement('div');
      div.innerHTML = `${clip.source}`;
      videoDisplay.appendChild(div).appendChild(checkbox);
    });
  } catch (error) {
    console.log(error);
  }
}

fetch('/video')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const videoDisplay = document.getElementById('videosDB');
    data.videos.forEach((clip) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${clip.id}`;
      const div = document.createElement('div');
      div.innerHTML = `${clip.source}`;
      videoDisplay.appendChild(div).appendChild(checkbox);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
