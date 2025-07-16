import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Interactive Company Growth Chart - Deployed via GitHub Pages
// Company data - year by year values in billions USD
const companiesData = {
  // Hardware Companies (Revenue)
  'Xiaomi': [0.00, 0.85, 2.00, 5.20, 12.50, 12.50, 10.00, 18.00, 25.40, 29.80, 37.80, 50.90, 41.50, 38.20, 51.60],
  'Block': [0.00, 0.00, 0.04, 0.20, 0.55, 0.85, 1.26, 1.71, 2.21, 3.30, 4.71, 9.50, 17.66, 17.53, 21.92, 24.12],
  'Tesla': [0.00, 0.01, 0.05, 0.12, 0.07, 0.02, 0.11, 0.12, 0.20, 0.41, 2.01, 3.20, 4.05, 7.00, 11.76, 21.46],
  'Beats': [0.00, 0.00, 0.03, 0.15, 0.35, 0.50, 0.86, 1.20, 1.50, 1.80, 2.00, 2.20, 2.50, 2.50, 2.00, 2.50],
  'DJI': [0.00, 0.00, 0.00, 0.00, 0.13, 0.50, 1.00, 2.50, 3.40, 3.60, 2.90, 4.20],
  'Fitbit': [0.00, 0.00, 0.01, 0.01, 0.01, 0.08, 0.27, 0.75, 1.86, 2.17, 1.62, 1.51, 1.43, 1.32, 1.21, 1.10],
  'Peloton': [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.22, 0.44, 0.92, 1.83, 4.02, 3.58, 2.80, 2.70],
  'Anker': [0.00, 0.01, 0.02, 0.05, 0.10, 0.20, 0.40, 0.50, 0.65, 0.90, 1.35, 1.94, 2.06, 2.50, 3.53],
  'Rivian': [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.06, 1.66, 4.43, 4.97],
  'GoPro': [0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.03, 0.00, 0.08, 0.10, 0.14, 0.28, 0.32, 0.32, 0.40, 0.51],
  
  // Software/AI Companies (ARR - Annual Recurring Revenue) - Values converted from millions to billions
  'Cursor': [0.00, 0.00, 0.30, 0.50], // Year 0: $0M, Year 1: $0M, Year 2: $300M, Year 3: $500M - ends at year 3
  'Anthropic': [0.00, 0.00, 0.00, 0.05, 0.50], // Year 0: $0M, Year 1: $0M, Year 2: $0M, Year 3: $50M, Year 4: $300M - ends at year 4
  'Slack': [0.00, 0.00, 0.01, 0.05, 0.10, 0.30, 0.50], // Year 0: $0M, Year 1: $0M, Year 2: $10M, Year 3: $50M, Year 4: $100M, Year 5: $300M, Year 6: $500M - ends at year 6
  'Uber': [0.00, 0.00, 0.005, 0.03, 0.10, 0.50], // Year 0: $0M, Year 1: $0M, Year 2: $5M, Year 3: $30M, Year 4: $100M, Year 5: $500M - ends at year 5
  'OpenAI': [0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.05, 0.10, 0.20, 0.50], // Year 0: $0M, Year 1: $0M, Year 2: $0M, Year 3: $0M, Year 4: $0M, Year 5: $10M, Year 6: $50M, Year 7: $100M, Year 8: $200M, Year 9: $500M - ends at year 9
  'Zoom': [0.00, 0.00, 0.005, 0.015, 0.03, 0.06, 0.10, 0.15, 0.33, 0.50], // Year 0: $0M, Year 1: $0M, Year 2: $5M, Year 3: $15M, Year 4: $30M, Year 5: $60M, Year 6: $100M, Year 7: $150M, Year 8: $330M, Year 9: $500M - ends at year 9
  'Figma': [0.00, 0.00, 0.00, 0.00, 0.005, 0.015, 0.03, 0.075, 0.20, 0.40, 0.50], // Year 0: $0M, Year 1: $0M, Year 2: $0M, Year 3: $0M, Year 4: $5M, Year 5: $15M, Year 6: $30M, Year 7: $75M, Year 8: $200M, Year 9: $400M, Year 10: $500M - ends at year 10
  'DocuSign': [0.00, 0.00, 0.001, 0.003, 0.008, 0.015, 0.03, 0.06, 0.10, 0.15, 0.25, 0.35, 0.45, 0.50] // Year 0: $0M, Year 1: $0M, Year 2: $1M, Year 3: $3M, Year 4: $8M, Year 5: $15M, Year 6: $30M, Year 7: $60M, Year 8: $100M, Year 9: $150M, Year 10: $250M, Year 11: $350M, Year 12: $450M, Year 13: $500M - ends at year 13
};

