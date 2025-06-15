VIOVERSE ASSET FOLDER STRUCTURE
================================

/assets/
  /bureaus/        → Bureau logos (Equifax.png, Experian.png, TransUnion.png)
  /reports/        → Credit report PNG pages (only violation-tagged pages)
                     Format: {Bureau}-{Date}-{Creditor}-P{PageNum}.png
                     Example: EQ-2024-04-25-AllyFinancial-P57.png
  /creditors/      → Creditor logos/icons if needed
  /icons/          → UI icons (arrows, severity indicators, etc.)
  /overlays/       → Violation overlay graphics/masks

/data/
  navigation-map.json  → Maps relationships between bureaus, dates, creditors, and pages
  violations.json      → Violation coordinates, severity, and descriptions
  creditors.json       → List of 13 creditors in alphabetical order

NAVIGATION LOGIC:
- Only pages with violations are included
- Pages are not consecutive (e.g., Ally p57-58, then Barclays p62)
- ~8 reports per bureau × 3 bureaus = ~24 total reports
- 13 creditors total (alphabetically ordered)