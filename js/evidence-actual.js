// evidence-actual.js
// Document display system for evidence viewer

const EvidenceActual = (function() {
  let evidenceDocuments = {};
  let currentDocumentId = '';
  
  // Initialize the evidence document system
  function init() {
    loadEvidenceDocuments();
    createEventListeners();
    
    // Ensure container is hidden on initialization
    hideDocument();
    
    console.log("EvidenceActual initialized");
  }
  
  // Load evidence document content from JSON
  async function loadEvidenceDocuments() {
    try {
      const response = await fetch("data/evidence-documents.json");
      evidenceDocuments = await response.json();
      console.log("Evidence documents loaded:", evidenceDocuments);
    } catch (error) {
      console.error("Error loading evidence documents:", error);
      // Fallback to sample data if file doesn't exist
      evidenceDocuments = getSampleDocuments();
    }
  }
  
  // Sample document data for testing
  function getSampleDocuments() {
    return {
      "rocket-referral": {
        "title": "Rocket Mortgage – Credit Upgrade Referral Confirmation",
        "type": "email",
        "content": {
          "header": {
            "sender": "Vest, Jessica",
            "timestamp": "12:58 PM (9 hours ago)",
            "recipient": "to me"
          },
          "body": [
            {
              "type": "greeting",
              "text": "Hello David,"
            },
            {
              "type": "paragraph",
              "text": "Thank you for allowing me time to dig into this more. I was able to find more information regarding our <span class='company-name'>Credit Upgrade Team</span> referral."
            },
            {
              "type": "paragraph", 
              "text": "I can confirm that on <span class='important-date'>04/21/2024</span>, we referred you to <span class='company-name'>Credit Upgrade</span>. To be eligible for the loan, we needed your score increase from <span class='important-number'>600</span> to <span class='important-number'>640</span>."
            },
            {
              "type": "paragraph",
              "text": "I can confirm that you discussed <span class='important-number'>paying off 10,000</span> in debt for the score to increase from <span class='important-number'>600</span> to <span class='important-number'>640</span>."
            },
            {
              "type": "paragraph",
              "text": "It appears that you paid 737 to another lender/broker for an appraisal which required repairs. Our team advised that once everything was sorted, we would not charge a deposit due to being a serviced client."
            },
            {
              "type": "paragraph",
              "text": "This is the only additional information I was able to obtain and can provide."
            },
            {
              "type": "paragraph",
              "text": "Please let me know if you need anything further or have any questions/concerns."
            }
          ],
          "signature": {
            "name": "Jessica Vest",
            "title": "Triple Crown Resolution Advocate | Rocket Mortgage"
          }
        }
      }
    };
  }
  
  // Show the evidence document container with specified content
  function showDocument(documentId) {
    const container = document.getElementById("Evidence_Actual_Container");
    const headingEl = document.getElementById("Evidence_Actual_Heading");
    const copyEl = document.getElementById("Evidence_Actual_Copy");
    
    if (!container || !headingEl || !copyEl) {
      console.error("Evidence document elements not found");
      return;
    }
    
    const evidenceDoc = evidenceDocuments[documentId];
    if (!evidenceDoc) {
      console.error("Document not found:", documentId);
      return;
    }
    
    currentDocumentId = documentId;
    
    // Populate content
    headingEl.textContent = evidenceDoc.title;
    copyEl.innerHTML = generateDocumentHTML(evidenceDoc);
    
    // Show container with aggressive CSS overrides
    container.style.setProperty('display', 'block', 'important');
    container.style.setProperty('visibility', 'visible', 'important');
    container.style.setProperty('opacity', '1', 'important');
    container.style.setProperty('z-index', '250', 'important');
    container.style.setProperty('position', 'absolute', 'important');
    container.style.setProperty('background-color', 'transparent', 'important');
    container.style.setProperty('border', 'none', 'important');
    container.style.setProperty('box-shadow', 'none', 'important');
    
    console.log("📄 EvidenceActual: Container force-shown with aggressive CSS");
    console.log("📄 Container element:", container);
    console.log("📄 Final computed styles:", {
      display: window.getComputedStyle(container).display,
      visibility: window.getComputedStyle(container).visibility,
      opacity: window.getComputedStyle(container).opacity,
      zIndex: window.getComputedStyle(container).zIndex
    });
    
    // Ensure navigation elements stay visible
    if (typeof EvidenceNavigation !== "undefined") {
      EvidenceNavigation.showNavigation();
    }
    
    // Ensure evidence canvas is visible
    const evidenceCanvas = document.getElementById("Evidence_Canvas_Container");
    if (evidenceCanvas) {
      evidenceCanvas.style.display = "block";
    }
    
    // Ensure all navigation buttons are visible
    const navigationElements = [
      'Evidence_Arrow_Group_Left',
      'Evidence_Arrow_Left',
      'Evidence_Arrow_Group_Right',
      'Evidence_Arrow_Right',
      'Evidence_Heading_Container'
    ];
    
    navigationElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (id === 'Evidence_Heading_Container') {
          element.style.display = 'flex';
        } else {
          element.style.display = 'block';
        }
      }
    });

    // Disable report viewer interaction
    const reportViewer = document.getElementById("Image_Canvas_Container");
    const canvasOverlay = document.getElementById("Canvas_Overlay_Box");
    if (reportViewer) {
      reportViewer.style.pointerEvents = "none";
    }
    if (canvasOverlay) {
      canvasOverlay.classList.add("dimmed");
      canvasOverlay.style.opacity = "0.7";
    }

    // Ensure report stays dimmed
    if (typeof dimReportView === "function") dimReportView();
    if (typeof showDimOverlay === "function") showDimOverlay();
    
    console.log("Showing document:", documentId);
  }
  
  // Generate HTML content for document
  function generateDocumentHTML(evidenceDoc) {
    let html = '';
    
    // Add email header if present
    if (evidenceDoc.content.header) {
      html += `
        <div class="email-header">
          <div class="sender-name">${evidenceDoc.content.header.sender}</div>
          <div class="timestamp">${evidenceDoc.content.header.timestamp}</div>
          <div>${evidenceDoc.content.header.recipient}</div>
        </div>
      `;
    }
    
    // Add body content
    if (evidenceDoc.content.body) {
      evidenceDoc.content.body.forEach(item => {
        switch (item.type) {
          case 'greeting':
            html += `<p class="greeting">${item.text}</p>`;
            break;
          case 'paragraph':
            html += `<p>${item.text}</p>`;
            break;
          case 'signature':
            html += `
              <div class="signature">
                ${item.text.replace('\n', '<br>')}
              </div>
            `;
            break;
          case 'list':
            html += `<ul>`;
            item.items.forEach(listItem => {
              html += `<li>${listItem}</li>`;
            });
            html += `</ul>`;
            break;
        }
      });
    }
    
    // Add signature if present
    if (evidenceDoc.content.signature) {
      html += `
        <div class="signature">
          <div class="sender-name">${evidenceDoc.content.signature.name}</div>
          <div class="job-title">${evidenceDoc.content.signature.title}</div>
        </div>
      `;
    }
    
    return html;
  }
  
  // Hide the evidence document container
  function hideDocument() {
    const container = document.getElementById("Evidence_Actual_Container");
    if (container) {
      // Force hide with multiple approaches
      container.style.setProperty("display", "none", "important");
      container.style.setProperty("visibility", "hidden", "important");
      container.style.setProperty("opacity", "0", "important");
      container.classList.remove("force-visible");
      
      // Clear content to prevent any lingering display
      const heading = document.getElementById("Evidence_Actual_Heading");
      const copy = document.getElementById("Evidence_Actual_Copy");
      if (heading) heading.textContent = "";
      if (copy) copy.innerHTML = "";
      
      currentDocumentId = '';
      
      // Re-enable report viewer interaction
      const reportViewer = document.getElementById("Image_Canvas_Container");
      if (reportViewer) {
        reportViewer.style.pointerEvents = "auto";
      }
      
      console.log("✅ Document container completely hidden and cleared");
    }
  }
  
  // Hide other containers when showing document
  function hideOtherContainers() {
    // Hide matters box if visible
    const mattersBox = document.getElementById("Matters_Box");
    if (mattersBox) {
      mattersBox.style.display = "none";
    }
    
    // Note: We keep the evidence menu visible so user can navigate between documents
  }
  
  // Check if document container is currently visible
  function isVisible() {
    const container = document.getElementById("Evidence_Actual_Container");
    return container && container.style.display !== "none";
  }
  
  // Get current document ID
  function getCurrentDocumentId() {
    return currentDocumentId;
  }
  
  // Event listeners for container management
  function createEventListeners() {
    // Listen for clicks that should close the document view
    document.addEventListener('click', function(event) {
      // Don't close if clicking inside the document container or evidence menu
      if (event.target.closest('#Evidence_Actual_Container') || 
          event.target.closest('#Evidence_Menu_Container') ||
          event.target.closest('.evidence-back-button') ||
          event.target.closest('.evidence-close-button')) {
        return;
      }
      
      // Close document if clicking on evidence buttons
      if (event.target.closest('.evidence-icon')) {
        hideDocument();
        return;
      }
      
      // Close document if clicking on report areas or main interface (but NOT gradient background)
      if (event.target.closest('#Image_Canvas_Container') ||
          event.target.closest('#Creditor_Logo_Container') ||
          event.target.closest('.bureau-logo-container') ||
          event.target.closest('#Canvas_Heading_Container')) {
        hideDocument();
      }
      
      // Don't close on gradient background clicks - let evidence stay active
    });

    // Listen for ESC key to close document
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && isVisible()) {
        hideDocument();
      }
    });
  }
  
  // Public API
  return {
    init,
    showDocument,
    hideDocument,
    isVisible,
    getCurrentDocumentId,
    loadEvidenceDocuments
  };
  
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure other scripts load first
  setTimeout(() => {
    EvidenceActual.init();
  }, 100);
});

// Global access - make sure it's available immediately
window.EvidenceActual = EvidenceActual;