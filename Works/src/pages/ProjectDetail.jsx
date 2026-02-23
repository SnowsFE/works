import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦  PROJECT DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const projectData = [
  {
    id: 1,
    title: "한국교육평가원",
    period: "2024.12 — 2026.02",
    tag: "PRODUCTION",
    subtitle:
      "4개 교육원 실서비스 운영 · 레거시 환경에서의 성능 최적화 및 UX 개선 · 관리자 시스템 설계 및 구현",
    overview:
      "KPCP, KPEI, LEI, ILI 4개 교육원의 실서비스를 운영하며 Classic ASP 기반 레거시 환경에서 프론트엔드 개발, DB 설계, 성능 최적화까지 전반적인 업무를 담당했습니다. 단순한 퍼블리싱을 넘어, 쿼리 병목 분석부터 SEO 개선, 관리자 시스템 신규 구축까지 직접 설계하고 배포했습니다.",
    role: "프론트엔드 개발 · DB 설계 · 성능 최적화",
    environment: "Classic ASP · MSSQL · 실서버 운영",
    scale: "4개 교육원 · 150개 과정 · 실사용자 대상",
    github: null,
    live: null,
    metrics: [
      {
        before: "1:1 게시판 리스트 조회",
        arrow: "7~8s → 1~2s",
        value: "5×",
        desc: "CTE 통합 쿼리 + 복합 인덱스 적용으로 전체 성능 5배 향상",
      },
      {
        before: "자격증 상세 SEO 점수",
        arrow: "기존 대비 +20% 이상",
        value: "100점",
        desc: "KPCP PC 기준 Lighthouse SEO 100점 달성 · 시맨틱 태그 구조 개선",
      },
      {
        before: "자격증 상세 LCP",
        arrow: "40% → 61%",
        value: "+21%p",
        desc: "JS resize 로직을 CSS로 전환 · 성능 50% 개선",
      },
    ],
    features: [
      {
        title: "신규 과정 팝업 시스템 설계 및 구현",
        desc: "레거시 푸터 팝업의 구조적 한계를 분석하고, 팝업 전용 DB 테이블을 새로 설계했습니다. 과정별 PC/MOB 이미지 분리, 노출 기간 설정, 활성/비활성 토글, 클릭 로그 수집까지 관리자 페이지에서 모두 제어 가능하도록 공통 구조로 구현했습니다.",
        tags: ["DB 설계", "클릭 로그", "관리자 UI", "공통화"],
      },
      {
        title: "1:1 게시판 쿼리 최적화 및 전면 리뉴얼",
        desc: "노후된 쿼리 구조를 분석하여 CTE 통합 쿼리 작성, 복합 인덱스 2개 추가, GetRows 방식 적용으로 리스트 조회 7~8초를 1~2초로, 검색 15초 이상을 3초대로 단축했습니다. 수강생/관리자 UI도 함께 리뉴얼하여 이미지 업로드, 미리보기, 인라인 답변 기능을 추가했습니다.",
        tags: ["쿼리 최적화", "인덱스 설계", "5배 성능 향상", "UX 리뉴얼"],
      },
      {
        title: "게시판 답변 템플릿 시스템",
        desc: "관리자가 자주 쓰는 답변을 카테고리별로 저장하고 재사용할 수 있는 템플릿 시스템을 구현했습니다. contentEditable 기반 인라인 편집, adminLevel 기반 권한 분기, 클릭 한 번으로 내용 복사, 배송일 자동 계산 연동까지 포함합니다.",
        tags: ["contentEditable", "권한 관리", "배송일 자동화", "검색/필터"],
      },
      {
        title: "결제 페이지 리뉴얼",
        desc: "수강생이 취득한 자격증을 결제 전 미리 확인할 수 있는 모달 UI를 구현했습니다. 협회명 및 자격증명에 따라 상장형/카드형 자격증을 분기 처리하고, ASP Now() 함수로 발급일자를 자동화했습니다.",
        tags: ["모달 UI", "데이터 연동", "발급일자 자동화"],
      },
      {
        title: "관리자 대시보드 목업 사이트 설계",
        desc: "Information Architecture 설계부터 시작하여 대시보드, 회원관리, 과정관리, 강사관리, 수강관리, 결제관리, 게시판관리까지 전체 관리자 시스템을 직접 기획하고 구현했습니다.",
        tags: ["IA 설계", "대시보드", "전체 시스템 기획"],
      },
      {
        title: "SEO 및 Core Web Vitals 개선",
        desc: "자격증 상세페이지 시맨틱 태그 구조 개선, 메타태그 최상단 재배치, 이미지 최적화, 비디오 지연 로딩 적용으로 KPCP PC 기준 SEO 100점을 달성했습니다.",
        tags: ["SEO 100점", "LCP 개선", "시맨틱 마크업", "Lazy Loading"],
      },
    ],
    problems: [
      {
        title: "FOUT — 폰트 초기 로딩 시 깜빡임 현상",
        desc: "폰트 로딩 지연으로 인해 페이지 초기 진입 시 텍스트가 스타일 없이 노출되었다가 교체되는 FOUT 현상이 자격증 상세페이지에서 발생.",
        solution: "폰트 프리로드 처리 및 font-display 전략 개선으로 해결.",
      },
      {
        title: "변수 누적 버그 — 수강정보 발송 상태 오인식",
        desc: "관리자 페이지 수강정보 루프 순회 시 발송상태 변수가 초기화되지 않아 이전 루프의 값이 누적되는 버그. DB 데이터는 정상이었으나 화면 표시가 잘못됨.",
        solution: "루프 상단에 변수 초기화 코드 추가로 해결.",
      },
      {
        title: "정규식 ^ 문제 — 비밀번호 특수문자 검증 오류",
        desc: "비밀번호 검증 정규식에 ^ 문자 포함으로 정상 입력값도 오류 처리되는 문제. PC/모바일 전 교육원 영향.",
        solution: "정규식에서 ^ 제거 후 전 교육원 PC/모바일 일괄 반영.",
      },
      {
        title: "생년월일 불일치 — 회원정보와 협회정보 간 데이터 정합성",
        desc: "자격증 신청 시 회원 DB와 협회 DB의 생년월일이 불일치하는 케이스가 존재하여 처리 지연 발생.",
        solution:
          "4개 DB 크로스 조인 쿼리로 불일치 케이스만 필터링하는 전용 버튼 추가.",
      },
    ],
    stack: [
      "Classic ASP",
      "MSSQL",
      "JavaScript (ES6+)",
      "HTML5 / CSS3",
      "반응형 웹",
      "Swiper.js",
      "contentEditable API",
      "복합 인덱스",
      "CTE 쿼리",
      "Session 인증",
      "FTP 배포",
      "SEO / Core Web Vitals",
    ],
    timeline: [
      {
        date: "2024.12",
        content: "입사 · 온보딩",
        detail: "신규 과정 개설 업무 숙지, Classic ASP 기술 숙련",
      },
      {
        date: "2025.02",
        content: "관리자 시스템 기능 확장",
        detail: "실습파일 관리, 마케팅 수신 동의 DB 연동, 시험 페이지 개선",
      },
      {
        date: "2025.04",
        content: "LEI 리뉴얼 착수",
        detail: "Classic ASP + React 연동 성공, IA 설계, 날씨 API 연동",
      },
      {
        date: "2025.07",
        content: "게시판 시스템 전면 개편",
        detail: "1:1 게시판 리뉴얼, 답변 템플릿 시스템 구축, 배송일 자동화",
      },
      {
        date: "2025.09",
        content: "KPCP 리뉴얼",
        detail: "메인 · 자격증 상세 전면 리뉴얼, 보안 강화 전 교육원 적용",
      },
      {
        date: "2025.11",
        content: "쿼리 최적화 · 팝업 시스템",
        detail: "1:1 게시판 성능 5배 향상, 결제 페이지 리뉴얼",
      },
      {
        date: "2026.02",
        content: "SEO · UX 고도화",
        detail: "Lighthouse SEO 100점 달성, LCP 개선",
      },
    ],
  },
  // 여기에 포폴링 프로젝트 추가 예정
  // {
  //   id: 2,
  //   title: "포폴링",
  //   ...
  // },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✨  ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { width: 0; }
  to   { width: 48px; }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📐  LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const Wrapper = styled.div`
  background: #080808;
  min-height: 100vh;
  color: #e8e8e8;
  position: relative;
  overflow-x: hidden;
`;

const BackBtn = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ── HERO ── */
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
  background: linear-gradient(
    to bottom,
    transparent,
    ${({ theme }) => theme.colors?.primary ?? "#00ff44"},
    transparent
  );
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
  border: 1px solid ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
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
    color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  }
