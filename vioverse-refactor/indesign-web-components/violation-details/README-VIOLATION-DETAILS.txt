📁 COMPONENT: violation-details

📍 LOCATION:
sidebar-top-stack → directly below severity-boxes

───────────────────────────────────────────────

🎯 PURPOSE:
Displays a list of FCRA violations matched from the current report view and VioBox selections. Each item contains:
- FCRA code(s)
- Violation description
- Severity icon (Lucide)
This module is **visible by default** on page load and includes a collapsible toggle to show or hide the entire list.

───────────────────────────────────────────────

This component follows the shared collapsible stack behavior.

Full specification:
→ /collapsible-stack-pattern/README-COLLAPSIBLE-STACK.txt

───────────────────────────────────────────────

🔤 SECTION HEADER:

- Label text: `violation details`
- Font: Bernino Sans Compressed Extrabold
- Size: 30pt
- Color: #253541; 0.9 transparency
- Position: x1220px; w363px; h39px
- Padding or margin above: Use UX/UI standards

- Chevron icon placement: right-aligned, vertically centered to text baseline


🔤 FONT REFERENCE: Bernino Sans Compressed Extrabold

This component uses **Bernino Sans Compressed Extrabold**, an Adobe Creative Cloud font.  
If rendering issues occur (especially in Claude Code), please reference the working implementation in:

📄 `sidebar-canvas/README-SIDEBAR-CANVAS-SPECS.txt`

🧷 Font Source:  
https://use.typekit.net/qes3lop.css


───────────────────────────────────────────────

🧱 INDIVIDUAL VIOLATION BOX SPECS:

- Shape: Rounded pill rectangle with subtle shadow box
- Fill Color: Hex `#e3e2e1` (30% tint of `#b7b5b3`)
- Stroke: 1 pt; Color White
- Width: Flexible (max container width)
- Height: Flexible (auto based on content height)
- Border radius: 32px
- Padding inside box: 14 px
- Margin between boxes: 14 px
- Must stack vertically inside container — **do not use fixed Y-values**



- Fill Color: Hex `#e3e2e1` (30% tint of `#b7b5b3`)
- Stroke: 1px solid white
- Box Shadow: Small, soft
- **Y-position: Automatically flows beneath Filter View; do not hardcode vertical position**

───────────────────────────────────────────────

🔠 FCRA CODE LABEL:

  - Font Family: 'Space Grotesk', sans-serif
  - Font Weight: 700 (bold)
  - Font Size: 14px
  - Color: rgba(37, 53, 65, 0.9) - 90% opacity of #253541
  - Margin Bottom: 0 (no space between code and description)

───────────────────────────────────────────────

📝 VIOLATION DESCRIPTION LABEL:

  - Font Family: 'Space Grotesk', sans-serif
  - Font Weight: 400 (regular)
  - Font Size: 14px
  - Color: rgba(0, 0, 0, 0.9) - 90% opacity black
  - Line Height: 1.4

  Both labels use 14px font size but differ in weight (700 vs 400) and color (dark blue-gray vs black).

───────────────────────────────────────────────

🎯 SEVERITY ICON + BADGE (CIRCLE DOT):

- Container: Circle badge
- Size: 24px x 24px
- X-position: 1227 px
- Y-position: Dynamic — must auto-align vertically with center of the associated violation box (shifts based on stacking height)

🔴 HIGH Severity:
- Badge fill color: `#FF0000`
- Lucide icon: `shield-x`
- Icon color: White
- No stroke

🟠 MEDIUM Severity:
- Badge fill color: `#F26419`
- Lucide icon: `triangle-alert`
- Icon color: White
- No stroke

🟡 LOW Severity:
- Badge fill color: `#F2B919`
- Lucide icon: `circle-alert`
- Icon color: White
- No stroke

All badge+icon combos must remain **vertically centered** in relation to the full height of the box. Horizontal distance from left edge is fixed.

───────────────────────────────────────────────

📦 STACKING + FLEX BEHAVIOR:

- All violation boxes should stack vertically
- No hardcoded Y-values
- Maintain vertical flow and equal spacing
- Use CSS `flex-column` or `block` model
- Use margin or flex-gap between entries

───────────────────────────────────────────────

🗂️ DATA SOURCE:

All violation detail entries are:
- Preloaded from system-level tagging (`ExportedViolations.csv`)
- Future versions may pull from Airtable or external API
- Each entry includes:
  - `fcra_codes[]`
  - `description`
  - `severity_level` (used to determine icon + badge color)

This component **must dynamically generate violation boxes** based on available entries.

───────────────────────────────────────────────

✅ GOAL:
To create a clean, readable summary of all active FCRA violations with matching legal codes and severity indicators, fully expandable/collapsible and adaptable to dynamic content lengths and stacking heights.

