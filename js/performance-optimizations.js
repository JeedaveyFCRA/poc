// performance-optimizations.js
// Lightweight optimizations that preserve design

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Preload only essential navigation images
    const essentialImages = [
      'assets/icons/back-button.png',
      'assets/icons/evidence-close.png'
    ];
    
    essentialImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        // Handle resize-dependent positioning
      }, 300);
    });
  });
  
})();