`;

const HeroSubtitle = styled.p`
  margin-top: 2rem;
  max-width: 540px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.8;
  animation: ${fadeUp} 0.8s 0.2s ease both;
`;

/* ── CONTENT ── */
const Content = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 4rem 8rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 5rem;
  }
`;

const SectionLabel = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
    max-width: 200px;
  }
`;

/* ── OVERVIEW ── */
const Overview = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 6rem;
  padding-top: 5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const OverviewText = styled.div`
  h2 {
    font-size: 2.8rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.9;
  }
`;

const OverviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
`;

const InfoItem = styled.div`
  border-left: 2px solid ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  padding-left: 1.2rem;

  .label {
    font-size: 0.65rem;
    color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
  }

  .value {
    font-size: 0.9rem;
    color: #e8e8e8;
  }
`;

/* ── METRICS ── */
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: 6rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: #0f0f0f;
  padding: 2.5rem 2rem;
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
    background: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
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
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.5rem;
`;

const MetricArrow = styled.div`
  font-size: 0.7rem;
  color: rgba(0, 242, 96, 0.5);
  margin-bottom: 0.3rem;
`;

const MetricValue = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  line-height: 1;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(0, 242, 96, 0.3);
`;

const MetricDesc = styled.div`
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.5;
`;

/* ── FEATURES ── */
const FeatureItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 2rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  align-items: start;

  &:first-of-type {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }
