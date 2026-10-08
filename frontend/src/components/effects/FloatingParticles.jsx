import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const FloatingParticles = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
            options={{
                fpsLimit: 60,
                particles: {
                    number: {
                        value: 18,
                        density: {
                            enable: false
                        }
                    },
                    color: {
                        value: ["#10B981", "#06B6D4", "#34D399"]
                    },
                    shape: {
                        type: "circle"
                    },
                    opacity: {
                        value: { min: 0.06, max: 0.18 },
                        animation: {
                            enable: true,
                            speed: 0.4,
                            sync: false
                        }
                    },
                    size: {
                        value: { min: 1, max: 2.5 }
                    },
                    move: {
                        enable: true,
                        speed: { min: 0.2, max: 0.5 },
                        direction: "top",
                        random: true,
                        straight: false,
                        outModes: {
                            default: "out"
                        }
                    }
                },
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "parallax"
                        }
                    },
                    modes: {
                        parallax: {
                            enable: true,
                            force: 1.5,
                            smooth: 15
                        }
                    }
                },
                detectRetina: true
            }}
        />
    );
};

export default FloatingParticles;
