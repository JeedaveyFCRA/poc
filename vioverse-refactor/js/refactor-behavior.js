// VioVerse Refactor JS – initialize component behavior here

/**
 * VioVerse Main Application
 * Modular JavaScript for FCRA violation analysis platform
 */

class VioVerse {
    constructor() {
        this.currentView = 'report';
        this.currentPage = 57;
        this.totalPages = 999;
        this.tipsEnabled = false;
        this.docketExpanded = true;
        this.selectedViolations = new Set();
        this.currentCreditor = 'AL';
        this.currentBureau = 'EQ';  // Default bureau
        this.reportDate = '2024-04-25';  // Default date
        
        // Initialize canvas sync for coordinate conversion
        this.canvasSync = new CanvasSync();
        
        // Initialize VioTagger
        this.viotagger = new VioTagger(this);
        
        // Navigation data will be loaded from JSON
        this.navigationData = null;
        
        // Creditor mapping
        this.creditors = [
            { code: 'AL', name: 'Ally Financial' },
            { code: 'BB', name: 'Citibank / Best Buy' },
            { code: 'BK', name: 'Bank of America' },
            { code: 'BY', name: 'Barclays Bank Delaware' },
            { code: 'C1', name: 'Citizens Bank (Account 1)' },
            { code: 'C2', name: 'Citizens Bank (Account 2)' },
            { code: 'CR', name: 'Cornerstone Community FCU' },
            { code: 'DB', name: 'Discover Bank' },
            { code: 'DL', name: 'Discover Personal Loans' },
            { code: 'HD', name: 'THD / Citibank (Home Depot)' },
            { code: 'JP', name: 'JPMCB Card Services (Chase)' },
            { code: 'MF', name: 'Mariner Finance' },
            { code: 'SR', name: 'Citibank / Sears' }
        ];
        this.currentCreditorIndex = 0;  // Start with Ally
        
        // Violations will be loaded from CSV or localStorage
        this.violations = [];
        this.violationsData = null;
        
        this.init();
    }
    
