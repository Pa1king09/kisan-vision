import React, { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const isTouchDevice = window.matchMedia('(pointer: fine)').matches === false;
        setIsMobile(isTouchDevice);
        if (isTouchDevice) return;

        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('button, a, .motion-button')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.closest('button, a, .motion-button')) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        const animateRing = () => {
            const lerp = 0.1;
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
            }
            requestAnimationFrame(animateRing);
        };

        const animationId = requestAnimationFrame(animateRing);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationId);
        };
    }, []);

    if (isMobile) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 10000 }}>
            {/* Small dot */}
            <div
                ref={dotRef}
                style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#2D4B37',
                    borderRadius: '50%',
                    top: '-4px',
                    left: '-4px',
                    transform: 'translate3d(0, 0, 0)',
                    scale: isHovering ? 0 : 1,
                    transition: 'scale 0.2s ease'
                }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                style={{
                    position: 'absolute',
                    width: isHovering ? '48px' : '32px',
                    height: isHovering ? '48px' : '32px',
                    border: '1.5px solid #2D4B37',
                    backgroundColor: isHovering ? 'rgba(45, 75, 55, 0.2)' : 'transparent',
                    borderRadius: '50%',
                    top: isHovering ? '-24px' : '-16px',
                    left: isHovering ? '-24px' : '-16px',
                    transform: 'translate3d(0, 0, 0)',
                    transition: 'width 0.2s ease, height 0.2s ease, top 0.2s ease, left 0.2s ease, background-color 0.2s ease'
                }}
            />
        </div>
    );
};

export default CustomCursor;
