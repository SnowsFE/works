import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

/* ===============================
   🎬 Premium Cinematic Chain v4
   - 침투 완료 후 스크롤 시작
   - transform 충돌 완전 제거
================================ */

/* ---------- Overlay ---------- */

const dimOverlay = keyframes`
  0% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  100% {
    opacity: 1;
    backdrop-filter: blur(12px);
  }
`;

/* ---------- Chain Animations ---------- */

const chain1 = keyframes`
  0% { transform: translateX(-160vw) rotate(-4deg); opacity: 0; }
  100% { transform: translateX(0) rotate(-5deg); opacity: 1; }
`;

const chain2 = keyframes`
  0% { transform: translateX(160vw); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const chain3 = keyframes`
  0% { transform: translateX(160vw) rotate(4deg); opacity: 0; }
  100% { transform: translateX(0) rotate(5deg); opacity: 1; }
`;

/* ---------- Scroll Animations ---------- */

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const scrollRight = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
`;

/* ---------- Styled Components ---------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.92);
  animation: ${dimOverlay} 0.6s ease forwards;
`;

const Stage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MarqueeBase = styled.div`
  position: absolute;
  width: 170vw;
  left: -35vw;
  padding: 1rem 0;
  white-space: nowrap;
  overflow: hidden;
  pointer-events: none;
`;

/* 체인 */

const MarqueeChain1 = styled(MarqueeBase)`
  top: 22%;
  background: ${({ theme }) => theme.colors.primary};
  animation: ${chain1} 1.25s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const MarqueeChain2 = styled(MarqueeBase)`
  top: 44%;
  background: #0a0a0a;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  animation: ${chain2} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
`;

const MarqueeChain3 = styled(MarqueeBase)`
  top: 66%;
  background: ${({ theme }) => theme.colors.primary};
  animation: ${chain3} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both;
`;

/* 👇 Scroll은 startScroll 이후에만 실행 */

const TrackLeft =
  styled.div <
  { $start: boolean } >
  `
  display: inline-block;
  ${({ $start }) =>
    $start &&
    css`
      animation: ${scrollLeft} 26s linear infinite;
    `}
`;

const TrackRight =
  styled.div <
  { $start: boolean } >
  `
  display: inline-block;
  ${({ $start }) =>
    $start &&
    css`
      animation: ${scrollRight} 26s linear infinite;
    `}
`;

const Text = styled.span`
  font-size: 4rem;
  font-weight: 900;
  margin-right: 3rem;
  letter-spacing: 2px;
  color: #000;
`;

/* ---------- Component ---------- */

const DARK_ITEMS = Array(20).fill("Snoer GitHub");
const GREEN_ITEMS = Array(20).fill("Contact Me");

const ContactModal = ({ onClose }) => {
  const [startScroll, setStartScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartScroll(true);
    }, 1700); // 체인 총 duration 이후

    return () => clearTimeout(timer);
  }, []);

  return (
    <Overlay onClick={onClose}>
      <Stage>
        <MarqueeChain1>
          <TrackLeft $start={startScroll}>
            {DARK_ITEMS.map((t, i) => (
              <Text key={i}>{t}</Text>
            ))}
          </TrackLeft>
        </MarqueeChain1>

        <MarqueeChain2>
          <TrackRight $start={startScroll}>
            {GREEN_ITEMS.map((t, i) => (
              <Text key={i}>{t}</Text>
            ))}
          </TrackRight>
        </MarqueeChain2>

        <MarqueeChain3>
          <TrackLeft $start={startScroll}>
            {DARK_ITEMS.map((t, i) => (
              <Text key={i}>{t}</Text>
            ))}
          </TrackLeft>
        </MarqueeChain3>
      </Stage>
    </Overlay>
  );
};

export default ContactModal;
