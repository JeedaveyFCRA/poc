// evidence-buttons.js
// Handles hover glow and selected state logic for the Evidence Icon Bar

const buttonMap = {
  extras: {
    default: "assets/icons/Print.png",
    selected: "assets/icons/Print-selected.png"
  },
  denials: {
    default: "assets/icons/denial.png",
    selected: "assets/icons/denial-selected.png"
  },
  emotional: {
    default: "assets/icons/broken-heart.png",
    selected: "assets/icons/broken-heart-selected.png"
  },
  bankruptcy: {
    default: "assets/icons/bk-doc.png",
    selected: "assets/icons/bk-doc-selected.png"
  },
  triggers: {
    default: "assets/icons/addl-evidence.png",
    selected: "assets/icons/addl-evidence-selected.png"
  },
  alerts: {
    default: "assets/icons/damaging-alerts.png",
    selected: "assets/icons/damaging-alerts-selected.png"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const allIcons = document.querySelectorAll(".evidence-icon");
  let selectedIcon = null;

  // Function to reset evidence menu state
  function resetEvidenceState() {
    console.log("Resetting evidence state");
    
    // Reset navigation state and hide arrows
    if (typeof window.EvidenceNav !== "undefined") {
      window.EvidenceNav.hideArrows();
      window.EvidenceNav.resetNavigationState();
    }
    
    // Clear link highlights
    clearAllLinkHighlights();
    
    // Hide evidence menu
    const evidenceMenuContainer = document.getElementById("Evidence_Menu_Container");
    if (evidenceMenuContainer) {
      evidenceMenuContainer.style.display = "none";
    }
    
    // Hide evidence heading container (which contains arrows)
    const evidenceHeadingContainer = document.getElementById("Evidence_Heading_Container");
    if (evidenceHeadingContainer) {
      evidenceHeadingContainer.style.display = "none";
    }
    
    // Deselect icon if one was selected
    if (selectedIcon) {
      selectedIcon.src = buttonMap[selectedIcon.dataset.button].default;
      selectedIcon.classList.remove("selected");
      selectedIcon = null;
    }

    // Undim the report view
    if (typeof undimReportView === "function") undimReportView();
    if (typeof hideDimOverlay === "function") hideDimOverlay();

    // Hide matters box if visible
    if (typeof hideMattersBoxCompletely === "function") {
      hideMattersBoxCompletely();
    }

    // Ensure Canvas_Overlay_Box is not dimmed
    const overlayBox = document.getElementById("Canvas_Overlay_Box");
    if (overlayBox) {
      overlayBox.classList.remove("dimmed");
      overlayBox.style.opacity = "0";
    }

    // Show violation counter
    const violationCount = document.getElementById("violation-count");
    if (violationCount) {
      violationCount.style.display = "block";
    }

    // Show FCRA components when evidence menu is closed
    const fcraPopup = document.getElementById("FCRA_Popup");
    const fcraButton = document.getElementById("FCRA_Button");
    const evidencePopupBox = document.getElementById("Evidence_Popup_Box");
    
    // Restore all FCRA-related elements
    [fcraPopup, fcraButton, evidencePopupBox].forEach(element => {
      if (element) {
        element.style.display = "block";
        element.style.visibility = "visible";
        element.style.opacity = "1";
      }
    });
  }

  // Handle evidence button clicks
  allIcons.forEach(icon => {
    const key = icon.dataset.button;
    const parent = icon.closest(".evidence-button");

    // Handle hover state
    parent.addEventListener("mouseenter", () => {
      if (!icon.classList.contains("selected")) {
        icon.src = buttonMap[key].selected;
      }
    });

    parent.addEventListener("mouseleave", () => {
      if (!icon.classList.contains("selected")) {
        icon.src = buttonMap[key].default;
      }
    });

    // Handle click state
    parent.addEventListener("click", async (e) => {
      e.stopPropagation(); // Prevent click from bubbling to document
      console.log("Evidence button clicked:", key);
      
      // CRITICAL: Reset evidence state when switching evidence buttons
      // Clear any previous letter content and UI components
      if (typeof window.EvidenceActual !== "undefined") {
        window.EvidenceActual.hideDocument(); // Always hide, regardless of visibility state
        console.log("🧹 Previous letter content cleared");
      }
      
      // Also directly clear Evidence_Actual_Container to be absolutely sure
      const actualContainer = document.getElementById("Evidence_Actual_Container");
      if (actualContainer) {
        actualContainer.style.display = "none";
        actualContainer.style.visibility = "hidden";
        actualContainer.style.opacity = "0";
        console.log("🧹 Evidence_Actual_Container force hidden");
      }
      
      // Hide matters box when switching evidence categories
      if (typeof window.hideMattersBoxCompletely === "function") {
        window.hideMattersBoxCompletely();
      }
      
      // Clear any previous canvas content
      if (typeof window.EvidenceCanvasContent !== "undefined") {
        window.EvidenceCanvasContent.clearCanvasContent();
      }
      
      // Clear any selected link highlights
      clearAllLinkHighlights();
      
      // Reset navigation state when switching evidence categories
      if (typeof window.EvidenceNav !== "undefined") {
        window.EvidenceNav.resetNavigationState();
      }
      
      // Hide FCRA components when evidence menu is shown
      const fcraPopup = document.getElementById("FCRA_Popup");
      const fcraButton = document.getElementById("FCRA_Button");
      const evidencePopupBox = document.getElementById("Evidence_Popup_Box");
      
      // Completely hide all FCRA-related elements
      [fcraPopup, fcraButton, evidencePopupBox].forEach(element => {
        if (element) {
          element.style.display = "none";
          element.style.visibility = "hidden";
          element.style.opacity = "0";
        }
      });
      
      // Deselect previous icon if exists
      if (selectedIcon && selectedIcon !== icon) {
        selectedIcon.src = buttonMap[selectedIcon.dataset.button].default;
        selectedIcon.classList.remove("selected");
      }

      // Select current icon
      icon.src = buttonMap[key].selected;
      icon.classList.add("selected");
      selectedIcon = icon;

      // Update the heading text based on the button type
      try {
        const response = await fetch('data/evidence-data.json');
        const data = await response.json();
        const headingText = document.getElementById('Evidence_Heading_Text');
        if (headingText && data[key] && data[key].heading) {
          headingText.textContent = data[key].heading;
        }
      } catch (error) {
        console.error('Error loading evidence data for heading:', error);
      }

      // Apply dim overlay
      if (typeof dimReportView === "function") dimReportView();
      if (typeof showDimOverlay === "function") showDimOverlay();

      // Dim the Canvas_Overlay_Box
      const overlayBox = document.getElementById("Canvas_Overlay_Box");
      if (overlayBox) {
        overlayBox.classList.add("dimmed");
      }

      // Load evidence menu
      if (typeof loadEvidenceMenu === "function") {
        loadEvidenceMenu(key);
      } else {
        console.error("loadEvidenceMenu function not found!");
      }
    });
  });

  // Add click handler for the report viewer area
  const reportViewerArea = document.getElementById("Image_Canvas_Container");
  if (reportViewerArea) {
    reportViewerArea.addEventListener("click", (e) => {
      // Check if click is on or inside a violation box
      const isViolationClick = e.target.closest('.violation-overlay');
      
      // Always reset evidence state when clicking in report viewer
      resetEvidenceState();
      
      // If this was a violation click, let the event continue to trigger violation handling
      if (!isViolationClick) {
        e.stopPropagation();
      }
    });
  }

  // Add click handlers for other areas that should reset evidence state
  ["Creditor_Logo_Container", "Bureau_Logo_Container"].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", () => {
        resetEvidenceState();
      });
    }
  });

  // Add global click handler to reset state when clicking outside
  document.addEventListener("click", (e) => {
    // Don't reset if clicking within evidence-related containers when evidence is active
    const evidenceContainers = [
      "#Evidence_Menu_Container",
      "#Evidence_Canvas_Container", 
      "#Evidence_Actual_Container",
      "#Matters_Box",
      "#Evidence_Heading_Container",
      ".evidence-button",
      ".evidence-back-button",
      ".evidence-close-button",
      ".evidence-arrow"
    ];
    
    // Check if click is within any evidence container
    const isEvidenceClick = evidenceContainers.some(selector => e.target.closest(selector));
    
    // Check if evidence functionality is currently active
    const isEvidenceActive = document.querySelector('.evidence-icon.selected') ||
                           document.getElementById('Evidence_Menu_Container')?.style.display !== 'none' ||
                           document.getElementById('Evidence_Canvas_Container')?.style.display !== 'none' ||
                           document.getElementById('Evidence_Actual_Container')?.style.display !== 'none' ||
                           document.getElementById('Matters_Box')?.style.display !== 'none';
    
    // If evidence is active and click is on gradient background, don't reset
    if (isEvidenceActive && e.target.id === 'Background_Gradient_Tint') {
      console.log("🎯 Click on gradient background while evidence active - keeping evidence open");
      return;
    }
    
    // If evidence is active and click is on body/html but not specific interface elements, don't reset  
    if (isEvidenceActive && (e.target === document.body || e.target === document.documentElement)) {
      console.log("🎯 Click on background while evidence active - keeping evidence open");
      return;
    }
    
    // Don't reset if clicking within evidence containers
    if (!isEvidenceClick) {
      // Only reset if clicking on specific interface elements that should close evidence
      const shouldCloseElements = [
        "#Image_Canvas_Container",
        "#Creditor_Logo_Container", 
        ".bureau-logo-container",
        "#Canvas_Heading_Container"
      ];
      
      const shouldClose = shouldCloseElements.some(selector => e.target.closest(selector));
      
      if (shouldClose) {
        console.log("🔄 Resetting evidence state - clicked on interface element");
        resetEvidenceState();
      }
    }
  });
});

