const { remote } = require('electron');
const { dialog } = remote;

const ve = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const seekFw1Btn = document.getElementById('seekFw1');
const seekBh1Btn = document.getElementById('seekBh1');
const videoSelectBtn = document.getElementById('videoSelectBtn');
const timecode = document.getElementById('timecode');

const debug = document.getElementById('debug');
let intervalId = 0;

document.addEventListener('keydown', logKey);

startBtn.onclick = startPlaying;
stopBtn.onclick = stopPlaying;
seekFw1Btn.onclick = seekFwFrame;
seekBh1Btn.onclick = seekBhFrame;
videoSelectBtn.onclick = selectMedia;

let video = VideoFrame({
  id: 'video',
  frameRate: FrameRates.film,
  callback: function (response) {
    console.log(response);
  }
});

async function selectMedia() {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  if (!result.canceled) {
    console.log(result.filePaths);
    const source = ve.getElementsByTagName('source');
    source[0].src = 'file:///' + result.filePaths[0];
    ve.load();
  }
}

function seekFwFrame() {
  video.seekForward(1, () => {
    timecode.innerText = video.toSMPTE();
    console.log(video.get());
  });
}

function seekBhFrame() {
  video.seekBackward(1, () => {
    timecode.innerText = video.toSMPTE();
    console.log(video.get());
  });
}

function startPlaying() {
  intervalId = setInterval(function () {
    timecode.innerText = video.toSMPTE();
  }, 40);
  ve.play();
}

function stopPlaying() {
  if (!ve.paused) {
    ve.pause();
    clearInterval(intervalId);
    video.seekBackward(1, () => {
      console.log(video.get());
    });
  }
}

function logKey(e) {
  //ALT+a
  if (e.altKey && e.keyCode === 65) {
    console.log('AAAAA');
  }
  //spacebar
  if (e.keyCode === 32) {
    (ve.paused) ? startPlaying() : stopPlaying();
  }
  //j
  if (e.keyCode === 74) {
    seekFwFrame();
  }
  //k
  if (e.keyCode === 75) {
    seekBhFrame();
  }

  //e.ctrlKey && e.altKey && e.shiftKey
  console.log(e.keyCode);
}