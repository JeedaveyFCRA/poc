/**
 * Canvas Synchronization Module
 * Ensures Viotagger and Report Viewer use identical coordinate systems
 * Base canvas: 1920x1080 fixed layout
 */

class CanvasSync {
    constructor() {
        // Base canvas dimensions (Viotagger standard)
        this.BASE_WIDTH = 1920;
        this.BASE_HEIGHT = 1080;
        
        // Report Viewer container dimensions
        this.REPORT_VIEWER_WIDTH = 810;
        this.REPORT_VIEWER_HEIGHT = 920;
        
        // Calculate scale factors
        this.scaleX = this.REPORT_VIEWER_WIDTH / this.BASE_WIDTH;
        this.scaleY = this.REPORT_VIEWER_HEIGHT / this.BASE_HEIGHT;
    }
    
    /**
     * Convert Viotagger coordinates to Report Viewer coordinates
     * @param {Object} coords - { x, y, width, height }
     * @returns {Object} Scaled coordinates for Report Viewer
     */
    viotaggerToReportViewer(coords) {
        return {
            x: Math.round(coords.x * this.scaleX),
            y: Math.round(coords.y * this.scaleY),
            width: Math.round(coords.width * this.scaleX),
            height: Math.round(coords.height * this.scaleY)
        };
    }
    
    /**
     * Convert Report Viewer coordinates to Viotagger coordinates
     * @param {Object} coords - { x, y, width, height }
     * @returns {Object} Scaled coordinates for Viotagger
     */
    reportViewerToViotagger(coords) {
        return {
            x: Math.round(coords.x / this.scaleX),
            y: Math.round(coords.y / this.scaleY),
            width: Math.round(coords.width / this.scaleX),
            height: Math.round(coords.height / this.scaleY)
        };
    }
    
    /**
     * Apply viewport scaling for responsive display
     * @param {number} viewportWidth - Current viewport width
     * @returns {number} Scale factor for CSS transform
     */
    getViewportScale(viewportWidth) {
        if (viewportWidth > this.BASE_WIDTH) {
            return 1; // No scaling for larger screens
        }
        return viewportWidth / this.BASE_WIDTH;
    }
    
    /**
     * Calculate actual pixel position accounting for viewport scaling
     * @param {Object} coords - Base coordinates
     * @param {number} viewportScale - Current viewport scale
     * @returns {Object} Actual screen coordinates
     */
    getScreenCoordinates(coords, viewportScale) {
        return {
            x: coords.x * viewportScale,
            y: coords.y * viewportScale,
            width: coords.width * viewportScale,
            height: coords.height * viewportScale
        };
    }
    
    /**
     * Verify if coordinates are within bounds
     * @param {Object} coords - Coordinates to check
     * @param {string} system - 'viotagger' or 'reportviewer'
     * @returns {boolean} True if within bounds
     */
    isWithinBounds(coords, system = 'viotagger') {
        const bounds = system === 'viotagger' 
            ? { width: this.BASE_WIDTH, height: this.BASE_HEIGHT }
            : { width: this.REPORT_VIEWER_WIDTH, height: this.REPORT_VIEWER_HEIGHT };
            
        return coords.x >= 0 && 
               coords.y >= 0 && 
               (coords.x + coords.width) <= bounds.width &&
               (coords.y + coords.height) <= bounds.height;
    }
    
    /**
     * Get debug information for coordinate mapping
     * @param {Object} viotaggerCoords - Original Viotagger coordinates
     * @returns {Object} Debug information
     */
    getDebugInfo(viotaggerCoords) {
        const reportViewerCoords = this.viotaggerToReportViewer(viotaggerCoords);
        return {
            viotagger: viotaggerCoords,
            reportViewer: reportViewerCoords,
            scaleFactors: {
                x: this.scaleX,
                y: this.scaleY
            },
            inBounds: {
                viotagger: this.isWithinBounds(viotaggerCoords, 'viotagger'),
                reportViewer: this.isWithinBounds(reportViewerCoords, 'reportviewer')
            }
        };
    }
}

// Export for use in both systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasSync;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.CanvasSync = CanvasSync;
}