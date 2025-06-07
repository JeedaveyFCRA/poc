// canvas-view.js
// Violation Overlay System Implementation

const CanvasView = (function() {
  'use strict';

  // Track active violations across all pages
  let activeViolations = new Set();
  let currentViolations = [];
  let globalViolationState = new Map(); // Store violations for all pages of current report

  // Clear active violations on initialization
  function clearViolations() {
    activeViolations.clear();
    localStorage.removeItem('activeViolations');
    
    // Reset all violation overlays to unselected state
    document.querySelectorAll('.violation-overlay').forEach(overlay => {
      overlay.classList.remove('active');
      overlay.dataset.checked = 'false';
    });
    
    // Reset violation count
    const countElement = document.getElementById('violation-count');
    if (countElement) {
      countElement.textContent = '0';
    }
  }
  
  // Save state management
  const AUTOSAVE_KEY = 'fcra_violation_autosave';
  const SAVED_STATES_KEY = 'fcra_violation_saved_states';
  
  function loadFromLocalStorage() {
    try {
      // Load autosaved state
      const autosaved = localStorage.getItem(AUTOSAVE_KEY);
      if (autosaved) {
        const state = JSON.parse(autosaved);
        
        // Clear existing state
        activeViolations.clear();
        globalViolationState.clear();
        
        // Restore active violations
        state.activeViolations.forEach(key => activeViolations.add(key));
        
        // Restore global state
        state.globalState.forEach(([reportId, pages]) => {
          const pageMap = new Map();
          pages.forEach(([filename, violations]) => {
            pageMap.set(filename, violations);
          });
          globalViolationState.set(reportId, pageMap);
        });
        
        console.log('Restored state from localStorage:', {
          activeViolations: Array.from(activeViolations),
          globalState: globalViolationState
        });
      }
      
      // Update counter immediately after loading
      updateViolationCount();
    } catch (error) {
      console.error('Error loading saved state:', error);
      // If there's an error, clear the corrupted state
      activeViolations.clear();
      globalViolationState.clear();
    }
  }

  function saveToLocalStorage() {
    try {
      // Autosave current state
      const state = {
        activeViolations: Array.from(activeViolations),
        globalState: Array.from(globalViolationState.entries()).map(([k, v]) => [k, Array.from(v.entries())])
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Save current state with a name
  function saveNamedState(name) {
    try {
      const savedStates = JSON.parse(localStorage.getItem(SAVED_STATES_KEY) || '{}');
      savedStates[name] = {
        timestamp: new Date().toISOString(),
        state: {
          activeViolations: Array.from(activeViolations),
          globalState: Array.from(globalViolationState.entries()).map(([k, v]) => [k, Array.from(v.entries())])
        }
      };
      localStorage.setItem(SAVED_STATES_KEY, JSON.stringify(savedStates));
      return true;
    } catch (error) {
      console.error('Error saving named state:', error);
      return false;
    }
  }

  // Load a previously saved state
  function loadNamedState(name) {
    try {
      const savedStates = JSON.parse(localStorage.getItem(SAVED_STATES_KEY) || '{}');
      const saved = savedStates[name];
      if (saved) {
        // Clear existing state
        activeViolations.clear();
        globalViolationState.clear();
        
        // Restore active violations
        saved.state.activeViolations.forEach(key => activeViolations.add(key));
        
        // Restore global state
        saved.state.globalState.forEach(([k, v]) => {
          const pageMap = new Map();
          v.forEach(([filename, violations]) => {
            pageMap.set(filename, violations);
          });
          globalViolationState.set(k, pageMap);
        });
        
        // Get current filename and update overlays
        const params = new URLSearchParams(window.location.search);
        const filename = params.get('file');
        if (filename) {
          // Clear and recreate overlays with correct state
          const container = document.getElementById('Violation_Overlay_Container');
          if (container) {
            container.innerHTML = '';
            
            // Load violations for current page
            loadViolationsFromCSV(filename).then(violations => {
              violations.forEach(violation => {
                const overlay = createViolationOverlay(violation);
                container.appendChild(overlay);
                
                // Check if this violation should be active
                const reportId = getReportIdentifier(filename);
                const violationKey = `${reportId}-${violation.id}`;
                if (activeViolations.has(violationKey)) {
                  overlay.classList.add('active');
                  overlay.dataset.checked = 'true';
                }
              });
            });
          }
        }
        
        // Update the violation count
        updateViolationCount();
        
        // Update FCRA Review text if available
        if (typeof FCRAReviewText !== 'undefined') {
          const reportId = getReportIdentifier(filename);
          if (globalViolationState.has(reportId)) {
            const allReportViolations = [];
            for (const [pageFilename, violations] of globalViolationState.get(reportId)) {
              allReportViolations.push(...violations);
            }
            FCRAReviewText.updateReviewText(allReportViolations);
            
            // Restore active states in FCRA Review text
            allReportViolations.forEach(violation => {
              const violationKey = `${reportId}-${violation.id}`;
              if (activeViolations.has(violationKey)) {
                FCRAReviewText.toggleViolationEntry(violation.id, true);
              }
            });
          }
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading named state:', error);
      return false;
    }
  }

  // Get list of saved states
  function getSavedStates() {
    try {
      const savedStates = JSON.parse(localStorage.getItem(SAVED_STATES_KEY) || '{}');
      return Object.entries(savedStates).map(([name, data]) => ({
        name,
        timestamp: new Date(data.timestamp)
      }));
    } catch (error) {
      console.error('Error getting saved states:', error);
      return [];
    }
  }

  function getReportIdentifier(filename) {
    // Extract report identifier from filename (e.g., "AL-EQ-2024-04-25" from "AL-EQ-2024-04-25-P57.png")
    const match = filename.match(/(.+)-P\d+/);
    return match ? match[1] : filename;
  }

  function generateConsistentViolationId(violation, filename) {
    // Create a consistent ID based on the violation's properties
    const coordinates = `${violation.x}-${violation.y}-${violation.width}-${violation.height}`;
    const pageNum = filename.match(/-P(\d+)/)[1];
    return `v-${pageNum}-${coordinates}`;
  }

  // Get current violation states for preservation
  function getViolationStates() {
    return {
      activeViolations: Array.from(activeViolations),
      globalState: Array.from(globalViolationState.entries())
    };
  }

  // Restore violation states
  function restoreViolationStates(states) {
    if (!states) return;
    
    activeViolations = new Set(states.activeViolations);
    globalViolationState = new Map(states.globalState);
  }

  async function loadViolationsFromCSV(filename) {
    try {
      const response = await fetch('data/overlays/ExportedViolations.csv');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const csvText = await response.text();
      const rows = csvText.split('\n').slice(1); // Skip header row
      
      // Get report identifier for current page
      const reportId = getReportIdentifier(filename);
      
      // First, load all violations for all pages of this report
      const allReportViolations = rows
        .filter(row => row.trim().length > 0) // Skip empty rows
        .filter(row => {
          const cols = row.split(',');
          const pageReportId = getReportIdentifier(cols[0]);
          return pageReportId === reportId;
        })
        .map(row => {
          const [image, severity, label, codes, x, y, width, height] = row.split(',');
          return {
            filename: image,
            violation: {
              id: generateConsistentViolationId({ x, y, width, height }, image),
              severity: severity.toLowerCase(),
              label,
              codes: codes.split(';').map(code => code.trim()),
              x: parseInt(x),
              y: parseInt(y),
              width: parseInt(width),
              height: parseInt(height)
            }
          };
        });
      
      // Group violations by page
      const violationsByPage = new Map();
      allReportViolations.forEach(({filename: pageFilename, violation}) => {
        if (!violationsByPage.has(pageFilename)) {
          violationsByPage.set(pageFilename, []);
        }
        violationsByPage.get(pageFilename).push(violation);
      });
      
      // Store all pages in global state
      if (!globalViolationState.has(reportId)) {
        globalViolationState.set(reportId, new Map());
      }
      violationsByPage.forEach((violations, pageFilename) => {
        globalViolationState.get(reportId).set(pageFilename, violations);
      });
      
      // Get violations for current page
      currentViolations = violationsByPage.get(filename) || [];
      
      console.log(`Loaded ${currentViolations.length} violations for current page ${filename}`);
      console.log(`Total violations across all pages: ${allReportViolations.length}`);
      
      // Update FCRA Review text if available
      if (typeof FCRAReviewText !== 'undefined') {
        // Use all violations from all pages for the FCRA review
        const allViolations = allReportViolations.map(({violation}) => violation);
        FCRAReviewText.updateReviewText(allViolations);
        
        // Restore active states in FCRA Review text
        allViolations.forEach(violation => {
          const violationKey = `${reportId}-${violation.id}`;
          if (activeViolations.has(violationKey)) {
            FCRAReviewText.toggleViolationEntry(violation.id, true);
          }
        });
      }

      // Create and update overlay visuals for current page
      const container = document.getElementById('Violation_Overlay_Container');
      if (container) {
        container.innerHTML = ''; // Clear existing overlays
        
        currentViolations.forEach(violation => {
          const overlay = createViolationOverlay(violation);
          container.appendChild(overlay);
          
          // Check if this violation should be active and update visual state
          const violationKey = `${reportId}-${violation.id}`;
          if (activeViolations.has(violationKey)) {
            overlay.classList.add('active');
            overlay.dataset.checked = 'true';
          }
        });
      }
      
      // Update violation count after restoring states
      updateViolationCount();
      
      return currentViolations;
    } catch (error) {
      console.error('Error loading violations CSV:', error);
      return [];
    }
  }

  function getSeverityStyle(severity) {
    switch (severity.toLowerCase()) {
      case 'high':
        return {
          color: '#ff0000',
          width: '4px'
        };
      case 'medium':
        return {
          color: '#ffa500',
          width: '3px'
        };
      case 'low':
        return {
          color: '#ffff00',
          width: '2px'
        };
      default:
        return {
          color: '#ffff00',
          width: '2px'
        };
    }
  }

  function createViolationOverlay(violation) {
    const overlay = document.createElement('div');
    overlay.className = 'violation-overlay';
    overlay.id = `violation-${violation.id}`;
    overlay.dataset.violationId = violation.id;
    overlay.dataset.violationCode = violation.codes.join('; ');
    overlay.dataset.severity = violation.severity;
    
    // Always start unselected
    overlay.dataset.checked = 'false';
    
    // Set positioning
    overlay.style.top = `${violation.y}px`;
    overlay.style.left = `${violation.x}px`;
    overlay.style.width = `${violation.width}px`;
    overlay.style.height = `${violation.height}px`;

    // Add click handler
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleViolationOverlay(violation.id);
    });

    return overlay;
  }

  function toggleViolationOverlay(violationId) {
    console.log('Toggling violation overlay:', violationId);
    
    // Get current filename from URL
    const params = new URLSearchParams(window.location.search);
    const filename = params.get('file');
    if (!filename) {
      console.error('No filename found in URL');
      return;
    }
    
    // Get report identifier
    const reportId = getReportIdentifier(filename);
    const violationKey = `${reportId}-${violationId}`;
    
    // Toggle active state
    const isNowActive = !activeViolations.has(violationKey);
    if (isNowActive) {
      activeViolations.add(violationKey);
    } else {
      activeViolations.delete(violationKey);
    }
    
    // Update overlay appearance
    const overlay = document.querySelector(`[data-violation-id="${violationId}"]`);
    if (overlay) {
      if (isNowActive) {
        overlay.classList.add('active');
        overlay.dataset.checked = 'true';
      } else {
        overlay.classList.remove('active');
        overlay.dataset.checked = 'false';
      }
    }
    
    // Update violation count
    updateViolationCount();
    
    // Update FCRA Review text if available
    if (typeof FCRAReviewText !== 'undefined') {
      FCRAReviewText.toggleViolationEntry(violationId, isNowActive);
    }
    
    // Show FCRA Review popup
    const fcraPopup = document.getElementById('FCRA_Popup');
    if (fcraPopup) {
      fcraPopup.style.display = 'block';
      fcraPopup.style.visibility = 'visible';
      fcraPopup.style.zIndex = '15';
    }
    
    // Show violation counter
    const countElement = document.getElementById('violation-count');
    if (countElement) {
      countElement.style.display = 'block';
      countElement.style.visibility = 'visible';
    }
    
    // Hide evidence menu and matters box if visible
    const evidenceMenu = document.getElementById('Evidence_Menu_Container');
    const mattersBox = document.getElementById('Matters_Box');
    
    if (evidenceMenu) {
      evidenceMenu.style.display = 'none';
      evidenceMenu.style.visibility = 'hidden';
    }
    if (mattersBox) {
      mattersBox.style.display = 'none';
      mattersBox.style.visibility = 'hidden';
    }
    
    // Update UI state
    if (typeof setUIState === 'function') {
      setUIState('state-default');
    }
    
    // Save state
    saveToLocalStorage();

    // Dispatch violation state change event to update systemwide counters
    document.dispatchEvent(new CustomEvent('violationStateChanged'));
  }

  function updateViolationCount() {
    const countElement = document.getElementById('violation-count');
    const pageCountElement = document.getElementById('page-count');
    
    // Get current filename from URL
    const params = new URLSearchParams(window.location.search);
    const filename = params.get('file');
    const reportId = getReportIdentifier(filename);
    
    // Count active violations for this report across all pages
    let totalViolations = 0;
    
    // Get all pages for this report from globalViolationState
    if (globalViolationState.has(reportId)) {
      const reportPages = globalViolationState.get(reportId);
      
      // Iterate through all pages in this report
      for (const [pageFilename, violations] of reportPages) {
        violations.forEach(violation => {
          const violationKey = `${reportId}-${violation.id}`;
          if (activeViolations.has(violationKey)) {
            totalViolations++;
          }
        });
      }
    }
    
    // Update both the main violation counter and page counter with the total
    if (countElement) {
      countElement.textContent = totalViolations.toString();
      countElement.style.display = 'block';
      countElement.style.visibility = 'visible';
    }
    
    if (pageCountElement) {
      pageCountElement.textContent = totalViolations.toString();
      pageCountElement.style.display = 'block';
      pageCountElement.style.visibility = 'visible';
    }
    
    // Update FCRA Review text if available
    if (typeof FCRAReviewText !== 'undefined') {
      // Get all violations for this report
      const allReportViolations = [];
      if (globalViolationState.has(reportId)) {
        for (const [pageFilename, violations] of globalViolationState.get(reportId)) {
          allReportViolations.push(...violations);
        }
      }
      
      // Update FCRA Review text with all violations, maintaining active states
      FCRAReviewText.updateReviewText(allReportViolations);
      
      // Restore active states
      allReportViolations.forEach(violation => {
        const violationKey = `${reportId}-${violation.id}`;
        if (activeViolations.has(violationKey)) {
          FCRAReviewText.toggleViolationEntry(violation.id, true);
        }
      });
    }
  }

  function clearViolationOverlays(preserveStates = false) {
    const container = document.getElementById('Violation_Overlay_Container');
    if (container) {
      container.innerHTML = '';
      if (!preserveStates) {
        // Only clear states if not preserving them
        activeViolations.clear();
        globalViolationState.clear();
      }
      currentViolations = [];
      updateViolationCount();
      
      // Clear FCRA Review text if available
      if (typeof FCRAReviewText !== 'undefined') {
        FCRAReviewText.updateReviewText([]);
      }
    }
  }

  // Initialize with localStorage loading
  function initialize(preservedStates = null) {
    console.log('Initializing CanvasView...');
    
    // Ensure DOM is ready before proceeding
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => initialize(preservedStates));
      return;
    }
    
    // Clear all violations first
    clearViolations();
    
    if (preservedStates) {
      console.log('Restoring from preserved states:', preservedStates);
      restoreViolationStates(preservedStates);
    } else {
      console.log('Loading from localStorage...');
      loadFromLocalStorage();
    }
    
    // Initialize overlays after state is restored
    initializeViolationOverlays();
  }

  // Delete a saved state
  function deleteNamedState(name) {
    try {
      const savedStates = JSON.parse(localStorage.getItem(SAVED_STATES_KEY) || '{}');
      if (savedStates[name]) {
        delete savedStates[name];
        localStorage.setItem(SAVED_STATES_KEY, JSON.stringify(savedStates));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting state:', error);
      return false;
    }
  }

  function initializeViolationOverlays(preservedStates = null) {
    console.log('Initializing violation overlays');
    
    // Get current filename from URL before clearing
    const params = new URLSearchParams(window.location.search);
    const filename = params.get('file');
    if (!filename) {
      console.error('No filename in URL');
      return;
    }
    
    const reportId = getReportIdentifier(filename);
    
    // Clear only the visual overlays, not the state
    let container = document.getElementById('Violation_Overlay_Container');
    if (container) {
      container.innerHTML = '';
    } else {
      // Create container if it doesn't exist
      container = document.createElement('div');
      container.id = 'Violation_Overlay_Container';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      
      const canvasContainer = document.getElementById('Image_Canvas_Container');
      if (canvasContainer) {
        canvasContainer.appendChild(container);
      } else {
        console.error('Image_Canvas_Container not found');
        return;
      }
    }

    // Initialize FCRA Review text if available
    if (typeof FCRAReviewText !== 'undefined') {
      FCRAReviewText.initialize();
    }

    // Load and create overlays from CSV
    loadViolationsFromCSV(filename).then(violations => {
      // Ensure we have violations to display
      if (!violations || violations.length === 0) {
        console.log('No violations found for:', filename);
        return;
      }

      console.log(`Creating ${violations.length} violation overlays`);
      
      // Clear existing overlays
      container.innerHTML = '';
      
      // Create overlays and restore their states
      violations.forEach(violation => {
        const overlay = createViolationOverlay(violation);
        container.appendChild(overlay);
        
        // Check if this violation should be active
        const violationKey = `${reportId}-${violation.id}`;
        if (activeViolations.has(violationKey)) {
          overlay.classList.add('active');
          overlay.dataset.checked = 'true';
        }
      });
      
      // Update the violation count after creating all overlays
      updateViolationCount();
      
      // Log the current state for debugging
      console.log('Current active violations:', Array.from(activeViolations));
      console.log('Total overlays created:', violations.length);
    });
  }

  // Add page counter update function
  function updatePageCount() {
    const pageCountElement = document.getElementById('page-count');
    if (pageCountElement) {
      // Get current filename from URL
      const params = new URLSearchParams(window.location.search);
      const filename = params.get('file');
      const reportId = getReportIdentifier(filename);
      const currentPage = filename;  // Current page is the current filename

      // Count violations for current page
      let pageViolationCount = 0;
      if (globalViolationState.has(reportId)) {
        const pageViolations = globalViolationState.get(reportId).get(currentPage) || [];
        pageViolationCount = pageViolations.filter(v => {
          const violationKey = `${reportId}-${v.id}`;
          return activeViolations.has(violationKey);
        }).length;
      }
      
      pageCountElement.textContent = pageViolationCount.toString();
    }
  }

  // Public API
  return {
    initialize,
    clear: clearViolationOverlays,
    toggle: toggleViolationOverlay,
    updateCount: updateViolationCount,
    loadViolations: loadViolationsFromCSV,
    getViolationStates,
    saveState: saveNamedState,
    loadState: loadNamedState,
    deleteState: deleteNamedState,
    getSavedStates,
    getReportIdentifier
  };
})();

// Make CanvasView globally available
window.CanvasView = CanvasView;

// Load saved state when the script loads
document.addEventListener('DOMContentLoaded', () => {
  CanvasView.initialize();
  // Force a reload to ensure fresh state
  if (!window.location.hash) {
    window.location.hash = 'reload';
    window.location.reload();
  } else {
    window.location.hash = '';
  }
});