// Color palette for companies
const companyColors = {
  // Hardware Companies (bright colors)
  'Xiaomi': '#ff7f0e',
  'Block': '#1f77b4', 
  'Tesla': '#17becf',
  'Beats': '#d62728',
  'DJI': '#2ca02c',
  'Fitbit': '#9467bd',
  'Peloton': '#8c564b',
  'Anker': '#e377c2',
  'Rivian': '#7f7f7f',
  'GoPro': '#bcbd22',
  
  // Software/AI Companies (distinct colors)
  'Cursor': '#2E2E2E',     // Dark gray
  'Anthropic': '#E67E22',  // Orange
  'Slack': '#8E44AD',      // Purple
  'Uber': '#C0392B',       // Red
  'OpenAI': '#16A085',     // Teal
  'Zoom': '#3498DB',       // Blue
  'Figma': '#F39C12',      // Yellow-orange
  'DocuSign': '#27AE60'    // Green
};

const App = () => {
  // State for which companies are visible
  const [visibleCompanies, setVisibleCompanies] = useState({
    // Hardware Companies
    'Xiaomi': true,
    'Tesla': true,
    'Block': false,
    'Beats': false,
    'DJI': false,
    'Fitbit': false,
    'Peloton': false,
    'Anker': false,
    'Rivian': false,
    'GoPro': false,
    
    // Software/AI Companies - show a few by default
    'Cursor': true,
    'Anthropic': true,
    'Slack': false,
    'Uber': false,
    'OpenAI': false,
    'Zoom': false,
    'Figma': false,
    'DocuSign': false
  });

  // State for hover interactions
  const [hoveredCompany, setHoveredCompany] = useState(null);

  // Helper function for consistent numeric formatting
  const formatValue = (value) => {
    if (value >= 10) {
      return `$${Math.round(value)}B`;
    } else {
      return `$${value.toFixed(1)}B`;
    }
  };

  // Generate background bands for every 5 years
  const backgroundBands = [];
  for (let i = 0; i <= 15; i += 5) {
    if (i > 0) {
      backgroundBands.push(i);
    }
  }

  // Transform data for the chart
  const chartData = useMemo(() => {
    const maxLength = Math.max(...Object.values(companiesData).map(arr => arr.length));
    const data = [];
    
    for (let year = 0; year < maxLength; year++) {
      const point = { year };
      Object.keys(companiesData).forEach(company => {
        if (companiesData[company][year] !== undefined) {
          point[company] = companiesData[company][year];
        }
      });
      data.push(point);
    }
    
    return data;
  }, []);

  // Calculate dynamic Y-axis max (95% of highest visible value)
  const yAxisMax = useMemo(() => {
    let maxValue = 0;
    
    Object.keys(visibleCompanies).forEach(company => {
      if (visibleCompanies[company]) {
        const companyMax = Math.max(...companiesData[company]);
        maxValue = Math.max(maxValue, companyMax);
      }
    });
    
    // If no companies visible, use a default
    if (maxValue === 0) return 10;
    
    // Scale to 95% and round up nicely
    const scaledMax = maxValue / 0.95;
    return Math.ceil(scaledMax);
  }, [visibleCompanies]);

  const toggleCompany = (company) => {
    setVisibleCompanies(prev => ({
      ...prev,
      [company]: !prev[company]
    }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#f8f9fa',
      position: 'relative'
    }}>
      {/* Chart Section */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#1a1a1a',
          fontSize: '20px',
          fontWeight: '600',
          letterSpacing: '0.25px'
        }}>
          Company Growth Trajectories
        </h1>
        <div style={{ 
          height: '70vh', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
                    <ResponsiveContainer width="100%" height="100%">
             <LineChart 
               data={chartData}
               margin={{ top: 20, right: 30, left: 70, bottom: 80 }}
               onMouseLeave={() => setHoveredCompany(null)}
             >
               {/* Background bands every 5 years */}
               {[5, 10, 15].map(year => (
                 <ReferenceLine 
                   key={year} 
                   x={year} 
                   stroke="rgba(0,0,0,0.02)" 
                   strokeWidth={1}
                   strokeDasharray="none"
                 />
               ))}
               
               <CartesianGrid 
                 strokeDasharray="2 2" 
                 stroke="rgba(0,0,0,0.1)"
                 vertical={false}
               />
               <XAxis 
                 dataKey="year" 
                 axisLine={{ stroke: '#e1e5e9', strokeWidth: 1 }}
                 tickLine={{ stroke: '#e1e5e9', strokeWidth: 1 }}
                 tick={{ fontSize: 14, fill: '#64748b', fontFamily: 'Inter' }}
                 label={{ 
                   value: 'Years Since Founding', 
                   position: 'insideBottom', 
                   offset: -5,
                   style: { fontSize: '14px', fill: '#64748b', fontFamily: 'Inter' }
                 }}
               />
               <YAxis 
                 domain={[0, yAxisMax]}
                 axisLine={{ stroke: '#e1e5e9', strokeWidth: 1 }}
                 tickLine={{ stroke: '#e1e5e9', strokeWidth: 1 }}
                 tick={{ fontSize: 14, fill: '#64748b', fontFamily: 'Inter' }}
                 tickFormatter={formatValue}
                 label={{ 
                   value: 'Value (Billions USD)', 
                   angle: -90, 
                   position: 'insideLeft',
                   style: { fontSize: '14px', fill: '#64748b', fontFamily: 'Inter', textAnchor: 'middle' }
                 }}
               />
               <Tooltip 
                 contentStyle={{
                   backgroundColor: 'rgba(255, 255, 255, 0.95)',
                   border: '1px solid #e1e5e9',
                   borderRadius: '8px',
                   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                   fontSize: '14px',
                   fontFamily: 'Inter'
                 }}
                 formatter={(value, name) => {
                   const softwareCompanies = ['Cursor', 'Anthropic', 'Slack', 'Uber', 'OpenAI', 'Zoom', 'Figma', 'DocuSign'];
                   const isSoftware = softwareCompanies.includes(name);
                   const label = isSoftware ? `${name} (ARR)` : `${name} (Revenue)`;
                   return [formatValue(value), label];
                 }}
                 labelFormatter={(year) => `Year ${year}`}
               />
               
               {/* Render lines for visible companies */}
               {Object.keys(companiesData).map(company => (
                 visibleCompanies[company] && (
                   <Line
                     key={company}
                     type="monotone"
                     dataKey={company}
                     stroke={companyColors[company]}
                     strokeWidth={hoveredCompany === company ? 3 : 2.5}
                     strokeOpacity={hoveredCompany && hoveredCompany !== company ? 0.3 : 1}
                     dot={false}
                     connectNulls={false}
                     onMouseEnter={() => setHoveredCompany(company)}
                     style={{ 
                       filter: hoveredCompany === company ? 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' : 'none',
                       zIndex: hoveredCompany === company ? 10 : 1
                     }}
                   />
                 )
               ))}
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>

             {/* Company Toggle Section */}
       <div style={{ 
         width: '300px', 
         padding: '20px',
         backgroundColor: 'white',
         borderLeft: '1px solid #e1e5e9',
         overflowY: 'auto'
       }}>
         <h3 style={{ 
           marginBottom: '20px', 
           color: '#1a1a1a',
           fontSize: '16px',
           fontWeight: '600',
           fontFamily: 'Inter'
         }}>Companies</h3>
         
         {/* Hardware Companies Section */}
         <div style={{ marginBottom: '25px' }}>
           <h4 style={{ 
             fontSize: '12px', 
             color: '#64748b', 
             marginBottom: '12px',
             textTransform: 'uppercase',
             letterSpacing: '0.5px',
             fontWeight: '500',
             fontFamily: 'Inter'
           }}>
             Hardware (Annual Revenue)
           </h4>
           {['Xiaomi', 'Block', 'Tesla', 'Beats', 'DJI', 'Fitbit', 'Peloton', 'Anker', 'Rivian', 'GoPro'].map(company => (
             <div 
               key={company} 
               style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 marginBottom: '8px',
                 padding: '10px',
                 borderRadius: '6px',
                 backgroundColor: visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                 transition: 'all 0.2s ease',
                 border: '1px solid transparent'
               }}
               onMouseEnter={(e) => {
                 e.target.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.12)' : 'rgba(248, 250, 252, 1)';
                 setHoveredCompany(company);
               }}
               onMouseLeave={(e) => {
                 e.target.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent';
                 setHoveredCompany(null);
               }}
             >
               <label style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 cursor: 'pointer',
                 width: '100%'
               }}>
                 <input
                   type="checkbox"
                   checked={visibleCompanies[company]}
                   onChange={() => toggleCompany(company)}
                   style={{ 
                     marginRight: '12px',
                     transform: 'scale(1.1)',
                     accentColor: companyColors[company]
                   }}
                 />
                 <span style={{ 
                   color: companyColors[company],
                   fontWeight: visibleCompanies[company] ? '500' : '400',
                   fontSize: '14px',
                   fontFamily: 'Inter'
                 }}>
                   {company}
                 </span>
               </label>
             </div>
           ))}
         </div>

         {/* Software/AI Companies Section */}
         <div style={{ marginBottom: '25px' }}>
           <h4 style={{ 
             fontSize: '12px', 
             color: '#64748b', 
             marginBottom: '12px',
             textTransform: 'uppercase',
             letterSpacing: '0.5px',
             fontWeight: '500',
             fontFamily: 'Inter'
           }}>
             Software/AI (ARR)
           </h4>
           {['Cursor', 'Anthropic', 'Slack', 'Uber', 'OpenAI', 'Zoom', 'Figma', 'DocuSign'].map(company => (
             <div 
               key={company} 
               style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 marginBottom: '8px',
                 padding: '10px',
                 borderRadius: '6px',
                 backgroundColor: visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                 transition: 'all 0.2s ease',
                 border: '1px solid transparent'
               }}
               onMouseEnter={(e) => {
                 e.target.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.12)' : 'rgba(248, 250, 252, 1)';
                 setHoveredCompany(company);
               }}
               onMouseLeave={(e) => {
                 e.target.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent';
                 setHoveredCompany(null);
               }}
             >
               <label style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 cursor: 'pointer',
                 width: '100%'
               }}>
                 <input
                   type="checkbox"
                   checked={visibleCompanies[company]}
                   onChange={() => toggleCompany(company)}
                   style={{ 
                     marginRight: '12px',
                     transform: 'scale(1.1)',
                     accentColor: companyColors[company]
                   }}
                 />
                 <span style={{ 
                   color: companyColors[company],
                   fontWeight: visibleCompanies[company] ? '500' : '400',
                   fontSize: '14px',
                   fontFamily: 'Inter'
                 }}>
                   {company}
                 </span>
               </label>
             </div>
           ))}
                  </div>
         
         <div style={{ marginTop: '30px', fontSize: '12px', color: '#64748b' }}>
           <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e1e5e9' }} />
           <p style={{ fontFamily: 'Inter', marginBottom: '8px' }}><strong>Hardware:</strong> Annual Revenue data</p>
           <p style={{ fontFamily: 'Inter' }}><strong>Software/AI:</strong> Annual Recurring Revenue (ARR)</p>
         </div>
       </div>
       
               {/* Minimalist footer caption */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '20px',
          fontSize: '11px',
          color: '#94a3b8',
          fontFamily: 'Inter',
          textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 2px 0' }}>Source: SEC filings, company reports</p>
          <p style={{ margin: 0 }}>
            Compiled by{' '}
            <a 
              href="https://twitter.com/Eduardo3rd" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
                e.target.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
                e.target.style.color = '#3b82f6';
              }}
            >
              @Eduardo3rd
            </a>
          </p>
        </div>
     </div>
   );
 };

export default App;