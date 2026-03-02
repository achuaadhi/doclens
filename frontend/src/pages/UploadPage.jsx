import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function UploadPage() {
    const navigate = useNavigate();
    const [certId, setCertId] = useState('');
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false);
        validateAndSetFile(e.dataTransfer.files[0]);
    };
    const handleFileSelect = (e) => validateAndSetFile(e.target.files[0]);

    const validateAndSetFile = (selectedFile) => {
        if (selectedFile) {
            const ext = selectedFile.name.split('.').pop().toLowerCase();
            const allowedExts = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx'];
            if (allowedExts.includes(ext)) {
                setFile(selectedFile);
                setStatus({ type: '', message: '' });
            } else {
                setFile(null);
                setStatus({ type: 'error', message: 'Please upload a PDF, Image, or Word Document.' });
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('cert_id', certId.trim());

        try {
            const response = await fetch('http://127.0.0.1:8000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: `Success! Verified for: ${data.certificate_owner}` });
                // Navigate to dashboard with analysis data
                setTimeout(() => {
                    navigate('/dashboard', {
                        state: {
                            analysis: data.analysis,
                            certificate_owner: data.certificate_owner,
                            filename: data.filename
                        }
                    });
                }, 1000);
            } else {
                setStatus({ type: 'error', message: data.detail || 'Verification failed.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Could not connect to the server.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-card"
            style={{ maxWidth: '600px', width: '100%' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="title">DocLens</h1>
                <p className="subtitle">See What Others Miss</p>
            </div>

            <div className="input-group">
                <label className="input-label" htmlFor="certId">Certificate ID</label>
                <input
                    id="certId"
                    type="text"
                    className="cert-input"
                    placeholder="e.g. CERT-12345 (Optional)"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                />
            </div>

            <div
                className={`drop-zone ${isDragging ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" style={{ display: 'none' }} onChange={handleFileSelect} />
                {file ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                        <FileText className="drop-zone-icon" size={48} />
                        <p style={{ color: '#fff' }}>{file.name}</p>
                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </motion.div>
                ) : (
                    <>
                        <UploadCloud className="drop-zone-icon" size={48} />
                        <p>Drag & Drop your certificate here</p>
                        <span>or click to browse files</span>
                    </>
                )}
            </div>

            {status.message && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`status ${status.type}`}
                >
                    {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    <span>{status.message}</span>
                </motion.div>
            )}

            <button
                className="upload-button"
                disabled={!file || isLoading}
                onClick={handleUpload}
            >
                {isLoading ? 'Processing...' : 'Secure Upload & Verify'}
            </button>
        </motion.div>
    );
}
