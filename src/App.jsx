import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Interactive Company Growth Chart - Live on GitHub Pages
// Company data - year by year values in billions USD
const companiesData = {
  // Hardware Companies (Revenue)
  'Xiaomi': [0.00, 0.85, 2.00, 5.20, 12.50, 12.50, 10.00, 18.00, 25.40, 29.80, 37.80, 50.90, 41.50, 38.20, 51.60],
  'Block': [0.00, 0.00, 0.04, 0.20, 0.55, 0.85, 1.26, 1.71, 2.21, 3.30, 4.71, 9.50, 17.66, 17.53, 21.92, 24.12],
  'Tesla': [0.00, 0.01, 0.05, 0.12, 0.07, 0.02, 0.11, 0.12, 0.20, 0.41, 2.01, 3.20, 4.05, 7.00, 11.76, 21.46],
  'Beats': [0.00, 0.00, 0.03, 0.15, 0.35, 0.50, 0.86, 1.20, 1.50, 1.80, 2.00, 2.20, 2.50, 2.50, 2.00, 2.50],
  'DJI': [0.00, 0.00, 0.01, 0.03, 0.08, 0.13, 0.20, 0.50, 1.00, 1.30, 2.70, 2.70, 2.80, 2.70, 3.60, 4.00],
  'Fitbit': [0.00, 0.00, 0.00, 0.00, 0.00, 0.01, 0.14, 0.27, 0.75, 1.86, 2.17, 2.17, 1.51, 1.43, 1.43, 1.68],
  'Peloton': [0.00, 0.00, 0.00, 0.01, 0.06, 0.17, 0.22, 0.44, 0.72, 1.83, 4.02, 3.58, 2.81],
  'Anker': [0.00, 0.00, 0.00, 0.00, 0.02, 0.06, 0.11, 0.35, 0.66, 0.88, 1.20, 1.70, 1.38],
  'Rivian': [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.21, 4.37],
  'GoPro': [0.00, 0.00, 0.01, 0.03, 0.06, 0.24, 0.99, 1.39, 1.62, 1.18, 1.21, 0.89, 1.19],
  
  // Software/AI Companies (ARR to $500M milestone)
  'Cursor': [0.00, 0.50],
  'Anthropic': [0.00, 0.00, 1.40],
  'Slack': [0.00, 0.00, 0.02, 0.34, 0.50],
  'Uber': [0.00, 0.00, 0.05, 0.41, 0.45, 0.50],
  'OpenAI': [0.00, 0.00, 0.00, 0.00, 0.03, 0.03, 0.50],
  'Zoom': [0.00, 0.00, 0.01, 0.05, 0.08, 0.15, 0.23, 0.33, 0.50],
  'Figma': [0.00, 0.00, 0.01, 0.02, 0.03, 0.06, 0.12, 0.20, 0.30, 0.50],
  'DocuSign': [0.00, 0.00, 0.00, 0.01, 0.02, 0.03, 0.04, 0.06, 0.08, 0.11, 0.15, 0.20, 0.25, 0.32, 0.50],
};

const companyColors = {
  'Xiaomi': '#ff6f00',
  'Block': '#00d924', 
  'Tesla': '#e60012',
  'Beats': '#666666',
  'DJI': '#43a047',
  'Fitbit': '#00b0ff',
  'Peloton': '#ff5722',
  'Anker': '#795548',
  'Rivian': '#4caf50',
  'GoPro': '#2196f3',
  'Cursor': '#6366f1',
  'Anthropic': '#f59e0b',
  'Slack': '#4a154b',
  'Uber': '#000000',
  'OpenAI': '#412991',
  'Zoom': '#2d8cff',
  'Figma': '#f24e1e',
  'DocuSign': '#ffb000'
};

