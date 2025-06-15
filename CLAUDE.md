# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is POC Viewer v2, a modular credit report evidence viewer for FCRA (Fair Credit Reporting Act) violations analysis. The application displays credit report images with interactive evidence overlays, violation tracking, and supporting documentation management.

## Application Architecture

### Core Components
- **Main View** (`poc-view.html`): Primary interface with credit report canvas, bureau/creditor logos, and evidence controls
- **Report Browser** (`report-browser.html`): Metadata browser for credit report PNGs
- **Modular JavaScript**: Decoupled modules for specific functionality (navigation, evidence, state management)
- **Data-Driven Design**: JSON configuration files control content, mappings, and evidence structure

### View Modes
1. **Report View**: Default view showing credit report images with navigation
2. **Evidence Mode**: Activated by evidence buttons, dims main content and shows evidence panels
3. **Canvas View**: Full-screen report viewing with violation overlay capabilities

### Data Architecture
- `data/canvas-map.json`: Report file mappings and navigation structure (currently template format)
- `data/evidence-data.json`: Evidence categories and document definitions
- `data/logo-map.json`: Creditor and bureau logo mappings
- `data/overlays/`: Violation data and overlay configurations
- **StateManager localStorage**: User sessions and violation tracking persistence

## Key Systems

### State Management
- **StateManager** (`js/state-manager.js`): Handles violation state persistence via localStorage
- **VioSessions**: User interface for saving/loading violation sessions
- **Auto-save**: Automatic state preservation during interaction

### Navigation System
- **Multi-level Navigation**: Report → Page → Evidence → Document
- **URL-based Routing**: `?file=` parameter determines current report
- **Dynamic Loading**: Images and content loaded based on current state

### Evidence System
- **Six Evidence Categories**: Additional Evidence, Credit Denials, Emotional Impact, Bankruptcy Docs, Timeline Triggers, Damaging Alerts
- **Hierarchical Structure**: Category → Menu → Canvas → Actual Document
- **Connected Evidence**: Links between reports and supporting documents

## File Structure

### Core Files
- `poc-view.html`: Main application interface
- `js/poc-init.js`: Application initialization and startup logic
- `js/state-manager.js`: Session and violation state management

### Modular JavaScript
- `js/canvas-*.js`: Report canvas functionality (navigation, images, headings)
- `js/evidence-*.js`: Evidence system modules (buttons, menus, documents)
- `js/bureau-logo*.js`: Bureau selection and logo management
- `js/creditor-logo.js`: Creditor identification and logo display

### Styling
- `style/*.css`: Modular CSS files matching JavaScript modules
- `style/z-index-reference.css`: Layer management reference

### Assets
- `assets/reports/`: Credit report PNG images (format: `{CREDITOR}-{BUREAU}-{DATE}-P{PAGE}.png`)
- `assets/logos/`: Creditor and bureau logos (SVG format preferred)
- `assets/icons/`: UI icons and navigation elements

## Development Guidelines

### File Naming Conventions
- **Report Images**: `{CreditorCode}-{BureauCode}-{Date}-P{PageNumber}.png`
  - Example: `AL-EQ-2024-04-25-P57.png` (Ally Financial, Equifax, Page 57)
- **Creditor Codes**: AL (Ally), JP (JPMorgan), BK (Bank), etc.
- **Bureau Codes**: EQ (Equifax), EX (Experian), TU (TransUnion)

### Code Organization
- **Modular Design**: Each major feature has dedicated JS/CSS file pair
- **Event-Driven**: Heavy use of custom events for inter-module communication
- **DOM-Based State**: UI state reflected in DOM classes and attributes
- **Performance Optimized**: Image preloading and lazy loading implemented

### Data Management
- **JSON Configuration**: All content and mappings defined in JSON files
- **Local Storage**: User sessions and violation states persisted locally
- **Dynamic Content**: Evidence documents loaded from JSON definitions

## Development Commands

### Local Development Server
Start a local HTTP server to serve the application (required for proper asset loading):
```bash
python3 -m http.server 8000
```
Then access the application at `http://localhost:8000/poc-view.html?file=AL-EQ-2024-04-25-P57.png`

### Common Development Tasks
- **View specific report**: Add `?file={filename}` parameter to URL
- **Test evidence system**: Click evidence buttons to verify overlay transitions and document loading
- **Test state persistence**: Create violation sessions via StateManager UI and verify localStorage data
- **Validate asset loading**: Check browser console for missing images or JSON files

## Running the Application

### Basic Usage
1. Start local HTTP server: `python3 -m http.server 8000`
2. Open `http://localhost:8000/poc-view.html` in browser
3. Use `?file=` parameter to specify initial report: `poc-view.html?file=AL-EQ-2024-04-25-P57.png`
4. Navigate using arrow controls or evidence buttons

### Testing
- No formal test framework - manual testing via browser
- Test file navigation, evidence mode transitions, and state persistence
- Verify responsive behavior and image loading
- Use browser developer tools to inspect localStorage for state data

### Browser Requirements
- Modern browser with ES6+ support
- Local HTTP server for proper CORS handling and asset loading
- localStorage support for state persistence

## Key Modules

### Core Initialization (`js/poc-init.js`)
- URL parameter parsing and validation
- Component initialization sequence
- Event listener setup for popups and overlays

### Canvas System (`js/canvas-*.js`)
- Image loading and display
- Navigation between reports and pages
- Heading generation based on filename patterns

### Evidence System (`js/evidence-*.js`)
- Six-category evidence organization
- Menu generation from JSON data
- Document display and navigation

### State Management (`js/state-manager.js`)
- Session creation and management
- Violation state persistence
- Export/import functionality