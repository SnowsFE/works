import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { projects } from "../data/projects";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🗺️  NAV
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const NAV_ITEMS = [
  { id: "metrics", label: "Performance" },
  { id: "query", label: "Query Engineering" },
  { id: "architecture", label: "Architecture" },
  { id: "board", label: "Board System" },
  { id: "popup", label: "Popup System" },
  { id: "template", label: "Template System" },
  { id: "kpcp", label: "Stats Query" },
  { id: "stack", label: "Tech Stack" },
  { id: "timeline", label: "Timeline" },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✨  ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}`;
const slideDown = keyframes`from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}`;
const codeScroll = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎨  DESIGN TOKENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const C = {
  green: "#00f260",
  greenDim: "rgba(0,242,96,0.6)",
  greenFaint: "rgba(0,242,96,0.3)",
  greenBg: "rgba(0,242,96,0.04)",
  greenBorder: "rgba(0,242,96,0.15)",
  red: "rgba(255,80,80,0.45)",
  redBg: "rgba(255,60,60,0.04)",
  redBorder: "rgba(255,60,60,0.12)",
  border: "rgba(255,255,255,0.07)",
  text: "#e8e8e8",
  textDim: "rgba(255,255,255,0.45)",
  textFaint: "rgba(255,255,255,0.3)",
  bg: "#080808",
  bgCard: "#0f0f0f",
  bgDeep: "#060606",
  mono: `"JetBrains Mono","Fira Code",monospace`,
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🖥️  흐르는 코드 배경 — 추가
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const HERO_CODE_LINES = [
  `WITH BoardCTE AS (`,
  `  SELECT brd_idx, brd_userId,`,
  `    CONVERT(varchar(23), brd_writeday, 120)`,
  `    AS parsed_date`,
  `  FROM GtblQaABoard WITH(NOLOCK)`,
  `  WHERE brd_isDeleted = 0`,
  `  UNION ALL`,
  `  SELECT brd_idx, brd_userId,`,
  `    CASE WHEN CHARINDEX('오후', brd_writeday) > 0`,
  `      THEN ... END AS parsed_date`,
  `  FROM tblSukangReading WITH(NOLOCK)`,
  `),`,
  `Paged AS (`,
  `  SELECT *,`,
  `    ROW_NUMBER() OVER (`,
  `      ORDER BY parsed_date DESC`,
  `    ) AS rn,`,
  `    COUNT(*) OVER() AS total_cnt`,
  `  FROM BoardCTE`,
  `)`,
  `SELECT * FROM Paged`,
  `WHERE rn BETWEEN :offset`,
  `  AND :offset + :page_size - 1`,
  `-- ─────────────────────────────────`,
  `SELECT l.lec_lecName, t.lnum,`,
  `  c.li_manage, q.tqa_q1`,
  `FROM GtblLectureInfo AS l`,
  `LEFT JOIN tblnumber t`,
  `  ON REPLACE(l.lec_lecName,'.',''`,
  `   = REPLACE(t.lname,'.','')`,
  `LEFT JOIN [license].dbo.GtblLicenseInfo c`,
  `  ON REPLACE(c.li_lecName,'.',''`,
  `   = REPLACE(l.lec_lecName,'.','')`,
  `LEFT JOIN [lei.or.kr].dbo.tblTeacherQnA q`,
  `  ON d.lec_lecCode = q.tqa_leccode`,
  `WHERE l.lec_lecCode = :code`,
  `-- ─────────────────────────────────`,
  `WITH AgeStats AS (`,
  `  SELECT loi_licenseCode,`,
  `    CASE WHEN age BETWEEN 29 AND 38`,
  `      THEN '30대' ... END AS AgeGroup,`,
  `    COUNT(*) AS cnt`,
  `  FROM GtblLicenseOrderInfo`,
  `  GROUP BY loi_licenseCode, AgeGroup`,
  `)`,
];

/* 배경 레이어 — 상하 fade, 우측 배치 */
const CodeBgWrap = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.11;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 15%,
    rgba(0, 0, 0, 0.7) 80%,
    transparent 100%
  );
`;

/* 실제로 흐르는 트랙 */
const CodeBgTrack = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 44%;
  animation: ${codeScroll} 30s linear infinite;
  font-family: ${C.mono};
  font-size: 0.7rem;
  line-height: 2.1;
  color: rgba(0, 242, 96, 0.9);
  user-select: none;
  white-space: pre;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔧  DESIGN SYSTEM — SHARED PRIMITIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const Wrapper = styled.div`
  background: ${C.bg};
  min-height: 100vh;
  color: ${C.text};
  position: relative;
  overflow-x: hidden;
`;

const Content = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 4rem 5rem;
  @media (max-width: 768px) {
    padding: 0 1.5rem 3.5rem;
  }
`;

const Section = styled.section`
  margin-bottom: 4.5rem;
  scroll-margin-top: 80px;
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => cols || "1fr 1fr"};
  gap: ${({ gap }) => gap || "1rem"};
  @media (max-width: ${({ bp }) => bp || "900px"}) {
    grid-template-columns: 1fr;
  }
`;

const SubLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ variant }) =>
    variant === "orange"
      ? "rgba(255,160,60,0.75)"
      : variant === "red"
        ? "rgba(255,120,120,0.7)"
        : C.greenDim};
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: ${({ mb }) => mb || "1rem"};
  font-family: ${C.mono};
  ${({ withLine }) =>
    withLine &&
    css`
      display: flex;
      align-items: center;
      gap: 1rem;
      &::after {
        content: "";
        flex: 1;
        height: 1px;
        background: ${C.border};
        max-width: 200px;
      }
    `}
`;

const ProseText = styled.p`
  font-size: ${({ size }) => size || "0.9rem"};
  color: ${C.textDim};
  line-height: 1.9;
  margin: ${({ m }) => m || "0"};
  white-space: pre-line;
`;

const IssueRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.8rem;
  align-items: stretch;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SecurityInlineWrap = styled.div`
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 80, 80, 0.1);
  padding-top: 2rem;
`;

const SecurityInlineHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
`;

const SecurityInlineLabel = styled.div`
  font-size: 0.68rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  font-family: ${C.mono};
  color: rgba(255, 100, 100, 0.55);
`;

const SecurityInlineGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const SecurityInlineCard = styled.div`
  background: ${C.bgCard};
  border: 1px solid ${C.border};
  border-left: 2px solid ${({ accent }) => accent || "rgba(255,80,80,0.4)"};
  padding: 0.9rem 1.2rem;
  border-radius: 0 4px 4px 0;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const SecurityInlineCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.35rem;
`;

const SecurityInlineCardTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
`;

const ServerBadge = styled.span`
  font-size: 0.52rem;
  padding: 0.12rem 0.45rem;
  background: rgba(255, 80, 80, 0.08);
  border: 1px solid rgba(255, 80, 80, 0.2);
  color: rgba(255, 120, 120, 0.7);
  border-radius: 2px;
  letter-spacing: 1px;
  font-family: ${C.mono};
`;

const SecurityInlineCardDesc = styled.div`
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.7;
  white-space: pre-line;
`;

const SecurityInlineBlock = ({ items, title = "Security" }) => (
  <SecurityInlineWrap>
    <SecurityInlineHeader>
      <SecurityInlineLabel>🔒 {title}</SecurityInlineLabel>
    </SecurityInlineHeader>
    <SecurityInlineGrid>
      {items.map((item, i) => (
        <SecurityInlineCard key={i} accent={item.accent}>
          <SecurityInlineCardHeader>
            <SecurityInlineCardTitle>{item.label}</SecurityInlineCardTitle>
            <ServerBadge>SERVER ENFORCED</ServerBadge>
          </SecurityInlineCardHeader>
          <SecurityInlineCardDesc>{item.desc}</SecurityInlineCardDesc>
        </SecurityInlineCard>
      ))}
    </SecurityInlineGrid>
  </SecurityInlineWrap>
);

const SideBanner = styled.div`
  background: ${({ variant }) => (variant === "red" ? C.redBg : C.greenBg)};
  border: 1px solid
    ${({ variant }) => (variant === "red" ? C.redBorder : C.greenBorder)};
  border-left: 3px solid
    ${({ variant }) =>
      variant === "red"
        ? C.red
        : variant === "orange"
          ? "rgba(255,160,60,0.5)"
          : "rgba(0,242,96,0.5)"};
  border-radius: 0 4px 4px 0;
  padding: 1.2rem 1.6rem;
`;

const BorderCard = styled.div`
  background: ${C.bgCard};
  border: 1px solid ${C.border};
  border-left: 2px solid ${({ accent }) => accent || C.greenFaint};
  padding: ${({ p }) => p || "1rem 1.2rem"};
  border-radius: 0 4px 4px 0;
  margin-bottom: ${({ mb }) => mb || "0"};
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const ImgClickWrap = styled.div`
  position: relative;
  cursor: zoom-in;
  &::after {
    content: "⤢";
    position: absolute;
    bottom: 0.6rem;
    right: 0.6rem;
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 0.85rem;
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 3px;
    color: rgba(255, 255, 255, 0.6);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  &:hover::after {
    opacity: 1;
  }
`;

const ScreenshotBox = styled.div`
  border: 1px solid
    ${({ highlight }) => (highlight ? "rgba(0,242,96,0.3)" : C.border)};
  border-radius: 4px;
  overflow: hidden;
  background: ${C.bgCard};
  transition: border-color 0.3s;
  &:hover {
    border-color: ${({ highlight }) =>
      highlight ? "rgba(0,242,96,0.6)" : "rgba(255,255,255,0.15)"};
  }
`;

const ScrollBox = styled.div`
  height: ${({ h }) => h || "320px"};
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${C.greenFaint};
    border-radius: 2px;
  }
`;

const ScreenshotImg = styled.img`
  width: 100%;
  display: block;
  opacity: 0.88;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
`;

const ScreenshotCaption = styled.div`
  padding: ${({ p }) => p || "0.6rem 0.8rem"};
  font-size: 0.62rem;
  color: ${C.textFaint};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: ${C.mono};
  letter-spacing: 0.5px;
`;

const DBTableBox = styled.div`
  border: 1px solid
    ${({ highlight }) => (highlight ? "rgba(0,242,96,0.2)" : C.border)};
  border-radius: 4px;
  overflow: hidden;
  background: #0a0a0a;
`;

const DBTableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background: ${({ highlight }) =>
    highlight ? "rgba(0,242,96,0.05)" : "rgba(255,255,255,0.02)"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const DBTableName = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: ${C.mono};
  color: ${({ highlight }) => (highlight ? "rgba(0,242,96,0.9)" : C.text)};
`;

const DBTableRole = styled.div`
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const DBTableRow = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 0.85fr 1fr;
  padding: 0.45rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const DBColText = styled.div`
  font-size: 0.67rem;
  font-family: ${C.mono};
  color: ${({ dim }) => (dim ? C.textFaint : C.text)};
`;

const DBTypeText = styled.div`
  font-size: 0.62rem;
  font-family: ${C.mono};
  color: rgba(130, 170, 255, 0.65);
`;

const FieldTag = styled.span`
  font-size: 0.6rem;
  padding: 0.15rem 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
  font-family: ${C.mono};
`;

const SectionTag = styled.span`
  font-size: 0.58rem;
  padding: 0.15rem 0.5rem;
  background: rgba(0, 242, 96, 0.08);
  border: 1px solid rgba(0, 242, 96, 0.15);
  color: rgba(0, 242, 96, 0.6);
  border-radius: 2px;
  margin-left: auto;
  flex-shrink: 0;
  align-self: center;
`;

const JoinBadge = styled.span`
  font-size: 0.55rem;
  padding: 0.1rem 0.4rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  font-family: ${C.mono};
  letter-spacing: 0.5px;
`;

const CompatBadge = styled.span`
  font-size: 0.55rem;
  padding: 0.12rem 0.5rem;
  background: rgba(100, 160, 255, 0.1);
  border: 1px solid rgba(100, 160, 255, 0.25);
  color: rgba(130, 170, 255, 0.7);
  border-radius: 2px;
  letter-spacing: 1px;
  font-family: ${C.mono};
`;

const ResultChip = styled.div`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: rgba(0, 242, 96, 0.08);
  border: 1px solid rgba(0, 242, 96, 0.25);
  color: ${C.green};
  font-size: 0.8rem;
  border-radius: 2px;
  font-weight: 700;
  margin-top: 1.5rem;
`;

const FlowArrow = styled.div`
  font-size: 0.85rem;
  color: ${C.greenFaint};
  flex-shrink: 0;
`;

const FlowStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FlowStepLabel = styled.div`
  font-size: 0.55rem;
  color: rgba(0, 242, 96, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: ${C.mono};
`;

const FlowStepText = styled.div`
  font-size: 0.76rem;
  font-weight: 700;
  color: ${C.text};
  white-space: nowrap;
`;

const DBLogNote = styled.div`
  padding: 0.8rem 1rem;
  border-top: 1px solid rgba(0, 242, 96, 0.08);
  font-size: 0.68rem;
  color: rgba(0, 242, 96, 0.55);
  line-height: 1.65;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔍  LIGHTBOX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.93);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: ${fadeIn} 0.2s ease both;
  cursor: zoom-out;
`;

const LightboxInner = styled.div`
  position: relative;
  max-width: min(90vw, 1200px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${scaleIn} 0.25s ease both;
  cursor: default;
`;

const LightboxImg = styled.img`
  max-width: 100%;
  max-height: calc(90vh - 64px);
  object-fit: contain;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  display: block;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
`;

const LightboxCaption = styled.div`
  margin-top: 1rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1.5px;
  font-family: ${C.mono};
  text-align: center;
`;

const LightboxClose = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 2rem;
  z-index: 10000;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 2px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const LightboxHint = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.18);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  pointer-events: none;
  white-space: nowrap;
`;

const Lightbox = ({ src, caption, onClose }) => {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <LightboxOverlay onClick={onClose}>
      <LightboxClose onClick={onClose}>✕</LightboxClose>
      <LightboxInner onClick={(e) => e.stopPropagation()}>
        <LightboxImg src={src} alt={caption} />
        {caption && <LightboxCaption>↑ {caption}</LightboxCaption>}
      </LightboxInner>
      <LightboxHint>ESC 또는 바깥 영역 클릭으로 닫기</LightboxHint>
    </LightboxOverlay>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔽  CODE TOGGLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ToggleWrap = styled.div`
  border: 1px solid ${C.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ToggleBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.4rem;
  background: rgba(255, 255, 255, 0.02);
  border: none;
  border-bottom: ${({ $open }) => ($open ? `1px solid ${C.border}` : "none")};
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(0, 242, 96, 0.04);
  }
`;

const ToggleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ToggleDots = styled.div`
  display: flex;
  gap: 6px;
  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ToggleLang = styled.span`
  font-size: 0.62rem;
  color: rgba(0, 242, 96, 0.55);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: ${C.mono};
`;

const ToggleLabel = styled.span`
  font-size: 0.7rem;
  color: ${C.textFaint};
  font-family: ${C.mono};
`;

const ToggleChevron = styled.span`
  font-size: 0.65rem;
  color: rgba(0, 242, 96, 0.45);
  transition: transform 0.25s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const ToggleBody = styled.div`
  display: ${({ $open }) => ($open ? "block" : "none")};
  animation: ${({ $open }) =>
    $open
      ? css`
          ${slideDown} 0.2s ease both
        `
      : "none"};
`;

const CodeBlockBody = styled.pre`
  padding: 1.8rem 2rem;
  font-family: ${C.mono};
  font-size: 0.75rem;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.55);
  overflow-x: auto;
  margin: 0;
  background: ${C.bgDeep};
  .kw {
    color: #c792ea;
  }
  .cm {
    color: rgba(255, 255, 255, 0.22);
    font-style: italic;
  }
  .hi {
    color: ${C.green};
    font-weight: 700;
  }
  .bad {
    color: rgba(255, 100, 100, 0.7);
  }
`;

const CodeToggle = ({ lang, label, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <ToggleWrap>
      <ToggleBtn $open={open} onClick={() => setOpen((o) => !o)}>
        <ToggleLeft>
          <ToggleDots>
            <span />
            <span />
            <span />
          </ToggleDots>
          <ToggleLang>{lang}</ToggleLang>
          {label && <ToggleLabel>— {label}</ToggleLabel>}
        </ToggleLeft>
        <ToggleChevron $open={open}>▼</ToggleChevron>
      </ToggleBtn>
      <ToggleBody $open={open}>{children}</ToggleBody>
    </ToggleWrap>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🗺️  SIDE NAV
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SideNavWrap = styled.nav`
  position: fixed;
  right: 1.8rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 2px;
  @media (max-width: 1280px) {
    display: none;
  }
`;

const SideNavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${({ $active }) =>
      $active ? C.green : "rgba(255,255,255,0.2)"};
    transition:
      background 0.25s,
      transform 0.25s;
    transform: ${({ $active }) => ($active ? "scale(1.4)" : "scale(1)")};
  }
  .label {
    font-size: 1rem;
    color: ${({ $active }) =>
      $active ? "rgba(0,242,96,0.95)" : "rgba(255,255,255,0.28)"};
    letter-spacing: 1.8px;
    text-transform: uppercase;
    font-family: ${C.mono};
    white-space: nowrap;
    transition: color 0.25s;
    pointer-events: none;
    line-height: 1;
  }
  &:hover .dot {
    background: rgba(255, 255, 255, 0.5);
  }
  &:hover .label {
    color: rgba(255, 255, 255, 0.55);
  }
`;

const PageSideNav = ({ activeSection }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <SideNavWrap>
      {NAV_ITEMS.map((item) => (
        <SideNavBtn
          key={item.id}
          $active={activeSection === item.id}
          onClick={() => scrollTo(item.id)}
        >
          <span className="dot" />
          <span className="label">{item.label}</span>
        </SideNavBtn>
      ))}
    </SideNavWrap>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏠  HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const BackBtn = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: ${C.green};
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Hero = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 4rem 5rem;
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 0 1.5rem 4rem;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 60% 50% at 80% 30%,
      rgba(0, 242, 96, 0.06) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 40% 40% at 20% 70%,
      rgba(0, 68, 255, 0.04) 0%,
      transparent 60%
    );
`;

const HeroLine = styled.div`
  position: absolute;
  top: 0;
  left: 4rem;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #00f260, transparent);
  opacity: 0.12;
`;

const HeroMeta = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 3px;
  text-transform: uppercase;
  animation: ${fadeUp} 0.8s ease both;
`;

const HeroTag = styled.span`
  padding: 0.3rem 0.8rem;
  border: 1px solid ${C.green};
  color: ${C.green};
  border-radius: 2px;
  font-size: 0.65rem;
`;

const HeroTitle = styled.h1`
  position: relative;
  font-size: clamp(3.5rem, 10vw, 9rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -2px;
  color: #fff;
  animation: ${fadeUp} 0.8s 0.1s ease both;
  span {
    color: ${C.green};
  }
`;

const HeroSubtitle = styled.p`
  margin-top: 2rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.8;
  animation: ${fadeUp} 0.8s 0.2s ease both;
`;

const HeroTagline = styled.div`
  margin-top: 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba(0, 242, 96, 0.3);
  background: rgba(0, 242, 96, 0.05);
  border-radius: 2px;
  font-size: 0.82rem;
  color: ${C.green};
  letter-spacing: 0.5px;
  animation: ${fadeUp} 0.8s 0.3s ease both;
  width: fit-content;
  &::before {
    content: "→";
    opacity: 0.6;
  }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏷️  PROJECT META STRIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const MetaStrip = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${C.border};
`;

const MetaStripItem = styled.div`
  border-left: 2px solid ${C.green};
  padding-left: 1.2rem;
`;

const MetaStripLabel = styled.div`
  font-size: 0.65rem;
  color: ${C.green};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
  font-family: ${C.mono};
`;

const MetaStripValue = styled.div`
  font-size: 0.9rem;
  color: ${C.text};
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🛠️  SQL HIGHLIGHTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "LEFT JOIN",
  "ON",
  "WHERE",
  "AND",
  "REPLACE",
  "AS",
  "WITH",
  "OVER",
  "PARTITION BY",
  "ORDER BY",
  "COUNT",
  "ROW_NUMBER",
  "UNION ALL",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "INNER JOIN",
  "GROUP BY",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CONVERT",
  "DATEADD",
  "YEAR",
  "GETDATE",
];

const highlightSQL = (code) => {
  let result = code.replace(/(--[^\n]*)/g, "\x00CM\x01$1\x00/CM\x01");
  SQL_KEYWORDS.forEach((kw) => {
    result = result.replace(
      new RegExp(`(?<![\\x00-\\x01a-zA-Z])${kw}(?![a-zA-Z\\x00-\\x01])`, "g"),
      `\x00KW\x01${kw}\x00/KW\x01`,
    );
  });
  return result
    .replace(/\x00KW\x01(.*?)\x00\/KW\x01/g, `<span class="kw">$1</span>`)
    .replace(/\x00CM\x01(.*?)\x00\/CM\x01/g, `<span class="cm">$1</span>`);
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊  SECTION — METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: ${C.border};
  border: 1px solid ${C.border};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: ${C.bgCard};
  padding: 1.8rem 1.6rem;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${C.green};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  &:hover::before {
    transform: scaleX(1);
  }
  &:hover {
    background: rgba(0, 242, 96, 0.03);
  }
`;

const MetricBefore = styled.div`
  font-size: 0.75rem;
  color: ${C.textDim};
  margin-bottom: 0.5rem;
`;
const MetricArrow = styled.div`
  font-size: 0.7rem;
  color: rgba(0, 242, 96, 0.5);
  margin-bottom: 0.3rem;
`;
const MetricValue = styled.div`
  font-size: ${({ long }) => (long ? "2rem" : "3.5rem")};
  font-weight: 900;
  color: ${C.green};
  line-height: 1;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(0, 242, 96, 0.3);
`;
const MetricDesc = styled.div`
  font-size: 0.82rem;
  color: ${C.textDim};
  line-height: 1.5;
`;

const MetricsSection = ({ metrics, role, environment, scale }) => (
  <Section id="metrics" style={{ marginTop: "3.5rem" }}>
    <MetaStrip>
      {[
        ["Role", role],
        ["Environment", environment],
        ["Scale", scale],
      ].map(([label, value]) => (
        <MetaStripItem key={label}>
          <MetaStripLabel>{label}</MetaStripLabel>
          <MetaStripValue>{value}</MetaStripValue>
        </MetaStripItem>
      ))}
    </MetaStrip>
    <SubLabel withLine mb="1.5rem">
      Performance Results
    </SubLabel>
    <MetricsGrid>
      {metrics.map((m, i) => (
        <MetricCard key={i}>
          <MetricBefore>{m.before}</MetricBefore>
          <MetricArrow>{m.arrow}</MetricArrow>
          <MetricValue long={m.value.length > 6}>{m.value}</MetricValue>
          <MetricDesc>{m.desc}</MetricDesc>
        </MetricCard>
      ))}
    </MetricsGrid>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚡  SECTION — QUERY ENGINEERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const IssueBanner = styled(SideBanner)`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
const IssueIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
  padding-top: 1px;
`;
const IssueLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 140, 140, 0.9);
  font-weight: 700;
  margin-bottom: 0.3rem;
`;
const IssueDesc = styled.div`
  font-size: 0.78rem;
  color: ${C.textDim};
  line-height: 1.65;
  white-space: pre-line;
`;

const TechCardTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
`;
const TechCardDesc = styled.div`
  font-size: 0.75rem;
  color: ${C.textDim};
  line-height: 1.7;
  white-space: pre-line;
`;

const QueryEngineeringSection = ({ qe }) => (
  <Section id="query">
    <SubLabel withLine mb="1.5rem">
      Query Engineering
    </SubLabel>

    {qe.issue && (
      <IssueRow>
        <IssueBanner variant="red">
          <IssueIcon>{qe.issue.icon}</IssueIcon>
          <div>
            <IssueLabel>{qe.issue.label}</IssueLabel>
            <IssueDesc>{qe.issue.desc}</IssueDesc>
          </div>
        </IssueBanner>
        <SideBanner>
          <SubLabel mb="0.6rem">Solution</SubLabel>
          <ProseText size="0.88rem">{qe.solution}</ProseText>
        </SideBanner>
      </IssueRow>
    )}

    <TwoColGrid style={{ marginBottom: "1.5rem" }}>
      {qe.techniques.map((t, i) => (
        <BorderCard key={i} accent="rgba(0,242,96,0.4)" p="1rem 1.2rem">
          <TechCardTitle>{t.label}</TechCardTitle>
          <TechCardDesc>{t.desc}</TechCardDesc>
        </BorderCard>
      ))}
    </TwoColGrid>

    {qe.codeBlock && (
      <CodeToggle lang="SQL" label="CTE + UNION ALL + ROW_NUMBER 전체 쿼리">
        <CodeBlockBody
          dangerouslySetInnerHTML={{ __html: highlightSQL(qe.codeBlock) }}
        />
      </CodeToggle>
    )}
    <ResultChip>✓ {qe.result}</ResultChip>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📐  SECTION — ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const DiagramMain = styled.div`
  background: rgba(0, 242, 96, 0.06);
  border: 1px solid rgba(0, 242, 96, 0.3);
  border-radius: 4px;
  padding: 1rem 1.4rem;
  margin-bottom: 0.8rem;
`;
const DiagramMainLabel = styled.div`
  font-size: 0.58rem;
  color: ${C.green};
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
  opacity: 0.7;
`;
const DiagramMainName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  font-family: ${C.mono};
  margin-bottom: 0.5rem;
`;
const FieldRow = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;
const DiagramChildRow = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: stretch;
  margin-bottom: 0.6rem;
`;
const DiagramConnector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 1rem;
  min-width: 24px;
`;
const ConnectLine = styled.div`
  width: 1px;
  flex: 1;
  background: rgba(0, 242, 96, 0.2);
`;
const ConnectDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid rgba(0, 242, 96, 0.4);
  flex-shrink: 0;
`;
const DiagramChildCard = styled(BorderCard)`
  flex: 1;
  border-left: 2px solid rgba(0, 242, 96, 0.25);
  border-radius: 0 4px 4px 0;
`;
const DiagramChildHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
`;
const DiagramChildName = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${C.text};
  font-family: ${C.mono};
`;
const DiagramChildRole = styled.div`
  font-size: 0.7rem;
  color: ${C.textDim};
  margin-bottom: 0.4rem;
`;

const ArchitectureSection = ({ arch, onImgClick }) => (
  <Section id="architecture">
    <SubLabel withLine mb="1.5rem">
      Data Architecture
    </SubLabel>

    {arch.issue && (
      <IssueRow>
        <IssueBanner variant="red">
          <IssueIcon>{arch.issue.icon}</IssueIcon>
          <div>
            <IssueLabel>{arch.issue.label}</IssueLabel>
            <IssueDesc>{arch.issue.desc}</IssueDesc>
          </div>
        </IssueBanner>
        <SideBanner>
          <SubLabel mb="0.6rem">Solution</SubLabel>
          <ProseText size="0.88rem">{arch.solution}</ProseText>
        </SideBanner>
      </IssueRow>
    )}

    <TwoColGrid
      gap="2rem"
      style={{ marginBottom: "1.5rem", alignItems: "start" }}
    >
      <ScreenshotBox>
        <ScrollBox h="420px">
          <ImgClickWrap
            onClick={() => onImgClick(arch.screenshot, arch.screenshotCaption)}
          >
            <ScreenshotImg src={arch.screenshot} alt="과정 상세 페이지" />
          </ImgClickWrap>
        </ScrollBox>
        <ScreenshotCaption p="0.75rem 1rem">
          ↑ {arch.screenshotCaption}
        </ScreenshotCaption>
      </ScreenshotBox>

      <div>
        <DiagramMain>
          <DiagramMainLabel>MAIN TABLE</DiagramMainLabel>
          <DiagramMainName>{arch.tables[0].name}</DiagramMainName>
          <FieldRow>
            {arch.tables[0].fields.map((f) => (
              <FieldTag key={f}>{f}</FieldTag>
            ))}
            <SectionTag>{arch.tables[0].section}</SectionTag>
          </FieldRow>
        </DiagramMain>

        {arch.tables.slice(1).map((table, i) => (
          <DiagramChildRow key={i}>
            <DiagramConnector>
              <ConnectLine />
              <ConnectDot />
              <ConnectLine style={{ flex: "none", height: "8px" }} />
            </DiagramConnector>
            <DiagramChildCard>
              <DiagramChildHeader>
                <DiagramChildName>{table.name}</DiagramChildName>
                <JoinBadge>{table.join}</JoinBadge>
              </DiagramChildHeader>
              <DiagramChildRole>
                {table.role} · {table.joinKey}
              </DiagramChildRole>
              <FieldRow>
                {table.fields.map((f) => (
                  <FieldTag key={f}>{f}</FieldTag>
                ))}
                <SectionTag>{table.section}</SectionTag>
              </FieldRow>
            </DiagramChildCard>
          </DiagramChildRow>
        ))}
      </div>
    </TwoColGrid>
    <CodeToggle lang="SQL" label="단일 쿼리로 4개 DB 통합">
      <CodeBlockBody
        dangerouslySetInnerHTML={{ __html: highlightSQL(arch.codeBlock) }}
      />
    </CodeToggle>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋  SECTION — BOARD SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const EditorCardTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.35rem;
`;
const EditorCardDesc = styled.div`
  font-size: 0.77rem;
  color: ${C.textDim};
  line-height: 1.7;
  white-space: pre-line;
`;
const LegacyBanner = styled(BorderCard)`
  border-left-width: 3px;
  font-size: 0.85rem;
  color: ${C.textDim};
  line-height: 1.85;
  white-space: pre-line;
`;
const LegacyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BoardSystemSection = ({ board, onImgClick }) => (
  <Section id="board">
    <SubLabel withLine mb="1.5rem">
      Board System — Rich Editor
    </SubLabel>
    <SideBanner style={{ marginBottom: "1.8rem" }}>
      <SubLabel mb="0.6rem">Background</SubLabel>
      <ProseText size="0.88rem">{board.background}</ProseText>
    </SideBanner>

    <TwoColGrid style={{ marginBottom: "2rem" }}>
      {board.screenshots.map((s, i) => (
        <ScreenshotBox key={i}>
          <ScrollBox h="320px">
            <ImgClickWrap onClick={() => onImgClick(s.src, s.caption)}>
              <ScreenshotImg src={s.src} alt={s.caption} />
            </ImgClickWrap>
          </ScrollBox>
          <ScreenshotCaption>↑ {s.caption}</ScreenshotCaption>
        </ScreenshotBox>
      ))}
    </TwoColGrid>

    <SubLabel>Rich Editor Implementation</SubLabel>
    {board.editor.map((item, i) => (
      <BorderCard
        key={i}
        accent="rgba(0,242,96,0.3)"
        p="1rem 1.2rem"
        mb="0.8rem"
      >
        <EditorCardTitle>{item.label}</EditorCardTitle>
        <EditorCardDesc>{item.desc}</EditorCardDesc>
      </BorderCard>
    ))}

    {board.outcome && board.outcome.length > 0 && (
      <div style={{ marginTop: "1.5rem" }}>
        <SubLabel>도입 효과</SubLabel>
        <TwoColGrid>
          {board.outcome.map((item, i) => (
            <BorderCard key={i} accent="rgba(0,242,96,0.4)" p="1rem 1.2rem">
              <EditorCardTitle>{item.label}</EditorCardTitle>
              <EditorCardDesc>{item.desc}</EditorCardDesc>
            </BorderCard>
          ))}
        </TwoColGrid>
      </div>
    )}

    {board.legacyIntegration && (
      <div style={{ marginTop: "1.5rem" }}>
        <LegacyHeader>
          <SubLabel mb="1rem">Legacy Integration</SubLabel>
          <CompatBadge style={{ marginBottom: "1rem" }}>
            BACKWARD COMPAT
          </CompatBadge>
        </LegacyHeader>
        <LegacyBanner accent="rgba(100,160,255,0.4)" p="1.2rem 1.6rem">
          {board.legacyIntegration}
        </LegacyBanner>
      </div>
    )}

    {board.security && board.security.length > 0 && (
      <SecurityInlineBlock
        items={board.security}
        title="Security — Board System"
      />
    )}
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔔  SECTION — POPUP SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const PopupArchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: ${C.border};
  border: 1px solid ${C.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.8rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const PopupArchCard = styled.div`
  background: ${C.bgCard};
  padding: 1.6rem 1.8rem;
  position: relative;
  overflow: hidden;
  transition: background 0.25s;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ accent }) => accent || C.green};
    opacity: 0.7;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }
`;
const PopupArchBadge = styled.div`
  font-size: 0.58rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: ${C.mono};
  margin-bottom: 0.5rem;
  color: ${({ accent }) => accent};
`;
const PopupArchTitle = styled.div`
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`;
const PopupArchDesc = styled.div`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.7;
  white-space: pre-line;
`;
const FlowRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 1.2rem 1.6rem;
  background: #0a0a0a;
  border: 1px solid ${C.border};
  border-radius: 4px;
  margin-bottom: 1.8rem;
  flex-wrap: wrap;
`;
const ScreenshotTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  font-size: 0.6rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: ${C.mono};
  color: ${({ highlight }) => (highlight ? "rgba(0,242,96,0.7)" : C.textFaint)};
`;
const ScreenshotDots = styled.div`
  display: flex;
  gap: 4px;
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    display: inline-block;
  }
`;
const FeatureCardIcon = styled.div`
  font-size: 1.1rem;
  flex-shrink: 0;
  padding-top: 1px;
`;
const FeatureCardTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${C.text};
  margin-bottom: 0.3rem;
`;
const FeatureCardDesc = styled.div`
  font-size: 0.74rem;
  color: ${C.textDim};
  line-height: 1.65;
  white-space: pre-line;
`;
const FeatureCardInner = styled.div``;

const PopupManagementSection = ({ data, onImgClick }) => (
  <Section id="popup">
    <SubLabel withLine mb="1.5rem">
      Time-based Campaign Popup System
    </SubLabel>

    <IssueRow>
      <IssueBanner variant="red">
        <IssueIcon>📢</IssueIcon>
        <div>
          <IssueLabel>팝업 운영 구조 부재</IssueLabel>
          <IssueDesc>
            신규 과정 개설 시 HTML 직접 수정 필요 — 노출 기간 제어·클릭 통계
            집계 불가, 담당자 수동 개입 구조
          </IssueDesc>
        </div>
      </IssueBanner>
      <SideBanner>
        <SubLabel mb="0.6rem">Solution</SubLabel>
        <ProseText size="0.88rem">{data.solution}</ProseText>
      </SideBanner>
    </IssueRow>

    {data.outcome && (
      <SideBanner style={{ marginBottom: "1.8rem" }}>
        <SubLabel mb="0.5rem">도입 효과</SubLabel>
        <ProseText size="0.88rem">{data.outcome}</ProseText>
      </SideBanner>
    )}

    <SubLabel>System Architecture — 3 Layers</SubLabel>
    <PopupArchGrid>
      {data.archCards.map((card, i) => (
        <PopupArchCard key={i} accent={card.accent}>
          <PopupArchBadge accent={card.accent}>{card.badge}</PopupArchBadge>
          <PopupArchTitle>{card.title}</PopupArchTitle>
          <PopupArchDesc>{card.desc}</PopupArchDesc>
        </PopupArchCard>
      ))}
    </PopupArchGrid>

    <SubLabel>Data Flow</SubLabel>
    <FlowRow>
      {data.flowSteps.map((step, i) => (
        <>
          <FlowStep key={`s${i}`}>
            <FlowStepLabel>{step.label}</FlowStepLabel>
            <FlowStepText>{step.text}</FlowStepText>
          </FlowStep>
          {i < data.flowSteps.length - 1 && (
            <FlowArrow key={`a${i}`}>→</FlowArrow>
          )}
        </>
      ))}
    </FlowRow>

    <SubLabel>Admin Interface — 등록 · 수정</SubLabel>
    <TwoColGrid style={{ marginBottom: "2rem" }}>
      {[
        {
          key: "register",
          label: "팝업 등록 — popup_write.asp",
          shot: data.screenshots.register,
          highlight: false,
        },
        {
          key: "edit",
          label: "팝업 수정 — popup_edit.asp",
          shot: data.screenshots.edit,
          highlight: true,
        },
      ].map(({ key, label, shot, highlight }) => (
        <ScreenshotBox key={key} highlight={highlight}>
          <ScreenshotTopBar highlight={highlight}>
            <ScreenshotDots>
              <span />
              <span />
              <span />
            </ScreenshotDots>
            {label}
          </ScreenshotTopBar>
          <ScrollBox h="560px">
            <ImgClickWrap onClick={() => onImgClick(shot.src, shot.caption)}>
              <ScreenshotImg src={shot.src} alt={shot.caption} />
            </ImgClickWrap>
          </ScrollBox>
          <ScreenshotCaption>↑ {shot.caption}</ScreenshotCaption>
        </ScreenshotBox>
      ))}
    </TwoColGrid>

    <SubLabel>Key Features</SubLabel>
    <TwoColGrid style={{ marginBottom: "2rem" }}>
      {data.features.map((feat, i) => (
        <BorderCard
          key={i}
          accent={feat.accent}
          p="1rem 1.2rem"
          style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
        >
          <FeatureCardIcon>{feat.icon}</FeatureCardIcon>
          <FeatureCardInner>
            <FeatureCardTitle>{feat.label}</FeatureCardTitle>
            <FeatureCardDesc>{feat.desc}</FeatureCardDesc>
          </FeatureCardInner>
        </BorderCard>
      ))}
    </TwoColGrid>

    <SubLabel>DB Schema — 로그 분리 설계</SubLabel>
    <TwoColGrid style={{ marginBottom: "1.5rem" }}>
      <DBTableBox>
        <DBTableHeader>
          <DBTableName>{data.tables.main.name}</DBTableName>
          <DBTableRole>{data.tables.main.role}</DBTableRole>
        </DBTableHeader>
        {data.tables.main.rows.map(([col, type, desc], i) => (
          <DBTableRow key={i}>
            <DBColText>{col}</DBColText>
            <DBTypeText>{type}</DBTypeText>
            <DBColText dim>{desc}</DBColText>
          </DBTableRow>
        ))}
      </DBTableBox>
      <DBTableBox highlight>
        <DBTableHeader highlight>
          <DBTableName highlight>{data.tables.log.name}</DBTableName>
          <DBTableRole>{data.tables.log.role}</DBTableRole>
        </DBTableHeader>
        {data.tables.log.rows.map(([col, type, desc], i) => (
          <DBTableRow key={i}>
            <DBColText>{col}</DBColText>
            <DBTypeText>{type}</DBTypeText>
            <DBColText dim>{desc}</DBColText>
          </DBTableRow>
        ))}
        <DBLogNote>
          → pop_idx 기준 기간별 집계 가능
          <br />→ A/B 테스트 · CTR 분석 확장 설계
        </DBLogNote>
      </DBTableBox>
    </TwoColGrid>

    <SubLabel>사용자 페이지 연동 — 노출 쿼리</SubLabel>
    <SideBanner style={{ marginBottom: "1.5rem" }}>
      <SubLabel mb="0.4rem">Logic</SubLabel>
      <ProseText size="0.85rem">{data.queryDesc}</ProseText>
    </SideBanner>
    <CodeToggle lang="SQL" label="기간 기반 팝업 노출 쿼리 (사용자 페이지)">
      <CodeBlockBody
        dangerouslySetInnerHTML={{ __html: highlightSQL(data.queryCode) }}
      />
    </CodeToggle>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋  SECTION — TEMPLATE SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SchemaTable = styled.div`
  border: 1px solid ${C.border};
  border-radius: 4px;
  overflow: hidden;
`;
const SchemaHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1fr;
  padding: 0.6rem 1rem;
  background: rgba(0, 242, 96, 0.05);
  border-bottom: 1px solid ${C.border};
  font-size: 0.6rem;
  color: ${C.greenDim};
  letter-spacing: 2px;
  text-transform: uppercase;
`;
const SchemaDataRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1fr;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;
const SchemaCol = styled.div`
  font-family: ${C.mono};
  font-size: 0.72rem;
  color: ${C.text};
`;
const SchemaType = styled.div`
  font-family: ${C.mono};
  font-size: 0.65rem;
  color: rgba(130, 170, 255, 0.7);
`;
const SchemaDesc = styled.div`
  font-size: 0.65rem;
  color: ${C.textFaint};
`;
const HighlightCardTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
`;
const HighlightCardDesc = styled.div`
  font-size: 0.78rem;
  color: ${C.textDim};
  line-height: 1.7;
  white-space: pre-line;
`;

const TemplateSystemSection = ({ tpl, onImgClick }) => (
  <Section id="template">
    <SubLabel withLine mb="1.5rem">
      Template System
    </SubLabel>

    <IssueRow>
      <IssueBanner variant="red">
        <IssueIcon>🔄</IssueIcon>
        <div>
          <IssueLabel>반복 업무 비효율</IssueLabel>
          <IssueDesc>{tpl.background}</IssueDesc>
        </div>
      </IssueBanner>
      <SideBanner>
        <SubLabel mb="0.6rem">Solution</SubLabel>
        <ProseText size="0.88rem">{tpl.solution}</ProseText>
      </SideBanner>
    </IssueRow>

    {tpl.outcome && (
      <SideBanner style={{ marginBottom: "1.8rem" }}>
        <SubLabel mb="0.5rem">도입 효과</SubLabel>
        <ProseText size="0.88rem">{tpl.outcome}</ProseText>
      </SideBanner>
    )}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {tpl.screenshots.map((s, i) => (
        <ScreenshotBox key={i}>
          <ScrollBox h="280px">
            <ImgClickWrap onClick={() => onImgClick(s.src, s.caption)}>
              <ScreenshotImg
                src={s.src}
                alt={s.caption}
                style={{ opacity: 0.85 }}
              />
            </ImgClickWrap>
          </ScrollBox>
          <ScreenshotCaption>↑ {s.caption}</ScreenshotCaption>
        </ScreenshotBox>
      ))}
    </div>

    <TwoColGrid gap="2rem" style={{ alignItems: "start" }}>
      <div>
        <SubLabel>DB Schema — tblBoardAnswerTemplate</SubLabel>
        <SchemaTable>
          <SchemaHeaderRow>
            <div>Column</div>
            <div>Type</div>
            <div>Description</div>
          </SchemaHeaderRow>
          {tpl.schema.map((row) => (
            <SchemaDataRow key={row.column}>
              <SchemaCol>{row.column}</SchemaCol>
              <SchemaType>{row.type}</SchemaType>
              <SchemaDesc>{row.desc}</SchemaDesc>
            </SchemaDataRow>
          ))}
        </SchemaTable>
      </div>
      <div>
        <SubLabel>Key Points</SubLabel>
        {tpl.highlights.map((h, i) => (
          <BorderCard
            key={i}
            accent="rgba(0,242,96,0.3)"
            p="1rem 1.2rem"
            mb="0.8rem"
          >
            <HighlightCardTitle>{h.label}</HighlightCardTitle>
            <HighlightCardDesc>{h.desc}</HighlightCardDesc>
          </BorderCard>
        ))}
      </div>
    </TwoColGrid>

    {tpl.security && tpl.security.length > 0 && (
      <SecurityInlineBlock
        items={tpl.security}
        title="Security & Access Control — Template System"
      />
    )}
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔄  SECTION — AGE STATISTICS QUERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const AgeQueryOutputBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: ${C.bgDeep};
  border: 1px solid ${C.border};
  border-radius: 4px;
  font-size: 0.78rem;
  color: ${C.textDim};
  line-height: 1.7;
`;
const AgeQueryOutputLabel = styled.span`
  font-size: 0.6rem;
  color: rgba(0, 242, 96, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
  font-family: ${C.mono};
`;
const AgeQueryHighlight = styled.span`
  color: rgba(0, 242, 96, 0.9);
  font-weight: 700;
`;

const KpcpRenewalSection = ({ renewal, onImgClick }) => (
  <Section id="kpcp">
    <SubLabel withLine mb="1.5rem">
      Age Statistics Query — license DB 연동
    </SubLabel>
    <ProseText m="0 0 1.5rem">{renewal.desc}</ProseText>

    {renewal.screenshot && (
      <ScreenshotBox style={{ marginBottom: "1.5rem" }}>
        <ScrollBox h="320px">
          <ImgClickWrap
            onClick={() =>
              onImgClick(renewal.screenshot.src, renewal.screenshot.caption)
            }
          >
            <ScreenshotImg
              src={renewal.screenshot.src}
              alt={renewal.screenshot.caption}
              style={{ opacity: 0.88 }}
            />
          </ImgClickWrap>
        </ScrollBox>
        <ScreenshotCaption>↑ {renewal.screenshot.caption}</ScreenshotCaption>
      </ScreenshotBox>
    )}

    <TwoColGrid style={{ marginBottom: "1.5rem" }}>
      {renewal.ageQuery.points.map((p, i) => (
        <BorderCard key={i} accent="rgba(0,242,96,0.3)" p="1rem 1.2rem">
          <HighlightCardTitle>{p.label}</HighlightCardTitle>
          <HighlightCardDesc>{p.desc}</HighlightCardDesc>
        </BorderCard>
      ))}
    </TwoColGrid>

    <CodeToggle lang="SQL (CTE)" label="자격증별 나이대 TOP 2 추출">
      <CodeBlockBody
        dangerouslySetInnerHTML={{
          __html: highlightSQL(renewal.ageQuery.codeBlock),
        }}
      />
    </CodeToggle>
    <CodeToggle lang="Classic ASP" label="결과 가공 및 표시 문자열 조합">
      <CodeBlockBody
        dangerouslySetInnerHTML={{
          __html: highlightSQL(renewal.ageQuery.aspResult),
        }}
      />
    </CodeToggle>
    <AgeQueryOutputBox>
      <AgeQueryOutputLabel>Output Example</AgeQueryOutputLabel>
      *본원 통계 결과 <AgeQueryHighlight>30대, 40대</AgeQueryHighlight>에서 가장
      많이 취득한 자격증입니다
    </AgeQueryOutputBox>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const StackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3.5rem;
`;
const StackGroup = styled.div``;
const StackGroupLabel = styled.div`
  font-size: 0.6rem;
  color: rgba(0, 242, 96, 0.5);
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: ${C.mono};
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 242, 96, 0.1);
`;
const StackTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const StackTag = styled.span`
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  background: ${C.bgCard};
  border: 1px solid ${C.border};
  color: ${C.textDim};
  letter-spacing: 0.5px;
  transition: all 0.3s;
  cursor: default;
  &:hover {
    border-color: ${C.green};
    color: ${C.green};
    background: rgba(0, 242, 96, 0.08);
  }
`;

const TechStackSection = ({ stackGroups }) => (
  <Section id="stack">
    <SubLabel withLine mb="1.5rem">
      Tech Stack
    </SubLabel>
    <StackGrid>
      {stackGroups.map((group) => (
        <StackGroup key={group.category}>
          <StackGroupLabel>{group.category}</StackGroupLabel>
          <StackTagList>
            {group.items.map((item) => (
              <StackTag key={item}>{item}</StackTag>
            ))}
          </StackTagList>
        </StackGroup>
      ))}
    </StackGrid>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📅  TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${C.border};
`;
const TimelineDate = styled.div`
  font-size: 0.68rem;
  color: ${C.textFaint};
  letter-spacing: 1px;
  padding-top: 0.15rem;
`;
const TimelineContent = styled.div`
  font-size: 0.85rem;
  color: ${C.textDim};
  line-height: 1.7;
`;
const TimelineTitle = styled.strong`
  color: ${C.text};
  font-weight: 700;
`;

const TimelineSection = ({ timeline }) => (
  <Section id="timeline">
    <SubLabel withLine mb="1.5rem">
      Major Milestones
    </SubLabel>
    {timeline.map((t, i) => (
      <TimelineItem key={i}>
        <TimelineDate>{t.date}</TimelineDate>
        <TimelineContent>
          <TimelineTitle>{t.content}</TimelineTitle> — {t.detail}
        </TimelineContent>
      </TimelineItem>
    ))}
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === Number(id));

  const [lightbox, setLightbox] = useState(null);
  const [activeSection, setActiveSection] = useState("metrics");

  const openLightbox = useCallback(
    (src, caption) => setLightbox({ src, caption }),
    [],
  );
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(({ id: sectionId }) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(sectionId);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [project]);

  if (!project) {
    return (
      <Wrapper
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "4rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            404
          </div>
          <div style={{ color: C.textDim, marginBottom: "2rem" }}>
            프로젝트를 찾을 수 없습니다.
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: `1px solid rgba(255,255,255,0.2)`,
              color: "#fff",
              padding: "0.8rem 2rem",
              cursor: "pointer",
            }}
          >
            돌아가기
          </button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          caption={lightbox.caption}
          onClose={closeLightbox}
        />
      )}
      <PageSideNav activeSection={activeSection} />

      <BackBtn onClick={() => navigate(-1)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
        Back
      </BackBtn>

      <Hero>
        <HeroBg />
        <HeroLine />
        <CodeBgWrap>
          <CodeBgTrack>
            {[...HERO_CODE_LINES, ...HERO_CODE_LINES].map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </CodeBgTrack>
        </CodeBgWrap>
        <HeroMeta>
          <HeroTag>{project.tag}</HeroTag>
          <span>{project.period}</span>
          <span>·</span>
          <span>재직 중 작업</span>
        </HeroMeta>
        <HeroTitle>
          {project.title
            .split("")
            .map((char, i) =>
              char === "원" ? <span key={i}>{char}</span> : char,
            )}
        </HeroTitle>
        <HeroSubtitle>{project.subtitle}</HeroSubtitle>
        <HeroTagline>{project.tagline}</HeroTagline>
      </Hero>

      <Content>
        <MetricsSection
          metrics={project.metrics}
          role={project.role}
          environment={project.environment}
          scale={project.scale}
        />

        {project.queryEngineering && (
          <QueryEngineeringSection qe={project.queryEngineering} />
        )}
        {project.architecture && (
          <ArchitectureSection
            arch={project.architecture}
            onImgClick={openLightbox}
          />
        )}
        {project.boardSystem && (
          <BoardSystemSection
            board={project.boardSystem}
            onImgClick={openLightbox}
          />
        )}
        {project.popupSystem && (
          <PopupManagementSection
            data={project.popupSystem}
            onImgClick={openLightbox}
          />
        )}
        {project.templateSystem && (
          <TemplateSystemSection
            tpl={project.templateSystem}
            onImgClick={openLightbox}
          />
        )}
        {project.kpcpRenewal && (
          <KpcpRenewalSection
            renewal={project.kpcpRenewal}
            onImgClick={openLightbox}
          />
        )}

        <TechStackSection stackGroups={project.stackGroups} />
        <TimelineSection timeline={project.timeline} />
      </Content>
    </Wrapper>
  );
};

export default ProjectDetail;
