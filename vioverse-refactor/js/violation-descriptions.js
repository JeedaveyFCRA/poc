// Canonical FCRA Violation Descriptions Module
// RULE: These descriptions must ALWAYS be used in full - no truncation, ellipses, or summaries

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
    
    // Date-Related Violations
    DATE_CLOSED_BACKDATED: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Backdated closure to 02/19/2024 conceals that account should have closed on discharge date (02/09/2024) or earlier. Ten-day delay in accurate reporting suggests systematic non-compliance.',
        severity: 'high'
    },
    
    ON_RECORD_UNTIL_IMPROPER: {
        codes: ['§1681e(b)', '§1681c(a)(1)', '§1681c(a)(4)'],
        description: 'Removal date improperly calculated. Must be 7 years from discharge (Feb 2031) or original delinquency date, not arbitrary calculation. Premature removal date suggests automated system never updated for bankruptcy discharge.',
        severity: 'medium'
    },
    
    ON_RECORD_UNTIL_OCT_2025: {
        codes: ['§1681e(b)', '§1681c(a)(1)', '§1681c(a)(4)'],
        description: 'Removal date of Oct 2025 violates 7-year rule. Cannot predate Feb 2031 (7 years from discharge) unless original delinquency justifies earlier removal. Arbitrary date selection indicates flawed procedures.',
        severity: 'medium'
    },
    
    // Balance and Credit Limit Violations
    BALANCE_DASH: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Balance field blank or missing after discharge. Should reflect $0 or clearly state "Discharged" to comply with post-bankruptcy accuracy obligations.',
        severity: 'medium'
    },
    
    BALANCE_UPDATED_MISSING: {
        codes: ['§1681s-2(a)(8)', '§1681e(b)', '§1681c(a)(4)'],
        description: 'Absence of balance update date violates affirmative duty to mark accounts as updated following bankruptcy events. This omission prevents dispute verification.',
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
    },
    
    HIGH_BALANCE_MISLEADING: {
        codes: ['§1681s-2(a)(1)(A)'],
        description: 'Misrepresents ongoing liability after discharge.',
        severity: 'high'
    },
    
    HIGHEST_BALANCE_MISSING: {
        codes: ['§1681e(b)'],
        description: 'Historical high balance missing. While less critical individually, absence of this data contributes to overall pattern of incomplete or abandoned reporting.',
        severity: 'low'
    },
    
    // Payment-Related Violations
    RECENT_PAYMENT_MISSING: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Payment history not shown. Post-discharge accounts should show last valid pre-bankruptcy activity or display "N/A" if obligation was discharged.',
        severity: 'low'
    },
    
    MONTHLY_PAYMENT_BLANK: {
        codes: ['§1681e(b)'],
        description: 'Monthly payment field blank. For discharged debts, this should either be $0 or omitted entirely to prevent misleading payment expectations.',
        severity: 'low'
    },
    
    PAYMENT_HISTORY_FROZEN: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Payment history indicators frozen at pre-discharge delinquencies. Post-discharge accounts must show \'D\' (discharged) or remove derogatory markers.',
        severity: 'medium'
    },
    
    // Systemic Violations
    DISCHARGED_BUT_INCOMPLETE: {
        codes: ['§1681s-2(a)(1)(A)', '§1681c(a)(4)', '§1681e(b)'],
        description: 'While status field shows \'Discharged,\' accuracy requires ALL fields (balance, dates, payment history) to align with discharged status. Partial compliance creates misleading credit picture.',
        severity: 'medium'
    },
    
    SYSTEMATIC_BLANK_FIELDS: {
        codes: ['§1681s-2(a)(2)', '§1681e(b)', '§1681n'],
        description: 'Multiple blank fields (\'-\') across data points indicates willful failure to maintain complete records.',
        severity: 'high'
    },
    
    CROSS_BUREAU_INCONSISTENCY: {
        codes: ['§1681s-2(a)(1)(B)', '§1681e(b)'],
        description: 'Same creditor reports different information to each bureau, proving absence of reasonable procedures.',
        severity: 'high'
    },
    
    // Additional Universal Violations
    ACCOUNT_TYPE_MISCLASSIFICATION: {
        codes: ['§1681s-2(a)(1)(A)', '§1681e(b)'],
        description: 'Account type shows \'Open\' or \'Active\' despite discharge. Must reflect \'Closed\' or special bankruptcy status code.',
        severity: 'medium'
    },
    
    MISSING_DISPUTE_FLAG: {
        codes: ['§1681s-2(a)(8)(D)'],
        description: 'No dispute notation despite bankruptcy discharge constituting automatic dispute trigger under FCRA.',
        severity: 'medium'
    }
};

// Helper function to get full violation text by key
function getViolationDescription(key) {
    const violation = ViolationDescriptions[key];
    if (!violation) {
        console.error(`Violation key '${key}' not found. Full description required.`);
        return null;
    }
    
    return {
        codes: violation.codes.join(', '),
        description: violation.description,
        severity: violation.severity
    };
}

// Helper function to format violation for display
function formatViolation(key) {
    const violation = getViolationDescription(key);
    if (!violation) return '';
    
    return `**${violation.codes}**\n${violation.description}`;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ViolationDescriptions, getViolationDescription, formatViolation };
}