`;

const FeatureNum = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: rgba(0, 242, 96, 0.15);
  line-height: 1;
  transition: color 0.3s;

  ${FeatureItem}:hover & {
    color: rgba(0, 242, 96, 0.5);
  }
`;

const FeatureContent = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.6rem;
  }

  p {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.8;
    max-width: 600px;
  }
`;

const TagRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Tag = styled.span`
  font-size: 0.62rem;
  padding: 0.25rem 0.7rem;
  background: rgba(0, 242, 96, 0.08);
  border: 1px solid rgba(0, 242, 96, 0.2);
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  letter-spacing: 1px;
`;

/* ── PROBLEMS ── */
const ProblemItem = styled.div`
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 2rem 2.5rem;
  margin-bottom: 1px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  }
`;

const ProblemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  gap: 1rem;
`;

const ProblemTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: #fff;
`;

const ProblemBadge = styled.span`
  font-size: 0.6rem;
  padding: 0.2rem 0.6rem;
  border-radius: 2px;
  letter-spacing: 2px;
  flex-shrink: 0;
  background: rgba(0, 242, 96, 0.1);
  border: 1px solid rgba(0, 242, 96, 0.3);
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
`;

const ProblemDesc = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.8;
`;

const ProblemSolution = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 0.83rem;
  color: rgba(0, 242, 96, 0.7);
  line-height: 1.7;

  &::before {
    content: "→ ";
    font-family: monospace;
  }
`;

/* ── STACK ── */
const StackGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 6rem;
`;

