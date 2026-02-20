import React from "react";
import styled, { keyframes } from "styled-components";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

const dimOverlay = keyframes`
  0%   { opacity: 0; }
  100% { opacity: 1; }
`;

const chain1 = keyframes`
  0%   { transform: translate(-130vw, -50vh) rotate(-6deg); opacity: 0; }
  70%  { transform: translate(1vw, 0.3vh) rotate(-5deg); opacity: 1; }
  85%  { transform: translate(-0.3vw, 0) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(-5deg); opacity: 1; }
`;

const chain2 = keyframes`
  0%   { transform: translate(130vw, 0) rotate(0deg); opacity: 0; }
  70%  { transform: translate(-1vw, 0) rotate(0deg); opacity: 1; }
  85%  { transform: translate(0.3vw, 0) rotate(0deg); }
  100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
`;

const chain3 = keyframes`
  0%   { transform: translate(130vw, 50vh) rotate(6deg); opacity: 0; }
  70%  { transform: translate(-1vw, -0.3vh) rotate(5deg); opacity: 1; }
  85%  { transform: translate(0.3vw, 0) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(5deg); opacity: 1; }
`;

const cardPop = keyframes`
  0%   { transform: scale(0.75) translateY(60px); opacity: 0; }
  60%  { transform: scale(1.04) translateY(-8px); opacity: 1; }
  80%  { transform: scale(0.99) translateY(3px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

const glitch = keyframes`
  0%, 90%, 100% { text-shadow: 0 0 8px #00f296, 0 0 20px #00f296; transform: translate(0); }
  91% { text-shadow: -3px 0 #ff0044, 3px 0 #0044ff; transform: translate(-2px, 0); }
  93% { text-shadow: 3px 0 #ff0044, -3px 0 #0044ff; transform: translate(2px, 0); }
  95% { text-shadow: 0 0 8px #00f296; transform: translate(0); }
`;

const scrollLeft = keyframes`
  0% { transform: translateX(0); } 100% { transform: translateX(-50%); }
`;
const scrollRight = keyframes`
  0% { transform: translateX(-50%); } 100% { transform: translateX(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  animation: ${dimOverlay} 0.35s ease forwards;
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
  width: 160vw;
  left: -30vw;
  padding: 1rem 0;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
`;

const MarqueeChain1 = styled(MarqueeBase)`
  top: 22%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 8px 40px rgba(0, 242, 96, 0.5);
  animation: ${chain1} 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const MarqueeChain2 = styled(MarqueeBase)`
  top: 44%;
  background: #0a0a0a;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 30px rgba(0, 242, 96, 0.2);
  animation: ${chain2} 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

const MarqueeChain3 = styled(MarqueeBase)`
  top: 66%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 -8px 40px rgba(0, 242, 96, 0.5);
  animation: ${chain3} 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
`;

const TrackLeft = styled.div`
  display: inline-block;
  animation: ${scrollLeft} 15s linear infinite;
`;
const TrackRight = styled.div`
  display: inline-block;
  animation: ${scrollRight} 15s linear infinite;
`;

/* ✅ nth-child 제거 — $even prop으로 색상 직접 제어 */
const TextDark = styled.span`
  font-size: 4rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-right: 3rem;
  letter-spacing: 2px;
  color: ${({ $even }) => ($even ? "#000" : "transparent")};
  -webkit-text-stroke: ${({ $even }) => ($even ? "0" : "2px #000")};
`;

const TextGreen = styled.span`
  font-size: 4rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-right: 3rem;
  letter-spacing: 2px;
  color: ${({ $even, theme }) =>
    $even ? theme.colors.primary : "transparent"};
  -webkit-text-stroke: ${({ $even, theme }) =>
    $even ? "0" : `2px ${theme.colors.primary}`};
`;

const Card = styled.div`
  background: rgba(10, 10, 10, 0.97);
  backdrop-filter: blur(14px);
  width: 100%;
  max-width: 420px;
  border-radius: 28px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 40px;
  position: relative;
  text-align: center;
  z-index: 10;
  animation: ${cardPop} 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.95),
    0 0 60px rgba(0, 242, 96, 0.2);
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
  z-index: 20;
  transition:
    color 0.2s,
    transform 0.2s;
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
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 242, 96, 0.5);
  }
`;

/* ✅ 20개(10+10)로 루프 이음새 제거 + $even prop으로 색상 패턴 고정 */
const DARK_ITEMS = [...Array(20)].map((_, i) => ({
  text: "Snoer GitHub",
  even: i % 2 === 1,
}));
const GREEN_ITEMS = [...Array(20)].map((_, i) => ({
  text: "Contact Me",
  even: i % 2 === 1,
}));

const ContactModal = ({ onClose }) => (
  <Overlay onClick={onClose}>
    <Stage>
      <MarqueeChain1>
        <TrackLeft>
          {DARK_ITEMS.map(({ text, even }, i) => (
            <TextDark key={i} $even={even}>
              {text}
            </TextDark>
          ))}
        </TrackLeft>
      </MarqueeChain1>

      <MarqueeChain2>
        <TrackRight>
          {GREEN_ITEMS.map(({ text, even }, i) => (
            <TextGreen key={i} $even={even}>
              {text}
            </TextGreen>
          ))}
        </TrackRight>
      </MarqueeChain2>

      <MarqueeChain3>
        <TrackLeft>
          {DARK_ITEMS.map(({ text, even }, i) => (
            <TextDark key={i} $even={even}>
              {text}
            </TextDark>
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

export default ContactModal;
