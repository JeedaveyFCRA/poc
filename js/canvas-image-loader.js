// canvas-image-loader.js
// Handles loading of report images and initializes overlays

function loadCanvasImage(filename) {
  const imagePath = `assets/reports/${filename}`;
  loadReportImage(imagePath);
}

function loadReportImage(imagePath) {
  const reportImage = document.getElementById('Report_Image');
  if (!reportImage) {
    console.error('Report image element not found');
    return;
  }

  // Store current violation states before loading new image
  const currentStates = window.CanvasView ? window.CanvasView.getViolationStates() : null;

  reportImage.onload = function() {
    console.log('Report image loaded successfully:', imagePath);
    
    // Initialize violation overlays after image loads
    if (typeof CanvasView !== 'undefined') {
      // Save current states to localStorage before initializing
      if (typeof CanvasView.saveToLocalStorage === 'function') {
        CanvasView.saveToLocalStorage();
      }
      
      // Initialize with preserved states
      CanvasView.initialize(currentStates);
      
      // Force a violation state update
      document.dispatchEvent(new CustomEvent('violationStateChanged'));
    }
  };

  reportImage.onerror = function() {
    console.error('Failed to load report image:', imagePath);
  };

  reportImage.src = imagePath;
}
