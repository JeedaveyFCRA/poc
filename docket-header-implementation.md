# Docket Header Implementation - Corrected Version

## 1. HTML Changes (`/home/avid_arrajeedavey/vioverse-refactor/index.html`)

Replace lines 26-56 with:

```html
<!-- Collapsible Docket Header -->
<header class="docket-header" id="docket-header" aria-label="Case Information">
    <!-- Toggle button inside header -->
    <button class="docket-toggle" 
            id="docket-toggle"
            aria-label="Toggle case information" 
            aria-expanded="true"
            aria-controls="docket-content">
        <i data-lucide="circle-chevron-up"></i>
    </button>
    
    <!-- Docket content -->
    <div class="docket-content" id="docket-content">
        <div class="field-item">
            <span class="field-label">case:&nbsp;</span>
            <span class="field-value">david marra v. 13 furnishers, 3 credit bureaus</span>
        </div>
        <div class="divider"></div>
        <div class="field-item">
            <span class="field-label">filed:&nbsp;</span>
            <span class="field-value">06-09-2025</span>
        </div>
        <div class="divider"></div>
        <div class="field-item">
            <span class="field-label">docket:&nbsp;</span>
            <span class="field-value">2025-fc-0001</span>
        </div>
        <div class="divider"></div>
        <div class="field-item">
            <span class="field-label">court:&nbsp;</span>
            <span class="field-value">eastern district of new york</span>
        </div>
        <div class="divider"></div>
        <div class="field-item">
            <span class="field-label">judge:&nbsp;</span>
            <span class="field-value">hon allyne r ross</span>
        </div>
        <div class="divider"></div>
        <div class="field-item">
            <span class="field-label">next deadline:&nbsp;</span>
            <span class="field-value">motion deadline 06-15-25</span>
        </div>
    </div>
</header>

<!-- Arrow only container for collapsed state -->
<div class="arrow-only-container" id="arrow-only-container">
    <button class="arrow-only-toggle" 
            id="arrow-only-toggle"
            aria-label="Expand case information" 
            aria-expanded="false">
        <i data-lucide="circle-chevron-down"></i>
    </button>
</div>

<!-- Main Navigation Bar -->
<nav class="main-nav" aria-label="Main navigation">
    <!-- Remove the docket toggle from here since it's now inside the header -->
    <div class="nav-left">
        <!-- View Toggle Buttons -->
```

## 2. CSS Changes (`/home/avid_arrajeedavey/vioverse-refactor/css/refactor-ui.css`)

Replace lines 153-226 with:

```css
/* ========================================
   Docket Header
   ======================================== */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');

.docket-header {
    position: fixed;
    top: 9px;
    left: 11px;
    width: 1898px;
    height: 48px;
    background-color: #253541;
    border: 3px solid #9ba1a6;
    border-radius: 36px;
    display: flex;
    align-items: center;
    padding: 0 24px 0 77px; /* Left padding 77px (27px for button + 50px shift) */
    transition: all var(--transition-normal);
    z-index: var(--z-base);
    overflow: hidden;
    box-sizing: border-box;
}

/* Collapsed state - container collapses */
.docket-header.collapsed {
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
    border-width: 0;
    margin-top: -48px; /* Move everything up */
}

/* Down arrow container when collapsed */
.arrow-only-container {
    position: fixed;
    top: 9px;
    left: 11px;
    width: 48px;
    height: 48px;
    background-color: #253541;
    border: 3px solid #9ba1a6;
    border-radius: 24px;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: calc(var(--z-base) + 1);
    box-sizing: border-box;
}

.arrow-only-container.visible {
    display: flex;
}

.docket-content {
    display: flex;
    align-items: center;
    gap: 24px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
    margin-left: 50px; /* Shift content right by 50px */
}

.field-item {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
}

.field-label {
    color: #9ba1a6;
    text-transform: lowercase;
}

.field-value {
    color: #ffffff;
    text-transform: lowercase;
}

.divider {
    width: 1px;
    height: 30px;
    background-color: #9ba1a6;
    flex-shrink: 0;
    align-self: center;
}

/* Arrow Button - Inside header */
.docket-toggle {
    position: absolute;
    left: 27px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    color: #9ba1a6;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-fast);
    z-index: 10;
}

.docket-toggle:hover {
    color: #f26419;
}

.docket-toggle svg {
    width: 28px;
    height: 28px;
}

/* Arrow button for collapsed state */
.arrow-only-toggle {
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    color: #9ba1a6;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-fast);
}

.arrow-only-toggle:hover {
    color: #f26419;
}

.arrow-only-toggle svg {
    width: 28px;
    height: 28px;
}

/* Adjust main-nav and content when docket collapses */
.main-nav {
    margin-top: 70px;
    transition: margin-top var(--transition-normal);
}

.docket-header.collapsed ~ .main-nav {
    margin-top: 20px; /* Move up when docket is collapsed */
}
```

## 3. JavaScript Changes (`/home/avid_arrajeedavey/vioverse-refactor/js/refactor-behavior.js`)

Replace the `toggleDocket()` function (lines 150-171) and update the event listener setup:

```javascript
toggleDocket() {
    this.docketExpanded = !this.docketExpanded;
    const header = document.querySelector('.docket-header');
    const arrowOnly = document.querySelector('.arrow-only-container');
    const upToggle = document.querySelector('.docket-toggle');
    
    if (header && arrowOnly) {
        if (this.docketExpanded) {
            // Expand
            header.classList.remove('collapsed');
            arrowOnly.classList.remove('visible');
            upToggle.setAttribute('aria-expanded', 'true');
        } else {
            // Collapse
            header.classList.add('collapsed');
            arrowOnly.classList.add('visible');
            upToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Update icons using Lucide
        lucide.createIcons();
    }
}
```

And update the event listener setup (around line 66-69) to include both buttons:

```javascript
// Docket toggle functionality
const docketToggle = document.querySelector('.docket-toggle');
const arrowOnlyToggle = document.querySelector('.arrow-only-toggle');
if (docketToggle) {
    docketToggle.addEventListener('click', () => this.toggleDocket());
}
if (arrowOnlyToggle) {
    arrowOnlyToggle.addEventListener('click', () => this.toggleDocket());
}
```

## Summary of Key Changes:

1. **Container fully collapses**: Height goes to 0, borders disappear, content moves up by -48px
2. **Separate down arrow container**: Shows only when collapsed, positioned at same location
3. **Exact width**: 1898px (use box-sizing: border-box to include borders)
4. **Content shifted right**: 50px margin-left on docket-content
5. **Main content moves up**: When docket collapses, navigation and content shift up
6. **Proper toggle behavior**: Circle-chevron-up when open, circle-chevron-down when closed

The docket header now properly collapses completely, with only the down arrow remaining visible in a small circular container.