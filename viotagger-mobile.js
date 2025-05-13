// VioTagger Mobile Responsiveness Enhancement Script

document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile tab functionality
  initializeMobileTabs();
  
  // Initialize container scaling
  initializeResponsiveScaling();
  
  // Handle orientation changes
  window.addEventListener('orientationchange', function() {
    setTimeout(updateScale, 100); // Small delay to allow orientation to complete
  });
});

/**
 * Initialize mobile tab navigation
 */
function initializeMobileTabs() {
  // Create mobile tabs if they don't exist yet
  if (!document.querySelector('.mobile-tabs')) {
    createMobileTabs();
  }
  
  // Add click event listeners to tab buttons
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all tabs
      document.querySelectorAll('.tab-button').forEach(b => {
        b.classList.remove('active');
      });
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding panel and hide others
      const panelToShow = this.dataset.panel;
      document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
      });
      
      const activePanel = document.querySelector(`.${panelToShow}-panel`);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.style.display = 'block';
      }
      
      // Save the active tab to localStorage for persistence
      localStorage.setItem('viotagger-active-tab', panelToShow);
    });
  });
  
  // Restore previously active tab if it exists
  const savedTab = localStorage.getItem('viotagger-active-tab');
  if (savedTab) {
    const tabButton = document.querySelector(`.tab-button[data-panel="${savedTab}"]`);
    if (tabButton) {
      tabButton.click();
    }
  } else {
    // Default to first tab (violations)
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
      firstTab.click();
    }
  }
}

/**
 * Create mobile tab navigation dynamically
 */
function createMobileTabs() {
  // Create container for tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'mobile-tabs';
  
  // Create violations tab
  const violationsTab = document.createElement('button');
  violationsTab.className = 'tab-button active';
  violationsTab.textContent = 'Violations';
  violationsTab.dataset.panel = 'violations';
  
  // Create documents tab
  const documentsTab = document.createElement('button');
  documentsTab.className = 'tab-button';
  documentsTab.textContent = 'Documents';
  documentsTab.dataset.panel = 'documents';
  
  // Add tabs to container
  tabsContainer.appendChild(violationsTab);
  tabsContainer.appendChild(documentsTab);
  
  // Find where to insert the tabs
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.insertBefore(tabsContainer, mainContent.firstChild);
  } else {
    // Fallback location
    document.body.insertBefore(tabsContainer, document.body.firstChild);
  }
  
  // Set initial panel classes
  const violationsPanel = document.querySelector('.violations-panel, .fcra-panel');
  const documentsPanel = document.querySelector('.documents-panel, .doc-icons');
  
  if (violationsPanel) {
    violationsPanel.classList.add('panel', 'violations-panel', 'active');
  }
  
  if (documentsPanel) {
    documentsPanel.classList.add('panel', 'documents-panel');
    documentsPanel.style.display = 'none';
  }
}

/**
 * Initialize responsive scaling functionality
 */
function initializeResponsiveScaling() {
  // Set initial scale
  updateScale();
  
  // Update scale on window resize
  window.addEventListener('resize', debounce(updateScale, 150));
}

/**
 * Update container scale based on viewport size
 */
function updateScale() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  let scale = 1;
  
  // Determine appropriate scale based on screen size
  if (width < 600) {
    // Small phones
    scale = 0.6;
  } else if (width < 767) {
    // Phones
    scale = 0.75;
  } else if (width < 830) {
    // Tablets
    scale = 0.9;
  }
  
  // Adjust for landscape orientation with limited height
  if (width > height && height < 600) {
    // Make sure report is fully visible in landscape
    scale = Math.min(scale, height / 1000);
  }
  
  // Apply scale to document root
  document.documentElement.style.setProperty('--container-scale', scale);
  
  // Fix container positioning
  adjustContainerPosition(scale);
}

/**
 * Adjust container position to ensure it's centered
 * @param {number} scale - Current scale factor
 */
function adjustContainerPosition(scale) {
  const reportContainer = document.querySelector('.report-container');
  if (!reportContainer) return;
  
  // For very small screens, use special positioning
  if (window.innerWidth < 600) {
    const containerWidth = 810; // Original container width
    const scaledWidth = containerWidth * scale;
    const margin = (window.innerWidth - scaledWidth) / 2;
    
    // Apply calculated margins
    reportContainer.style.marginLeft = `${margin}px`;
    reportContainer.style.marginRight = `${margin}px`;
  } else {
    // For larger screens, reset to CSS defaults
    reportContainer.style.marginLeft = '';
    reportContainer.style.marginRight = '';
  }
}

/**
 * Debounce function to limit rapid firing of events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce delay in milliseconds
 * @return {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Add fix for iOS Safari 100vh issue
 */
function fixIOSViewportHeight() {
  // First we get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize iOS height fix
fixIOSViewportHeight();
window.addEventListener('resize', fixIOSViewportHeight);