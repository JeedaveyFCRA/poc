// evidence-menu.js
// Evidence menu system with proper variable scoping

(function() {
  'use strict';
  
  let currentButtonKey = ''; // Scoped to this module only
  
  // UI State Management
  const UI_STATES = {
    DEFAULT: 'state-default',
    EVIDENCE_MENU: 'state-evidence-menu',
    MATTERS_VIEW: 'state-matters-view'
  };

  let currentUIState = UI_STATES.DEFAULT;
  let stateTransitionTimeout = null;

  function setUIState(newState) {
    // Clear any pending state transitions
    if (stateTransitionTimeout) {
      clearTimeout(stateTransitionTimeout);
    }

    // Remove all state classes
    document.body.classList.remove(...Object.values(UI_STATES));
    // Add new state class
    document.body.classList.add(newState);
    currentUIState = newState;
    
    // Update z-indices based on state
    const zIndexMap = {
      [UI_STATES.DEFAULT]: {
        evidenceMenu: 150,
        evidenceContent: 151,
        mattersBox: 0,
        mattersContent: 0,
        evidenceCanvas: 0,
        evidenceHeading: 0,
        fcraReview: 15,
        fcraButton: 16
      },
      [UI_STATES.EVIDENCE_MENU]: {
        evidenceMenu: 202,
        evidenceContent: 203,
        mattersBox: 0,
        mattersContent: 0,
        evidenceCanvas: 201,
        evidenceHeading: 204,
        fcraReview: 15,
        fcraButton: 16
      },
      [UI_STATES.MATTERS_VIEW]: {
        evidenceMenu: 150,
        evidenceContent: 151,
        mattersBox: 200,
        mattersContent: 201,
        evidenceCanvas: 199,
        evidenceHeading: 204,
        fcraReview: 15,
        fcraButton: 16
      }
    };

    // Apply z-indices immediately
    const indices = zIndexMap[newState];
    if (indices) {
      const evidenceMenu = document.getElementById('Evidence_Menu_Container');
      const evidenceContent = document.getElementById('Evidence_Menu_Content');
      const mattersBox = document.getElementById('Matters_Box');
      const mattersContent = document.getElementById('matters-pointer-box');
      const evidenceCanvas = document.getElementById('Evidence_Canvas_Container');
      const evidenceHeading = document.getElementById('Evidence_Heading_Container');
      const fcraReview = document.getElementById('FCRA_Popup');
      const fcraButton = document.getElementById('FCRA_Button');

      if (evidenceMenu) {
        evidenceMenu.style.zIndex = indices.evidenceMenu;
        evidenceMenu.style.visibility = indices.evidenceMenu === 0 ? 'hidden' : 'visible';
      }
      if (evidenceContent) {
        evidenceContent.style.zIndex = indices.evidenceContent;
        evidenceContent.style.visibility = indices.evidenceContent === 0 ? 'hidden' : 'visible';
      }
      if (mattersBox) {
        mattersBox.style.zIndex = indices.mattersBox;
        mattersBox.style.visibility = indices.mattersBox === 0 ? 'hidden' : 'visible';
      }
      if (mattersContent) {
        mattersContent.style.zIndex = indices.mattersContent;
        mattersContent.style.visibility = indices.mattersContent === 0 ? 'hidden' : 'visible';
      }
      if (evidenceCanvas) {
        evidenceCanvas.style.zIndex = indices.evidenceCanvas;
        evidenceCanvas.style.visibility = indices.evidenceCanvas === 0 ? 'hidden' : 'visible';
      }
      if (evidenceHeading) {
        evidenceHeading.style.zIndex = indices.evidenceHeading;
        evidenceHeading.style.visibility = indices.evidenceHeading === 0 ? 'hidden' : 'visible';
      }
      // Always keep FCRA components visible with their proper z-indices
      if (fcraReview) {
        fcraReview.style.zIndex = indices.fcraReview;
        fcraReview.style.visibility = 'visible';
        fcraReview.style.display = 'block';
      }
      if (fcraButton) {
        fcraButton.style.zIndex = indices.fcraButton;
        fcraButton.style.visibility = 'visible';
        fcraButton.style.display = 'block';
      }
    }
  }

  // Updated button mapping to match new structure
  const buttonMap = {
    'denials': 'Credit Denials',
    'emotional': 'Emotional Impact',
    'bankruptcy': 'Bankruptcy Documents',
    'alerts': 'Damaging Alerts',
    'triggers': 'Timeline Triggers',
    'extras': 'Additional Evidence'
  };

  function hideAllViews() {
    const views = [
      "Evidence_Canvas_Container",
      "Evidence_Heading_Container",
      "Evidence_Letter_Display",
      "Matters_Box",
      "Evidence_Menu_Container",
      "Evidence_Document_Container",
      "FCRA_Popup",
      "FCRA_Button",
      "SysWide_FCRA_Popup",
      "Close_Button",
      "Close_Button_Hover"
    ];
    
    views.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = "none";
        element.style.visibility = "hidden";
      }
    });

    // Reset UI state when hiding views
    setUIState(UI_STATES.DEFAULT);
  }

  async function loadEvidenceMenu(buttonKey) {
    currentButtonKey = buttonKey; // Store the button key
    
    // Clear all views first
    hideAllViews();
    
    console.log("Loading evidence menu for category:", buttonKey);
    
    // Hide evidence document if visible
    if (typeof window.EvidenceActual !== "undefined" && window.EvidenceActual.isVisible()) {
      window.EvidenceActual.hideDocument();
    }
    
    // Remove any existing menu
    const existing = document.getElementById("Evidence_Menu_Container");
    if (existing) existing.remove();

    try {
      // Load both evidence map and data
      const [mapResponse, dataResponse] = await Promise.all([
        fetch("data/evidence-map.json"),
        fetch("data/evidence-data.json")
      ]);
      
      const map = await mapResponse.json();
      const data = await dataResponse.json();
      
      const entries = map[buttonKey] || [];
      const typeData = data[buttonKey] || {};

      // Set initial evidence type heading (this will be shown when links are clicked)
      const headingText = document.getElementById('Evidence_Heading_Text');
      if (headingText && typeData.heading) {
        headingText.textContent = typeData.heading;
      }
      
      // Show the "Content not selected" message for manual button clicks
      if (typeof window.EvidenceNav !== "undefined") {
        window.EvidenceNav.showContentNotSelectedMessage();
      }
      
      // Show evidence navigation arrows in initial state (group arrows enabled, single arrows disabled)
      if (typeof window.EvidenceNav !== "undefined") {
        window.EvidenceNav.showInitialState();
      }

      // Create menu container
      const menuContainer = document.createElement("div");
      menuContainer.id = "Evidence_Menu_Container";
      menuContainer.className = "evidence-menu-container";
      menuContainer.style.position = "absolute";
      menuContainer.style.top = "255.5px";
      menuContainer.style.left = "801.5px";
      menuContainer.style.width = "381px";
      menuContainer.style.height = "791.082px";
      menuContainer.style.zIndex = "202";
      
      // Create menu background
      const menuBg = document.createElement("img");
      menuBg.src = "assets/icons/evidence-popup.png";
      menuBg.alt = "Evidence Popup Frame";
      menuBg.style.width = "100%";
      menuBg.style.height = "100%";
      menuBg.style.position = "absolute";
      menuContainer.appendChild(menuBg);
      
      // Create menu content container
      const menuContent = document.createElement("div");
      menuContent.id = "Evidence_Menu_Content";
      menuContent.style.position = "relative";
      menuContent.style.zIndex = "203";
      menuContent.style.padding = "20px";
      
      // Create menu header
      const menuHeader = document.createElement("h2");
      menuHeader.textContent = typeData.heading || buttonMap[buttonKey] || 'Evidence Overview';
      menuContent.appendChild(menuHeader);
      
      // Add description paragraphs
      const descP1 = document.createElement("p");
      descP1.textContent = "These documents provide critical support beyond what appears on your credit report. Each one links to a key email, denial, or confirmation that exposes creditor misconduct, systemic reporting failures, or direct financial harm.";
      menuContent.appendChild(descP1);
      
      const descP2 = document.createElement("p");
      const strongText = document.createElement("strong");
      strongText.textContent = "Click any title to view the full document, along with a summary of why it matters to your case.";
      descP2.appendChild(strongText);
      menuContent.appendChild(descP2);
      
      // Create link list
      const linkList = document.createElement("ul");
      linkList.id = "Evidence_Link_List";
      linkList.className = "evidence-link-list";
      
      if (linkList) {
        entries.forEach(entry => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = "#";
          link.textContent = entry.title;
          link.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Clear all previous link selections in this menu
            const allLinks = document.querySelectorAll('#Evidence_Link_List a');
            allLinks.forEach(l => l.classList.remove('selected'));
            
            // Highlight this link as selected (red state)
            link.classList.add('selected');

            // Get current evidence type and heading
            const currentType = document.querySelector('.evidence-icon.selected')?.dataset?.button;
            const headingText = data[currentType]?.heading || currentType?.toUpperCase();

            // CRITICAL: Force show the Evidence_Heading_Container first (parent of arrows)
            const headingContainer = document.getElementById('Evidence_Heading_Container');
            const headingTextElement = document.getElementById('Evidence_Heading_Text');
            if (headingContainer) {
              // Force-show parent container so arrows become visible
              headingContainer.style.setProperty('display', 'block', 'important');
              headingContainer.style.setProperty('visibility', 'visible', 'important');
              headingContainer.style.setProperty('opacity', '1', 'important');
              headingContainer.style.setProperty('z-index', '400', 'important');
              headingContainer.style.setProperty('position', 'relative', 'important');
              
              // Update heading text to show current evidence type (not "No letter selected")
              if (headingTextElement && headingText) {
                headingTextElement.textContent = headingText;
              }
              
              console.log("🎯 Evidence_Heading_Container forced visible for arrow display");
            }

            // CRITICAL: Clear placeholder content from Evidence_Canvas_Container
            const canvasContainer = document.getElementById("Evidence_Canvas_Container");
            if (canvasContainer) {
              canvasContainer.style.display = "none";
              canvasContainer.innerHTML = '';
              console.log("🧹 Placeholder content cleared from canvas container");
            }

            // Show fresh evidence navigation arrows and enable navigation
            if (typeof window.EvidenceNav !== "undefined") {
              console.log("🎯 Showing fresh evidence navigation arrows");
              window.EvidenceNav.forceShowArrows();
              
              // Update navigation state with current type and links
              const links = document.querySelectorAll('#Evidence_Link_List a');
              window.EvidenceNav.updateCurrentState(currentType, links);
              
              // Enable navigation now that a real link has been selected
              window.EvidenceNav.enableNavigation();
            } else {
              console.error("❌ EvidenceNav not available");
            }

            // Show the evidence canvas with this type
            if (typeof window.EvidenceCanvasContent !== "undefined") {
              window.EvidenceCanvasContent.showEvidenceCanvasWithType(currentType);
            }

            // Show the document
            if (typeof window.EvidenceActual !== "undefined") {
              window.EvidenceActual.showDocument(entry.id);
            }

            // Show matters box
            if (typeof showMattersBox === "function") {
              showMattersBox(entry.id);
            }
          });
          
          li.appendChild(link);
          linkList.appendChild(li);
        });
        
        menuContent.appendChild(linkList);
        menuContainer.appendChild(menuContent);
        document.body.appendChild(menuContainer);
        
        // Ensure menu is visible
        menuContainer.style.display = "block";
        menuContainer.style.visibility = "visible";
        menuContainer.style.opacity = "1";
      }
    } catch (error) {
      console.error("Error loading evidence menu:", error);
    }
  }

  function resetEvidenceMenu() {
    hideAllViews();
    currentButtonKey = '';
    
    // Reset navigation state when evidence menu is closed
    if (typeof window.EvidenceNav !== "undefined") {
      window.EvidenceNav.resetNavigationState();
    }
  }

  function isEvidenceMenuActive() {
    return currentUIState === UI_STATES.EVIDENCE_MENU;
  }

  // Export functions to global scope
  window.loadEvidenceMenu = loadEvidenceMenu;
  window.resetEvidenceMenu = resetEvidenceMenu;
  window.isEvidenceMenuActive = isEvidenceMenuActive;
  window.setUIState = setUIState;
})();

// Event listeners for interface elements
document.addEventListener('DOMContentLoaded', function() {
  const interfaceElements = [
    "Image_Canvas_Container",
    "Creditor_Logo_Container",
    "Bureau_Logo_Container_EQ",
    "Bureau_Logo_Container_EX",
    "Bureau_Logo_Container_TU"
  ];
  
  interfaceElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", (e) => {
        // Check if evidence functionality is currently active
        const isEvidenceActive = document.querySelector('.evidence-icon.selected') ||
                               document.getElementById('Evidence_Menu_Container')?.style.display !== 'none' ||
                               document.getElementById('Evidence_Canvas_Container')?.style.display !== 'none' ||
                               document.getElementById('Evidence_Actual_Container')?.style.display !== 'none' ||
                               document.getElementById('Matters_Box')?.style.display !== 'none';
        
        // Only reset evidence menu if evidence is actually active
        if (isEvidenceActive && typeof window.resetEvidenceMenu !== "undefined") {
          console.log(`🔄 Resetting evidence menu - clicked on ${id}`);
          window.resetEvidenceMenu();
        }
      });
    }
  });
});