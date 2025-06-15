# Severity Summary Toggle Implementation Guide

## Overview
This guide documents the complete implementation of the two-button toggle approach for the severity summary component, including all CSS, HTML structure, and JavaScript functionality.

## HTML Structure

### Current Implementation
```html
<!-- Severity Summary Component -->
<div class="severity-summary-component" id="severitySummary">
    <!-- Collapsed label -->
    <span class="severity-summary-collapsed-label">show severity</span>
    
    <!-- Header with toggle button -->
    <div class="severity-summary-header-wrapper">
        <h2 class="severity-summary-header">severity summary</h2>
        <!-- Toggle button for expanded state -->
        <button class="severity-summary-toggle severity-summary-toggle-expanded" aria-expanded="true" aria-controls="severity-summary-content">
            <i data-lucide="circle-chevron-up"></i>
        </button>
        <!-- Toggle button for collapsed state -->
        <button class="severity-summary-toggle severity-summary-toggle-collapsed" aria-expanded="false" aria-controls="severity-summary-content">
            <i data-lucide="circle-chevron-down"></i>
        </button>
    </div>
    
    <!-- Collapsible Content -->
    <div class="severity-summary-content" id="severity-summary-content">
        <div class="severity-boxes-row">
            <!-- Severity boxes here -->
        </div>
    </div>
</div>
```

## CSS Specifications

### Component Container
```css
.severity-summary-component {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px 24px 0 24px; /* Match filter-counter padding */
    margin-top: -19px; /* Move up by 19px (14px + 5px) */
    box-sizing: border-box; /* Include padding in width calculation */
}
```

### Header Wrapper
```css
.severity-summary-header-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    overflow: visible; /* Ensure buttons aren't clipped */
}
```

### Header Text
```css
.severity-summary-header {
    font-family: "jaf-bernino-sans-comp", sans-serif;
    font-weight: 800;
    font-style: normal;
    font-size: 24pt; /* Reduced from 30pt to match demo */
    color: rgba(37, 53, 65, 0.9);
    margin: 0; /* Reset all margins */
    text-transform: lowercase;
    letter-spacing: -0.02em;
    flex: 1; /* Take available space */
    text-align: left;
}
```

### Toggle Button Base Styles
```css
.severity-summary-toggle {
    position: absolute; /* Back to absolute for better control */
    right: 0px; /* Moved 8px to the right (was 8px) */
    top: 50%; /* Center vertically */
    transform: translateY(-50%); /* Perfect vertical center */
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 300ms ease;
}

.severity-summary-toggle svg {
    color: #A8AEB3 !important;
    stroke: #A8AEB3 !important;
    fill: none !important;
    width: 28px;
    height: 28px;
    transition: all 300ms ease;
    display: block;
}

.severity-summary-toggle:hover svg {
    color: #F26419 !important;
    stroke: #F26419 !important;
}
```

### Collapsed Button Specific Styles
```css
/* Hide collapsed button by default */
.severity-summary-toggle-collapsed {
    display: none; /* Hidden by default */
    width: 15px;
    height: 15px;
    padding: 1px; /* Center the 13px icon in 15px button */
    z-index: 20; /* Higher z-index */
    background: none;
    /* Position it differently since absolute positioning */
    right: -2px !important; /* Moved 6px to the right (was 4px) */
}

.severity-summary-toggle-collapsed svg {
    width: 10.5px !important;
    height: 10.5px !important;
    stroke-width: 2.5 !important; /* Thicker stroke for better visibility */
    color: #A8AEB3 !important;
    stroke: #A8AEB3 !important;
    fill: none !important;
    display: block !important;
}
```

### Button Visibility Control
```css
/* Show/hide buttons based on state */
.severity-summary-component.collapsed .severity-summary-toggle-expanded {
    display: none;
}

.severity-summary-component.collapsed .severity-summary-toggle-collapsed {
    display: flex;
}
```

### Collapsed Label
```css
.severity-summary-collapsed-label {
    position: absolute;
    left: 308px; /* Final position after adjustments */
    top: 33px; /* Final position after adjustments */
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 400;
    font-size: 8pt;
    color: rgba(37, 53, 65, 0.9);
    opacity: 0;
    pointer-events: none;
    transition: all 300ms ease;
    cursor: pointer;
    z-index: 11; /* Above other elements */
}

.severity-summary-collapsed-label:hover {
    color: #F26419;
}

.severity-summary-component.collapsed .severity-summary-collapsed-label {
    opacity: 1;
    pointer-events: auto;
}

.severity-summary-component.collapsed .severity-summary-header {
    opacity: 0;
}
```

