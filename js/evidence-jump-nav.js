// evidence-jump-nav.js
// Handles jump navigation between evidence types when reaching menu boundaries

const EvidenceJumpNav = (function() {
  'use strict';
  
  // Evidence navigation sequence
  const EVIDENCE_SEQUENCE = [
    'extras',      // Additional Evidence
    'denials',     // Credit Denials
    'emotional',   // Emotional Impact
    'bankruptcy',  // Bankruptcy docs
    'triggers',    // Timeline Triggers
    'alerts'       // Damaging alerts
  ];
  
  let initialized = false;
  let currentEvidenceType = '';
  let currentLinkIndex = 0;
  let currentMenuLinks = [];
  let isJumping = false; // Flag to prevent cycling
  
  // Initialize the jump navigation system
  function init() {
    if (initialized) return;
    
    console.log('🎯 Initializing Evidence Jump Navigation System');
    
    // Set up event listeners for arrow buttons
    setupArrowListeners();
    
    initialized = true;
    console.log('🎯 Evidence Jump Navigation System ready');
  }
  
  // Set up event listeners for arrow buttons
  function setupArrowListeners() {
    const leftArrow = document.getElementById('Evidence_Nav_Left');
    const rightArrow = document.getElementById('Evidence_Nav_Right');
    const groupLeftArrow = document.getElementById('Evidence_Nav_Group_Left');
    const groupRightArrow = document.getElementById('Evidence_Nav_Group_Right');
    
    if (leftArrow) {
      leftArrow.addEventListener('click', handleLeftArrowClick);
    }
    if (rightArrow) {
      rightArrow.addEventListener('click', handleRightArrowClick);
    }
    if (groupLeftArrow) {
      groupLeftArrow.addEventListener('click', () => handleGroupNavigation('left'));
    }
    if (groupRightArrow) {
      groupRightArrow.addEventListener('click', () => handleGroupNavigation('right'));
    }
  }
  
  // Handle left arrow click
  function handleLeftArrowClick() {
    if (!currentMenuLinks.length || isJumping) return;
    
    // If we're at the first link, jump to previous evidence type
    if (currentLinkIndex === 0) {
      handleGroupNavigation('left');
    } else {
      // Otherwise, let the regular navigation handle it
      return false;
    }
  }
  
  // Handle right arrow click
  function handleRightArrowClick() {
    if (!currentMenuLinks.length || isJumping) return;
    
    // If we're at the last link, jump to next evidence type
    if (currentLinkIndex === currentMenuLinks.length - 1) {
      handleGroupNavigation('right');
    } else {
      // Otherwise, let the regular navigation handle it
      return false;
    }
  }
  
  // Handle group navigation (Hybrid Solution)
  function handleGroupNavigation(direction) {
    if (isJumping) return;
    isJumping = true;
    
    console.log(`🎯 Group navigation: ${direction}`);
    
    const currentIndex = EVIDENCE_SEQUENCE.indexOf(currentEvidenceType);
    const nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= 0 && nextIndex < EVIDENCE_SEQUENCE.length) {
      const nextType = EVIDENCE_SEQUENCE[nextIndex];
      
      // Clear current selection
      document.querySelectorAll('.evidence-button').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Find and select new button
      const button = document.querySelector(`.evidence-button[data-button="${nextType}"]`);
      if (button) {
        button.classList.add('selected');
        
        // Trigger menu load
        button.click();
        
        // Update state after menu loads
        setTimeout(() => {
          const links = document.querySelectorAll('#Evidence_Link_List a');
          currentMenuLinks = Array.from(links);
          currentLinkIndex = direction === 'right' ? 0 : currentMenuLinks.length - 1;
          
          if (currentMenuLinks.length) {
            currentMenuLinks[currentLinkIndex].classList.add('selected');
            currentMenuLinks[currentLinkIndex].click();
          }
          
          // Reset jumping flag and force refresh
          setTimeout(() => {
            isJumping = false;
            forceRefresh();
          }, 100);
        }, 100);
      } else {
        isJumping = false;
        forceRefresh();
      }
    } else {
      isJumping = false;
      forceRefresh();
    }
  }
  
  // Force refresh the page (equivalent to Ctrl+Shift+R)
  function forceRefresh() {
    console.log('🔄 Forcing page refresh');
    window.location.reload(true);
  }
  
  // Update current state
  function updateCurrentState(type, links) {
    if (isJumping) return; // Don't update state while jumping
    
    currentEvidenceType = type;
    currentMenuLinks = Array.from(links);
    currentLinkIndex = currentMenuLinks.findIndex(link => link.classList.contains('selected'));
  }
  
  // Check if we're at a menu boundary
  function isAtMenuBoundary(direction) {
    if (!currentMenuLinks.length || isJumping) return false;
    
    if (direction === 'left') {
      return currentLinkIndex === 0;
    } else if (direction === 'right') {
      return currentLinkIndex === currentMenuLinks.length - 1;
    }
    return false;
  }
  
  // Public API
  return {
    init,
    updateCurrentState,
    isAtMenuBoundary
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  EvidenceJumpNav.init();
}); 