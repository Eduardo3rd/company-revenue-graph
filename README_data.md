# Company Revenue Growth Data

This dataset contains revenue growth trajectories for 18 companies across two categories: Hardware and Software/AI companies.

## Data Structure

### Files Included:
- `company_revenue_data.csv` - Simple format with years as rows and companies as columns
- `company_revenue_data_detailed.csv` - Enhanced format with metadata and company categories
- `README_data.md` - This documentation file

## Company Categories

### Hardware Companies (10 companies)
**Data Type:** Annual Revenue in Billions USD
**Source:** SEC filings, annual reports, and financial statements

1. **Xiaomi** - Chinese electronics and smartphone manufacturer
2. **Block** - Financial services and payment processing (formerly Square)
3. **Tesla** - Electric vehicles and clean energy company
4. **Beats** - Audio products company (acquired by Apple)
5. **DJI** - Drone and camera technology company
6. **Fitbit** - Wearable fitness technology (acquired by Google)
7. **Peloton** - Connected fitness equipment and content
8. **Anker** - Consumer electronics and charging accessories
9. **Rivian** - Electric vehicle manufacturer
10. **GoPro** - Action cameras and accessories

### Software/AI Companies (8 companies)
**Data Type:** Annual Recurring Revenue (ARR) trajectory to $500M milestone
**Source:** Company reports, funding announcements, and industry analysis

1. **Cursor** - AI-powered code editor (2 years to $500M ARR)
2. **Anthropic** - AI safety company (3 years to $500M ARR)
3. **Slack** - Business communication platform (5 years to $500M ARR)
4. **Uber** - Ride-sharing and mobility platform (6 years to $500M ARR)
5. **OpenAI** - AI research and deployment company (7 years to $500M ARR)
6. **Zoom** - Video communications platform (9 years to $500M ARR)
7. **Figma** - Collaborative design platform (10 years to $500M ARR)
8. **DocuSign** - Digital signature and document management (15 years to $500M ARR)

## Data Notes

### Time Frame
- **Year 0** represents the founding year or first year of operations
- Data spans up to 16 years (Years 0-15) depending on company age
- Empty cells indicate no data available for that year

### Measurement Differences
- **Hardware companies:** Traditional annual revenue from product sales
- **Software/AI companies:** Annual Recurring Revenue (ARR) representing subscription-based revenue streams
- Both metrics are displayed in billions of USD for consistency

### Data Quality
- Hardware company data sourced from official SEC filings and annual reports
- Software/AI company data compiled from company announcements, funding rounds, and industry reporting
- Some early-stage data may be estimated based on publicly available information

### Key Insights
- Software/AI companies show different growth patterns, with data stopping at the $500M ARR milestone
- Hardware companies show full revenue trajectories including peaks and declines
- Time to reach $500M ARR varies dramatically across software companies (2-15 years)

## Usage Notes
- All values are in billions USD (e.g., 1.50 = $1.5 billion)
- Empty cells should be treated as no data available (not zero)
- Data reflects company performance at time of compilation and may not represent current status

## Visualization
This data powers the interactive chart available at: https://eduardo3rd.github.io/company-revenue-graph/

---
*Data compiled by Eduardo Torrealba (@Eduardo3rd)*
*Sources: SEC filings, company reports, industry analysis* 