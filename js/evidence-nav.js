// evidence-nav.js
// Enhanced evidence navigation system with full arrow-based navigation
// Implements seamless navigation across evidence buttons and their links

const EvidenceNav = (function() {
  'use strict';
  
  // Fixed evidence navigation sequence - Final Specification
  const EVIDENCE_SEQUENCE = [
    'extras',      // Additional Evidence (first)
    'denials',     // Credit Denials
    'emotional',   // Emotional Impact
    'bankruptcy',  // Bankruptcy docs
    'triggers',    // Timeline Triggers
    'alerts'       // Damaging Alerts (last)
  ];
  
  // Navigation state
  let currentEvidenceType = '';
  let currentLinkIndex = 0;
  let currentMenuLinks = [];
  let evidenceMap = {};
  let navigationEnabled = false;
  
  // Arrow configuration with exact specs provided
  const ARROW_CONFIG = {
    'Evidence_Nav_Group_Left': {
      x: 1150, y: 42, w: 50, h: 32,
      defaultSrc: 'assets/icons/evidence-nav-group-left-default.png',
      hoverSrc: 'assets/icons/evidence-nav-group-left-hover.png'
    },
    'Evidence_Nav_Left': {
      x: 1118, y: 42, w: 32, h: 32,
      defaultSrc: 'assets/icons/evidence-nav-left-default.png',
      hoverSrc: 'assets/icons/evidence-nav-left-hover.png'
    },
    'Evidence_Nav_Right': {
      x: 1840, y: 42, w: 32, h: 32,
      defaultSrc: 'assets/icons/evidence-nav-right-default.png',
      hoverSrc: 'assets/icons/evidence-nav-right-hover.png'
    },
    'Evidence_Nav_Group_Right': {
      x: 1790, y: 42, w: 50, h: 32,
      defaultSrc: 'assets/icons/evidence-nav-group-right-default.png',
      hoverSrc: 'assets/icons/evidence-nav-group-right-hover.png'
    }
  };
  
  let initialized = false;
  
  // Initialize the navigation system
  async function init() {
    if (initialized) return;
    
    console.log('🎯 Initializing Enhanced Evidence Navigation System');
    
    // Load evidence map for navigation
    await loadEvidenceMap();
    
    // Set up each arrow
    Object.entries(ARROW_CONFIG).forEach(([id, config]) => {
      const arrow = document.getElementById(id);
      if (arrow) {
        setupArrow(arrow, config);
        console.log(`✅ Arrow ${id} initialized`);
      } else {
        console.error(`❌ Arrow ${id} not found in DOM`);
      }
    });
    
    initialized = true;
    console.log('🎯 Enhanced Evidence Navigation System ready');
  }
  
  // Load evidence map for navigation
  async function loadEvidenceMap() {
    try {
      const response = await fetch('data/evidence-map.json');
      evidenceMap = await response.json();
      console.log('📊 Evidence map loaded:', Object.keys(evidenceMap));
    } catch (error) {
      console.error('❌ Failed to load evidence map:', error);
      evidenceMap = {};
    }
  }
  
  // Set up individual arrow with hover effects and click handlers
  function setupArrow(arrow, config) {
    // Ensure correct initial state
    arrow.src = config.defaultSrc;
    arrow.style.position = 'absolute';
    arrow.style.left = config.x + 'px';
    arrow.style.top = config.y + 'px';
    arrow.style.width = config.w + 'px';
    arrow.style.height = config.h + 'px';
    arrow.style.zIndex = '600';
    arrow.style.cursor = 'pointer';
    arrow.style.display = 'none'; // Hidden by default
    
    // Mouse enter handler
    const handleMouseEnter = () => {
      arrow.src = config.hoverSrc;
      arrow.style.transform = 'scale(1.05)';
      arrow.style.transition = 'transform 0.2s ease';
    };
    
    // Mouse leave handler  
    const handleMouseLeave = () => {
      arrow.src = config.defaultSrc;
      arrow.style.transform = 'scale(1)';
    };
    
    // Click handler based on arrow type
    const handleClick = () => {
      if (!navigationEnabled) {
        console.log('🚫 Navigation disabled - arrows not active');
        showDisabledFlash(arrow);
        return;
      }
      
      console.log(`🎯 Evidence navigation arrow clicked: ${arrow.id}`);
      
      if (arrow.id === 'Evidence_Nav_Left') {
        navigateLeft();
      } else if (arrow.id === 'Evidence_Nav_Right') {
        navigateRight();
      } else if (arrow.id === 'Evidence_Nav_Group_Left') {
        navigateGroupLeft();
      } else if (arrow.id === 'Evidence_Nav_Group_Right') {
        navigateGroupRight();
      }
    };
    
    // Remove any existing listeners
    arrow.removeEventListener('mouseenter', handleMouseEnter);
    arrow.removeEventListener('mouseleave', handleMouseLeave);
    arrow.removeEventListener('click', handleClick);
    
    // Add fresh listeners
    arrow.addEventListener('mouseenter', handleMouseEnter);
    arrow.addEventListener('mouseleave', handleMouseLeave);
    arrow.addEventListener('click', handleClick);
  }
  
  // Standard left arrow behavior (←)
  function navigateLeft() {
    console.log('⬅️ Standard left navigation');
    
    if (currentLinkIndex > 0) {
      // Move to previous link in current menu
      navigateToPrevLink();
    } else {
      // At start of menu - jump to last link of previous evidence button
      const prevType = getPreviousEvidenceType();
      if (prevType) {
        switchToEvidenceType(prevType, 'last');
      } else {
        // At the beginning of all evidence - wrap around to the last category
        console.log('🔄 Reached beginning of all evidence - wrapping around to last category');
        const lastType = EVIDENCE_SEQUENCE[EVIDENCE_SEQUENCE.length - 1];
        console.log(`✅ Wrapping around to last evidence type: ${lastType}`);
        switchToEvidenceType(lastType, 'last');
      }
    }
  }
  
  // Standard right arrow behavior (→)
  function navigateRight() {
    console.log('➡️ Standard right navigation');
    console.log(`Current state: type=${currentEvidenceType}, linkIndex=${currentLinkIndex}, totalLinks=${currentMenuLinks.length}`);
    
    if (currentLinkIndex < currentMenuLinks.length - 1) {
      // Move to next link in current menu
      console.log('✅ Moving to next link in current menu');
      navigateToNextLink();
    } else {
      // At end of menu - check for next evidence button
      console.log('🔍 At end of current menu, checking for next evidence button');
      const nextType = getNextEvidenceType();
      console.log(`Next evidence type: ${nextType}`);
      
      if (nextType) {
        console.log(`✅ Switching to next evidence type: ${nextType}`);
        switchToEvidenceType(nextType, 'first');
      } else {
        // At the end of all evidence - wrap around to the first category
        console.log('🔄 Reached end of all evidence - wrapping around to first category');
        const firstType = EVIDENCE_SEQUENCE[0];
        console.log(`✅ Wrapping around to first evidence type: ${firstType}`);
        switchToEvidenceType(firstType, 'first');
      }
    }
  }
  
  // Group left arrow behavior (⏪) - Immediate jump
  function navigateGroupLeft() {
    console.log('⏪ Group left navigation - immediate jump');
    
    const prevType = getPreviousEvidenceType();
    if (prevType) {
      switchToEvidenceType(prevType, 'last');
    } else {
      // At the beginning of all evidence - wrap around to the last category
      console.log('🔄 Group left reached beginning of all evidence - wrapping around to last category');
      const lastType = EVIDENCE_SEQUENCE[EVIDENCE_SEQUENCE.length - 1];
      console.log(`✅ Wrapping around to last evidence type: ${lastType}`);
      switchToEvidenceType(lastType, 'last');
    }
  }
  
  // Group right arrow behavior (⏩) - Immediate jump
  function navigateGroupRight() {
    console.log('⏩ Group right navigation - immediate jump');
    
    const nextType = getNextEvidenceType();
    if (nextType) {
      switchToEvidenceType(nextType, 'first');
    } else {
      // At the end of all evidence - wrap around to the first category
      console.log('🔄 Group right reached end of all evidence - wrapping around to first category');
      const firstType = EVIDENCE_SEQUENCE[0];
      console.log(`✅ Wrapping around to first evidence type: ${firstType}`);
      switchToEvidenceType(firstType, 'first');
    }
  }
  
  // Navigate to next link in current menu
  function navigateToNextLink() {
    if (!currentMenuLinks.length) return;
    
    clearAllHighlights();
    currentLinkIndex++;
    selectAndLoadLink(currentMenuLinks[currentLinkIndex]);
  }
  
  // Navigate to previous link in current menu
  function navigateToPrevLink() {
    if (!currentMenuLinks.length) return;
    
    clearAllHighlights();
    currentLinkIndex--;
    selectAndLoadLink(currentMenuLinks[currentLinkIndex]);
  }
  
  // Get next evidence type in sequence
  function getNextEvidenceType() {
    console.log(`🔍 Getting next evidence type for: ${currentEvidenceType}`);
    console.log(`Evidence sequence: ${EVIDENCE_SEQUENCE.join(' → ')}`);
    
    const currentIndex = EVIDENCE_SEQUENCE.indexOf(currentEvidenceType);
    console.log(`Current evidence index: ${currentIndex}`);
    
    if (currentIndex === -1) {
      console.error(`❌ Current evidence type '${currentEvidenceType}' not found in sequence!`);
      return null;
    }
    
    if (currentIndex === EVIDENCE_SEQUENCE.length - 1) {
      console.log(`🛑 At end of sequence (index ${currentIndex})`);
      return null; // At end of sequence
    }
    
    const nextType = EVIDENCE_SEQUENCE[currentIndex + 1];
    console.log(`✅ Next evidence type: ${nextType}`);
    return nextType;
  }
  
  // Get previous evidence type in sequence
  function getPreviousEvidenceType() {
    const currentIndex = EVIDENCE_SEQUENCE.indexOf(currentEvidenceType);
    if (currentIndex <= 0) {
      return null; // At start of sequence
    }
    return EVIDENCE_SEQUENCE[currentIndex - 1];
  }
  
  // Check if we're truly at the absolute end of all evidence
  function isTrulyAtEndOfAllEvidence() {
    // Must be at the last button (alerts)
    if (currentEvidenceType !== 'alerts') {
      console.log(`🔍 Not at last button. Current: ${currentEvidenceType}, Last: alerts`);
      return false;
    }
    
    // Must be at the last link in that button's menu
    if (currentLinkIndex < currentMenuLinks.length - 1) {
      console.log(`🔍 Not at last link. Current index: ${currentLinkIndex}, Last index: ${currentMenuLinks.length - 1}`);
      return false;
    }
    
    console.log('✅ Confirmed: truly at end of all evidence');
    return true;
  }
  
  // Switch to specific evidence type with auto-selection
  function switchToEvidenceType(type, position = 'first') {
    console.log(`🔄 Switching to evidence type: ${type}, position: ${position}`);
    
    // Clear current navigation state first
    console.log('🧹 Clearing current navigation state');
    clearAllHighlights();
    
    // Deselect current evidence button icon
    const currentSelectedIcon = document.querySelector('.evidence-icon.selected');
    if (currentSelectedIcon) {
      const buttonKey = currentSelectedIcon.dataset.button;
      const buttonMap = getButtonMap();
      if (buttonMap[buttonKey]) {
        currentSelectedIcon.src = buttonMap[buttonKey].default;
        currentSelectedIcon.classList.remove('selected');
      }
    }
    
    // Note: Button selection is handled by evidence-buttons.js on the icon level
    // No need to deselect button container here as selection is on .evidence-icon
    
    // Find and trigger new evidence button click to load menu
    const newIcon = document.querySelector(`[data-button="${type}"]`);
    const newButton = newIcon?.closest('.evidence-button');
    
    if (!newButton || !newIcon) {
      console.error(`❌ Evidence button not found for type: ${type}`);
      // Attempt fallback
      console.log('🔧 Attempting fallback button search');
      const fallbackButton = document.getElementById(`btn-${type}`);
      if (fallbackButton) {
        console.log('✅ Found fallback button');
        fallbackButton.click();
        setTimeout(() => {
          autoSelectLinkInNewMenu(type, position);
        }, 200);
      } else {
        console.error('❌ Fallback button search also failed');
      }
      return;
    }
    
    console.log(`✅ Found button for ${type}, triggering click`);
    // The button click will handle selection and menu loading
    newButton.click();
    
    // Wait for menu to load, then auto-select link
    setTimeout(() => {
      autoSelectLinkInNewMenu(type, position);
    }, 250); // Slightly longer timeout to ensure menu loads
  }
  
  // Auto-select link in newly loaded menu
  function autoSelectLinkInNewMenu(type, position) {
    console.log(`🎯 Auto-selecting link in ${type} at position: ${position}`);
    
    const links = document.querySelectorAll('#Evidence_Link_List a');
    currentMenuLinks = Array.from(links);
    
    if (currentMenuLinks.length === 0) {
      console.warn(`⚠️ No links found for evidence type: ${type}`);
      return;
    }
    
    console.log(`Found ${currentMenuLinks.length} links in ${type} menu`);
    
    // Determine which link to select
    if (position === 'first') {
      currentLinkIndex = 0;
    } else if (position === 'last') {
      currentLinkIndex = currentMenuLinks.length - 1;
    }
    
    console.log(`Setting currentLinkIndex to: ${currentLinkIndex}`);
    
    // Select and load the link
    selectAndLoadLink(currentMenuLinks[currentLinkIndex]);
    
    // Update navigation state
    currentEvidenceType = type;
    navigationEnabled = true;
    
    console.log(`✅ Auto-selected ${position} link in ${type}:`);
    console.log(`   Link index: ${currentLinkIndex}`);
    console.log(`   Evidence type: ${currentEvidenceType}`);
    console.log(`   Navigation enabled: ${navigationEnabled}`);
  }
  
  // Select and load a specific link
  function selectAndLoadLink(link) {
    if (!link) return;
    
    clearAllHighlights();
    link.classList.add('selected');
    link.click();
    
    // Ensure menu scrolls to keep active link visible
    scrollToActiveLink(link);
  }
  
  // Clear all link highlights in current menu
  function clearAllHighlights() {
    const allLinks = document.querySelectorAll('#Evidence_Link_List a');
    allLinks.forEach(l => l.classList.remove('selected'));
  }
  
  // Scroll menu to keep active link visible
  function scrollToActiveLink(link) {
    const container = document.getElementById('Evidence_Menu_Content');
    if (container && link) {
      // Ensure the link is visible within the menu container
      link.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }
  
  // Update current evidence type and menu links
  function updateCurrentState(type, links) {
    currentEvidenceType = type;
    currentMenuLinks = Array.from(links);
    
    // Find the currently selected link
    const selectedLinkIndex = currentMenuLinks.findIndex(link => link.classList.contains('selected'));
    
    // If no link is selected yet, default to 0 (first link)
    currentLinkIndex = selectedLinkIndex >= 0 ? selectedLinkIndex : 0;
    navigationEnabled = true;
    
    console.log(`📊 Navigation state updated:`);
    console.log(`   Evidence type: ${type}`);
    console.log(`   Total links: ${currentMenuLinks.length}`);
    console.log(`   Active index: ${currentLinkIndex}`);
    console.log(`   Selected link found: ${selectedLinkIndex >= 0 ? 'Yes' : 'No'}`);
    console.log(`   Evidence sequence position: ${EVIDENCE_SEQUENCE.indexOf(type)} of ${EVIDENCE_SEQUENCE.length - 1}`);
  }
  
  // Get button map for icon management
  function getButtonMap() {
    return {
      extras: {
        default: "assets/icons/Print.png",
        selected: "assets/icons/Print-selected.png"
      },
      denials: {
        default: "assets/icons/denial.png",
        selected: "assets/icons/denial-selected.png"
      },
      emotional: {
        default: "assets/icons/broken-heart.png",
        selected: "assets/icons/broken-heart-selected.png"
      },
      bankruptcy: {
        default: "assets/icons/bk-doc.png",
        selected: "assets/icons/bk-doc-selected.png"
      },
      triggers: {
        default: "assets/icons/addl-evidence.png",
        selected: "assets/icons/addl-evidence-selected.png"
      },
      alerts: {
        default: "assets/icons/damaging-alerts.png",
        selected: "assets/icons/damaging-alerts-selected.png"
      }
    };
  }
  
  // Show all evidence navigation arrows
  function showArrows() {
    console.log('🎯 Showing evidence navigation arrows');
    
    Object.keys(ARROW_CONFIG).forEach(id => {
      const arrow = document.getElementById(id);
      if (arrow) {
        arrow.style.setProperty('display', 'block', 'important');
        arrow.style.setProperty('visibility', 'visible', 'important');
        arrow.style.setProperty('opacity', '1', 'important');
        console.log(`✅ Arrow ${id} shown`);
      }
    });
  }
  
  // Hide all evidence navigation arrows
  function hideArrows() {
    console.log('🎯 Hiding evidence navigation arrows');
    
    Object.keys(ARROW_CONFIG).forEach(id => {
      const arrow = document.getElementById(id);
      if (arrow) {
        arrow.style.display = 'none';
        arrow.style.visibility = 'hidden';
        arrow.style.opacity = '0';
        console.log(`🧹 Arrow ${id} hidden`);
      }
    });
  }
  
  // Force show arrows with bulletproof styling
  function forceShowArrows() {
    console.log('🎯 Force showing evidence navigation arrows');
    
    Object.entries(ARROW_CONFIG).forEach(([id, config]) => {
      const arrow = document.getElementById(id);
      if (arrow) {
        // Bulletproof visibility
        arrow.style.setProperty('position', 'absolute', 'important');
        arrow.style.setProperty('left', config.x + 'px', 'important');
        arrow.style.setProperty('top', config.y + 'px', 'important');
        arrow.style.setProperty('width', config.w + 'px', 'important');
        arrow.style.setProperty('height', config.h + 'px', 'important');
        arrow.style.setProperty('display', 'block', 'important');
        arrow.style.setProperty('visibility', 'visible', 'important');
        arrow.style.setProperty('opacity', '1', 'important');
        arrow.style.setProperty('z-index', '600', 'important');
        arrow.style.setProperty('cursor', 'pointer', 'important');
        arrow.style.setProperty('pointer-events', 'auto', 'important');
        
        // Ensure correct image source
        arrow.src = config.defaultSrc;
        
        console.log(`💪 Arrow ${id} force shown at (${config.x}, ${config.y})`);
      }
    });
  }
  
  // Show initial state: group arrows enabled, single arrows disabled
  function showInitialState() {
    console.log('🎯 Showing evidence navigation initial state');
    
    Object.entries(ARROW_CONFIG).forEach(([id, config]) => {
      const arrow = document.getElementById(id);
      if (arrow) {
        // Force-visible positioning and styling
        arrow.style.setProperty('position', 'absolute', 'important');
        arrow.style.setProperty('left', config.x + 'px', 'important');
        arrow.style.setProperty('top', config.y + 'px', 'important');
        arrow.style.setProperty('width', config.w + 'px', 'important');
        arrow.style.setProperty('height', config.h + 'px', 'important');
        arrow.style.setProperty('z-index', '600', 'important');
        arrow.style.setProperty('cursor', 'pointer', 'important');
        arrow.style.setProperty('pointer-events', 'auto', 'important');
        
        // Show group arrows, hide single arrows initially
        if (id.includes('Group')) {
          arrow.style.setProperty('display', 'block', 'important');
          arrow.style.setProperty('visibility', 'visible', 'important');
          arrow.style.setProperty('opacity', '1', 'important');
        } else {
          arrow.style.setProperty('display', 'block', 'important');
          arrow.style.setProperty('visibility', 'visible', 'important');
          arrow.style.setProperty('opacity', '0.3', 'important'); // Disabled state
        }
        
        // Ensure correct image source
        arrow.src = config.defaultSrc;
        
        console.log(`🎯 Arrow ${id} set to initial state`);
      }
    });
  }

  // Show "Beginning of Evidence" message in canvas
  function showBeginningOfEvidenceMessage() {
    showCanvasMessage(
      'Beginning of Evidence',
      'You\'ve reached the first available document.'
    );
  }
  
  // Show "End of Evidence" message in canvas
  function showEndOfEvidenceMessage() {
    showCanvasMessage(
      'End of Evidence',
      'You\'ve reached the final document.'
    );
  }
  
  // Show "Content not selected" message for manual button clicks
  function showContentNotSelectedMessage() {
    showCanvasMessage(
      'Content not selected',
      'Select a document to view',
      'Choose a document from the menu to view its contents'
    );
  }
  
  // Show disabled arrow flash
  function showDisabledFlash(arrow) {
    showFlashMessage('Navigation not active', 'warning');
  }
  
  // Show message in canvas container
  function showCanvasMessage(title, subtitle, description = '') {
    const canvasContainer = document.getElementById('Evidence_Canvas_Container');
    if (!canvasContainer) return;
    
    // Clear existing content
    canvasContainer.innerHTML = '';
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      padding: 40px;
      text-align: center;
      font-family: 'Space Grotesk', sans-serif;
      color: #253541;
    `;
    
    // Title
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.cssText = `
      font-family: "jaf-bernino-sans-comp", sans-serif;
      font-weight: 800;
      font-size: 28px;
      color: #253541;
      margin: 0 0 16px 0;
      -webkit-font-smoothing: antialiased;
    `;
    
    // Subtitle
    const subtitleEl = document.createElement('p');
    subtitleEl.textContent = subtitle;
    subtitleEl.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: #253541;
      margin: 0 0 12px 0;
      opacity: 0.8;
    `;
    
    messageContainer.appendChild(titleEl);
    messageContainer.appendChild(subtitleEl);
    
    // Description (if provided)
    if (description) {
      const descEl = document.createElement('p');
      descEl.textContent = description;
      descEl.style.cssText = `
        font-size: 14px;
        font-weight: 400;
        color: #253541;
        margin: 0;
        opacity: 0.6;
        max-width: 300px;
        line-height: 1.4;
      `;
      messageContainer.appendChild(descEl);
    }
    
    canvasContainer.appendChild(messageContainer);
    
    // Ensure canvas is visible
    canvasContainer.style.display = 'block';
    canvasContainer.style.visibility = 'visible';
    canvasContainer.style.opacity = '1';
    
    console.log(`🎯 Canvas message shown: ${title}`);
  }
  
  // Show flash message for disabled states
  function showFlashMessage(message, type = 'info') {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${type === 'warning' ? '#ff6b6b' : '#4ecdc4'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 600;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: flashIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('flash-keyframes')) {
      const style = document.createElement('style');
      style.id = 'flash-keyframes';
      style.textContent = `
        @keyframes flashIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    flash.textContent = message;
    document.body.appendChild(flash);
    
    setTimeout(() => {
      flash.remove();
    }, 1500);
  }
  
  // Reset navigation state
  function resetNavigationState() {
    currentEvidenceType = '';
    currentLinkIndex = 0;
    currentMenuLinks = [];
    navigationEnabled = false;
    
    console.log('🔄 Navigation state reset');
  }
  
  // Enable navigation (called when first link is manually selected)
  function enableNavigation() {
    navigationEnabled = true;
    console.log('✅ Navigation enabled');
  }
  
  // Check if arrows are currently visible
  function areArrowsVisible() {
    const firstArrow = document.getElementById('Evidence_Nav_Left');
    if (!firstArrow) return false;
    
    const computed = window.getComputedStyle(firstArrow);
    return computed.display !== 'none' && computed.visibility !== 'hidden';
  }
  
  // Get current arrow states for debugging
  function getArrowStates() {
    const states = {};
    
    Object.keys(ARROW_CONFIG).forEach(id => {
      const arrow = document.getElementById(id);
      if (arrow) {
        const computed = window.getComputedStyle(arrow);
        states[id] = {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          zIndex: computed.zIndex,
          left: computed.left,
          top: computed.top,
          src: arrow.src
        };
      } else {
        states[id] = 'NOT_FOUND';
      }
    });
    
    return states;
  }
  
  // Public API
  return {
    init,
    showArrows,
    hideArrows,
    forceShowArrows,
    showInitialState,
    areArrowsVisible,
    getArrowStates,
    updateCurrentState,
    resetNavigationState,
    enableNavigation,
    switchToEvidenceType,
    showContentNotSelectedMessage
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  EvidenceNav.init();
});

// Make available globally for testing
window.EvidenceNav = EvidenceNav; 