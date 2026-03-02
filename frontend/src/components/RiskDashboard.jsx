import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, AlertTriangle, ShieldAlert, ArrowLeft, Activity, FileText } from 'lucide-react';

export default function RiskDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { analysis, certificate_owner, filename } = location.state || {};

    if (!analysis) {
        return (
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                <p style={{ color: '#a3a3a3', marginBottom: '1rem' }}>No analysis data found. Please upload a document first.</p>
                <button className="upload-button" onClick={() => navigate('/')}>Go Back to Upload</button>
            </div>
        );
    }

    const { risk_score, risk_level, ocr_data, forensics } = analysis;

    const chartData = [
        { name: 'Risk', value: risk_score },
        { name: 'Safe', value: 100 - risk_score },
    ];

    let riskColor = '#22c55e'; // Low (Green)
    let RiskIcon = ShieldCheck;
    if (risk_level === 'Medium') {
        riskColor = '#eab308'; // Warning (Yellow)
        RiskIcon = AlertTriangle;
    } else if (risk_level === 'High') {
        riskColor = '#ef4444'; // Danger (Red)
        RiskIcon = ShieldAlert;
    }

    const COLORS = [riskColor, 'rgba(255, 255, 255, 0.1)'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card"
            style={{ maxWidth: '800px', width: '100%', padding: '2rem' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={20} /> Back
                </button>
                <h2 style={{ margin: 0, flex: 1, textAlign: 'center', color: 'white' }}>Document Trust Analysis</h2>
                <div style={{ width: '60px' }}></div> {/* Spacer for centering */}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
                {/* Risk Score Gauge */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ margin: 0, marginBottom: '1rem', color: '#a3a3a3', fontSize: '1rem' }}>Overall Risk Score</h3>
                    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    startAngle={180}
                                    endAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: riskColor, lineHeight: 1 }}>{risk_score}</span>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8' }}>/ 100</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: riskColor, marginTop: '-20px' }}>
                        <RiskIcon size={24} />
                        <span style={{ fontWeight: '600', fontSize: '1.25rem' }}>{risk_level} Risk</span>
                    </div>
                </div>

                {/* Details Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '16px' }}>
                        <h3 style={{ margin: 0, marginBottom: '0.75rem', color: '#a3a3a3', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} /> Document Details
                        </h3>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><strong>File:</strong> {filename}</p>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Owner (DB Match):</strong> {certificate_owner}</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '16px', flex: 1 }}>
                        <h3 style={{ margin: 0, marginBottom: '0.75rem', color: '#a3a3a3', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={16} /> Multi-Layer Diagnostics
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <span>OCR Extraction:</span>
                                <span>{ocr_data && !ocr_data.includes('Failed') ? 'Successful' : 'Failed / Simulated'}</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                <span>ELA Extrema Variance:</span>
                                <span>{forensics?.ela?.variance ? forensics.ela.variance.toFixed(2) : 'N/A'}</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Pixel Tampering Detected:</span>
                                <span>{forensics?.ela?.tampered_regions_detected ? 'Yes (Anomalies Found)' : 'No (Consistent)'}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ margin: 0, marginBottom: '1rem', color: '#a3a3a3', fontSize: '1rem' }}>Extracted OCR Content Snippet</h3>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.8rem', color: '#94a3b8', maxHeight: '150px', whiteSpace: 'pre-wrap' }}>
                    {ocr_data || "No text extracted."}
                </pre>
            </div>
        </motion.div>
    );
}