const StackItem = styled.span`
  font-size: 0.75rem;
  padding: 0.6rem 1.2rem;
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 1px;
  transition: all 0.3s;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
    color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
    background: rgba(0, 242, 96, 0.08);
  }
`;

/* ── TIMELINE ── */
const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
`;

const TimelineDate = styled.div`
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 1px;
  padding-top: 0.15rem;
`;

const TimelineContent = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.7;

  strong {
    color: #e8e8e8;
    font-weight: 700;
  }
`;

const Section = styled.section`
  margin-bottom: 6rem;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projectData.find((p) => p.id === Number(id));

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
          <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: "2rem" }}>
            프로젝트를 찾을 수 없습니다.
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
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
      {/* BACK */}
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

      {/* HERO */}
      <Hero>
        <HeroBg />
        <HeroLine />

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
      </Hero>

      {/* CONTENT */}
      <Content>
        {/* OVERVIEW */}
        <Overview>
          <OverviewText>
            <SectionLabel>Overview</SectionLabel>
            <h2>
              실서비스
              <br />
              운영 경험
            </h2>
            <p>{project.overview}</p>
          </OverviewText>

          <OverviewInfo>
            <InfoItem>
              <div className="label">Period</div>
              <div className="value">{project.period}</div>
            </InfoItem>
            <InfoItem>
              <div className="label">Role</div>
              <div className="value">{project.role}</div>
            </InfoItem>
            <InfoItem>
              <div className="label">Environment</div>
              <div className="value">{project.environment}</div>
            </InfoItem>
            <InfoItem>
              <div className="label">Scale</div>
              <div className="value">{project.scale}</div>
            </InfoItem>
          </OverviewInfo>
        </Overview>

        {/* METRICS */}
        <Section>
          <SectionLabel>Performance</SectionLabel>
          <MetricsGrid>
            {project.metrics.map((m, i) => (
              <MetricCard key={i}>
                <MetricBefore>{m.before}</MetricBefore>
                <MetricArrow>{m.arrow}</MetricArrow>
                <MetricValue>{m.value}</MetricValue>
                <MetricDesc>{m.desc}</MetricDesc>
              </MetricCard>
            ))}
          </MetricsGrid>
        </Section>

        {/* FEATURES */}
        <Section>
          <SectionLabel>Key Implementations</SectionLabel>
          {project.features.map((f, i) => (
            <FeatureItem key={i}>
              <FeatureNum>{String(i + 1).padStart(2, "0")}</FeatureNum>
              <FeatureContent>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <TagRow>
                  {f.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </TagRow>
              </FeatureContent>
            </FeatureItem>
          ))}
        </Section>

        {/* PROBLEMS */}
        <Section>
          <SectionLabel>Problem Solving</SectionLabel>
          {project.problems.map((p, i) => (
            <ProblemItem key={i}>
              <ProblemHeader>
                <ProblemTitle>{p.title}</ProblemTitle>
                <ProblemBadge>RESOLVED</ProblemBadge>
              </ProblemHeader>
              <ProblemDesc>{p.desc}</ProblemDesc>
              <ProblemSolution>{p.solution}</ProblemSolution>
            </ProblemItem>
          ))}
        </Section>

        {/* STACK */}
        <Section>
          <SectionLabel>Tech Stack</SectionLabel>
          <StackGrid>
            {project.stack.map((s) => (
              <StackItem key={s}>{s}</StackItem>
            ))}
          </StackGrid>
        </Section>

        {/* TIMELINE */}
        <Section>
          <SectionLabel>Major Milestones</SectionLabel>
          {project.timeline.map((t, i) => (
            <TimelineItem key={i}>
              <TimelineDate>{t.date}</TimelineDate>
              <TimelineContent>
                <strong>{t.content}</strong> — {t.detail}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Section>
      </Content>
    </Wrapper>
  );
};

export default ProjectDetail;
