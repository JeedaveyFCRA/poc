# Final FCRA Violation Descriptions for VioTagger System
## Post-Audit Version - Ready for Implementation

---

## 🔵 TransUnion Violations

### Date Updated: 02/19/2024
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b), §1681n  
**Description:** Creditor updated account 10 days after February 9, 2024 discharge but perpetuated false bankruptcy status, demonstrating actual knowledge of discharge while maintaining inaccurate information—textbook willful violation.  
**Classification:** WILLFUL

### Pay Status: "Account Included in Bankruptcy"
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b), §1681c(a)(1)  
**Description:** Account falsely maintains active bankruptcy status 10+ days after February 9, 2024 discharge. Legal status requires 'Discharged through Chapter 13' or 'Closed.' This categorical falsehood misleads creditors and violates mandatory post-discharge update requirements.  
**Classification:** WILLFUL

### Date Closed: 02/19/2024
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b)  
**Description:** Backdated closure to 02/19/2024 conceals that account should have closed on discharge date (02/09/2024) or earlier. Ten-day delay in accurate reporting suggests systematic non-compliance.  
**Classification:** NEGLIGENT to WILLFUL

### Remarks: CHAPTER 13 BANKRUPTCY
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b)  
**Description:** Bankruptcy remark remained unchanged after discharge. Must be updated to reflect 'Discharged through Chapter 13' or removed entirely.  
**Classification:** NEGLIGENT

### On Record Until: 09/2025
**FCRA Codes:** §1681e(b), §1681c(a)(1), §1681c(a)(4)  
**Description:** Removal date improperly calculated. Must be 7 years from discharge (Feb 2031) or original delinquency date, not arbitrary calculation. Premature removal date suggests automated system never updated for bankruptcy discharge.  
**Classification:** NEGLIGENT

---

## 🟠 Experian Violations

### Status: Discharged through Bankruptcy Chapter 13
**FCRA Codes:** §1681s-2(a)(1)(A), §1681c(a)(4), §1681e(b)  
**Description:** While status field shows 'Discharged,' accuracy requires ALL fields (balance, dates, payment history) to align with discharged status. Partial compliance creates misleading credit picture.  
**Classification:** NEGLIGENT

### Status Updated: Oct 2018
**FCRA Codes:** §1681c(a)(4), §1681s-2(a)(1)(A), §1681n  
**Description:** Status frozen at October 2018—over 5 YEARS before February 9, 2024 discharge. This extreme staleness transcends negligence; abandonment of update duties for half a decade constitutes willful disregard.  
**Classification:** WILLFUL

### Balance: -
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b)  
**Description:** Balance field blank or missing after discharge. Should reflect $0 or clearly state "Discharged" to comply with post-bankruptcy accuracy obligations.  
**Classification:** NEGLIGENT

### Balance Updated: -
**FCRA Codes:** §1681s-2(a)(8), §1681e(b), §1681c(a)(4)  
**Description:** Absence of balance update date violates affirmative duty to mark accounts as updated following bankruptcy events. This omission prevents dispute verification.  
**Classification:** NEGLIGENT to WILLFUL

### Recent Payment: -
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b)  
**Description:** Payment history not shown. Post-discharge accounts should show last valid pre-bankruptcy activity or display "N/A" if obligation was discharged.  
**Classification:** NEGLIGENT

### Monthly Payment: -
**FCRA Codes:** §1681e(b)  
**Description:** Monthly payment field blank. For discharged debts, this should either be $0 or omitted entirely to prevent misleading payment expectations.  
**Classification:** NEGLIGENT

### Highest Balance: -
**FCRA Codes:** §1681e(b)  
**Description:** Historical high balance missing. While less critical individually, absence of this data contributes to overall pattern of incomplete or abandoned reporting.  
**Classification:** NEGLIGENT

### On Record Until: Oct 2025
**FCRA Codes:** §1681e(b), §1681c(a)(1), §1681c(a)(4)  
**Description:** Removal date of Oct 2025 violates 7-year rule. Cannot predate Feb 2031 (7 years from discharge) unless original delinquency justifies earlier removal. Arbitrary date selection indicates flawed procedures.  
**Classification:** NEGLIGENT to WILLFUL

---

## 🔴 Equifax Violations

