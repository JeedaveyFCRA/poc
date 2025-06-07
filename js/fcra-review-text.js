// FCRA Review Text Module
const FCRAReviewText = (function() {
  'use strict';

  let observer = null; // Store observer reference
  let isEvidenceMode = false; // Track if we're in evidence mode

  function getDescriptionFromLabel(label) {
    if (label.includes('INCLUDED_IN_CHAPTER_13')) {
      return 'Account misreported as active in Chapter 13 after discharge';
    }
    if (label.includes('Reported Balance')) {
      return 'Reported $0 balance misleads after bankruptcy discharge';
    }
    if (label.includes('Balance')) {
      return 'False or blank balance misreported after discharge';
    }
    if (label.includes('Available')) {
      return 'Available credit field missing or inaccurately reported';
    }
    if (label.includes('High')) {
      return 'High credit amount missing or not accurately reflected';
    }
    if (label.includes('Limit')) {
      return 'Credit limit field is blank, missing, or incorrect';
    }
    if (label.includes('Date Reported')) {
      return 'Outdated "Date Reported" predates post-discharge window';
    }
    if (label.includes('Chapter')) {
      return 'Misleading bankruptcy label after discharge — suggests ongoing or active case';
    }
    if (label.includes('Completed')) {
      return 'Ambiguous bankruptcy status — fails to state "Discharged," creating confusion';
    }
    return label; // Fallback to original label if no match
  }

  function createViolationEntry(violation) {
    const entry = document.createElement('div');
    entry.className = 'violation-entry';
    entry.id = `fcra-review-${violation.id}`;

    // Create severity bar
    const severityBar = document.createElement('div');
    severityBar.className = 'severity-bar';
    severityBar.setAttribute('data-severity', violation.severity.toLowerCase());

    // Create FCRA codes element
    const codes = document.createElement('div');
    codes.className = 'fcra-codes';
    const formattedCodes = violation.codes.map(code => code.trim()).join('; ');
    codes.textContent = `x  ${formattedCodes}`;

    // Add elements to entry to measure text width
    entry.appendChild(severityBar);
    entry.appendChild(codes);
    document.body.appendChild(entry);

    // Calculate width based on text content
    const textWidth = codes.offsetWidth;
    severityBar.style.width = `${textWidth + 8}px`; // Add 8px padding

    // Move entry back to its proper container
    document.body.removeChild(entry);

    // Create description
    const description = document.createElement('div');
    description.className = 'violation-description';
    description.textContent = getDescriptionFromLabel(violation.label);

    // Add description to entry
    entry.appendChild(description);

    return entry;
  }

  function updateReviewText(violations) {
    const container = document.getElementById('fcra-review-text');
    if (!container) {
      console.error('FCRA Review text container not found');
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Add each violation entry as inactive by default
    violations.forEach(violation => {
      const entry = createViolationEntry(violation);
      entry.classList.add('inactive'); // Start as inactive
      container.appendChild(entry);
    });
  }

  function toggleViolationEntry(violationId, isActive) {
    const entry = document.getElementById(`fcra-review-${violationId}`);
    if (entry) {
      if (isActive) {
        entry.classList.remove('inactive');
      } else {
        entry.classList.add('inactive');
      }
    }

    // Always show FCRA popup when toggling violations
    const fcraPopup = document.getElementById('FCRA_Popup');
    if (fcraPopup) {
      fcraPopup.style.display = 'block';
      fcraPopup.style.visibility = 'visible';
      fcraPopup.style.zIndex = '15';
    }
  }

  function setEvidenceMode(enabled) {
    isEvidenceMode = enabled;
    // Don't hide FCRA popup when entering evidence mode
    // Let the violation overlay control handle this
  }

  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function initialize() {
    // Cleanup any existing observer
    cleanup();
    
    // Create container if it doesn't exist
    let container = document.getElementById('fcra-review-text');
    if (!container) {
      container = document.createElement('div');
      container.id = 'fcra-review-text';
      
      const fcraPopup = document.getElementById('FCRA_Popup');
      if (fcraPopup) {
        fcraPopup.appendChild(container);
        // Show FCRA popup by default
        fcraPopup.style.display = 'block';
        fcraPopup.style.visibility = 'visible';
        fcraPopup.style.zIndex = '15';
      } else {
        console.error('FCRA_Popup container not found');
        return;
      }
    }

    // Set visibility based on FCRA_Popup visibility
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const fcraPopup = document.getElementById('FCRA_Popup');
          if (fcraPopup) {
            container.style.display = fcraPopup.style.display;
          }
        }
      });
    });

    const fcraPopup = document.getElementById('FCRA_Popup');
    if (fcraPopup) {
      observer.observe(fcraPopup, { attributes: true });
    }
  }

  // Public API
  return {
    initialize,
    updateReviewText,
    toggleViolationEntry,
    setEvidenceMode,
    cleanup
  };
})();

// Cleanup on page unload (using beforeunload instead of deprecated unload)
window.addEventListener('beforeunload', () => {
  FCRAReviewText.cleanup();
});

// Make globally available
window.FCRAReviewText = FCRAReviewText; 