import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

/* ===============================
   🎬 Premium Cinematic Chain v5 (Supernova Profile)
   - 침투 완료 후 스크롤 시작
   - 네온 더스트 폭발 프로필 등장 이펙트 추가
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

const impactCardPop = keyframes`
  0% {
    opacity: 0;
    transform: scaleY(0.01) scaleX(0.5); /* 얇은 가로선 */
    filter: brightness(3);
    box-shadow: 0 0 100px rgba(0, 242, 96, 1);
  }
  40% {
    opacity: 1;
    transform: scaleY(0.01) scaleX(1); /* 가로로 먼저 쫙 찢어짐 */
    filter: brightness(2);
    box-shadow: 0 0 120px rgba(0, 242, 96, 1);
  }
  70% {
    transform: scaleY(1.05) scaleX(1); /* 위아래로 팽창 */
    filter: brightness(1.2);
  }
  100% {
    opacity: 1;
    transform: scaleY(1) scaleX(1);
    filter: brightness(1);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 242, 96, 0.18);
  }
`;

// 💥 1. 네온 가루가 터지는 이펙트 (Box-shadow 파티클)
const dustExplosion = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    box-shadow: 
      0 0 0 0px #00f296, 0 0 0 0px #00f296, 0 0 0 0px #00f296, 0 0 0 0px #00f296,
      0 0 0 0px #00f296, 0 0 0 0px #00f296, 0 0 0 0px #00f296, 0 0 0 0px #00f296;
  }
  30% {
    opacity: 1;
    box-shadow: 
      -60px -60px 4px 2px #00f296, 60px -40px 6px 1px #00f296,
      -50px 70px 5px 3px #00f296, 70px 60px 4px 2px #00f296,
      0px -90px 6px 2px #00f296, -80px 0px 4px 1px #00f296,
      90px 10px 7px 2px #00f296, 20px 80px 5px 3px #00f296;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
    box-shadow: 
      -120px -120px 20px -2px rgba(0, 242, 150, 0), 120px -80px 20px -2px rgba(0, 242, 150, 0),
      -100px 140px 20px -2px rgba(0, 242, 150, 0), 140px 120px 20px -2px rgba(0, 242, 150, 0),
      0px -180px 20px -2px rgba(0, 242, 150, 0), -160px 0px 20px -2px rgba(0, 242, 150, 0),
      180px 20px 20px -2px rgba(0, 242, 150, 0), 40px 160px 20px -2px rgba(0, 242, 150, 0);
  }
`;

// 💥 2. 프로필 이미지 자체의 등장 애니메이션
const profilePop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(-45deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
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
  perspective: 1000px;
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
  background: ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 10px 50px rgba(0, 242, 96, 0.45);
  animation: ${chain1} 1.25s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const MarqueeChain2 = styled(MarqueeBase)`
  top: 44%;
  background: #0a0a0a;
  border-top: 2px solid ${({ theme }) => theme.colors?.primary || "#00f296"};
  border-bottom: 2px solid ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 0 40px rgba(0, 242, 96, 0.25);
  animation: ${chain2} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
`;

const MarqueeChain3 = styled(MarqueeBase)`
  top: 66%;
  background: ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 -10px 50px rgba(0, 242, 96, 0.45);
  animation: ${chain3} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both;
`;

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
  color: ${({ theme }) => theme.colors?.primary || "#00f296"};
`;

const Card = styled.div`
  background: rgba(10, 10, 10, 0.97);
  backdrop-filter: blur(18px);
  width: 100%;
  max-width: 420px;
  border-radius: 28px;
  border: 2px solid ${({ theme }) => theme.colors?.primary || "#00f296"};
  padding: 40px;
  position: relative;
  text-align: center;
  z-index: 10;
  animation: ${impactCardPop} 1s cubic-bezier(0.25, 1, 0.3, 1) 0.8s both;
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
    color: ${({ theme }) => theme.colors?.primary || "#00f296"};
    transform: rotate(90deg) scale(1.15);
  }
`;

// 💥 3. 프로필 래퍼 추가 (입자 폭발 기준점)
const ProfileWrapper = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 20px auto;

  /* 네온 가루 파티클 */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    /* 카드가 나타난 후(0.8s) + 약간의 딜레이(0.4s) = 1.2s 에 폭발 */
    animation: ${dustExplosion} 1.2s ease-out 1.2s both;
    pointer-events: none;
    z-index: 1;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 0 25px rgba(0, 242, 96, 0.5);
  position: relative;
  z-index: 2;
  /* 가루 폭발 타이밍과 맞춰서 프로필 등장 */
  animation: ${profilePop} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.2s
    both;
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
  justify-content: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors?.primary || "#00f296"};
  color: #000;
  padding: 16px 36px;
  border-radius: 50px;
  font-weight: 900;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;

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

          {/* 💥 변경된 프로필 영역 */}
          <ProfileWrapper>
            <ProfileImg src="https://github.com/SnowsFE.png" alt="Snoer" />
          </ProfileWrapper>

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
