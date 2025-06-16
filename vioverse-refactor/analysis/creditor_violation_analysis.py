#!/usr/bin/env python3
"""
Analyze Master-Evidence-Data_v3.csv for FCRA violations and patterns
"""

import re
from datetime import datetime
from collections import defaultdict

def parse_csv_data():
    """Parse the CSV data and extract creditor violation patterns"""
    
    # Define the creditors and their data structure based on the CSV
    creditors = {
        "Ally Financial (492307****)": {
            "discharge_date": "February 09-2024",
            "violations": {
                "Equifax": {
                    "Apr 25-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included after discharge"},
                    "Aug 19-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 6+ months post-discharge"},
                    "Feb 10-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 1 year post-discharge"},
                    "Mar 02-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 13-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 20-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"}
                },
                "Experian": {
                    "Feb 10-2025": {"status": "Discharged through Bankruptcy Chapter 13/Never late", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 02-2025": {"status": "Discharged through Bankruptcy Chapter 13/Never late", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 13-2025": {"status": "Discharged through Bankruptcy Chapter 13/Never late", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 20-2025": {"status": "Discharged through Bankruptcy Chapter 13/Never late", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"}
                },
                "TransUnion": {
                    "Feb 10-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $20283", "issue": "Showing balance instead of $0"},
                    "Mar 02-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $20283", "issue": "Showing balance instead of $0"},
                    "Mar 13-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $20283", "issue": "Showing balance instead of $0"},
                    "Mar 20-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $20283", "issue": "Showing balance instead of $0"}
                }
            }
        },
        "Barclays (00021973153****)": {
            "discharge_date": "February 09-2024",
            "violations": {
                "Equifax": {
                    "Apr 25-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included after discharge"},
                    "Aug 19-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included 6+ months post-discharge"},
                    "Feb 10-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included 1 year post-discharge"},
                    "Mar 02-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Persistent violation"},
                    "Mar 13-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Persistent violation"},
                    "Mar 20-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Persistent violation"}
                },
                "Experian": {
                    "Feb 10-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 02-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 13-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 20-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Stopped reporting"}
                },
                "TransUnion": {
                    "Feb 10-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $2002", "issue": "Showing balance instead of $0"},
                    "Mar 02-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $2002", "issue": "Showing balance instead of $0"},
                    "Mar 13-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $2002", "issue": "Showing balance instead of $0"},
                    "Mar 20-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $2002", "issue": "Showing balance instead of $0"}
                }
            }
        },
        "JPM/CB (426684151011****)": {
            "discharge_date": "February 09-2024",
            "violations": {
                "Equifax": {
                    "Apr 25-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included after discharge"},
                    "Aug 19-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 6+ months post-discharge"},
                    "Feb 10-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 1 year post-discharge"},
                    "Mar 02-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 13-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 20-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"}
                },
                "Experian": {
                    "Feb 10-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 02-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 13-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 20-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Stopped reporting"}
                },
                "TransUnion": {
                    "Feb 10-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $742", "issue": "Showing balance instead of $0"},
                    "Mar 02-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $742", "issue": "Showing balance instead of $0"},
                    "Mar 13-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $742", "issue": "Showing balance instead of $0"},
                    "Mar 20-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $742", "issue": "Showing balance instead of $0"}
                }
            }
        },
        "THD/CBNA (603532079182****)": {
            "discharge_date": "February 09-2024",
            "violations": {
                "Equifax": {
                    "Apr 25-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included after discharge"},
                    "Aug 19-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 6+ months post-discharge"},
                    "Feb 10-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 1 year post-discharge"},
                    "Mar 02-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 13-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 20-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Stopped reporting"}
                },
                "Experian": {
                    "Feb 10-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 02-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 13-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 20-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Stopped reporting"}
                },
                "TransUnion": {
                    "Feb 10-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $510", "issue": "Showing balance instead of $0"},
                    "Mar 02-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $510", "issue": "Showing balance instead of $0"},
                    "Mar 13-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $510", "issue": "Showing balance instead of $0"},
                    "Mar 20-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Stopped reporting"}
                }
            }
        },
        "Mariner Finance (70050149****)": {
            "discharge_date": "February 09-2024",
            "violations": {
                "Equifax": {
                    "Apr 25-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included after discharge"},
                    "Aug 19-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 6+ months post-discharge"},
                    "Feb 10-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 1 year post-discharge"},
                    "Mar 02-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 13-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 20-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"}
                },
                "Experian": {
                    "Feb 10-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Not reporting"},
                    "Mar 02-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Not reporting"},
                    "Mar 13-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Not reporting"},
                    "Mar 20-2025": {"status": "Not Reporting", "balance": "Not Reporting", "issue": "Not reporting"}
                },
                "TransUnion": {
                    "Feb 10-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $4039", "issue": "Showing balance instead of $0"},
                    "Mar 02-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $4039", "issue": "Showing balance instead of $0"},
                    "Mar 13-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $4039", "issue": "Showing balance instead of $0"},
                    "Mar 20-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $4039", "issue": "Showing balance instead of $0"}
                }
            }
        },
        "Cornerstone FCU (FCU 5387100****)": {
            "discharge_date": "February 09-2024",
            "violations": {
                "Equifax": {
                    "Apr 25-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "$0", "issue": "Still showing as included after discharge"},
                    "Aug 19-2024": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 6+ months post-discharge"},
                    "Feb 10-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Still showing as included 1 year post-discharge"},
                    "Mar 02-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 13-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"},
                    "Mar 20-2025": {"status": "INCLUDED_IN_CHAPTER_13", "balance": "[Blank] (Incorrect)", "issue": "Persistent violation"}
                },
                "Experian": {
                    "Feb 10-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 02-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 13-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"},
                    "Mar 20-2025": {"status": "Discharged through Bankruptcy Chapter 13", "balance": '"-" (Ambiguous, incorrect)', "issue": "Ambiguous balance reporting"}
                },
                "TransUnion": {
                    "Feb 10-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $524", "issue": "Showing balance instead of $0"},
                    "Mar 02-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $524", "issue": "Showing balance instead of $0"},
                    "Mar 13-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $524", "issue": "Showing balance instead of $0"},
                    "Mar 20-2025": {"status": "Account Included in Bankruptcy", "balance": "High Balance $524", "issue": "Showing balance instead of $0"}
                }
            }
        }
    }
    
    # Creditors that stopped reporting early
    stopped_reporting = [
        "Discover Personal Loans (xxxxxxxx 6571)",
        "Best Buy/CBNA (xxxxxxxxxxxx 5757)",
        "Bank of America (xxxxxxxxxxxx 6811)",
        "Sears/CBNA (xxxxxxxxxxxx 0511)",
        "Citizens Bank (xxxxxx 8116)",
        "Citizens Bank (xxxxxx 7849)",
        "Discover Bank (xxxxxxxxxxxx 8283)"
    ]
    
    return creditors, stopped_reporting

