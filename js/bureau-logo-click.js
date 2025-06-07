// bureau-logo-click.js
// Handles the click functionality for bureau logos
document.addEventListener("DOMContentLoaded", () => {
  let elapsed = 0;
  const maxWait = 5000; // max 5 seconds
  const checkInterval = 100;

  const waitForCanvasViewer = setInterval(() => {
    if (window.canvasEntries && window.findClosestEntry && window.updateAllFromFile) {
      clearInterval(waitForCanvasViewer);
      console.log("✅ Canvas viewer initialized. Bureau logo clicks ready.");
      initBureauLogoClicks();
      initBureauContainerClicks();
    } else {
      elapsed += checkInterval;
      if (elapsed >= maxWait) {
        clearInterval(waitForCanvasViewer);
        console.warn("⏱️ Canvas viewer initialization timeout. Bureau logo clicks may not work.");
        // Try fallback init anyway
        initBureauLogoClicks();
        initBureauContainerClicks();
      }
    }
  }, checkInterval);
});

function initBureauLogoClicks() {
  const logos = document.querySelectorAll(".bureau-logo");

  logos.forEach(logo => {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      const newBureau = logo.id.replace("Logo_", ""); // EX, TU, etc.
      handleBureauChange(newBureau);
    });
  });
}

function initBureauContainerClicks() {
  const containers = document.querySelectorAll(".bureau-logo-container");

  containers.forEach(container => {
    container.style.cursor = "pointer";
    container.addEventListener("click", () => {
      const newBureau = container.id.split("_").pop();
      handleBureauChange(newBureau);
    });
  });
}

function handleBureauChange(newBureau) {
  const currentEntry = window.getCurrentEntry?.();
  if (!currentEntry || currentEntry.bureau === newBureau) return;

  const fromPageMatch = currentEntry.filename.match(/-P(\d+)\.png$/);
  const fromPage = fromPageMatch ? parseInt(fromPageMatch[1]) : 1;

  const closestEntry = window.findClosestEntry?.({
    creditor: currentEntry.creditor,
    date: currentEntry.date,
    bureau: newBureau,
    fromPage
  });

  if (closestEntry) {
    window.updateAllFromFile?.(closestEntry.filename);

    if (typeof window.updateSelectedBureau === "function") {
      window.updateSelectedBureau(newBureau);
    }
  } else {
    console.warn(`⚠️ No matching entry found for ${currentEntry.creditor} - ${newBureau} - ${currentEntry.date}`);
  }
}
