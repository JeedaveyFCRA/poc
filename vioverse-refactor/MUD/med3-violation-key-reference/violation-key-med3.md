# MED-3 Violation Reference Key (Legacy)

>⚠️ **Legacy Classification System – Subject to Revision**  
> This document reflects the legacy FCRA violation logic used in the MED-3 system.  
> As of June 2025, all violation codes should be **re-evaluated and updated** using actual evidence, screenshots, and document-level analysis.  
> **Do not assume that these codes are final.** They served as a first-pass classification and may understate or misclassify the severity of violations.

---

## Purpose

This file explains the original logic used in **Column C** of the MED-3 Master Evidence Data spreadsheet, anchored to the Chapter 13 discharge date of **February 9, 2024**. It outlines how credit report **status** and **balance fields** were interpreted for FCRA compliance evaluation.

This key was used for:

- Preliminary violation tagging
- Evidence classification for dispute automation
- Severity-level harm scoring (early model)

---

## Bankruptcy Violation Patterns (Legacy)

| Term or Pattern                        | Violation? | FCRA Code                   | Explanation                                                                 |
|----------------------------------------|------------|-----------------------------|-----------------------------------------------------------------------------|
| INCLUDED_IN_CHAPTER_13                 | Yes        | §1681c(a)(1)                | Status not updated to reflect bankruptcy discharge.                         |
| Account Included in Bankruptcy         | Yes        | §1681c(a)(1)                | Legacy status from pre-discharge not corrected.                             |
| Discharged through Bankruptcy Chapter 13 | No         | N/A                         | Proper post-discharge status.                                               |
| Discharged through Bankruptcy Chapter 13/Never late | No      | N/A                         | Acceptable and accurate.                                                    |
| Not Reporting (as of [Date])           | Yes (Case-by-case) | §1681e(b)            | Potential suppression after dispute; must be reviewed in context.           |
| $0                                     | No         | N/A                         | Accurate post-discharge balance.                                            |
| - (dash)                               | Yes        | §1681e(b)                   | Ambiguous or incomplete balance reporting.                                  |
| [Blank]                                | Yes        | §1681e(b)                   | Missing balance information.                                                |
| High Balance $XXXX                     | Yes        | §1681s-2(a)(1)(A)           | Misrepresents ongoing liability after discharge.                            |

---

## Important Note on Discharge Anchor

- **Discharge Date**: February 9, 2024
- All evaluations are based on whether creditor status and balance fields were properly updated **after this date**.

---

## Migration Plan

This document is preserved for historical traceability. All future systems, including MED-4 and any outputs reviewed by Claude Code or external attorneys, **must validate or override these codes** using the **verified evidence** supplied in the current case record (screenshots, PDFs, HTML source, emails, etc.).

---

_Last updated: June 2025_
