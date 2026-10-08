import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isCardHovering, setIsCardHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(pointer: coarse)').matches);
        };
        checkMobile();

        const mouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            springX.set(e.clientX - 18);
            springY.set(e.clientY - 18);
        };

        const mouseOver = (e) => {
            const target = e.target;
            const isButton = target.closest('button, a, .btn-primary');
            const isCard = target.closest('.glass-card, .card');

            setIsHovering(!!isButton);
            setIsCardHovering(!!isCard);
        };

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseover', mouseOver);
        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseover', mouseOver);
        };
    }, [springX, springY]);

    if (isMobile) return null;

    return (
        <>
            {/* Main Dot */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: mousePosition.y - 4,
                    left: mousePosition.x - 4,
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#16a34a',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    opacity: isHovering ? 0 : 1
                }}
            />
            {/* Outer Ring */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: springX,
                    y: springY,
                    width: '36px',
                    height: '36px',
                    border: '2px solid #16a34a',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    scale: isHovering ? 1.5 : isCardHovering ? 1.2 : 1,
                    transition: { type: 'spring', damping: 20, stiffness: 250 }
                }}
            />
        </>
    );
};

export default CustomCursor;