### Content Container
```css
.severity-summary-content {
    overflow: hidden;
    transition: all 300ms ease;
    transform-origin: top;
    width: 100%;
    padding: 0; /* No padding - handled by children */
    margin: 0;
}

.severity-summary-component.collapsed .severity-summary-content {
    height: 0;
    opacity: 0;
    transform: scaleY(0);
}
```

### Severity Boxes Row
```css
.severity-boxes-row {
    display: flex;
    gap: 8px;
    margin: 0; /* Remove margins - padding is handled by parent */
    padding: 0 0 10px 0; /* Bottom padding for shadow space */
    justify-content: flex-start; /* Align boxes to start */
}
```

### Adjacent Component Adjustment
```css
/* Move violation details up when severity is collapsed */
.severity-summary-component.collapsed + .violation-details-component {
    margin-top: -16px; /* Adjust spacing when severity is collapsed */
}
```

## JavaScript Implementation

```javascript
// Severity Summary toggle functionality (new) - Two button approach
const severitySummaryToggleExpanded = document.querySelector('.severity-summary-toggle-expanded');
const severitySummaryToggleCollapsed = document.querySelector('.severity-summary-toggle-collapsed');
const severitySummaryContainer = document.querySelector('.severity-summary-component');
const severitySummaryLabel = document.querySelector('.severity-summary-collapsed-label');

if (severitySummaryContainer) {
    const toggleSeveritySummary = () => {
        // Toggle collapsed class
        severitySummaryContainer.classList.toggle('collapsed');
        
        // Update aria-expanded on both buttons
        const isCollapsed = severitySummaryContainer.classList.contains('collapsed');
        if (severitySummaryToggleExpanded) {
            severitySummaryToggleExpanded.setAttribute('aria-expanded', !isCollapsed);
        }
        if (severitySummaryToggleCollapsed) {
            severitySummaryToggleCollapsed.setAttribute('aria-expanded', !isCollapsed);
        }
        
        // CSS handles button visibility - no icon switching needed
        
        // Announce state change for accessibility
        const announcement = isCollapsed ? 'Severity summary collapsed' : 'Severity summary expanded';
        this.announce(announcement);
    };
    
    // Add click events to both toggle buttons
    if (severitySummaryToggleExpanded) {
        severitySummaryToggleExpanded.addEventListener('click', toggleSeveritySummary);
    }
    if (severitySummaryToggleCollapsed) {
        severitySummaryToggleCollapsed.addEventListener('click', toggleSeveritySummary);
    }
    
    // Add click event to collapsed label
    if (severitySummaryLabel) {
        severitySummaryLabel.addEventListener('click', toggleSeveritySummary);
    }
}
```

## Key Implementation Points

### 1. Two-Button Approach
- **NO icon switching in JavaScript** - CSS handles visibility
- Each button has its own Lucide icon that never changes
- Avoids all Lucide resizing issues

### 2. Positioning Context
- Component uses **padding: 16px 24px 0 24px** to match filter-counter
- Toggle buttons use **absolute positioning** within header wrapper
- Collapsed label positioned absolutely relative to component

### 3. Critical CSS Rules
- **overflow: hidden** on content container is needed for collapse animation
- **z-index** hierarchy: collapsed button (20) > collapsed label (11) > base toggle (10)
- **Shadow space**: 10px bottom padding on severity-boxes-row

### 4. Common Issues & Solutions
- **Icons not visible**: Ensure `stroke` property is set, not just `color`
- **Shadow clipping**: Add padding to container, not margin
- **Button positioning**: Use absolute positioning for precise control
- **Collapsed button hidden**: Check display property isn't overridden

### 5. Color Reference
- Default icon color: #A8AEB3
- Hover color: #F26419
- Text color: rgba(37, 53, 65, 0.9)

### 6. Size Reference
- Expanded button: 28×28px
- Expanded icon: 28×28px
- Collapsed button: 15×15px
- Collapsed icon: 10.5×10.5px
- Header font: 24pt

### 7. Implementation Order
1. Update HTML with two buttons
2. Add CSS for both button states
3. Update JavaScript to remove icon switching
4. Test collapse/expand functionality
5. Fine-tune positioning

## For Violation Details Implementation
Apply the same pattern:
1. Create two buttons (expanded/collapsed)
2. Use CSS to show/hide based on `.violation-details-component.collapsed`
3. Remove any icon switching from JavaScript
4. Ensure proper z-index layering
5. Match the toggle button sizes to other components (28×28px expanded)