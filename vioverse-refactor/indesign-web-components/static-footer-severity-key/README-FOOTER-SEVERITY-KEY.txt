📁 COMPONENT: static-footer-severity-key

📍 LOCATION:
Anchored at the bottom of the sidebar-top-stack (or bottom of full report canvas)

───────────────────────────────────────────────

🎯 PURPOSE:
This static footer provides two critical elements:
1. A **severity key** legend for interpreting the color-coded violation icons  
2. A legal **disclaimer** indicating that overlays are for internal use only

It is always visible at the bottom of the display. It does not collapse or animate.

───────────────────────────────────────────────

🧭 POSITIONING + LAYOUT:

- This component is **permanently anchored to the bottom of the report viewer container**
- It must always appear, regardless of scroll or toggle states
- There must be a minimum of **24px vertical padding** between this footer and the element above it (e.g., "view full violation log")

───────────────────────────────────────────────

🧱 SEVERITY KEY ROW:

- Label: `severity key:` (lowercase)
- Font: Space Grotesk
- Font size: 14 ptt
- Font weight: bold
- Color: #253541

- Horizontal spacing between severity items: 25 px
- Vertical alignment: Icons and text should be vertically centered

🔴 High Severity:
- Icon: Lucide `shield-x` 
- Icon color: White
- Create a circle dot background for this icon: w: 24 px; h: 24 px, fill it with `#FF0000`, no stroke; Lucide Icon sits on to of circle dot background.
- Label text: `high`
- Position:
  - x: 1329 px
  - y: 891 px


🟠 Medium Severity:
- Icon: Lucide `triangle-alert` inside orange circle
- Icon color: White
- Create a circle dot background for this icon: w: 24 px; h: 24 px, fill it with ``#F26419`, no stroke; Lucide Icon sits on to of circle dot background.
- Label text: `medium`
- Position:
  - x: 1417 px
  - y: 891 px

🟡 Low Severity:
- Icon: Lucide `circle-alert` inside yellow circle
- Icon color: White
- Create a circle dot background for this icon: w: 24 px; h: 24 px, fill it with `#FF0000`, no stroke; Lucide Icon sits on to of circle dot background.
- Label text: `low`
- Position:
  - x: 1522 px
  - y: 891 px

───────────────────────────────────────────────

📝 LEGAL DISCLAIMER TEXT:

- Content: `Original report shown. Overlays are for legal review only, not for submission.`
- Font: Space Grotesk
- Font size: 10 pt
- Font weight: Regular
- Text alignment: left-aligned; x 1223 px; y 943 px
- Text color: Black; 0.9 opacity
- Thin horizontal divider line above text x 1223 px; y 930 px, Line width 367 px; Black; 0.5 opacity

───────────────────────────────────────────────

📐 SPACING + CONTAINER STYLING:

- Top padding: Minimum 24px from last active component

───────────────────────────────────────────────

✅ GOAL:
To provide a persistent, non-intrusive key and legal disclaimer that reinforces system clarity, ensures proper interpretation of severity markings, and complies with internal/legal usage disclaimers.