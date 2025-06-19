/**
 * Enhanced Shared Navigation Module
 * Manages all navigation bars across views with unified logic
 */

class SharedNavigationEnhanced {
    constructor() {
        // Navigation configurations for each view
        this.configs = {
            report: {
                segments: ['bureau', 'date', 'creditor', 'page'],
                navClass: 'report-nav-bar'
            },
            tagger: {
                segments: ['bureau', 'date', 'creditor', 'page'],
                navClass: 'report-nav-bar' // Same as report
            },
            evidence: {
                segments: ['category', 'document', 'page'],
                navClass: 'evidence-nav-bar'
            }
        };
        
        // Shared state
        this.state = {
            bureau: 'EQ',
            date: '2024-04-25',
            creditor: 'AL',
            page: 57,
            category: 'additional evidence',
            document: 'credit denial',
            evidencePage: 1
        };
        
        // Navigation data
        this.data = null;
        
        this.init();
    }
    
    async init() {
        // Load navigation data
        await this.loadNavigationData();
        
        // Setup all navigation bars
        this.setupNavigationBars();
        
        // Listen for view changes
        document.addEventListener('view-changed', (e) => {
            this.handleViewChange(e.detail.view);
        });
        
        // Listen for navigation updates
        document.addEventListener('navigate', (e) => {
            this.handleNavigation(e.detail);
        });
    }
    
