/**
 * Mobile VIObox Height Fix
 * Forces VIOboxes to proper height on mobile devices
 */

(function() {
    'use strict';
    
    // Check if we're on a mobile device
    function isMobile() {
        return window.innerWidth <= 768 || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    }
    
    // Fix VIObox heights
    function fixVioboxHeights() {
        if (!isMobile()) return;
        
        // Get all VIOboxes
        const vioboxes = document.querySelectorAll('.viobox');
        
        vioboxes.forEach(viobox => {
            // Determine target height based on screen size
            let targetHeight = 26; // Default
            if (window.innerWidth <= 320) {
                targetHeight = 24;
            }
            
            // Force the height
            viobox.style.setProperty('height', `${targetHeight}px`, 'important');
            viobox.style.setProperty('min-height', `${targetHeight}px`, 'important');
            viobox.style.setProperty('max-height', `${targetHeight}px`, 'important');
            
            // Fix the icon size too
            const icon = viobox.querySelector('.severity-icon');
            if (icon) {
                const iconSize = window.innerWidth <= 320 ? 18 : 20;
                icon.style.setProperty('width', `${iconSize}px`, 'important');
                icon.style.setProperty('height', `${iconSize}px`, 'important');
            }
        });
    }
    
    // Run on page load
    document.addEventListener('DOMContentLoaded', () => {
        // Initial fix
        setTimeout(fixVioboxHeights, 100);
        
        // Fix after violations are rendered
        setTimeout(fixVioboxHeights, 500);
        setTimeout(fixVioboxHeights, 1000);
    });
    
    // Run when violations are updated
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('viobox')) {
                        setTimeout(fixVioboxHeights, 10);
                    }
                });
            }
        });
    });
    
    // Observe viobox containers
    document.addEventListener('DOMContentLoaded', () => {
        const containers = document.querySelectorAll('.viobox-container, .tagger-viobox-container');
        containers.forEach(container => {
            observer.observe(container, { childList: true, subtree: true });
        });
    });
    
    // Also fix on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(fixVioboxHeights, 100);
    });
    
    // Export for debugging
    window.fixVioboxHeights = fixVioboxHeights;
})();