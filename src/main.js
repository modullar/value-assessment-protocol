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
    {
      id: 'visual5',
      filename: 'visual5.mp4'
    },
    {
      id: 'visual6',
      filename: 'visual6.mp4'
    }
    // Add more visual works as needed
  ],
  audio: {
    id: 'main-audio',
    filename: 'main-audio.wav'
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

// Function to check if an element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Calculate what percentage of the element is in the viewport
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.bottom - rect.top;
  
  // Consider it "in viewport" if more than 70% is visible
  return (visibleHeight / elementHeight) > 0.7;
}

// Function to update video visibility based on scroll position
function updateVideoVisibility() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    const video = item.querySelector('video');
    
    if (isElementInViewport(item)) {
      item.classList.add('active');
      if (video.paused) {
        video.play().catch(e => console.log('Video play failed:', e));
      }
    } else {
      item.classList.remove('active');
    }
  });
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
  
  // Initial check for which video is in view
  updateVideoVisibility();
  
  // Add scroll event listener
  window.addEventListener('scroll', updateVideoVisibility);
}

// Function to forcefully play audio (to overcome autoplay restrictions)
function forceAudioPlay() {
  if (wavesurfer && isAudioLoaded && wavesurfer.isPlaying() === false) {
    try {
      // Use a user gesture to enable playback
      wavesurfer.play();
      console.log('Forced audio play successful');
    } catch (e) {
      console.log('Forced audio play failed:', e);
    }
  }
}

// Function to set up the audio player
function setupAudioPlayer() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = playPauseBtn.querySelector('i');
  const progressBar = document.getElementById('progressBar');
  const currentTimeDisplay = document.getElementById('currentTime');
  const durationDisplay = document.getElementById('duration');

  // Initialize wavesurfer with minimal initial options
  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'rgba(255, 255, 255, 0.3)',
    progressColor: '#1DB954',
    cursorColor: 'transparent',
    barWidth: 2,
    barGap: 3,
    height: 128,
    barRadius: 3,
    normalize: true
  });
  
  // Load the audio
  wavesurfer.load(`public/audio/${artworks.audio.filename}`);
  
  // When ready
  wavesurfer.on('ready', () => {
    isAudioLoaded = true;
    const duration = wavesurfer.getDuration();
    durationDisplay.textContent = formatTime(duration);
    
    // Use multiple strategies to start audio playback
    playAudioWithFallbacks();
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

// Multiple strategies to try to autoplay audio
function playAudioWithFallbacks() {
  // Strategy 1: Direct play attempt
  wavesurfer.play().catch(e => {
    console.log('Direct play failed, trying alternatives:', e);
    
    // Strategy 2: Delayed play
    setTimeout(() => {
      wavesurfer.play().catch(e => console.log('Delayed play failed:', e));
    }, 1000);
    
    // Strategy 3: User interaction simulation
    document.addEventListener('click', forceAudioPlay, { once: true });
    document.addEventListener('scroll', forceAudioPlay, { once: true });
    
    // Strategy 4: Create a "silent" audio context to unlock audio
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createBufferSource();
      source.buffer = audioContext.createBuffer(1, 1, 22050);
      source.connect(audioContext.destination);
      source.start(0);
      
      // After unlocking, try playing again
      setTimeout(() => {
        wavesurfer.play().catch(e => console.log('Post-unlock play failed:', e));
      }, 500);
    } catch (e) {
      console.log('Audio context unlock failed:', e);
    }
  });
}

// Initialize the gallery and audio player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createVisualGallery();
  setupAudioPlayer();
  
  // Add an additional user interaction listener to ensure audio plays
  window.addEventListener('click', () => {
    if (isAudioLoaded && wavesurfer && !wavesurfer.isPlaying()) {
      wavesurfer.play();
    }
  }, { once: true });
});