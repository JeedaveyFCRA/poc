// Quick script to process the CSV file
const fs = require('fs').promises;
const path = require('path');

async function processCSV() {
    try {
        // Read the CSV file
        const csvPath = path.join(__dirname, 'data/violations/ExportedViolations.csv');
        const csvContent = await fs.readFile(csvPath, 'utf8');
        
        // Parse CSV
        const lines = csvContent.trim().split('\n');
        const headers = lines[0].replace(/^\uFEFF/, '').split(','); // Remove BOM if present
        
        const violations = [];
        const byPage = {};
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            
            // Extract data from filename
            const filename = values[0]; // AL-EQ-2024-04-25-P57.png
            const match = filename.match(/^([A-Z]{2})-([A-Z]{2})-(\d{4}-\d{2}-\d{2})-P(\d+)\.png$/);
            
            if (match) {
                const [, creditor, bureau, date, page] = match;
                
                const violation = {
                    id: `vio-${i}`,
                    creditor,
                    bureau,
                    date,
                    page: parseInt(page),
                    severity: values[1] === 'severe' ? 'high' : values[1] === 'serious' ? 'medium' : 'low',
                    description: values[2],
                    codes: values[3],
                    x: parseFloat(values[4]),
                    y: parseFloat(values[5]),
                    width: parseFloat(values[6]), // Use exact CSV value
                    height: parseFloat(values[7]), // Use exact CSV value
                    type: values[2].includes('Bankruptcy') ? 'bankruptcy' : 
                          values[2].includes('Balance') ? 'balance' : 
                          values[2].includes('Credit') ? 'credit' : 'status'
                };
                
                violations.push(violation);
                
                // Group by page
                const pageKey = `${creditor}-${bureau}-${date}-P${String(page).padStart(2, '0')}`;
                if (!byPage[pageKey]) {
                    byPage[pageKey] = [];
                }
                byPage[pageKey].push(violation);
            }
        }
        
        // Create summary
        const summary = {
            total: violations.length,
            byBureau: {},
            byCreditor: {},
            bySeverity: {},
            byType: {}
        };
        
        violations.forEach(v => {
            summary.byBureau[v.bureau] = (summary.byBureau[v.bureau] || 0) + 1;
            summary.byCreditor[v.creditor] = (summary.byCreditor[v.creditor] || 0) + 1;
            summary.bySeverity[v.severity] = (summary.bySeverity[v.severity] || 0) + 1;
            summary.byType[v.type] = (summary.byType[v.type] || 0) + 1;
        });
        
        const processedData = {
            violations,
            byPage,
            summary
        };
        
        // Save to JSON file
        const outputPath = path.join(__dirname, 'data/violations/violations-processed.json');
        await fs.writeFile(outputPath, JSON.stringify(processedData, null, 2));
        
        console.log('✅ Successfully processed', violations.length, 'violations');
        console.log('📄 Output saved to:', outputPath);
        console.log('\nSummary:');
        console.log('By Bureau:', summary.byBureau);
        console.log('By Severity:', summary.bySeverity);
        console.log('Pages with violations:', Object.keys(byPage).length);
        
    } catch (error) {
        console.error('❌ Error processing CSV:', error);
    }
}

// Run the processor
processCSV();