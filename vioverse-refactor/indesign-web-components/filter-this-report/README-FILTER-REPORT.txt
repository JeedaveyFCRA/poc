📁 COMPONENT: filter-counter

📍 LOCATION:
sidebar-top-stack → top-most position (first component)

───────────────────────────────────────────────

🎯 PURPOSE:
This component allows users to filter the report context based on selected parameters. The filters determine which violations appear in the severity boxes and `violation-details` below.

It sits at the top of the interface and directly controls the data state for all visual summaries.

───────────────────────────────────────────────

🧭 COMPONENT STRUCTURE:

1. Header text: `filter this report`  
2. Intro sentence: guidance on how filters affect what’s displayed  
3. Filter container: grouped layout with multiple filter toggles in two-column format  
4. Collapsible toggle: up/down Lucide chevron in the top-right corner (see `collapsible-toggle-arrow` spec)

───────────────────────────────────────────────

🔤 HEADER TEXT:

- Text: `filter this report`
- Font: Bernino Sans Compressed Extrabold
- Font size: 30pt
- Color: `#253541`
- Alignment: Left
- Position: Top of the container

───────────────────────────────────────────────

📝 INTRO SENTENCE:

- Text:  
  `Select one or more filters below to customize the report view. Your selections affect which severity data and violations are shown.`

- Font: Space Grotesk Bold
- Font size: 11pt
- Color: `#253541` at 90% opacity
- Alignment: Left
- Position:
  - `x: 1220 px`
  - `y: 174 px`
  - `w: 381 px`
  - `h: 29 px`  
  - ✅ This can remain a fixed `y` value as this section is always topmost.

───────────────────────────────────────────────

🧱 FILTER CONTAINER:

- Width: 390 px
- Height: dependent on number of filter options to and bottom padding inside this container is 18 px
- x position: 1210 px
- y position: 207 px
- Border Radius: 32px
- Fill Color: Hex `#e3e2e1` (30% tint of `#b7b5b3`)
- Stroke: 1px solid white
- Box Shadow: Small, soft


- Layout: Two-column grid
  - Gutter between columns: 30 px


Each filter is rendered as:
- Selectable pill 13 px circle; 2 pt stroke, color is #253541
- default fill color  is White
- Selected fill color is #ff0000
- X Position left column   is 1245 px
- X Position Right column   is 1413 px
- Y Position on row 1 is 226 px (all other y positions vary depending on number of rows
 

with a label
- Font: Space Grotesk Regular
- Font size: 8 pt
- Label color: `#253541` at 90% opacity
- X label Position left column   is 1267 px
- X label Position right column  for is 1435 px


───────────────────────────────────────────────

📋 CURRENT FILTER OPTIONS:

| Label | Description |
|-------|-------------|
| `selected violations` | Shows only manually selected violations |
| `total violations (all pages)` | Displays all violations across every page in the report |
| `current page only` | Limits view to only violations from the currently visible credit report page |

───────────────────────────────────────────────

⚠️ MUTUAL EXCLUSIVITY LOGIC:

IMPORTANT: Some filter combinations are **not valid** together. For example:
- If `total violations (all pages)` is selected, you **cannot** also select `current page only`
- If `selected violations` is active, other filters may need to be auto-disabled or grayed out

✅ UX STRATEGY:

- When filters cannot be combined:
  • Show the unavailable filters as **grayed out**
  • Add a tooltip or muted label explanation (e.g., “only one filter allowed at a time”)
  • Use hover/focus to explain why a filter is disabled

💡 Do not allow ambiguous multiple filter states. The logic must guide the user toward **valid, intentional combinations** — or restrict to one filter at a time if required.

───────────────────────────────────────────────

This component follows the shared collapsible stack behavior.

Full specification:
→ /collapsible-stack-pattern/README-COLLAPSIBLE-STACK.txt

───────────────────────────────────────────────

✅ GOAL:
To provide an intuitive, accessible filter interface that controls what violation data appears below. Filter combinations must be clearly defined, and invalid selections must be visually restricted to avoid user confusion.
