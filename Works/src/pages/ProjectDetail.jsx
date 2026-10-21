import { Fragment, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { projects } from "../data/projects";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🗺️  NAV
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const NAV_ITEMS = [
  { id: "metrics",      label: "Performance",        key: "metrics" },
  { id: "architecture", label: "Architecture",       key: "architecture" },
  { id: "systemArch",   label: "System Design",      key: "systemArch" },
  { id: "collect",      label: "Data Collection",    key: "collect" },
  { id: "ai",           label: "AI Pipeline",        key: "ai" },
  { id: "realtime",     label: "Realtime SSE",       key: "realtime" },
  { id: "security",     label: "Security & Ops",     key: "security" },
  { id: "recruit",      label: "Recruit Center",     key: "recruitCenter" },
  { id: "board",        label: "Board System",       key: "boardSystem" },
  { id: "popup",        label: "Popup System",       key: "popupSystem" },
  { id: "template",     label: "Template System",    key: "templateSystem" },
  { id: "kpcp",         label: "Stats Query",        key: "kpcpRenewal" },
  { id: "stack",        label: "Tech Stack",         key: "stackGroups" },
  { id: "timeline",     label: "Timeline",           key: "timeline" },
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

/* 마이크로레이더 — Node.js 수집/분석 파이프라인 배경 */
const HERO_CODE_LINES_JS = [
  `// prWirePoller — 1차 보도자료 30초 폴링`,
  `setInterval(pollWires, 30_000);`,
  ``,
  `async function pollWires() {`,
  `  const feeds = await Promise.allSettled([`,
  `    fetchFeed(GLOBE_NEWSWIRE),`,
  `    fetchFeed(PR_NEWSWIRE),`,
  `    fetchFeed(NEWSFILE),`,
  `  ]);`,
  `  for (const item of flatten(feeds)) {`,
  `    const ticker = extractTicker(item);`,
  `    if (!ticker) continue;`,
  ``,
  `    const fresh = await redis.set(`,
  `      'dedup:news:' + item.url,`,
  `      1, 'NX', 'EX', WEEK`,
  `    );`,
  `    if (!fresh) continue;`,
  ``,
  `    const meta = await getMeta(ticker);`,
  `    if (meta.marketCap > CAP_LIMIT) continue;`,
  ``,
  `    const row = await saveNews(item, meta);`,
  `    broadcast('news', row);   // 1차 송출`,
  `  }`,
  `}`,
  `// ─────────────────────────────────`,
  `// aiQueue — 72초 간격, 최신순 처리`,
  `const key = 'gemini:rpd:' + todayPT();`,
  `const used = await redis.incr(key);`,
  `if (used > DAILY_BUDGET) return skip('RPD');`,
  ``,
  `const res = await callGemini(MODEL, {`,
  `  generationConfig: {`,
  `    temperature: 0,`,
  `    responseMimeType: 'application/json',`,
  `    thinkingConfig: { thinkingBudget: 0 },`,
  `  },`,
  `});`,
  ``,
  `if (res.status === 429) {`,
  `  if (isRpm(res)) return retryWithBackoff();`,
  `  if (isRpd(res)) return markSkipped(item);`,
  `  return pauseQueue(ONE_HOUR);`,
  `}`,
  ``,
  `await updateGrade(item.id, res.json);`,
  `broadcast('grade_update', {   // 2차 패치`,
  `  id: item.id, grade, summary,`,
  `});`,
];

const HERO_CODE_SETS = {
  sql: HERO_CODE_LINES,
  js: HERO_CODE_LINES_JS,
};

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

const PanelLayout = styled.div`
  display: flex;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3.5rem 4rem 6rem;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 2.5rem 1.5rem 4rem;
    gap: 2rem;
  }
`;

const TabNav = styled.nav`
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  @media (max-width: 1024px) {
    position: static;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const ContentPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

const AnimatedContent = styled.div`
  animation: ${fadeUp} 0.32s cubic-bezier(0.25, 1, 0.3, 1) both;
`;

const Section = styled.section`
  margin-bottom: 4.5rem;
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
  ${({ $withLine }) =>
    $withLine &&
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
    ${({ $highlight }) => ($highlight ? "rgba(0,242,96,0.3)" : C.border)};
  border-radius: 4px;
  overflow: hidden;
  background: ${C.bgCard};
  transition: border-color 0.3s;
  &:hover {
    border-color: ${({ $highlight }) =>
      $highlight ? "rgba(0,242,96,0.6)" : "rgba(255,255,255,0.15)"};
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
    ${({ $highlight }) => ($highlight ? "rgba(0,242,96,0.2)" : C.border)};
  border-radius: 4px;
  overflow: hidden;
  background: #0a0a0a;
`;

const DBTableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background: ${({ $highlight }) =>
    $highlight ? "rgba(0,242,96,0.05)" : "rgba(255,255,255,0.02)"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const DBTableName = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: ${C.mono};
  color: ${({ $highlight }) => ($highlight ? "rgba(0,242,96,0.9)" : C.text)};
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
  color: ${({ $dim }) => ($dim ? C.textFaint : C.text)};
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

const SideNavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 9px 0;
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${({ $active }) =>
      $active ? C.green : "rgba(255,255,255,0.2)"};
    transition:
      background 0.25s,
      transform 0.25s;
    transform: ${({ $active }) => ($active ? "scale(1.3)" : "scale(1)")};
  }
  .label {
    font-size: 0.82rem;
    color: ${({ $active }) =>
      $active ? "rgba(0,242,96,0.95)" : "rgba(255,255,255,0.4)"};
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: ${C.mono};
    white-space: nowrap;
    transition: color 0.25s;
    pointer-events: none;
    line-height: 1;
    font-weight: ${({ $active }) => ($active ? 700 : 400)};
  }
  &:hover .dot {
    background: rgba(255, 255, 255, 0.6);
  }
  &:hover .label {
    color: rgba(255, 255, 255, 0.7);
  }
  @media (max-width: 1024px) {
    padding: 0.4rem 1rem;
    border: 1px solid ${({ $active }) =>
      $active ? C.greenBorder : "rgba(255,255,255,0.08)"};
    border-radius: 4px;
    background: ${({ $active }) =>
      $active ? "rgba(0,242,96,0.06)" : "transparent"};
  }
`;

const PageSideNav = ({ activeSection, onSelect, items }) => (
  <TabNav>
    {items.map((item) => (
      <SideNavBtn
        key={item.id}
        $active={activeSection === item.id}
        onClick={() => onSelect(item.id)}
      >
        <span className="dot" />
        <span className="label">{item.label}</span>
      </SideNavBtn>
    ))}
  </TabNav>
);

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

const HeroLiveLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${C.green};
  letter-spacing: 2px;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 242, 96, 0.3);
  transition:
    color 0.25s,
    border-color 0.25s;
  &::after {
    content: "↗";
    font-size: 0.85em;
    opacity: 0.7;
  }
  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.5);
  }
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

/* 치환 중간 단계를 표시하는 마커.
   사설 사용 영역(U+E000~) 문자라 소스 코드 텍스트에 등장할 일이 없다.
   제어문자(\x00)를 쓰면 정규식 린트(no-control-regex)에 걸린다. */
const MARK_OPEN = "\uE000";
const MARK_CLOSE = "\uE001";

const wrap = (tag, body) => `${MARK_OPEN}${tag}${MARK_CLOSE}${body}${MARK_OPEN}/${tag}${MARK_CLOSE}`;

const unwrap = (text, tag, cls) =>
  text.replace(
    new RegExp(`${MARK_OPEN}${tag}${MARK_CLOSE}(.*?)${MARK_OPEN}/${tag}${MARK_CLOSE}`, "g"),
    `<span class="${cls}">$1</span>`,
  );

const highlightSQL = (code) => {
  let result = code.replace(/(--[^\n]*)/g, wrap("CM", "$1"));
  SQL_KEYWORDS.forEach((kw) => {
    result = result.replace(
      new RegExp(
        `(?<![${MARK_OPEN}${MARK_CLOSE}a-zA-Z])${kw}(?![a-zA-Z${MARK_OPEN}${MARK_CLOSE}])`,
        "g",
      ),
      wrap("KW", kw),
    );
  });
  return unwrap(unwrap(result, "KW", "kw"), "CM", "cm");
};

/* ── JS / Nginx conf 하이라이터 ──────────────────────
   SQL과 달리 <= => 같은 기호가 섞이므로 HTML 이스케이프가 먼저다.
   주석은 라인 단위로 잘라내고 코드 부분에만 키워드를 칠한다
   (그래야 class="kw" 안의 class 같은 토큰이 재치환되지 않는다).
─────────────────────────────────────────────────── */

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const JS_KEYWORDS = [
  "const", "let", "var", "async", "await", "function", "return", "if", "else",
  "for", "of", "in", "new", "try", "catch", "throw", "class", "export",
  "import", "from", "typeof", "null", "true", "false", "continue", "break",
];

/* 마커를 span으로 바꾸는 시점이 키워드 치환 이후라
   class="kw" 안의 class 같은 토큰이 다시 매칭되지 않는다. */
const markKeywords = (text, keywords) => {
  let out = escapeHtml(text);
  keywords.forEach((kw) => {
    const edge = `[\\w$${MARK_OPEN}${MARK_CLOSE}]`;
    out = out.replace(
      new RegExp(`(?<!${edge})${kw}(?!${edge})`, "g"),
      `${MARK_OPEN}${kw}${MARK_CLOSE}`,
    );
  });
  return out
    .split(MARK_OPEN)
    .join(`<span class="kw">`)
    .split(MARK_CLOSE)
    .join(`</span>`);
};

/* 주석 토큰(// 또는 #) 기준으로 라인을 쪼개 각각 처리 */
const highlightLineComment = (code, token, keywords) =>
  code
    .split("\n")
    .map((line) => {
      const at = line.indexOf(token);
      const codePart = at === -1 ? line : line.slice(0, at);
      const commentPart = at === -1 ? "" : line.slice(at);
      const head = markKeywords(codePart, keywords);
      return commentPart
        ? `${head}<span class="cm">${escapeHtml(commentPart)}</span>`
        : head;
    })
    .join("\n");

const highlightJS = (code) => highlightLineComment(code, "//", JS_KEYWORDS);

const CONF_KEYWORDS = ["location", "server", "proxy_pass", "root", "try_files"];

const highlightConf = (code) =>
  highlightLineComment(code, "#", CONF_KEYWORDS);

const highlightCode = (code, lang = "") => {
  const l = lang.toLowerCase();
  if (l.includes("nginx") || l.includes("conf")) return highlightConf(code);
  if (l.includes("js") || l.includes("node")) return highlightJS(code);
  return highlightSQL(code);
};

/* CodeToggle + 하이라이팅을 한 번에 묶은 헬퍼 */
const CodeBlock = ({ lang, label, code, highlightAs }) => (
  <CodeToggle lang={lang} label={label}>
    <CodeBlockBody
      dangerouslySetInnerHTML={{ __html: highlightCode(code, highlightAs ?? lang) }}
    />
  </CodeToggle>
);

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
  font-size: ${({ $long }) => ($long ? "2rem" : "3.5rem")};
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
  <Section id="metrics">
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
    <SubLabel $withLine mb="1.5rem">
      Performance Results
    </SubLabel>
    <MetricsGrid>
      {metrics.map((m, i) => (
        <MetricCard key={i}>
          <MetricBefore>{m.before}</MetricBefore>
          <MetricArrow>{m.arrow}</MetricArrow>
          <MetricValue $long={m.value.length > 6}>{m.value}</MetricValue>
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
    <SubLabel $withLine mb="1.5rem">
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
   📋  SECTION — BOARD SYSTEM (게시판 리뉴얼 + 쿼리 최적화 통합)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const BoardWithQuerySection = ({ board, qe, onImgClick }) => (
  <Section id="board">
    <SubLabel $withLine mb="1.5rem">
      Board System — 게시판 리뉴얼 · 쿼리 최적화
    </SubLabel>

    {/* 배경 + 문제 */}
    <IssueRow>
      <IssueBanner variant="red">
        <IssueIcon>{qe.issue.icon}</IssueIcon>
        <div>
          <IssueLabel>{qe.issue.label}</IssueLabel>
          <IssueDesc>{qe.issue.desc}</IssueDesc>
        </div>
      </IssueBanner>
      <SideBanner>
        <SubLabel mb="0.6rem">배경</SubLabel>
        <ProseText size="0.88rem">{board.background}</ProseText>
      </SideBanner>
    </IssueRow>

    {/* 해결 + 결과 */}
    <SideBanner style={{ marginBottom: "1rem" }}>
      <SubLabel mb="0.5rem">Solution</SubLabel>
      <ProseText size="0.88rem">{qe.solution}</ProseText>
    </SideBanner>
    <ResultChip>✓ {qe.result}</ResultChip>

    <CodeToggle lang="SQL" label="CTE + UNION ALL + ROW_NUMBER 전체 쿼리">
      <CodeBlockBody
        dangerouslySetInnerHTML={{ __html: highlightSQL(qe.codeBlock) }}
      />
    </CodeToggle>

    {/* 스크린샷 2개 */}
    <SubLabel style={{ marginTop: "2.5rem" }}>에디터 · 게시판 화면</SubLabel>
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

    {/* 에디터 + 이미지 업로드 파이프라인 */}
    <SubLabel>구현 — 에디터 · 이미지 업로드 파이프라인</SubLabel>
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

    {/* 하위 호환 */}
    {board.legacyIntegration && (
      <div style={{ marginTop: "1.5rem" }}>
        <LegacyHeader>
          <SubLabel mb="1rem">Legacy Integration</SubLabel>
          <CompatBadge style={{ marginBottom: "1rem" }}>BACKWARD COMPAT</CompatBadge>
        </LegacyHeader>
        <LegacyBanner accent="rgba(100,160,255,0.4)" p="1.2rem 1.6rem">
          {board.legacyIntegration}
        </LegacyBanner>
      </div>
    )}

    {/* 보안 */}
    {board.security?.length > 0 && (
      <SecurityInlineBlock
        items={board.security}
        title="Security — Board System"
      />
    )}
  </Section>
);

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

/* 좌→우 플로우 스트립 — 단계 사이에 화살표를 끼워 넣는다.
   프래그먼트에 key 가 필요해서 <> 대신 Fragment 를 쓴다. */
const FlowStrip = ({ steps }) => (
  <FlowRow>
    {steps.map((step, i) => (
      <Fragment key={i}>
        <FlowStep>
          <FlowStepLabel>{step.label}</FlowStepLabel>
          <FlowStepText>{step.text}</FlowStepText>
        </FlowStep>
        {i < steps.length - 1 && <FlowArrow>→</FlowArrow>}
      </Fragment>
    ))}
  </FlowRow>
);

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
  color: ${({ $highlight }) => ($highlight ? "rgba(0,242,96,0.7)" : C.textFaint)};
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
    <SubLabel $withLine mb="1.5rem">
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
    <FlowStrip steps={data.flowSteps} />

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
        <ScreenshotBox key={key} $highlight={highlight}>
          <ScreenshotTopBar $highlight={highlight}>
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
            <DBColText $dim>{desc}</DBColText>
          </DBTableRow>
        ))}
      </DBTableBox>
      <DBTableBox $highlight>
        <DBTableHeader $highlight>
          <DBTableName $highlight>{data.tables.log.name}</DBTableName>
          <DBTableRole>{data.tables.log.role}</DBTableRole>
        </DBTableHeader>
        {data.tables.log.rows.map(([col, type, desc], i) => (
          <DBTableRow key={i}>
            <DBColText>{col}</DBColText>
            <DBTypeText>{type}</DBTypeText>
            <DBColText $dim>{desc}</DBColText>
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
    <SubLabel $withLine mb="1.5rem">
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
    <SubLabel $withLine mb="1.5rem">
      Certification Personalization — 실 결제 DB 기반 연령대 통계
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
   🏢  SECTION — RECRUIT CENTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const OrgThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: ${C.border};
  border: 1px solid ${C.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.8rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const OrgThemeCard = styled.div`
  background: ${C.bgCard};
  padding: 1.2rem 1.4rem;
  position: relative;
  overflow: hidden;
  transition: background 0.2s;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ $color }) => $color};
  }
  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }
`;

const OrgKey = styled.div`
  font-size: 0.6rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: ${C.mono};
  color: ${({ $color }) => $color};
  margin-bottom: 0.4rem;
  opacity: 0.85;
`;

const OrgName = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${C.text};
`;

const ApiQuotaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: ${C.border};
  border: 1px solid ${C.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.8rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ApiQuotaItem = styled.div`
  background: ${C.bgCard};
  padding: 1.4rem 1.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const ApiQuotaValue = styled.div`
  font-size: ${({ $large }) => ($large ? "1.8rem" : "2.6rem")};
  font-weight: 900;
  color: ${({ $highlight }) => ($highlight ? C.green : C.text)};
  line-height: 1;
  margin-bottom: 0.4rem;
  ${({ $highlight }) =>
    $highlight && `text-shadow: 0 0 20px rgba(0,242,96,0.3);`}
`;

const ApiQuotaLabel = styled.div`
  font-size: 0.6rem;
  color: ${C.textFaint};
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const RecruitCenterSection = ({ data }) => (
  <Section id="recruit">
    <SubLabel $withLine mb="1.5rem">
      Recruit Center — 사람인 API 취업정보센터
    </SubLabel>

    <IssueRow>
      <IssueBanner variant="red">
        <IssueIcon>🔎</IssueIcon>
        <div>
          <IssueLabel>정적 취업 정보 운영 구조</IssueLabel>
          <IssueDesc>
            교육원별 최신 채용 정보를 수작업 관리 — 담당자가 매번 수동
            업데이트 필요, 직무별 카테고리 분류 불가
          </IssueDesc>
        </div>
      </IssueBanner>
      <SideBanner>
        <SubLabel mb="0.6rem">Solution</SubLabel>
        <ProseText size="0.88rem">{data.solution}</ProseText>
      </SideBanner>
    </IssueRow>

    <SubLabel>4개 교육원 — 도메인 기반 테마 분기</SubLabel>
    <OrgThemeGrid>
      {data.orgThemes.map((org) => (
        <OrgThemeCard key={org.key} $color={org.color}>
          <OrgKey $color={org.color}>{org.domain}</OrgKey>
          <OrgName>{org.name}</OrgName>
        </OrgThemeCard>
      ))}
    </OrgThemeGrid>

    <SubLabel>API 호출 현황 — 일 500회 한도</SubLabel>
    <ApiQuotaGrid>
      <ApiQuotaItem>
        <ApiQuotaValue>500</ApiQuotaValue>
        <ApiQuotaLabel>일 제한</ApiQuotaLabel>
      </ApiQuotaItem>
      <ApiQuotaItem>
        <ApiQuotaValue>12</ApiQuotaValue>
        <ApiQuotaLabel>카테고리 수</ApiQuotaLabel>
      </ApiQuotaItem>
      <ApiQuotaItem>
        <ApiQuotaValue>288</ApiQuotaValue>
        <ApiQuotaLabel>최대 사용량 / 일</ApiQuotaLabel>
      </ApiQuotaItem>
      <ApiQuotaItem>
        <ApiQuotaValue $highlight $large>
          {data.apiQuota.efficiency}
        </ApiQuotaValue>
        <ApiQuotaLabel>한도 사용률</ApiQuotaLabel>
      </ApiQuotaItem>
    </ApiQuotaGrid>

    <SubLabel>배치 수집 플로우</SubLabel>
    <FlowStrip steps={data.flowSteps} />

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

    <SubLabel>DB Schema — 3개 테이블</SubLabel>
    <TwoColGrid
      cols="1fr 1.6fr 1.2fr"
      gap="1rem"
      bp="768px"
      style={{ marginBottom: "1.5rem" }}
    >
      {[data.tables.group, data.tables.result, data.tables.visit].map(
        (table, ti) => (
          <DBTableBox key={ti} $highlight={ti === 1}>
            <DBTableHeader $highlight={ti === 1}>
              <DBTableName $highlight={ti === 1}>{table.name}</DBTableName>
              <DBTableRole>{table.role}</DBTableRole>
            </DBTableHeader>
            {table.rows.map(([col, type, desc], i) => (
              <DBTableRow key={i}>
                <DBColText>{col}</DBColText>
                <DBTypeText>{type}</DBTypeText>
                <DBColText $dim>{desc}</DBColText>
              </DBTableRow>
            ))}
          </DBTableBox>
        ),
      )}
    </TwoColGrid>

    {data.security && data.security.length > 0 && (
      <SecurityInlineBlock
        items={data.security}
        title="Security — Recruit Center"
      />
    )}
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
    <SubLabel $withLine mb="1.5rem">
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
    <SubLabel $withLine mb="1.5rem">
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
   ♻️  마이크로레이더 — 공용 조각
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 문제 / 해결 2단 배너 */
const IssueSolution = ({ issue, solution }) => (
  <IssueRow>
    <IssueBanner variant="red">
      <IssueIcon>{issue.icon}</IssueIcon>
      <div>
        <IssueLabel>{issue.label}</IssueLabel>
        <IssueDesc>{issue.desc}</IssueDesc>
      </div>
    </IssueBanner>
    <SideBanner>
      <SubLabel mb="0.6rem">Solution</SubLabel>
      <ProseText size="0.88rem">{solution}</ProseText>
    </SideBanner>
  </IssueRow>
);

/* 아이콘 + 제목 + 설명 카드 2열 */
const FeatureCards = ({ items, mb = "2rem" }) => (
  <TwoColGrid style={{ marginBottom: mb }}>
    {items.map((feat, i) => (
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
);

/* 배지 3열 카드 (원인 분해 · 중복 제거 단계) */
const BadgeCards = ({ items }) => (
  <PopupArchGrid>
    {items.map((card, i) => (
      <PopupArchCard key={i} accent={card.accent}>
        <PopupArchBadge accent={card.accent}>{card.badge}</PopupArchBadge>
        <PopupArchTitle>{card.title}</PopupArchTitle>
        <PopupArchDesc>{card.desc}</PopupArchDesc>
      </PopupArchCard>
    ))}
  </PopupArchGrid>
);

/* [항목, 값, 설명] 3열 테이블 — 워커 · 캐시 · 이벤트 · 스키마 공용 */
const InfoTable = ({ name, role, rows, highlight }) => (
  <DBTableBox $highlight={highlight}>
    <DBTableHeader $highlight={highlight}>
      <DBTableName $highlight={highlight}>{name}</DBTableName>
      <DBTableRole>{role}</DBTableRole>
    </DBTableHeader>
    {rows.map(([col, type, desc], i) => (
      <DBTableRow key={i}>
        <DBColText>{col}</DBColText>
        <DBTypeText>{type}</DBTypeText>
        <DBColText $dim>{desc}</DBColText>
      </DBTableRow>
    ))}
  </DBTableBox>
);

/* 스크린샷 박스 — 클릭 시 라이트박스 */
const ShotBox = ({ shot, onImgClick }) => (
  <ScreenshotBox>
    <ScrollBox h={shot.h || "480px"}>
      <ImgClickWrap onClick={() => onImgClick(shot.src, shot.caption)}>
        <ScreenshotImg src={shot.src} alt={shot.caption} />
      </ImgClickWrap>
    </ScrollBox>
    <ScreenshotCaption p="0.75rem 1rem">↑ {shot.caption}</ScreenshotCaption>
  </ScreenshotBox>
);

/* 숫자 지표 4칸 */
const StatRow = ({ items }) => (
  <ApiQuotaGrid>
    {items.map((it, i) => (
      <ApiQuotaItem key={i}>
        <ApiQuotaValue $highlight={it.highlight} $large={it.value.length > 4}>
          {it.value}
        </ApiQuotaValue>
        <ApiQuotaLabel>{it.label}</ApiQuotaLabel>
      </ApiQuotaItem>
    ))}
  </ApiQuotaGrid>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏗️  SECTION — SYSTEM DESIGN (계층 다이어그램)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const LayerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 1.8rem;
`;

const LayerCard = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 1.2rem;
  align-items: center;
  background: ${C.bgCard};
  border: 1px solid ${C.border};
  border-left: 3px solid ${({ accent }) => accent || C.greenFaint};
  border-radius: 0 4px 4px 0;
  padding: 1rem 1.4rem;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
`;

const LayerTier = styled.div`
  font-size: 0.6rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  font-family: ${C.mono};
  color: ${({ accent }) => accent || C.greenDim};
`;

const LayerName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  font-family: ${C.mono};
  margin-bottom: 0.3rem;
`;

const LayerDesc = styled.div`
  font-size: 0.74rem;
  color: ${C.textDim};
  line-height: 1.65;
`;

const LayerLink = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: ${C.greenFaint};
  line-height: 1;
  padding: 0.35rem 0;
`;

const SystemArchSection = ({ data }) => (
  <Section id="systemArch">
    <SubLabel $withLine mb="1.5rem">
      System Design — 무료 티어 위에 올린 실서비스
    </SubLabel>

    <IssueSolution issue={data.issue} solution={data.solution} />

    <SubLabel>계층 구조 — 6 Tiers</SubLabel>
    <LayerStack>
      {data.layers.map((layer, i) => (
        <Fragment key={layer.tier}>
          <LayerCard accent={layer.accent}>
            <LayerTier accent={layer.accent}>{layer.tier}</LayerTier>
            <div>
              <LayerName>{layer.name}</LayerName>
              <LayerDesc>{layer.desc}</LayerDesc>
            </div>
          </LayerCard>
          {i < data.layers.length - 1 && <LayerLink>↓</LayerLink>}
        </Fragment>
      ))}
    </LayerStack>

    <SubLabel>워커 구성 — 주기는 외부 API 한도에서 역산</SubLabel>
    <div style={{ marginBottom: "1.8rem" }}>
      <InfoTable
        name="workers"
        role="폴링 · 배치"
        rows={data.workers}
        highlight
      />
    </div>

    <SubLabel>Redis — 영구 저장이 아니라 중복 제거 · 카운터 · 캐시 전용</SubLabel>
    <div style={{ marginBottom: "1.5rem" }}>
      <InfoTable name="redis keys" role="key · 용도 · TTL" rows={data.cache} />
    </div>

    <CodeBlock
      lang="Nginx"
      label="SSE만 버퍼링을 끄는 이유"
      code={data.codeBlock}
      highlightAs={data.codeLang}
    />
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📡  SECTION — DATA COLLECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

const SourceCard = styled.div`
  background: ${C.bgCard};
  padding: 1.4rem 1.6rem;
  position: relative;
  transition: background 0.2s;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ $color }) => $color};
    opacity: 0.75;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }
`;

const SourceHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
`;

const SourceKey = styled.div`
  font-size: 0.62rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  font-family: ${C.mono};
  color: ${({ $color }) => $color};
`;

const CycleChip = styled.span`
  font-size: 0.58rem;
  padding: 0.15rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  font-family: ${C.mono};
  white-space: nowrap;
`;

const SourceName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.45rem;
`;

const SourceDesc = styled.div`
  font-size: 0.74rem;
  color: ${C.textDim};
  line-height: 1.7;
`;

const CollectionSection = ({ data, onImgClick }) => (
  <Section id="collect">
    <SubLabel $withLine mb="1.5rem">
      Data Collection — 1차 보도자료까지 끌어올린 수집 파이프라인
    </SubLabel>

    <IssueSolution issue={data.issue} solution={data.solution} />

    {data.screenshot && (
      <div style={{ marginBottom: "2rem" }}>
        <ShotBox shot={data.screenshot} onImgClick={onImgClick} />
      </div>
    )}

    <SubLabel>수집 소스 4계열 — 와이어마다 티커 확보 전략이 다르다</SubLabel>
    <SourceGrid>
      {data.sources.map((s) => (
        <SourceCard key={s.key} $color={s.color}>
          <SourceHead>
            <SourceKey $color={s.color}>{s.key}</SourceKey>
            <CycleChip>{s.cycle}</CycleChip>
          </SourceHead>
          <SourceName>{s.name}</SourceName>
          <SourceDesc>{s.desc}</SourceDesc>
        </SourceCard>
      ))}
    </SourceGrid>

    <SubLabel>Pipeline</SubLabel>
    <FlowStrip steps={data.flowSteps} />

    <SubLabel>중복 제거 3단 — 단계마다 통과하는 중복이 다르다</SubLabel>
    <BadgeCards items={data.dedup} />

    <SubLabel>노이즈 필터 — 무엇을 버리는지가 피드 품질을 만든다</SubLabel>
    <FeatureCards items={data.features} />

    <SubLabel>DB Schema — 뉴스 · 공시</SubLabel>
    <TwoColGrid gap="1rem" style={{ marginBottom: "1.5rem" }}>
      <InfoTable {...data.tables.news} highlight />
      <InfoTable {...data.tables.filings} />
    </TwoColGrid>

    <CodeBlock
      lang="JavaScript"
      label="중복 제거 3단 + 시총 게이트"
      code={data.codeBlock}
      highlightAs={data.codeLang}
    />
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🤖  SECTION — AI PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const GradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 1.8rem;
`;

const GradeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: ${C.bgCard};
  border: 1px solid ${C.border};
  border-left: 3px solid ${({ $color }) => $color};
  border-radius: 0 4px 4px 0;
  padding: 0.75rem 1.2rem;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const GradeBadge = styled.div`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 0.85rem;
  font-weight: 900;
  color: #fff;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 18px ${({ $color }) => $color}55;
`;

const GradeDesc = styled.div`
  font-size: 0.78rem;
  color: ${C.textDim};
  line-height: 1.6;
`;

const SampleCard = styled.div`
  background: ${C.bgDeep};
  border: 1px solid ${C.border};
  border-left: 3px solid ${({ $color }) => $color};
  border-radius: 0 4px 4px 0;
  padding: 1.1rem 1.3rem;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.018);
  }
`;

const SampleHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
`;

const SampleTicker = styled.span`
  font-size: 0.8rem;
  font-weight: 900;
  color: #fff;
  font-family: ${C.mono};
`;

const SampleNameKo = styled.span`
  font-size: 0.72rem;
  color: ${C.textFaint};
`;

const SampleGrade = styled.span`
  font-size: 0.62rem;
  font-weight: 900;
  padding: 0.12rem 0.45rem;
  border-radius: 2px;
  color: #fff;
  background: ${({ $color }) => $color};
  font-family: ${C.mono};
`;

const SampleCategory = styled.span`
  font-size: 0.58rem;
  padding: 0.14rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.45);
  border-radius: 2px;
  margin-left: auto;