### Account Status: INCLUDED_IN_CHAPTER_13
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b), §1681n  
**Description:** CRITICAL VIOLATION: Account shows active Chapter 13 inclusion AFTER February 9, 2024 discharge. This is categorically false—akin to reporting someone as 'currently deceased' when alive. Per se willful violation.  
**Classification:** WILLFUL

### Balance/Reported Balance: $0
**FCRA Codes:** §1681e(b), §1681s-2(a)(1)(A)  
**Description:** Zero balance contradicts 'INCLUDED_IN_CHAPTER_13' status. Account cannot simultaneously be in active bankruptcy AND have no balance. Internal inconsistency proves absence of reasonable procedures.  
**Classification:** WILLFUL  
*Note: Merged duplicate "Balance" and "Reported Balance" fields*

### Available Credit
**FCRA Codes:** §1681e(b), §1681s-2(a)(1)(A)  
**Description:** Available credit missing or inaccurate. For discharged revolving accounts, this field should show $0 or be removed entirely.  
**Classification:** NEGLIGENT

### High Credit
**FCRA Codes:** §1681e(b)  
**Description:** High credit value missing or not accurately retained. Weakens completeness and consistency of the credit file.  
**Classification:** NEGLIGENT

### Credit Limit
**FCRA Codes:** §1681e(b), §1681s-2(a)(1)(A)  
**Description:** Credit limit inaccurate or absent. Post-discharge accounts should show limit as $0 or marked closed.  
**Classification:** NEGLIGENT

### Date Reported: Oct 25, 2018
**FCRA Codes:** §1681c(a)(4), §1681e(b), §1681s-2(a)(8), §1681n  
**Description:** Last update coincides with bankruptcy FILING date over 5 years ago. Zero updates through confirmation, payments, and discharge proves complete abandonment of FCRA duties. Willfulness presumed from extreme duration.  
**Classification:** WILLFUL

### Bankruptcy Chapter 13
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b)  
**Description:** Field references bankruptcy but omits "Discharged" or closing context. Misleads users about current legal status of account.  
**Classification:** NEGLIGENT to WILLFUL

### Bankruptcy Completed
**FCRA Codes:** §1681e(b)  
**Description:** Must specify 'Discharged February 9, 2024' not merely 'Completed.' Vague terminology regarding bankruptcy status violates clarity requirements.  
**Classification:** NEGLIGENT

---

## 📋 Additional Universal Violations to Consider

### Payment History String Missing/Frozen
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b)  
**Description:** Payment history indicators frozen at pre-discharge delinquencies. Post-discharge accounts must show 'D' (discharged) or remove derogatory markers.

### Account Type Misclassification
**FCRA Codes:** §1681s-2(a)(1)(A), §1681e(b)  
**Description:** Account type shows 'Open' or 'Active' despite discharge. Must reflect 'Closed' or special bankruptcy status code.

### Missing Dispute Flag
**FCRA Codes:** §1681s-2(a)(8)(D)  
**Description:** No dispute notation despite bankruptcy discharge constituting automatic dispute trigger under FCRA.

### Cross-Bureau Inconsistency
**FCRA Codes:** §1681s-2(a)(1)(B), §1681e(b)  
**Description:** Same creditor reports different information to each bureau, proving absence of reasonable procedures.

### Systematic Blank Fields (Experian-specific)
**FCRA Codes:** §1681s-2(a)(2), §1681e(b), §1681n  
**Description:** Multiple blank fields ('-') across data points indicates willful failure to maintain complete records.

---

## 🎯 Quick Reference: Negligence vs. Willfulness

**Clear Willfulness (§1681n):**
- Updates made AFTER discharge without corrections
- 5+ year stale/frozen dates
- "INCLUDED_IN_CHAPTER_13" post-discharge
- Contradictory/impossible data combinations

**Likely Negligence (§1681o):**
- Individual missing fields
- Incomplete updates
- Technical errors
- Calculation mistakes

**Escalation Triggers (Negligent → Willful):**
- Multiple fields wrong (pattern evidence)
- Corrections refused or delayed
- Updates without error fixes
- Extreme time gaps (2+ years)

---

*Final version prepared for VioTagger implementation*  
*February 9, 2024 discharge date is the legal trigger for all violations*