const App = () => {
  const [visibleCompanies, setVisibleCompanies] = useState(() => {
    const initial = {};
    Object.keys(companiesData).forEach(company => {
      initial[company] = true;
    });
    return initial;
  });
  
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const chartData = useMemo(() => {
    const maxLength = Math.max(...Object.values(companiesData).map(data => data.length));
    
    return Array.from({ length: maxLength }, (_, i) => {
      const yearData = { year: i };
      Object.entries(companiesData).forEach(([company, data]) => {
        if (data[i] !== undefined) {
          yearData[company] = data[i];
        }
      });
      return yearData;
    });
  }, []);

  const yAxisMax = useMemo(() => {
    const visibleData = Object.entries(companiesData)
      .filter(([company]) => visibleCompanies[company])
      .flatMap(([, data]) => data);
    
    if (visibleData.length === 0) return 10;
    
    const max = Math.max(...visibleData);
    return Math.ceil(max * 1.05);
  }, [visibleCompanies]);

  const formatValue = (value) => {
    if (value >= 10) return `$${Math.round(value)}B`;
    return `$${value.toFixed(1)}B`;
  };

  const toggleCompany = (company) => {
    setVisibleCompanies(prev => ({
      ...prev,
      [company]: !prev[company]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const visiblePayload = payload.filter(entry => 
        visibleCompanies[entry.dataKey] && 
        entry.value !== undefined && 
        entry.value !== null
      );

      if (visiblePayload.length === 0) return null;

      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontFamily: 'Inter',
          fontSize: isMobile ? '12px' : '13px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1a1a1a' }}>
            Year {label}
          </p>
          {visiblePayload
            .sort((a, b) => b.value - a.value)
            .map((entry, index) => (
              <p key={index} style={{ 
                margin: '4px 0', 
                color: entry.stroke,
                fontWeight: hoveredCompany === entry.dataKey ? '600' : '400'
              }}>
                {entry.dataKey}: {formatValue(entry.value)}
              </p>
            ))}
        </div>
      );
    }
    return null;
  };

  // Mobile-responsive styles
  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    backgroundColor: '#f8f9fa',
    position: 'relative'
  };

  const chartSectionStyle = {
    flex: 1,
    padding: isMobile ? '15px' : '20px',
    order: isMobile ? 2 : 1
  };

  const chartContainerStyle = {
    height: isMobile ? '50vh' : '70vh',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: isMobile ? '15px' : '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const sidebarStyle = {
    width: isMobile ? '100%' : '300px',
    padding: isMobile ? '15px' : '20px',
    backgroundColor: 'white',
    borderLeft: isMobile ? 'none' : '1px solid #e1e5e9',
    borderBottom: isMobile ? '1px solid #e1e5e9' : 'none',
    overflowY: 'auto',
    order: isMobile ? 1 : 2,
    maxHeight: isMobile ? '40vh' : 'none'
  };

  const chartMargins = isMobile 
    ? { top: 20, right: 15, left: 50, bottom: 60 }
    : { top: 20, right: 30, left: 70, bottom: 80 };

  return (
    <div style={containerStyle}>
      {/* Company Toggle Section - Shows first on mobile */}
      <div style={sidebarStyle}>
        <h3 style={{ 
          marginBottom: isMobile ? '15px' : '20px', 
          color: '#1a1a1a',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '600',
          fontFamily: 'Inter'
        }}>Companies</h3>
        
        {/* Hardware Companies Section */}
        <div style={{ marginBottom: isMobile ? '20px' : '25px' }}>
          <h4 style={{ 
            fontSize: isMobile ? '11px' : '12px', 
            color: '#64748b', 
            marginBottom: isMobile ? '8px' : '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500',
            fontFamily: 'Inter'
          }}>
            Hardware (Annual Revenue)
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
            gap: isMobile ? '8px' : '0',
            marginBottom: isMobile ? '8px' : '0'
          }}>
            {['Xiaomi', 'Block', 'Tesla', 'Beats', 'DJI', 'Fitbit', 'Peloton', 'Anker', 'Rivian', 'GoPro'].map(company => (
              <div 
                key={company} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: isMobile ? '0' : '8px',
                  padding: isMobile ? '12px 8px' : '10px',
                  borderRadius: '6px',
                  backgroundColor: visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent',
                  minHeight: isMobile ? '44px' : 'auto', // Touch-friendly height
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.12)' : 'rgba(248, 250, 252, 1)';
                    setHoveredCompany(company);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent';
                    setHoveredCompany(null);
                  }
                }}
                onClick={() => toggleCompany(company)}
              >
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: isMobile ? '13px' : '14px'
                }}>
                  <input
                    type="checkbox"
                    checked={visibleCompanies[company]}
                    onChange={() => toggleCompany(company)}
                    style={{ 
                      marginRight: isMobile ? '6px' : '8px',
                      transform: isMobile ? 'scale(1.2)' : 'scale(1)', // Larger on mobile
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    borderLeft: `3px solid ${companyColors[company]}`, 
                    paddingLeft: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '12px' : '13px',
                    color: '#374151',
                    fontWeight: '400',
                    opacity: visibleCompanies[company] ? 1 : 0.6,
                    fontFamily: 'Inter'
                  }}>
                    {company}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Software Companies Section */}
        <div style={{ marginBottom: isMobile ? '15px' : '20px' }}>
          <h4 style={{ 
            fontSize: isMobile ? '11px' : '12px', 
            color: '#64748b', 
            marginBottom: isMobile ? '8px' : '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500',
            fontFamily: 'Inter'
          }}>
            Software/AI (ARR to $500M)
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
            gap: isMobile ? '8px' : '0'
          }}>
            {['Cursor', 'Anthropic', 'Slack', 'Uber', 'OpenAI', 'Zoom', 'Figma', 'DocuSign'].map(company => (
              <div 
                key={company} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: isMobile ? '0' : '8px',
                  padding: isMobile ? '12px 8px' : '10px',
                  borderRadius: '6px',
                  backgroundColor: visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent',
                  minHeight: isMobile ? '44px' : 'auto',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.12)' : 'rgba(248, 250, 252, 1)';
                    setHoveredCompany(company);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = visibleCompanies[company] ? 'rgba(59, 130, 246, 0.08)' : 'transparent';
                    setHoveredCompany(null);
                  }
                }}
                onClick={() => toggleCompany(company)}
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
                      marginRight: isMobile ? '6px' : '8px',
                      transform: isMobile ? 'scale(1.2)' : 'scale(1)',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    borderLeft: `3px solid ${companyColors[company]}`, 
                    paddingLeft: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '12px' : '13px',
                    color: '#374151',
                    fontWeight: '400',
                    opacity: visibleCompanies[company] ? 1 : 0.6,
                    fontFamily: 'Inter'
                  }}>
                    {company}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginTop: isMobile ? '15px' : '30px', fontSize: isMobile ? '11px' : '12px', color: '#64748b' }}>
          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e1e5e9' }} />
          <p style={{ fontFamily: 'Inter', marginBottom: '8px' }}><strong>Hardware:</strong> Annual Revenue data</p>
          <p style={{ fontFamily: 'Inter' }}><strong>Software/AI:</strong> Annual Recurring Revenue (ARR)</p>
        </div>
      </div>

      {/* Chart Section */}
      <div style={chartSectionStyle}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? '20px' : '30px', 
          color: '#1a1a1a',
          fontSize: isMobile ? '18px' : '20px',
          fontWeight: '600',
          letterSpacing: '0.25px'
        }}>
          Company Growth Trajectories
        </h1>
        <div style={chartContainerStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={chartMargins}
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
                tick={{ fontSize: isMobile ? 12 : 14, fill: '#64748b', fontFamily: 'Inter' }}
                label={{ 
                  value: 'Years Since Founding', 
                  position: 'insideBottom', 
                  offset: -5,
                  style: { fontSize: isMobile ? '12px' : '14px', fill: '#64748b', fontFamily: 'Inter' }
                }}
              />
              <YAxis 
                domain={[0, yAxisMax]}
                axisLine={{ stroke: '#e1e5e9', strokeWidth: 1 }}
                tickLine={{ stroke: '#e1e5e9', strokeWidth: 1 }}
                tick={{ fontSize: isMobile ? 12 : 14, fill: '#64748b', fontFamily: 'Inter' }}
                tickFormatter={formatValue}
                label={{ 
                  value: 'Value (Billions USD)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: isMobile ? '12px' : '14px', fill: '#64748b', fontFamily: 'Inter', textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {Object.keys(companiesData).map(company => (
                visibleCompanies[company] && (
                  <Line
                    key={company}
                    type="monotone"
                    dataKey={company}
                    stroke={companyColors[company]}
                    strokeWidth={hoveredCompany === company ? 3.5 : 2.5}
                    dot={false}
                    activeDot={{ 
                      r: isMobile ? 4 : 5, 
                      stroke: companyColors[company], 
                      strokeWidth: 2, 
                      fill: 'white' 
                    }}
                    opacity={hoveredCompany && hoveredCompany !== company ? 0.3 : 1}
                    style={{ 
                      transition: 'all 0.2s ease',
                      filter: hoveredCompany === company ? `drop-shadow(0 0 6px ${companyColors[company]}40)` : 'none'
                    }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Minimalist footer caption */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '20px',
        fontSize: isMobile ? '10px' : '11px',
        color: '#94a3b8',
        fontFamily: 'Inter',
        textAlign: 'left',
        display: isMobile ? 'none' : 'block' // Hide on mobile to save space
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