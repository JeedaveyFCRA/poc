● Reusable Prompt for Implementing Collapsible Stack Components

  Component Requirements:

  Create a collapsible/expandable stack component within the sidebar that follows these
  specifications:

  Structure:
  - Header section (always visible) containing:
    - Title text (left-aligned)
    - Toggle button (right-aligned) with chevron icon
    - Collapsed state label (hidden when expanded, visible when collapsed)
  - Content section (collapsible) containing the main component content

  Visual Behavior:
  1. Expanded State (default):
    - Header displays title text and up-chevron icon
    - Content section is fully visible
    - Collapsed label is hidden
    - Toggle button shows at normal size and position
  2. Collapsed State:
    - Header title disappears
    - Content section slides up and hides (height: 0, opacity: 0)
    - Down-chevron icon appears (reduced size, repositioned)
    - Collapsed label appears at specified coordinates
    - Toggle button may relocate to fixed position if needed

  Styling Requirements:
  - Toggle button icon in expanded state: 40% tint color (#A8AEB3)
  - Toggle button icon in collapsed state: 30% tint color (#9ba1a6)
  - Hover state for both: orange (#F26419)
  - Smooth transitions (300ms ease) for all state changes
  - Collapsed label: Space Grotesk regular, 8pt, base text color

  JavaScript Behavior:
  - Single click handler on toggle button
  - Toggle collapsed class on component container
  - Switch icon between chevron-up and chevron-down
  - Update aria-expanded attribute
  - Re-render icons after state change
  - Announce state change for accessibility

  CSS Classes Pattern:
  .[component-name] { }
  .[component-name]-header { }
  .[component-name]-title { }
  .[component-name]-toggle { }
  .[component-name]-content { }
  .[component-name]-label { }
  .[component-name].collapsed { }

  Implementation Notes:
  - Ensure z-index layering doesn't interfere with other components
  - Content should use overflow: hidden for clean collapse
  - Use transform-origin: top for natural slide animation
  - Position elements relative to their container, not absolute page coordinates
  - Maintain accessibility with proper ARIA attributes
  - Keep all component-specific logic isolated from other stacks

  Do NOT:
  - Reference specific component names or functionality
  - Use fixed positioning unless absolutely necessary
  - Create dependencies on other stack components
  - Hardcode specific measurements or positions
  - Mix component logic with other features

  This pattern ensures each collapsible stack remains independent, reusable, and
  maintainable across the entire sidebar interface.