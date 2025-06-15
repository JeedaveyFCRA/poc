# VioVerse UI Guide
*Last Updated: January 6, 2025 (Version 2)*

## Overview
VioVerse is an FCRA (Fair Credit Reporting Act) violation analysis platform designed to help legal professionals review credit reports, identify violations, and manage supporting evidence. This guide documents all interactive elements and their functions.

## 🎯 Quick Start
1. **Default View**: Application opens in Report view showing credit report images
2. **Primary Action**: Click on violation boxes (VIOboxes) to select violations
3. **Navigation**: Use arrow buttons to navigate between reports, pages, and creditors
4. **View Switching**: Use the orange toggle to switch between Report, VioTagger, and Evidence views

## 📱 Main Interface Components

### 1. Docket Header (Top Bar)
**Location**: Fixed at top of screen  
**Purpose**: Displays case information

#### Controls:
- **Collapse/Expand Toggle**
  - **Icon**: Circle chevron up (↑) when expanded, down (↓) when collapsed
  - **Action**: Click to hide/show case details
  - **Keyboard**: No shortcut assigned

#### Information Displayed:
- Case name
- Filing date
- Docket number
- Court
- Judge
- Next deadline

### 2. Tool Tips Toggle (NEW)
**Location**: Fixed position at top of screen (x: 279px, y: 135px)  
**Purpose**: Enable/disable tooltip previews throughout the application

