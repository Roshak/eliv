const { dialog, process } = require('@electron/remote');
const fs = require('fs');

const image = document.getElementById('image');
const videoSelectBtn = document.getElementById('videoSelectBtn');

const debug = document.getElementById('debug');

document.addEventListener('keydown', logKey);

videoSelectBtn.onclick = selectMedia;

let args = process.argv;
console.log(args);

let folder = '';
let file = '';
let files = null;
let fileIndex = 0;

if (args.length > 1) {
  image.src = `file:///${process.cwd()}/${args[1]}`;
  file = args[1];
  folder = process.cwd();
  files = [file];
  debug.innerText = `File: ${file} - ${fileIndex + 1} / ${files.length} files`;
}

async function selectMedia() {
  const result = await dialog.showOpenDialog({
    title: 'Open...',
    buttonLabel: 'Select',
    defaultPath: folder,
    properties: ['openFile'],
  });
  if (!result.canceled) {
    // console.log(result.filePaths);
    image.src = 'file:///' + result.filePaths[0];
    resize();

    folder = result.filePaths[0];
    file = folder.substring(folder.lastIndexOf('/') + 1, folder.length);
    folder = folder.substring(0, folder.lastIndexOf('/') + 1);

    files = fs.readdirSync(folder);
    files = files.sort();
    fileIndex = files.findIndex((element) => element === file);
    debug.innerText = `File: ${file} - ${fileIndex + 1} / ${
      files.length
    } files`;
  }
}

function nextImage() {
  if (fileIndex < files.length - 1) {
    // console.log(files);
    image.src = 'file:///' + folder + files[fileIndex + 1];
    resize();
    fileIndex++;
    debug.innerText = `File: ${files[fileIndex]} - ${fileIndex + 1} / ${
      files.length
    } files`;
  }

  if (fileIndex === files.length - 1) {
    selectMedia();
  }
}

function prevImage() {
  if (fileIndex > 0) {
    // console.log(files);
    image.src = 'file:///' + folder + files[fileIndex - 1];
    resize();
    fileIndex--;
    debug.innerText = `File: ${files[fileIndex]} - ${fileIndex + 1} / ${
      files.length
    } files`;
  }
}
function logKey(e) {
  // ->
  if (e.keyCode === 39) {
    nextImage();
  }
  // <-
  if (e.keyCode === 37) {
    prevImage();
  }
  // console.log(e.keyCode);
}

function resize() {
  winDim = getWinDim();

  image.style.height = `${winDim.y - 40}px`;
  console.log(image.clientWidth);
  if (image.offsetWidth > winDim.x) {
    image.style.height = null;
    image.style.width = `${winDim.x}px`;
  }
}

function getWinDim() {
  var body = document.documentElement || document.body;

  return {
    x: window.innerWidth || body.clientWidth,
    y: window.innerHeight || body.clientHeight,
  };
}
