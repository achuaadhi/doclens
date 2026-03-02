import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Clock, User } from 'lucide-react';

export default function StoragePage() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { fetchDocuments(); }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/documents');
            const data = await response.json();

            const formatted = (data || []).map(row => ({
                id: row.id,
                cert_id: row.cert_id,
                owner_name: row.owner_name || 'Unknown',
                file_name: row.file_name,
                upload_timestamp: row.upload_timestamp,
                url: `http://127.0.0.1:8000${row.file_path}`,
            }));
            setDocuments(formatted);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="title">Archive securely.</h1>
                <p className="subtitle">All your verified certificates in one unified view.</p>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', color: '#a3a3a3' }}>Loading documents...</div>
            ) : documents.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <FileText size={48} color="#52a8ff" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>No documents archived yet.</h2>
                    <p style={{ color: '#a3a3a3' }}>Head over to the Scanner via the navbar to upload some!</p>
                </div>
            ) : (
                <div className="doc-grid">
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="doc-card"
                        >
                            <div className="doc-header">
                                <div>
                                    <h3 className="doc-title">{doc.file_name}</h3>
                                    <span className="doc-subtitle">ID: {doc.cert_id}</span>
                                </div>
                                <FileText color="#52a8ff" size={24} />
                            </div>

                            <div className="doc-meta">
                                <div className="doc-meta-item">
                                    <User size={16} />
                                    <span>{doc.owner_name}</span>
                                </div>
                                <div className="doc-meta-item">
                                    <Clock size={16} />
                                    <span>{formatDate(doc.upload_timestamp)}</span>
                                </div>
                            </div>

                            <a href={doc.url} target="_blank" rel="noreferrer" className="doc-action">
                                <Download size={18} />
                                View Document
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
