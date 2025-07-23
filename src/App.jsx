import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ReferenceDot, Label } from 'recharts';
import Papa from 'papaparse';

// Interactive Company Growth Chart - Live on GitHub Pages
// Company data - year by year values in billions USD
const renderCustomLabel = (props) => {
  const { x, y, stroke, value, index, data } = props;
  if (!data || !data.length) return null;
  if (index === data.length - 1 && value) {
    return <text x={x + 5} y={y} dy={-4} fill={stroke} fontSize={12} textAnchor='start'>{props.name}</text>;
  }
  return null;
};

const App = () => {
  const [visibleCompanies, setVisibleCompanies] = useState({});
  
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [companiesData, setCompaniesData] = useState({});
  const [companyCategories, setCompanyCategories] = useState({});
  const [isLogScale, setIsLogScale] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Papa.parse('/company_revenue_data_detailed.csv', {
      download: true,
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          setIsLoading(false);
          return;
        }
        const data = results.data;
        const newData = {};
        const newCategories = {};
        data.forEach(row => {
          if (row.Company) {
            newCategories[row.Company] = row.Category;
            const years = [];
            for (let i = 0; i <= 15; i++) {
              const val = parseFloat(row[`Year ${i}`]);
              if (!isNaN(val)) years.push(val);
            }
            newData[row.Company] = years;
          }
        });
        setCompaniesData(newData);
        setCompanyCategories(newCategories);
        setIsLoading(false);
      },
      error: (error) => {
        console.error('PapaParse error:', error);
        setIsLoading(false);
      }
    });
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (Object.keys(visibleCompanies).length === 0 && Object.keys(companiesData).length > 0) {
      const initial = {};
      Object.keys(companiesData).forEach(company => {
        initial[company] = true;
      });
      setVisibleCompanies(initial);
    }
  }, [companiesData]);

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
  }, [companiesData]);

  const hardwareCompanies = useMemo(() => Object.keys(companiesData).filter(c => companyCategories[c] === 'Hardware') || [], [companiesData, companyCategories]);
  const softwareCompanies = useMemo(() => Object.keys(companiesData).filter(c => companyCategories[c] === 'Software/AI') || [], [companiesData, companyCategories]);
  const companyColors = useMemo(() => {
    const colors = {};
    const hardwareShades = ['#004d40', '#00695c', '#00796b', '#00897b', '#009688', '#26a69a', '#4db6ac', '#80cbc4', '#b2dfdb', '#e0f2f1'];
    const softwareShades = ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'];
    hardwareCompanies.forEach((c, i) => { colors[c] = hardwareShades[i % hardwareShades.length]; });
    softwareCompanies.forEach((c, i) => { colors[c] = softwareShades[i % softwareShades.length]; });
    return colors;
  }, [hardwareCompanies, softwareCompanies]);
  const companyDashes = useMemo(() => {
    const dashes = {};
    hardwareCompanies.forEach((c, i) => { dashes[c] = i % 2 === 0 ? 'none' : '3 3'; });
    softwareCompanies.forEach((c, i) => { dashes[c] = i % 2 === 0 ? 'none' : '3 3'; });
    return dashes;
  }, [hardwareCompanies, softwareCompanies]);

  const hardwareData = chartData.map(d => ({ year: d.year, ...Object.fromEntries(hardwareCompanies.map(c => [c, d[c]])) }));
  const softwareData = chartData.map(d => ({ year: d.year, ...Object.fromEntries(softwareCompanies.map(c => [c, d[c]])) }));

  const yAxisMax = useMemo(() => {
    const visibleData = Object.entries(companiesData)
      .filter(([company]) => visibleCompanies[company])
      .flatMap(([, data]) => data);
    
    if (visibleData.length === 0) return 10;
    
    const max = Math.max(...visibleData);
    return Math.ceil(max * 1.05);
  }, [visibleCompanies, companiesData]);

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

  const CustomTooltip = ({ active, payload, label, chartData }) => {
    if (active && payload && payload.length) {
      const visiblePayload = payload.filter(entry => visibleCompanies[entry.dataKey] && entry.value !== undefined && entry.value !== null);
      if (visiblePayload.length === 0) return null;
      const prevYearData = chartData[label - 1];
      const sortedPayload = visiblePayload.sort((a, b) => b.value - a.value).map((entry, index) => {
        const prevValue = prevYearData ? prevYearData[entry.dataKey] : 0;
        const growth = prevValue ? ((entry.value - prevValue) / prevValue * 100).toFixed(1) : 'N/A';
        return { ...entry, rank: index + 1, growth };
      });
      return (
        <div style={{ backgroundColor: 'white', padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontFamily: 'Inter', fontSize: isMobile ? '12px' : '13px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1a1a1a' }}>Year {label}</p>
          {sortedPayload.map((entry) => (
            <p key={entry.dataKey} style={{ margin: '4px 0', color: entry.stroke, fontWeight: hoveredCompany === entry.dataKey ? '600' : '400' }}>
              {entry.dataKey} (Rank {entry.rank}): {formatValue(entry.value)} {entry.growth !== 'N/A' ? `(${entry.growth}% YoY)` : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const annotations = {
    'Tesla': { year: 10, label: 'Model 3 Launch' },
    'OpenAI': { year: 6, label: 'ChatGPT Release' },
    'Uber': { year: 5, label: 'IPO' },
    'Zoom': { year: 8, label: 'Pandemic Boom' },
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

  if (isLoading) return <div>Loading data... (If this persists, check console for errors)</div>;

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
            {hardwareCompanies.map(company => (
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
            {softwareCompanies.map(company => (
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
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
            <input type='checkbox' checked={isLogScale} onChange={() => setIsLogScale(!isLogScale)} style={{ marginRight: '8px' }} />
            Logarithmic Scale
          </label>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', height: isMobile ? '100vh' : '70vh' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>Hardware (Annual Revenue)</h2>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={hardwareData} margin={chartMargins} onMouseLeave={() => setHoveredCompany(null)}>
              {/* Remove reference lines */}
              {/* Remove CartesianGrid */}
              <XAxis dataKey='year' tickLine={false} axisLine={false} tick={{ fontSize: isMobile ? 12 : 14, fill: '#64748b', fontFamily: 'Inter' }} label={{ value: 'Years Since Founding', position: 'insideBottom', offset: -5, style: { fontSize: isMobile ? '12px' : '14px', fill: '#64748b', fontFamily: 'Inter' } }} />
              <YAxis domain={isLogScale ? [0.01, yAxisMax] : [0, yAxisMax]} scale={isLogScale ? 'log' : 'auto'} tickLine={false} axisLine={false} tick={{ fontSize: isMobile ? 12 : 14, fill: '#64748b', fontFamily: 'Inter' }} tickFormatter={formatValue} label={{ value: 'Value (Billions USD)', angle: -90, position: 'insideLeft', style: { fontSize: isMobile ? '12px' : '14px', fill: '#64748b', fontFamily: 'Inter', textAnchor: 'middle' } }} />
              <Tooltip content={<CustomTooltip chartData={hardwareData} />} />
              
              {hardwareCompanies.map(company => visibleCompanies[company] && <Line key={company} type='monotone' dataKey={company} stroke={companyColors[company]} strokeWidth={hoveredCompany === company ? 3.5 : 2.5} dot={false} activeDot={{ r: isMobile ? 4 : 5, stroke: companyColors[company], strokeWidth: 2, fill: 'white' }} opacity={hoveredCompany && hoveredCompany !== company ? 0.3 : 1} style={{ transition: 'all 0.2s ease', filter: hoveredCompany === company ? `drop-shadow(0 0 6px ${companyColors[company]}40)` : 'none' }} strokeDasharray={companyDashes[company]}>
                <LabelList content={renderCustomLabel} />
              </Line>)}
              {Object.entries(annotations).map(([company, {year, label}]) => {
                if (visibleCompanies[company] && chartData[year] && chartData[year][company]) {
                  return (
                    <ReferenceDot key={company} x={year} y={chartData[year][company]} r={4} fill={companyColors[company]} stroke='none'>
                      <Label value={label} position='top' offset={10} fontSize={10} fill='#666' />
                    </ReferenceDot>
                  );
                }
                return null;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>Software/AI (ARR to $500M)</h2>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={softwareData} margin={chartMargins} onMouseLeave={() => setHoveredCompany(null)}>
              {/* Remove reference lines */}
              {/* Remove CartesianGrid */}
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: isMobile ? 12 : 14, fill: '#64748b', fontFamily: 'Inter' }} label={{ 
                  value: 'Years Since Founding', 
                  position: 'insideBottom', 
                  offset: -5,
                  style: { fontSize: isMobile ? '12px' : '14px', fill: '#64748b', fontFamily: 'Inter' }
                }}
              />
              <YAxis 
                domain={isLogScale ? [0.01, yAxisMax] : [0, yAxisMax]}
                scale={isLogScale ? 'log' : 'auto'}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: isMobile ? 12 : 14, fill: '#64748b', fontFamily: 'Inter' }}
                tickFormatter={formatValue}
                label={{ 
                  value: 'Value (Billions USD)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: isMobile ? '12px' : '14px', fill: '#64748b', fontFamily: 'Inter', textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip chartData={softwareData} />} />
              
              {softwareCompanies.map(company => visibleCompanies[company] && <Line key={company} type='monotone' dataKey={company} stroke={companyColors[company]} strokeWidth={hoveredCompany === company ? 3.5 : 2.5} dot={false} activeDot={{ r: isMobile ? 4 : 5, stroke: companyColors[company], strokeWidth: 2, fill: 'white' }} opacity={hoveredCompany && hoveredCompany !== company ? 0.3 : 1} style={{ transition: 'all 0.2s ease', filter: hoveredCompany === company ? `drop-shadow(0 0 6px ${companyColors[company]}40)` : 'none' }} strokeDasharray={companyDashes[company]}>
                <LabelList content={renderCustomLabel} />
              </Line>)}
              {Object.entries(annotations).map(([company, {year, label}]) => {
                if (visibleCompanies[company] && chartData[year] && chartData[year][company]) {
                  return (
                    <ReferenceDot key={company} x={year} y={chartData[year][company]} r={4} fill={companyColors[company]} stroke='none'>
                      <Label value={label} position='top' offset={10} fontSize={10} fill='#666' />
                    </ReferenceDot>
                  );
                }
                return null;
              })}
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