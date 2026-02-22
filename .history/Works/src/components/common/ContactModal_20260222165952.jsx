import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

/* ===============================
   🎬 Premium Cinematic Chain v5 (Super Impact Entry)
   - 침투 완료 후 스크롤 시작
   - JS 전용 버전
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

/* ---------- Card & Other Animations ---------- */

// 💥 변경된 임팩트 카드 등장 애니메이션
const impactCardPop = keyframes`
  0% {
    opacity: 0;
    transform: perspective(1000px) scale(0.2) rotateY(45deg) translateY(200px);
    filter: brightness(3) blur(20px); /* 강렬한 빛과 블러 시작 */
    box-shadow: 0 0 0 rgba(0, 242, 96, 0);
  }
  40% {
    opacity: 1;
    transform: perspective(1000px) scale(1.15) rotateY(-15deg) translateY(-40px); /* 목표보다 크게, 반대 회전 */
    filter: brightness(1.5) blur(0px); /* 선명해지며 밝기 유지 */
    box-shadow: 0 0 100px rgba(0, 242, 96, 1); /* 강렬한 글로우 폭발 */
  }
  70% {
    transform: perspective(1000px) scale(0.95) rotateY(5deg) translateY(10px); /* 다시 작게, 약간 회전 */
    filter: brightness(1.1);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 242, 96, 0.3); /* 기본 그림자로 복귀 */
  }
  100% {
    opacity: 1;
    transform: perspective(1000px) scale(1) rotateY(0deg) translateY(0); /* 정위치 */
    filter: brightness(1);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 242, 96, 0.18);
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
  perspective: 1000px; /* 3D 효과를 위한 원근감 추가 */
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
  max-width: 420px;
  border-radius: 28px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 40px;
  position: relative;
  text-align: center;
  z-index: 10;
  /* 💥 새로운 임팩트 애니메이션 적용 (지속 시간 1s로 증가) */
  animation: ${impactCardPop} 1s cubic-bezier(0.25, 1, 0.3, 1) 0.8s both;
  /* box-shadow는 애니메이션에서 제어하므로 초기값 제거 */
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

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: rotate(90deg) scale(1.15);
  }
`;

const ProfileImg = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
  box-shadow: 0 0 25px rgba(0, 242, 96, 0.5);
`;

const Name = styled.h3`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 12px;
  animation: ${glitch} 4s infinite;
  font-style: italic;
  font-weight: 900;
`;

const Bio = styled.p`
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 32px;
  font-size: 1rem;
`;

const VisitButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  padding: 16px 36px;
  border-radius: 50px;
  font-weight: 900;
  font-size: 1.1rem;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 242, 96, 0.5);
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
          <Bio>스노어가 누군지 알고싶다면?</Bio>
          <VisitButton
            href="https://github.com/SnowsFE"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 방문하기 <FaExternalLinkAlt size={16} />
          </VisitButton>
        </Card>
      </Stage>
    </Overlay>
  );
};

export default ContactModal;
