📁 COMPONENT: severity-boxes-with-toggle

🔧 MODULE INCLUDES:
1. Severity Box Group (High / Medium / Low)
2. Collapsible Toggle Arrow Controller

📍 LOCATION:
\\wsl$\Ubuntu\home\avid_arrajeedavey\vioverse-refactor\indesign-web-components\docket-header\README-DOCKET-HEADER-SPECS.txt

───────────────────────────────────────────────

🎯 PURPOSE:
Displays a summary of total violations by severity level and allows the user to collapse or expand this section using a Lucide toggle arrow. This module appears directly **beneath the collapsible Filter View** inside the Sidebar-top-box and must adjust its vertical position dynamically based on the open or closed height of the filter.

───────────────────────────────────────────────

🔁 STACKING + BEHAVIOR RULE:

- The Filter View and Severity Boxes must be treated as a **vertically stacked block layout**.
- **Do not use fixed Y-coordinates for vertical positioning**.
- When the Filter View is expanded, the severity-boxes shift downward to follow it.
- When the Filter View collapses (showing only the header label and toggle), the severity-boxes shift upward to immediately follow.

All spacing between filter and severity components should be handled using **CSS flow, margin, or padding**, not absolute positioning.

───────────────────────────────────────────────

🔁 TOGGLE BEHAVIOR:

1. **Default State (Expanded):**
   - All severity-boxes are visible
   - Toggle arrow points **up** (`chevron-up`)

2. **Collapsed State:**
   - Severity-boxes slide upward and disappear
   - Toggle arrow becomes **down** (`chevron-down`)
   - Arrow remains visually anchored in place

3. **Toggle Logic:**
   - Clicking the arrow toggles visibility of the severity-boxes group
   - No layout shift or reflow beyond collapsing/expanding this section
   - No changes are made to underlying data

───────────────────────────────────────────────

🎞️ ANIMATION (Optional but Preferred):

- Collapse: severity-boxes visually **roll up** with a smooth 200–300ms transition, revealing only the down-facing arrow
- Expand: boxes **slide down into view**, restoring original layout

───────────────────────────────────────────────

This component follows the shared collapsible stack behavior.

Full specification:
→ /collapsible-stack-pattern/README-COLLAPSIBLE-STACK.txt

───────────────────────────────────────────────

🔤 SEVERITY SECTION HEADER:

- Label text: `severity summary`
- Font: Bernino Sans Compressed Extrabold
- Size: 30pt
- Color: #253541; 0.9 transparency
- Position: x1220px; w363px; h39px
- Padding or margin above: Use UX/UI standards

───────────────────────────────────────────────


🧱 SEVERITY BOXES LAYOUT (ALL 3)

- Width: 123px
- Height: 98px
- Border Radius: 32px
- Fill Color: Hex `#e3e2e1` (30% tint of `#b7b5b3`)
- Stroke: 1px solid white
- Box Shadow: Small, soft
- **Y-position: Automatically flows beneath Filter View; do not hardcode vertical position**

───────────────────────────────
📍 HIGH SEVERITY BOX
- X-position: 1211 px
- Label: "high severity"
- Label Font: Space Grotesk Bold, 12pt, `#253541` @ 0.9 opacity
- Label Box: W: 110px, H: 34px, X: 1218
- Badge Dot: `#FF0000`, W: 38px, H: 38px, X: 1238; 3 px inward padding to fit icon properly
- Lucide Icon: `shield-x`, white, centered in dot
- Counter: Data-driven, W: 36px, H: 55px, X: 1282
- Font: Space Grotesk Bold, 44pt, `#253541` @ 0.9

───────────────────────────────
📍 MEDIUM SEVERITY BOX
- X-position: 1349 px
- Label: "medium severity"
- Label Font: Space Grotesk Bold, 12pt, `#253541` @ 0.9 opacity
- Label Box: W: 110px, H: 34px, X: 1348
- Badge Dot: `#F26419`, W: 38px, H: 38px, X: 1370; 3 px inward padding to fit icon properly
- Lucide Icon: `triangle-alert`
- Counter: Data-driven, W: 36px, H: 55px, X: 1413
- Font: Space Grotesk Bold, 44pt, `#253541` @ 0.9

───────────────────────────────
📍 LOW SEVERITY BOX
- X-position: 1480 px
- Label: "low severity"
- Label Font: Space Grotesk Bold, 12pt, `#253541` @ 0.9 opacity
- Label Box: W: 110px, H: 34px, X: 1480
- Badge Dot: `#F2B919`, W: 38px, H: 38px, X: 1502; 3 px inward padding to fit icon properly
- Lucide Icon: `circle-alert`
- Counter: Data-driven, W: 36px, H: 55px, X: 1543
- Font: Space Grotesk Bold, 44pt, `#253541` @ 0.9

───────────────────────────────────────────────

⚠️ DYNAMIC ALIGNMENT RULE:
The badge and Lucide icon must shift left if the counter number contains 2–3 digits to maintain visual centering. The default alignment assumes a 1-digit number.

This behavior must be dynamically calculated to prevent overlap and preserve spacing harmony inside each severity box.

───────────────────────────────────────────────

🔤 TYPE REFERENCE:
- Bernino Sans Compressed Extrabold: https://use.typekit.net/qes3lop.css
- Font issues? See reference:  
  \\wsl$\Ubuntu\home\avid_arrajeedavey\vioverse-refactor\indesign-web-components\sidebar-canvas\README-SIDEBAR-CANVAS-SPECS.txt

───────────────────────────────────────────────

🧩 EXPANDABILITY NOTICE (FOR CLAUDE CODE + FUTURE DEV):

⚠️ IMPORTANT: The severity-boxes layout is **intentionally designed to be expandable**.

- While the current implementation includes a single horizontal row of 3 severity boxes (High / Medium / Low), this system is modular.
- As development progresses, **additional rows** will be added to represent other breakdowns (e.g., by bureau, by creditor, or specific metrics).
- The layout must support **multiple rows of 3**, stacked vertically inside the same container.
- The collapse/expand toggle should continue to apply to the **entire severity-boxes group**, no matter how many rows are added.
- DO NOT hardcode the total number of boxes or rows. The layout should dynamically accommodate future groupings.

This behavior is intentional and must remain **scalable, flexible, and fully collapsible**.

───────────────────────────────────────────────

✅ GOAL:
To display an intelligent, space-aware severity summary module that always aligns directly beneath the filter, maintains clean vertical flow, and preserves toggle and animation integrity without relying on hardcoded vertical positioning.