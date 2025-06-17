# Claude Evaluation Guidelines for FCRA Case

This file defines the boundaries and expectations for Claude-based case evaluation using the Master Unified Dossier (MUD) folder and supporting website image assets.

---

## ✅ Scope of Access

Claude has access to the following core data:

- **MUD Folder**:
  - All documents, timelines, analysis, summaries, and violation breakdowns
  - Includes: 
    - `/CASE-NARRATIVE/`
    - `/ANALYSIS/`
    - `/CRITICAL_FINDINGS/`
    - `/QUANTIFIABLE HARM-AND-SCORE-DAMAGE/`
    - `/PATTERN-PROOF/`
    - `/VIOLATION-TYPE-GROUPINGS/`
    - `/TIMELINE-FRAMEWORK/`
    - `/med3-violation-key-reference/` (especially `Master-Evidence-Data_v3.csv`)
    - `/INSTRUCTIONS/` for prompt and logic design

- **PNG Image Set from April 25, 2024**
  - Located in:  
    ```
    ~/vioverse-refactor/assets/reports/
    ```
  - Follows format: `[CREDITOR]-[BUREAU]-[YYYY-MM-DD]-P[PageNum].png`
  - Includes all three bureaus: Equifax (EQ), Experian (EX), and TransUnion (TU)
  - Represents the primary visual proof set for violations and should be used alongside MUD evidence

---

## ⚠️ What to Ignore

- Do not reference or include any commentary about:
  - The “VioVerse” platform or its tools (VioTagger, VioScore, etc.)
  - Branding, UI/UX, or commercial use cases
- Focus entirely on the legal, procedural, and factual strength of the FCRA case

---

## 🎯 Objective

Claude is being asked to:

- Evaluate the quality and strength of evidence
- Identify patterns of misconduct or willful noncompliance
- Summarize violation clusters across time and bureau
- Suggest any further violation categories or timelines to extract

---

## 💡 Notes for Future Use

This document defines baseline evaluation rules and can be referenced in any future Claude prompt related to case severity, audit preparation, dispute strength, or regulatory analysis.
