// poc-init.js
// Startup logic for POC Viewer

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let filename = params.get("file");

  if (!filename) {
    console.warn("No filename provided in URL (e.g., ?file=AL-EQ-2024-04-25-P57.png)");
    filename = "AL-EQ-2024-04-25-P57.png";
    window.history.replaceState(null, "", `?file=${filename}`);
  }

  if (!filename.endsWith(".png")) {
    console.error("Invalid file format. Expected a .png file.");
    return;
  }

  // Reset all systemwide counters to 0 on page load
  const sysWideCounters = document.querySelectorAll('.sys-wide-counter');
  sysWideCounters.forEach(counter => {
    counter.textContent = '0';
  });

  // 🔧 Run startup functions on load
  setCreditorLogo(filename);
  setBureauLogos(filename);
  loadCanvasImage(filename);
  setCanvasHeading(filename);

  // 🎯 FCRA button click = show systemwide popup
  const fcraBtn = document.getElementById("FCRA_Button");
  if (fcraBtn) {
    fcraBtn.addEventListener("click", () => {
      const sysWidePopup = document.getElementById("SysWide_FCRA_Popup");
      const closeBtn = document.getElementById("Close_Button");
      
      if (sysWidePopup) {
        sysWidePopup.style.display = "block";
        sysWidePopup.style.visibility = "visible";
        sysWidePopup.style.zIndex = "25";
      }
      
      if (closeBtn) {
        closeBtn.style.display = "block";
        closeBtn.style.visibility = "visible";
        closeBtn.style.zIndex = "60";
      }
    });
  }

  // ❌ Close popup hover behavior
  const closeBtn = document.getElementById("Close_Button");
  const closeHover = document.getElementById("Close_Button_Hover");

  if (closeBtn) {
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.display = "none";
      if (closeHover) {
        closeHover.style.display = "block";
        closeHover.style.visibility = "visible";
        closeHover.style.zIndex = "60";
      }
    });
  }

  if (closeHover) {
    closeHover.addEventListener("mouseleave", () => {
      const popup = document.getElementById("SysWide_FCRA_Popup");
      if (popup && popup.style.display !== "none") {
        closeHover.style.display = "none";
        closeBtn.style.display = "block";
        closeBtn.style.visibility = "visible";
      }
    });

    closeHover.addEventListener("click", () => {
      const sysWidePopup = document.getElementById("SysWide_FCRA_Popup");
      if (sysWidePopup) {
        sysWidePopup.style.display = "none";
        sysWidePopup.style.visibility = "hidden";
      }
      if (closeBtn) {
        closeBtn.style.display = "none";
        closeBtn.style.visibility = "hidden";
      }
      closeHover.style.display = "none";
      closeHover.style.visibility = "hidden";
    });
  }

  // 🧼 Reset view if clicking dimmed canvas or logos
  const resetTargets = [
    "Image_Canvas_Container",
    "Creditor_Logo_Container",
    "Bureau_Logo_Container_EQ",
    "Bureau_Logo_Container_EX",
    "Bureau_Logo_Container_TU"
  ];

  resetTargets.forEach(id => {
    document.getElementById(id)?.addEventListener("click", () => {
      // Check if evidence functionality is currently active
      const isEvidenceActive = document.querySelector('.evidence-icon.selected') ||
                             document.getElementById('Evidence_Menu_Container')?.style.display !== 'none' ||
                             document.getElementById('Evidence_Canvas_Container')?.style.display !== 'none' ||
                             document.getElementById('Evidence_Actual_Container')?.style.display !== 'none' ||
                             document.getElementById('Matters_Box')?.style.display !== 'none';
      
      // Only reset if evidence is actually active
      if (isEvidenceActive) {
        console.log(`🔄 Resetting evidence state - clicked on ${id}`);
        if (typeof undimReportView === "function") undimReportView();
        if (typeof window.deselectEvidenceIcons === "function") window.deselectEvidenceIcons();
        if (typeof resetEvidenceMenu === "function") resetEvidenceMenu();
        if (typeof hideDimOverlay === "function") hideDimOverlay();
        if (typeof window.hideMattersBoxCompletely === "function") window.hideMattersBoxCompletely(); 
      }
    });
  });
});
