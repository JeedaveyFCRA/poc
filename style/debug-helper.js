// debug-helper.js
// Simple debugging utilities

window.debugPOC = function() {
  console.log("=== POC Debug Info ===");
  console.log("loadEvidenceMenu available:", typeof window.loadEvidenceMenu !== "undefined");
  console.log("EvidenceActual available:", typeof window.EvidenceActual !== "undefined");
  console.log("resetEvidenceMenu available:", typeof window.resetEvidenceMenu !== "undefined");
  console.log("showEvidenceCanvas available:", typeof window.showEvidenceCanvas !== "undefined");
  console.log("EvidenceCanvasContent available:", typeof window.EvidenceCanvasContent !== "undefined");
  
  if (typeof window.EvidenceActual !== "undefined") {
    console.log("EvidenceActual.isVisible:", window.EvidenceActual.isVisible());
  }
  
  const evidenceContainer = document.getElementById("Evidence_Actual_Container");
  if (evidenceContainer) {
    console.log("Evidence container display:", evidenceContainer.style.display);
    console.log("Evidence container z-index:", window.getComputedStyle(evidenceContainer).zIndex);
  }
  
  console.log("=== End Debug Info ===");
};

// Auto-run debug after page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    console.log("Running POC debug check...");
    window.debugPOC();
  }, 500);
});