import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import StoragePage from './pages/StoragePage';
import RiskDashboard from './components/RiskDashboard';

function App() {
    // mouse tracking for background effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // update flashlight effect
    const gridMaskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;

    return (
        <Router>
            <div className="app-container">
                {/* Backgrounds */}
                <div className="bg-grid"></div>

                <motion.div
                    className="bg-grid-interactive"
                    style={{ WebkitMaskImage: gridMaskImage, maskImage: gridMaskImage }}
                />

                <motion.div
                    className="mouse-glow"
                    style={{ left: smoothX, top: smoothY }}
                />

                {/* Navbar */}
                <Navbar />

                {/* Routes */}
                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<UploadPage />} />
                        <Route path="/archive" element={<StoragePage />} />
                        <Route path="/dashboard" element={<RiskDashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
