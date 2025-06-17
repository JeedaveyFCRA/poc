// Case Timeline Interactive Functionality

class CaseTimeline {
    constructor() {
        this.phases = document.querySelectorAll('.timeline-phase');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.timelineContainer = document.querySelector('.timeline-container');
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.initializePhaseInteraction();
        this.loadTimelineData();
    }

    attachEventListeners() {
        // Navigation button handlers
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleNavAction(action);
            });
        });

        // Phase header click to toggle
        document.querySelectorAll('.phase-header').forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const phase = header.closest('.timeline-phase');
                this.togglePhase(phase);
            });
        });

        // Event hover effects
        document.querySelectorAll('.event').forEach(event => {
            event.addEventListener('mouseenter', () => this.highlightEvent(event));
            event.addEventListener('mouseleave', () => this.unhighlightEvent(event));
        });
    }

    initializePhaseInteraction() {
        // Add interactive indicators
        this.phases.forEach(phase => {
            const header = phase.querySelector('.phase-header');
            const indicator = document.createElement('span');
            indicator.className = 'phase-toggle-indicator';
            indicator.textContent = '▼';
            indicator.style.cssText = 'float: right; transition: transform 0.3s;';
            header.appendChild(indicator);
        });
    }

    handleNavAction(action) {
        switch(action) {
            case 'collapse-all':
                this.collapseAll();
                break;
            case 'expand-all':
                this.expandAll();
                break;
            case 'show-violations':
                this.filterByType('violations');
                break;
            case 'show-denials':
                this.filterByType('denials');
                break;
            case 'export-timeline':
                this.exportTimeline();
                break;
        }
    }

    togglePhase(phase) {
        const isCollapsed = phase.classList.contains('collapsed');
        const indicator = phase.querySelector('.phase-toggle-indicator');
        
        if (isCollapsed) {
            phase.classList.remove('collapsed');
            indicator.style.transform = 'rotate(0deg)';
        } else {
            phase.classList.add('collapsed');
            indicator.style.transform = 'rotate(-90deg)';
        }
    }

    collapseAll() {
        this.phases.forEach(phase => {
            phase.classList.add('collapsed');
            const indicator = phase.querySelector('.phase-toggle-indicator');
            if (indicator) indicator.style.transform = 'rotate(-90deg)';
        });
    }

    expandAll() {
        this.phases.forEach(phase => {
            phase.classList.remove('collapsed');
            const indicator = phase.querySelector('.phase-toggle-indicator');
            if (indicator) indicator.style.transform = 'rotate(0deg)';
        });
        this.timelineContainer.classList.remove('filter-violations', 'filter-denials');
    }

    filterByType(type) {
        this.expandAll();
        this.timelineContainer.classList.remove('filter-violations', 'filter-denials');
        
        if (type === 'violations') {
            this.timelineContainer.classList.add('filter-violations');
        } else if (type === 'denials') {
            this.timelineContainer.classList.add('filter-denials');
        }
    }

    highlightEvent(event) {
        // Find related events
        const date = event.dataset.date;
        if (date) {
            document.querySelectorAll(`[data-date="${date}"]`).forEach(related => {
                if (related !== event) {
                    related.style.boxShadow = '0 4px 20px rgba(78, 205, 196, 0.4)';
                }
            });
        }
    }

    unhighlightEvent(event) {
        const date = event.dataset.date;
        if (date) {
            document.querySelectorAll(`[data-date="${date}"]`).forEach(related => {
                if (related !== event) {
                    related.style.boxShadow = '';
                }
            });
        }
    }

    exportTimeline() {
        const timelineData = this.gatherTimelineData();
        const exportData = {
            case: 'David Marra v. Credit Bureaus',
            generated: new Date().toISOString(),
            summary: {
                duration: '405+ days',
                falseBalances: '$52,604',
                denials: 5,
                annualHarm: '$12,000+',
                creditors: 13,
                violations: this.countViolations()
            },
            timeline: timelineData
        };

        // Create and download JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fcra-case-timeline-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success message
        this.showNotification('Timeline exported successfully!');
    }

    gatherTimelineData() {
        const timelineData = [];
        
        this.phases.forEach(phase => {
            const phaseData = {
                phase: phase.dataset.phase,
                title: phase.querySelector('.phase-header h2').textContent,
                dates: phase.querySelector('.phase-dates').textContent,
                events: []
            };

            phase.querySelectorAll('.event').forEach(event => {
                const eventData = {
                    date: event.querySelector('.event-date')?.textContent || '',
                    title: event.querySelector('h3')?.textContent || '',
                    description: Array.from(event.querySelectorAll('p')).map(p => p.textContent),
                    type: this.getEventType(event),
                    violations: Array.from(event.querySelectorAll('.violation-code')).map(v => v.textContent),
                    evidence: Array.from(event.querySelectorAll('.evidence-ref')).map(e => e.textContent)
                };
                
                phaseData.events.push(eventData);
            });

            timelineData.push(phaseData);
        });

        return timelineData;
    }

    getEventType(event) {
        if (event.classList.contains('critical')) return 'critical';
        if (event.classList.contains('warning')) return 'warning';
        if (event.classList.contains('violation')) return 'violation';
        if (event.classList.contains('denial')) return 'denial';
        if (event.classList.contains('pattern')) return 'pattern';
        if (event.classList.contains('resolution')) return 'resolution';
        if (event.classList.contains('ongoing')) return 'ongoing';
        return 'standard';
    }

    countViolations() {
        return document.querySelectorAll('.violation-code').length;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'timeline-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27AE60;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    loadTimelineData() {
        // Calculate days since discharge
        const dischargeDate = new Date('2024-02-09');
        const today = new Date();
        const daysSince = Math.floor((today - dischargeDate) / (1000 * 60 * 60 * 24));
        
        // Update dynamic values
        document.querySelectorAll('.stat-value').forEach(stat => {
            if (stat.textContent.includes('405+')) {
                stat.textContent = `${daysSince}+ Days`;
            }
        });

        // Add dynamic tooltips
        this.addTooltips();
    }

    addTooltips() {
        // Add tooltips to violation codes
        document.querySelectorAll('.violation-code').forEach(code => {
            code.style.cursor = 'help';
            code.title = this.getViolationDescription(code.textContent);
        });

        // Add tooltips to evidence references
        document.querySelectorAll('.evidence-ref').forEach(ref => {
            ref.style.cursor = 'help';
            ref.title = 'Click to view supporting documentation';
        });
    }

    getViolationDescription(code) {
        const violations = {
            '§1681s-2(a)(1)(A)': 'Furnisher duty to provide accurate information to CRAs',
            '§1681e(b)': 'CRA duty to follow reasonable procedures to ensure maximum possible accuracy',
            '§1681n': 'Willful noncompliance with FCRA requirements',
            '§1681c(a)(4)': 'Prohibition on reporting obsolete information',
            '§1681i(a)': 'Duty to conduct reinvestigation of disputed information',
            '§1681c(f)': 'Restrictions on medical debt reporting'
        };
        
        return violations[code] || 'Fair Credit Reporting Act violation';
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .phase-content {
        transition: all 0.3s ease-out;
    }
    
    .collapsed .phase-content {
        opacity: 0;
        max-height: 0;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CaseTimeline();
});