    /**
     * Setup all navigation bars with shared event handlers
     */
    setupNavigationBars() {
        // Find all navigation bars
        const navBars = document.querySelectorAll('.report-nav-bar, .evidence-nav-bar');
        
        navBars.forEach(navBar => {
            // Get view context
            const viewPanel = navBar.closest('.view-panel');
            const view = viewPanel?.id.replace('-view', '') || 'report';
            
            // Setup arrow buttons
            navBar.querySelectorAll('[data-nav]').forEach(button => {
                button.addEventListener('click', (e) => {
                    const action = e.currentTarget.dataset.nav;
                    this.handleArrowClick(action, view);
                });
                
                // Add hover tooltips
                button.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e.currentTarget, action);
                });
            });
        });
    }
    
    /**
     * Handle arrow button clicks
     */
    handleArrowClick(action, view) {
        const [segment, direction] = action.split('-');
        const delta = direction === 'up' ? -1 : 1;
        
        switch (segment) {
            case 'bureau':
                this.navigateBureau(delta);
                break;
            case 'date':
                this.navigateDate(delta);
                break;
            case 'creditor':
                this.navigateCreditor(delta);
                break;
            case 'page':
                this.navigatePage(delta, view);
                break;
            case 'category':
                this.navigateCategory(delta);
                break;
            case 'document':
                this.navigateDocument(delta);
                break;
        }
    }
    
    /**
     * Bureau navigation with auto-advance to date
     */
    navigateBureau(delta) {
        const bureaus = ['EQ', 'EX', 'TU'];
        const currentIndex = bureaus.indexOf(this.state.bureau);
        let newIndex = currentIndex + delta;
        
        if (newIndex < 0) {
            // Go to previous date, last bureau
            this.navigateDate(-1);
            this.state.bureau = bureaus[bureaus.length - 1];
            this.emitChange({ bureau: this.state.bureau, autoAdvanced: 'date' });
        } else if (newIndex >= bureaus.length) {
            // Go to next date, first bureau
            this.navigateDate(1);
            this.state.bureau = bureaus[0];
            this.emitChange({ bureau: this.state.bureau, autoAdvanced: 'date' });
        } else {
            this.state.bureau = bureaus[newIndex];
            this.emitChange({ bureau: this.state.bureau });
        }
        
        this.updateAllViews();
    }
    
    /**
     * Update all navigation bars across views
     */
    updateAllViews() {
        // Update report view
        this.updateViewElements('report');
        
        // Update tagger view
        this.updateViewElements('tagger');
        
        // Update evidence view
        this.updateViewElements('evidence');
        
        // Sync report images
        this.updateReportImages();
    }
    
    /**
     * Update elements for a specific view
     */
    updateViewElements(view) {
        const prefix = view === 'tagger' ? 'tagger-' : '';
        
        // Bureau logo
        const bureauLogo = document.getElementById(`${prefix}bureau-logo`);
        if (bureauLogo) {
            const logoMap = {
                'EQ': 'EQ_White_Logo.png',
                'EX': 'EX_White_Logo.svg',
                'TU': 'TU_White_Logo.svg'
            };
            bureauLogo.src = `assets/bureaus/${logoMap[this.state.bureau]}`;
            bureauLogo.alt = this.getBureauName(this.state.bureau);
        }
        
        // Date
        const dateEl = document.getElementById(`${prefix}report-date`);
        if (dateEl) {
            const [year, month, day] = this.state.date.split('-');
            dateEl.textContent = `${month}-${day}-${year}`;
        }
        
        // Creditor
        const creditorEl = document.getElementById(`${prefix}creditor-name`);
        if (creditorEl) {
            creditorEl.textContent = this.getCreditorName(this.state.creditor).toLowerCase();
        }
        
        // Page
        const pageEl = document.getElementById(`${prefix}page-number`);
        if (pageEl) {
            pageEl.textContent = this.state.page;
        }
        
        // Evidence-specific updates
        if (view === 'evidence') {
            const categoryEl = document.getElementById('evidence-category');
            if (categoryEl) categoryEl.textContent = this.state.category;
            
            const documentEl = document.getElementById('document-name');
            if (documentEl) documentEl.textContent = this.state.document;
            
            const evidencePageEl = document.getElementById('evidence-page-number');
            if (evidencePageEl) evidencePageEl.textContent = this.state.evidencePage;
        }
    }
    
    /**
     * Update report images across views
     */
    updateReportImages() {
        const filename = this.getReportFilename();
        
        // Update report view image
        const reportImage = document.querySelector('#report-view .report-image');
        if (reportImage) {
            reportImage.src = `assets/reports/${filename}`;
            reportImage.alt = this.getImageAltText();
        }
        
        // Update tagger view image
        const taggerImage = document.querySelector('#tagger-view .report-image');
        if (taggerImage) {
            taggerImage.src = `assets/reports/${filename}`;
            taggerImage.alt = this.getImageAltText();
        }
    }
    
    /**
     * Get report filename based on current state
     */
    getReportFilename() {
        const paddedPage = this.state.page < 10 ? 
            String(this.state.page).padStart(2, '0') : 
            String(this.state.page);
        return `${this.state.creditor}-${this.state.bureau}-${this.state.date}-P${paddedPage}.png`;
    }
    
    /**
     * Get image alt text
     */
    getImageAltText() {
        const creditorName = this.getCreditorName(this.state.creditor);
        const bureauName = this.getBureauName(this.state.bureau);
        return `${creditorName} ${bureauName} credit report from ${this.state.date}, page ${this.state.page}`;
    }
    
    /**
     * Helper methods for names
     */
    getBureauName(code) {
        const bureauMap = {
            'EQ': 'Equifax',
            'EX': 'Experian',
            'TU': 'TransUnion'
        };
        return bureauMap[code] || code;
    }
    
    getCreditorName(code) {
        if (this.data?.creditors) {
            return this.data.creditors[code] || code;
        }
        
        // Fallback mapping
        const creditorMap = {
            'AL': 'Ally Financial',
            'BB': 'Citibank / Best Buy',
            'BK': 'Bank of America',
            'BY': 'Barclays Bank Delaware',
            'C1': 'Citizens Bank (Account 1)',
            'C2': 'Citizens Bank (Account 2)',
            'CR': 'Cornerstone Community FCU',
            'DB': 'Discover Bank',
            'DL': 'Discover Personal Loans',
            'HD': 'THD / Citibank (Home Depot)',
            'JP': 'JPMCB Card Services (Chase)',
            'MF': 'Mariner Finance',
            'SR': 'Citibank / Sears'
        };
        return creditorMap[code] || code;
    }
    
    /**
     * Load navigation data
     */
    async loadNavigationData() {
        try {
            const response = await fetch('data/navigation-map.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load navigation data:', error);
        }
    }
    
    /**
     * Emit navigation change event
     */
    emitChange(changes) {
        document.dispatchEvent(new CustomEvent('navigation-changed', {
            detail: { ...this.state, ...changes },
            bubbles: true
        }));
    }
    
    /**
     * Handle navigation requests from other modules
     */
    handleNavigation(request) {
        if (request.bureau !== undefined) this.state.bureau = request.bureau;
        if (request.date !== undefined) this.state.date = request.date;
        if (request.creditor !== undefined) this.state.creditor = request.creditor;
        if (request.page !== undefined) this.state.page = request.page;
        if (request.category !== undefined) this.state.category = request.category;
        if (request.document !== undefined) this.state.document = request.document;
        if (request.evidencePage !== undefined) this.state.evidencePage = request.evidencePage;
        
        this.updateAllViews();
        this.emitChange(request);
    }
    
    /**
     * Additional navigation methods
     */
    navigateDate(delta) {
        // Implementation depends on available dates in navigation data
        // For now, just emit the change
        this.emitChange({ dateNavigation: delta });
    }
    
    navigateCreditor(delta) {
        const creditors = Object.keys(this.data?.creditors || {});
        const currentIndex = creditors.indexOf(this.state.creditor);
        const newIndex = (currentIndex + delta + creditors.length) % creditors.length;
        this.state.creditor = creditors[newIndex];
        this.emitChange({ creditor: this.state.creditor });
        this.updateAllViews();
    }
    
    navigatePage(delta, view) {
        if (view === 'evidence') {
            this.state.evidencePage = Math.max(1, this.state.evidencePage + delta);
            this.emitChange({ evidencePage: this.state.evidencePage });
        } else {
            this.state.page = Math.max(1, this.state.page + delta);
            this.emitChange({ page: this.state.page });
        }
        this.updateAllViews();
    }
    
    navigateCategory(delta) {
        // Implementation for evidence categories
        this.emitChange({ categoryNavigation: delta });
    }
    
    navigateDocument(delta) {
        // Implementation for evidence documents
        this.emitChange({ documentNavigation: delta });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sharedNavigationEnhanced = new SharedNavigationEnhanced();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedNavigationEnhanced;
}