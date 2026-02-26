import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

/* ===============================================================
   🎬 Premium Cinematic Chain v5.1 — Synchronized Impact Modal
   
   ✦ 세 개의 체인 밴드가 화면을 가로질러 슬라이드 인
   ✦ 카드가 낙하하며 바닥 충격을 시뮬레이션
   ✦ 충격 순간(1.3s)에 프로필 이미지 & 네온 파티클 동기화
================================================================ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🌫️  OVERLAY — 배경 블러 & 디밍 페이드인
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const dimOverlay = keyframes`
  0%   { opacity: 0; backdrop-filter: blur(0px); }
  100% { opacity: 1; backdrop-filter: blur(12px); }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎞️  CHAIN SLIDE-IN — 3개 밴드의 진입 방향
   
   chain1 · chain3 : 왼쪽에서 진입, 미세 기울기 적용
   chain2          : 오른쪽에서 진입, 중앙 강조 밴드
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const chain1 = keyframes`
  0%   { transform: translateX(-160vw) rotate(-4deg); opacity: 0; }
  100% { transform: translateX(0)      rotate(-5deg); opacity: 1; }
`;

const chain2 = keyframes`
  0%   { transform: translateX(160vw); opacity: 0; }
  100% { transform: translateX(0);     opacity: 1; }
`;

const chain3 = keyframes`
  0%   { transform: translateX(160vw)  rotate(4deg); opacity: 0; }
  100% { transform: translateX(0)      rotate(5deg); opacity: 1; }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📜  MARQUEE SCROLL — 텍스트 무한 루프 방향
   
   scrollLeft  : 첫 번째·세 번째 밴드 (→ 왼쪽으로 이동)
   scrollRight : 두 번째 밴드 (← 오른쪽으로 이동, 역방향)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const scrollLeft = keyframes`
  0%   { transform: translateX(0);    }
  100% { transform: translateX(-50%); }
`;

const scrollRight = keyframes`
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0);    }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💥  IMPACT ANIMATIONS — 충격 시퀀스 (물리 동기화)
   
   타임라인:
     0.8s  → 카드 낙하 시작  (impactCardPop)
     1.3s  → 충격 지점       (50% keyframe)
     1.3s  → 파티클 폭발     (dustExplosion)
     1.3s  → 프로필 솟구침   (profilePop)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * 카드 낙하 & 바운스
 * 50% 지점에서 살짝 눌리며 충격을 표현,
 * 이후 오버슈트 → 최종 안착
 */
const impactCardPop = keyframes`
  0% {
    opacity: 0;
    transform: scale(1.4) translateY(-50px);
    filter: brightness(2) blur(10px);
  }
  50% {
    /* 💥 충격 지점 — 카드가 바닥을 찍는 순간 */
    opacity: 1;
    transform: scale(0.95) translateY(10px);
    filter: brightness(1.5) blur(0px);
    box-shadow: 0 0 120px rgba(0, 242, 96, 1);
  }
  75% {
    /* 반동 오버슈트 */
    transform: scale(1.02) translateY(-5px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.9), 0 0 100px rgba(0,242,96,0.6);
  }
  100% {
    /* 최종 안착 */
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: brightness(1);
    box-shadow: 0 40px 80px rgba(0,0,0,0.95), 0 0 80px rgba(0,242,96,0.18);
  }
`;

/**
 * 네온 파티클 폭발
 * box-shadow 다중 레이어로 8방향 파티클을 시뮬레이션,
 * 퍼져나가며 투명도 0으로 사라짐
 */
const dustExplosion = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    box-shadow:
      0 0 0 0px #00f296, 0 0 0 0px #00f296,
      0 0 0 0px #00f296, 0 0 0 0px #00f296,
      0 0 0 0px #00f296, 0 0 0 0px #00f296,
      0 0 0 0px #00f296, 0 0 0 0px #00f296;
  }
  30% {
    /* 파티클이 최대로 퍼진 순간 */
    opacity: 1;
    box-shadow:
      -70px  -70px 4px 2px #00f296,   70px  -50px 6px 1px #00f296,
      -60px   80px 5px 3px #00f296,   80px   70px 4px 2px #00f296,
        0px -100px 6px 2px #00f296,  -90px    0px 4px 1px #00f296,
      100px   20px 7px 2px #00f296,   30px   90px 5px 3px #00f296;
  }
  100% {
    /* 파티클 소멸 */
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.6);
    box-shadow:
      -140px -140px 20px -2px rgba(0,242,150,0),  140px -100px 20px -2px rgba(0,242,150,0),
       -120px 160px 20px -2px rgba(0,242,150,0),  160px  140px 20px -2px rgba(0,242,150,0),
          0px -200px 20px -2px rgba(0,242,150,0), -180px   0px 20px -2px rgba(0,242,150,0),
        200px   30px 20px -2px rgba(0,242,150,0),   50px  180px 20px -2px rgba(0,242,150,0);
  }
