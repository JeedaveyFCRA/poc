let currentSelectedBureau = null; // Tracks live selection (overrides filename after click)

// Bureau logo settings
const bureauStates = {
  "EQ": {
    id: "Logo_EQ",
    container: "Bureau_Logo_Container_EQ",
    defaultLogo: "EQ_Logo.png",
    whiteLogo: "EQ_White_Logo.png"
  },
  "EX": {
    id: "Logo_EX",
    container: "Bureau_Logo_Container_EX",
    defaultLogo: "EX_Logo.svg",
    whiteLogo: "EX_White_Logo.svg"
  },
  "TU": {
    id: "Logo_TU",
    container: "Bureau_Logo_Container_TU",
    defaultLogo: "TU_Logo.svg",
    whiteLogo: "TU_White_Logo.svg"
  }
};

function setBureauLogos(filename) {
  const bureauFromFilename = filename.split("-")[1]; // EQ, EX, TU
  
  // Update currentSelectedBureau from filename
  currentSelectedBureau = bureauFromFilename;

  // Setup the visual appearance of bureau logos
  updateBureauVisuals();
}

function updateBureauVisuals() {
  // Update all bureau containers to reflect current selection
  for (const code in bureauStates) {
    const state = bureauStates[code];
    const img = document.getElementById(state.id);
    const container = document.getElementById(state.container);
    
    if (!img || !container) continue;

    // Base container setup
    container.classList.add("bureau-logo-container");

    // Set base visual state
    if (code === currentSelectedBureau) {
      container.style.backgroundColor = "red";
      img.src = `assets/logos/${state.whiteLogo}`;
    } else {
      container.style.backgroundColor = "white";
      img.src = `assets/logos/${state.defaultLogo}`;
    }

    // Hover effects (only for non-selected)
    container.onmouseenter = () => {
      if (code !== currentSelectedBureau) {
        container.style.backgroundColor = "red";
        img.src = `assets/logos/${state.whiteLogo}`;
      }
    };

    container.onmouseleave = () => {
      if (code !== currentSelectedBureau) {
        container.style.backgroundColor = "white";
        img.src = `assets/logos/${state.defaultLogo}`;
      }
    };
  }
}

// Function to externally update the selected bureau
function updateSelectedBureau(bureau) {
  if (bureauStates[bureau]) {
    currentSelectedBureau = bureau;
    updateBureauVisuals();
  }
}

// Make updateSelectedBureau available globally
window.updateSelectedBureau = updateSelectedBureau;