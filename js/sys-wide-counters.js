// sys-wide-counters.js
// Handles systemwide violation counter logic

const SysWideCounters = (function() {
  'use strict';

  function resetAllCounters() {
    const counterIds = [
      'creditor-severe-count',
      'creditor-serious-count',
      'creditor-minor-count',
      'creditor-total-count',
      'bureau-count',
      'systemwide-severe-count',
      'systemwide-serious-count',
      'systemwide-minor-count',
      'systemwide-total-count',
      'bureau-severe-count',
      'bureau-serious-count',
      'bureau-minor-count',
      'bureau-total-count'
    ];
    
    counterIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = '0';
      }
    });
  }

  function initialize() {
    // Reset all counters first
    resetAllCounters();
    
    // Wait for CanvasView to be ready
    if (!window.CanvasView) {
      console.log('Waiting for CanvasView...');
      setTimeout(initialize, 100);
      return;
    }

    console.log('Initializing SysWideCounters...');
    
    // Initial update of counters
    updateAllCounters();
    
    // Listen for violation state changes
    document.addEventListener('violationStateChanged', () => {
      console.log('Violation state changed, updating counters...');
      updateAllCounters();
    });
  }

  function getCreditorFromFilename(filename) {
    const match = filename.match(/^([A-Z]+)-/);
    return match ? match[1] : null;
  }

  function getBureauFromFilename(filename) {
    const match = filename.match(/-([A-Z]+)-/);
    return match ? match[1] : null;
  }

  function getDateFromFilename(filename) {
    const match = filename.match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : null;
  }

  function updateAllCounters() {
    try {
      const params = new URLSearchParams(window.location.search);
      const filename = params.get('file');
      if (!filename || !window.CanvasView) {
        console.log('No filename or CanvasView not available');
        return;
      }

      // Get states from CanvasView
      const states = window.CanvasView.getViolationStates();
      if (!states) {
        console.log('No violation states available');
        return;
      }

      const reportId = window.CanvasView.getReportIdentifier(filename);
      const activeViolations = new Set(states.activeViolations);
      const globalState = new Map(states.globalState);

      // Get all violations for this report
      const allViolations = [];
      const reportMap = globalState.get(reportId);
      if (reportMap) {
        for (const [pageFilename, violations] of reportMap) {
          violations.forEach(v => {
            if (activeViolations.has(`${reportId}-${v.id}`)) {
              allViolations.push({
                ...v,
                bureau: getBureauFromFilename(pageFilename),
                creditor: getCreditorFromFilename(pageFilename)
              });
            }
          });
        }
      }

      console.log('Updating counters with violations:', allViolations);

      // Update all counter sections
      updateCreditorLevelCounts(allViolations);
      updateSystemwideCounts(allViolations);
      updateBureauCounts(allViolations);
    } catch (error) {
      console.error('Error updating counters:', error);
    }
  }

  function updateCreditorLevelCounts(violations) {
    try {
      const elements = {
        severe: document.getElementById('creditor-severe-count'),
        serious: document.getElementById('creditor-serious-count'),
        minor: document.getElementById('creditor-minor-count'),
        total: document.getElementById('creditor-total-count'),
        bureauCount: document.getElementById('bureau-count')
      };

      // Validate all required elements exist
      const missingElements = Object.entries(elements)
        .filter(([key, el]) => !el)
        .map(([key]) => key);

      if (missingElements.length > 0) {
        throw new Error(`Missing counter elements: ${missingElements.join(', ')}`);
      }

      const severityCounts = { severe: 0, serious: 0, minor: 0 };
      const currentCreditor = getCreditorFromFilename(window.location.search.split('file=')[1]);
      
      if (!currentCreditor) {
        throw new Error('Could not determine current creditor from filename');
      }
      
      // Count violations for current creditor
      violations.forEach(v => {
        if (v.creditor === currentCreditor && v.severity) {
          severityCounts[v.severity.toLowerCase()]++;
        }
      });

      // Update the counters
      elements.severe.textContent = severityCounts.severe;
      elements.serious.textContent = severityCounts.serious;
      elements.minor.textContent = severityCounts.minor;
      
      // Count unique bureaus for this creditor
      const uniqueBureaus = new Set(
        violations
          .filter(v => v.creditor === currentCreditor)
          .map(v => v.bureau)
          .filter(Boolean)
      );
      elements.bureauCount.textContent = uniqueBureaus.size;
      
      // Total creditor violations
      const totalCreditorViolations = severityCounts.severe + severityCounts.serious + severityCounts.minor;
      elements.total.textContent = totalCreditorViolations;
    } catch (error) {
      console.error('Error updating creditor level counts:', error);
    }
  }

  function updateSystemwideCounts(violations) {
    try {
      const elements = {
        severe: document.getElementById('systemwide-severe-count'),
        serious: document.getElementById('systemwide-serious-count'),
        minor: document.getElementById('systemwide-minor-count'),
        total: document.getElementById('systemwide-total-count')
      };

      // Validate all required elements exist
      const missingElements = Object.entries(elements)
        .filter(([key, el]) => !el)
        .map(([key]) => key);

      if (missingElements.length > 0) {
        throw new Error(`Missing counter elements: ${missingElements.join(', ')}`);
      }

      const severityCounts = { severe: 0, serious: 0, minor: 0 };
      
      // Count all violations across all bureaus
      violations.forEach(v => {
        if (v.severity) {
          severityCounts[v.severity.toLowerCase()]++;
        }
      });

      // Update the counters
      elements.severe.textContent = severityCounts.severe;
      elements.serious.textContent = severityCounts.serious;
      elements.minor.textContent = severityCounts.minor;
      
      // Total violations across all bureaus
      const totalViolations = severityCounts.severe + severityCounts.serious + severityCounts.minor;
      elements.total.textContent = totalViolations;
    } catch (error) {
      console.error('Error updating systemwide counts:', error);
    }
  }

  function updateBureauCounts(violations) {
    const severityCounts = { severe: 0, serious: 0, minor: 0 };
    const currentBureau = getBureauFromFilename(window.location.search.split('file=')[1]);
    
    // Count violations for current bureau
    violations.forEach(v => {
      if (v.bureau === currentBureau) {
        severityCounts[v.severity.toLowerCase()]++;
      }
    });

    // Update the counters
    document.getElementById('bureau-severe-count').textContent = severityCounts.severe;
    document.getElementById('bureau-serious-count').textContent = severityCounts.serious;
    document.getElementById('bureau-minor-count').textContent = severityCounts.minor;
    
    // Total violations for this bureau
    const totalBureauViolations = severityCounts.severe + severityCounts.serious + severityCounts.minor;
    document.getElementById('bureau-total-count').textContent = totalBureauViolations;
  }

  // Public API
  return {
    initialize,
    updateAllCounters,
  };
})();

// Make globally available
window.SysWideCounters = SysWideCounters;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  SysWideCounters.initialize();
}); 