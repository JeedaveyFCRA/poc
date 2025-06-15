📁 COMPONENT: view-full-violation-log-button

📍 LOCATION:
sidebar-top-stack → directly below the last rendered violation-details box

───────────────────────────────────────────────

🎯 PURPOSE:
Displays a static button or link at the end of the `violation-details` list. It provides users — especially legal professionals — with access to the **complete violation history or log**, beyond what is currently shown on screen.

This component is **always visible**, regardless of how many violations are included in the summary. It serves as a persistent gateway to the full system-wide violation dataset.

───────────────────────────────────────────────

🧭 FUNCTIONAL BEHAVIOR:

- Clicking the button will eventually trigger one of the following (to be defined in development):
  • Opens a modal  
  • Navigates to a new page (e.g., `/full-log`)  
  • Expands a drawer or accordion panel  
  • Triggers a filtered export (optional)

- This element **does not collapse** and does not toggle
- It must remain accessible even if `violation-details` is collapsed
- Keyboard/tab-navigable; screen reader accessible

───────────────────────────────────────────────

🔤 BUTTON LABEL TEXT:

- Default text: `view full violation log`
- Font: Bernino Sans Compressed Extrabold
- Font size: 24pt
- Color: `#253541` at 90% opacity

hover state, same color - Color: `#253541` at 90% opacity, but add a hyperlink underline  
- Letter spacing: normal
- x = 1370 px
- y = 846 px
- w = 184
- h = 30 px
- Text is right aligned

🔤 FONT REFERENCE: Bernino Sans Compressed Extrabold

This component uses **Bernino Sans Compressed Extrabold**, an Adobe Creative Cloud font.  
If rendering issues occur (especially in Claude Code), please reference the working implementation in:

📄 `sidebar-canvas/README-SIDEBAR-CANVAS-SPECS.txt`

🧷 Font Source:  
https://use.typekit.net/qes3lop.css

───────────────────────────────────────────────

🎨 ARROW ICON:

- Icon: Lucide circle-chevron-right
- Default Color: `#253541` at 90% opacity
- Hover Color: `#F26419`
- Size: 28px x 28px

- Position:
  • Horizontally: Fixed at `x: 1564 px`
  • Vertically: Fixed at `y: 843 px`


───────────────────────────────────────────────

🧩 INTERACTIVITY STYLING:

- On hover:
  • Text color: `#F26419`
  • Cursor: pointer
  • Optional: underline or glow effect

- On focus (keyboard):
  • Add an outline or visible indicator for accessibility compliance

───────────────────────────────────────────────

✅ GOAL:
To provide a persistent, professional, and intuitive entry point to the full legal violation archive — especially helpful for attorneys, investigators, or advanced users who require complete dispute context without visual clutter.
