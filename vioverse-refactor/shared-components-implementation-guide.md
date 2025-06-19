# Shared Components Implementation Guide

## Overview
This guide explains how to implement the new shared components system across the VioVerse application to improve consistency, reduce code duplication, and ensure pixel-perfect alignment across all views.

## 1. Shared CSS Classes Migration

### Navigation Bars
Replace view-specific navigation classes with shared ones:

**Before:**
```html
<div class="report-nav-bar">...</div>
<div class="evidence-nav-bar">...</div>
```

**After:**
```html
<div class="shared-nav-bar">...</div>
```

### Canvas Containers
Consolidate canvas container classes:

**Before:**
```html
<div class="report-canvas-container">
    <div class="canvas-content-wrapper">
        <div class="report-canvas">...</div>
    </div>
</div>
```

**After:**
```html
<div class="shared-canvas-container">
    <div class="shared-canvas-wrapper">
        <div class="shared-canvas-background">
            <div class="shared-canvas-content">...</div>
        </div>
    </div>
</div>
```

### Sidebars
Unify sidebar structure:

**Before:**
```html
<aside class="sidebar-canvas">
    <div class="sidebar-bottom-box"></div>
    <h2 class="sidebar-variable-heading">FCRA review summary</h2>
    <div class="sidebar-top-box">...</div>
</aside>
```

**After:**
```html
<aside class="shared-sidebar">
    <div class="shared-sidebar-bottom"></div>
    <h2 class="shared-sidebar-heading"></h2>
    <div class="shared-sidebar-content">...</div>
</aside>
```

### VIObox Containers
Use shared VIObox container:

**Before:**
```html
<div class="viobox-container">...</div>
```

**After:**
```html
<div class="shared-viobox-container">...</div>
```

## 2. JavaScript Module Integration

### Include New Modules
Add to `index.html`:
```html
<!-- Existing modules -->
<script src="js/shared-navigation.js"></script>

<!-- New enhanced modules -->
<script src="js/shared-navigation-enhanced.js"></script>
<script src="js/shared-viobox-renderer.js"></script>
```

### Replace Navigation Logic
Update `refactor-behavior.js` to use shared navigation:

**Before:**
```javascript
// Manual navigation updates
this.updateBureauDisplay();
this.updateDateDisplay();
this.updateCreditorDisplay();
```

**After:**
```javascript
// Use shared navigation
document.dispatchEvent(new CustomEvent('navigate', {
    detail: {
        bureau: this.currentBureau,
        date: this.reportDate,
        creditor: this.currentCreditor,
        page: this.currentPage
    }
}));
```

### Replace VIObox Creation
Update VIObox rendering to use shared renderer:

**Before:**
```javascript
createVIObox(violation) {
    const box = document.createElement('button');
    // ... manual creation logic
}
```

**After:**
```javascript
renderViolations() {
    const container = document.querySelector('.shared-viobox-container');
    window.sharedVioboxRenderer.renderViolations(
        container, 
        this.violations,
        { interactive: true }
    );
}
```

## 3. Benefits of Shared Components

### Consistency
- All navigation bars look and behave identically
- VIOboxes render the same way across all views
- Sidebars maintain consistent structure

### Maintainability
- Single source of truth for each component
- Changes propagate automatically to all views
- Reduced code duplication

### Performance
- Shared CSS reduces file size
- Reusable JavaScript modules
- Better caching

### Accessibility
- Consistent ARIA labels and keyboard navigation
- Unified screen reader announcements
- Predictable user experience

## 4. Migration Checklist

- [ ] Update CSS imports to include `shared-components-enhanced.css`
- [ ] Replace view-specific navigation bar classes
- [ ] Consolidate canvas container structures
- [ ] Unify sidebar implementations
- [ ] Update VIObox containers to use shared class
- [ ] Integrate shared navigation JavaScript
- [ ] Replace manual VIObox creation with shared renderer
- [ ] Test all views for consistent behavior
- [ ] Verify mobile responsiveness
- [ ] Check accessibility features

## 5. Future Enhancements

### Component Library
Consider creating additional shared components:
- Shared modal system
- Unified form controls
- Common animation patterns
- Shared loading states

### State Management
Implement a centralized state management system:
- Single source of truth for navigation state
- Shared violation selection state
- Unified filter and search state

### Event Bus
Create a unified event system:
- Consistent event naming conventions
- Centralized event documentation
- Debug mode for event tracking

## 6. Testing Shared Components

### Visual Testing
- Compare screenshots across views
- Verify pixel-perfect alignment
- Check responsive behavior

### Functional Testing
- Test navigation synchronization
- Verify VIObox selection state
- Check tooltip behavior

### Accessibility Testing
- Screen reader testing
- Keyboard navigation
- Focus management

## Example Implementation

Here's a complete example of converting the report view navigation:

```html
<!-- Before -->
<div class="report-nav-bar">
    <div class="nav-segment bureau-segment">
        <img src="assets/bureaus/EQ_White_Logo.png" alt="Equifax" class="bureau-logo">
        <!-- Custom navigation code -->
    </div>
</div>

<!-- After -->
<div class="shared-nav-bar" data-view="report">
    <div class="shared-nav-segment bureau">
        <img src="assets/bureaus/EQ_White_Logo.png" alt="Equifax" class="bureau-logo">
        <!-- Shared navigation handled by module -->
    </div>
</div>
```

The shared navigation module automatically handles all events and updates.