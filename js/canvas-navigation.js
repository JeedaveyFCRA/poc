let canvasEntries = [];

async function loadCanvasIndexFlat() {
  try {
    const response = await fetch("data/canvas-index.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const index = await response.json();
    const flat = [];

    const bureauOrder = ["EQ", "EX", "TU"];

    for (const creditor of Object.keys(index).sort()) {
      for (const date of Object.keys(index[creditor]).sort()) {
        for (const bureau of bureauOrder) {
          if (!index[creditor][date][bureau]) continue;
          for (const page of index[creditor][date][bureau]) {
            flat.push({
              filename: page,
              creditor,
              date,
              bureau
            });
          }
        }
      }
    }

    canvasEntries = flat;
    window.canvasEntries = canvasEntries; // Expose globally
    console.log('Canvas index loaded successfully:', canvasEntries.length, 'entries');
  } catch (error) {
    console.warn('Failed to load canvas index, using fallback data:', error);
    // Fallback data for local testing
    canvasEntries = [
      {
        filename: "AL-EQ-2024-04-25-P57.png",
        creditor: "AL",
        date: "2024-04-25",
        bureau: "EQ"
      },
      {
        filename: "AL-EQ-2024-04-25-P58.png",
        creditor: "AL",
        date: "2024-04-25",
        bureau: "EQ"
      }
    ];
    window.canvasEntries = canvasEntries;
  }
}

function findClosestEntry({ creditor, date, bureau, fromPage = 0 }) {
  const matching = canvasEntries.filter(entry =>
    entry.creditor === creditor &&
    entry.date === date &&
    entry.bureau === bureau
  );

  if (matching.length === 0) return null;

  return matching.reduce((prev, curr) => {
    const prevPage = parseInt(prev.filename.match(/-P(\d+)\.png$/)[1]);
    const currPage = parseInt(curr.filename.match(/-P(\d+)\.png$/)[1]);
    return Math.abs(currPage - fromPage) < Math.abs(prevPage - fromPage)
      ? curr
      : prev;
  });
}

function getCurrentEntry() {
  const params = new URLSearchParams(window.location.search);
  const filename = params.get("file");
  if (!filename || !canvasEntries.length) return null;

  const entry = canvasEntries.find(entry => entry.filename === filename);
  return entry || null;
}

function getEntriesForReport(creditor, bureau, date) {
  return canvasEntries.filter(entry =>
    entry.creditor === creditor &&
    entry.bureau === bureau &&
    entry.date === date
  ).sort((a, b) => {
    // Sort by page number
    const pageA = parseInt(a.filename.match(/-P(\d+)\.png$/)[1]);
    const pageB = parseInt(b.filename.match(/-P(\d+)\.png$/)[1]);
    return pageA - pageB;
  });
}

function findPreviousReportFallback(current) {
  const bureauOrder = ["EQ", "EX", "TU"];
  const currentBureauIndex = bureauOrder.indexOf(current.bureau);
  
  // Step 1: Try previous bureau for same creditor and date
  for (let i = currentBureauIndex - 1; i >= 0; i--) {
    const targetBureau = bureauOrder[i];
    const entries = getEntriesForReport(current.creditor, targetBureau, current.date);
    if (entries.length > 0) {
      // Return last page of this bureau
      return entries[entries.length - 1];
    }
  }
  
  // Step 2: Try previous date for same creditor
  const allDatesForCreditor = [...new Set(
    canvasEntries
      .filter(entry => entry.creditor === current.creditor)
      .map(entry => entry.date)
  )].sort();
  
  const currentDateIndex = allDatesForCreditor.indexOf(current.date);
  if (currentDateIndex > 0) {
    const previousDate = allDatesForCreditor[currentDateIndex - 1];
    
    // Find last bureau with data for this previous date
    for (let i = bureauOrder.length - 1; i >= 0; i--) {
      const targetBureau = bureauOrder[i];
      const entries = getEntriesForReport(current.creditor, targetBureau, previousDate);
      if (entries.length > 0) {
        // Return last page of this bureau
        return entries[entries.length - 1];
      }
    }
  }
  
  // Step 3: Try last creditor in alphabetical order
  const allCreditors = [...new Set(canvasEntries.map(entry => entry.creditor))].sort();
  const currentCreditorIndex = allCreditors.indexOf(current.creditor);
  
  if (currentCreditorIndex > 0) {
    const previousCreditor = allCreditors[currentCreditorIndex - 1];
    
    // Get last date for this creditor
    const datesForCreditor = [...new Set(
      canvasEntries
        .filter(entry => entry.creditor === previousCreditor)
        .map(entry => entry.date)
    )].sort();
    
    if (datesForCreditor.length > 0) {
      const lastDate = datesForCreditor[datesForCreditor.length - 1];
      
      // Find last bureau with data for this creditor and date
      for (let i = bureauOrder.length - 1; i >= 0; i--) {
        const targetBureau = bureauOrder[i];
        const entries = getEntriesForReport(previousCreditor, targetBureau, lastDate);
        if (entries.length > 0) {
          // Return last page of this bureau
          return entries[entries.length - 1];
        }
      }
    }
  }
  
  // No fallback found
  return null;
}

function getCurrentIndex() {
  const params = new URLSearchParams(window.location.search);
  const filename = params.get("file");
  if (!filename || !canvasEntries.length) return -1;

  return canvasEntries.findIndex(entry => entry.filename === filename);
}

function updateAllFromFile(filename) {
  if (!filename) return;
  
  // Update the URL without reloading
  window.history.replaceState(null, "", `?file=${filename}`);

  // Update all display modules
  setCreditorLogo(filename);
  setBureauLogos(filename);
  loadCanvasImage(filename);
  setCanvasHeading(filename);
}

async function initCanvasViewer() {
  await loadCanvasIndexFlat();

  // Make canvasEntries globally accessible
  window.canvasEntries = canvasEntries;
  
  // Expose the utility functions globally for other scripts
  window.findClosestEntry = findClosestEntry;
  window.getCurrentEntry = getCurrentEntry;
  window.updateAllFromFile = updateAllFromFile;

  // If filename is invalid, stop here
  if (getCurrentIndex() === -1) return;

  // ▶️ Right Arrow - Stay within current report
  document.getElementById("Canvas_Arrow_Right").onclick = () => {
    const current = getCurrentEntry();
    if (!current) return;

    // Get all pages for current report
    const reportPages = getEntriesForReport(current.creditor, current.bureau, current.date);
    const currentPageNum = parseInt(current.filename.match(/-P(\d+)\.png$/)[1]);
    
    // Find next page in this report
    const nextPage = reportPages.find(entry => {
      const pageNum = parseInt(entry.filename.match(/-P(\d+)\.png$/)[1]);
      return pageNum > currentPageNum;
    });

    if (nextPage) {
      updateAllFromFile(nextPage.filename);
    }
  };

  // ◀️ Left Arrow - Advanced navigation with fallbacks
  document.getElementById("Canvas_Arrow_Left").onclick = () => {
    const current = getCurrentEntry();
    if (!current) return;

    // Get all pages for current report
    const reportPages = getEntriesForReport(current.creditor, current.bureau, current.date);
    const currentPageNum = parseInt(current.filename.match(/-P(\d+)\.png$/)[1]);
    
    // Find previous page in this report
    const prevPage = [...reportPages].reverse().find(entry => {
      const pageNum = parseInt(entry.filename.match(/-P(\d+)\.png$/)[1]);
      return pageNum < currentPageNum;
    });

    if (prevPage) {
      // Navigate to previous page in current report
      updateAllFromFile(prevPage.filename);
    } else {
      // At first page - implement fallback logic
      const fallbackEntry = findPreviousReportFallback(current);
      if (fallbackEntry) {
        updateAllFromFile(fallbackEntry.filename);
      }
    }
  };

  // ⏩ Group Right (Jump to next bureau/date/creditor group)
  document.getElementById("Canvas_Arrow_Group_Right").onclick = () => {
    const currentIndex = getCurrentIndex();
    const current = canvasEntries[currentIndex];
    const next = canvasEntries.find((entry, i) =>
      i > currentIndex &&
      (
        entry.bureau !== current.bureau ||
        entry.date !== current.date ||
        entry.creditor !== current.creditor
      )
    );
    if (next) updateAllFromFile(next.filename);
  };

  // ⏪ Group Left (Jump to previous bureau/date/creditor group)
  document.getElementById("Canvas_Arrow_Group_Left").onclick = () => {
    const currentIndex = getCurrentIndex();
    const current = canvasEntries[currentIndex];
    const prev = [...canvasEntries].reverse().find((entry) =>
      canvasEntries.indexOf(entry) < currentIndex &&
      (
        entry.bureau !== current.bureau ||
        entry.date !== current.date ||
        entry.creditor !== current.creditor
      )
    );
    if (prev) updateAllFromFile(prev.filename);
  };
}

// Automatically call it on page load
document.addEventListener("DOMContentLoaded", () => {
  initCanvasViewer();
});

document.addEventListener('DOMContentLoaded', function() {
    // Get all canvas arrows
    const arrows = document.querySelectorAll('.canvas-arrow');
    
    // Add loaded class once each image is loaded
    arrows.forEach(arrow => {
        if (arrow.complete) {
            arrow.classList.add('loaded');
        } else {
            arrow.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
});