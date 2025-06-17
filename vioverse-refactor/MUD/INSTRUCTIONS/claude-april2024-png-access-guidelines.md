# Claude Access to April 25, 2024 Full Credit Report Set

This file defines the scope of Claude's access to the **April 25, 2024 credit reports**, which serve as the most complete and representative sample in the FCRA case.

---

## ✅ What’s Included

Claude has full access to all PNG files stored in the following folder:

```
~/vioverse-refactor/assets/reports/
```

This folder contains **credit report pages for all 13 disputed creditors** across **all three major credit bureaus**:

- **Equifax (EQ)**
- **Experian (EX)**
- **TransUnion (TU)**

Each file is named using this strict format:

```
[CREDITOR-CODE]-[BUREAU-CODE]-2024-04-25-P[PageNum].png
```

**Example:**

- `AL-EQ-2024-04-25-P57.png` → Ally Financial, Equifax, Page 57 of April 25 report  
- `MF-TU-2024-04-25-P17.png` → Mariner Finance, TransUnion, Page 17 of April 25 report

This naming scheme guarantees consistent reference points across bureaus, creditors, and report dates.

---

## ⚠️ Format Disclaimer

- These files are in **PNG (image) format**
- Claude **does not currently perform OCR on PNGs** in your local environment
- Text-based verification must be done via human inspection or future structured overlays

---

## 🎯 Purpose of This Dataset

The April 25, 2024 report set is designated as the **primary sample date** for legal and analytical review.

Use this dataset as the foundation for:

- Cross-bureau comparison of each creditor’s reporting
- Identification of systemic reporting failures
- Validation of Master Evidence Data rows via direct visual proof
- Pre-tagged violation overlays (via VioTagger) and interactive inspection (via VioCore)

This is the **only date** where **all 13 creditors** are confirmed to appear together across all bureaus, making it the canonical set for:

- Severity tagging
- Violation frequency counts
- Cross-report consistency checks

---

## 🧠 Usage Guidance

When prompted to:

- Evaluate report inconsistencies
- Analyze reporting behavior across bureaus
- Confirm or challenge MED data entries
- Trace patterns of willful or negligent noncompliance

... Claude should **default to this April 25, 2024 PNG set** as its visual foundation.

All metadata, VioTagger overlays, and dispute strategy flow through this anchor set.

---

*End of file.*
