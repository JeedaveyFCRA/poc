// evidence-canvas.js (final fix with delayed render)

function initializeCanvas() {
  // Create canvas container if it doesn't exist
  let evidenceCanvas = document.getElementById("Evidence_Canvas_Container");
  if (!evidenceCanvas) {
    evidenceCanvas = document.createElement("div");
    evidenceCanvas.id = "Evidence_Canvas_Container";
    evidenceCanvas.className = "evidence-canvas-container";
    document.body.appendChild(evidenceCanvas);
  }

  // Don't create or manipulate heading elements here
  // Let evidence-menu.js handle all heading-related functionality
}

function createEvidenceCanvas() {
  let evidenceCanvas = document.getElementById("Evidence_Canvas_Container");

  if (!evidenceCanvas) {
    evidenceCanvas = document.createElement("div");
    evidenceCanvas.id = "Evidence_Canvas_Container";
    evidenceCanvas.className = "evidence-canvas-container";
    evidenceCanvas.style.display = "none";
    document.body.appendChild(evidenceCanvas);
    console.log("Evidence canvas container created");

    // Create heading container if it doesn't exist
    let headingContainer = document.getElementById("Evidence_Heading_Container");
    if (!headingContainer) {
      headingContainer = document.createElement("div");
      headingContainer.id = "Evidence_Heading_Container";
      headingContainer.style.display = "none";
      document.body.appendChild(headingContainer);

      const headingBackground = document.createElement("div");
      headingBackground.id = "Evidence_Heading_Background";
      
      const headingText = document.createElement("h2");
      headingText.id = "Evidence_Heading_Text";
      
      headingBackground.appendChild(headingText);
      headingContainer.appendChild(headingBackground);
    }
  }

  return evidenceCanvas;
}

