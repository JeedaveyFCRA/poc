/**
 * Shared Navigation Module
 * Synchronizes navigation state between Report and VioTagger views
 * Ensures pixel-perfect alignment by sharing the same state
 */

class SharedNavigation {
    constructor() {
        this.elements = {
            report: {
                bureauLogo: document.getElementById('bureau-logo'),
                reportDate: document.getElementById('report-date'),
                creditorName: document.getElementById('creditor-name'),
                pageNumber: document.getElementById('page-number')
            },
            tagger: {
                bureauLogo: document.getElementById('tagger-bureau-logo'),
                reportDate: document.getElementById('tagger-report-date'),
                creditorName: document.getElementById('tagger-creditor-name'),
                pageNumber: document.getElementById('tagger-page-number')
            }
        };
        
        this.init();
    }
    
    init() {
        // Listen for navigation changes and sync between views
        document.addEventListener('navigation-changed', (e) => {
            this.syncNavigation(e.detail);
        });
    }
    
    /**
     * Synchronize navigation state between all views
     * @param {Object} state - Navigation state object
     */
    syncNavigation(state) {
        // Update bureau logos
        if (state.bureau) {
            this.updateAllElements('bureauLogo', (el) => {
                if (el && el.tagName === 'IMG') {
                    el.src = `assets/bureaus/${state.bureau}_White_Logo.png`;
                    el.alt = state.bureauName || state.bureau;
                }
            });
        }
        
        // Update report dates
        if (state.reportDate) {
            this.updateAllElements('reportDate', (el) => {
                if (el) el.textContent = state.reportDate;
            });
        }
        
        // Update creditor names
        if (state.creditorName) {
            this.updateAllElements('creditorName', (el) => {
                if (el) el.textContent = state.creditorName;
            });
        }
        
        // Update page numbers
        if (state.pageNumber) {
            this.updateAllElements('pageNumber', (el) => {
                if (el) el.textContent = state.pageNumber;
            });
        }
        
        // Also update the tagger view's report image if needed
        if (state.reportImage) {
            const taggerImage = document.querySelector('#tagger-canvas-div .report-image');
            if (taggerImage) {
                taggerImage.src = state.reportImage;
                taggerImage.alt = `${state.creditorName} ${state.bureauName} credit report page ${state.pageNumber}`;
            }
        }
    }
    
    /**
     * Update all instances of an element across views
     * @param {string} elementKey - Key in elements object
     * @param {Function} updateFn - Function to update the element
     */
    updateAllElements(elementKey, updateFn) {
        Object.values(this.elements).forEach(viewElements => {
            const element = viewElements[elementKey];
            if (element) {
                updateFn(element);
            }
        });
    }
    
    /**
     * Get current navigation state from active view
     * @returns {Object} Current navigation state
     */
    getCurrentState() {
        const activeView = document.querySelector('.vioverse-app').dataset.view || 'report';
        const elements = this.elements[activeView] || this.elements.report;
        
        return {
            bureau: elements.bureauLogo?.src?.match(/\/([A-Z]{2})_White_Logo/)?.[1] || 'EQ',
            reportDate: elements.reportDate?.textContent || '04-25-2024',
            creditorName: elements.creditorName?.textContent || 'ally financial',
            pageNumber: elements.pageNumber?.textContent || '57'
        };
    }
    
    /**
     * Emit navigation change event
     * @param {Object} state - New navigation state
     */
    emitNavigationChange(state) {
        document.dispatchEvent(new CustomEvent('navigation-changed', {
            detail: state,
            bubbles: true
        }));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sharedNavigation = new SharedNavigation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedNavigation;
}