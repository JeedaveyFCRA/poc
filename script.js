// ===== STATE MANAGEMENT =====
const appState = {
  // Core application state
  currentCreditor: 'AL',
  currentBureau: 'equifax',
  currentPage: 1,
  totalPages: 3,
  
  // Violation tracking
  violationCount: 0,
  activeViolations: [],
  allViolations: [],
  
  // Modal state
  breakdownVisible: false,
  documentVisible: false,
  currentDocumentType: null,
  
  // CSV Data
  csvData: []
};

// Actual sample CSV data with CORRECT X, Y, Width, Height values from the provided data
const sampleCsvData = `Image,Severity,Label,Codes,X,Y,Width,Height,Mode,SOF
AL-EQ-2024-04-25-P57.png,severe,Bankruptcy Status Misreported,§1681s-2(a)(1)(A),43,199,355,20,INCLUDED_IN_CHAPTER_13,true
AL-EQ-2024-04-25-P57.png,severe,Failed to Update After Notice,§1681s-2(b),406,171,355,20,Chapter 7 Dismissal,false
AL-EQ-2024-04-25-P57.png,severe,Failure to Ensure Accuracy,§1681e(b),406,198,355,20,Inaccurate Reporting,false
AL-EQ-2024-04-25-P57.png,serious,Improper Bankruptcy Discharge Status,§1681c(f),45,663,355,20,Still Showing as Active,true
AL-EQ-2024-04-25-P57.png,serious,Failed to Delete Disputed Info,§1681i(a)(5)(A),43,689,355,20,Unverifiable Account,false
AL-EQ-2024-04-25-P57.png,minor,Failed to Disclose Complete Info,§1681g(a)(1),43,738,355,20,Missing Account History,false
AL-EX-2024-04-25-P05.png,severe,Bankruptcy Status Misreported,§1681s-2(a)(1)(A),118,320,555,20,INCLUDED_IN_CHAPTER_13,true
AL-EX-2024-04-25-P05.png,severe,Failed to Update After Notice,§1681s-2(b),117,365,555,20,Chapter 7 Dismissal,false
AL-EX-2024-04-25-P05.png,severe,Failure to Ensure Accuracy,§1681e(b),118,407,555,22,Inaccurate Reporting,false
AL-EX-2024-04-25-P05.png,serious,Improper Bankruptcy Discharge Status,§1681c(f),117,474,550,23,Still Showing as Active,true
AL-EX-2024-04-25-P05.png,serious,Failed to Delete Disputed Info,§1681i(a)(5)(A),116,520,554,20,Unverifiable Account,false
AL-EX-2024-04-25-P05.png,minor,Failed to Disclose Complete Info,§1681g(a)(1),118,345,555,21,Missing Account History,false
AL-TU-2024-04-25-P07.png,severe,Bankruptcy Status Misreported,§1681s-2(a)(1)(A),41,264,729,30,INCLUDED_IN_CHAPTER_13,true
AL-TU-2024-04-25-P07.png,severe,Failed to Update After Notice,§1681s-2(b),42,390,728,31,Chapter 7 Dismissal,false
AL-TU-2024-04-25-P07.png,severe,Failure to Ensure Accuracy,§1681e(b),41,435,728,24,Inaccurate Reporting,false
AL-TU-2024-04-25-P07.png,serious,Improper Bankruptcy Discharge Status,§1681c(f),41,516,730,30,Still Showing as Active,true
AL-TU-2024-04-25-P07.png,serious,Failed to Delete Disputed Info,§1681i(a)(5)(A),40,476,733,26,Unverifiable Account,false`;



