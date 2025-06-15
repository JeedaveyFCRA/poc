# Custom Scroll Component Documentation

## Overview
The Custom-Scroll-Vio-Details component provides a custom vertical scrollbar system for the violation details list. This component replaces the native browser scrollbar with a styled, interactive scrollbar that matches the VioVerse design system.

## Activation Logic
- **Threshold**: Activates when more than 4 violation boxes are present
- **Default State**: Hidden when 4 or fewer violations are displayed
- **Scroll Area**: Violation list becomes scrollable while maintaining fixed viewport height

## Component Structure

### HTML Structure
```html
<div class="custom-scroll-vio-details" id="customScrollVioDetails" style="display: none;">
    <!-- Scroll Up Arrow -->
    <button class="scroll-arrow scroll-up" aria-label="Scroll up">
        <i data-lucide="circle-arrow-up"></i>
    </button>
    
    <!-- Scroll Track (Outer Pill) -->
    <div class="scroll-track">
        <!-- Scroll Thumb (Inner Pill) -->
        <div class="scroll-thumb"></div>
    </div>
    
    <!-- Scroll Down Arrow -->
    <button class="scroll-arrow scroll-down" aria-label="Scroll down">
        <i data-lucide="circle-arrow-down"></i>
    </button>
</div>
```

## Design Specifications

### 1. Scroll Up Arrow
- **Icon**: Lucide `circle-arrow-up`
- **Size**: 10px × 10px
- **Position**: x: 1618px, y: 185px (fixed)
- **Colors**:
  - Default stroke: `#9ba1a6` (30% tint of #253541)
  - Hover/Active: `#f26419`
  - Fill: none
- **Stroke Width**: 1pt

### 2. Scroll Down Arrow
- **Icon**: Lucide `circle-arrow-down`
- **Size**: 10px × 10px
- **Position**: x: 1618px, y: 827px (fixed)
- **Colors**:
  - Default stroke: `#9ba1a6` (30% tint of #253541)
  - Hover/Active: `#f26419`
  - Fill: none
- **Stroke Width**: 1pt

### 3. Scroll Track (Outer Pill)
- **Size**: 10px × 652px
- **Position**: x: 1618px, y: 185px (fixed)
- **Style**:
  - Border: 1pt solid `#9ba1a6`
  - Background: transparent
  - Border-radius: 5px
- **Interaction**: Clickable for jump-scroll functionality

### 4. Scroll Thumb (Inner Pill)
- **Width**: 5px (fixed)
- **Height**: Variable (30px min, 620px max)
- **Position**: 
  - x: 1619px (centered in track)
  - y: 198px minimum (13px from track top for 3px clearance)
- **Style**:
  - Background: `#f26419`
  - Border-radius: 2.5px
  - No border/stroke
- **Constraints**:
  - Minimum 3px clearance from up arrow (bottom edge)
  - Minimum 3px clearance from down arrow (top edge)

## Dynamic Viewport Heights

The violation list viewport height adjusts based on the collapsed/expanded states of filter and severity components:

### State Combinations
1. **Both Expanded** (default): 272px viewport height
2. **Filter Collapsed, Severity Expanded**: 340px viewport height
3. **Filter Expanded, Severity Collapsed**: 350px viewport height
4. **Both Collapsed**: 420px viewport height (maximum)

### Viewport Specifications
- **Base Height**: 272px (when all panels expanded)
- **Padding**: 6px bottom padding for shadow accommodation
- **Overflow**: 
  - Y-axis: auto (allows scrolling)
  - X-axis: visible (preserves shadows)

## Interaction Behaviors

### Scroll Methods
1. **Arrow Buttons**: Click to scroll by 60px increments (smooth)
2. **Track Click**: Click anywhere on track to jump-scroll (thumb centers on click point)
3. **Thumb Drag**: Click and drag thumb for continuous scrolling
4. **Mouse Wheel**: Standard wheel scrolling (when hovering over list)

### Visual Feedback
- Arrow icons change to `#f26419` on hover/click
- Track shows pointer cursor on hover
- Thumb maintains grab cursor during drag
- Body prevents text selection during drag

## JavaScript Implementation

### Key Functions

#### `updateViolationListHeight()`
Calculates and sets viewport height based on component states:
```javascript
- Checks filter-counter collapsed state
- Checks severity-summary collapsed state
- Sets appropriate max-height (272px - 420px)
- Triggers scroll recalculation
```

#### `recalculateCustomScroll()`
Updates scroll thumb size and position:
```javascript
- Calculates thumb height based on content ratio
- Maintains scroll position during viewport changes
- Respects min/max constraints and clearances
```

#### `initCustomScrollVioDetails()`
Initializes the custom scroll system:
```javascript
- Sets up MutationObserver for violation count changes
- Attaches event listeners for all interactions
- Calculates initial thumb dimensions
- Manages native scrollbar hiding
```

### Scroll Calculations

#### Thumb Height
```javascript
thumbHeight = Math.min(620, Math.max(30, (visibleHeight / scrollHeight) * 652))
```

#### Thumb Position Range
- **Minimum**: 13px (from track top)
- **Maximum**: 639px - thumbHeight (from track top)

#### Scroll Percentage
```javascript
scrollPercent = (thumbPosition - 13) / (maxPosition - 13)
```

## CSS Classes

### Component States
- `.custom-scroll-active`: Applied to violation list when scroll is active
- `.dragging-scroll`: Applied to body during thumb drag

### Responsive Adjustments
- Fixed positioning ensures consistent placement
- Z-index layering (50-51) keeps elements above content

## Accessibility Features
- Proper ARIA labels on all interactive elements
- Keyboard navigation support (via native scroll)
- Screen reader announcements for state changes

## Browser Compatibility
- Modern browsers with CSS flexbox support
- Webkit scrollbar hiding for Chrome/Safari
- Firefox scrollbar-width property support
- IE/Edge legacy overflow style support

## Performance Considerations
- MutationObserver for efficient DOM monitoring
- Throttled scroll events
- CSS transitions for smooth animations
- Minimal reflows during interactions

## Testing Checklist
- [ ] Verify activation at 5+ violations
- [ ] Test all scroll methods work correctly
- [ ] Check viewport height adjustments for all states
- [ ] Confirm 3px clearances are maintained
- [ ] Validate thumb height calculations
- [ ] Test click-to-jump accuracy
- [ ] Verify drag behavior and constraints
- [ ] Check shadow preservation in all states
- [ ] Test responsive behavior at different zoom levels
- [ ] Validate accessibility features

## Known Limitations
- Fixed pixel positioning requires specific viewport width
- Not optimized for mobile/touch devices
- Requires JavaScript for functionality
- Custom scroll hidden when 4 or fewer violations

## Future Enhancements
- Touch/mobile gesture support
- Horizontal scroll capability
- Animated transitions for viewport changes
- Configurable scroll speeds
- Theme customization options