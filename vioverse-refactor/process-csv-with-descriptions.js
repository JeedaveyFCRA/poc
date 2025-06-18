// Enhanced CSV processor that maps short labels to full descriptions
const fs = require('fs').promises;
const path = require('path');

// Import violation descriptions (inline since we can't use ES6 imports in Node directly)
const ViolationDescriptions = {
    // Primary Critical Violations
    INCLUDED_IN_CHAPTER_13: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)', '§1681n'],
        description: 'CRITICAL VIOLATION: Account shows active Chapter 13 inclusion AFTER February 9, 2024 discharge. This is categorically false—akin to reporting someone as \'currently deceased\' when alive. Per se willful violation.',
        severity: 'high'
    },
    
    ZERO_BALANCE_CONTRADICTION: {
        codes: ['§1681e(b)', '§1681s-2(a)(1)(A)'],
        description: 'Zero balance contradicts \'INCLUDED_IN_CHAPTER_13\' status. Account cannot simultaneously be in active bankruptcy AND have no balance. Internal inconsistency proves absence of reasonable procedures.',
        severity: 'high'
    },
    
    DATE_UPDATED_POST_DISCHARGE: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)', '§1681n'],
        description: 'Creditor updated account 10 days after February 9, 2024 discharge but perpetuated false bankruptcy status, demonstrating actual knowledge of discharge while maintaining inaccurate information—textbook willful violation.',
        severity: 'high'
    },
    
    // Stale Update Violations
    FIVE_YEAR_STALE: {
        codes: ['§1681c(a)(4)', '§1681e(b)', '§1681s-2(a)(8)', '§1681n'],
        description: 'Last update coincides with bankruptcy FILING date over 5 years ago. Zero updates through confirmation, payments, and discharge proves complete abandonment of FCRA duties. Willfulness presumed from extreme duration.',
        severity: 'high'
    },
    
    STATUS_FROZEN_2018: {
        codes: ['§1681c(a)(4)', '§1681s-2(a)(1)(A)', '§1681n'],
        description: 'Status frozen at October 2018—over 5 YEARS before February 9, 2024 discharge. This extreme staleness transcends negligence; abandonment of update duties for half a decade constitutes willful disregard.',
        severity: 'high'
    },
    
    // Status Field Violations
    ACCOUNT_INCLUDED_BANKRUPTCY: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)', '§1681c(a)(1)'],
        description: 'Account falsely maintains active bankruptcy status 10+ days after February 9, 2024 discharge. Legal status requires \'Discharged through Chapter 13\' or \'Closed.\' This categorical falsehood misleads creditors and violates mandatory post-discharge update requirements.',
        severity: 'high'
    },
    
    BANKRUPTCY_CHAPTER_13_REMARK: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Bankruptcy remark remained unchanged after discharge. Must be updated to reflect \'Discharged through Chapter 13\' or removed entirely.',
        severity: 'medium'
    },
    
    BANKRUPTCY_FIELD_VAGUE: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Field references bankruptcy but omits \'Discharged\' or closing context. Misleads users about current legal status of account.',
        severity: 'medium'
    },
    
    BANKRUPTCY_COMPLETED_VAGUE: {
        codes: ['§1681e(b)'],
        description: 'Must specify \'Discharged February 9, 2024\' not merely \'Completed.\' Vague terminology regarding bankruptcy status violates clarity requirements.',
        severity: 'medium'
    },
    
    // Balance and Credit Limit Violations
    BALANCE_DASH: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Balance field blank or missing after discharge. Should reflect $0 or clearly state "Discharged" to comply with post-bankruptcy accuracy obligations.',
        severity: 'medium'
    },
    
    AVAILABLE_CREDIT_MISSING: {
        codes: ['§1681e(b)', '§1681s-2(a)(1)(A)'],
        description: 'Available credit missing or inaccurate. For discharged revolving accounts, this field should show $0 or be removed entirely.',
        severity: 'low'
    },
    
    HIGH_CREDIT_MISSING: {
        codes: ['§1681e(b)'],
        description: 'High credit value missing or not accurately retained. Weakens completeness and consistency of the credit file.',
        severity: 'low'
    },
    
    CREDIT_LIMIT_INACCURATE: {
        codes: ['§1681e(b)', '§1681s-2(a)(1)(A)'],
        description: 'Credit limit inaccurate or absent. Post-discharge accounts should show limit as $0 or marked closed.',
        severity: 'low'
    }
};

// Map CSV labels to violation description keys
const labelToViolationKey = {
    'Account Status: INCLUDED_IN_CHAPTER_13': 'INCLUDED_IN_CHAPTER_13',
    'Reported Balance: $0': 'ZERO_BALANCE_CONTRADICTION',
    'Balance: $0': 'ZERO_BALANCE_CONTRADICTION',
    'Available Credit': 'AVAILABLE_CREDIT_MISSING',
    'High Credit': 'HIGH_CREDIT_MISSING',
    'Credit Limit': 'CREDIT_LIMIT_INACCURATE',
    'Date Reported: Oct 25 2018': 'STATUS_FROZEN_2018',
    'Bankruptcy Chapter 13': 'BANKRUPTCY_CHAPTER_13_REMARK',
    'Bankruptcy Completed': 'BANKRUPTCY_COMPLETED_VAGUE'
};

async function processCSVWithDescriptions() {
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
                const csvLabel = values[2]; // The short label from CSV
                
                // Map the CSV label to a full violation description
                const violationKey = labelToViolationKey[csvLabel];
                let fullDescription = csvLabel; // Default to CSV label if no mapping found
                let mappedCodes = values[3]; // Default to CSV codes
                
                if (violationKey && ViolationDescriptions[violationKey]) {
                    const violationData = ViolationDescriptions[violationKey];
                    fullDescription = violationData.description;
                    // Use the canonical codes from ViolationDescriptions
                    mappedCodes = violationData.codes.join(', ');
                } else {
                    console.warn(`No mapping found for label: "${csvLabel}"`);
                }
                
                const violation = {
                    id: `vio-${i}`,
                    creditor,
                    bureau,
                    date,
                    page: parseInt(page),
                    severity: values[1] === 'severe' ? 'high' : values[1] === 'serious' ? 'medium' : 'low',
                    description: fullDescription, // Use the full description
                    codes: mappedCodes, // Use the mapped codes
                    x: parseFloat(values[4]),
                    y: parseFloat(values[5]),
                    width: parseFloat(values[6]),
                    height: parseFloat(values[7]),
                    type: csvLabel.includes('Bankruptcy') ? 'bankruptcy' : 
                          csvLabel.includes('Balance') ? 'balance' : 
                          csvLabel.includes('Credit') ? 'credit' : 'status',
                    originalLabel: csvLabel // Keep original for reference
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
        
        console.log('✅ Successfully processed', violations.length, 'violations with full descriptions');
        console.log('📄 Output saved to:', outputPath);
        console.log('\nSummary:');
        console.log('By Bureau:', summary.byBureau);
        console.log('By Severity:', summary.bySeverity);
        console.log('Pages with violations:', Object.keys(byPage).length);
        
        // Show sample of mapped descriptions
        console.log('\nSample mappings:');
        violations.slice(0, 3).forEach(v => {
            console.log(`- "${v.originalLabel}" → "${v.description.substring(0, 60)}..."`);
        });
        
    } catch (error) {
        console.error('❌ Error processing CSV:', error);
    }
}

// Run the processor
processCSVWithDescriptions();