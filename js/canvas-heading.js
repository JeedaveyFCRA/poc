// canvas-heading.js
// Extracts filename and generates formatted canvas heading

function setCanvasHeading(filename) {
  const creditorMap = {
    AL: "Ally",
    BK: "Bank OF America",
    BY: "Barclays",
    BB: "Best Buy",
    C1: "Citizens 1",
    C2: "Citizens 2",
    CR: "Cornerstone",
    DB: "Discover Bank",
    DL: "Discover Loans",
    JP: "JPM/CB",
    MF: "Mariner Finance",
    SR: "Sears",
    HD: "THD/CBNA"
  };

  const bureauMap = {
    EQ: "Equifax",
    EX: "Experian",
    TU: "TransUnion"
  };

  const [code, bureau, yyyy, mm, dd] = filename.replace(".png", "").split("-");

  const creditor = creditorMap[code] || code;
  const bureauName = bureauMap[bureau] || bureau;
  const date = new Date(`${yyyy}-${mm}-${dd}`);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const headingText = `${creditor} - ${bureauName} - ${formattedDate}`;
  document.getElementById("Canvas_Heading_Text").textContent = headingText.toUpperCase();
}
