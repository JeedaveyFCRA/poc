DOCKET HEADER SPECS

Component Name: Docket Header Bar  
Container Type: Fixed-width, single-line header bar  
Position: Top of screen (above nav bar and report canvas)


────────────────────────────
CONTAINER DIMENSIONS
────────────────────────────

• Width: 1898px
• Height: ~48px (auto-fit to text baseline and icon position)
• X-position: 11px (centers container inside 1920px background)
• Y-position: ~9px (above nav bar)
• 36px rounded corners
• Fill color = 253541
• Stroke color = 30% tint of #253541 (use hex #9ba1a6); 3px stroke weight; do not use rgba transparency

----------------------------
LAYOUT & STRUCTURE
----------------------------

• This component displays six data fields horizontally:
   1. case
   2. filed
   3. docket
   4. court
   5. judge
   6. next deadline

• Fields are spaced apart by exactly 48px horizontally  
• A vertical divider line sits centered between each field

• Divider line spec:
   - Height: 30px
   - Width: 1px
   - Color: 30% tint of #253541 (hex #9ba1a6)
   - Do not use rgba transparency
   - Vertically centered to text baseline

----------------------------
TYPOGRAPHY & COLORS
----------------------------

• Font: Space Grotesk Bold, 14pt  
• All text is lowercase

• Each field is structured as:
   [label]: [value]

   - Label text (everything to the left of the colon, including colon and space):
     → 30% tint of #253541 (hex #9ba1a6)
     → Do not use rgba transparency

   - Value text (everything to the right of the colon):
     → Pure white (#ffffff)

----------------------------
INTERACTIVITY
----------------------------

• The right side of the header contains a **collapsible toggle arrow**

• Existing functionality (already written):
   - When clicked, this arrow collapses the entire header bar
   - However, when collapsed, the “expand” arrow does **not** currently reappear

• Correction:
   - Ensure that after collapsing, an "expand" toggle arrow appears in the same location
   - Icon should be a Lucide icon (e.g., `chevron-down` or `chevron-up`)
   - Arrow icon color: #f26419 on hover, 30% tint of #253541 (hex #9ba1a6) at rest

• Arrow alignment:
   - Vertically centered
   - Horizontally aligned flush right (outside the last data field’s padding)

----------------------------
NOTES
----------------------------

• The values in each field are considered "semi-variable"
   - They do not change dynamically during a session, but are case-specific
   - This means the values may update between case loads, but not mid-session

• This header must remain visually balanced and aligned with the grid system used by the nav bar and report canvas

• If screen width becomes constrained, allow the text to wrap at natural breakpoints or apply `overflow-x: scroll` rather than squishing text

----------------------------
EXAMPLE DISPLAY
----------------------------

case: david marra v. 13 furnishers, 3 credit bureaus   │  
filed: 06-09-2025   │  
docket: 2025-FC-0001   │  
court: eastern district of new york   │  
judge: hon allyne r ross   │  
next deadline: motion deadline 06-15-25   ➤


----------------------------
ARROW TOGGLE BEHAVIOR
----------------------------

Lucide icons are used for the collapsible toggle arrow in the docket header.

• OPEN STATE (Docket Header Expanded)
   - Icon: `circle-chevron-up`
   - Position: x=27px; y=18px
   - Dimensions: width=28px; height=28px
   - Color: 30% tint of #253541 (hex #9ba1a6)
   - Do not use rgba transparency

• CLOSED STATE (Docket Header Collapsed)
   - Icon should change to: `circle-chevron-down`
   - Position: x=27px; y=18px (same as open state)
   - Dimensions: width=28px; height=28px
   - Color: 30% tint of #253541 (hex #9ba1a6)
   - Do not use rgba transparency
   - When collapsed, only the down arrow should be visible (docket header content should be fully hidden)

• Correct behavior:
   - When header is **open**, display `circle-chevron-up`
   - When header is **closed**, switch to `circle-chevron-down`
   - Clicking the icon toggles between the two states

----------------------------
INTERACTIVITY – HOVER STATES
----------------------------

• On hover, all up and down arrow icons should change to solid color #f26419 (100% opacity)  
• Applies to both Lucide icons: `circle-chevron-up` and `circle-chevron-down`  
• No animation or transition is required unless specified separately


────────────────────────────
NOTES
────────────────────────────

• All field values are semi-variable: they do not change mid-session, but are case-specific  
• The layout must remain visually aligned with nav bar and report canvas grid systems  
• If horizontal space is constrained:
   - Allow natural line wrapping
   - Or apply horizontal scroll (`overflow-x: scroll`)
   - Do not compress or squish the content

────────────────────────────
EXAMPLE DISPLAY (STATIC)
────────────────────────────

case: david marra v. 13 furnishers, 3 credit bureaus   │    
filed: 06-09-2025   │    
docket: 2025-FC-0001   │    
court: eastern district of new york   │    
judge: hon allyne r ross   │    
next deadline: motion deadline 06-15-25   