// ===== MOBILE & TOUCH SUPPORT =====
function setupMobileSupport() {
  // Calculate and apply container scaling for different screen sizes
  function updateContainerScale() {
    const container = document.getElementById('report-container');
    if (!container) return;
    
    // Get container and window dimensions
    const containerWidth = 810; // Original width
    const windowWidth = window.innerWidth;
    
    // Calculate scale if window is smaller than container
    if (windowWidth < containerWidth + 40) { // Add some margin
      // Calculate scale factor (with minimum scale limit)
      const scaleFactor = Math.max(0.5, (windowWidth - 40) / containerWidth);
      
      // Set CSS variable for use in media queries
      document.documentElement.style.setProperty('--container-scale', scaleFactor.toFixed(2));
      
      // Update violation box sizes if they exist
      adjustViolationBoxesForScale(scaleFactor);
    } else {
      // Reset to default
      document.documentElement.style.setProperty('--container-scale', '1');
    }
  }
  
  // Adjust violation boxes positioning for mobile scaling
  function adjustViolationBoxesForScale(scale) {
    // If needed, make specific adjustments to boxes when scaled
    // This might not be necessary if CSS scale works well
  }
  
  // Add touch support for violation boxes
  function setupTouchSupport() {
    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 ||
                          navigator.msMaxTouchPoints > 0;
    
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
      
      // Add specific touch event handlers if needed
      document.addEventListener('touchstart', function(e) {
        // Handle touch start events
      }, {passive: true});
      
      // Add visual feedback for touch
      document.querySelectorAll('.violation-box, .button, .doc-icon').forEach(el => {
        el.addEventListener('touchstart', function() {
          this.classList.add('touch-feedback');
          setTimeout(() => {
            this.classList.remove('touch-feedback');
          }, 300);
        }, {passive: true});
      });
    }
  }
  


// Inside setupMobileTabs function, update the tab styling
function setupMobileTabs() {
  const mobileTabsContainer = document.querySelector('.mobile-tabs');
  
  // Show/hide based on screen size
  if (window.innerWidth <= 767) { // Changed from 830 to 767 for better phone detection
    if (mobileTabsContainer) {
      mobileTabsContainer.style.display = 'flex';
    } else {
      // Create tab container if it doesn't exist
      const tabContainer = document.createElement('div');
      tabContainer.className = 'mobile-tabs';
      
      // Create violation tab
      const violationsTab = document.createElement('button');
      violationsTab.className = 'tab-button active';
      violationsTab.textContent = 'Violations';
      violationsTab.dataset.tab = 'violations';
      
      // Create documents tab
      const documentsTab = document.createElement('button');
      documentsTab.className = 'tab-button';
      documentsTab.textContent = 'Documents';
      documentsTab.dataset.tab = 'documents';
      
      // Add tabs to container
      tabContainer.appendChild(violationsTab);
      tabContainer.appendChild(documentsTab);
      
      // Add before report container instead of FCRA panel
      const reportContainer = document.querySelector('.report-container');
      if (reportContainer && reportContainer.parentNode) {
        reportContainer.parentNode.insertBefore(tabContainer, reportContainer);
      }
      
      // Add tab click handlers
      setupTabHandlers();
    }
    
    // Set initial states based on active tab
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
      const selectedTab = activeTab.dataset.tab;
      
      if (selectedTab === 'violations') {
        document.querySelector('.fcra-panel').style.display = 'block';
        document.querySelector('.doc-icons').style.display = 'none';
      } else if (selectedTab === 'documents') {
        document.querySelector('.fcra-panel').style.display = 'none';
        document.querySelector('.doc-icons').style.display = 'flex';
      }
    }
  } else {
    // On larger screens, show both panels and hide tabs
    if (mobileTabsContainer) {
      mobileTabsContainer.style.display = 'none';
    }
    document.querySelector('.fcra-panel').style.display = 'block';
    document.querySelector('.doc-icons').style.display = 'flex';
  }
}

    

  
  // Handle tab clicks
  function setupTabHandlers() {
    document.querySelectorAll('.tab-button').forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(t => {
          t.classList.remove('active');
        });
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show/hide content based on selected tab
        const selectedTab = this.dataset.tab;
        
        if (selectedTab === 'violations') {
          document.querySelector('.fcra-panel').style.display = 'block';
          document.querySelector('.doc-icons').style.display = 'none';
        } else if (selectedTab === 'documents') {
          document.querySelector('.fcra-panel').style.display = 'none';
          document.querySelector('.doc-icons').style.display = 'flex';
        }
      });
    });
  }
  
  // Initialize mobile support
  updateContainerScale();
  setupTouchSupport();
  setupMobileTabs();
  
  // Reapply on resize
  window.addEventListener('resize', function() {
    updateContainerScale();
    setupMobileTabs();
  });
}



// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Configure the image container to match VioTagger's exact specs
  configureReportContainer();
  
  // Parse the CSV data
  processCSVData(sampleCsvData);
  
  // Initialize event listeners
  initBureauSelectors();
  initNavigationControls();

  // Set up mobile and touch support
  setupMobileSupport();
  
  // Load initial credit report (default to Equifax)
  loadCreditReport('equifax');
  
  // Log the CSV data
  console.log('CSV data processed with correct coordinates:', appState.csvData);
});

// ===== CONTAINER CONFIGURATION =====

// Configure the report container to match VioTagger's specs
function configureReportContainer() {
  const container = document.getElementById('report-container');
  
  // Set explicit dimensions matching VioTagger
  container.style.width = '810px';
  container.style.height = '920px';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  
  // Ensure box coordinates match VioTagger's system
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.boxSizing = 'border-box';
  
  // Center the container
  const wrapper = document.querySelector('.main-content');
  if (wrapper) {
    wrapper.style.justifyContent = 'center';
  }
  
  console.log('Container configured to match VioTagger specs: 810x920px');
}

// ===== CSV DATA PROCESSING =====

// Process the CSV data
function processCSVData(csvContent) {
  // Clear existing data
  appState.csvData = [];
  
  // Parse CSV
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = lines[i].split(',');
    const entry = {};
    
    for (let j = 0; j < headers.length; j++) {
      let value = values[j];
      
      // Convert numeric fields to numbers
      if (['X', 'Y', 'Width', 'Height'].includes(headers[j])) {
        value = parseInt(value);
      }
      
      // Convert boolean fields
      if (headers[j] === 'SOF') {
        value = value.toLowerCase() === 'true';
      }
      
      entry[headers[j]] = value;
    }
    
    // Add unique ID for tracking
    entry.id = `box-${i}`;
    
    // Determine which bureau this belongs to
    if (entry.Image.includes('-EQ-')) {
      entry.bureau = 'equifax';
    } else if (entry.Image.includes('-EX-')) {
      entry.bureau = 'experian';
    } else if (entry.Image.includes('-TU-')) {
      entry.bureau = 'transunion';
    } else {
      entry.bureau = 'unknown';
    }
    
    appState.csvData.push(entry);
  }
  
  console.log('CSV data processed with correct coordinates. Total entries:', appState.csvData.length);
}

// ===== CORE FUNCTIONS =====

// Toggle violation boxes and their panels
function toggleViolation(boxId) {
  // Get DOM elements
  const box = document.getElementById(boxId);
  const entry = document.getElementById(`entry-${boxId}`);
  
  if (!box || !entry) {
    console.error(`Elements for box ID ${boxId} not found`);
    return;
  }
  
  // Determine current state
  const isActive = box.getAttribute('data-active') === 'true';
  
  if (isActive) {
    // Deactivate
    box.classList.add('inactive');
    box.setAttribute('data-active', 'false');
    
    // Remove from active list
    appState.activeViolations = appState.activeViolations.filter(id => id !== boxId);
    
    // Hide panel with animation
    entry.classList.add('hidden');
  } else {
    // Activate
    box.classList.remove('inactive');
    box.setAttribute('data-active', 'true');
    
    // Add to active list
    if (!appState.activeViolations.includes(boxId)) {
      appState.activeViolations.push(boxId);
    }
    
    // Show panel with animation
    entry.classList.remove('hidden');
  }
  
  // Update the counter with animation
  updateViolationCounter();
}

// Update the violation counter with animation
function updateViolationCounter() {
  const count = appState.activeViolations.length;
  const countElement = document.getElementById('violation-count');
  const badgeElement = document.querySelector('.violation-badge');
  
  // Apply animation
  countElement.classList.add('updating');
  
  // Update count
  countElement.textContent = count;
  if (badgeElement) badgeElement.textContent = count;
  
  // Store in state
  appState.violationCount = count;
  
  // Remove animation class after delay
  setTimeout(() => {
    countElement.classList.remove('updating');
  }, 300);
}

// Show violation breakdown modal
function showBreakdown(boxId) {
  const modal = document.getElementById('breakdown-modal');
  
  // Set state
  appState.breakdownVisible = true;
  
  // Show modal with animation
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('visible');
  }, 10);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  return false; // Prevent default link behavior
}

