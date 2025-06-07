// creditor-logo.js
// Dynamically loads the correct creditor logo based on the PNG filename prefix (e.g., AL)

function setCreditorLogo(filename) {
  // Extract the first two letters from the filename to determine creditor code
  const creditorCode = filename.split("-")[0];

  // Full map of all 13 known creditor codes to logo filenames
  const logoMap = {
    "AL": "Ally_Financial.svg",
    "BK": "Bank_of_America.svg",
    "BY": "Barclays.svg",
    "BB": "BestBuy_Citibank.svg",
    "C1": "Citizens_1.svg",
    "C2": "Citizens_2.svg",
    "CR": "Cornerstone.svg",
    "DB": "Discover_Bank.svg",
    "DL": "Discover_Loans.svg",
    "JP": "JPMorgan.svg",
    "MF": "Mariner_Finance.svg",
    "SR": "Sears_Citibank.svg",
    "HD": "THD_Citibank.svg"
  };

  const logoFilename = logoMap[creditorCode];
  const logoElement = document.getElementById("Creditor_Logo_Image");

  if (logoElement) {
    // Hide the image and reset it before loading new logo
    logoElement.style.display = "none";
    logoElement.src = "";

    if (logoFilename) {
      const logoPath = `assets/logos/${logoFilename}`;
      logoElement.src = logoPath;

      // Reveal once loaded to prevent flicker
      logoElement.onload = () => {
        logoElement.style.display = "block";
      };

      logoElement.onerror = () => {
        console.warn("Failed to load creditor logo:", logoPath);
      };
    } else {
      console.warn("Unknown creditor code:", creditorCode);
    }
  }

  // ============ Creditor Arrow Navigation ============
  setupCreditorArrows(filename);
}

// Setup creditor navigation arrows
function setupCreditorArrows(filename) {
  // Extract current components from filename
  const match = filename.match(/^([A-Z0-9]+)-([A-Z]+)-(\d{4}-\d{2}-\d{2})-P(\d+)\.png$/);
  if (!match) return;
  
  const [, currentCreditor, currentBureau, currentDate, currentPage] = match;
  
  // List of creditor codes in desired display order
  const creditorOrder = [
    "AL", "BK", "BY", "BB", "C1", "C2", "CR",
    "DB", "DL", "JP", "MF", "SR", "HD"
  ];

  // Find current index
  const currentCreditorIndex = creditorOrder.indexOf(currentCreditor);
  if (currentCreditorIndex === -1) return;

  // Get references to arrow images
  const leftArrow = document.getElementById("Creditor_Arrow_Left");
  const rightArrow = document.getElementById("Creditor_Arrow_Right");

  if (!leftArrow || !rightArrow) return;

  // Hover effects
  leftArrow.onmouseenter = () => {
    leftArrow.src = "assets/icons/arrow-left-hover.png";
  };
  leftArrow.onmouseleave = () => {
    leftArrow.src = "assets/icons/arrow-left-default.png";
  };

  rightArrow.onmouseenter = () => {
    rightArrow.src = "assets/icons/arrow-right-hover.png";
  };
  rightArrow.onmouseleave = () => {
    rightArrow.src = "assets/icons/arrow-right-default.png";
  };

  // Navigation logic - with proper canvas updates
  leftArrow.onclick = () => {
    const prevIndex = (currentCreditorIndex - 1 + creditorOrder.length) % creditorOrder.length;
    const newCreditor = creditorOrder[prevIndex];
    findAndNavigateToCreditor(newCreditor, currentBureau, currentDate);
  };

  rightArrow.onclick = () => {
    const nextIndex = (currentCreditorIndex + 1) % creditorOrder.length;
    const newCreditor = creditorOrder[nextIndex];
    findAndNavigateToCreditor(newCreditor, currentBureau, currentDate);
  };
}

// Find and navigate to the closest entry for a new creditor
function findAndNavigateToCreditor(newCreditor, currentBureau, currentDate) {
  // Wait for canvasEntries to be available
  if (!window.canvasEntries || !window.updateAllFromFile) {
    console.warn("Canvas navigation not initialized yet");
    return;
  }

  // Find entries matching the target creditor, bureau, and date
  const targetMatches = window.canvasEntries.filter(entry => 
    entry.creditor === newCreditor && 
    entry.bureau === currentBureau && 
    entry.date === currentDate
  );

  // If we found matching entries, navigate to the first one
  if (targetMatches.length > 0) {
    // Navigate to the first page of the matching set
    window.updateAllFromFile(targetMatches[0].filename);
  } else {
    // If no exact match for date, look for any entry with this creditor and bureau
    const fallbackMatches = window.canvasEntries.filter(entry => 
      entry.creditor === newCreditor && 
      entry.bureau === currentBureau
    );
    
    if (fallbackMatches.length > 0) {
      // Sort by date to get the most recent one
      fallbackMatches.sort((a, b) => b.date.localeCompare(a.date));
      window.updateAllFromFile(fallbackMatches[0].filename);
    } else {
      // Last resort: any entry with this creditor
      const lastResortMatches = window.canvasEntries.filter(entry => 
        entry.creditor === newCreditor
      );
      
      if (lastResortMatches.length > 0) {
        // Sort by bureau priority (EQ, EX, TU) and date
        const bureauPriority = { "EQ": 0, "EX": 1, "TU": 2 };
        lastResortMatches.sort((a, b) => {
          if (bureauPriority[a.bureau] !== bureauPriority[b.bureau]) {
            return bureauPriority[a.bureau] - bureauPriority[b.bureau];
          }
          return b.date.localeCompare(a.date);
        });
        window.updateAllFromFile(lastResortMatches[0].filename);
      } else {
        console.warn(`No entries found for creditor: ${newCreditor}`);
      }
    }
  }
}