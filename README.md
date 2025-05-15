# Value Assessment Protocol

A portfolio website showcasing generative audio and visual artworks that explore the concept of value assessment protocols.

## Features

- Modern, gallery-style display of video artworks
- Autoplay videos with hover effects
- SoundCloud-style audio player with waveform visualization
- Responsive design that works on mobile and desktop
- Dark aesthetic theme
- Ready for deployment to GitHub Pages or Vercel

## Project Structure

```
value-assessment-protocol/
│
├── index.html                # Main HTML file
├── styles/                   # CSS styles
│   └── main.css              # Main stylesheet
│
├── src/                      # JavaScript source files
│   └── main.js               # Main JS file
│
├── public/                   # Public assets
│   ├── videos/               # Video files (MP4)
│   └── audio/                # Audio files (MP3)
│
├── .github/                  # GitHub configuration
│   └── workflows/            # GitHub Actions workflows
│      └── deploy.yml         # Deployment workflow for GitHub Pages
│
└── vercel.json               # Vercel configuration file
```

## Running Locally

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the local development server:
   ```
   npm run dev
   ```
4. Open your browser to `http://localhost:8080`

## Adding Your Content

### Videos

1. Add your video files (MP4 format) to the `public/videos/` directory
2. By default, the system looks for: `visual1.mp4`, `visual2.mp4`, `visual3.mp4`, and `visual4.mp4`
3. To change the video titles and descriptions, edit the `artworks.visual` array in `src/main.js`

### Audio

1. Add your main audio file to the `public/audio/` directory
2. Name the file `main-audio.mp3`
3. To change the audio title and description, edit the `artworks.audio` object in `src/main.js`

## Deployment

### GitHub Pages

1. Push the repository to GitHub
2. Go to Settings > Pages
3. In the "Build and deployment" section, set:
   - Source: GitHub Actions
4. The GitHub workflow will automatically deploy your site when you push to the main branch
5. Your site will be available at `https://yourusername.github.io/value-assessment-protocol/`

### Vercel

1. Sign up for an account at [vercel.com](https://vercel.com) if you don't have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Deploy to Vercel:
   ```
   vercel
   ```
4. Follow the prompts to complete the deployment

Alternatively:
1. Connect your GitHub repository to Vercel through their dashboard
2. Configure the project (default settings should work fine)
3. Deploy

## Customization

To customize the website:

1. Edit the HTML in `index.html` to change the structure
2. Modify the CSS in `styles/main.css` to change the appearance
3. Update the JavaScript in `src/main.js` to change the functionality

## Browser Compatibility

The site works best in modern browsers:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari

Note about autoplay: Most browsers require videos to be muted for autoplay to work. The videos in this template are set to muted by default.