`;

/**
 * 프로필 이미지 솟구침
 * 카드 충격의 반동으로 튀어오르는 느낌,
 * 회전 없이 수직 바운스만 적용
 */
const profilePop = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.4) translateY(40px);
  }
  50% {
    /* 카드 충격 반동으로 솟구치는 정점 */
    opacity: 1;
    transform: scale(1.15) translateY(-15px);
  }
  75% {
    /* 오버슈트 후 살짝 내려앉음 */
    transform: scale(0.95) translateY(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚡  GLITCH — 이름 텍스트 사이버 글리치 루프
   주기적으로 RGB 채널을 분리해 글리치 효과를 연출
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧱  STYLED COMPONENTS — 레이아웃 & UI 구성 요소
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** 전체 화면을 덮는 반투명 블러 오버레이 */
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

/** 카드와 체인을 담는 3D 퍼스펙티브 무대 */
const Stage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
`;

/** 세 밴드 공통 베이스 — 화면 너비보다 넓게 배치해 기울기 여백 확보 */
const MarqueeBase = styled.div`
  position: absolute;
  width: 170vw;
  left: -35vw;
  padding: 1rem 0;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;
  pointer-events: none; /* 마우스 이벤트 차단 */
`;

/** 첫 번째 밴드 — 상단, 녹색 배경, 왼쪽에서 진입 */
const MarqueeChain1 = styled(MarqueeBase)`
  top: 22%;
  background: ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 10px 50px rgba(0, 242, 96, 0.45);
  animation: ${chain1} 1.25s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

/** 두 번째 밴드 — 중앙, 다크 배경 + 녹색 테두리, 오른쪽에서 진입 (0.18s 딜레이) */
const MarqueeChain2 = styled(MarqueeBase)`
  top: 44%;
  background: #0a0a0a;
  border-top: 2px solid ${({ theme }) => theme.colors?.primary || "#00f296"};
  border-bottom: 2px solid ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 0 40px rgba(0, 242, 96, 0.25);
  animation: ${chain2} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
`;

/** 세 번째 밴드 — 하단, 녹색 배경, 왼쪽에서 진입 (0.36s 딜레이) */
const MarqueeChain3 = styled(MarqueeBase)`
  top: 66%;
  background: ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 -10px 50px rgba(0, 242, 96, 0.45);
  animation: ${chain3} 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both;
`;

/** 왼쪽 방향 스크롤 트랙 — $start가 true일 때 애니메이션 시작 */
const TrackLeft = styled.div`
  display: inline-block;
  animation: ${({ $start }) =>
    $start
      ? css`
          ${scrollLeft} 26s linear infinite
        `
      : "none"};
`;

/** 오른쪽 방향 스크롤 트랙 */
const TrackRight = styled.div`
  display: inline-block;
  animation: ${({ $start }) =>
    $start
      ? css`
          ${scrollRight} 26s linear infinite
        `
      : "none"};
`;

/** 다크 밴드용 검은색 텍스트 아이템 */
const TextDark = styled.span`
  font-size: 4rem;
  font-weight: 900;
  margin-right: 3rem;
  letter-spacing: 2px;
  color: #000;
`;

/** 라이트 밴드용 녹색 텍스트 아이템 */
const TextGreen = styled.span`
  font-size: 4rem;
  font-weight: 900;
  margin-right: 3rem;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors?.primary || "#00f296"};
`;

/** 메인 정보 카드 — 0.8s 딜레이 후 낙하 애니메이션 재생 */
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
  animation: ${impactCardPop} 1s cubic-bezier(0.2, 0, 0.2, 1) 0.8s both;
`;

/** 우측 상단 닫기 버튼 — hover 시 90° 회전 */
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
    color: ${({ theme }) => theme.colors?.primary || "#00f296"};
    transform: rotate(90deg) scale(1.15);
  }
