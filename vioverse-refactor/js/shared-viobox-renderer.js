/**
 * Shared VIObox Renderer Module
 * Unified rendering logic for violation boxes across all views
 */

class SharedVioboxRenderer {
    constructor() {
        // VIObox configuration
        this.config = {
            severityIcons: {
                high: 'shield-x',
                medium: 'triangle-alert',
                low: 'circle-alert'
            },
            severityColors: {
                high: '#ff0000',
                medium: '#f26419',
                low: '#f2b919'
            }
        };
        
        // Selected violations (shared across views)
        this.selectedViolations = new Set();
        
        // Tooltip state
        this.tooltipsEnabled = false;
        
        this.init();
    }
    
    init() {
        // Listen for tooltip toggle
        document.addEventListener('tooltips-toggled', (e) => {
            this.tooltipsEnabled = e.detail.enabled;
            this.updateTooltips();
        });
        
        // Listen for violation selection events
        document.addEventListener('violation-selected', (e) => {
            this.handleViolationSelection(e.detail);
        });
    }
    
    /**
     * Create a VIObox element
     * @param {Object} violation - Violation data
     * @param {Object} options - Rendering options
     * @returns {HTMLElement} VIObox element
     */
    createVIObox(violation, options = {}) {
        const {
            interactive = true,
            showTooltip = true,
            containerClass = 'viobox-container'
        } = options;
        
        // Create button element
        const box = document.createElement('button');
        box.className = `viobox ${violation.severity}`;
        box.setAttribute('role', 'button');
        box.setAttribute('aria-label', this.getAriaLabel(violation));
        box.setAttribute('tabindex', interactive ? '0' : '-1');
        box.setAttribute('data-violation-id', violation.id);
        
        // Position and size
        this.applyDimensions(box, violation);
        
        // Active state
        if (this.selectedViolations.has(violation.id)) {
            box.classList.add('active');
            box.setAttribute('aria-pressed', 'true');
        }
        
        // Create severity icon
        const icon = this.createSeverityIcon(violation.severity);
        box.appendChild(icon);
        
        // Add tooltip if enabled
        if (showTooltip && this.tooltipsEnabled) {
            const tooltip = this.createTooltip(violation);
            box.appendChild(tooltip);
        }
        
        // Event handlers
        if (interactive) {
            this.attachEventHandlers(box, violation);
        }
        
        return box;
    }
    
    /**
     * Render violations to a container
     * @param {HTMLElement} container - Container element
     * @param {Array} violations - Array of violations
     * @param {Object} options - Rendering options
     */
    renderViolations(container, violations, options = {}) {
        // Clear existing content
        container.innerHTML = '';
        
        // Render each violation
        violations.forEach(violation => {
            const viobox = this.createVIObox(violation, options);
            container.appendChild(viobox);
        });
        
        // Re-render Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
        
        // Emit render complete event
        document.dispatchEvent(new CustomEvent('vioboxes-rendered', {
            detail: { count: violations.length, container },
            bubbles: true
        }));
    }
    
    /**
     * Apply dimensions to VIObox
     */
    applyDimensions(box, violation) {
        // Use canvas sync for consistent positioning
        const coords = window.canvasSync ? 
            window.canvasSync.viotaggerToReportViewer({
                x: violation.x,
                y: violation.y,
                width: violation.width || 80,
                height: violation.height || 50
            }) : {
                x: violation.x,
                y: violation.y,
                width: violation.width || 80,
                height: violation.height || 50
            };
        
        box.style.left = `${coords.x}px`;
        box.style.top = `${coords.y}px`;
        
        if (coords.width) {
            box.style.width = `${coords.width}px`;
        }
        if (coords.height) {
            box.style.height = `${coords.height}px`;
        }
    }
    
    /**
     * Create severity icon element
     */
    createSeverityIcon(severity) {
        const iconContainer = document.createElement('div');
        iconContainer.className = `severity-icon severity-${severity}`;
        
        const iconEl = document.createElement('i');
        iconEl.setAttribute('data-lucide', this.config.severityIcons[severity]);
        iconContainer.appendChild(iconEl);
        
        return iconContainer;
    }
    
