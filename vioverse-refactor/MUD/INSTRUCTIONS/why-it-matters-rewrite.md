# ✍️ INSTRUCTION: Rewrite “Why This Document Matters” Entries

## 📄 Purpose

You are tasked with rewriting the **"Why This Document Matters"** sections that appear in the legal case viewer. These sections are critical summaries that help attorneys understand why each evidence document is legally, emotionally, and strategically significant.

Your rewritten content will appear in the following file:
/vioverse-refactor/data/matters-content.json

kotlin
Copy
Edit

Each entry in this file is tied to an `.md` evidence file located in:
/vioverse-refactor/evidence-documents/

yaml
Copy
Edit

---

## 🔍 What to Rewrite

In each evidence `.md` file, locate the section that comes **before this line**:
📄 Official Evidence Document Begins Below

markdown
Copy
Edit

This pre-evidence section usually contains the following fields:
- **Title**
- **Intro Sentence**
- **Summary**
- **Why This Document Matters**
- **FCRA Relevance**
- **Timeline Placement**
- **Harm Index**
- (sometimes a **Connected Evidence** section)

Your job is to **rewrite this into a single structured entry** for the `matters-content.json` file using the format below.

---

## ✅ Output Format (JSON)

Use this structure for each entry:

```json
"evidence-key": {
  "subhead": "Short summary that highlights legal or emotional significance",
  "intro": "One-sentence summary that captures why this document matters.",
  "bullets": [
    "✅ Specific fact #1 tied to FCRA harm or timeline",
    "💰 Specific fact #2 tied to financial loss",
    "📉 Specific fact #3 tied to score drop or reporting error",
    "...",
    "🔒 Closing fact proving liability or pattern of failure"
  ]
}
Each JSON key (e.g., "rocket-referral") should match the file name (excluding .md) from:

bash
Copy
Edit
/vioverse-refactor/evidence-documents/
📌 Rules
DO NOT alter the actual evidence content after the line:

scss
Copy
Edit
📄 Official Evidence Document Begins Below
DO base your rewrite on the evidence document’s top content + what’s visible in the April 25, 2024 PNGs if applicable

DO cross-reference context from the MUD or MED system when relevant

DO use emotionally resonant but legally grounded language

DO keep bullet points short and punchy — each one must represent a fact, outcome, or violation

DON’T copy/paste raw markdown from the evidence .md — rewrite it cleanly for attorneys reviewing case strategy

📁 Save Instructions
Save all rewritten entries into:

bash
Copy
Edit
/vioverse-refactor/data/matters-content.json
If batch processing multiple, use a temp file:

bash
Copy
Edit
/vioverse-refactor/data/matters-content-updated.json
📌 Example Rewrite
Here’s an example based on the Rocket Mortgage – Credit Upgrade Referral document:

json
Copy
Edit
"rocket-referral": {
  "subhead": "Constructive Mortgage Denial Triggered by Credit Misreporting",
  "intro": "This document marks the turning point in my case — where systemic credit reporting failures caused direct, measurable financial harm.",
  "bullets": [
    "📉 April 21, 2024 – My TransUnion score dropped 107 points due to inaccurate creditor reporting",
    "❌ Rocket Mortgage confirmed I was ineligible for refinancing unless my score rose from 600 to 640",
    "📤 I was referred to the Credit Upgrade Department solely because 13 accounts still reported active debts that had been discharged",
    "💰 Lost the opportunity to refinance $23,000 in high-interest debt",
    "🧾 Faced a $10,000 cash payoff requirement to even qualify for future refinancing",
    "📆 Forced to continue making inflated monthly payments — nearly $1,000 extra — well into 2025",
    "🔒 Internal email proves I wasn’t denied for any new financial behavior, but because of furnishers’ and bureaus’ refusal to correct long-discharged debts"
  ]
}
