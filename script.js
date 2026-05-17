const audio = document.querySelector("#audio-player");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const progressBar = document.querySelector("#progress-bar-fill");
const progressContainer = document.querySelector("#progress-bar");
const vinyl = document.querySelector("#vinyl");
const albumArt = document.querySelector("#album-art");
const trackName = document.querySelector("#track-name");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const volumeControl = document.querySelector("#volume-control");
const muteBtn = document.querySelector("#mute-btn");
const modeBtn = document.querySelector("#mode-btn");
const timeDisplay = document.querySelector("#time-display");

const favoriteBtn = document.querySelector("#favorite-btn");
const playlistBtn = document.querySelector("#playlist-btn");
const playlistPopup = document.querySelector("#playlist-popup");

const tracks = document.querySelectorAll(".track");

let currentTrack = 0;
let shuffleMode = false;
let repeatMode = false;

// Default track loaded on startup.
audio.src =
  "https://thelongesthumstore.sgp1.cdn.digitaloceanspaces.com/IM-2250/p-hase_Hes.mp3";

playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", previousTrack);
nextBtn.addEventListener("click", nextTrack);
volumeControl.addEventListener("input", updateVolume);
muteBtn.addEventListener("click", toggleMute);
modeBtn.addEventListener("click", toggleMode);
favoriteBtn.addEventListener("click", toggleFavorite);
playlistBtn.addEventListener("click", togglePlaylist);

audio.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgress);

tracks.forEach((track, index) => {
  track.addEventListener("click", () => {
    currentTrack = index;
    changeTrack(track);
  });
});

function togglePlayPause() {
  if (audio.paused) {
    audio.play();

    playPauseImg.src =
      "https://img.icons8.com/ios-glyphs/30/pause--v1.png";

    vinyl.classList.add("spin");

    albumArt.style.transform =
      "scale(1.04) rotate(-2deg)";

    albumArt.style.boxShadow =
      "0 0 180px rgba(198, 166, 255, 0.95)";

  } else {

    audio.pause();

    playPauseImg.src =
      "https://img.icons8.com/ios-glyphs/30/play--v1.png";

    vinyl.classList.remove("spin");

    albumArt.style.transform =
      "scale(1) rotate(30deg)";

    albumArt.style.boxShadow =
      "0 0 30px rgba(198, 166, 255, 0.12)";
  }
}

function updateProgressBar() {
  const value = (audio.currentTime / audio.duration) * 100;

  progressBar.style.width = value + "%";

  updateTimeDisplay();
}

function setProgress(event) {
  const width = this.clientWidth;
  const clickX = event.offsetX;

  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

/* Smooth fade transitions were added between tracks and artwork changes
to avoid abrupt visual jumps when switching songs.
This decision supports the ambient electronic theme by making the
experience feel slower, calmer, and more cinematic. */
function changeTrack(track) {
  tracks.forEach((item) => {
    item.classList.remove("active-track");
  });

  track.classList.add("active-track");

  const newSrc = track.dataset.src;
  const newTitle = track.dataset.title;
  const newArt = track.dataset.art;

  albumArt.style.opacity = "0";

  setTimeout(() => {
    audio.src = newSrc;

    trackName.textContent = newTitle;

    albumArt.src = newArt;

    albumArt.style.opacity = "1";

    audio.play();

    playPauseImg.src =
      "https://img.icons8.com/ios-glyphs/30/pause--v1.png";

    vinyl.classList.add("spin");

  }, 300);
}

function updateVolume() {
  audio.volume = volumeControl.value;
}

function nextTrack() {

  if (shuffleMode) {

    let randomTrack;

    do {
      randomTrack = Math.floor(Math.random() * tracks.length);
    } while (randomTrack === currentTrack);

    currentTrack = randomTrack;

  } else {

    currentTrack = (currentTrack + 1) % tracks.length;
  }

  changeTrack(tracks[currentTrack]);
}

function previousTrack() {

  currentTrack =
    (currentTrack - 1 + tracks.length) % tracks.length;

  changeTrack(tracks[currentTrack]);
}

function toggleMode() {

  if (!shuffleMode && !repeatMode) {

    shuffleMode = true;

    modeBtn.textContent = "🔀";

  } else if (shuffleMode) {

    shuffleMode = false;
    repeatMode = true;

    modeBtn.textContent = "🔂";

  } else {

    repeatMode = false;

    modeBtn.textContent = "🔁";
  }
}

audio.addEventListener("ended", () => {

  if (repeatMode) {

    audio.currentTime = 0;
    audio.play();

  } else {

    nextTrack();
  }
});

function updateTimeDisplay() {

  const minutes = Math.floor(audio.currentTime / 60);

  let seconds = Math.floor(audio.currentTime % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  timeDisplay.textContent = `${minutes}:${seconds}`;
}

function toggleFavorite() {

  favoriteBtn.classList.toggle("favorite-active");

  if (favoriteBtn.classList.contains("favorite-active")) {

    favoriteBtn.textContent = "♥";

  } else {

    favoriteBtn.textContent = "♡";

  }
}

/* An earlier concept explored a draggable and reorderable playlist system.
This idea was later rejected because it introduced unnecessary complexity
for the scope of the assignment and distracted from the album listening
experience itself.
The final popup design focuses on lightweight navigation and maintaining
a cleaner interaction flow. */
function togglePlaylist() {

  if (playlistPopup.style.display === "flex") {

    playlistPopup.style.display = "none";

  } else {

    playlistPopup.style.display = "flex";
  }
}

playlistPopup.addEventListener("click", (event) => {

  if (event.target === playlistPopup) {

    playlistPopup.style.display = "none";
  }
});

function toggleMute() {

  audio.muted = !audio.muted;

  if (audio.muted) {

    muteBtn.textContent = "🔇";

  } else {

    muteBtn.textContent = "🔊";

  }

}
// ChatGPT assisted debugging.