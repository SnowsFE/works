import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

/* ===============================
   🎬 Premium Cinematic Chain v4 (Impact Profile)
   - 침투 완료 후 스크롤 시작
   - transform 충돌 완전 제거
   - JS 전용 버전 (TS 문법 없음)
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
  0% {
    transform: translateX(-160vw) rotate(-4deg);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(-5deg);
    opacity: 1;
  }
`;

const chain2 = keyframes`
  0% {
    transform: translateX(160vw);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const chain3 = keyframes`
  0% {
    transform: translateX(160vw) rotate(4deg);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(5deg);
    opacity: 1;
  }
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

/* ---------- Card & Profile Animations ---------- */

const cardPop = keyframes`
  0% {
    transform: scale(0.8) translateY(50px);
    opacity: 0;
  }
  60% {
    transform: scale(1.03) translateY(-6px);
    opacity: 1;
  }
  85% {
    transform: scale(0.995) translateY(2px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
`;

const glitch = keyframes`
  0%, 90%, 100% {
    text-shadow: 0 0 8px #00f296, 0 0 20px #00f296;
    transform: translate(0);
  }
  91% {
    text-shadow: -3px 0 #ff0044, 3px 0 #0044ff;
    transform: translate(-2px, 0);
  }
  93% {
    text-shadow: 3px 0 #ff0044, -3px 0 #0044ff;
    transform: translate(2px, 0);
  }
`;

// 🌟 추가된 임팩트 애니메이션
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 15px rgba(0, 242, 96, 0.4); }
  50% { box-shadow: 0 0 35px rgba(0, 242, 96, 0.8), 0 0 10px rgba(0, 242, 96, 0.5) inset; }
  100% { box-shadow: 0 0 15px rgba(0, 242, 96, 0.4); }
`;

const floatAnim = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

/* ---------- Styled Components ---------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.92);
  animation: ${dimOverlay} 0.6s ease forwards;
`;

const Stage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MarqueeBase = styled.div`
  position: absolute;
  width: 170vw;
  left: -35vw;
  padding: 1rem 0;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
`;

const MarqueeChain1 = styled(MarqueeBase)`
  top: 22%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 10px 50px rgba(0, 242, 96, 0.45);
  animation: ${chain1} 1.25s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const MarqueeChain2 = styled(MarqueeBase)`
  top: 44%;
  background: #0a0a0a;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 40px rgba(0, 242, 96, 0.25);
  animation: ${chain2} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
`;

const MarqueeChain3 = styled(MarqueeBase)`
  top: 66%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 -10px 50px rgba(0, 242, 96, 0.45);
  animation: ${chain3} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both;
`;

/* 👇 침투 끝난 뒤 scroll 시작 */

const TrackLeft = styled.div`
  display: inline-block;
  animation: ${({ $start }) =>
    $start
      ? css`
          ${scrollLeft} 26s linear infinite
        `
      : "none"};
`;

const TrackRight = styled.div`
  display: inline-block;
  animation: ${({ $start }) =>
    $start
      ? css`
          ${scrollRight} 26s linear infinite
        `
      : "none"};
`;

const TextDark = styled.span`
  font-size: 4rem;
  font-weight: 900;
  margin-right: 3rem;
  letter-spacing: 2px;
  color: #000;
`;

const TextGreen = styled.span`
  font-size: 4rem;
  font-weight: 900;
  margin-right: 3rem;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Card = styled.div`
  background: rgba(10, 10, 10, 0.97);
  backdrop-filter: blur(18px);
  width: 100%;
  max-width: 440px; /* 살짝 키움 */
  border-radius: 28px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 45px 40px;
  position: relative;
  text-align: center;
  z-index: 10;
  animation: ${cardPop} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.95),
    0 0 80px rgba(0, 242, 96, 0.25); /* 글로우 조금 더 강하게 */
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: #777;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: rotate(90deg) scale(1.15);
  }
`;

const ProfileImg = styled.img`
  width: 120px; /* 기존 110px에서 키움 */
  height: 120px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  margin-bottom: 24px;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation:
    ${pulseGlow} 2s infinite alternate,
    ${floatAnim} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.15) rotate(5deg);
  }
`;

const Name = styled.h3`
  font-size: 2.4rem; /* 크기 키움 */
  color: #fff;
  margin-bottom: 12px;
  animation: ${glitch} 4s infinite;
  font-style: italic;
  font-weight: 900;
  letter-spacing: 1px;
`;

const Bio = styled.p`
  color: #e0e0e0; /* 폰트 색 밝게 */
  line-height: 1.6;
  margin-bottom: 36px;
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
`;

const VisitButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  padding: 18px 40px; /* 버튼 크기 키움 */
  border-radius: 50px;
  font-weight: 900;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  animation: ${pulseGlow} 2.5s infinite; /* 버튼에도 글로우 추가 */

  &:hover {
    transform: translateY(-5px) scale(1.05);
    background: #fff; /* 마우스 오버시 화이트로 반전 */
    color: #000;
    box-shadow: 0 20px 40px rgba(0, 242, 96, 0.6);
  }
`;

/* ---------- Items ---------- */

const DARK_ITEMS = Array(20).fill("Snoer GitHub");
const GREEN_ITEMS = Array(20).fill("Contact Me");

/* ---------- Component ---------- */

const ContactModal = ({ onClose }) => {
  const [startScroll, setStartScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartScroll(true);
    }, 1000); // 체인 총 duration 이후

    return () => clearTimeout(timer);
  }, []);

  return (
    <Overlay onClick={onClose}>
      <Stage>
        <MarqueeChain1>
          <TrackLeft $start={startScroll}>
            {DARK_ITEMS.map((t, i) => (
              <TextDark key={i}>{t}</TextDark>
            ))}
          </TrackLeft>
        </MarqueeChain1>

        <MarqueeChain2>
          <TrackRight $start={startScroll}>
            {GREEN_ITEMS.map((t, i) => (
              <TextGreen key={i}>{t}</TextGreen>
            ))}
          </TrackRight>
        </MarqueeChain2>

        <MarqueeChain3>
          <TrackLeft $start={startScroll}>
            {DARK_ITEMS.map((t, i) => (
              <TextDark key={i}>{t}</TextDark>
            ))}
          </TrackLeft>
        </MarqueeChain3>

        <Card onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={onClose}>
            <FaTimes />
          </CloseBtn>
          <ProfileImg src="https://github.com/SnowsFE.png" alt="Snoer" />
          <Name>Snoer</Name>
          <Bio>스노어가 누군지 알고 싶다면?</Bio>
          <VisitButton
            href="https://github.com/SnowsFE"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 방문하기 <FaExternalLinkAlt size={18} />
          </VisitButton>
        </Card>
      </Stage>
    </Overlay>
  );
};

export default ContactModal;
