# Violations Data Directory

## File Locations

### CSV Import Files
- `ExportedViolations.csv` - Raw violation data export (place here)
- Additional CSV exports can be added here

### Processed Data
- `violations-processed.json` - Converted and adjusted violation data
- `coordinate-adjustments.json` - Coordinate offset configurations

## CSV Format Expected

The ExportedViolations.csv should contain columns like:
- Report identifier (creditor, bureau, date, page)
- X coordinate
- Y coordinate  
- Width
- Height
- Violation type/severity
- Description

## Coordinate Adjustment System

Since coordinates may be off, we support:
1. Global offset adjustments (x/y shift for all boxes)
2. Per-page adjustments
3. Scale factor adjustments (if source resolution differs)

## Usage

1. Place ExportedViolations.csv in this directory
2. Run the CSV parser to generate violations-processed.json
3. Vioboxes will automatically render from the processed data