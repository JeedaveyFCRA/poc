# MED v4 – Generation Instructions and Claude Prompt

This document provides the formal instruction set used to generate `Master-Evidence-Data_v4.csv` from `Master-Evidence-Data_v3.csv`. It introduces five new logic-based columns designed to identify systemic and longitudinal patterns of FCRA violations across time and bureaus.

> ⚠️ Do not overwrite MED v3. Always version forward.
> Use this as a reproducible command chain for Claude Code or future agents to run upgrades cleanly and with full auditability.

---

## Step-by-Step Instructions

You just identified several new patterns from Master-Evidence-Data_v3.csv that are not currently captured in the spreadsheet.

Please create a new version called: `Master-Evidence-Data_v4.csv`  
Do not overwrite the original.

### ✅ Add the following new columns to the end of the file:

1. **High Balance Misreporting (TU)**  
   → `TRUE` if TransUnion balance > $0 and account shows "Included in Bankruptcy"

2. **Creditor Ceased Reporting**  
   → `TRUE` if the creditor is no longer present in 2025 but was present in 2024 reports

3. **Systemic Equifax Violation**  
   → `TRUE` for all 6 creditors reporting "INCLUDED_IN_CHAPTER_13" on Equifax post-discharge

4. **Cross-Bureau Conflict**  
   → `TRUE` if same creditor shows different statuses across EQ, EX, TU

5. **Violation Duration (Months)**  
   → Count of how many report cycles the violation persisted  
   (e.g., April 2024, Aug 2024, Feb 2025, Mar 2025 = 4 months)

For each creditor, populate the new columns using the patterns already identified in the CSV.

---

## ✅ Step 3: Ask Claude to Show You a Preview First

Before finalizing the file, request:

> “Show me a preview of the first 5 rows of the updated MED v4 with the new columns filled in so I can verify accuracy before saving.”

---

## ✅ Step 4: After Saving, Ask Claude to Generate a Change Log

Once the CSV is generated, ask:

> “Create a changelog summarizing how each new column was populated and which creditors were affected.”

This helps with your audit trail and letter generation.

---

## 💡 Optional Enhancements

If you want even more structure:

- Ask Claude to **highlight rows with new critical violations**
- Create a **“summary tab” CSV** showing all willful violations detected in v4
- Generate a **`VioScore`** per creditor based on column totals

---

_Last updated: June 16, 2025_
