// Import WaveSurfer
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

// Sample data structure for artworks
const artworks = {
  visual: [
    {
      id: 'visual1',
      filename: 'visual1.mp4'
    },
    {
      id: 'visual2',
      filename: 'visual2.mp4'
    },
    {
      id: 'visual3',
      filename: 'visual3.mp4'
    },
    {
      id: 'visual4',
      filename: 'visual4.mp4'
    },
    // Add more visual works as needed
  ],
  audio: {
    id: 'main-audio',
    filename: 'main-audio.mp3'
  }
};

// Initialize WaveSurfer for audio visualization
let wavesurfer;
let isAudioLoaded = false;

// Function to format time in minutes and seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Function to create visual gallery items
function createVisualGallery() {
  const gallery = document.getElementById('visual-gallery');
  
  artworks.visual.forEach((artwork, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.id = artwork.id;
    
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    
    const source = document.createElement('source');
    source.src = `public/videos/${artwork.filename}`;
    source.type = 'video/mp4';
    
    video.appendChild(source);
    item.appendChild(video);
    
    gallery.appendChild(item);
    
    // Add a slight delay to stagger video loading
    setTimeout(() => {
      video.play().catch(e => console.log('Autoplay prevented:', e));
    }, index * 300);
  });
}

// Function to set up the audio player
function setupAudioPlayer() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = playPauseBtn.querySelector('i');
  const progressBar = document.getElementById('progressBar');
  const currentTimeDisplay = document.getElementById('currentTime');
  const durationDisplay = document.getElementById('duration');

  // Initialize wavesurfer
  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'rgba(255, 255, 255, 0.3)',
    progressColor: '#1DB954',
    cursorColor: 'transparent',
    barWidth: 2,
    barGap: 3,
    height: 128,
    barRadius: 3,
    normalize: true,
  });
  
  // Load the audio
  wavesurfer.load(`public/audio/${artworks.audio.filename}`);
  
  // When ready
  wavesurfer.on('ready', () => {
    isAudioLoaded = true;
    const duration = wavesurfer.getDuration();
    durationDisplay.textContent = formatTime(duration);
    
    // Attempt to autoplay
    wavesurfer.play().catch(e => console.log('Autoplay prevented:', e));
  });
  
  // Update play/pause button and progress bar
  wavesurfer.on('play', () => {
    playPauseIcon.className = 'fas fa-pause';
  });
  
  wavesurfer.on('pause', () => {
    playPauseIcon.className = 'fas fa-play';
  });
  
  // Update time and progress
  wavesurfer.on('timeupdate', () => {
    const currentTime = wavesurfer.getCurrentTime();
    currentTimeDisplay.textContent = formatTime(currentTime);
    
    const duration = wavesurfer.getDuration() || 1;
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
  });
  
  // Play/pause button functionality
  playPauseBtn.addEventListener('click', () => {
    if (isAudioLoaded) {
      wavesurfer.playPause();
    }
  });
}

// Initialize the gallery and audio player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createVisualGallery();
  setupAudioPlayer();
});