import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            if (totalHeight > 0) {
                setScrollProgress((currentScroll / totalHeight) * 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: `${scrollProgress}%`,
                height: '2px',
                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-cyan))',
                zIndex: 9999,
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                transition: 'width 0.1s ease-out'
            }}
        />
    );
};

export default ScrollProgress;
