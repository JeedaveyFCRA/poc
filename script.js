// ===== STATE MANAGEMENT =====
const appState = {
  // Core application state
  currentCreditor: 'AL',
  currentBureau: 'equifax',
  currentPage: 1,
  totalPages: 3,
  
  // Image sources for each bureau (these will be derived from CSV)
  reportImages: {
    equifax: 'AL-EQ-2024-04-25-P57.png',
    experian: 'AL-EX-2024-04-25-P05.png',
    transunion: 'AL-TU-2024-04-25-P07.png'
  },
  
  // Violation tracking
  violationCount: 0,
  activeViolations: [],
  allViolations: [],
  
  // Modal state
  breakdownVisible: false,
  documentVisible: false,
  currentDocumentType: null,
  
  // CSV Data
  csvData: [],
  hasLoadedCSV: false
};

// Sample CSV data for testing (to be replaced by actual CSV data)
const sampleCsvData = `Image,Severity,Label,Codes,X,Y,Width,Height,Mode,SOF
AL-EQ-2024-04-25-P57.png,severe,Bankruptcy Status Misreported,§1681s-2(a)(1)(A),100,100,180,40,INCLUDED_IN_CHAPTER_13,true
AL-EQ-2024-04-25-P57.png,severe,Failed to Update After Notice,§1681s-2(b),320,150,200,50,Chapter 7 Dismissal,false
AL-EQ-2024-04-25-P57.png,severe,Failure to Ensure Accuracy,§1681e(b),600,200,190,45,Inaccurate Reporting,false
AL-EQ-2024-04-25-P57.png,serious,Improper Bankruptcy Discharge Status,§1681c(f),150,300,170,40,Still Showing as Active,true
AL-EQ-2024-04-25-P57.png,serious,Failed to Delete Disputed Info,§1681i(a)(5)(A),450,350,160,35,Unverifiable Account,false
AL-EQ-2024-04-25-P57.png,minor,Failed to Disclose Complete Info,§1681g(a)(1),700,450,150,30,Missing Account History,false
AL-EX-2024-04-25-P05.png,severe,Bankruptcy Status Misreported,§1681s-2(a)(1)(A),120,110,175,45,INCLUDED_IN_CHAPTER_13,true
AL-EX-2024-04-25-P05.png,severe,Failure to Update Accounts,§1681s-2(b),350,160,210,55,Still Showing as Due,false
AL-TU-2024-04-25-P07.png,severe,Failure to Ensure Accuracy,§1681e(b),200,120,180,40,Wrong Status Code,false
AL-TU-2024-04-25-P07.png,serious,Improper Discharge Reporting,§1681c(f),400,250,160,35,Not Showing Discharge,true`;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Parse the CSV data
  processCSVData(sampleCsvData);
  
  // Initialize event listeners
  initBureauSelectors();
  initNavigationControls();
  
  // Load initial credit report
  loadCreditReport();
  
  // Setup CSV file input event listener
  document.getElementById('csvFileInput').addEventListener('change', handleCSVFile);
});

// ===== CSV DATA PROCESSING =====

// Process the CSV data (either from string or file)
function processCSVData(csvContent) {
  // Clear existing data
  appState.csvData = [];
  appState.allViolations = [];
  appState.activeViolations = [];
  
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
    
    appState.csvData.push(entry);
  }
  
  // Extract unique image filenames to update reportImages
  const uniqueImages = [...new Set(appState.csvData.map(item => item.Image))];
  
  // Update report images mapping based on bureaus in filenames
  appState.reportImages = {};
  
  uniqueImages.forEach(filename => {
    if (filename.includes('-EQ-')) {
      appState.reportImages.equifax = filename;
    } else if (filename.includes('-EX-')) {
      appState.reportImages.experian = filename;
    } else if (filename.includes('-TU-')) {
      appState.reportImages.transunion = filename;
    }
  });
  
  // Mark as loaded
  appState.hasLoadedCSV = true;
  
  console.log('CSV data processed:', appState.csvData);
}

// Handle CSV file upload
function handleCSVFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const csvContent = e.target.result;
    processCSVData(csvContent);
    loadCreditReport(); // Reload with new data
  };
  reader.readAsText(file);
}

