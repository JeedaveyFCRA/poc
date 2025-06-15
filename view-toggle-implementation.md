# New View Toggle Implementation

## Overview
This implementation replaces the existing view toggle buttons with a new design that features:
- Fixed position at x=70px, y=76px (below docket header)
- 270px × 40px container with #253541 background
- Orange sliding indicator (90px × 40px) that moves between views
- Space Grotesk Bold 16pt typography
- All lowercase text
- Same functionality as existing toggle but different visual appearance

## 1. HTML Changes (`/home/avid_arrajeedavey/vioverse-refactor/index.html`)

Replace the existing view toggle (lines 83-109) with:

```html
<!-- New View Toggle -->
<div class="view-toggle-new" id="view-toggle-new" role="tablist" aria-label="View selection">
    <!-- Orange toggle indicator -->
    <div class="toggle-indicator report" id="toggle-indicator"></div>
    
    <!-- View labels -->
    <div class="view-labels">
        <button class="view-label viotagger" 
                role="tab"
                aria-selected="false"
                aria-controls="tagger-view"
                data-view="tagger"
                tabindex="-1">viotagger</button>
        <button class="view-label report active" 
                role="tab"
                aria-selected="true"
                aria-controls="report-view"
                data-view="report"
                tabindex="0">report</button>
        <button class="view-label evidence" 
                role="tab"
                aria-selected="false"
                aria-controls="evidence-view"
                data-view="evidence"
                tabindex="-1">evidence</button>
    </div>
</div>

<!-- Keep the old toggle hidden for now (can be removed later) -->
<div class="view-toggle" role="tablist" aria-label="View selection" style="display: none;">
    <!-- ... existing toggle content ... -->
</div>
```

## 2. CSS Changes (`/home/avid_arrajeedavey/vioverse-refactor/css/refactor-ui.css`)

Add after the docket header styles:

```css
/* ========================================
   New View Toggle
   ======================================== */
.view-toggle-new {
    position: fixed;
    top: 76px;
    left: 70px;
    width: 270px;
    height: 40px;
    background-color: #253541;
    border: 3px solid #9ba1a6;
    border-radius: 36px;
    box-sizing: border-box;
    overflow: visible;
    z-index: calc(var(--z-base) - 1); /* Below docket header */
}

/* View labels container */
.view-labels {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    align-items: center;
    z-index: 2;
}

/* View label buttons */
.view-label {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 16px;
    text-transform: lowercase;
    cursor: pointer;
    transition: color 0.3s ease;
    user-select: none;
    background: none;
    border: none;
    padding: 0;
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.view-label.viotagger {
    left: 8px; /* Moved left by 2px */
    width: 75px;
    color: #9ba1a6;
}

.view-label.report {
    left: 97px;
    width: 75px;
    color: #9ba1a6;
}

.view-label.evidence {
    left: 188px; /* Moved right by 3px total */
    width: 75px;
    color: #9ba1a6;
}

/* Active state labels */
.view-label.active {
    color: #ffffff;
}

/* Focus states for accessibility */
.view-label:focus {
    outline: 2px solid #f26419;
    outline-offset: -2px;
    border-radius: 18px;
}

/* Orange toggle indicator */
.toggle-indicator {
    position: absolute;
    top: -3px; /* Move up 3px */
    width: 90px;
    height: 40px;
    background-color: #f26419;
    border: 3px solid #f8b98c;
    border-radius: 36px;
    box-sizing: border-box;
    transition: left 0.3s ease;
    z-index: 1;
}

/* Toggle indicator positions */
.toggle-indicator.tagger {
    left: 0;
}

.toggle-indicator.report {
    left: 90px;
}

.toggle-indicator.evidence {
    left: 180px;
}

/* Adjust main-nav to account for new toggle position */
.main-nav {
    margin-left: 360px; /* 70px (toggle x) + 270px (toggle width) + 20px gap */
}
```

## 3. JavaScript Changes (`/home/avid_arrajeedavey/vioverse-refactor/js/refactor-behavior.js`)

Update the event listener setup (around line 60) to include the new toggle:

```javascript
// View toggle functionality (both old and new)
const viewButtons = document.querySelectorAll('.view-btn');
viewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => this.switchView(e.currentTarget.dataset.view));
});

// New view toggle functionality
const viewLabels = document.querySelectorAll('.view-label');
viewLabels.forEach(label => {
    label.addEventListener('click', (e) => this.switchView(e.currentTarget.dataset.view));
});
```

Update the `switchView` method (around line 129) to handle both toggles:

```javascript
switchView(viewName) {
    if (viewName === this.currentView) return;
    
    // Map 'tagger' to 'viotagger' for indicator positioning
    const indicatorClass = viewName === 'tagger' ? 'tagger' : viewName;
    
    // Update view state
    this.currentView = viewName;
    document.querySelector('.vioverse-app').dataset.view = viewName;
    
    // Update old toggle button states (if still present)
    document.querySelectorAll('.view-btn').forEach(btn => {
        const isActive = btn.dataset.view === viewName;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive);
    });
    
    // Update new toggle
    const indicator = document.getElementById('toggle-indicator');
    if (indicator) {
        indicator.className = 'toggle-indicator ' + indicatorClass;
    }
    
    // Update new toggle label states
    document.querySelectorAll('.view-label').forEach(label => {
        const isActive = label.dataset.view === viewName;
        label.classList.toggle('active', isActive);
        label.setAttribute('aria-selected', isActive);
        label.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    
    // Update panel visibility
    document.querySelectorAll('.view-panel').forEach(panel => {
        const isActive = panel.id === `${viewName}-view`;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
    });
    
    // Announce view change to screen readers
    this.announce(`Switched to ${viewName} view`);
}
```

Add keyboard navigation for the new toggle (in the keydown handler):

```javascript
// Arrow key navigation for new toggle
if (document.activeElement.classList.contains('view-label')) {
    const labels = Array.from(document.querySelectorAll('.view-label'));
    const currentIndex = labels.indexOf(document.activeElement);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        labels[currentIndex - 1].focus();
    } else if (e.key === 'ArrowRight' && currentIndex < labels.length - 1) {
        e.preventDefault();
        labels[currentIndex + 1].focus();
    }
}
```

## 4. Notes

- The new toggle maintains all the functionality of the existing toggle
- It supports keyboard navigation with arrow keys and tab
- Screen reader announcements are preserved
- The visual design matches the specifications exactly
- The old toggle is hidden but can be easily restored if needed
- The implementation is fully accessible with ARIA attributes

## 5. Migration Path

1. First, add the new toggle alongside the old one
2. Test that both work correctly
3. Hide the old toggle (as shown in the HTML)
4. After confirming everything works, remove the old toggle code entirely