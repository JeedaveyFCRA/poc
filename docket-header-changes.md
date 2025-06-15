# Docket Header Implementation Changes

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
    padding: 0 60px 0 60px; /* Padding for arrow button */
    transition: all var(--transition-normal);
    z-index: var(--z-base);
    overflow: hidden;
}

.docket-header.collapsed {
    height: 48px; /* Maintain height when collapsed */
}

.docket-header.collapsed .docket-content {
    opacity: 0;
    visibility: hidden;
}

.docket-content {
    display: flex;
    align-items: center;
    gap: 24px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
    transition: opacity var(--transition-normal), visibility var(--transition-normal);
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

/* Adjust main-nav positioning to account for docket header */
.main-nav {
    margin-top: 70px; /* Account for docket header above */
}
```

Add to the `:root` section at the top of the CSS file (if not already present):

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');
```

## 3. JavaScript Changes (`/home/avid_arrajeedavey/vioverse-refactor/js/refactor-behavior.js`)

Update the `toggleDocket()` function (lines 150-171):

```javascript
toggleDocket() {
    this.docketExpanded = !this.docketExpanded;
    const header = document.querySelector('.docket-header');
    const toggle = document.querySelector('.docket-toggle');
    
    if (header && toggle) {
        if (this.docketExpanded) {
            header.classList.remove('collapsed');
            toggle.setAttribute('aria-expanded', 'true');
        } else {
            header.classList.add('collapsed');
            toggle.setAttribute('aria-expanded', 'false');
        }
        
        // Update icon
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', this.docketExpanded ? 'circle-chevron-up' : 'circle-chevron-down');
            lucide.createIcons();
        }
    }
}
```

## Key Changes Summary:

1. **Container**: Fixed dimensions (1898x48px), positioned at x=11px, y=9px with 36px rounded corners
2. **Arrow Button**: Moved inside header at x=27px, vertically centered
3. **Typography**: Space Grotesk Bold 14pt, all lowercase
4. **Colors**: Labels #9ba1a6, values white, dividers #9ba1a6
5. **Layout**: Horizontal with 30px dividers between fields
6. **Collapse**: Only content fades out, container maintains height, arrow changes to circle-chevron-down
7. **All 6 fields**: case, filed, docket, court, judge, next deadline

The docket header now properly contains all elements including the toggle button, and maintains its size when collapsed.