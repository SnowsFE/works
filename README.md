<div align="center">

# Snoer Works

실서비스에서 부딪힌 문제를 **문제 → 해결 → 구조 → 결과** 흐름으로 정리한 개발 포트폴리오입니다.

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)
![styled-components](https://img.shields.io/badge/styled--components_6-DB7093?style=flat-square&logo=styledcomponents&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)

</div>

<br />

## 📁 Projects

### 🏢 한국교육평가원 &nbsp;`PRODUCTION`

> 4개 교육원 실서비스를 레거시 Classic ASP · MSSQL 환경에서 운영하며 쿼리 최적화, 외부 API 배치 자동화, 관리자 시스템까지 담당한 풀스택 업무

**재직 · 2024.12 — 현재** &nbsp;|&nbsp; 풀스택 개발 · DB 설계 · 성능 최적화

| 지표 | 내용 |
| :-- | :-- |
| **7~8s → 1~2s** | 1:1 게시판 조회 — CTE 통합 쿼리와 복합 인덱스로 5배 단축 |
| **4DB → 1Query** | 외래키 없는 4개 분산 DB를 스키마 변경 없이 Cross DB JOIN 단일 쿼리로 통합 |
| **288회/일** | 사람인 REST API × Windows 스케줄러 배치로 12개 직무 카테고리를 1시간마다 자동 수집 |

**주요 작업** &nbsp;취업정보센터 · 1:1 게시판 리뉴얼 · 팝업 관리 · 답변 템플릿 · 자격증 통계 쿼리

`Classic ASP` `MSSQL` `사람인 REST API` `Windows Scheduler` `JavaScript`

<br />

### 📡 마이크로레이더 &nbsp;`LIVE SERVICE`

> 나스닥 마이크로캡(시총 5억 달러 이하) 뉴스와 SEC 공시를 수집해 AI가 등급을 매기고 실시간으로 보여주는 서비스

**개인 프로젝트 · 2026.06 — 현재** &nbsp;|&nbsp; 기획 · 백엔드 · 프론트엔드 · 인프라 1인 개발 &nbsp;|&nbsp; [microradar.kr](https://microradar.kr)

| 지표 | 내용 |
| :-- | :-- |
| **30초** | 2차 매체가 받아쓰기 전에 1차 보도자료(PR 와이어 3곳)를 직접 수집하는 주기 |
| **517건** | 429로 멈춘 AI 분석 큐의 원인 3가지를 찾아 해결하고 밀린 백로그 전량 처리 |
| **$0** | OCI 프리티어 + Cloudflare + 무료 API 조합 — 도메인 외 고정비 없이 상시 운영 |

`Node.js` `React` `MySQL` `Redis` `SSE` `Gemini API`

<br />

## 🧭 페이지 구성

| 경로 | 화면 |
| :-- | :-- |
| `/` | 프로젝트 카드 목록 · Contact 모달 |
| `/projects/:id` | 프로젝트 상세 — 성능 지표, 아키텍처, 시스템별 설계, 기술 스택, 타임라인을 탭으로 전환 |

## 🗂 구조

```
Works/
├── public/media/            # 상세 페이지 스크린샷
└── src/
    ├── data/projects.js     # 카드 목록 · 상세 페이지 공용 데이터 (단일 출처)
    ├── pages/
    │   ├── Projects.jsx         # 카드 목록
    │   └── ProjectDetail.jsx    # 상세 — 데이터에 있는 섹션만 탭으로 노출
    ├── components/common/   # Navbar · ContactModal
    └── styles/              # GlobalStyle · theme
```

프로젝트 내용은 `projects.js` 한 곳에서 관리하며, 목록과 상세 페이지가 같은 데이터를 읽습니다.

## 🚀 실행

> Node.js 20.19 이상 또는 22.12 이상 (Vite 7 요구 사항)

```bash
cd Works
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
```

## 📬 Contact

[![GitHub](https://img.shields.io/badge/GitHub-SnowsFE-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/SnowsFE)
