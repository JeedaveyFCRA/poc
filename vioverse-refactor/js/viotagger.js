/**
 * VioTagger Module
 * Handles drawing and tagging violations on credit report images
 */

class VioTagger {
    constructor(vioverse) {
        this.vioverse = vioverse;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'select';
        this.currentSeverity = 'high';
        this.startX = 0;
        this.startY = 0;
        this.tempViolation = null;
        this.selectedViolation = null;
        
        // Initialize when VioTagger view is first activated
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        this.canvas = document.getElementById('tagger-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.loadExistingViolations();
        this.initialized = true;
    }
    
    setupEventListeners() {
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTool(e.currentTarget.dataset.tool);
            });
        });
        
        // Severity buttons
        document.querySelectorAll('.severity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setSeverity(e.currentTarget.dataset.severity);
            });
        });
        
        // Save button
        const saveBtn = document.querySelector('.save-violation-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveViolation());
        }
        
        // Canvas drawing events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        
        // Navigation events for tagger view
        const taggerNav = document.querySelector('.tagger-nav-bar');
        if (taggerNav) {
            taggerNav.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.currentTarget.dataset.nav;
                    if (action === 'prev-page') {
                        this.vioverse.navigatePage(-1);
                        this.updateTaggerPage();
                    } else if (action === 'next-page') {
                        this.vioverse.navigatePage(1);
                        this.updateTaggerPage();
                    }
                });
            });
            
            const pageInput = taggerNav.querySelector('.tagger-page-input');
            if (pageInput) {
                pageInput.addEventListener('change', (e) => {
                    const newPage = parseInt(e.target.value);
                    if (newPage >= 1 && newPage <= this.vioverse.totalPages) {
                        this.vioverse.currentPage = newPage;
                        this.vioverse.updateCurrentImage();
                        this.updateTaggerPage();
                    }
                });
            }
        }
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        // Update button states
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        
        // Update canvas cursor
        this.canvas.classList.remove('drawing', 'selecting', 'deleting');
        if (tool === 'draw') {
            this.canvas.classList.add('drawing');
        } else if (tool === 'select') {
            this.canvas.classList.add('selecting');
        } else if (tool === 'delete') {
            this.canvas.classList.add('deleting');
        }
        
        // Re-render icons
        lucide.createIcons();
    }
    
    setSeverity(severity) {
        this.currentSeverity = severity;
        
        // Update button states
        document.querySelectorAll('.severity-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.severity === severity);
        });
        
        // Re-render icons
        lucide.createIcons();
    }
    
    handleMouseDown(e) {
        if (this.currentTool !== 'draw') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        this.startX = (e.clientX - rect.left) * scaleX;
        this.startY = (e.clientY - rect.top) * scaleY;
        this.isDrawing = true;
    }
    
    handleMouseMove(e) {
        if (!this.isDrawing || this.currentTool !== 'draw') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;
        
        // Clear canvas and redraw
        this.clearCanvas();
        this.drawExistingViolations();
        
        // Draw current rectangle
        this.ctx.strokeStyle = this.getSeverityColor(this.currentSeverity);
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.startX,
            this.startY,
            currentX - this.startX,
            currentY - this.startY
        );
    }
    
    handleMouseUp(e) {
        if (!this.isDrawing || this.currentTool !== 'draw') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const endX = (e.clientX - rect.left) * scaleX;
        const endY = (e.clientY - rect.top) * scaleY;
        
        // Calculate rectangle bounds
        const x = Math.min(this.startX, endX);
        const y = Math.min(this.startY, endY);
        const width = Math.abs(endX - this.startX);
        const height = Math.abs(endY - this.startY);
        
        // Only create violation if rectangle has meaningful size
        if (width > 10 && height > 10) {
            this.tempViolation = {
                x: Math.round(x),
                y: Math.round(y),
                width: Math.round(width),
                height: Math.round(height),
                severity: this.currentSeverity,
                creditor: this.vioverse.currentCreditor,
                bureau: this.vioverse.currentBureau,
                date: this.vioverse.reportDate,
                page: this.vioverse.currentPage
            };
            
            // Highlight the save button
            const saveBtn = document.querySelector('.save-violation-btn');
            if (saveBtn) {
                saveBtn.style.animation = 'pulse 1s infinite';
            }
        }
        
        this.isDrawing = false;
    }
    
    handleMouseLeave(e) {
        if (this.isDrawing) {
            this.handleMouseUp(e);
        }
    }
    
    saveViolation() {
        if (!this.tempViolation) return;
        
        const labelInput = document.querySelector('.violation-label-input');
        const codesInput = document.querySelector('.violation-codes-input');
        
        const label = labelInput.value.trim();
        const codes = codesInput.value.trim();
        
        if (!label) {
            alert('Please enter a violation label');
            return;
        }
        
        // Create complete violation object
        const violation = {
            ...this.tempViolation,
            id: `vio-${Date.now()}`,
            label: label,
            codes: codes,
            description: label, // Use label as description
            mode: 'viotagger',
            syncedAt: new Date().toISOString()
        };
        
        // Convert from 1920x1080 to 810x920 coordinates for storage
        const reportCoords = this.vioverse.canvasSync.viotaggerToReportViewer({
            x: violation.x,
            y: violation.y,
            width: violation.width,
            height: violation.height
        });
        
        // Store with report viewer coordinates
        violation.x = reportCoords.x;
        violation.y = reportCoords.y;
        violation.width = reportCoords.width;
        violation.height = reportCoords.height;
        
        // Add to violations data
        if (!this.vioverse.violationsData) {
            this.vioverse.violationsData = { violations: [] };
        }
        this.vioverse.violationsData.violations.push(violation);
        
        // Clear inputs and temp violation
        labelInput.value = '';
        codesInput.value = '';
        this.tempViolation = null;
        
        // Remove save button animation
        const saveBtn = document.querySelector('.save-violation-btn');
        if (saveBtn) {
            saveBtn.style.animation = '';
        }
        
        // Clear canvas and reload
        this.clearCanvas();
        this.loadExistingViolations();
        
        // Update report view violations
        this.vioverse.renderViolations();
        
        // Show success message
        this.vioverse.announce('Violation saved successfully');
    }
    
    loadExistingViolations() {
        if (!this.vioverse.violationsData || !this.vioverse.violationsData.violations) return;
        
        const container = document.querySelector('.tagger-viobox-container');
        if (!container) return;
        
        // Clear existing
        container.innerHTML = '';
        
        // Filter violations for current page
        const violations = this.vioverse.violationsData.violations.filter(v => 
            v.creditor === this.vioverse.currentCreditor &&
            v.bureau === this.vioverse.currentBureau &&
            v.date === this.vioverse.reportDate &&
            v.page === this.vioverse.currentPage
        );
        
        // Draw each violation
        violations.forEach(violation => {
            // Convert from report viewer to tagger coordinates
            const taggerCoords = this.vioverse.canvasSync.reportViewerToViotagger({
                x: violation.x,
                y: violation.y,
                width: violation.width,
                height: violation.height
            });
            
            // Create viobox element
            const viobox = document.createElement('div');
            viobox.className = `viobox ${violation.severity}`;
            viobox.style.position = 'absolute';
            viobox.style.left = `${taggerCoords.x}px`;
            viobox.style.top = `${taggerCoords.y}px`;
            viobox.style.width = `${taggerCoords.width}px`;
            viobox.style.height = `${taggerCoords.height}px`;
            viobox.style.pointerEvents = 'auto';
            viobox.dataset.violationId = violation.id;
            
            // Add click handler for selection/deletion
            viobox.addEventListener('click', () => {
                if (this.currentTool === 'delete') {
                    this.deleteViolation(violation.id);
                } else if (this.currentTool === 'select') {
                    this.selectViolation(violation);
                }
            });
            
            container.appendChild(viobox);
        });
    }
    
    deleteViolation(violationId) {
        if (!confirm('Are you sure you want to delete this violation?')) return;
        
        // Remove from data
        const index = this.vioverse.violationsData.violations.findIndex(v => v.id === violationId);
        if (index !== -1) {
            this.vioverse.violationsData.violations.splice(index, 1);
        }
        
        // Reload displays
        this.loadExistingViolations();
        this.vioverse.renderViolations();
        
        this.vioverse.announce('Violation deleted');
    }
    
    selectViolation(violation) {
        this.selectedViolation = violation;
        
        // Populate input fields
        const labelInput = document.querySelector('.violation-label-input');
        const codesInput = document.querySelector('.violation-codes-input');
        
        if (labelInput) labelInput.value = violation.label || violation.description || '';
        if (codesInput) codesInput.value = violation.codes || '';
        
        // Highlight selected viobox
        document.querySelectorAll('.tagger-viobox-container .viobox').forEach(box => {
            box.classList.toggle('selected', box.dataset.violationId === violation.id);
        });
    }
    
    updateTaggerPage() {
        // Update page input
        const pageInput = document.querySelector('.tagger-page-input');
        if (pageInput) {
            pageInput.value = this.vioverse.currentPage;
        }
        
        // Update image
        const img = document.querySelector('.tagger-report-image');
        if (img) {
            const paddedPage = this.vioverse.currentPage < 10 ? 
                String(this.vioverse.currentPage).padStart(2, '0') : 
                String(this.vioverse.currentPage);
            const filename = `assets/reports/${this.vioverse.currentCreditor}-${this.vioverse.currentBureau}-${this.vioverse.reportDate}-P${paddedPage}.png`;
            img.src = filename;
        }
        
        // Clear canvas and reload violations
        this.clearCanvas();
        this.loadExistingViolations();
    }
    
    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    drawExistingViolations() {
        // This method would draw violations on the canvas if needed
        // Currently we're using DOM elements for violations
    }
    
    getSeverityColor(severity) {
        const colors = {
            high: '#ED1C24',
            medium: '#F26419',
            low: '#F7931E'
        };
        return colors[severity] || colors.high;
    }
}

// Add styles for pulse animation
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(242, 100, 25, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(242, 100, 25, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(242, 100, 25, 0);
    }
}

.tagger-viobox-container .viobox {
    cursor: pointer;
    transition: all 200ms ease;
}

.tagger-viobox-container .viobox:hover {
    opacity: 0.8;
}

.tagger-viobox-container .viobox.selected {
    box-shadow: 0 0 0 3px #F26419;
}
`;
document.head.appendChild(style);