// ===== CORE FUNCTIONS =====

// Toggle violation boxes and their panels
function toggleViolation(boxId) {
  // Get DOM elements
  const box = document.getElementById(boxId);
  const entry = document.getElementById(`entry-${boxId}`);
  
  if (!box || !entry) return;
  
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

// Render violation boxes for current image
function renderViolationBoxes(filename) {
  // Get container
  const container = document.getElementById('report-container');
  
  // Clear existing boxes
  container.innerHTML = '';
  
  // Add placeholder if needed - will be hidden when report loads
  const placeholder = document.createElement('div');
  placeholder.className = 'image-placeholder-text';
  placeholder.id = 'placeholder-text';
  placeholder.innerHTML = '<strong>Select Bureau & Creditor</strong><span>to begin VioTagging!</span>';
  container.appendChild(placeholder);
  
  // Filter violations for this image
  const violations = appState.csvData.filter(item => item.Image === filename);
  appState.allViolations = violations.map(v => v.id);
  
  // Reset active violations (all are active by default)
  appState.activeViolations = [...appState.allViolations];
  
  // Create boxes
  violations.forEach((violation, index) => {
    // Create box element
    const box = document.createElement('div');
    box.id = violation.id;
    box.className = `violation-box ${violation.Severity}`;
    box.style.left = `${violation.X}px`;
    box.style.top = `${violation.Y}px`;
    box.style.width = `${violation.Width}px`;
    box.style.height = `${violation.Height}px`;
    box.setAttribute('data-active', 'true');
    box.onclick = () => toggleViolation(violation.id);
    
    container.appendChild(box);
  });
  
  // Render entries in sidebar
  renderViolationEntries(violations);
  
  // Update counter
  updateViolationCounter();
  
  // Hide placeholder when image is loaded
  container.style.backgroundImage = `url('${filename}')`;
  document.getElementById('placeholder-text').style.display = 'none';
}

// Render violation entries in sidebar
function renderViolationEntries(violations) {
  const entriesContainer = document.getElementById('violation-entries-container');
  entriesContainer.innerHTML = '';
  
  violations.forEach(violation => {
    const entryHtml = `
      <div class="violation-entry" data-box="${violation.id}" id="entry-${violation.id}">
        <div class="entry-header">
          <span class="code-label code-${violation.Severity}">${violation.Codes}</span>
          <span class="toggle-btn" onclick="toggleViolation('${violation.id}')">×</span>
        </div>
        <div class="violation-blurb">
          ${violation.Label}
        </div>
        <div class="entry-footer">
          <a href="#" class="breakdown-link" onclick="showBreakdown('${violation.id}')">View Violation Breakdown</a>
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
      loadCreditReport();
      
      // Update breadcrumb
      updateBreadcrumb();
    });
  });
}

// Initialize navigation controls
function initNavigationControls() {
  // Single page navigation
  document.querySelector('.prev-single').addEventListener('click', () => {
    if (appState.currentPage > 1) {
      appState.currentPage--;
      loadCreditReport();
      updateBreadcrumb();
    }
  });
  
  document.querySelector('.next-single').addEventListener('click', () => {
    if (appState.currentPage < appState.totalPages) {
      appState.currentPage++;
      loadCreditReport();
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
  const breadcrumb = document.querySelector('.breadcrumb span');
  
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
  
  // Try to parse date from current image filename
  const currentImage = appState.reportImages[appState.currentBureau];
  if (currentImage) {
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
function loadCreditReport() {
  if (!appState.hasLoadedCSV) {
    console.warn('No CSV data loaded. Using sample data.');
  }
  
  // Determine which image to show based on current bureau
  const imageFileName = appState.reportImages[appState.currentBureau];
  
  if (!imageFileName) {
    console.error(`No image found for bureau: ${appState.currentBureau}`);
    return;
  }
  
  // Render the violation boxes
  renderViolationBoxes(imageFileName);
  
  // Update page indicator
  document.querySelector('.page-indicator').textContent = 
    `Page ${appState.currentPage} of ${appState.totalPages}`;
    
  // Update breadcrumb
  updateBreadcrumb();
  
  console.log(`Loaded report: ${imageFileName}`);
}