#### Appearance:
- **Container**: 54px × 27.5px, dark background (#253541) with gray border
- **Toggle Button**: 27.4px circular indicator that slides left/right
- **Text**: "tips" in lowercase, 10pt Space Grotesk Bold

#### States:
- **OFF (Default)**: 
  - Indicator on left (-2px position)
  - Gray colors (#9ba1a6)
  - Tooltips disabled globally
  
- **ON**: 
  - Indicator on right (26.5px position)
  - Orange indicator (#f26419)
  - White text
  - Enables all tooltip features

### 3. View Toggle (Mode Selector)
**Location**: Below docket header, left side  
**Purpose**: Switch between three main application modes

#### View Options:
1. **viotagger**
   - Purpose: Tag and annotate violations
   - Status: Interface pending implementation
   
2. **report** (Default)
   - Purpose: View credit reports and select violations
   - Features: VIObox overlays, navigation controls
   
3. **evidence**
   - Purpose: Review supporting documents
   - Features: Document navigation, evidence categories

**Visual Feedback**: Orange pill indicator slides to active view

### 4. Report View Navigation Bar
**Location**: Inside white report canvas at top  
**Purpose**: Navigate through credit reports

#### Components (Left to Right):

##### Bureau Selector
- **Display**: Bureau logo (Equifax/Experian/TransUnion)
- **Controls**: Left/Right arrows (← →) - UPDATED from up/down
- **Function**: Cycle through credit bureaus
- **Behavior**: Automatically finds first available report for selected bureau
- **Position**: Moved 8px left from original spec

##### Date Selector
- **Display**: Report date (MM-DD-YYYY format)
- **Controls**: Left/Right arrows (← →) - UPDATED from up/down
- **Function**: Navigate to different report dates
- **Behavior**: Shows only dates with available reports

##### Creditor Selector
- **Display**: Creditor name (lowercase, truncated with ellipsis if too long)
- **Controls**: Left/Right arrows (← →) - UPDATED from up/down
- **Function**: Cycle through creditors
- **NEW: Continuous Flow Navigation** - Auto-advances to next bureau/date at boundaries
- **Available Creditors**:
  - AL - Ally Financial
  - BB - Citibank / Best Buy
  - BK - Bank of America
  - BY - Barclays Bank Delaware
  - C1/C2 - Citizens Bank (Accounts 1 & 2)
  - CR - Cornerstone Community FCU
  - DB - Discover Bank
  - DL - Discover Personal Loans
  - HD - THD / Citibank (Home Depot)
  - JP - JPMCB Card Services (Chase)
  - MF - Mariner Finance
  - SR - Citibank / Sears

##### Page Selector
- **Display**: Current page number
- **Controls**: Left/Right arrows (← →) - UPDATED from up/down
- **Function**: Navigate between pages of current report
- **Behavior**: Maintains violation selections across pages

#### Navigation Dividers (NEW)
- **Appearance**: Thin vertical lines (1px) between sections
- **Color**: #9ba1a6
- **Positions**: Between bureau/report, report/creditor, creditor/page sections

### 4. VIObox System (Violation Markers)
**Location**: Overlaid on credit report images  
**Purpose**: Mark and track FCRA violations

#### Appearance:
- **Shape**: Rounded rectangle with colored severity icon
- **States**:
  - Default: Gray border
  - Hover: Blue border with glow
  - Selected: Blue border with persistent glow

#### Severity Levels:
1. **High (Red)**
   - Icon: Shield with X
   - Typical violations: Incorrect bankruptcy status, wrong balances
   
2. **Medium (Orange)**
   - Icon: Warning triangle
   - Typical violations: Missing data, procedural errors
   
3. **Low (Green)**
   - Icon: Info circle
   - Typical violations: Minor discrepancies, formatting issues

#### Interaction:
- **Click**: Select/deselect violation
- **Selection Persistence**: Selections maintained across page navigation
- **Tooltip**: Shows violation description on hover (if tips enabled)

### 5. Violation Statistics Sidebar
**Location**: Right side panel in Report view  
**Purpose**: Track and filter violation counts

#### Filter Options (Radio Buttons)
- **total violations (all pages)**
  - Shows all violations for current creditor/bureau/date
  - Aggregates across all pages (e.g., P57 + P58)
  
- **selected violations**
  - Shows only violations you've clicked
  - Maintains count as you navigate
  - Selections persist across page changes
  
- **current page only**
  - Shows violations on currently visible page
  - Updates when changing pages

#### Statistics Display:
- **High Severity Count**: Red shield icon with number
- **Medium Severity Count**: Orange triangle icon with number
- **Low Severity Count**: Green info icon with number

#### Violation List:
- Shows violations based on active filter
- Selected violations highlighted with blue background
- Displays severity level and description

### 6. Evidence View Navigation
**Location**: Inside evidence canvas when in Evidence view  
**Purpose**: Navigate through supporting documents

#### Components:
1. **Category Selector**
   - Categories: Additional Evidence, Credit Denials, etc.
   - Up/Down arrows to cycle
   
2. **Document Selector**
   - Shows current document name
   - Navigate between documents in category
   
3. **Page Navigator**
   - Browse multi-page documents
   - Shows current page number

### 7. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ← / → | Navigate pages |
| Shift + ← / → | Navigate creditors |
| Ctrl + 1 | Switch to Report view |
| Ctrl + 2 | Switch to VioTagger view |
| Ctrl + 3 | Switch to Evidence view |

## 💡 Usage Tips

### Selecting Violations:
1. Click on any VIObox to select it
2. Click again to deselect
3. Selections persist when navigating pages
4. Use filters to view different violation counts

### Efficient Navigation:
- Use keyboard shortcuts for faster navigation
- Bureau/Date/Creditor selections automatically find valid combinations
- Page navigation maintains context within current report
- **NEW: Continuous Flow** - Keep clicking creditor arrows to auto-advance through bureaus and dates

### Managing Large Reports:
- Use "selected violations" filter to focus on marked items
- "Total violations" shows complete picture across all pages
- Violation counts update in real-time

### NEW: Navigation Features
- **Auto-Advance**: At last creditor, automatically moves to next bureau
- **Visual Feedback**: Orange glow when bureau/date changes
- **Tooltip Previews**: Hover over arrows to see next destination (when tips are ON)
- **Smart Wrapping**: Seamlessly cycles through all reports

## 🔄 Update Prompt for Future Sessions

When adding new features, use this prompt:
```
"Please update the VIOVERSE-UI-GUIDE.md with the following new feature: [describe feature]. Add it to the appropriate section and update the Last Updated date."
```

## 📝 Changelog

### January 6, 2025 (Version 2)
- Added Tool Tips Toggle component
- Updated all navigation arrows from up/down to left/right (← →)
- Added navigation dividers between sections
- Implemented continuous flow navigation with auto-advance
- Added tooltip previews for navigation (when tips ON)
- Added visual transition feedback (orange glow)
- Fixed creditor name truncation with ellipsis
- Updated bureau logo position (8px left shift)
- Enhanced violation selection persistence across pages

### January 6, 2025 (Version 1)
- Initial documentation created
- Added violation filtering system
- Documented all navigation controls
- Added keyboard shortcuts reference

---

*This document is maintained as features are added to VioVerse. Each new interactive element should be documented here with its location, purpose, and usage instructions.*