function showMattersBox(entryId = 'rocket-referral') {
  console.log("Showing matters box for entry:", entryId);
  
  const popupBox = document.getElementById("Evidence_Popup_Box");
  const evidenceMenuContainer = document.getElementById("Evidence_Menu_Container");

  // Hide evidence menu completely
  if (evidenceMenuContainer) {
    evidenceMenuContainer.style.display = "none";
    evidenceMenuContainer.style.visibility = "hidden";
    evidenceMenuContainer.style.opacity = "0";
  }

  if (popupBox) popupBox.style.display = "none";

  // Ensure canvas is created
  createEvidenceCanvas();

  let mattersBox = document.getElementById("Matters_Box");
  if (!mattersBox) {
    console.log("Creating new matters box");
    mattersBox = document.createElement("div");
    mattersBox.id = "Matters_Box";
    mattersBox.style.cssText = `
      position: absolute !important;
      top: 256px !important;
      left: 780px !important;
      width: 380px !important;
      height: 790px !important;
      background-color: transparent !important;
      z-index: 200 !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;

    // Create matters background image
    const mattersImage = document.createElement("img");
    mattersImage.src = "assets/icons/matters-pointer-box.png";
    mattersImage.alt = "Why This Matters";
    mattersImage.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      z-index: 200 !important;
    `;
    
    // Ensure image loads properly
    mattersImage.onload = function() {
      console.log("✅ matters-pointer-box.png loaded successfully");
    };
    mattersImage.onerror = function() {
      console.error("❌ Failed to load matters-pointer-box.png");
    };
    
    // Create content container
    const contentDiv = document.createElement("div");
    contentDiv.id = "matters-pointer-box";
    contentDiv.style.cssText = `
      position: absolute !important;
      top: 40px !important;
      left: 28px !important;
      width: calc(100% - 78px) !important;
      height: calc(100% - 80px) !important;
      padding: 0 18px !important;
      box-sizing: border-box !important;
      font-family: 'Space Grotesk', sans-serif !important;
      color: rgba(0, 0, 0, 0.9) !important;
      overflow: auto !important;
      z-index: 201 !important;
      display: block !important;
      visibility: visible !important;
    `;

    mattersBox.appendChild(mattersImage);
    mattersBox.appendChild(contentDiv);
    document.body.appendChild(mattersBox);
    console.log("✅ Matters box created and appended to body");
  } else {
    console.log("Updating existing matters box");
    // Force update existing matters box
    mattersBox.style.cssText = `
      position: absolute !important;
      top: 256px !important;
      left: 780px !important;
      width: 380px !important;
      height: 790px !important;
      background-color: transparent !important;
      z-index: 200 !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    
    // Ensure the image is present and properly configured
    const mattersImage = mattersBox.querySelector('img');
    if (mattersImage) {
      mattersImage.src = "assets/icons/matters-pointer-box.png";
      mattersImage.style.cssText = `
        width: 100% !important;
        height: 100% !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 200 !important;
      `;
    }
    
    // Ensure content div exists and is properly styled
    const contentDiv = mattersBox.querySelector('#matters-pointer-box');
    if (contentDiv) {
      contentDiv.style.cssText = `
        position: absolute !important;
        top: 40px !important;
        left: 28px !important;
        width: calc(100% - 78px) !important;
        height: calc(100% - 80px) !important;
        padding: 0 18px !important;
        box-sizing: border-box !important;
        font-family: 'Space Grotesk', sans-serif !important;
        color: rgba(0, 0, 0, 0.9) !important;
        overflow: auto !important;
        z-index: 201 !important;
        display: block !important;
        visibility: visible !important;
      `;
    }
  }

  // Force the UI state to matters view
  document.body.classList.remove('state-default', 'state-evidence-menu');
  document.body.classList.add('state-matters-view');
  
  // Show evidence canvas
  showEvidenceCanvas();
  
  // Ensure MattersRenderer populates content after DOM is ready
  setTimeout(() => {
    if (typeof MattersRenderer !== "undefined") {
      console.log("🎯 Calling MattersRenderer for entry:", entryId);
      MattersRenderer.render(entryId);
    }
  }, 150);
  
  console.log("✅ Matters box should now be visible with matters-pointer-box.png background");
}

function showEvidenceCanvas() {
  console.log("showEvidenceCanvas() called");

  createEvidenceCanvas();

  const evidenceCanvas = document.getElementById("Evidence_Canvas_Container");
  console.log("Evidence canvas element:", evidenceCanvas);
  if (evidenceCanvas) {
    evidenceCanvas.style.display = "block";
    evidenceCanvas.style.visibility = "visible";
    console.log("Evidence canvas should now be visible");
    
    // Show heading container
    const headingContainer = document.getElementById("Evidence_Heading_Container");
    if (headingContainer) {
      headingContainer.style.display = "block";
      headingContainer.style.visibility = "visible";
    }
    
    // Create both back and close buttons when evidence canvas is shown
    if (typeof EvidenceCanvasContent !== "undefined") {
      EvidenceCanvasContent.createAllButtons();
    }

    // Update heading based on current evidence type
    if (typeof EvidenceNavigation !== "undefined") {
      const currentType = document.querySelector('.evidence-button.active')?.dataset?.button;
      if (currentType) {
        EvidenceNavigation.setEvidenceType(currentType);
      }
    }
  } else {
    console.log("ERROR: Evidence_Canvas_Container element not found!");
  }
}

function hideEvidenceCanvas() {
  const evidenceCanvas = document.getElementById("Evidence_Canvas_Container");
  const headingContainer = document.getElementById("Evidence_Heading_Container");
  
  if (evidenceCanvas) {
    evidenceCanvas.style.display = "none";
  }
  
  if (headingContainer) {
    headingContainer.style.display = "none";
  }
  
  // Remove both buttons when evidence canvas is hidden
  if (typeof EvidenceCanvasContent !== "undefined") {
    EvidenceCanvasContent.removeAllButtons();
  }
}

function hideMattersBox() {
  const mattersBox = document.getElementById("Matters_Box");
  const evidenceMenuContainer = document.getElementById("Evidence_Menu_Container");

  if (mattersBox) {
    mattersBox.style.display = "none";
    mattersBox.style.visibility = "hidden";
  }
  if (evidenceMenuContainer) {
    evidenceMenuContainer.style.display = "block";
    evidenceMenuContainer.style.zIndex = "202";
  }

  hideEvidenceCanvas();
}

function hideMattersBoxCompletely() {
  const mattersBox = document.getElementById("Matters_Box");
  if (mattersBox) {
    mattersBox.style.display = "none";
    mattersBox.style.visibility = "hidden";
  }

  hideEvidenceCanvas();
}

window.hideMattersBoxCompletely = hideMattersBoxCompletely;
window.showEvidenceCanvas = showEvidenceCanvas;
window.hideEvidenceCanvas = hideEvidenceCanvas;
window.createEvidenceCanvas = createEvidenceCanvas;
window.showMattersBox = showMattersBox;