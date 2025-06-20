/**
 * VioTagger Dynamic Report Selection
 * Handles bureau/creditor selection monitoring and dynamic report page loading
 */

class VioTaggerDynamic {
    constructor() {
        this.selectedBureau = null;
        this.selectedCreditor = null;
        this.selectedReport = null;
        
        // Available report files (this would typically come from a server)
        this.availableReports = [];
        
        // Bureau and creditor mappings
        this.bureauMap = {
            'equifax': 'EQ',
            'experian': 'EX',
            'transunion': 'TU'
        };
        
        // Initialize event listeners
        this.init();
    }
    
    init() {
        // Monitor bureau selection
        const bureauRadios = document.querySelectorAll('input[name="tagger-bureau"]');
        bureauRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleBureauChange(e));
        });
        
        // Monitor creditor selection
        const creditorRadios = document.querySelectorAll('input[name="tagger-creditor"]');
        creditorRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleCreditorChange(e));
        });
    }
    
    handleBureauChange(event) {
        this.selectedBureau = event.target.value;
        this.checkBothSelected();
    }
    
    handleCreditorChange(event) {
        this.selectedCreditor = event.target.value;
        this.checkBothSelected();
    }
    
    checkBothSelected() {
        const section2 = document.getElementById('tagger-report-section');
        
        if (this.selectedBureau && this.selectedCreditor) {
            // Both selected - show section 2 and load reports
            this.loadAvailableReports();
            this.showSection2(section2);
        } else {
            // Hide section 2 if either is deselected
            this.hideSection2(section2);
            this.clearReportSelection();
        }
    }
    
    showSection2(section) {
        // First set display to block but keep it invisible
        section.style.display = 'block';
        section.style.opacity = '0';
        section.style.transform = 'translateY(-10px)';
        
        // Force a reflow
        section.offsetHeight;
        
        // Add transition and make visible
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }
    
    hideSection2(section) {
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        section.style.opacity = '0';
        section.style.transform = 'translateY(-10px)';
        
        // Hide completely after transition
        setTimeout(() => {
            if (section.style.opacity === '0') {
                section.style.display = 'none';
            }
        }, 300);
    }
    
    async loadAvailableReports() {
        // Get bureau code
        const bureauCode = this.bureauMap[this.selectedBureau];
        const creditorCode = this.selectedCreditor;
        
        // Pattern to match: {CREDITOR}-{BUREAU}-{DATE}-P{PAGE}.png
        const pattern = `${creditorCode}-${bureauCode}`;
        
        // For now, we'll use a static list of known files
        // In production, this would query the server
        this.availableReports = this.findMatchingReports(pattern);
        
        // Display the report options
        this.displayReportOptions();
    }
    
    findMatchingReports(pattern) {
        // Complete list of available reports
        const allReports = [
            'AL-EQ-2024-04-25-P57.png', 'AL-EQ-2024-04-25-P58.png',
            'AL-EX-2024-04-25-P05.png', 'AL-TU-2024-04-25-P07.png',
            'BB-EQ-2024-04-25-P20.png', 'BB-EX-2024-04-25-P08.png',
            'BB-EX-2024-04-25-P09.png', 'BB-TU-2024-04-25-P14.png',
            'BK-EQ-2024-04-25-P16.png', 'BK-EQ-2024-04-25-P17.png',
            'BK-EX-2024-04-25-P06.png', 'BK-TU-2024-04-25-P10.png',
            'BY-EQ-2024-04-25-P34.png', 'BY-EQ-2024-04-25-P35.png',
            'BY-EX-2024-04-25-P07.png', 'BY-TU-2024-04-25-P12.png',
            'C1-EQ-2024-04-25-P26.png', 'C1-EX-2024-04-25-P11.png',
            'C1-TU-2024-04-25-P17.png', 'C2-EQ-2024-04-25-P28.png',
            'C2-EX-2024-04-25-P12.png', 'C2-TU-2024-04-25-P20.png',
            'CR-EQ-2024-04-25-P18.png', 'CR-EQ-2024-04-25-P19.png',
            'CR-EX-2024-04-25-P16.png', 'CR-EX-2024-04-25-P17.png',
            'CR-TU-2024-04-25-P26.png', 'DB-EQ-2024-04-25-P30.png',
            'DB-EQ-2024-04-25-P31.png', 'DB-EX-2024-04-25-P22.png',
            'DB-TU-2024-04-25-P30.png', 'DL-EQ-2024-04-25-P50.png',
            'DL-EQ-2024-04-25-P51.png', 'DL-EX-2024-04-25-P21.png',
            'DL-EX-2024-04-25-P22.png', 'DL-TU-2024-04-25-P27.png',
            'HD-EQ-2024-04-25-P32.png', 'HD-EQ-2024-04-25-P33.png',
            'HD-EX-2024-04-25-P34.png', 'HD-EX-2024-04-25-P35.png',
            'JP-EQ-2024-04-25-P24.png', 'JP-EX-2024-04-25-P23.png',
            'JP-TU-2024-04-25-P28.png', 'MF-EQ-2024-04-25-P67.png',
            'MF-EX-2024-04-25-P25.png', 'MF-TU-2024-04-25-P31.png',
            'SR-EQ-2024-04-25-P22.png', 'SR-EX-2024-04-25-P31.png',
            'SR-TU-2024-04-25-P34.png'
        ];
        
        return allReports.filter(report => report.startsWith(pattern));
    }
    
    displayReportOptions() {
        const container = document.getElementById('tagger-report-container');
        container.innerHTML = '';
        
        if (this.availableReports.length === 0) {
            container.innerHTML = '<p class="no-reports-message">No reports found for this combination</p>';
            return;
        }
        
        // Group reports by date
        const reportsByDate = {};
        this.availableReports.forEach(report => {
            // Extract date and page from filename
            const match = report.match(/(\d{4}-\d{2}-\d{2})-P(\d+)\.png$/);
            if (match) {
                const date = match[1];
                const page = match[2];
                
                if (!reportsByDate[date]) {
                    reportsByDate[date] = [];
                }
                reportsByDate[date].push({ filename: report, page: page });
            }
        });
        
        // Create selector container
        const selectorsContainer = document.createElement('div');
        selectorsContainer.className = 'tagger-report-selectors';
        
        // Create boxes for each report
        Object.entries(reportsByDate).forEach(([date, pages]) => {
            pages.forEach(pageInfo => {
                const selectorBox = this.createReportSelector(date, pageInfo.page, pageInfo.filename);
                selectorsContainer.appendChild(selectorBox);
            });
        });
        
        container.appendChild(selectorsContainer);
    }
    
    createReportSelector(date, page, filename) {
        const box = document.createElement('div');
        box.className = 'tagger-selector-box report-selector';
        
        const label = document.createElement('label');
        label.className = 'report-selector-label';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'tagger-report';
        input.value = filename;
        input.className = 'custom-radio-input';
        
        const radioButton = document.createElement('span');
        radioButton.className = 'custom-radio-button';
        
        const text = document.createElement('span');
        text.className = 'report-filename-text';
        text.textContent = filename;
        
        label.appendChild(input);
        label.appendChild(radioButton);
        label.appendChild(text);
        box.appendChild(label);
        
        // Add change event listener
        input.addEventListener('change', () => this.handleReportSelection(filename));
        
        return box;
    }
    
    formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    }
    
    handleReportSelection(filename) {
        this.selectedReport = filename;
        this.updateCanvas();
    }
    
    updateCanvas() {
        // Find the tagger canvas image
        const canvasImage = document.querySelector('#tagger-canvas-div .report-image');
        if (canvasImage && this.selectedReport) {
            canvasImage.src = `assets/reports/${this.selectedReport}`;
            canvasImage.alt = `Credit report: ${this.selectedReport}`;
        }
    }
    
    clearReportSelection() {
        this.selectedReport = null;
        const container = document.getElementById('tagger-report-container');
        container.innerHTML = '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VioTaggerDynamic();
});