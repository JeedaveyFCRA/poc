// evidence-navigation.js
// Navigation system for evidence canvas - adapts canvas navigation logic

const EvidenceNavigation = (function() {
  let currentEvidenceType = '';
  let currentLetterIndex = 0;
  let evidenceData = {};
  
  // Fixed evidence navigation sequence - matches absolute rule
  const EVIDENCE_SEQUENCE = [
    'extras',      // Additional Evidence (first)
    'denials',     // Credit Denials
    'emotional',   // Emotional Impact
    'bankruptcy',  // Bankruptcy docs
    'triggers',    // Timeline Triggers
    'alerts'       // Damaging Alerts (last)
  ];
  
  let evidenceTypes = EVIDENCE_SEQUENCE;
  
  async function init() {
    try {
      const response = await fetch('data/evidence-data.json');
      evidenceData = await response.json();
      console.log('Evidence data loaded:', evidenceTypes);
      
      // Set up event listeners for evidence type buttons
      setupEvidenceButtons();
      
      // Set up navigation arrows
      setupNavigationArrows();
      
    } catch (error) {
      console.error('Error loading evidence data:', error);
    }
  }
  
  function setupEvidenceButtons() {
    const buttons = document.querySelectorAll('.evidence-button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const evidenceType = this.dataset.button;
        setEvidenceType(evidenceType);
      });
    });
  }
  
  function setupNavigationArrows() {
    const leftArrow = document.getElementById('Evidence_Arrow_Left');
    const rightArrow = document.getElementById('Evidence_Arrow_Right');
    
    if (leftArrow) {
      leftArrow.addEventListener('click', navigatePrevious);
    }
    if (rightArrow) {
      rightArrow.addEventListener('click', navigateNext);
    }
  }
  
  function setEvidenceType(type, fromLinkClick = false) {
    console.log('Setting evidence type:', type);
    
    // Only show heading if this is from a link click
    const headingContainer = document.getElementById('Evidence_Heading_Container');
    if (headingContainer) {
      headingContainer.style.display = fromLinkClick ? 'flex' : 'none';
    }
    
    // Update active button
    const buttons = document.querySelectorAll('.evidence-button');
    buttons.forEach(button => {
      if (button.dataset.button === type) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Update current type and reset index
    currentEvidenceType = type;
    currentLetterIndex = 0;
    
    // Show first evidence for this type
    showCurrentEvidence();
    
    // Update navigation visibility only if from link click
    if (fromLinkClick) {
      updateNavigationVisibility();
    } else {
      // Hide navigation when not from link click
      const arrows = ['Evidence_Arrow_Left', 'Evidence_Arrow_Right', 
                     'Evidence_Arrow_Group_Left', 'Evidence_Arrow_Group_Right'];
      arrows.forEach(id => {
        const arrow = document.getElementById(id);
        if (arrow) {
          arrow.style.display = 'none';
          arrow.style.visibility = 'hidden';
        }
      });
    }
  }
  
  function showCurrentEvidence() {
    if (!currentEvidenceType || !evidenceData[currentEvidenceType]) {
      console.error('No evidence type selected or invalid type');
      return;
    }
    
    const typeData = evidenceData[currentEvidenceType];
    if (!typeData.letters || !typeData.letters[currentLetterIndex]) {
      console.error('No letter data found for current index');
      return;
    }
    
    const letter = typeData.letters[currentLetterIndex];
    
    // Update letter display
    const letterDisplay = document.getElementById('Evidence_Letter_Display');
    if (letterDisplay) {
      letterDisplay.textContent = String.fromCharCode(65 + currentLetterIndex);
      letterDisplay.style.display = 'block';
    }
    
    // Show evidence content
    if (typeof EvidenceActual !== 'undefined') {
      EvidenceActual.showDocument(letter.id);
    }
    
    // Show matters box
    if (typeof showMattersBox === 'function') {
      showMattersBox(letter.id);
    }
  }
  
  function navigateNext() {
    if (!currentEvidenceType || !evidenceData[currentEvidenceType]) return;
    
    const typeData = evidenceData[currentEvidenceType];
    if (currentLetterIndex < typeData.letters.length - 1) {
      currentLetterIndex++;
      showCurrentEvidence();
      updateNavigationVisibility();
    } else if (currentLetterIndex === typeData.letters.length - 1) {
      // At the end of current type, move to next type if available
      const currentTypeIndex = evidenceTypes.indexOf(currentEvidenceType);
      if (currentTypeIndex < evidenceTypes.length - 1) {
        setEvidenceType(evidenceTypes[currentTypeIndex + 1]);
      } else {
        // At the end of all evidence - wrap around to the first type
        console.log('🔄 Reached end of all evidence - wrapping around to first type');
        setEvidenceType(evidenceTypes[0]);
      }
    }
  }
  
  function navigatePrevious() {
    if (!currentEvidenceType || !evidenceData[currentEvidenceType]) return;
    
    if (currentLetterIndex > 0) {
      currentLetterIndex--;
      showCurrentEvidence();
      updateNavigationVisibility();
    } else if (currentLetterIndex === 0) {
      // At the start of current type, move to previous type if available
      const currentTypeIndex = evidenceTypes.indexOf(currentEvidenceType);
      if (currentTypeIndex > 0) {
        const prevType = evidenceTypes[currentTypeIndex - 1];
        setEvidenceType(prevType);
        // Move to last letter of previous type
        currentLetterIndex = evidenceData[prevType].letters.length - 1;
        showCurrentEvidence();
        updateNavigationVisibility();
      } else {
        // At the beginning of all evidence - wrap around to the last type
        console.log('🔄 Reached beginning of all evidence - wrapping around to last type');
        const lastType = evidenceTypes[evidenceTypes.length - 1];
        setEvidenceType(lastType);
        // Move to last letter of last type
        currentLetterIndex = evidenceData[lastType].letters.length - 1;
        showCurrentEvidence();
        updateNavigationVisibility();
      }
    }
  }
  
  function updateNavigationVisibility() {
    const leftArrow = document.getElementById('Evidence_Arrow_Left');
    const rightArrow = document.getElementById('Evidence_Arrow_Right');
    const leftGroup = document.getElementById('Evidence_Arrow_Group_Left');
    const rightGroup = document.getElementById('Evidence_Arrow_Group_Right');
    
    if (!currentEvidenceType || !evidenceData[currentEvidenceType]) {
      if (leftArrow) {
        leftArrow.style.display = 'none';
        leftArrow.style.visibility = 'hidden';
      }
      if (rightArrow) {
        rightArrow.style.display = 'none';
        rightArrow.style.visibility = 'hidden';
      }
      if (leftGroup) {
        leftGroup.style.display = 'none';
        leftGroup.style.visibility = 'hidden';
      }
      if (rightGroup) {
        rightGroup.style.display = 'none';
        rightGroup.style.visibility = 'hidden';
      }
      return;
    }
    
    const typeData = evidenceData[currentEvidenceType];
    const currentTypeIndex = evidenceTypes.indexOf(currentEvidenceType);
    
    // Show/hide left arrow
    if (leftArrow && leftGroup) {
      const canGoLeft = currentLetterIndex > 0 || currentTypeIndex > 0;
      leftArrow.style.display = canGoLeft ? 'block' : 'none';
      leftArrow.style.visibility = canGoLeft ? 'visible' : 'hidden';
      leftGroup.style.display = canGoLeft ? 'block' : 'none';
      leftGroup.style.visibility = canGoLeft ? 'visible' : 'hidden';
    }
    
    // Show/hide right arrow
    if (rightArrow && rightGroup) {
      const canGoRight = currentLetterIndex < typeData.letters.length - 1 || 
                        currentTypeIndex < evidenceTypes.length - 1;
      rightArrow.style.display = canGoRight ? 'block' : 'none';
      rightArrow.style.visibility = canGoRight ? 'visible' : 'hidden';
      rightGroup.style.display = canGoRight ? 'block' : 'none';
      rightGroup.style.visibility = canGoRight ? 'visible' : 'hidden';
    }
  }
  
  // Show navigation arrows when evidence is displayed
  function showNavigation() {
    console.log('🎯 EvidenceNavigation.showNavigation() called');
    
    // Force show the Evidence_Heading_Container (parent of arrows)
    const headingContainer = document.getElementById('Evidence_Heading_Container');
    if (headingContainer) {
      headingContainer.style.setProperty('display', 'block', 'important');
      headingContainer.style.setProperty('visibility', 'visible', 'important');
      headingContainer.style.setProperty('opacity', '1', 'important');
      headingContainer.style.setProperty('z-index', '400', 'important');
      
      console.log('✅ Evidence_Heading_Container made visible');
    }
    
    // Force show all navigation arrows
    const arrows = {
      'Evidence_Arrow_Group_Left': { x: 1150, y: 42, w: 50, h: 32 },
      'Evidence_Arrow_Left': { x: 1118, y: 42, w: 32, h: 32 },
      'Evidence_Arrow_Group_Right': { x: 1820, y: 42, w: 50, h: 32 },
      'Evidence_Arrow_Right': { x: 1870, y: 42, w: 32, h: 32 }
    };

    Object.entries(arrows).forEach(([id, config]) => {
      const arrow = document.getElementById(id);
      if (arrow) {
        arrow.style.setProperty('left', config.x + 'px', 'important');
        arrow.style.setProperty('top', config.y + 'px', 'important');
        arrow.style.setProperty('width', config.w + 'px', 'important');
        arrow.style.setProperty('height', config.h + 'px', 'important');
        arrow.style.setProperty('display', 'block', 'important');
        arrow.style.setProperty('visibility', 'visible', 'important');
        arrow.style.setProperty('opacity', '1', 'important');
        arrow.style.setProperty('z-index', '500', 'important');
        arrow.style.setProperty('cursor', 'pointer', 'important');
        arrow.style.setProperty('position', 'absolute', 'important');
        arrow.style.setProperty('pointer-events', 'auto', 'important');
        
        console.log(`✅ Arrow ${id} made visible`);
      } else {
        console.warn(`⚠️ Arrow ${id} not found`);
      }
    });
    
    console.log('🎯 Navigation arrows should now be visible');
  }

  // Public API
  return {
    init,
    setEvidenceType,
    navigateNext,
    navigatePrevious,
    showNavigation
  };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  EvidenceNavigation.init();
});