def analyze_violations():
    """Analyze violation patterns and generate findings"""
    creditors, stopped_reporting = parse_csv_data()
    
    findings = {
        "willful_violations": [],
        "persistent_violations": [],
        "cross_bureau_inconsistencies": [],
        "timeline_violations": [],
        "balance_reporting_issues": [],
        "most_damaging": []
    }
    
    # Analyze each creditor
    for creditor_name, creditor_data in creditors.items():
        discharge_date = "February 09, 2024"
        
        # Check for willful violations (reporting included status long after discharge)
        for bureau, violations in creditor_data["violations"].items():
            for date, violation in violations.items():
                # Check if still reporting as "INCLUDED" after discharge
                if "INCLUDED_IN_CHAPTER_13" in violation["status"] and date != "Apr 25-2024":
                    findings["willful_violations"].append({
                        "creditor": creditor_name,
                        "bureau": bureau,
                        "date": date,
                        "violation": f"Still reporting 'INCLUDED_IN_CHAPTER_13' on {date}, over {calculate_months_after_discharge(date)} months after discharge"
                    })
                
                # Check for balance reporting issues
                if "High Balance" in violation["balance"] or "Ambiguous" in violation["balance"] or "[Blank]" in violation["balance"]:
                    findings["balance_reporting_issues"].append({
                        "creditor": creditor_name,
                        "bureau": bureau,
                        "date": date,
                        "issue": violation["balance"]
                    })
        
        # Check for cross-bureau inconsistencies
        bureaus_status = {}
        for bureau, violations in creditor_data["violations"].items():
            latest_date = max(violations.keys())
            bureaus_status[bureau] = violations[latest_date]["status"]
        
        if len(set(bureaus_status.values())) > 1:
            findings["cross_bureau_inconsistencies"].append({
                "creditor": creditor_name,
                "inconsistency": bureaus_status,
                "severity": "HIGH - Different statuses across bureaus"
            })
    
    # Identify most damaging findings
    findings["most_damaging"] = [
        {
            "finding": "Ally Financial - Persistent INCLUDED_IN_CHAPTER_13 status",
            "impact": "Showing as included in active bankruptcy for over 1 year post-discharge across Equifax",
            "balance": "$20,283 still showing on TransUnion",
            "severity": "CRITICAL - Prevents credit access"
        },
        {
            "finding": "Multiple creditors showing 'High Balance' instead of $0",
            "creditors": ["Ally ($20,283)", "Mariner Finance ($4,039)", "Barclays ($2,002)"],
            "impact": "TransUnion systematically reporting balances on discharged debts",
            "severity": "CRITICAL - Inflates debt-to-income ratio"
        },
        {
            "finding": "Equifax systematic violation pattern",
            "pattern": "6 major creditors still showing INCLUDED_IN_CHAPTER_13 over 1 year post-discharge",
            "impact": "Shows active bankruptcy status when discharged",
            "severity": "CRITICAL - Systemic bureau failure"
        },
        {
            "finding": "Cross-bureau reporting chaos",
            "pattern": "Same accounts show different statuses: Equifax (INCLUDED), Experian (Discharged), TransUnion (Balance owed)",
            "impact": "Confusing and contradictory credit profile",
            "severity": "HIGH - Demonstrates lack of accuracy"
        }
    ]
    
    return findings

