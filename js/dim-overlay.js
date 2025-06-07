function showDimOverlay() {
  document.getElementById("Overlay_Image_Canvas")?.style.setProperty("display", "block");
  document.getElementById("Overlay_Creditor_Logo")?.style.setProperty("display", "block");
  document.getElementById("Overlay_Bureau_EQ")?.style.setProperty("display", "block");
  document.getElementById("Overlay_Bureau_EX")?.style.setProperty("display", "block");
  document.getElementById("Overlay_Bureau_TU")?.style.setProperty("display", "block");
}

function hideDimOverlay() {
  document.getElementById("Overlay_Image_Canvas")?.style.setProperty("display", "none");
  document.getElementById("Overlay_Creditor_Logo")?.style.setProperty("display", "none");
  document.getElementById("Overlay_Bureau_EQ")?.style.setProperty("display", "none");
  document.getElementById("Overlay_Bureau_EX")?.style.setProperty("display", "none");
  document.getElementById("Overlay_Bureau_TU")?.style.setProperty("display", "none");
}

function dimReportView() {
  const dimElements = document.querySelectorAll('.dim-overlay');
  dimElements.forEach(element => {
    element.style.display = 'block';
    element.style.opacity = '0.3';
  });
}

function undimReportView() {
  const dimElements = document.querySelectorAll('.dim-overlay');
  dimElements.forEach(element => {
    element.style.display = 'none';
    element.style.opacity = '1';
  });
}