`;

/**
 * 프로필 이미지 래퍼
 * ::after 가상 요소로 네온 파티클 폭발 연출
 * (1.3s — 카드 충격 순간에 정확히 동기화)
 */
const ProfileWrapper = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 20px auto;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: ${dustExplosion} 0.8s ease-out 1.3s both;
    pointer-events: none;
    z-index: 1;
  }
`;

/** 프로필 이미지 — 1.3s에 카드 반동에 맞춰 수직 솟구침 */
const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors?.primary || "#00f296"};
  box-shadow: 0 0 25px rgba(0, 242, 96, 0.5);
  position: relative;
  z-index: 2;
  animation: ${profilePop} 0.6s cubic-bezier(0.17, 0.67, 0.83, 1) 1.3s both;
`;

/** 이름 텍스트 — 4초 주기 글리치 루프 */
const Name = styled.h3`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 12px;
  animation: ${glitch} 4s infinite;
  font-style: italic;
  font-weight: 900;
`;

/** 소개 문구 */
const Bio = styled.p`
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 32px;
  font-size: 1rem;
`;

/** GitHub 방문 CTA 버튼 — hover 시 부유 효과 */
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  ContactModal — 메인 컴포넌트
   
   Props:
     onClose  : 모달 닫기 핸들러 (오버레이 클릭 or ✕ 버튼)
   
   State:
     startScroll : 체인 입장 완료 후(1s) 마퀴 스크롤 시작 플래그
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ContactModal = ({ onClose }) => {
  const [startScroll, setStartScroll] = useState(false);

  useEffect(() => {
    /* 체인 슬라이드 인(~1s) 완료 후 마퀴 스크롤 활성화 */
    const timer = setTimeout(() => {
      setStartScroll(true);
    }, 1000);

    return () => clearTimeout(timer); /* 언마운트 시 타이머 정리 */
  }, []);

  return (
    /* 오버레이 클릭 시 모달 닫기 */
    <Overlay onClick={onClose}>
      <Stage onClick={(e) => e.stopPropagation()}>
        {/* ── 상단 밴드: 검은 텍스트, 왼쪽 스크롤 ── */}
        <MarqueeChain1>
          <TrackLeft $start={startScroll}>
            {DARK_ITEMS.map((t, i) => (
              <TextDark key={i}>{t}</TextDark>
            ))}
          </TrackLeft>
        </MarqueeChain1>

        {/* ── 중앙 밴드: 녹색 텍스트, 오른쪽 스크롤 ── */}
        <MarqueeChain2>
          <TrackRight $start={startScroll}>
            {GREEN_ITEMS.map((t, i) => (
              <TextGreen key={i}>{t}</TextGreen>
            ))}
          </TrackRight>
        </MarqueeChain2>

        {/* ── 하단 밴드: 검은 텍스트, 왼쪽 스크롤 ── */}
        <MarqueeChain3>
          <TrackLeft $start={startScroll}>
            {DARK_ITEMS.map((t, i) => (
              <TextDark key={i}>{t}</TextDark>
            ))}
          </TrackLeft>
        </MarqueeChain3>

        {/* ── 메인 카드 (클릭 이벤트 버블링 차단) ── */}
        <Card onClick={(e) => e.stopPropagation()}>
          {/* 닫기 버튼 */}
          <CloseBtn onClick={onClose}>
            <FaTimes />
          </CloseBtn>

          {/* 프로필 영역 — 충격 파티클 + 이미지 솟구침 */}
          <ProfileWrapper>
            <ProfileImg src="https://github.com/SnowsFE.png" alt="Snoer" />
          </ProfileWrapper>

          {/* 이름 (글리치 효과) */}
          <Name>Snoer</Name>

          {/* 소개 문구 */}
          <Bio>스노어가 어떤 개발자인지 궁금하다면?</Bio>

          {/* GitHub 방문 버튼 */}
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦  MARQUEE DATA — 무한 루프용 텍스트 배열
   x20 반복으로 빈틈 없는 연속 스크롤 보장
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const DARK_ITEMS = Array(20).fill("Snoer GitHub"); /* 다크 밴드용 */
const GREEN_ITEMS = Array(20).fill("Contact Me"); /* 라이트 밴드용 */

export default ContactModal;
