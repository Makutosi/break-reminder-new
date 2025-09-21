# Break Reminder New

A simple web-based timer app that reminds you to take breaks while working on your computer or smartphone. Built to help maintain focus and prevent long periods of continuous screen time.  
This is an updated version of the previous **Break Reminder** (which was private), with improved features, responsive design, and PWA support.

<p align="center">
  <img src="screenshots/screenshot-desktop.png" alt="Desktop Screenshot" height="300">
  <img src="screenshots/screenshot-mobile.png" alt="Mobile Screenshot" height="300">
</p>

---

## Features

- Countdown timer with pause, stop, and reset functionality
- Circular progress bar with visual feedback
- Customizable background images
- Mobile responsive design
- PWA support for offline use and home screen installation
- Audio and vibration alerts when the timer ends
- Drag-and-drop card interface for flexible positioning

---

## Folder Structure

- index.html
- styles.css
- script.js
- manifest.json
- service-worker.js
- images/
  - background.jpg
  - background-720.jpg
  - aurora.jpg
  - aurora-720.jpg
  - minimal.jpg
  - minimal-720.jpg
- icons/
  - icon-192.png
  - icon-512.png
- audio/
  - alert.mp3
- screenshots/
  - screenshot-desktop.png
  - screenshot-mobile.png

---

## Usage

1. Open `index.html` in your browser.  
2. Click **Set Timer** to choose a break interval (5–120 minutes).  
3. Use **Pause**, **Stop**, or **Toggle Countdown** buttons to control the timer.  
4. Select a background via the **Change Background** button.  
5. When the timer ends, a break modal appears with audio/vibration alert.

---

## PWA Support

- Installable on desktop and mobile devices.
- Works offline after initial load.
- Home screen icon is included (192x192 and 512x512 PNG).

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Notes

- Recommended to use a modern browser for full functionality.
- Mobile screenshots show responsive design; desktop screenshot shows draggable card interface.
- Images are optimized for faster loading on mobile devices.