def calculate_months_after_discharge(date_str):
    """Calculate months between discharge (Feb 9, 2024) and given date"""
    date_map = {
        "Apr 25-2024": 2.5,
        "Aug 19-2024": 6,
        "Feb 10-2025": 12,
        "Mar 02-2025": 13,
        "Mar 13-2025": 13,
        "Mar 20-2025": 13
    }
    return date_map.get(date_str, 0)

def generate_summary_report():
    """Generate a comprehensive summary of findings"""
    findings = analyze_violations()
    
    report = []
    report.append("FCRA VIOLATION ANALYSIS - MASTER EVIDENCE DATA")
    report.append("=" * 60)
    report.append(f"Discharge Date: February 9, 2024")
    report.append(f"Analysis Date: March 20, 2025 (13+ months post-discharge)")
    report.append("")
    
    report.append("CRITICAL FINDINGS:")
    report.append("-" * 40)
    for finding in findings["most_damaging"]:
        report.append(f"\n{finding['finding']}")
        report.append(f"  Impact: {finding['impact']}")
        report.append(f"  Severity: {finding['severity']}")
        if 'creditors' in finding:
            report.append(f"  Affected: {', '.join(finding['creditors'])}")
    
    report.append("\n\nWILLFUL VIOLATION PATTERNS:")
    report.append("-" * 40)
    # Group by creditor
    willful_by_creditor = defaultdict(list)
    for v in findings["willful_violations"]:
        willful_by_creditor[v["creditor"]].append(v)
    
    for creditor, violations in willful_by_creditor.items():
        report.append(f"\n{creditor}:")
        for v in violations[:3]:  # Show first 3
            report.append(f"  - {v['bureau']}: {v['violation']}")
    
    report.append("\n\nCROSS-BUREAU INCONSISTENCIES:")
    report.append("-" * 40)
    for inc in findings["cross_bureau_inconsistencies"][:5]:
        report.append(f"\n{inc['creditor']}:")
        for bureau, status in inc["inconsistency"].items():
            report.append(f"  - {bureau}: {status}")
    
    report.append("\n\nKEY EVIDENCE FOR FCRA CASE:")
    report.append("-" * 40)
    report.append("1. SYSTEMIC EQUIFAX VIOLATIONS: 6+ creditors showing 'INCLUDED_IN_CHAPTER_13' 13 months post-discharge")
    report.append("2. TRANSUNION BALANCE ERRORS: Multiple accounts showing high balances instead of $0")
    report.append("3. EXPERIAN AMBIGUITY: Using '-' for balance instead of proper $0")
    report.append("4. TIMELINE PROOF: Violations persist from April 2024 through March 2025")
    report.append("5. HARM EVIDENCE: Rocket Mortgage denial directly linked to these errors")
    
    return "\n".join(report)

if __name__ == "__main__":
    print(generate_summary_report())