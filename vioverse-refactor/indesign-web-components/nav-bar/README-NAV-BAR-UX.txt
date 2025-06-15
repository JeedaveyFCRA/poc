NAV-BAR UX SPECIFICATION
========================

Component: Continuous Flow Navigation
Date: January 2025
Path: /home/avid_arrajeedavey/vioverse-refactor/indesign-web-components/nav-bar/

────────────────────────────
CURRENT BEHAVIOR
────────────────────────────

The navigation bar currently stops at boundaries:
• Creditor navigation stops at the last creditor in current bureau
• Bureau navigation is manual only
• Date navigation is manual only
• Users must click bureau/date arrows to continue browsing

Example flow:
[Ally | Equifax | 04-25-2024] → ... → [Sears | Equifax | 04-25-2024] → STOPS

────────────────────────────
AUTO-ADVANCE NAVIGATION LOGIC
────────────────────────────

New continuous flow behavior:

FORWARD NAVIGATION (→):
1. Within same bureau: Advance to next creditor
2. At last creditor of bureau: 
   → Auto-advance to NEXT BUREAU + FIRST CREDITOR
   Example: [Sears | Equifax | 04-25-2024] → [Ally | Experian | 04-25-2024]
   
3. At last creditor of last bureau (TransUnion):
   → Auto-advance to NEXT DATE + FIRST BUREAU + FIRST CREDITOR
   Example: [Sears | TransUnion | 04-25-2024] → [Ally | Equifax | 05-15-2024]

REVERSE NAVIGATION (←):
1. Within same bureau: Go to previous creditor
2. At first creditor of bureau:
   → Auto-advance to PREVIOUS BUREAU + LAST CREDITOR
   Example: [Ally | Experian | 04-25-2024] → [Sears | Equifax | 04-25-2024]
   
3. At first creditor of first bureau (Equifax):
   → Auto-advance to PREVIOUS DATE + LAST BUREAU + LAST CREDITOR
   Example: [Ally | Equifax | 05-15-2024] → [Sears | TransUnion | 04-25-2024]

────────────────────────────
HIGHLIGHT FEEDBACK SPECS
────────────────────────────

Visual feedback when auto-advancing occurs:

BUREAU CHANGE ANIMATION:
• Target: Bureau logo and bureau arrows
• Effect: Orange glow (#f26419) with 30% opacity
• Duration: 400ms fade in/out
• CSS: box-shadow: 0 0 12px rgba(242, 100, 25, 0.3)

DATE CHANGE ANIMATION:
• Target: Report date text and date arrows
• Effect: Orange glow (#f26419) with 30% opacity
• Duration: 400ms fade in/out
• CSS: box-shadow: 0 0 12px rgba(242, 100, 25, 0.3)

CLASS TRIGGERS:
• Add class "nav-transitioning" to segment during animation
• Remove class after animation completes

────────────────────────────
TOOLTIP PREVIEW LOGIC
────────────────────────────

Tooltips show ONLY when tool-tips toggle is ON:

TOOLTIP CONTENT:
• Shows next destination on hover
• Format: "Next: [Creditor] – [Bureau] – [Date]"
• Examples:
  - Normal: "Next: Bank of America"
  - At boundary: "Next: Ally – Experian – 04-25-2024"
  - At date boundary: "Next: Ally – Equifax – 05-15-2024"

TOOLTIP STYLING:
• Background: #253541
• Text: #ffffff
• Font: Space Grotesk Bold, 10pt
• Padding: 6px 12px
• Border-radius: 18px
• Position: Above arrow, centered
• Arrow pointer: Bottom center

TOOLTIP BEHAVIOR:
• Show on arrow hover (150ms delay)
• Hide on mouse leave
• Hide immediately if tool-tips toggled OFF
• Update content dynamically based on current position

────────────────────────────
ACCESSIBILITY NOTES
────────────────────────────

SCREEN READER ANNOUNCEMENTS:
• "Advanced to Experian bureau"
• "Advanced to next report date: May 15, 2024"
• Use aria-live="polite" region

KEYBOARD SUPPORT:
• Tab order maintained through all transitions
• Focus remains on clicked arrow after auto-advance
• Arrow keys work identically to mouse clicks

VISUAL INDICATORS:
• High contrast maintained (WCAG AA)
• Animation respects prefers-reduced-motion
• Clear visual hierarchy preserved

TOOL-TIPS TOGGLE INTEGRATION:
• Check .tool-tips-toggle[aria-checked="true"] for tooltip visibility
• Tooltips completely hidden when toggle is OFF
• No hover delays when tooltips disabled

────────────────────────────
FUTURE ENHANCEMENTS
────────────────────────────

KEYBOARD SHORTCUTS:
• Shift + Arrow: Skip to next/previous bureau
• Ctrl + Arrow: Skip to next/previous date
• Home/End: First/last creditor in current bureau

WRAP-AROUND SETTINGS:
• User preference to disable auto-advance
• Option to require double-click at boundaries
• Configurable pause duration at transitions

BREADCRUMB TRAIL:
• Visual indicator showing position in sequence
• Mini-map of all available reports
• Progress bar showing completion status

PREDICTIVE LOADING:
• Pre-fetch next likely report image
• Cache recently viewed reports
• Smooth transitions without loading delays