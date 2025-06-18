/**
 * Canvas Sync Adapter for Report Viewer
 * Adapts the existing Report Viewer to use Viotagger's coordinate system
 */

(function() {
    'use strict';
    
    // Load the canvas sync module
    const script = document.createElement('script');
    script.src = '../vioverse-refactor/js/canvas-sync.js';
    document.head.appendChild(script);
    
    script.onload = function() {
        // Initialize canvas sync
        const canvasSync = new CanvasSync();
        
        // Store original violation creation method if it exists
        const originalCreateViolation = window.createViolationOverlay || function() {};
        
        // Override violation overlay creation to use synced coordinates
        window.createViolationOverlay = function(violationData) {
            // If we're in Report Viewer mode, don't scale coordinates
            // as we're now using the same 1920x1080 canvas
            return originalCreateViolation.call(this, violationData);
        };
        
        // Add canvas sync info to window for debugging
        window.canvasSync = canvasSync;
        
        // Add debug mode toggle
        window.toggleCanvasDebug = function() {
            document.body.classList.toggle('debug-canvas-bounds');
            const isDebug = document.body.classList.contains('debug-canvas-bounds');
            console.log('Canvas debug mode:', isDebug ? 'ON' : 'OFF');
            
            if (isDebug) {
                console.log('Canvas dimensions:', {
                    viotagger: { width: canvasSync.BASE_WIDTH, height: canvasSync.BASE_HEIGHT },
                    reportViewer: { 
                        width: canvasSync.REPORT_VIEWER_WIDTH, 
                        height: canvasSync.REPORT_VIEWER_HEIGHT 
                    },
                    scaleFactors: { x: canvasSync.scaleX, y: canvasSync.scaleY }
                });
            }
        };
        
        // Update container structure on load
        document.addEventListener('DOMContentLoaded', function() {
            // Wrap existing content in poc-view-container if not already wrapped
            if (!document.querySelector('.poc-view-container')) {
                const container = document.createElement('div');
                container.className = 'poc-view-container';
                
                // Move all body children to container
                while (document.body.firstChild) {
                    container.appendChild(document.body.firstChild);
                }
                
                document.body.appendChild(container);
            }
            
            // Ensure violation overlay container exists
            let overlayContainer = document.getElementById('Violation_Overlay_Container');
            if (!overlayContainer) {
                overlayContainer = document.createElement('div');
                overlayContainer.id = 'Violation_Overlay_Container';
                
                const imageContainer = document.getElementById('Image_Canvas_Container');
                if (imageContainer) {
                    imageContainer.appendChild(overlayContainer);
                }
            }
            
            console.log('Canvas Sync Adapter initialized');
            console.log('Use window.toggleCanvasDebug() to show canvas boundaries');
        });
        
        // Listen for violation data updates
        document.addEventListener('violationsLoaded', function(event) {
            const violations = event.detail;
            console.log('Processing violations with canvas sync:', violations.length);
            
            // Violations should already be in 1920x1080 coordinates
            // No conversion needed as both systems now use the same base
        });
        
        // Monitor window resize for responsive scaling
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                const viewportWidth = window.innerWidth;
                const scale = canvasSync.getViewportScale(viewportWidth);
                console.log('Viewport scale updated:', scale);
            }, 250);
        });
    };
})();