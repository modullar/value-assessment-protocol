// Sample data structure for artworks
const artworks = {
  visual: [
    {
      id: 'visual1',
      title: 'Valuation Algorithm #1',
      description: 'Generative visual exploration of value metrics in digital economies.',
      filename: 'visual1.mp4'
    },
    {
      id: 'visual2',
      title: 'Protocol Feedback Loop',
      description: 'Visualization of assessment systems and their recursive patterns.',
      filename: 'visual2.mp4'
    },
    {
      id: 'visual3',
      title: 'Metric Cascades',
      description: 'The flow of value determinations through hierarchical structures.',
      filename: 'visual3.mp4'
    },
    {
      id: 'visual4',
      title: 'Threshold Variations',
      description: 'Exploring the boundaries between accepted and rejected values.',
      filename: 'visual4.mp4'
    },
    // Add more visual works as needed
  ],
  audio: {
    id: 'main-audio',
    title: 'Value Assessment Protocol - Audio Experience',
    description: 'Generative soundscape reflecting value metrics.',
    filename: 'main-audio.mp3'
  }
};

// Initialize WaveSurfer for audio visualization
let wavesurfer;
let audioElement;

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
    item.style.animationDelay = `${index * 0.1}s`;
    
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
    
    const caption = document.createElement('div');
    caption.className = 'caption';
    
    const title = document.createElement('h3');
    title.textContent = artwork.title;
    
    const description = document.createElement('p');
    description.textContent = artwork.description;
    
    caption.appendChild(title);
    caption.appendChild(description);
    
    item.appendChild(video);
    item.appendChild(caption);
    
    gallery.appendChild(item);
    
    // Add a slight delay to stagger video loading
    setTimeout(() => {
      video.play().catch(e => console.log('Autoplay prevented:', e));
    }, index * 300);
  });
}

// Function to set up the audio player
function setupAudioPlayer() {
  // Create audio element with autoplay
  audioElement = document.createElement('audio');
  audioElement.id = 'main-audio-element';
  audioElement.src = `public/audio/${artworks.audio.filename}`;
  document.body.appendChild(audioElement);
  
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
    responsive: true,
    normalize: true,
    backend: 'MediaElement',
    media: audioElement
  });
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = playPauseBtn.querySelector('i');
  const progressBar = document.getElementById('progressBar');
  const currentTimeDisplay = document.getElementById('currentTime');
  const durationDisplay = document.getElementById('duration');
  
  // Load the audio and play when ready
  wavesurfer.on('ready', function() {
    // Update duration display
    const duration = wavesurfer.getDuration();
    durationDisplay.textContent = formatTime(duration);
    
    // Attempt to autoplay
    wavesurfer.play().catch(e => console.log('Autoplay prevented:', e));
  });
  
  // Update play/pause button
  wavesurfer.on('play', function() {
    playPauseIcon.className = 'fas fa-pause';
  });
  
  wavesurfer.on('pause', function() {
    playPauseIcon.className = 'fas fa-play';
  });
  
  // Update time displays
  wavesurfer.on('audioprocess', function() {
    const currentTime = wavesurfer.getCurrentTime();
    currentTimeDisplay.textContent = formatTime(currentTime);
    const progress = (currentTime / wavesurfer.getDuration()) * 100;
    progressBar.style.width = `${progress}%`;
  });
  
  // Play/pause button functionality
  playPauseBtn.addEventListener('click', function() {
    wavesurfer.playPause();
  });
}

// Initialize the gallery and audio player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createVisualGallery();
  setupAudioPlayer();
  
  // Add parallax effect for gallery items on scroll
  window.addEventListener('scroll', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      const scrollPosition = window.scrollY;
      const offset = scrollPosition * 0.05 * ((index % 3) + 1) * 0.3;
      item.style.transform = `translateY(${-offset}px) scale(${1 + offset * 0.001})`;
    });
  });
});