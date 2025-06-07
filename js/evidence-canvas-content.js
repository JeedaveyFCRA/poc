// evidence-canvas-content.js
// Handles creation and management of evidence canvas content elements

const EvidenceCanvasContent = (function() {
  'use strict';
  
  let currentEvidenceType = '';
  let currentHeading = '';
  
  // Smart placeholder messages based on evidence type
  const PLACEHOLDER_MESSAGES = {
    'extras': {
      title: 'Content not selected',
      subtitle: 'Select a document to view',
      description: 'Choose a document from the menu to view its contents'
    },
    'denials': {
      title: 'Content not selected',
      subtitle: 'Select a document to view',
      description: 'Choose a document from the menu to view its contents'
    },
    'emotional': {
      title: 'Content not selected',
      subtitle: 'Select a document to view',
      description: 'Choose a document from the menu to view its contents'
    },
    'bankruptcy': {
      title: 'Content not selected',
      subtitle: 'Select a document to view',
      description: 'Choose a document from the menu to view its contents'
    },
    'triggers': {
      title: 'Content not selected',
      subtitle: 'Select a document to view',
      description: 'Choose a document from the menu to view its contents'
    },
    'alerts': {
      title: 'Content not selected',
      subtitle: 'Select a document to view',
      description: 'Choose a document from the menu to view its contents'
    }
  };
  
  let backButtonElement = null; // Cache the element
  let closeButtonElement = null; // Cache the close button
  
  function createBackButton() {
    const backButton = document.createElement('img');
    backButton.id = 'Evidence_Back_Button';
    backButton.className = 'evidence-back-button';
    backButton.src = 'assets/icons/back.png';
    backButton.alt = 'Back to Evidence Menu';
    
    // Add error handling for image loading
    backButton.onerror = () => {
      console.error('Failed to load back button image');
      backButton.src = 'assets/icons/back-button.png'; // Fallback to original path
    };
    
    // Add hover state with error handling
    backButton.addEventListener('mouseenter', () => {
      const hoverImage = new Image();
      hoverImage.src = 'assets/icons/back-hover.png';
      hoverImage.onload = () => {
        backButton.src = hoverImage.src;
      };
      hoverImage.onerror = () => {
        console.error('Failed to load back button hover image');
        backButton.src = 'assets/icons/back-button-hover.png'; // Fallback to original path
      };
    });
    
    backButton.addEventListener('mouseleave', () => {
      const normalImage = new Image();
      normalImage.src = 'assets/icons/back.png';
      normalImage.onload = () => {
        backButton.src = normalImage.src;
      };
      normalImage.onerror = () => {
        console.error('Failed to load back button normal image');
        backButton.src = 'assets/icons/back-button.png'; // Fallback to original path
      };
    });
    
    // Enhanced back button click handler
    backButton.addEventListener('click', handleBackButtonClick);
    
    document.body.appendChild(backButton);
    return backButton;
  }

  function createCloseButton() {
    // If button already exists, just show it
    if (closeButtonElement) {
      closeButtonElement.style.display = "block";
      closeButtonElement.style.visibility = "visible";
      return closeButtonElement;
    }

    // Create new close button only once
    closeButtonElement = document.createElement("img");
    closeButtonElement.id = "Evidence_Close_Button";
    closeButtonElement.src = "assets/icons/close.png";
    closeButtonElement.alt = "Close Evidence View";
    closeButtonElement.className = "evidence-close-button";
    
    // Add hover effects
    closeButtonElement.addEventListener("mouseenter", () => {
      closeButtonElement.src = "assets/icons/close-hover.png";
    });
    
    closeButtonElement.addEventListener("mouseleave", () => {
      closeButtonElement.src = "assets/icons/close.png";
    });
    
    // Add click handler
    closeButtonElement.addEventListener("click", handleCloseClick);
    
    // Append to body
    document.body.appendChild(closeButtonElement);
    closeButtonElement.style.display = "block";
    closeButtonElement.style.visibility = "visible";
    
    console.log("Evidence close button created");
    return closeButtonElement;
  }

  // NEW: Function to populate canvas container with evidence content
  async function populateCanvasContent(documentId) {
    console.log("Populating canvas content for document:", documentId);
    
    try {
      // Load the document data
      const response = await fetch('data/evidence-documents.json');
      const documents = await response.json();
      
      if (!documents[documentId]) {
        console.error("Document not found:", documentId);
        return;
      }
      
      const document = documents[documentId];
      const canvasContainer = document.getElementById("Evidence_Canvas_Container");
      
      if (!canvasContainer) {
        console.error("Evidence canvas container not found");
        return;
      }
      
      // Clear existing content
      canvasContainer.innerHTML = '';
      
      // Create content wrapper with proper styling
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'evidence-canvas-content';
      contentWrapper.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
        font-family: 'Space Grotesk', sans-serif;
        color: #253541;
        line-height: 1.6;
      `;
      
      // Create document title
      const titleElement = document.createElement('h1');
      titleElement.textContent = document.title;
      titleElement.style.cssText = `
        font-family: 'jaf-bernino-sans-comp', sans-serif;
        font-weight: 700;
        font-size: 28px;
        color: #253541;
        margin: 0 0 30px 0;
        text-align: center;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 20px;
      `;
      contentWrapper.appendChild(titleElement);
      
      // Create document content based on type
      if (document.content) {
        const contentElement = document.createElement('div');
        contentElement.className = 'document-content';
        
        // Add email header if present
        if (document.content.header) {
          const headerDiv = document.createElement('div');
          headerDiv.className = 'email-header';
          headerDiv.style.cssText = `
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #4a90e2;
          `;
          
          headerDiv.innerHTML = `
            <div style="font-weight: 600; font-size: 16px; color: #253541; margin-bottom: 8px;">
              ${document.content.header.sender}
            </div>
            <div style="font-size: 14px; color: #666; margin-bottom: 4px;">
              ${document.content.header.timestamp}
            </div>
            <div style="font-size: 14px; color: #666;">
              ${document.content.header.recipient}
            </div>
          `;
          contentElement.appendChild(headerDiv);
        }
        
        // Add body content
        if (document.content.body) {
          document.content.body.forEach(item => {
            const element = document.createElement('div');
            element.style.marginBottom = '20px';
            
            switch (item.type) {
              case 'greeting':
                element.innerHTML = `<p style="font-weight: 600; color: #4a90e2; margin: 0;">${item.text}</p>`;
                break;
              case 'paragraph':
                element.innerHTML = `<p style="margin: 0; line-height: 1.7;">${item.text}</p>`;
                break;
              case 'list':
                const listHtml = item.items.map(listItem => 
                  `<li style="margin-bottom: 10px; line-height: 1.6;">${listItem}</li>`
                ).join('');
                element.innerHTML = `<ul style="margin: 0; padding-left: 25px;">${listHtml}</ul>`;
                break;
            }
            contentElement.appendChild(element);
          });
        }
        
        // Add signature if present
        if (document.content.signature) {
          const signatureDiv = document.createElement('div');
          signatureDiv.className = 'signature';
          signatureDiv.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #28a745;
          `;
          
          signatureDiv.innerHTML = `
            <div style="font-weight: 600; color: #253541; margin-bottom: 5px;">
              ${document.content.signature.name}
            </div>
            <div style="font-style: italic; color: #666; font-size: 14px;">
              ${document.content.signature.title}
            </div>
          `;
          contentElement.appendChild(signatureDiv);
        }
        
        contentWrapper.appendChild(contentElement);
      }
      
      // Append to canvas container
      canvasContainer.appendChild(contentWrapper);
      
      // Show the canvas container
      canvasContainer.style.display = 'block';
      canvasContainer.style.visibility = 'visible';
      
      console.log("Canvas content populated successfully");
      
    } catch (error) {
      console.error("Error populating canvas content:", error);
    }
  }

  // NEW: Function to clear canvas content
  function clearCanvasContent() {
    const canvasContainer = document.getElementById("Evidence_Canvas_Container");
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      canvasContainer.style.display = 'none';
      console.log("Canvas content cleared");
    }
  }
  
  // NEW: Show placeholder state for evidence canvas
  function showPlaceholderState(type) {
    const canvasContainer = document.getElementById('Evidence_Canvas_Container');
    if (canvasContainer) {
      canvasContainer.style.display = 'block';
      canvasContainer.style.visibility = 'visible';
      canvasContainer.style.opacity = '1';
      
      // Get contextual message
      const message = PLACEHOLDER_MESSAGES[type] || {
        title: 'Content not selected',
        subtitle: 'Select a document to view',
        description: 'Choose a document from the menu to view its contents'
      };
      
      // Create placeholder content
      canvasContainer.innerHTML = `
        <div class="evidence-placeholder">
          <h2>${message.title}</h2>
          <p>${message.subtitle}</p>
          <p>${message.description}</p>
        </div>
      `;
    }
  }

  function handleBackButtonClick() {
    console.log('🎯 Back button clicked - returning to menu');
    
    // Get the current evidence type from the selected evidence button
    const selectedIcon = document.querySelector('.evidence-icon.selected');
    const evidenceType = selectedIcon ? selectedIcon.dataset.button : currentEvidenceType;
    
    console.log(`Evidence type for back button: ${evidenceType}`);
    
    try {
      // 1. Hide matters box first
      if (typeof hideMattersBoxCompletely === 'function') {
        hideMattersBoxCompletely();
      }
      
      // 2. Keep evidence menu and heading visible with correct positioning
      const menuContainer = document.getElementById('Evidence_Menu_Container');
      const headingContainer = document.getElementById('Evidence_Heading_Container');
      
      if (menuContainer) {
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '260px';
        menuContainer.style.left = '802px';
        menuContainer.style.width = '380px';
        menuContainer.style.height = '790px';
        menuContainer.style.display = 'block';
        menuContainer.style.visibility = 'visible';
        menuContainer.style.opacity = '1';
        menuContainer.style.zIndex = '202';
      }
      
      if (headingContainer) {
        headingContainer.style.display = 'block';
        headingContainer.style.visibility = 'visible';
        headingContainer.style.opacity = '1';
        headingContainer.style.zIndex = '203';
      }
      
      // 3. Keep evidence button icon selected (the data-button is on the icon, not the button)
      const currentIcon = document.querySelector(`.evidence-icon[data-button="${evidenceType}"]`);
      if (currentIcon) {
        currentIcon.classList.add('selected');
        // Also ensure the icon shows the selected state image
        const buttonMap = {
          extras: { selected: "assets/icons/Print-selected.png" },
          denials: { selected: "assets/icons/denial-selected.png" },
          emotional: { selected: "assets/icons/broken-heart-selected.png" },
          bankruptcy: { selected: "assets/icons/bk-doc-selected.png" },
          triggers: { selected: "assets/icons/addl-evidence-selected.png" },
          alerts: { selected: "assets/icons/damaging-alerts-selected.png" }
        };
        if (buttonMap[evidenceType]) {
          currentIcon.src = buttonMap[evidenceType].selected;
        }
      }
      
      // 4. Clear letter content
      if (typeof window.EvidenceActual !== 'undefined') {
        window.EvidenceActual.hideDocument();
      }
      
      // 5. Clear link highlights
      clearAllLinkHighlights();
      
      // 6. Show "Content not selected" message
      if (typeof window.EvidenceNav !== 'undefined') {
        window.EvidenceNav.showContentNotSelectedMessage();
      } else {
        // Fallback to local placeholder function
        showPlaceholderState(currentEvidenceType);
      }
      
      // 7. Manage arrow states
      updateArrowStates();
      
      // 8. Add fade transition
      addFadeTransition();
      
      // 9. Update UI state
      if (typeof setUIState === 'function') {
        setUIState('state-evidence-menu');
      }
      
    } catch (error) {
      console.error('Error in back button handler:', error);
    }
  }

  function handleCloseClick() {
    console.log("🚪 Close button clicked - COMPLETE exit from evidence mode");
    
    try {
      // 1. Hide ALL evidence navigation arrows
      if (typeof window.EvidenceNav !== "undefined") {
        window.EvidenceNav.hideArrows();
        window.EvidenceNav.resetNavigationState();
      }
      
      // 2. Hide evidence heading container (white text heading and bar)
      const evidenceHeadingContainer = document.getElementById("Evidence_Heading_Container");
      if (evidenceHeadingContainer) {
        evidenceHeadingContainer.style.display = "none";
        evidenceHeadingContainer.style.visibility = "hidden";
      }
      
      // 3. Hide evidence canvas container (letter content)
      const evidenceCanvasContainer = document.getElementById("Evidence_Canvas_Container");
      if (evidenceCanvasContainer) {
        evidenceCanvasContainer.style.display = "none";
        evidenceCanvasContainer.style.visibility = "hidden";
        evidenceCanvasContainer.innerHTML = '';
      }
      
      // 4. Hide evidence document (letter)
      if (typeof window.EvidenceActual !== "undefined") {
        window.EvidenceActual.hideDocument();
      }
      
      // 5. Hide back button using dedicated function + bulletproof approach
      removeBackButton();
      const backButton = document.getElementById("Evidence_Back_Button");
      console.log("🔍 Back button found:", !!backButton);
      if (backButton) {
        backButton.style.setProperty('display', 'none', 'important');
        backButton.style.setProperty('visibility', 'hidden', 'important');
        backButton.style.setProperty('opacity', '0', 'important');
        console.log("✅ Back button hidden");
      }
      
      // 6. Hide close button using dedicated function + bulletproof approach
      setTimeout(() => {
        removeCloseButton();
        const closeButton = document.getElementById("Evidence_Close_Button");
        console.log("🔍 Close button found:", !!closeButton);
        if (closeButton) {
          closeButton.style.setProperty('display', 'none', 'important');
          closeButton.style.setProperty('visibility', 'hidden', 'important');
          closeButton.style.setProperty('opacity', '0', 'important');
          console.log("✅ Close button hidden");
        }
      }, 50); // Small delay to let click handler complete
      
      // 7. Hide matters pointer box completely
      if (typeof window.hideMattersBoxCompletely === "function") {
        window.hideMattersBoxCompletely();
      }
      
      // 8. Hide evidence menu
      const evidenceMenuContainer = document.getElementById("Evidence_Menu_Container");
      if (evidenceMenuContainer) {
        evidenceMenuContainer.style.display = "none";
        evidenceMenuContainer.style.visibility = "hidden";
      }
      
      // 9. Deselect and reset ALL evidence icons
      const buttonMap = {
        extras: { default: "assets/icons/Print.png" },
        denials: { default: "assets/icons/denial.png" },
        emotional: { default: "assets/icons/broken-heart.png" },
        bankruptcy: { default: "assets/icons/bk-doc.png" },
        triggers: { default: "assets/icons/addl-evidence.png" },
        alerts: { default: "assets/icons/damaging-alerts.png" }
      };
      
      const allEvidenceIcons = document.querySelectorAll(".evidence-icon");
      allEvidenceIcons.forEach(icon => {
        const buttonType = icon.dataset.button;
        if (buttonType && buttonMap[buttonType]) {
          icon.src = buttonMap[buttonType].default;
          icon.classList.remove("selected");
        }
      });
      
      // 10. Clear any canvas content
      clearCanvasContent();
      
      // 11. REACTIVATE Report Viewer - Remove dim overlay
      if (typeof undimReportView === "function") undimReportView();
      if (typeof hideDimOverlay === "function") hideDimOverlay();
      
      // 12. REACTIVATE Canvas_Overlay_Box (violation boxes)
      const overlayBox = document.getElementById("Canvas_Overlay_Box");
      if (overlayBox) {
        overlayBox.classList.remove("dimmed");
        overlayBox.style.opacity = "0"; // Reset to default state
        overlayBox.style.pointerEvents = "auto";
      }
      
      // 13. REACTIVATE FCRA Review box and related elements
      const fcraPopup = document.getElementById("FCRA_Popup");
      const fcraButton = document.getElementById("FCRA_Button");
      const evidencePopupBox = document.getElementById("Evidence_Popup_Box");
      
      [fcraPopup, fcraButton, evidencePopupBox].forEach(element => {
        if (element) {
          element.style.display = "block";
          element.style.visibility = "visible";
          element.style.opacity = "1";
          element.style.pointerEvents = "auto";
        }
      });
      
      // 14. REACTIVATE creditor and bureau containers
      const creditorContainer = document.getElementById("Creditor_Logo_Container");
      const bureauContainer = document.getElementById("Bureau_Logo_Container");
      [creditorContainer, bureauContainer].forEach(container => {
        if (container) {
          container.style.pointerEvents = "auto";
          container.style.opacity = "1";
        }
      });
      
      // 15. REACTIVATE report viewer arrows
      const canvasArrows = [
        "Canvas_Arrow_Left", "Canvas_Arrow_Right", 
        "Canvas_Arrow_Group_Left", "Canvas_Arrow_Group_Right"
      ];
      canvasArrows.forEach(arrowId => {
        const arrow = document.getElementById(arrowId);
        if (arrow) {
          arrow.style.pointerEvents = "auto";
          arrow.style.opacity = "1";
        }
      });
      
      // 16. REACTIVATE violation counter
      const violationCount = document.getElementById("violation-count");
      if (violationCount) {
        violationCount.style.display = "block";
        violationCount.style.visibility = "visible";
      }
      
      // 17. Final cleanup - hide ANY remaining evidence buttons
      setTimeout(() => {
        const remainingEvidenceButtons = document.querySelectorAll(
          '.evidence-back-button, .evidence-close-button, ' +
          '[id*="Evidence_Back"], [id*="Evidence_Close"], ' +
          '[class*="back"], [class*="close"], ' +
          'img[src*="back"], img[src*="close"]'
        );
        
        console.log(`🧹 Final cleanup: Found ${remainingEvidenceButtons.length} potential evidence buttons`);
        remainingEvidenceButtons.forEach((btn, index) => {
          btn.style.setProperty('display', 'none', 'important');
          btn.style.setProperty('visibility', 'hidden', 'important');
          btn.style.setProperty('opacity', '0', 'important');
          console.log(`   - Hid button ${index + 1}: ${btn.id || btn.className || 'unnamed'}`);
        });
      }, 200);
      
      // 18. Update UI state to default
      if (typeof setUIState === "function") {
        setUIState("state-default");
      }
      
      console.log("✅ Evidence mode completely exited - Report viewer fully reactivated");
      
    } catch (error) {
      console.error("❌ Error in close button handler:", error);
    }
  }

  function removeBackButton() {
    console.log("🔧 removeBackButton() called");
    if (backButtonElement) {
      backButtonElement.style.setProperty('display', 'none', 'important');
      backButtonElement.style.setProperty('visibility', 'hidden', 'important');
      backButtonElement.style.setProperty('opacity', '0', 'important');
      backButtonElement.style.setProperty('pointer-events', 'none', 'important');
      console.log("✅ backButtonElement hidden");
    }
    
    // Also hide by ID as backup
    const backButtonById = document.getElementById("Evidence_Back_Button");
    if (backButtonById) {
      backButtonById.style.setProperty('display', 'none', 'important');
      backButtonById.style.setProperty('visibility', 'hidden', 'important');
      backButtonById.style.setProperty('opacity', '0', 'important');
      console.log("✅ Back button by ID hidden");
    }
  }

  function removeCloseButton() {
    console.log("🔧 removeCloseButton() called");
    if (closeButtonElement) {
      closeButtonElement.style.setProperty('display', 'none', 'important');
      closeButtonElement.style.setProperty('visibility', 'hidden', 'important');
      closeButtonElement.style.setProperty('opacity', '0', 'important');
      closeButtonElement.style.setProperty('pointer-events', 'none', 'important');
      console.log("✅ closeButtonElement hidden");
    }
    
    // Also hide by ID as backup
    const closeButtonById = document.getElementById("Evidence_Close_Button");
    if (closeButtonById) {
      closeButtonById.style.setProperty('display', 'none', 'important');
      closeButtonById.style.setProperty('visibility', 'hidden', 'important');
      closeButtonById.style.setProperty('opacity', '0', 'important');
      console.log("✅ Close button by ID hidden");
    }
  }

  function hideNavigationElements() {
    // Hide navigation arrows and heading
    const elements = [
      'Evidence_Arrow_Left',
      'Evidence_Arrow_Right',
      'Evidence_Arrow_Group_Left',
      'Evidence_Arrow_Group_Right',
      'Evidence_Heading_Container',
      'Evidence_Letter_Display'
    ];
    
    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = "none";
        element.style.visibility = "hidden";
      }
    });
  }

  function createAllButtons() {
    createBackButton();
    createCloseButton();
    
    // Ensure buttons are visible when created
    if (backButtonElement) {
      backButtonElement.style.display = "block";
      backButtonElement.style.visibility = "visible";
    }
    if (closeButtonElement) {
      closeButtonElement.style.display = "block";
      closeButtonElement.style.visibility = "visible";
    }
  }

  function removeAllButtons() {
    removeBackButton();
    removeCloseButton();
    hideNavigationElements();
  }

  function setEvidenceType(type, heading) {
    if (!type) {
      console.error('setEvidenceType called with undefined type');
      return;
    }
    currentEvidenceType = type;
    currentHeading = heading || type.toUpperCase();
  }

  function showEvidenceCanvasWithType(evidenceType) {
    // Show the evidence canvas
    if (typeof showEvidenceCanvas === "function") {
      showEvidenceCanvas();
    }
    
    // Create and show all buttons
    createAllButtons();
    
    // Set the evidence type for navigation
    setEvidenceType(evidenceType);
    
    // Ensure evidence menu is above matters box
    const evidenceMenu = document.getElementById("Evidence_Menu_Container");
    if (evidenceMenu) {
      evidenceMenu.style.zIndex = "202";
      evidenceMenu.style.position = "relative";
    }
    
    // Show navigation arrows
    if (typeof window.EvidenceNav !== "undefined") {
      window.EvidenceNav.forceShowArrows();
    }
  }

  // Clear all link highlights globally
  function clearAllLinkHighlights() {
    const allLinks = document.querySelectorAll('#Evidence_Link_List a');
    allLinks.forEach(link => link.classList.remove('selected'));
    console.log("🧹 All link highlights cleared");
  }

  // Update arrow states based on context
  function updateArrowStates() {
    // Standard arrows - disabled when no link selected
    const standardArrows = [
      document.getElementById('Evidence_Nav_Left'),
      document.getElementById('Evidence_Nav_Right')
    ];
    
    standardArrows.forEach(arrow => {
      if (arrow) {
        arrow.style.opacity = '0.5';
        arrow.style.pointerEvents = 'none';
      }
    });
    
    // Group arrows - always enabled
    const groupArrows = [
      document.getElementById('Evidence_Nav_Group_Left'),
      document.getElementById('Evidence_Nav_Group_Right')
    ];
    
    groupArrows.forEach(arrow => {
      if (arrow) {
        arrow.style.opacity = '1';
        arrow.style.pointerEvents = 'auto';
      }
    });
  }
  
  // Add fade transition when returning to menu
  function addFadeTransition() {
    const canvasContainer = document.getElementById('Evidence_Canvas_Container');
    if (canvasContainer) {
      canvasContainer.style.transition = 'opacity 0.3s ease-in-out';
      canvasContainer.style.opacity = '0';
      
      setTimeout(() => {
        canvasContainer.style.opacity = '1';
      }, 50);
    }
  }

  // Handle letter click with enhanced behavior
  function handleLetterClick(letter) {
    console.log('🎯 Letter clicked:', letter);
    
    try {
      // 1. Show matters box on top
      if (typeof showMattersBox === 'function') {
        showMattersBox();
        // Ensure matters box is on top
        const mattersBox = document.getElementById('Matters_Box');
        if (mattersBox) {
          mattersBox.style.zIndex = '1000';
          mattersBox.style.position = 'relative';
        }
      }
      
      // 2. Hide evidence menu and heading
      const menuContainer = document.getElementById('Evidence_Menu_Container');
      const headingContainer = document.getElementById('Evidence_Heading_Container');
      
      if (menuContainer) {
        menuContainer.style.display = 'none';
        menuContainer.style.visibility = 'hidden';
        menuContainer.style.opacity = '0';
        menuContainer.style.zIndex = '100'; // Lower z-index than matters box
      }
      
      if (headingContainer) {
        headingContainer.style.display = 'none';
        headingContainer.style.visibility = 'hidden';
        headingContainer.style.opacity = '0';
        headingContainer.style.zIndex = '100'; // Lower z-index than matters box
      }
      
      // 3. Keep evidence button selected
      const currentButton = document.querySelector(`.evidence-button[data-button="${currentEvidenceType}"]`);
      if (currentButton) {
        currentButton.classList.add('selected');
      }
      
      // 4. Show letter content
      if (typeof window.EvidenceActual !== 'undefined') {
        window.EvidenceActual.showDocument(letter);
      }
      
      // 5. Update UI state
      if (typeof setUIState === 'function') {
        setUIState('state-evidence-document');
      }
      
    } catch (error) {
      console.error('Error in letter click handler:', error);
    }
  }

  // Public API
  return {
    createBackButton,
    createCloseButton,
    createAllButtons,
    removeBackButton,
    removeCloseButton,
    removeAllButtons,
    showEvidenceCanvasWithType,
    setEvidenceType,
    populateCanvasContent,
    clearCanvasContent,
    showPlaceholderState,
    clearAllLinkHighlights
  };
})();

// Make available globally
// Make functions available globally
window.EvidenceCanvasContent = EvidenceCanvasContent;
window.clearAllLinkHighlights = EvidenceCanvasContent.clearAllLinkHighlights;