    /**
     * Create tooltip element
     */
    createTooltip(violation) {
        const tooltip = document.createElement('span');
        tooltip.className = 'viobox-tooltip';
        tooltip.textContent = violation.description || violation.text || 'Violation';
        tooltip.setAttribute('role', 'tooltip');
        return tooltip;
    }
    
    /**
     * Get ARIA label for accessibility
     */
    getAriaLabel(violation) {
        const severityText = `${violation.severity} severity violation`;
        const descriptionText = violation.description ? `: ${violation.description}` : '';
        const selectionText = this.selectedViolations.has(violation.id) ? ' (selected)' : '';
        return `${severityText}${descriptionText}${selectionText}`;
    }
    
    /**
     * Attach event handlers to VIObox
     */
    attachEventHandlers(box, violation) {
        // Click handler
        box.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleViolation(violation, box);
        });
        
        // Keyboard handlers
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleViolation(violation, box);
            }
        });
        
        // Focus/blur for accessibility
        box.addEventListener('focus', () => {
            box.classList.add('focused');
        });
        
        box.addEventListener('blur', () => {
            box.classList.remove('focused');
        });
    }
    
    /**
     * Toggle violation selection
     */
    toggleViolation(violation, box) {
        const isSelected = this.selectedViolations.has(violation.id);
        
        if (isSelected) {
            this.selectedViolations.delete(violation.id);
            box.classList.remove('active');
            box.setAttribute('aria-pressed', 'false');
        } else {
            this.selectedViolations.add(violation.id);
            box.classList.add('active');
            box.setAttribute('aria-pressed', 'true');
        }
        
        // Update ARIA label
        box.setAttribute('aria-label', this.getAriaLabel(violation));
        
        // Emit selection event
        document.dispatchEvent(new CustomEvent('violation-toggled', {
            detail: {
                violation,
                selected: !isSelected,
                totalSelected: this.selectedViolations.size
            },
            bubbles: true
        }));
        
        // Announce to screen readers
        this.announceSelection(violation, !isSelected);
    }
    
    /**
     * Handle violation selection from other sources
     */
    handleViolationSelection(detail) {
        const { violationId, selected } = detail;
        
        if (selected) {
            this.selectedViolations.add(violationId);
        } else {
            this.selectedViolations.delete(violationId);
        }
        
        // Update VIObox appearance
        const box = document.querySelector(`[data-violation-id="${violationId}"]`);
        if (box) {
            box.classList.toggle('active', selected);
            box.setAttribute('aria-pressed', selected);
        }
    }
    
    /**
     * Update tooltips visibility
     */
    updateTooltips() {
        const tooltips = document.querySelectorAll('.viobox-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.display = this.tooltipsEnabled ? '' : 'none';
        });
    }
    
    /**
     * Announce selection to screen readers
     */
    announceSelection(violation, selected) {
        const message = selected ? 
            `Selected ${violation.severity} severity violation` :
            `Deselected ${violation.severity} severity violation`;
        
        // Use shared announcement system
        if (window.vioverse?.announce) {
            window.vioverse.announce(message);
        }
    }
    
    /**
     * Get selected violations
     */
    getSelectedViolations() {
        return Array.from(this.selectedViolations);
    }
    
    /**
     * Clear all selections
     */
    clearSelections() {
        this.selectedViolations.clear();
        
        // Update all VIOboxes
        document.querySelectorAll('.viobox.active').forEach(box => {
            box.classList.remove('active');
            box.setAttribute('aria-pressed', 'false');
        });
        
        // Emit event
        document.dispatchEvent(new CustomEvent('violations-cleared', {
            bubbles: true
        }));
    }
    
    /**
     * Select all violations in container
     */
    selectAll(container) {
        const boxes = container.querySelectorAll('.viobox');
        boxes.forEach(box => {
            const violationId = box.getAttribute('data-violation-id');
            if (violationId) {
                this.selectedViolations.add(violationId);
                box.classList.add('active');
                box.setAttribute('aria-pressed', 'true');
            }
        });
        
        // Emit event
        document.dispatchEvent(new CustomEvent('violations-select-all', {
            detail: { count: boxes.length },
            bubbles: true
        }));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sharedVioboxRenderer = new SharedVioboxRenderer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedVioboxRenderer;
}