`;

const SampleSummary = styled.div`
  font-size: 0.78rem;
  color: ${C.text};
  line-height: 1.7;
  margin-bottom: 0.5rem;
`;

const SampleReason = styled.div`
  font-size: 0.7rem;
  color: ${C.textFaint};
  line-height: 1.6;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  &::before {
    content: "근거 · ";
    color: rgba(0, 242, 96, 0.5);
    font-family: ${C.mono};
  }
`;

const DisclaimerNote = styled.div`
  margin-top: 1rem;
  font-size: 0.68rem;
  color: ${C.textFaint};
  line-height: 1.7;
  font-family: ${C.mono};
`;

const AiPipelineSection = ({ data }) => (
  <Section id="ai">
    <SubLabel $withLine mb="1.5rem">
      AI Pipeline — 무료 한도 안에서 매일 돌리는 등급 분석
    </SubLabel>

    <IssueSolution issue={data.issue} solution={data.solution} />

    <SubLabel>원인 분해 — 429 하나에 원인이 셋 있었다</SubLabel>
    <BadgeCards items={data.rootCauses} />

    <SubLabel>한도 운영 현황</SubLabel>
    <StatRow items={data.quota} />

    <SubLabel>등급 체계 — S ~ D</SubLabel>
    <GradeList>
      {data.grades.map((g) => (
        <GradeRow key={g.grade} $color={g.color}>
          <GradeBadge $color={g.color}>{g.grade}</GradeBadge>
          <GradeDesc>{g.desc}</GradeDesc>
        </GradeRow>
      ))}
    </GradeList>

    <SubLabel>운영에서 얻은 규칙</SubLabel>
    <FeatureCards items={data.features} />

    <SubLabel>실제 서비스 출력</SubLabel>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
        marginBottom: "0.5rem",
      }}
    >
      {data.samples.map((s) => (
        <SampleCard key={s.ticker} $color={s.color}>
          <SampleHead>
            <SampleTicker>{s.ticker}</SampleTicker>
            <SampleNameKo>{s.nameKo}</SampleNameKo>
            <SampleGrade $color={s.color}>{s.grade}</SampleGrade>
            <SampleCategory>{s.category}</SampleCategory>
          </SampleHead>
          <SampleSummary>{s.summary}</SampleSummary>
          <SampleReason>{s.reason}</SampleReason>
        </SampleCard>
      ))}
    </div>
    {data.sampleNote && <DisclaimerNote>※ {data.sampleNote}</DisclaimerNote>}

    <div style={{ marginTop: "2rem" }}>
      <CodeBlock
        lang="JavaScript"
        label="모델 고정 · PT 카운터 · 429 3분기"
        code={data.codeBlock}
        highlightAs={data.codeLang}
      />
    </div>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📶  SECTION — REALTIME SSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const RealtimeSection = ({ data, onImgClick }) => (
  <Section id="realtime">
    <SubLabel $withLine mb="1.5rem">
      Realtime SSE — 등급을 기다리지 않는 2단계 노출
    </SubLabel>

    <IssueSolution issue={data.issue} solution={data.solution} />

    {data.screenshots?.length > 0 && (
      <TwoColGrid
        cols="1.75fr 1fr"
        gap="1rem"
        bp="900px"
        style={{ marginBottom: "2rem", alignItems: "start" }}
      >
        {data.screenshots.map((s) => (
          <ShotBox key={s.src} shot={s} onImgClick={onImgClick} />
        ))}
      </TwoColGrid>
    )}

    <SubLabel>노출 순서</SubLabel>
    <FlowStrip steps={data.flowSteps} />

    <SubLabel>이벤트 타입 — 통합 스트림 1개</SubLabel>
    <div style={{ marginBottom: "1.8rem" }}>
      <InfoTable
        name="GET /api/stream"
        role="event · 발생 시점 · payload"
        rows={data.events}
        highlight
      />
    </div>

    <SubLabel>실제로 어려웠던 지점</SubLabel>
    <FeatureCards items={data.features} />

    <CodeBlock
      lang="JavaScript"
      label="2단계 브로드캐스트 + 모바일 복귀 재연결"
      code={data.codeBlock}
      highlightAs={data.codeLang}
    />
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔐  SECTION — SECURITY & OPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SecurityOpsSection = ({ data }) => (
  <Section id="security">
    <SubLabel $withLine mb="1.5rem">
      Security & Ops — 인증 없는 공개 서비스를 지키는 방법
    </SubLabel>

    <IssueSolution issue={data.issue} solution={data.solution} />

    <SubLabel>방어 레이어</SubLabel>
    <FeatureCards items={data.features} mb="0" />

    {data.items?.length > 0 && (
      <SecurityInlineBlock items={data.items} title="Security — 서버 강제" />
    )}
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const renderSection = (sectionId, project, openLightbox) => {
  switch (sectionId) {
    case "metrics":
      return (
        <MetricsSection
          metrics={project.metrics}
          role={project.role}
          environment={project.environment}
          scale={project.scale}
        />
      );
    case "recruit":
      return <RecruitCenterSection data={project.recruitCenter} />;
    case "systemArch":
      return <SystemArchSection data={project.systemArch} />;
    case "collect":
      return (
        <CollectionSection data={project.collect} onImgClick={openLightbox} />
      );
    case "ai":
      return <AiPipelineSection data={project.ai} />;
    case "realtime":
      return (
        <RealtimeSection data={project.realtime} onImgClick={openLightbox} />
      );
    case "security":
      return <SecurityOpsSection data={project.security} />;
    case "architecture":
      return (
        <ArchitectureSection
          arch={project.architecture}
          onImgClick={openLightbox}
        />
      );
    case "board":
      return (
        <BoardWithQuerySection
          board={project.boardSystem}
          qe={project.queryEngineering}
          onImgClick={openLightbox}
        />
      );
    case "popup":
      return (
        <PopupManagementSection
          data={project.popupSystem}
          onImgClick={openLightbox}
        />
      );
    case "template":
      return (
        <TemplateSystemSection
          tpl={project.templateSystem}
          onImgClick={openLightbox}
        />
      );
    case "kpcp":
      return (
        <KpcpRenewalSection
          renewal={project.kpcpRenewal}
          onImgClick={openLightbox}
        />
      );
    case "stack":
      return <TechStackSection stackGroups={project.stackGroups} />;
    case "timeline":
      return <TimelineSection timeline={project.timeline} />;
    default:
      return null;
  }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === Number(id));

  const [lightbox, setLightbox] = useState(null);

  const heroCodeLines =
    HERO_CODE_SETS[project?.heroCodeLang ?? "sql"] ?? HERO_CODE_LINES;

  const availableNavItems = NAV_ITEMS.filter((item) => project?.[item.key]);

  const [activeSection, setActiveSection] = useState(
    () => availableNavItems[0]?.id ?? "metrics",
  );

  const handleSelect = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  const openLightbox = useCallback(
    (src, caption) => setLightbox({ src, caption }),
    [],
  );
  const closeLightbox = useCallback(() => setLightbox(null), []);

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
            {[...heroCodeLines, ...heroCodeLines].map((line, i) => (
              <div key={i}>{line || " "}</div>
            ))}
          </CodeBgTrack>
        </CodeBgWrap>
        <HeroMeta>
          <HeroTag>{project.tag}</HeroTag>
          <span>{project.period}</span>
          <span>·</span>
          <span>{project.heroNote ?? "재직 중 작업"}</span>
          {project.live && (
            <>
              <span>·</span>
              <HeroLiveLink
                href={project.live}
                target="_blank"
                rel="noreferrer noopener"
              >
                {project.live.replace(/^https?:\/\//, "")}
              </HeroLiveLink>
            </>
          )}
        </HeroMeta>
        <HeroTitle>
          {project.title.split("").map((char, i) =>
            project.titleHighlight && char === project.titleHighlight
              ? <span key={i}>{char}</span>
              : char,
          )}
        </HeroTitle>
        <HeroSubtitle>{project.subtitle}</HeroSubtitle>
        <HeroTagline>{project.tagline}</HeroTagline>
      </Hero>

      <PanelLayout>
        <PageSideNav
          activeSection={activeSection}
          onSelect={handleSelect}
          items={availableNavItems}
        />
        <ContentPanel>
          <AnimatedContent key={activeSection}>
            {renderSection(activeSection, project, openLightbox)}
          </AnimatedContent>
        </ContentPanel>
      </PanelLayout>
    </Wrapper>
  );
};

export default ProjectDetail;