function resetToDefaultState() {
  if (typeof undimReportView === "function") undimReportView();
  if (typeof window.deselectEvidenceIcons === "function") window.deselectEvidenceIcons();
  if (typeof hideDimOverlay === "function") hideDimOverlay();
  if (typeof resetEvidenceMenu === "function") resetEvidenceMenu();
  if (typeof window.hideMattersBoxCompletely === "function") window.hideMattersBoxCompletely();

  // Restore Canvas_Overlay_Box to default state with bulletproof approach
  const overlayBox = document.getElementById("Canvas_Overlay_Box");
  if (overlayBox) {
    overlayBox.removeAttribute("style");
    overlayBox.classList.remove("dimmed");
    
    // Double-check the styling is removed (fallback)
    setTimeout(() => {
      if (overlayBox && overlayBox.classList.contains("dimmed")) {
        overlayBox.classList.remove("dimmed");
      }
    }, 10);
  }

  // Show all counters when returning to default state
  const allCounters = document.querySelectorAll('#violation-count, .sys-wide-counter');
  allCounters.forEach(counter => {
    counter.removeAttribute("style");
    counter.style.cssText = `
      position: absolute;
      color: #253541;
      font-family: "jaf-bernino-sans-comp", sans-serif;
      font-weight: 800;
      font-style: normal;
      font-size: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    `;
  });
}

window.deselectEvidenceIcons = () => {
  const allIcons = document.querySelectorAll(".evidence-icon");
  allIcons.forEach(icon => {
    const key = icon.dataset.button;
    if (buttonMap[key]) {
      icon.src = buttonMap[key].default;
      icon.classList.remove("selected");
    }
  });
};

// Clear all link highlights in evidence menus
function clearAllLinkHighlights() {
  const allLinks = document.querySelectorAll('#Evidence_Link_List a');
  allLinks.forEach(link => {
    link.classList.remove('selected');
  });
}

// Make function globally available
window.clearAllLinkHighlights = clearAllLinkHighlights;