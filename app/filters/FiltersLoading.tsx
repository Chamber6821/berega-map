import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0%, 100% { transform: translate(0); }
  25% { transform: translate(160%); }
  50% { transform: translate(160%, 160%); }
  75% { transform: translate(0, 160%); }
`;

const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const LoaderContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const LoaderBar = styled.hr<{ delay: string; backgroundColor: string }>`
  border: 0;
  margin: 0;
  width: 20%;
  height: 20%;
  position: absolute;
  border-radius: 50%;
  background: ${({ backgroundColor }) => backgroundColor};
  animation: ${spin} 2s ease infinite;
  animation-delay: ${({ delay }) => delay};
`;

export default function FiltersLoading() {
  return (
    <LoaderOverlay>
      <LoaderContainer>
        <LoaderBar backgroundColor="#009C1AFF" delay="-1.5s" />
        <LoaderBar backgroundColor="#009C1AFF" delay="-1s" />
        <LoaderBar backgroundColor="#009C1AFF" delay="-0.5s" />
        <LoaderBar backgroundColor="#009C1AFF" delay="0s" />
      </LoaderContainer>
    </LoaderOverlay>
  );
}
