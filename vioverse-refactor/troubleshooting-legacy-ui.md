# Troubleshooting Legacy UI Appearance

If you're still seeing the legacy appearance after the cleanup, check these items:

## 1. Clear Browser Cache
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache completely
- Open in incognito/private window

## 2. Verify File Changes Were Saved
All changes have been applied to:
- ✅ `index.html` - Old view toggle removed (line 111)
- ✅ `css/refactor-ui.css` - Old styles removed (line 416)
- ✅ `js/refactor-behavior.js` - Old event listeners removed

## 3. Check What Should Be Visible

### New UI Elements (Should be visible):
- **Docket Header** - At top (x=11px, y=9px)
- **New View Toggle** - Orange sliding toggle (x=70px, y=76px)
- **Main Navigation** - Creditor display, bureau pills, page nav, tips toggle

### Old UI Elements (Should NOT be visible):
- ❌ Old view toggle with icons (file-text, edit-3, folder-open)
- ❌ Blue rounded button styling
- ❌ Individual toggle buttons

## 4. Possible Issues

### CSS Not Loading
Check browser console for errors loading:
- `/css/refactor-ui.css`
- Google Fonts (Space Grotesk)

### JavaScript Errors
Check console for JavaScript errors that might prevent proper rendering

### Conflicting Styles
The `.main-nav` has duplicate definitions:
- Line 278: `margin-top: 70px`
- Line 392: `margin-left: 360px`
- Line 398: Full nav definition

## 5. Quick Fix Test

Add this to the browser console to verify new toggle is working:
```javascript
// Check if new toggle exists
console.log('New toggle exists:', !!document.querySelector('.view-toggle-new'));
console.log('Old toggle exists:', !!document.querySelector('.view-toggle'));
console.log('Toggle indicator:', document.querySelector('.toggle-indicator'));
```

## 6. Visual Check

The page should show:
1. Docket header with 6 fields at the very top
2. New view toggle (dark gray bar with orange slider) below docket
3. Main navigation bar to the right of the toggle
4. NO blue toggle buttons with icons

If you're seeing blue buttons with icons, the browser is likely caching old styles.