    async init() {
        // Load navigation data first
        await this.loadNavigationData();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        // Legacy event listeners removed — see legacy-removal.html
        
        // Initialize search functionality
        this.initSearchBox();
        
        // Initialize mobile sidebar functionality
        this.initMobileSidebar();
        
        // New view toggle functionality
        const viewLabels = document.querySelectorAll('.view-label');
        viewLabels.forEach(label => {
            label.addEventListener('click', (e) => this.switchView(e.currentTarget.dataset.view));
        });
        
        // Docket toggle functionality
        const docketToggle = document.querySelector('.docket-toggle');
        const arrowCollapsed = document.querySelector('.arrow-collapsed');
        if (docketToggle) {
            docketToggle.addEventListener('click', () => this.toggleDocket());
        }
        if (arrowCollapsed) {
            arrowCollapsed.addEventListener('click', () => this.toggleDocket());
        }
        
        // Tool Tips toggle
        const toolTipsToggle = document.querySelector('.tool-tips-toggle');
        if (toolTipsToggle) {
            toolTipsToggle.addEventListener('click', () => this.toggleToolTips());
        }
        
        // Filter Counter toggle
        const filterToggleExpanded = document.querySelector('.filter-counter-toggle-expanded');
        const filterToggleCollapsed = document.querySelector('.filter-counter-toggle-collapsed');
        if (filterToggleExpanded) {
            filterToggleExpanded.addEventListener('click', () => this.toggleFilterCounter());
        }
        if (filterToggleCollapsed) {
            filterToggleCollapsed.addEventListener('click', () => this.toggleFilterCounter());
        }
        
        // Section label click functionality
        const sectionLabels = document.querySelectorAll('.section-label');
        sectionLabels.forEach(label => {
            label.addEventListener('click', () => {
                const section = label.dataset.section;
                if (section === 'filter') this.toggleFilterCounter();
                else if (section === 'severity') this.toggleSeveritySummary();
                else if (section === 'violations') this.toggleViolationDetails();
            });
        });
        
        // Page navigation
        const prevBtn = document.querySelector('.nav-arrow.prev');
        const nextBtn = document.querySelector('.nav-arrow.next');
        const pageInput = document.querySelector('.page-input');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigatePage(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigatePage(1));
        if (pageInput) {
            pageInput.addEventListener('change', (e) => this.goToPage(parseInt(e.target.value)));
            pageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.target.blur();
                }
            });
        }
        
        // Bureau pills
        const bureauPills = document.querySelectorAll('.bureau-pill');
        bureauPills.forEach(pill => {
            pill.addEventListener('click', (e) => this.selectBureau(e.currentTarget));
        });
        
        // Creditor navigation
        const prevCreditor = document.querySelector('.creditor-arrow.prev');
        const nextCreditor = document.querySelector('.creditor-arrow.next');
        if (prevCreditor) prevCreditor.addEventListener('click', () => this.navigateCreditor(-1));
        if (nextCreditor) nextCreditor.addEventListener('click', () => this.navigateCreditor(1));
        
        // Report navigation bar handlers
        this.setupReportNavigation();
        
        // Initialize based on current image
        this.initializeFromImage();
        
        // Update section labels bar to show correct initial state
        this.updateSectionLabelsBar();
        
        // Load violations data
        this.loadViolations().then(() => {
            // Pre-select all violations on initial load
            this.preselectAllViolations();
            
            // Initialize VIOboxes
            this.renderViolations();
            
            // Initialize counter and sidebar
            this.updateViolationCounter();
            this.updateViolationSidebar();
            
            // Initialize custom scrollbar after a brief delay to ensure DOM is ready
            setTimeout(() => {
                this.updateCustomScrollbar();
            }, 100);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Violation filter handlers
        const filterRadios = document.querySelectorAll('input[name="violation-filter"]');
        filterRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleFilterChange(e.target.value);
                this.updateViolationSidebar();
            });
        });
        
        // Filter Counter toggle functionality - REMOVED DUPLICATE
        // This is already handled in setupEventListeners()
        
        // Severity Boxes toggle functionality (old)
        const severityToggle = document.querySelector('.severity-boxes-toggle');
        if (severityToggle) {
            severityToggle.addEventListener('click', () => this.toggleSeverityBoxes());
        }
        
        // Severity Summary toggle functionality
        const severitySummaryToggleExpanded = document.querySelector('.severity-summary-toggle-expanded');
        const severitySummaryToggleCollapsed = document.querySelector('.severity-summary-toggle-collapsed');
        if (severitySummaryToggleExpanded) {
            severitySummaryToggleExpanded.addEventListener('click', () => this.toggleSeveritySummary());
        }
        if (severitySummaryToggleCollapsed) {
            severitySummaryToggleCollapsed.addEventListener('click', () => this.toggleSeveritySummary());
        }
        
        // Violation Details toggle functionality
        const violationDetailsToggleExpanded = document.querySelector('.violation-details-toggle-expanded');
        const violationDetailsToggleCollapsed = document.querySelector('.violation-details-toggle-collapsed');
        if (violationDetailsToggleExpanded) {
            violationDetailsToggleExpanded.addEventListener('click', () => this.toggleViolationDetails());
        }
        if (violationDetailsToggleCollapsed) {
            violationDetailsToggleCollapsed.addEventListener('click', () => this.toggleViolationDetails());
        }
        
        // Initialize Lucide icons
        lucide.createIcons();
        
        // Initialize custom scroll for violation details
        this.initCustomScrollVioDetails();
        
        // Initialize view full violation log button
        this.initViewFullViolationLogButton();
    }
    
    initCustomScrollVioDetails() {
        const violationList = document.querySelector('.violation-details-list');
        const customScroll = document.getElementById('customScrollVioDetails');
        const scrollThumb = document.querySelector('.scroll-thumb');
        const scrollTrack = document.querySelector('.scroll-track');
        const scrollUp = document.querySelector('.scroll-arrow.scroll-up');
        const scrollDown = document.querySelector('.scroll-arrow.scroll-down');
        
        if (!violationList || !customScroll) return;
        
        // Observer to watch for violation count changes
        const observer = new MutationObserver(() => {
            const violationCount = violationList.children.length;
            
            if (violationCount > 4) {
                // Show custom scroll
                customScroll.style.display = 'block';
                violationList.classList.add('custom-scroll-active');
                violationList.style.overflowY = 'scroll';
                violationList.style.scrollbarWidth = 'none'; // Firefox
                violationList.style.msOverflowStyle = 'none'; // IE/Edge
                
                // Hide webkit scrollbar
                const style = document.createElement('style');
                style.textContent = `.violation-details-list.custom-scroll-active::-webkit-scrollbar { display: none; }`;
                document.head.appendChild(style);
                
                // Calculate thumb height
                const visibleHeight = 272; // Fixed viewport height
                const scrollHeight = violationList.scrollHeight;
                const trackHeight = 652; // Total track height
                const maxThumbHeight = 620; // Maximum thumb height
                const thumbHeight = Math.min(maxThumbHeight, Math.max(30, (visibleHeight / scrollHeight) * trackHeight));
                scrollThumb.style.height = thumbHeight + 'px';
                
                // Update thumb position on scroll
                violationList.addEventListener('scroll', () => {
                    const scrollPercent = violationList.scrollTop / (scrollHeight - visibleHeight);
                    // Ensure 3px clearance from arrows
                    // Up arrow bottom at 195px (185+10), so thumb min top = 198px - 185px (track start) = 13px
                    // Down arrow top at 827px, so thumb max bottom = 824px - 185px (track start) = 639px
                    const minThumbTop = 13; // 3px clearance from up arrow
                    const maxThumbBottom = 639; // 3px clearance from down arrow
                    const maxThumbTop = maxThumbBottom - thumbHeight;
                    const availableScrollRange = maxThumbTop - minThumbTop;
                    scrollThumb.style.top = (minThumbTop + (scrollPercent * availableScrollRange)) + 'px';
                });
                
                // Scroll button handlers
                scrollUp.addEventListener('click', () => {
                    violationList.scrollBy({ top: -60, behavior: 'smooth' });
                });
                
                scrollDown.addEventListener('click', () => {
                    violationList.scrollBy({ top: 60, behavior: 'smooth' });
                });
                
                // Drag thumb functionality
                let isDragging = false;
                let startY = 0;
                let startTop = 0;
                
                scrollThumb.addEventListener('mousedown', (e) => {
                    e.preventDefault(); // Prevent default selection
                    isDragging = true;
                    startY = e.clientY;
                    startTop = parseInt(scrollThumb.style.top || 13);
                    document.body.style.cursor = 'grabbing';
                    document.body.classList.add('dragging-scroll'); // Prevent text selection
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault(); // Prevent selection during drag
                    
                    const deltaY = e.clientY - startY;
                    // Ensure 3px clearance from arrows
                    const minThumbTop = 13; // 3px clearance from up arrow
                    const maxThumbBottom = 639; // 3px clearance from down arrow
                    const maxThumbTop = maxThumbBottom - thumbHeight;
                    
                    const newTop = Math.max(minThumbTop, Math.min(maxThumbTop, startTop + deltaY));
                    scrollThumb.style.top = newTop + 'px';
                    
                    // Update scroll position
                    const availableScrollRange = maxThumbTop - minThumbTop;
                    const scrollPercent = (newTop - minThumbTop) / availableScrollRange;
                    violationList.scrollTop = scrollPercent * (scrollHeight - visibleHeight);
                });
                
                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        document.body.style.cursor = '';
                        document.body.classList.remove('dragging-scroll'); // Re-enable text selection
                    }
                });
                
                // Click-to-jump scroll functionality for track
                scrollTrack.addEventListener('click', (e) => {
                    // Don't handle if clicking on thumb
                    if (e.target === scrollThumb) return;
                    
                    // Get click position relative to track
                    const trackRect = scrollTrack.getBoundingClientRect();
                    const clickY = e.clientY - trackRect.top;
                    
                    // Calculate thumb constraints
                    const minThumbTop = 13; // 3px clearance from up arrow
                    const maxThumbBottom = 639; // 3px clearance from down arrow
                    const maxThumbTop = maxThumbBottom - thumbHeight;
                    
                    // Calculate where to position thumb (center it on click point)
                    const targetThumbCenter = clickY;
                    let targetThumbTop = targetThumbCenter - (thumbHeight / 2);
                    
                    // Constrain to valid range
                    targetThumbTop = Math.max(minThumbTop, Math.min(maxThumbTop, targetThumbTop));
                    
                    // Update thumb position
                    scrollThumb.style.top = targetThumbTop + 'px';
                    
                    // Calculate and update scroll position
                    const availableScrollRange = maxThumbTop - minThumbTop;
                    const scrollPercent = (targetThumbTop - minThumbTop) / availableScrollRange;
                    violationList.scrollTop = scrollPercent * (scrollHeight - visibleHeight);
                });
                
                // Ensure wheel scrolling works on the violation list
                violationList.addEventListener('wheel', (e) => {
                    // Allow default wheel behavior which scrolls the list
                    // Update thumb position based on scroll
                    const scrollPercent = violationList.scrollTop / (scrollHeight - visibleHeight);
                    const minThumbTop = 13;
                    const maxThumbBottom = 639;
                    const maxThumbTop = maxThumbBottom - thumbHeight;
                    const availableScrollRange = maxThumbTop - minThumbTop;
                    scrollThumb.style.top = (minThumbTop + (scrollPercent * availableScrollRange)) + 'px';
                }, { passive: true });
                
                // Re-render Lucide icons for scroll arrows
                lucide.createIcons();
            } else {
                // Hide custom scroll
                customScroll.style.display = 'none';
                violationList.classList.remove('custom-scroll-active');
                violationList.style.overflowY = '';
            }
        });
        
        // Start observing
        observer.observe(violationList, { childList: true });
    }
    
    initViewFullViolationLogButton() {
        const fullLogTitle = document.querySelector('.full-log-title');
        const fullLogArrow = document.querySelector('.full-log-arrow');
        
        if (!fullLogTitle && !fullLogArrow) return;
        
        const handleClick = (e) => {
            e.preventDefault();
            
            // Placeholder for future functionality
            // Options:
            // 1. Open modal: this.openViolationLogModal();
            // 2. Navigate to page: window.location.href = '/full-log';
            // 3. Expand drawer: this.toggleViolationLogDrawer();
            // 4. Export data: this.exportViolationLog();
            
            // For now, log the action
            console.log('View Full Violation Log clicked');
            this.announce('Opening full violation log');
            
            // Example modal implementation (commented out)
            // const modal = document.createElement('div');
            // modal.className = 'violation-log-modal';
            // modal.innerHTML = `
            //     <div class="modal-content">
            //         <h2>Full Violation Log</h2>
            //         <p>Complete violation history will be displayed here</p>
            //         <button class="modal-close">Close</button>
            //     </div>
            // `;
            // document.body.appendChild(modal);
        };
        
        // Add click handlers to both title and arrow
        if (fullLogTitle) {
            fullLogTitle.addEventListener('click', handleClick);
        }
        if (fullLogArrow) {
            fullLogArrow.addEventListener('click', handleClick);
        }
    }
    
    switchView(viewName) {
        if (viewName === this.currentView) return;
        
        // Map 'tagger' to 'viotagger' for indicator positioning
        const indicatorClass = viewName === 'tagger' ? 'tagger' : viewName;
        
        // Update view state
        this.currentView = viewName;
        document.querySelector('.vioverse-app').dataset.view = viewName;
        
        // Legacy button state updates removed — see legacy-removal.html
        
        // Update new toggle
        const indicator = document.getElementById('toggle-indicator');
        if (indicator) {
            indicator.className = 'toggle-indicator ' + indicatorClass;
        }
        
        // Show/hide tagger navigation in sidebar
        const taggerNavSidebar = document.getElementById('tagger-nav-sidebar');
        if (taggerNavSidebar) {
            taggerNavSidebar.style.display = viewName === 'tagger' ? 'block' : 'none';
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
        
        // Initialize VioTagger when switching to tagger view
        if (viewName === 'tagger') {
            this.viotagger.init();
            this.viotagger.updateTaggerPage();
        }
        
        // Announce view change to screen readers
        this.announce(`Switched to ${viewName} view`);
    }
    
    toggleDocket() {
        this.docketExpanded = !this.docketExpanded;
        const header = document.querySelector('.docket-header');
        const arrowCollapsed = document.querySelector('.arrow-collapsed');
        const upToggle = document.querySelector('.docket-toggle');
        
        if (header && arrowCollapsed) {
            if (this.docketExpanded) {
                // Expand
                header.classList.remove('collapsed');
                arrowCollapsed.classList.remove('visible');
                upToggle.setAttribute('aria-expanded', 'true');
            } else {
                // Collapse
                header.classList.add('collapsed');
                arrowCollapsed.classList.add('visible');
                upToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Update icons using Lucide
            lucide.createIcons();
        }
    }
    
    toggleToolTips() {
        this.tipsEnabled = !this.tipsEnabled;
        const toggle = document.querySelector('.tool-tips-toggle');
        
        if (toggle) {
            toggle.setAttribute('aria-checked', this.tipsEnabled);
            document.body.classList.toggle('tooltip-mode', this.tipsEnabled);
        }
        
        this.announce(`Tooltips ${this.tipsEnabled ? 'enabled' : 'disabled'}`);
    }
    
    /* DUPLICATE REMOVED - see line 1040 for the correct implementation
    toggleFilterCounter() {
        const filterCounter = document.querySelector('.filter-counter');
        const toggleBtnExpanded = document.querySelector('.filter-counter-toggle-expanded');
        const toggleBtnCollapsed = document.querySelector('.filter-counter-toggle-collapsed');
        
        if (!filterCounter) return;
        
        // Toggle the collapsed state
        const isCollapsed = filterCounter.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expand
            filterCounter.classList.remove('collapsed');
            if (toggleBtnExpanded) toggleBtnExpanded.setAttribute('aria-expanded', 'true');
            if (toggleBtnCollapsed) toggleBtnCollapsed.setAttribute('aria-expanded', 'true');
        } else {
            // Collapse
            filterCounter.classList.add('collapsed');
            if (toggleBtnExpanded) toggleBtnExpanded.setAttribute('aria-expanded', 'false');
            if (toggleBtnCollapsed) toggleBtnCollapsed.setAttribute('aria-expanded', 'false');
        }
        
        // CSS handles the button visibility, no need to switch icons
        
        this.announce(`Filter panel ${isCollapsed ? 'expanded' : 'collapsed'}`);
    } */
    
    toggleSeverityBoxes() {
        const severityBoxes = document.querySelector('.severity-boxes-component');
        const toggleBtn = document.querySelector('.severity-boxes-toggle');
        const icon = toggleBtn?.querySelector('i');
        
        if (!severityBoxes || !toggleBtn || !icon) return;
        
        // Toggle the collapsed state
        const isCollapsed = severityBoxes.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expand
            severityBoxes.classList.remove('collapsed');
            toggleBtn.setAttribute('aria-expanded', 'true');
            icon.setAttribute('data-lucide', 'chevron-up');
        } else {
            // Collapse
            severityBoxes.classList.add('collapsed');
            toggleBtn.setAttribute('aria-expanded', 'false');
            icon.setAttribute('data-lucide', 'chevron-down');
        }
        
        // Re-render the Lucide icon
        lucide.createIcons();
        
        this.announce(`Severity boxes ${isCollapsed ? 'expanded' : 'collapsed'}`);
    }
    
    // Old toggleViolationDetails method - replaced with two-button approach in initialization
    // Kept for reference but no longer used
    /*
    toggleViolationDetails() {
        const violationDetails = document.querySelector('.violation-details-component');
        const toggleBtn = document.querySelector('.violation-details-toggle');
        const icon = toggleBtn?.querySelector('i');
        
        if (!violationDetails || !toggleBtn || !icon) return;
        
        // Toggle the collapsed state
        const isCollapsed = violationDetails.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expand
            violationDetails.classList.remove('collapsed');
            toggleBtn.setAttribute('aria-expanded', 'true');
            icon.setAttribute('data-lucide', 'chevron-up');
        } else {
            // Collapse
            violationDetails.classList.add('collapsed');
            toggleBtn.setAttribute('aria-expanded', 'false');
            icon.setAttribute('data-lucide', 'chevron-down');
        }
        
        // Re-render the Lucide icon
        lucide.createIcons();
        
        this.announce(`Violation details ${isCollapsed ? 'expanded' : 'collapsed'}`);
    }
    */
    
    navigatePage(direction) {
        const newPage = this.currentPage + direction;
        if (newPage >= 1 && newPage <= this.totalPages) {
            this.goToPage(newPage);
        }
    }
    
    goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.totalPages || isNaN(pageNum)) {
            return;
        }
        
        this.currentPage = pageNum;
        const pageInput = document.querySelector('.page-input');
        if (pageInput) {
            pageInput.value = pageNum;
        }
        
        // Update the report image source
        this.updateReportImage();
        
        // Don't clear selections when changing pages - preserve them across pages
        // This allows counting violations across multiple pages of the same report
        
        this.announce(`Page ${pageNum} of ${this.totalPages}`);
        
        // Update violation counter
        this.updateViolationCounter();
    }
    
    selectBureau(pill) {
        // Remove active state from all pills
        document.querySelectorAll('.bureau-pill').forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-pressed', 'false');
        });
        
        // Add active state to clicked pill
        pill.classList.add('active');
        pill.setAttribute('aria-pressed', 'true');
        
        // Update current bureau
        this.currentBureau = pill.dataset.bureau;
        
        // Update image source
        this.updateReportImage();
        
        this.announce(`Selected ${pill.textContent} bureau`);
    }
    
    navigateCreditor(direction) {
        // Calculate new index
        this.currentCreditorIndex += direction;
        
        // Wrap around
        if (this.currentCreditorIndex < 0) {
            this.currentCreditorIndex = this.creditors.length - 1;
        } else if (this.currentCreditorIndex >= this.creditors.length) {
            this.currentCreditorIndex = 0;
        }
        
        // Update current creditor
        const creditor = this.creditors[this.currentCreditorIndex];
        this.currentCreditor = creditor.code;
        
        // Update display
        const nameDisplay = document.querySelector('.creditor-name');
        if (nameDisplay) {
            nameDisplay.textContent = creditor.name;
        }
        
        // Update image source
        this.updateReportImage();
        
        this.announce(`Selected ${creditor.name}`);
    }
    
    updateReportImage() {
        const reportImage = document.querySelector('.report-image');
        if (reportImage) {
            // VioVerse filename format: {CREDITOR}-{BUREAU}-{YYYY}-{MM}-{DD}-P{PAGE}.png
            // Example: AL-EQ-2024-04-25-P57.png
            // Note: Only pad single-digit page numbers
            const paddedPage = this.currentPage < 10 ? String(this.currentPage).padStart(2, '0') : String(this.currentPage);
            const filename = `assets/reports/${this.currentCreditor}-${this.currentBureau}-${this.reportDate}-P${paddedPage}.png`;
            reportImage.src = filename;
            
            // Get creditor name for alt text
            const creditorName = this.navigationData ? this.navigationData.creditors[this.currentCreditor] : this.currentCreditor;
            const bureauName = this.navigationData ? this.navigationData.bureaus[this.currentBureau] : this.currentBureau;
            reportImage.alt = `${creditorName} ${bureauName} credit report from ${this.reportDate}, page ${this.currentPage}`;
        }
        
        // Update violations for the new page
        this.renderViolations();
        this.updateViolationCounter();
    }
    
    initializeFromImage() {
        const reportImage = document.querySelector('.report-image');
        if (reportImage && reportImage.src) {
            // Parse the filename: AL-EQ-2024-04-25-P57.png
            const filename = reportImage.src.split('/').pop().replace('.png', '');
            const parts = filename.split('-');
            
            if (parts.length >= 6) {
                // Extract components from filename
                const creditorCode = parts[0];
                const bureauCode = parts[1];
                const year = parts[2];
                const month = parts[3];
                const day = parts[4];
                const pageMatch = parts[5].match(/P(\d+)/);
                
                // Set date
                this.reportDate = `${year}-${month}-${day}`;
                const dateDisplay = document.querySelector('.date-value');
                if (dateDisplay) {
                    dateDisplay.textContent = this.reportDate;
                }
                
                // Set creditor
                const creditorIndex = this.creditors.findIndex(c => c.code === creditorCode);
                if (creditorIndex !== -1) {
                    this.currentCreditorIndex = creditorIndex;
                    this.currentCreditor = creditorCode;
                    
                    // Update creditor display
                    const nameDisplay = document.querySelector('.creditor-name');
                    if (nameDisplay) {
                        nameDisplay.textContent = this.creditors[creditorIndex].name;
                    }
                }
                
                // Set bureau and highlight correct button
                this.currentBureau = bureauCode;
                document.querySelectorAll('.bureau-pill').forEach(pill => {
                    const isActive = pill.dataset.bureau === bureauCode;
                    pill.classList.toggle('active', isActive);
                    pill.setAttribute('aria-pressed', isActive);
                });
                
                // Set page number
                if (pageMatch) {
                    this.currentPage = parseInt(pageMatch[1]);
                    const pageInput = document.querySelector('.page-input');
                    if (pageInput) {
                        pageInput.value = this.currentPage;
                    }
                }
            }
        }
    }
    
    renderViolations() {
        const container = document.querySelector('.viobox-container');
        if (!container) return;
        
        // Clear existing boxes
        container.innerHTML = '';
        
        // Always use the full violations data with complete descriptions
        if (this.violationsData && this.violationsData.violations) {
            // Filter violations for current page from flat list with full descriptions
            this.violations = this.violationsData.violations.filter(v => 
                v.creditor === this.currentCreditor &&
                v.bureau === this.currentBureau &&
                v.date === this.reportDate &&
                v.page === this.currentPage
            );
        } else {
            this.violations = [];
        }
        
        // Render each violation
        this.violations.forEach(violation => {
            const viobox = this.createVIObox(violation);
            container.appendChild(viobox);
        });
        
        // Update sidebar
        this.updateViolationSidebar();
    }
    
    createVIObox(violation) {
        const box = document.createElement('button');
        box.className = `viobox ${violation.severity}`;
        box.setAttribute('role', 'button');
        box.setAttribute('aria-label', `${violation.severity} severity violation: ${violation.description || ''}`);
        box.setAttribute('tabindex', '0');
        box.setAttribute('data-violation-id', violation.id);
        
        // Convert stored coordinates (810x920) back to 1920x1080 for display
        // Since Report View now uses 1920x1080 base like VioTagger
        let displayCoords;
        if (violation.mode === 'viotagger') {
            // VioTagger violations are already converted and stored in 810x920
            // Convert back to 1920x1080 for display
            displayCoords = this.canvasSync.reportViewerToViotagger({
                x: violation.x,
                y: violation.y,
                width: violation.width || 80,
                height: violation.height || 50
            });
        } else {
            // Legacy violations may be in 810x920 coordinates
            displayCoords = {
                x: violation.x,
                y: violation.y,
                width: violation.width || 80,
                height: violation.height || 50
            };
        }
        
        box.style.left = `${displayCoords.x}px`;
        box.style.top = `${displayCoords.y}px`;
        
        // Set custom width/height if provided
        if (displayCoords.width) {
            box.style.width = `${displayCoords.width}px`;
        }
        if (displayCoords.height) {
            box.style.height = `${displayCoords.height}px`;
        }
        
        // Add active class if violation is pre-selected
        if (this.selectedViolations.has(violation.id)) {
            box.classList.add('active');
        }
        
        // Add severity icon
        const icon = document.createElement('div');
        icon.className = `severity-icon severity-${violation.severity}`;
        
        const iconEl = document.createElement('i');
        const iconMap = {
            high: 'shield-x',
            medium: 'triangle-alert',
            low: 'circle-alert'
        };
        iconEl.setAttribute('data-lucide', iconMap[violation.severity]);
        icon.appendChild(iconEl);
        
        box.appendChild(icon);
        
        // Add tooltip for violation text
        if (this.tipsEnabled) {
            const tooltip = document.createElement('span');
            tooltip.className = 'viobox-tooltip';
            tooltip.textContent = violation.text;
            box.appendChild(tooltip);
        }
        
        // Add click handler
        box.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectViolation(violation, e.currentTarget);
        });
        
        return box;
    }
    
    selectViolation(violation, viobox) {
        const isSelected = this.selectedViolations.has(violation.id);
        
        if (isSelected) {
            // Deselect
            this.selectedViolations.delete(violation.id);
            viobox.classList.remove('active');
            this.announce(`Deselected ${violation.severity} severity violation`);
            
            // Auto-switch to "Selected Violations" filter when deselecting
            const selectedRadio = document.querySelector('input[name="violation-filter"][value="selected"]');
            if (selectedRadio) {
                selectedRadio.checked = true;
                this.handleFilterChange('selected');
            }
        } else {
            // Select
            this.selectedViolations.add(violation.id);
            viobox.classList.add('active');
            this.announce(`Selected ${violation.severity} severity violation: ${violation.text}`);
        }
        
        // Update counter and sidebar
        this.updateViolationCounter();
        this.updateViolationSidebar();
        
        // Scroll the corresponding violation in the sidebar into view
        this.scrollViolationIntoView(violation);
    }
    
    updateViolationSidebar() {
        // Get the selected filter
        const selectedFilter = document.querySelector('input[name="violation-filter"]:checked')?.value || 'total';
        
        let violationsToCount = [];
        let stats = { high: 0, medium: 0, low: 0 };
        
        switch (selectedFilter) {
            case 'total':
                // Get ALL violations for current creditor/bureau/date (across all pages)
                violationsToCount = this.getAllViolationsForCurrentReport();
                break;
                
            case 'selected':
                // Get only selected violations across all pages
                violationsToCount = this.getSelectedViolationsForCurrentReport();
                break;
                
            case 'page':
                // Get only selected violations on current page
                violationsToCount = this.violations.filter(v => this.selectedViolations.has(v.id));
                break;
        }
        
        // Count violations by severity
        stats = {
            high: violationsToCount.filter(v => v.severity === 'high').length,
            medium: violationsToCount.filter(v => v.severity === 'medium').length,
            low: violationsToCount.filter(v => v.severity === 'low').length
        };
        
        // Update the stat cards (legacy)
        document.querySelectorAll('.stat-value[data-severity]').forEach(el => {
            const severity = el.dataset.severity;
            if (severity && stats[severity] !== undefined) {
                el.textContent = stats[severity];
            }
        });
        
        // Update the new severity count elements
        document.querySelectorAll('.severity-count[data-severity], .severity-counter[data-severity]').forEach(el => {
            const severity = el.dataset.severity;
            if (severity && stats[severity] !== undefined) {
                el.textContent = stats[severity];
                
                // Add three-digits class for counter elements
                if (el.classList.contains('severity-counter')) {
                    if (stats[severity] >= 100) {
                        el.classList.add('three-digits');
                    } else {
                        el.classList.remove('three-digits');
                    }
                }
                
                // Add class for dynamic positioning if 2-3 digits (old style)
                const parent = el.closest('.severity-box');
                if (parent) {
                    parent.classList.remove('has-double-digits', 'has-triple-digits');
                    if (stats[severity] >= 10 && stats[severity] < 100) {
                        parent.classList.add('has-double-digits');
                    } else if (stats[severity] >= 100) {
                        parent.classList.add('has-triple-digits');
                    }
                }
            }
        });
        
        // Update violation details list (new component)
        const violationDetailsList = document.querySelector('.violation-details-list');
        if (violationDetailsList) {
            violationDetailsList.innerHTML = '';
            
            // Update violation list based on filter
            const violationsToShow = selectedFilter === 'page' ? this.violations.filter(v => this.selectedViolations.has(v.id)) : 
                                    selectedFilter === 'selected' ? this.getSelectedViolationsForCurrentReport() :
                                    this.getAllViolationsForCurrentReport(); // 'total' filter shows all violations
            
            violationsToShow.forEach(violation => {
                const violationBox = document.createElement('div');
                violationBox.className = `violation-box ${violation.severity}`;
                violationBox.setAttribute('data-sidebar-violation-id', violation.id);
                if (this.selectedViolations.has(violation.id)) {
                    violationBox.classList.add('selected');
                }
                
                // Generate FCRA codes string
                const fcraCodesText = violation.codes || 
                    (violation.fcra_codes ? violation.fcra_codes.join('; ') : 
                    violation.code || '§1681');
                
                violationBox.innerHTML = `
                    <div class="violation-severity-badge">
                        <i data-lucide="${violation.severity === 'high' ? 'shield-x' : 
                                          violation.severity === 'medium' ? 'triangle-alert' : 'circle-alert'}"></i>
                    </div>
                    <div class="violation-content">
                        <div class="violation-fcra-codes">${fcraCodesText}</div>
                        <div class="violation-description">${violation.description || ''}</div>
                    </div>
                `;
                violationDetailsList.appendChild(violationBox);
            });
            
            // Re-initialize Lucide icons
            lucide.createIcons();
            
            // Restore selected state for VIOboxes
            this.selectedViolations.forEach(id => {
                const box = document.querySelector(`[data-violation-id="${id}"]`);
                if (box) box.classList.add('active');
            });
            
            // Update custom scrollbar if more than 4 violations
            this.updateCustomScrollbar();
        }
    }
    
    updateViolationCounter() {
        const counter = document.querySelector('.violation-counter .count');
        if (counter) {
            // Show number of selected violations
            counter.textContent = this.selectedViolations.size;
        }
    }
    
    handleKeyboard(e) {
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
        // Arrow key navigation
        if (e.key === 'ArrowLeft' && !e.target.matches('input')) {
            e.preventDefault();
            if (e.shiftKey) {
                this.navigateCreditor(-1);
            } else {
                this.navigatePage(-1);
            }
        } else if (e.key === 'ArrowRight' && !e.target.matches('input')) {
            e.preventDefault();
            if (e.shiftKey) {
                this.navigateCreditor(1);
            } else {
                this.navigatePage(1);
            }
        }
        
        // View switching with number keys
        if (e.key === '1' && e.ctrlKey) {
            e.preventDefault();
            this.switchView('report');
        } else if (e.key === '2' && e.ctrlKey) {
            e.preventDefault();
            this.switchView('tagger');
        } else if (e.key === '3' && e.ctrlKey) {
            e.preventDefault();
            this.switchView('evidence');
        }
    }
    
    announce(message) {
        // Create or update live region for screen reader announcements
        let liveRegion = document.getElementById('vioverse-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'vioverse-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = message;
    }
    
    toggleFilterCounter() {
        const container = document.querySelector('.filter-counter');
        const expandedBtn = document.querySelector('.filter-counter-toggle-expanded');
        const collapsedBtn = document.querySelector('.filter-counter-toggle-collapsed');
        
        if (!container) return;
        
        const isCollapsed = container.classList.contains('collapsed');
        
        if (isCollapsed) {
            container.classList.remove('collapsed');
            if (expandedBtn) expandedBtn.setAttribute('aria-expanded', 'true');
            if (collapsedBtn) collapsedBtn.setAttribute('aria-expanded', 'false');
        } else {
            container.classList.add('collapsed');
            if (expandedBtn) expandedBtn.setAttribute('aria-expanded', 'false');
            if (collapsedBtn) collapsedBtn.setAttribute('aria-expanded', 'true');
        }
        
        this.updateSectionLabelsBar();
        this.announce(`Filter section ${isCollapsed ? 'expanded' : 'collapsed'}`);
    }
    
    toggleSeveritySummary() {
        const container = document.querySelector('.severity-summary-component');
        const expandedBtn = document.querySelector('.severity-summary-toggle-expanded');
        const collapsedBtn = document.querySelector('.severity-summary-toggle-collapsed');
        
        if (!container) return;
        
        const isCollapsed = container.classList.contains('collapsed');
        
        if (isCollapsed) {
            container.classList.remove('collapsed');
            if (expandedBtn) expandedBtn.setAttribute('aria-expanded', 'true');
            if (collapsedBtn) collapsedBtn.setAttribute('aria-expanded', 'false');
        } else {
            container.classList.add('collapsed');
            if (expandedBtn) expandedBtn.setAttribute('aria-expanded', 'false');
            if (collapsedBtn) collapsedBtn.setAttribute('aria-expanded', 'true');
        }
        
        this.updateSectionLabelsBar();
        this.announce(`Severity summary ${isCollapsed ? 'expanded' : 'collapsed'}`);
    }
    
    toggleViolationDetails() {
        const container = document.querySelector('.violation-details-component');
        const expandedBtn = document.querySelector('.violation-details-toggle-expanded');
        const collapsedBtn = document.querySelector('.violation-details-toggle-collapsed');
        
        if (!container) return;
        
        const isCollapsed = container.classList.contains('collapsed');
        
        if (isCollapsed) {
            container.classList.remove('collapsed');
            if (expandedBtn) expandedBtn.setAttribute('aria-expanded', 'true');
            if (collapsedBtn) collapsedBtn.setAttribute('aria-expanded', 'false');
        } else {
            container.classList.add('collapsed');
            if (expandedBtn) expandedBtn.setAttribute('aria-expanded', 'false');
            if (collapsedBtn) collapsedBtn.setAttribute('aria-expanded', 'true');
        }
        
        this.updateSectionLabelsBar();
        this.announce(`Violation details ${isCollapsed ? 'expanded' : 'collapsed'}`);
    }
    
    updateSectionLabelsBar() {
        const labelsBar = document.getElementById('sectionLabelsBar');
        const filterLabel = document.querySelector('[data-section="filter"]');
        const severityLabel = document.querySelector('[data-section="severity"]');
        const violationsLabel = document.querySelector('[data-section="violations"]');
        
        const filterCollapsed = document.querySelector('.filter-counter')?.classList.contains('collapsed');
        const severityCollapsed = document.querySelector('.severity-summary-component')?.classList.contains('collapsed');
        const violationsCollapsed = document.querySelector('.violation-details-component')?.classList.contains('collapsed');
        
        // Show/hide individual labels
        if (filterLabel) filterLabel.style.display = filterCollapsed ? 'block' : 'none';
        if (severityLabel) severityLabel.style.display = severityCollapsed ? 'block' : 'none';
        if (violationsLabel) violationsLabel.style.display = violationsCollapsed ? 'block' : 'none';
        
        // Show/hide the bar itself
        const anyCollapsed = filterCollapsed || severityCollapsed || violationsCollapsed;
        if (labelsBar) labelsBar.style.display = anyCollapsed ? 'flex' : 'none';
    }
    
    
    async loadViolations() {
        try {
            // Always load from JSON file first to ensure latest full descriptions
            try {
                const response = await fetch('data/violations/violations-processed.json');
                this.violationsData = await response.json();
                console.log('Loaded violations from JSON file');
                
                // Clear any old localStorage data to prevent conflicts
                localStorage.removeItem('vioverse-violations');
            } catch (jsonError) {
                // Fall back to localStorage only if JSON file not found
                const stored = localStorage.getItem('vioverse-violations');
                if (stored) {
                    this.violationsData = JSON.parse(stored);
                    console.log('Loaded violations from localStorage (fallback)');
                    return;
                }
                console.log('No processed violations found. Place ExportedViolations.csv in data/violations/ folder');
                // Use demo data if no violations found
                this.violationsData = {
                    violations: [
                        { id: 1, x: 100, y: 200, width: 400, height: 50, severity: 'high', 
                          description: 'Missing account status', text: 'Account status not reported',
                          fcra_codes: ['§1681e(b)', '§1681i'], code: '§1681e(b)',
                          creditor: 'AL', bureau: 'EQ', date: '2024-04-25', page: 57 },
                        { id: 2, x: 100, y: 300, width: 400, height: 50, severity: 'medium', 
                          description: 'Incorrect balance', text: 'Balance amount incorrect',
                          fcra_codes: ['§1681e(b)'], code: '§1681e(b)',
                          creditor: 'AL', bureau: 'EQ', date: '2024-04-25', page: 57 },
                        { id: 3, x: 100, y: 400, width: 400, height: 50, severity: 'low', 
                          description: 'Date discrepancy', text: 'Date reported incorrectly',
                          fcra_codes: ['§1681s-2(b)'], code: '§1681s-2(b)',
                          creditor: 'AL', bureau: 'EQ', date: '2024-04-25', page: 57 }
                    ],
                    byPage: {}
                };
            }
        } catch (error) {
            console.error('Failed to load violations:', error);
        }
    }
    
    setupReportNavigation() {
        // Bureau navigation
        const bureauUpBtn = document.querySelector('[data-nav="bureau-up"]');
        const bureauDownBtn = document.querySelector('[data-nav="bureau-down"]');
        if (bureauUpBtn) bureauUpBtn.addEventListener('click', () => this.navigateBureau(-1));
        if (bureauDownBtn) bureauDownBtn.addEventListener('click', () => this.navigateBureau(1));
        
        // Date navigation
        const dateUpBtn = document.querySelector('[data-nav="date-up"]');
        const dateDownBtn = document.querySelector('[data-nav="date-down"]');
        if (dateUpBtn) dateUpBtn.addEventListener('click', () => this.navigateDate(-1));
        if (dateDownBtn) dateDownBtn.addEventListener('click', () => this.navigateDate(1));
        
        // Creditor navigation
        const creditorUpBtn = document.querySelector('[data-nav="creditor-up"]');
        const creditorDownBtn = document.querySelector('[data-nav="creditor-down"]');
        if (creditorUpBtn) {
            creditorUpBtn.addEventListener('click', () => this.navigateReportCreditor(-1));
            creditorUpBtn.addEventListener('mouseenter', () => this.updateTooltip(creditorUpBtn, -1));
        }
        if (creditorDownBtn) {
            creditorDownBtn.addEventListener('click', () => this.navigateReportCreditor(1));
            creditorDownBtn.addEventListener('mouseenter', () => this.updateTooltip(creditorDownBtn, 1));
        }
        
        // Page navigation
        const pageUpBtn = document.querySelector('[data-nav="page-up"]');
        const pageDownBtn = document.querySelector('[data-nav="page-down"]');
        if (pageUpBtn) {
            pageUpBtn.addEventListener('click', () => this.navigateReportPage(-1));
            pageUpBtn.addEventListener('mouseenter', () => this.updatePageTooltip(pageUpBtn, -1));
        }
        if (pageDownBtn) {
            pageDownBtn.addEventListener('click', () => this.navigateReportPage(1));
            pageDownBtn.addEventListener('mouseenter', () => this.updatePageTooltip(pageDownBtn, 1));
        }
    }
    
    navigateBureau(direction) {
        if (!this.navigationData) return;
        
        const bureauCodes = Object.keys(this.navigationData.bureaus);
        const currentIndex = bureauCodes.indexOf(this.currentBureau);
        let newIndex = currentIndex + direction;
        
        // Check if we need to advance date
        if (newIndex >= bureauCodes.length) {
            // Moving forward past last bureau - advance date
            this.navigateDate(1);
            this.currentBureau = bureauCodes[0]; // First bureau
            this.updateBureauDisplay();
            this.findAvailableCreditor();
            this.highlightTransition('date');
            return;
        } else if (newIndex < 0) {
            // Moving backward past first bureau - go to previous date
            this.navigateDate(-1);
            this.currentBureau = bureauCodes[bureauCodes.length - 1]; // Last bureau
            this.updateBureauDisplay();
            // Find last creditor for this bureau/date
            const bureauReports = this.navigationData.reports[this.currentBureau];
            if (bureauReports && bureauReports[this.reportDate]) {
                const creditors = Object.keys(bureauReports[this.reportDate]);
                if (creditors.length > 0) {
                    this.currentCreditor = creditors[creditors.length - 1];
                    this.updateCreditorDisplay();
                    this.findAvailablePage();
                }
            }
            this.highlightTransition('date');
            return;
        }
        
        this.currentBureau = bureauCodes[newIndex];
        this.updateBureauDisplay();
        this.findAvailableReport();
    }
    
    navigateDate(direction) {
        if (!this.navigationData) return;
        
        // Get all dates for current bureau
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports) return;
        
        const dates = Object.keys(bureauReports).sort();
        const currentIndex = dates.indexOf(this.reportDate);
        let newIndex = currentIndex + direction;
        
        // Wrap around
        if (newIndex < 0) newIndex = dates.length - 1;
        if (newIndex >= dates.length) newIndex = 0;
        
        this.reportDate = dates[newIndex];
        this.updateDateDisplay();
        this.findAvailableCreditor();
    }
    
    navigateReportCreditor(direction) {
        if (!this.navigationData) return;
        
        // Get creditors for current bureau and date
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports || !bureauReports[this.reportDate]) return;
        
        const availableCreditors = Object.keys(bureauReports[this.reportDate]);
        const currentIndex = availableCreditors.indexOf(this.currentCreditor);
        let newIndex = currentIndex + direction;
        
        // Check if we need to advance to next/previous bureau
        if (newIndex >= availableCreditors.length) {
            // Moving forward past last creditor - advance bureau
            this.navigateBureau(1);
            this.highlightTransition('bureau');
            return;
        } else if (newIndex < 0) {
            // Moving backward past first creditor - go to previous bureau
            this.navigateBureau(-1);
            // Set to last creditor of the new bureau
            const newBureauReports = this.navigationData.reports[this.currentBureau];
            if (newBureauReports && newBureauReports[this.reportDate]) {
                const newCreditors = Object.keys(newBureauReports[this.reportDate]);
                if (newCreditors.length > 0) {
                    this.currentCreditor = newCreditors[newCreditors.length - 1];
                    this.updateCreditorDisplay();
                    this.findAvailablePage();
                }
            }
            this.highlightTransition('bureau');
            return;
        }
        
        this.currentCreditor = availableCreditors[newIndex];
        this.updateCreditorDisplay();
        this.findAvailablePage();
    }
    
    navigateReportPage(direction) {
        if (!this.navigationData) return;
        
        // Get pages for current bureau/date/creditor
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports || !bureauReports[this.reportDate]) return;
        
        const pages = bureauReports[this.reportDate][this.currentCreditor];
        if (!pages || pages.length === 0) return;
        
        const currentIndex = pages.indexOf(this.currentPage);
        if (currentIndex === -1) {
            // Current page not found in list, find closest
            this.currentPage = pages[0];
            this.updatePageDisplay();
            this.updateReportImage();
            return;
        }
        
        let newIndex = currentIndex + direction;
        
        // Wrap around
        if (newIndex < 0) newIndex = pages.length - 1;
        if (newIndex >= pages.length) newIndex = 0;
        
        this.currentPage = pages[newIndex];
        this.updatePageDisplay();
        this.updateReportImage();
    }
    
    updateBureauDisplay() {
        const bureauLogo = document.getElementById('bureau-logo');
        const bureauName = this.navigationData.bureaus[this.currentBureau];
        if (bureauLogo) {
            // Map bureau codes to actual file names
            const bureauFiles = {
                'EQ': 'EQ_White_Logo.png',
                'EX': 'EX_White_Logo.svg',
                'TU': 'TU_White_Logo.svg'
            };
            bureauLogo.src = `assets/bureaus/${bureauFiles[this.currentBureau]}`;
            bureauLogo.alt = bureauName;
        }
    }
    
    updateDateDisplay() {
        const dateEl = document.getElementById('report-date');
        if (dateEl) {
            // Convert YYYY-MM-DD to MM-DD-YYYY for display
            const parts = this.reportDate.split('-');
            dateEl.textContent = `${parts[1]}-${parts[2]}-${parts[0]}`;
        }
    }
    
    updateCreditorDisplay() {
        const creditorEl = document.getElementById('creditor-name');
        if (creditorEl && this.navigationData) {
            const creditorName = this.navigationData.creditors[this.currentCreditor];
            creditorEl.textContent = creditorName.toLowerCase();
        }
    }
    
    updatePageDisplay() {
        const pageEl = document.getElementById('page-number');
        if (pageEl) {
            pageEl.textContent = this.currentPage;
        }
    }
    
    async loadNavigationData() {
        try {
            const response = await fetch('data/navigation-map.json');
            this.navigationData = await response.json();
        } catch (error) {
            console.error('Failed to load navigation data:', error);
            // Fallback to minimal structure if load fails
            this.navigationData = {
                bureaus: {
                    'EQ': 'Equifax',
                    'EX': 'Experian', 
                    'TU': 'TransUnion'
                },
                creditors: {},
                reports: {}
            };
        }
    }
    
    highlightTransition(type) {
        // Add visual feedback when auto-advancing
        const segmentMap = {
            'bureau': '.bureau-segment',
            'date': '.date-segment'
        };
        
        const segment = document.querySelector(segmentMap[type]);
        if (segment) {
            segment.classList.add('nav-transitioning');
            setTimeout(() => {
                segment.classList.remove('nav-transitioning');
            }, 400);
        }
        
        // Announce to screen readers
        const announcements = {
            'bureau': `Advanced to ${this.navigationData.bureaus[this.currentBureau]} bureau`,
            'date': `Advanced to next report date: ${this.reportDate}`
        };
        
        if (announcements[type]) {
            this.announce(announcements[type]);
        }
    }
    
    updateTooltip(button, direction) {
        if (!this.navigationData || !this.tipsEnabled) return;
        
        const tooltip = button.querySelector('.nav-tooltip');
        if (!tooltip) return;
        
        // Determine what the next destination would be
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports || !bureauReports[this.reportDate]) return;
        
        const availableCreditors = Object.keys(bureauReports[this.reportDate]);
        const currentIndex = availableCreditors.indexOf(this.currentCreditor);
        let nextIndex = currentIndex + direction;
        
        // Check if we'll cross a boundary
        if (nextIndex >= availableCreditors.length) {
            // Will advance to next bureau
            const bureauCodes = Object.keys(this.navigationData.bureaus);
            const currentBureauIndex = bureauCodes.indexOf(this.currentBureau);
            const nextBureauIndex = (currentBureauIndex + 1) % bureauCodes.length;
            const nextBureau = bureauCodes[nextBureauIndex];
            
            if (nextBureauIndex === 0) {
                // Will also advance date
                tooltip.textContent = `next: ally – equifax – next date`;
            } else {
                tooltip.textContent = `next: ally – ${this.navigationData.bureaus[nextBureau].toLowerCase()}`;
            }
        } else if (nextIndex < 0) {
            // Will go to previous bureau
            const bureauCodes = Object.keys(this.navigationData.bureaus);
            const currentBureauIndex = bureauCodes.indexOf(this.currentBureau);
            const prevBureauIndex = currentBureauIndex - 1 < 0 ? bureauCodes.length - 1 : currentBureauIndex - 1;
            const prevBureau = bureauCodes[prevBureauIndex];
            
            if (currentBureauIndex === 0) {
                // Will also go to previous date
                tooltip.textContent = `prev: last creditor – transunion – prev date`;
            } else {
                tooltip.textContent = `prev: last creditor – ${this.navigationData.bureaus[prevBureau].toLowerCase()}`;
            }
        } else {
            // Normal navigation within same bureau
            const nextCreditor = availableCreditors[nextIndex];
            const creditorName = this.navigationData.creditors[nextCreditor];
            tooltip.textContent = `next: ${creditorName.toLowerCase()}`;
        }
    }
    
    updatePageTooltip(button, direction) {
        if (!this.navigationData || !this.tipsEnabled) return;
        
        const tooltip = button.querySelector('.nav-tooltip');
        if (!tooltip) return;
        
        // Get pages for current bureau/date/creditor
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports || !bureauReports[this.reportDate]) return;
        
        const pages = bureauReports[this.reportDate][this.currentCreditor];
        if (!pages || pages.length === 0) return;
        
        const currentIndex = pages.indexOf(this.currentPage);
        let nextIndex = currentIndex + direction;
        
        // If there are multiple pages, show helpful information
        if (pages.length > 1) {
            if (direction > 0) {
                if (nextIndex >= pages.length) {
                    tooltip.textContent = `page ${pages[0]} (first of ${pages.length} pages)`;
                } else {
                    tooltip.textContent = `page ${pages[nextIndex]} (${nextIndex + 1} of ${pages.length} pages)`;
                }
            } else {
                if (nextIndex < 0) {
                    tooltip.textContent = `page ${pages[pages.length - 1]} (last of ${pages.length} pages)`;
                } else {
                    tooltip.textContent = `page ${pages[nextIndex]} (${nextIndex + 1} of ${pages.length} pages)`;
                }
            }
        } else {
            // Single page
            tooltip.textContent = `only page for this creditor`;
        }
    }
    
    /* DUPLICATE REMOVED - see line 1040 for the correct implementation
    toggleFilterCounter() {
        const filterContainer = document.querySelector('.filter-counter');
        if (filterContainer) {
            filterContainer.classList.toggle('collapsed');
            const isCollapsed = filterContainer.classList.contains('collapsed');
            
            // Update aria-expanded attribute
            const toggleButton = filterContainer.querySelector('.filter-counter-toggle');
            if (toggleButton) {
                toggleButton.setAttribute('aria-expanded', !isCollapsed);
            }
            
            // Update icon
            const icon = toggleButton.querySelector('i');
            if (icon) {
                if (isCollapsed) {
                    icon.setAttribute('data-lucide', 'circle-chevron-down');
                } else {
                    icon.setAttribute('data-lucide', 'circle-chevron-up');
                }
                lucide.createIcons();
            }
        }
    } */
    
    toggleSeverityBoxes() {
        const severityContainer = document.querySelector('.severity-boxes-component');
        if (severityContainer) {
            severityContainer.classList.toggle('collapsed');
            const isCollapsed = severityContainer.classList.contains('collapsed');
            
            // Update aria-expanded attribute
            const toggleButton = severityContainer.querySelector('.severity-boxes-toggle');
            if (toggleButton) {
                toggleButton.setAttribute('aria-expanded', !isCollapsed);
            }
            
            // Update icon
            const icon = toggleButton.querySelector('i');
            if (icon) {
                if (isCollapsed) {
                    icon.setAttribute('data-lucide', 'chevron-down');
                } else {
                    icon.setAttribute('data-lucide', 'chevron-up');
                }
                lucide.createIcons();
            }
            
            this.announce(`Severity boxes ${isCollapsed ? 'collapsed' : 'expanded'}`);
        }
    }
    
    // Old toggleViolationDetails method - replaced with two-button approach in initialization
    // Kept for reference but no longer used
    /*
    toggleViolationDetails() {
        const violationContainer = document.querySelector('.violation-details-component');
        if (violationContainer) {
            violationContainer.classList.toggle('collapsed');
            const isCollapsed = violationContainer.classList.contains('collapsed');
            
            // Update aria-expanded attribute
            const toggleButton = violationContainer.querySelector('.violation-details-toggle');
            if (toggleButton) {
                toggleButton.setAttribute('aria-expanded', !isCollapsed);
            }
            
            // Update icon
            const icon = toggleButton.querySelector('i');
            if (icon) {
                if (isCollapsed) {
                    icon.setAttribute('data-lucide', 'chevron-down');
                } else {
                    icon.setAttribute('data-lucide', 'chevron-up');
                }
                lucide.createIcons();
            }
            
            this.announce(`Violation details ${isCollapsed ? 'collapsed' : 'expanded'}`);
        }
    }
    */
    
    handleFilterChange(value) {
        // Handle mutual exclusivity for filter options
        const filterOptions = document.querySelectorAll('input[name="violation-filter"]');
        
        filterOptions.forEach(option => {
            const label = option.parentElement;
            label.classList.remove('disabled');
            label.removeAttribute('data-tooltip');
            option.disabled = false;
        });
        
        // Apply mutual exclusivity rules
        if (value === 'total') {
            // When "total violations" is selected, disable "current page only"
            const pageOption = document.querySelector('input[value="page"]');
            if (pageOption) {
                const label = pageOption.parentElement;
                label.classList.add('disabled');
                label.setAttribute('data-tooltip', 'Cannot combine with "total violations"');
                pageOption.disabled = true;
            }
        } else if (value === 'page') {
            // When "current page only" is selected, disable "total violations"
            const totalOption = document.querySelector('input[value="total"]');
            if (totalOption) {
                const label = totalOption.parentElement;
                label.classList.add('disabled');
                label.setAttribute('data-tooltip', 'Cannot combine with "current page only"');
                totalOption.disabled = true;
            }
        }
        
        // Update the sidebar based on new filter
        this.updateViolationSidebar();
    }
    
    // Accessibility helper
    announce(message) {
        // Create or get announcement element
        let announcer = document.getElementById('vioverse-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'vioverse-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
        }
        
        // Announce the message
        announcer.textContent = message;
    }
    
    // Helper methods for getting violations
    getAllViolationsForCurrentReport() {
        if (!this.violationsData || !this.violationsData.violations) return [];
        
        return this.violationsData.violations.filter(v => 
            v.creditor === this.currentCreditor &&
            v.bureau === this.currentBureau &&
            v.date === this.reportDate
        );
    }
    
    getSelectedViolationsForCurrentReport() {
        if (!this.violationsData || !this.violationsData.violations) return [];
        
        return this.violationsData.violations.filter(v => 
            v.creditor === this.currentCreditor &&
            v.bureau === this.currentBureau &&
            v.date === this.reportDate &&
            this.selectedViolations.has(v.id)
        );
    }
    
    // Pre-select all violations for the current report
    preselectAllViolations() {
        const allViolations = this.getAllViolationsForCurrentReport();
        allViolations.forEach(violation => {
            this.selectedViolations.add(violation.id);
        });
        console.log(`Pre-selected ${allViolations.length} violations for current report`);
    }
    
    // Navigation helper methods
    findAvailableReport() {
        if (!this.navigationData) return;
        
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports) return;
        
        // Check if current date has reports
        if (bureauReports[this.reportDate]) {
            this.findAvailableCreditor();
        } else {
            // Find first available date
            const dates = Object.keys(bureauReports).sort();
            if (dates.length > 0) {
                this.reportDate = dates[0];
                this.updateDateDisplay();
                this.findAvailableCreditor();
            }
        }
    }
    
    findAvailableCreditor() {
        if (!this.navigationData) return;
        
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports || !bureauReports[this.reportDate]) return;
        
        const availableCreditors = Object.keys(bureauReports[this.reportDate]);
        
        // Check if current creditor is available
        if (availableCreditors.includes(this.currentCreditor)) {
            this.findAvailablePage();
        } else if (availableCreditors.length > 0) {
            // Use first available creditor
            this.currentCreditor = availableCreditors[0];
            this.updateCreditorDisplay();
            this.findAvailablePage();
        }
    }
    
    findAvailablePage() {
        if (!this.navigationData) return;
        
        const bureauReports = this.navigationData.reports[this.currentBureau];
        if (!bureauReports || !bureauReports[this.reportDate]) return;
        
        const pages = bureauReports[this.reportDate][this.currentCreditor];
        if (!pages || pages.length === 0) return;
        
        // Check if current page is available
        if (!pages.includes(this.currentPage)) {
            // Use first available page
            this.currentPage = pages[0];
        }
        
        this.updatePageDisplay();
        this.updateReportImage();
    }
    
    highlightTransition(elementType) {
        // Briefly highlight the element that changed
        let selector = '';
        switch (elementType) {
            case 'date':
                selector = '.date-segment';
                break;
            case 'bureau':
                selector = '.bureau-segment';
                break;
            case 'creditor':
                selector = '.creditor-segment';
                break;
        }
        
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('transitioning');
            setTimeout(() => {
                element.classList.remove('transitioning');
            }, 300);
        }
    }
    
    /**
     * Scroll a violation in the sidebar list into view
     */
    scrollViolationIntoView(violation) {
        // Find the violation box in the sidebar
        const sidebarViolation = document.querySelector(`[data-sidebar-violation-id="${violation.id}"]`);
        const violationDetailsList = document.querySelector('.violation-details-list');
        
        if (sidebarViolation && violationDetailsList) {
            // Get the offset of the violation within the scrollable container
            const violationOffset = sidebarViolation.offsetTop;
            const violationHeight = sidebarViolation.offsetHeight;
            const containerHeight = violationDetailsList.clientHeight;
            const scrollTop = violationDetailsList.scrollTop;
            
            // Calculate if we need to scroll
            const violationTop = violationOffset;
            const violationBottom = violationOffset + violationHeight;
            const visibleTop = scrollTop;
            const visibleBottom = scrollTop + containerHeight;
            
            let newScrollTop = scrollTop;
            
            if (violationTop < visibleTop) {
                // Violation is above visible area, scroll up
                newScrollTop = violationTop - 10; // 10px padding
            } else if (violationBottom > visibleBottom) {
                // Violation is below visible area, scroll down
                newScrollTop = violationBottom - containerHeight + 10; // 10px padding
            }
            
            // Only scroll if needed
            if (newScrollTop !== scrollTop) {
                violationDetailsList.scrollTop = newScrollTop;
            }
            
            // Add a highlight effect to draw attention
            sidebarViolation.classList.add('highlight');
            setTimeout(() => {
                sidebarViolation.classList.remove('highlight');
            }, 1000);
        }
    }
    
    /**
     * Update custom scrollbar for violation details
     */
    updateCustomScrollbar() {
        const violationDetailsList = document.querySelector('.violation-details-list');
        const customScroll = document.getElementById('customScrollVioDetails');
        const violations = violationDetailsList?.querySelectorAll('.violation-box') || [];
        
        if (!violationDetailsList || !customScroll) return;
        
        // Show/hide custom scrollbar based on number of violations
        if (violations.length > 4) {
            customScroll.style.display = 'block';
            violationDetailsList.classList.add('custom-scroll-active');
            this.initCustomScrollbar();
        } else {
            customScroll.style.display = 'none';
            violationDetailsList.classList.remove('custom-scroll-active');
        }
    }
    
    /**
     * Initialize custom scrollbar functionality
     */
    initCustomScrollbar() {
        const violationDetailsList = document.querySelector('.violation-details-list');
        const scrollThumb = document.querySelector('.scroll-thumb');
        const scrollTrack = document.querySelector('.scroll-track');
        const scrollUp = document.querySelector('.scroll-arrow.scroll-up');
        const scrollDown = document.querySelector('.scroll-arrow.scroll-down');
        
        if (!violationDetailsList || !scrollThumb || !scrollTrack) return;
        
        // Calculate thumb height based on content ratio
        const updateThumbSize = () => {
            const scrollHeight = violationDetailsList.scrollHeight;
            const clientHeight = violationDetailsList.clientHeight;
            const trackHeight = scrollTrack.clientHeight;
            
            // Calculate thumb height as ratio of visible to total content
            const thumbHeightRatio = clientHeight / scrollHeight;
            const thumbHeight = Math.max(30, trackHeight * thumbHeightRatio); // Min 30px
            
            scrollThumb.style.height = `${thumbHeight}px`;
            
            // Update thumb position
            updateThumbPosition();
        };
        
        // Update thumb position based on scroll
        const updateThumbPosition = () => {
            const scrollHeight = violationDetailsList.scrollHeight;
            const clientHeight = violationDetailsList.clientHeight;
            const scrollTop = violationDetailsList.scrollTop;
            const trackHeight = scrollTrack.clientHeight;
            const thumbHeight = parseFloat(scrollThumb.style.height);
            
            // Calculate position
            const scrollableHeight = scrollHeight - clientHeight;
            const scrollRatio = scrollTop / scrollableHeight;
            const maxThumbTop = trackHeight - thumbHeight - 26; // 13px padding top and bottom
            const thumbTop = 13 + (scrollRatio * maxThumbTop);
            
            scrollThumb.style.top = `${thumbTop}px`;
        };
        
        // Handle scroll events
        violationDetailsList.addEventListener('scroll', updateThumbPosition);
        
        // Handle thumb dragging
        let isDragging = false;
        let dragStartY = 0;
        let dragStartTop = 0;
        
        scrollThumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartY = e.clientY;
            dragStartTop = parseFloat(scrollThumb.style.top) || 13;
            document.body.classList.add('dragging-scroll');
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaY = e.clientY - dragStartY;
            const newTop = Math.max(13, Math.min(dragStartTop + deltaY, 
                scrollTrack.clientHeight - parseFloat(scrollThumb.style.height) - 13));
            
            scrollThumb.style.top = `${newTop}px`;
            
            // Update scroll position
            const thumbRange = scrollTrack.clientHeight - parseFloat(scrollThumb.style.height) - 26;
            const scrollRatio = (newTop - 13) / thumbRange;
            const scrollableHeight = violationDetailsList.scrollHeight - violationDetailsList.clientHeight;
            
            violationDetailsList.scrollTop = scrollRatio * scrollableHeight;
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.classList.remove('dragging-scroll');
            }
        });
        
        // Handle track clicks
        scrollTrack.addEventListener('click', (e) => {
            if (e.target === scrollThumb) return;
            
            const trackRect = scrollTrack.getBoundingClientRect();
            const clickY = e.clientY - trackRect.top;
            const thumbHeight = parseFloat(scrollThumb.style.height);
            const newTop = Math.max(13, Math.min(clickY - thumbHeight / 2, 
                scrollTrack.clientHeight - thumbHeight - 13));
            
            scrollThumb.style.top = `${newTop}px`;
            
            // Update scroll position
            const thumbRange = scrollTrack.clientHeight - thumbHeight - 26;
            const scrollRatio = (newTop - 13) / thumbRange;
            const scrollableHeight = violationDetailsList.scrollHeight - violationDetailsList.clientHeight;
            
            violationDetailsList.scrollTop = scrollRatio * scrollableHeight;
        });
        
        // Handle arrow buttons
        if (scrollUp) {
            scrollUp.addEventListener('click', () => {
                violationDetailsList.scrollTop -= 100; // Scroll up by 100px
            });
        }
        
        if (scrollDown) {
            scrollDown.addEventListener('click', () => {
                violationDetailsList.scrollTop += 100; // Scroll down by 100px
            });
        }
        
        // Initial size update
        updateThumbSize();
        
        // Update on window resize
        window.addEventListener('resize', updateThumbSize);
    }
    
    /**
     * Initialize search functionality
     */
    initSearchBox() {
        const searchInput = document.getElementById('search-input');
        const searchBox = document.getElementById('search-box');
        
        if (!searchInput || !searchBox) return;
        
        // Handle search input
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            this.performSearch(searchTerm);
        });
        
        // Handle Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = e.target.value.toLowerCase().trim();
                if (searchTerm) {
                    this.highlightFirstSearchResult(searchTerm);
                }
            }
        });
        
        // Clear search on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                this.clearSearchHighlights();
                searchInput.blur();
            }
        });
    }
    
    /**
     * Perform search across violations
     */
    performSearch(searchTerm) {
        if (!searchTerm) {
            this.clearSearchHighlights();
            return;
        }
        
        // Search in violation details
        const violationItems = document.querySelectorAll('.violation-item');
        let foundCount = 0;
        
        violationItems.forEach(item => {
            const description = item.querySelector('.violation-description')?.textContent.toLowerCase() || '';
            const codes = item.querySelector('.violation-fcra-codes')?.textContent.toLowerCase() || '';
            const severity = item.dataset.severity?.toLowerCase() || '';
            
            if (description.includes(searchTerm) || codes.includes(searchTerm) || severity.includes(searchTerm)) {
                item.classList.add('search-match');
                foundCount++;
            } else {
                item.classList.remove('search-match');
            }
        });
        
        // Update search box style to indicate results
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            if (foundCount > 0) {
                searchBox.classList.add('has-results');
            } else {
                searchBox.classList.remove('has-results');
            }
        }
        
        console.log(`Found ${foundCount} matches for "${searchTerm}"`);
    }
    
    /**
     * Highlight first search result and scroll to it
     */
    highlightFirstSearchResult(searchTerm) {
        const firstMatch = document.querySelector('.violation-item.search-match');
        if (firstMatch) {
            // Scroll to the first match
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add highlight animation
            firstMatch.classList.add('search-highlight');
            setTimeout(() => {
                firstMatch.classList.remove('search-highlight');
            }, 2000);
        }
    }
    
    /**
     * Clear all search highlights
     */
    clearSearchHighlights() {
        document.querySelectorAll('.violation-item').forEach(item => {
            item.classList.remove('search-match', 'search-highlight');
        });
        document.getElementById('search-box')?.classList.remove('has-results');
    }
    
    // Mobile sidebar toggle functionality
    initMobileSidebar() {
        // Create mobile toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-sidebar-toggle';
        toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
        toggleButton.setAttribute('aria-label', 'Toggle sidebar');
        document.body.appendChild(toggleButton);
        
        // Get sidebar element
        const sidebar = document.querySelector('.sidebar-wrapper');
        
        // Toggle sidebar on button click
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            const isOpen = sidebar.classList.contains('mobile-open');
            toggleButton.setAttribute('aria-expanded', isOpen);
            
            // Update button icon
            if (isOpen) {
                toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
            } else {
                toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
            }
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleButton.contains(e.target) && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
            }
        });
    }
}

// Initialize the application
const vioverse = new VioVerse();