// Close any modal
function closeModal() {
  const breakdownModal = document.getElementById('breakdown-modal');
  const documentModal = document.getElementById('document-modal');
  
  // Hide modals with animation
  breakdownModal.classList.remove('visible');
  documentModal.classList.remove('visible');
  
  // Reset state
  appState.breakdownVisible = false;
  appState.documentVisible = false;
  
  // After animation finishes, reset display
  setTimeout(() => {
    if (!appState.breakdownVisible) breakdownModal.style.display = 'none';
    if (!appState.documentVisible) documentModal.style.display = 'none';
    
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  }, 300);
}

// Close document modal specifically
function closeDocumentModal() {
  const modal = document.getElementById('document-modal');
  
  // Reset state
  appState.documentVisible = false;
  
  // Hide with animation
  modal.classList.remove('visible');
  
  // After animation, reset display
  setTimeout(() => {
    if (!appState.documentVisible) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }, 300);
}

// Show document based on type
function showDocument(type) {
  const modal = document.getElementById('document-modal');
  const titleElement = document.getElementById('document-title');
  const bodyElement = document.getElementById('document-body');
  
  // Set state
  appState.documentVisible = true;
  appState.currentDocumentType = type;
  
  // Prepare the modal
  modal.style.display = 'flex';
  
  // Set content based on document type
  switch(type) {
    case 'print':
      titleElement.textContent = 'Complete Credit Report';
      bodyElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h3>Equifax Credit Report PDF</h3>
          <p>Comprehensive credit report for Ally Financial, showing all tradelines, inquiries, and account details.</p>
          <div style="margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <p style="margin-bottom: 20px;">This document would typically display the full credit report PDF here.</p>
            <button class="button" onclick="window.print()">Print Credit Report</button>
          </div>
        </div>
      `;
      break;
      
    case 'denial':
      titleElement.textContent = 'Credit Denial Letters';
      bodyElement.innerHTML = `
        <div style="padding: 20px;">
          <h3>Rocket Mortgage Denial Letter</h3>
          <p style="color: #666; font-size: 12px;">April 10, 2025</p>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <p>Dear Applicant,</p>
            <p style="margin: 15px 0;">We regret to inform you that your mortgage application has been declined. Our decision was based on information contained in your credit report from Equifax.</p>
            
            <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #e53935;">
              <p><strong>Reason for Denial:</strong></p>
              <ul style="margin-top: 10px; padding-left: 20px;">
                <li>Bankruptcy reported on credit history</li>
                <li>Delinquent payment history with multiple creditors</li>
                <li>Debt-to-income ratio exceeds our lending parameters</li>
              </ul>
            </div>
            
            <p>You have the right to obtain a free copy of your credit report from Equifax, the consumer reporting agency that was used in our credit decision.</p>
            
            <p style="margin-top: 20px;">Sincerely,<br>Rocket Mortgage Underwriting Team</p>
          </div>
          
          <div style="margin-top: 30px;">
            <h3>Best Egg Loan Denial</h3>
            <p style="color: #666; font-size: 12px;">May 2, 2025</p>
            <!-- Additional denial letter would go here -->
          </div>
        </div>
      `;
      break;
      
    case 'trauma':
      titleElement.textContent = 'Systemic Emotional Impact Statement';
      bodyElement.innerHTML = `
        <div style="padding: 20px;">
          <h3>Client Impact Statement</h3>
          <p style="color: #666; font-size: 12px;">Filed May 8, 2025</p>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; line-height: 1.6;">
            <p>The continued misreporting of my bankruptcy discharge has created significant emotional and financial hardship for me and my family:</p>
            
            <p style="margin-top: 15px;"><strong>Financial Impact:</strong></p>
            <ul style="margin: 10px 0 20px 0; padding-left: 20px;">
              <li>Lost a critical refinancing opportunity that would have saved $423/month</li>
              <li>Wasted $737 on mortgage application fees and appraisal costs</li>
              <li>Forced to use high-interest credit cards for emergency home repairs</li>
              <li>Unable to secure auto financing for necessary vehicle replacement</li>
            </ul>
            
            <p><strong>Emotional/Mental Health Impact:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Persistent anxiety and sleep disruption worrying about credit status</li>
              <li>Embarrassment when denied credit in front of family members</li>
              <li>Relationship strain with spouse over financial limitations</li>
              <li>Depression symptoms requiring therapy sessions ($140/session, not covered by insurance)</li>
            </ul>
            
            <p style="margin-top: 20px;">Despite following all proper procedures for disputing these errors over a 13-month period, the violations continue. This demonstrates a systemic failure and willful disregard for consumer protection laws that has profoundly impacted my financial security and mental wellbeing.</p>
          </div>
        </div>
      `;
      break;
  }
  
  // Show with animation
  setTimeout(() => {
    modal.classList.add('visible');
  }, 10);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
}

// ===== VIOLATION BOX RENDERING =====

// Render violation boxes for current bureau
function renderViolationsForBureau(bureau) {
  // Filter violations for this bureau
  const violations = appState.csvData.filter(item => item.bureau === bureau);
  
  // Log count for verification
  console.log(`Found ${violations.length} violations for bureau ${bureau}`);
  
  // Track IDs for active state
  const violationIds = violations.map(v => v.id);
  
  // Update state
  appState.allViolations = violationIds;
  appState.activeViolations = [...violationIds]; // All are active by default
  
  // Get container and clear it
  const container = document.getElementById('report-container');
  container.innerHTML = '';
  
  // Add placeholder if needed - will be hidden when report loads
  const placeholder = document.createElement('div');
  placeholder.className = 'image-placeholder-text';
  placeholder.id = 'placeholder-text';
  placeholder.innerHTML = '<strong>Select Bureau & Creditor</strong><span>to begin VioTagging!</span>';
  container.appendChild(placeholder);
  
  // Find the correct image filename for this bureau
  let imageFileName = '';
  if (violations.length > 0) {
    imageFileName = violations[0].Image;
  } else {
    console.error(`No violations found for bureau: ${bureau}`);
    return;
  }
  
  // Create an image element to ensure proper report display
  const reportImg = document.createElement('img');
  reportImg.id = 'report-img';
  reportImg.src = imageFileName; // Set to actual image path in production
  reportImg.style.position = 'absolute';
  reportImg.style.top = '50%';
  reportImg.style.left = '50%';
  reportImg.style.width = '778px'; // Matches VioTagger's image width
  reportImg.style.transform = 'translate(-50%, -50%)';
  reportImg.style.pointerEvents = 'none';
  reportImg.style.zIndex = '0';
  
  container.appendChild(reportImg);
  
  // Create boxes with EXACT positioning from CSV
  violations.forEach(violation => {
    // Create box element with CORRECT X, Y, Width, Height values
    const box = document.createElement('div');
    box.id = violation.id;
    box.className = `violation-box ${violation.Severity}`;
    
    // Set exact position and dimensions from CSV data
    box.style.left = `${violation.X}px`;
    box.style.top = `${violation.Y}px`;
    box.style.width = `${violation.Width}px`;
    box.style.height = `${violation.Height}px`;
    
    box.setAttribute('data-active', 'true');
    box.setAttribute('data-mode', violation.Mode); // Store mode for reference
    box.setAttribute('data-severity', violation.Severity); // Store severity for reference
    box.onclick = function() { toggleViolation(violation.id); };
    
    container.appendChild(box);
    
    // Log the box dimensions for verification
    console.log(`Created box at X:${violation.X}, Y:${violation.Y}, W:${violation.Width}, H:${violation.Height}`);
  });
  
  // Render entries in sidebar
  renderViolationEntries(violations);
  
  // Update counter
  updateViolationCounter();
  
  // Set the image background - as backup in case img element doesn't load
  container.style.backgroundImage = `url('${imageFileName}')`;
  
  // Hide placeholder when image is loaded
  document.getElementById('placeholder-text').style.display = 'none';
  
  // Add a class to indicate an image is loaded
  container.classList.add('image-loaded');
  
  // Log for debugging
  console.log(`Rendered ${violations.length} violation boxes for ${bureau} using exact VioTagger coordinates`);
}

// Render violation entries in sidebar
function renderViolationEntries(violations) {
  const entriesContainer = document.getElementById('violation-entries-container');
  entriesContainer.innerHTML = '';
  
  violations.forEach(violation => {
    // Create entry HTML with proper content from CSV
    const entryHtml = `
      <div class="violation-entry" data-box="${violation.id}" id="entry-${violation.id}">
        <div class="entry-header">
          <span class="code-label code-${violation.Severity}">${violation.Codes}</span>
          <span class="toggle-btn" onclick="toggleViolation('${violation.id}')">×</span>
        </div>
        <div class="violation-blurb">
          ${violation.Label} 
          <span class="violation-mode">(${violation.Mode})</span>
        </div>
        <div class="entry-footer">
          <a href="#" class="breakdown-link" onclick="event.preventDefault(); showBreakdown('${violation.id}')">View Violation Breakdown</a>
        </div>
      </div>
    `;
    
    entriesContainer.innerHTML += entryHtml;
  });
}

// ===== INITIALIZATION FUNCTIONS =====

// Initialize bureau selector buttons
function initBureauSelectors() {
  const bureauButtons = document.querySelectorAll('.bureau-btn');
  
  bureauButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Extract bureau from data attribute
      const bureau = btn.getAttribute('data-bureau');
      
      // Skip if already selected
      if (bureau === appState.currentBureau) return;
      
      // Update state
      appState.currentBureau = bureau;
      
      // Update UI
      bureauButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Load appropriate content
      loadCreditReport(bureau);
    });
  });
}

// Initialize navigation controls
function initNavigationControls() {
  // Single page navigation
  document.querySelector('.prev-single').addEventListener('click', () => {
    if (appState.currentPage > 1) {
      appState.currentPage--;
      loadCreditReport(appState.currentBureau);
      updateBreadcrumb();
    }
  });
  
  document.querySelector('.next-single').addEventListener('click', () => {
    if (appState.currentPage < appState.totalPages) {
      appState.currentPage++;
      loadCreditReport(appState.currentBureau);
      updateBreadcrumb();
    }
  });
  
  // Multi-page navigation (creditor level)
  document.querySelector('.prev-all').addEventListener('click', () => {
    console.log('Previous creditor would be loaded here');
    // This would navigate to previous creditor in a real implementation
  });
  
  document.querySelector('.next-all').addEventListener('click', () => {
    console.log('Next creditor would be loaded here');
    // This would navigate to next creditor in a real implementation
  });
  
  // Update page indicator
  document.querySelector('.page-indicator').textContent = 
    `Page ${appState.currentPage} of ${appState.totalPages}`;
}

// Update the breadcrumb display
function updateBreadcrumb() {
  const breadcrumb = document.getElementById('breadcrumb-text');
  
  // Format bureau name for display
  let bureauDisplay = '';
  switch(appState.currentBureau) {
    case 'equifax':
      bureauDisplay = 'EQUIFAX';
      break;
    case 'experian':
      bureauDisplay = 'EXPERIAN';
      break;
    case 'transunion':
      bureauDisplay = 'TRANSUNION';
      break;
  }
  
  // Format creditor name (Ally)
  const creditorDisplay = 'ALLY';
  
  // Get date from filename or use default
  let dateDisplay = "APR. 25, 2024";
  
  // Try to parse date from current image
  const violations = appState.csvData.filter(item => item.bureau === appState.currentBureau);
  if (violations.length > 0) {
    const currentImage = violations[0].Image;
    const dateParts = currentImage.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (dateParts) {
      const year = dateParts[1];
      const month = parseInt(dateParts[2]);
      const day = parseInt(dateParts[3]);
      
      const monthNames = ["JAN.", "FEB.", "MAR.", "APR.", "MAY", "JUN.", 
                         "JUL.", "AUG.", "SEP.", "OCT.", "NOV.", "DEC."];
      
      dateDisplay = `${monthNames[month-1]} ${day}, ${year}`;
    }
  }
  
  // Update breadcrumb text
  breadcrumb.textContent = `${creditorDisplay} — ${bureauDisplay} — ${dateDisplay}`;
}

// Load credit report based on current state
function loadCreditReport(bureau) {
  // Update state if needed
  if (bureau) {
    appState.currentBureau = bureau;
  }
  
  console.log(`Loading report for bureau: ${appState.currentBureau}`);
  
  // Render violations for this bureau
  renderViolationsForBureau(appState.currentBureau);
  
  // Update page indicator
  document.querySelector('.page-indicator').textContent = 
    `Page ${appState.currentPage} of ${appState.totalPages}`;
    
  // Update breadcrumb
  updateBreadcrumb();
}