import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

const SkeletonBox = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: ${props => props.round ? '50%' : '12px'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
`;

const SkeletonCard = () => {
    return (
        <SkeletonContainer>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <SkeletonBox width="60px" height="60px" round />
                <div style={{ flex: 1 }}>
                    <SkeletonBox width="60%" height="24px" />
                    <SkeletonBox width="40%" height="16px" style={{ marginTop: '12px' }} />
                </div>
            </div>
            <SkeletonBox height="100px" style={{ marginTop: '12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <SkeletonBox height="40px" />
                <SkeletonBox height="40px" />
                <SkeletonBox height="40px" />
            </div>
        </SkeletonContainer>
    );
};

export default SkeletonCard;
