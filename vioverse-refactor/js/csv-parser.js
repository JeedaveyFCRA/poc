/**
 * CSV Parser for VioVerse Violations
 * Converts ExportedViolations.csv to JSON format with coordinate adjustments
 */

class ViolationsCSVParser {
    constructor() {
        this.adjustments = null;
        this.violations = [];
    }

    async loadAdjustments() {
        try {
            const response = await fetch('data/violations/coordinate-adjustments.json');
            this.adjustments = await response.json();
        } catch (error) {
            console.error('Failed to load coordinate adjustments:', error);
            // Use defaults if file not found
            this.adjustments = {
                global: { offsetX: 0, offsetY: 0, scaleX: 1.0, scaleY: 1.0 },
                perPage: {},
                violationBoxDefaults: {
                    borderWidth: 2,
                    borderRadius: 13,
                    widthPadding: 1.1,
                    heightPadding: 1.1
                }
            };
        }
    }

    async parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = this.parseCSVLine(lines[0]);
        
        const violations = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const violation = {};
                headers.forEach((header, index) => {
                    violation[header] = values[index];
                });
                violations.push(violation);
            }
        }
        
        return violations;
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }

    transformViolation(csvRow) {
        // Extract report info from various possible CSV formats
        // This is flexible to handle different column names
        
        const violation = {
            id: csvRow.id || csvRow.ID || Math.random().toString(36).substr(2, 9),
            creditor: csvRow.creditor || csvRow.Creditor || this.extractCreditor(csvRow),
            bureau: csvRow.bureau || csvRow.Bureau || this.extractBureau(csvRow),
            date: csvRow.date || csvRow.Date || this.extractDate(csvRow),
            page: parseInt(csvRow.page || csvRow.Page || this.extractPage(csvRow)),
            x: parseFloat(csvRow.x || csvRow.X || csvRow.left || csvRow.Left || 0),
            y: parseFloat(csvRow.y || csvRow.Y || csvRow.top || csvRow.Top || 0),
            width: parseFloat(csvRow.width || csvRow.Width || csvRow.w || csvRow.W || 557),
            height: parseFloat(csvRow.height || csvRow.Height || csvRow.h || csvRow.H || 26),
            severity: csvRow.severity || csvRow.Severity || this.determineSeverity(csvRow),
            type: csvRow.type || csvRow.Type || csvRow.violationType || 'general',
            description: csvRow.description || csvRow.Description || csvRow.text || ''
        };

        // Apply coordinate adjustments
        return this.applyAdjustments(violation);
    }

    extractCreditor(row) {
        // Try to extract from filename or other fields
        const filename = row.filename || row.Filename || row.file || '';
        const match = filename.match(/^([A-Z]{2})-/);
        return match ? match[1] : 'UN';
    }

    extractBureau(row) {
        const filename = row.filename || row.Filename || row.file || '';
        const match = filename.match(/^[A-Z]{2}-([A-Z]{2})-/);
        return match ? match[1] : 'EQ';
    }

    extractDate(row) {
        const filename = row.filename || row.Filename || row.file || '';
        const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : '2024-04-25';
    }

    extractPage(row) {
        const filename = row.filename || row.Filename || row.file || '';
        const match = filename.match(/P(\d+)/);
        return match ? match[1] : '1';
    }

    determineSeverity(row) {
        // Logic to determine severity from various possible fields
        const severity = (row.severity || row.Severity || '').toLowerCase();
        if (severity.includes('high') || severity.includes('critical')) return 'high';
        if (severity.includes('medium') || severity.includes('moderate')) return 'medium';
        if (severity.includes('low') || severity.includes('minor')) return 'low';
        
        // Check violation type for severity hints
        const type = (row.type || row.Type || '').toLowerCase();
        if (type.includes('bankruptcy') || type.includes('fraud')) return 'high';
        if (type.includes('balance') || type.includes('date')) return 'medium';
        
        return 'low';
    }

    applyAdjustments(violation) {
        const global = this.adjustments.global;
        const pageKey = `${violation.creditor}-${violation.bureau}-${violation.date}-P${violation.page}`;
        const pageAdjust = this.adjustments.perPage[pageKey] || { offsetX: 0, offsetY: 0 };
        
        // Apply global and page-specific adjustments
        violation.x = (violation.x * global.scaleX) + global.offsetX + pageAdjust.offsetX;
        violation.y = (violation.y * global.scaleY) + global.offsetY + pageAdjust.offsetY;
        violation.width = violation.width * global.scaleX;
        violation.height = violation.height * global.scaleY;
        
        // Apply padding to make boxes slightly larger (10% default)
        const defaults = this.adjustments.violationBoxDefaults;
        violation.width = violation.width * defaults.widthPadding;
        violation.height = violation.height * defaults.heightPadding;
        
        return violation;
    }

    async processCSVFile(csvText) {
        await this.loadAdjustments();
        const rawViolations = await this.parseCSV(csvText);
        const processedViolations = rawViolations.map(row => this.transformViolation(row));
        
        // Group by report page
        const groupedViolations = {};
        processedViolations.forEach(violation => {
            const key = `${violation.creditor}-${violation.bureau}-${violation.date}-P${String(violation.page).padStart(2, '0')}`;
            if (!groupedViolations[key]) {
                groupedViolations[key] = [];
            }
            groupedViolations[key].push(violation);
        });
        
        return {
            violations: processedViolations,
            byPage: groupedViolations,
            summary: {
                total: processedViolations.length,
                byBureau: this.countByField(processedViolations, 'bureau'),
                byCreditor: this.countByField(processedViolations, 'creditor'),
                bySeverity: this.countByField(processedViolations, 'severity'),
                byType: this.countByField(processedViolations, 'type')
            }
        };
    }

    countByField(violations, field) {
        const counts = {};
        violations.forEach(v => {
            const value = v[field];
            counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
    }

    // Save processed violations to JSON
    async saveProcessedViolations(processedData) {
        // In a real implementation, this would save to server
        // For now, we'll store in localStorage
        localStorage.setItem('vioverse-violations', JSON.stringify(processedData));
        console.log('Violations saved to localStorage');
        return processedData;
    }
}

// Export for use in main application
window.ViolationsCSVParser = ViolationsCSVParser;