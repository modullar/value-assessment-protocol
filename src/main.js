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

// Global variables
let wavesurfer;
let isAudioLoaded = false;
let autoplayAttempts = 0;
const MAX_AUTOPLAY_ATTEMPTS = 10;

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
  if (wavesurfer && isAudioLoaded && !wavesurfer.isPlaying()) {
    try {
      wavesurfer.play();
      console.log('Force audio play successful');
    } catch (e) {
      console.log('Force audio play failed:', e);
      if (autoplayAttempts < MAX_AUTOPLAY_ATTEMPTS) {
        autoplayAttempts++;
        setTimeout(forceAudioPlay, 500); // Try again after a short delay
      }
    }
  }
}

// Create a fake user interaction to bypass autoplay restrictions
function simulateUserGesture() {
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(clickEvent);
}

// Function to set up the audio player
function setupAudioPlayer() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = playPauseBtn.querySelector('i');
  const progressBar = document.getElementById('progressBar');
  const currentTimeDisplay = document.getElementById('currentTime');
  const durationDisplay = document.getElementById('duration');

  // Create an unwrapped audio element first to try to unlock the audio API
  const bootstrapAudio = document.createElement('audio');
  bootstrapAudio.src = `public/audio/${artworks.audio.filename}`;
  bootstrapAudio.load();
  
  // Try to unlock audio with user gesture simulation
  if (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
    simulateUserGesture();
  }

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
    normalize: true,
    autoplay: true // Try to autoplay
  });
  
  // Load the audio
  wavesurfer.load(`public/audio/${artworks.audio.filename}`);
  
  // When ready
  wavesurfer.on('ready', () => {
    isAudioLoaded = true;
    const duration = wavesurfer.getDuration();
    durationDisplay.textContent = formatTime(duration);
    
    // Aggressive autoplay
    playWithAllStrategies();
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
  
  // Play/pause button functionality (also starts autoplay on user click)
  playPauseBtn.addEventListener('click', () => {
    if (isAudioLoaded) {
      wavesurfer.playPause();
    }
  });
}

// Try all possible strategies to start audio playback
function playWithAllStrategies() {
  // Strategy 1: Direct play
  wavesurfer.play().then(() => {
    console.log('Direct play worked');
  }).catch(e => {
    console.log('Direct play failed, trying alternatives:', e);
    
    // Strategy 2: Try multiple times with delay
    const attemptPlay = (attempt) => {
      if (attempt > MAX_AUTOPLAY_ATTEMPTS) return;
      
      setTimeout(() => {
        console.log(`Attempt ${attempt} to play audio`);
        wavesurfer.play().catch(() => attemptPlay(attempt + 1));
      }, attempt * 300);
    };
    
    attemptPlay(1);
    
    // Strategy 3: Use various user interaction events
    document.addEventListener('click', forceAudioPlay);
    document.addEventListener('touchstart', forceAudioPlay);
    document.addEventListener('keydown', forceAudioPlay);
    document.addEventListener('scroll', forceAudioPlay);
    
    // Strategy 4: Simulate a user gesture
    simulateUserGesture();
    setTimeout(forceAudioPlay, 100);
    
    // Strategy 5: Auto-retry periodically
    setInterval(forceAudioPlay, 2000);
  });
}

// Initialize the gallery and audio player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createVisualGallery();
  setupAudioPlayer();
  
  // Add an additional overall click listener for the whole page
  document.addEventListener('click', () => {
    forceAudioPlay();
  });
});