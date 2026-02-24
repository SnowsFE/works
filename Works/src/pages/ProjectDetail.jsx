import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦  PROJECT DATA  — 50/50 Fullstack 전략 재구성
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const projectData = [
  {
    id: 1,
    title: "한국교육평가원",
    period: "2024.12 — 2026.02",
    tag: "PRODUCTION",
    tagline: "4개 DB를 통합하고, 관리자 쿼리 성능을 5배 개선한 풀스택 개발자",
    subtitle:
      "4개 교육원 실서비스 운영 · 레거시 환경에서의 성능 최적화 및 UX 개선 · 관리자 시스템 설계 및 구현",

    // ── Problem & Environment (Overview 재설계 — 문제 정의 중심)
    problems_env: {
      intro:
        "KPCP, KPEI, LEI, ILI 4개 교육원의 실서비스를 Classic ASP 기반 레거시 환경에서 운영했습니다. 단순 퍼블리싱이 아닌 쿼리 병목 분석, DB 설계, 보안 강화, SEO 개선까지 전반을 직접 설계하고 배포했습니다.",
      issues: [
        {
          label: "레거시 환경",
          desc: "Classic ASP + MSSQL 기반 — 모던 프레임워크 없이 서버 로직부터 UI까지 직접 설계 필요",
          icon: "⚙️",
        },
        {
          label: "4개 DB 분산 구조",
          desc: "강의 DB · 자격증 DB · 결제 DB · 교육원 DB 각각 분리 운영 — Cross DB JOIN 필수",
          icon: "🗄️",
        },
        {
          label: "게시판 응답 7~8초",
          desc: "구/신 게시판 이원화 + COUNT 별도 쿼리 — 관리자 목록 로딩 7~8초, 검색 15초 이상",
          icon: "🐢",
        },
        {
          label: "반복 업무 비효율",
          desc: "답변 담당자마다 동일한 내용을 매번 직접 입력 — 내용 불일치 및 업무 시간 낭비",
          icon: "🔄",
        },
        {
          label: "FOUC · 성능 미흡",
          desc: "font-display 미적용 · JS 기반 레이아웃 분기 → FOUC, LCP 저하, SEO 미흡",
          icon: "📉",
        },
      ],
    },

    role: "프론트엔드 개발 · DB 설계 · 성능 최적화",
    environment: "Classic ASP · MSSQL · 실서버 운영",
    scale: "4개 교육원 · 150개 과정 · 실사용자 대상",

    // ── Performance Metrics (수치는 여기 한 번만)
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

    // ── Core Features (기능 구현 — 중복 수치 제거)
    features: [
      {
        title: "신규 과정 팝업 시스템 설계 및 구현",
        desc: "레거시 푸터 팝업의 구조적 한계를 분석하고, 팝업 전용 DB 테이블을 새로 설계했습니다. 과정별 PC/MOB 이미지 분리, 노출 기간 설정, 활성/비활성 토글, 클릭 로그 수집까지 관리자 페이지에서 모두 제어 가능하도록 공통 구조로 구현했습니다.",
        tags: ["DB 설계", "클릭 로그", "관리자 UI", "공통화"],
      },
      {
        title: "1:1 게시판 전면 리뉴얼 — 수강생 UX",
        desc: "기존 단순 텍스트 입력 구조를 contentEditable 기반 리치 에디터로 전면 재설계했습니다. 이미지 업로드·미리보기, 인라인 답변, 1,500자 카운터까지 라이브러리 없이 Vanilla JS로 직접 구현했습니다.",
        tags: ["contentEditable", "리치 에디터", "이미지 업로드", "UX 리뉴얼"],
      },
      {
        title: "게시판 답변 템플릿 시스템",
        desc: "관리자가 자주 쓰는 답변을 카테고리별로 저장하고 재사용할 수 있는 템플릿 시스템을 구현했습니다. adminLevel 기반 권한 분기, 클릭 한 번으로 내용 복사, 배송일 자동 계산 연동까지 포함합니다.",
        tags: ["권한 관리", "배송일 자동화", "검색/필터"],
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
    ],

    // ── Data Architecture
    architecture: {
      screenshot: "/media/course-detail.jpg",
      screenshotCaption: "과정 상세 페이지 — 4개 DB 데이터를 단일 뷰로 통합",
      desc: "4개 DB에 분산된 과정 데이터를 단일 LEFT JOIN 쿼리로 통합하여 한 번의 DB 호출로 모든 섹션을 렌더링합니다. 강의 DB · 자격증 DB · 교육원 DB · 수강생 DB를 Cross DB JOIN으로 연결하고, 강의명 문자열 정규화(REPLACE)로 키 불일치를 극복했습니다.",
      tables: [
        {
          name: "GtblLectureInfo",
          role: "강의 기본 정보",
          fields: ["lec_lecName", "lec_lecIntro", "lec_tutorName"],
          isMain: true,
          section: "개요 / 교수소개",
        },
        {
          name: "tblnumber",
          role: "누적 수강생",
          fields: ["lnum"],
          join: "LEFT JOIN",
          joinKey: "lec_lecName",
          section: "과정 헤더",
        },
        {
          name: "GtblLicenseInfo",
          role: "협회 · 자격증 정보",
          fields: ["li_manage", "li_manageNum", "li_profit"],
          join: "LEFT JOIN",
          joinKey: "license DB 크로스",
          section: "과정정보",
        },
        {
          name: "tblTeacherQnA",
          role: "강사 Q&A",
          fields: ["tqa_q1~10", "tqa_a1~10"],
          join: "LEFT JOIN",
          joinKey: "lei DB 크로스",
          section: "과정 Q&A",
        },
      ],
      codeBlock: `SELECT
  l.lec_lecName, l.lec_lecIntro,
  l.lec_tutorName, l.lec_img,
  t.lnum,
  c.li_manage, c.li_manageNum, c.li_profit,
  q.tqa_q1, q.tqa_a1
  -- ... q1~q10 / a1~a10

FROM GtblLectureInfo AS l

LEFT JOIN tblnumber t
  ON REPLACE(l.lec_lecName, '.', '')
   = REPLACE(t.lname, '.', '')

LEFT JOIN [license].dbo.GtblLicenseInfo AS c
  ON REPLACE(c.li_lecName, '.', '')
   = REPLACE(l.lec_lecName, '.', '')
  AND li_Opt = 1

LEFT JOIN [lei.or.kr].dbo.GtblLectureInfo AS d
  ON REPLACE(d.lec_lecName, '.', '')
   = REPLACE(l.lec_lecName, '.', '')

LEFT JOIN [lei.or.kr].dbo.tblTeacherQnA AS q
  ON d.lec_lecCode = q.tqa_leccode

WHERE l.lec_lecCode = :lec_lecCode`,
    },

    // ── Query Engineering (Board에서 독립 승격)
    queryEngineering: {
      title: "Query Engineering — 7~8s → 1~2s",
      background:
        "관리자 1:1 게시판 목록은 구 게시판(GtblQaABoard)과 신 게시판(tblSukangReading)을 별도로 조회하고 COUNT 쿼리를 따로 실행하는 구조였습니다. 목록 로딩 7~8초, 검색 15초 이상이 반복되어 전면 재설계가 필요했습니다.",
      before: "구/신 게시판 별도 조회 + COUNT 쿼리 분리 — 7~8초",
      after: "CTE UNION ALL + ROW_NUMBER + COUNT(*) OVER() 단일 쿼리 — 1~2초",
      techniques: [
        {
          label: "CTE + UNION ALL",
          desc: "구 게시판(GtblQaABoard)과 신 게시판(tblSukangReading)을 WITH 절 안에서 통합. 두 테이블을 순회하는 2번의 쿼리를 단일 실행으로 압축.",
        },
        {
          label: "VARCHAR DateTime 파싱",
          desc: 'brd_writeday가 DateTime이 아닌 VARCHAR("2025-12-12 오후 8:50:20" 형식)로 저장되어 있어 신 게시판 DateTime과 UNION ALL 후 ORDER BY 불가. CASE WHEN + CHARINDEX + SUBSTRING으로 오전/오후를 파싱해 24시간 포맷 VARCHAR(23)으로 통일. 오전 12시→00시, 오후 12시→12시 예외처리 포함.',
        },
        {
          label: "ROW_NUMBER() 페이징",
          desc: "ROW_NUMBER() OVER(ORDER BY parsed_date DESC)로 오프셋 기반 페이징 처리. OFFSET-FETCH 없이 레거시 환경에서도 동작하는 방식으로 구현.",
        },
        {
          label: "COUNT(*) OVER() 인라인 집계",
          desc: "전체 건수 조회를 위한 별도 COUNT 쿼리 제거. COUNT(*) OVER()를 SELECT 안에 포함해 단일 쿼리로 총 건수와 데이터를 동시 반환.",
        },
        {
          label: "NOLOCK + 복합 인덱스",
          desc: "읽기 전용 목록 조회에 WITH(NOLOCK) 힌트 적용. brd_userId + brd_writeday, brd_isDeleted + brd_writeday 복합 인덱스 2개 추가로 필터링 성능 최적화.",
        },
      ],
      result: "리스트 조회 7~8초 → 1~2초 · 검색 15초 이상 → 3초대",
    },

    // ── Security & Access Control (Board에서 독립 승격)
    securitySystem: {
      title: "Security & Access Control",
      intro:
        "Classic ASP 환경에서 클라이언트 우회 가능성을 고려하여 서버 + 클라이언트 이중 방어 전략을 적용했습니다. 모든 접근 제어는 서버단이 우선이며 클라이언트는 보조 처리입니다.",
      items: [
        {
          label: "파라미터화 쿼리 — SQL Injection 방어",
          desc: "ADODB.Command + CreateParameter로 모든 INSERT/UPDATE/DELETE를 파라미터 바인딩 처리. 문자열 직접 접합 방식 완전 제거. 타입·길이 강제 지정으로 오버플로우 방어.",
          accent: "rgba(255, 80, 80, 0.5)",
        },
        {
          label: "작성자 전용 접근 제어",
          desc: "brd_writer와 Session userid를 서버에서 비교. 타인의 brd_idx로 직접 URL 접근 시 신규 작성 페이지로 강제 리다이렉트. 클라이언트 파라미터 조작으로 우회 불가.",
          accent: "rgba(255, 80, 80, 0.4)",
        },
        {
          label: "답변 존재 시 수정·삭제 잠금",
          desc: "HasComments() 함수가 tblComment를 조회해 관리자 답변 여부를 서버에서 확인. 답변이 달린 게시글은 수정·삭제 폼 자체를 서버에서 차단. 클라이언트에서도 버튼을 숨겨 이중 방어.",
          accent: "rgba(255, 150, 50, 0.4)",
        },
        {
          label: "adminLevel 권한 분기",
          desc: "brd_isFixed = -1인 고정 템플릿은 adminLevel ≤ 2만 수정·삭제 가능. 일반 템플릿은 최고관리자 또는 작성자 본인만 삭제 가능. ASP 서버 검증 + JS 클라이언트 이중 체크.",
          accent: "rgba(100, 160, 255, 0.4)",
        },
        {
          label: "소프트 딜리트 패턴",
          desc: "brd_isDeleted = -1 플래그와 brd_deletedAt 타임스탬프로 논리 삭제. 물리 삭제 없이 데이터 보존 및 감사 추적 가능. 복구 요청 대응 가능.",
          accent: "rgba(0, 242, 96, 0.3)",
        },
      ],
    },

    // ── 게시판 답변 템플릿 시스템
    templateSystem: {
      background:
        "교육원 담당자들이 1:1 게시판 답변 작성 시 동일한 내용을 매번 직접 입력하는 비효율이 반복되고 있었습니다. 배송일 안내, 환불 정책, 과정 문의 등 유형이 정해진 답변임에도 별도 시스템이 없어 담당자마다 내용이 달라지는 문제도 있었습니다.",
      desc: "관리자가 자주 사용하는 답변을 카테고리별로 저장·재사용하는 템플릿 관리 시스템입니다. contentEditable 기반 인라인 편집, adminLevel 권한 분기, 배송일 자동 치환, 복사 애니메이션까지 단일 페이지(ASP + Vanilla JS)로 구현했습니다.",
      screenshots: [
        {
          src: "/media/template-list.png",
          caption: "기본 상태 — 카테고리 필터 + 템플릿 목록",
        },
        {
          src: "/media/template-edit.png",
          caption: "인라인 편집 — 클릭 즉시 편집, 편집중 badge 표시",
        },
        {
          src: "/media/template-nav.png",
          caption: "카테고리 네비게이션 — 서브 필터 + 빠른 이동",
        },
      ],
      schema: [
        { column: "brd_idx", type: "int", desc: "PK" },
        {
          column: "brd_writer",
          type: "nvarchar",
          desc: "작성자 (Session AdminID)",
        },
        { column: "brd_title", type: "nvarchar", desc: "템플릿 제목" },
        { column: "brd_content", type: "nvarchar", desc: "템플릿 내용" },
        {
          column: "brd_category",
          type: "nvarchar",
          desc: "카테고리 (강의 / 배송 / 결제 …)",
        },
        { column: "brd_regDate", type: "datetime", desc: "등록일" },
        {
          column: "brd_updateDate",
          type: "datetime",
          desc: "수정일 (GETDATE() 자동 갱신)",
        },
        { column: "brd_is_Deleted", type: "bit", desc: "소프트 삭제 플래그" },
        { column: "brd_deleted_at", type: "datetime", desc: "삭제 시각" },
        { column: "brd_adCheck", type: "bit", desc: "수정 확인 플래그" },
        {
          column: "brd_isFixed",
          type: "bit",
          desc: "-1: 고정 템플릿 / 0: 일반",
        },
      ],
      highlights: [
        {
          label: "contentEditable 인라인 편집",
          desc: "제목·내용 클릭 즉시 편집 모드 전환. 별도 편집 페이지 없이 DOM 내에서 처리하며 바깥 클릭 시 자동 취소.",
        },
        {
          label: "배송일 자동 계산 및 플레이스홀더 치환",
          desc: "ASP에서 license DB의 tb_sendDay를 조회해 배송일을 계산하고 JS 변수로 전달. 고정 템플릿 내 [배송일1] · [배송일2] · [배송일3] 플레이스홀더를 실제 날짜로 자동 치환.",
        },
        {
          label: "복사 + 시각 피드백",
          desc: "Clipboard API 우선 시도, 실패 시 execCommand fallback. 복사 성공 시 카드 페이드 애니메이션 + 인라인 '복사되었습니다' 메시지 표시.",
        },
        {
          label: "DOM 덮어씌우지 않는 카테고리 필터",
          desc: "카테고리 전환 시 innerHTML 재생성 없이 기존 요소의 display를 토글. 인라인 편집 상태 유지 및 불필요한 DOM 재생성 방지.",
        },
      ],
    },

    // ── 1:1 게시판 시스템 (에디터 + 레거시 통합 — Security/Query는 독립 섹션으로 분리)
    boardSystem: {
      background:
        "기존 1:1 게시판은 단순 텍스트 입력만 가능하고 수강생 UX가 열악했습니다. 수강생 UI·관리자 UI·DB 쿼리까지 전면 재설계하여 성능과 사용성 문제를 동시에 해결했습니다.",
      screenshots: [
        {
          src: "/media/board-write.png",
          caption: "새 글 작성 — 리치 에디터 + 글목록 패널",
        },
        {
          src: "/media/board-editor.png",
          caption: "에디터 동작 — 서식·이미지 첨부·글자 수 카운트",
        },
      ],
      editor: [
        {
          label: "라이브러리 없는 리치 에디터",
          desc: "Quill·TipTap 등 외부 에디터 없이 contentEditable + execCommand로 직접 구현. 폰트 패밀리·크기·굵기·색상·정렬·표 삽입까지 커버.",
        },
        {
          label: "이미지 업로드 파이프라인",
          desc: "클라이언트 사전 검증(타입·2MB 크기·최대 2개) → XHR 비동기 업로드 → 서버 저장 후 URL 반환 → AttachmentManager 상태 관리. 드래그앤드롭·클립보드 붙여넣기도 동일 파이프라인 통과.",
        },
        {
          label: "폰트 크기 실시간 감지 동기화",
          desc: "selectionchange 이벤트마다 커서 위치 요소에 getComputedStyle 적용. px 단위가 아닌 경우 임시 span으로 실제 픽셀 크기를 계산해 select 박스에 즉시 반영.",
        },
        {
          label: "1,500자 제한 + 디바운스",
          desc: "Utils.stripHTML로 HTML 태그 제거 후 순수 텍스트 기준 카운트. 100ms 디바운스로 매 입력마다 DOM 탐색 비용 절감. 초과 시 자동 트림 처리.",
        },
      ],
      legacyIntegration:
        "기존 GtblQaABoard 테이블의 구 게시글을 신규 UI에서 그대로 열람 가능하도록 legacy_mode=1 파라미터와 GetLegacyPost() 함수로 하위 호환 처리. 신구 게시글이 하나의 글목록에 통합 표시되며, 구 게시글의 댓글은 cmt_brdIdx 기준 별도 조회로 정합성 유지.",
    },

    // ── KPCP 리뉴얼
    kpcpRenewal: {
      desc: "기존 레거시 자격증 상세페이지를 시맨틱 HTML5 구조로 전면 리뉴얼했습니다. 단순 마크업 개선을 넘어 FOUC 문제 해결, 반응형 레이아웃 재설계, license DB 통계 쿼리 연동을 통한 개인화 콘텐츠 추가까지 함께 진행했습니다.",
      screenshots: {
        before: {
          src: "/media/kpcp-before.gif",
          caption: "리뉴얼 전 — font-display 없음, FOUC 발생",
        },
        after: {
          src: "/media/kpcp-after.gif",
          caption: "리뉴얼 후 — font-display: swap 적용, 자연스러운 전환",
        },
      },
      changes: [
        {
          label: "시맨틱 HTML5 구조",
          before: "div 중심 레이아웃 · 접근성 속성 없음 · 제목 계층 구조 없음",
          after:
            "<section aria-label> / <article> / <figure> / <blockquote> 로 의미 구조 확립",
        },
        {
          label: "반응형 레이아웃",
          before: "PC/MO 동일 마크업 · JS로 레이아웃 분기 처리",
          after: "CSS만으로 PC/MO 분리 렌더링 (<picture>, media 속성 활용)",
        },
        {
          label: "FOUC",
          before:
            "@font-face font-display 없음 → 폰트 로딩 차단 or 교체 시 깜빡임",
          after:
            "font-display: swap + woff2 preload → fallback 즉시 렌더링 후 전환",
        },
        {
          label: "메타태그 위치",
          before: "하단 혼재 배치 → 크롤러 인식 지연",
          after: "<head> 최상단 집중 배치",
        },
      ],
      results: [
        {
          label: "SEO",
          value: "100점",
          desc: "KPCP PC 기준 Lighthouse SEO 100점 달성",
        },
        {
          label: "LCP",
          value: "+21%p",
          desc: "40% → 61% · JS resize 로직을 CSS로 전환",
        },
        {
          label: "CLS",
          value: "개선",
          desc: "폰트 교체로 인한 레이아웃 이동 제거",
        },
      ],
      fout: {
        problem:
          "@font-face 선언에 font-display 속성이 없어, 커스텀 폰트(Cafe24Ohsquare) 로딩이 완료될 때까지 브라우저가 텍스트 렌더링을 차단하거나 폰트 교체 시 레이아웃 이동이 발생했습니다.",
        codeBefore: `@font-face {
  font-family: 'Cafe24Ohsquare';
  src: url('/application/new_list/Cafe24Ohsquare.woff2') format('woff2'),
       url('/application/new_list/Cafe24Ohsquare.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  /* font-display 없음 → FOUC 발생 */
}`,
        codeAfter: `@font-face {
  font-family: 'Cafe24Ohsquare';
  src: url('/application/new_list/Cafe24Ohsquare.woff2') format('woff2'),
       url('/application/new_list/Cafe24Ohsquare.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  font-display: swap; /* ← 추가: 폰트 로딩 중 fallback 폰트 즉시 노출 */
}`,
        solution:
          "font-display: swap 적용으로 폰트 로딩 중 fallback 폰트를 즉시 노출, 로딩 완료 시 교체. 추가로 woff2 포맷 preload link를 추가하여 폰트 파일 다운로드 우선순위를 끌어올렸습니다. 배너 이미지도 LCP 주요 요소이므로 PC/MO 분기하여 media 속성이 포함된 preload link를 함께 추가했습니다.",
        codePreload: `<!-- 폰트 preload — woff2 우선 다운로드 -->
<link rel="preload" as="font" type="font/woff2"
  href="/application/new_list/Cafe24Ohsquare.woff2"
  crossorigin>

<!-- ★ 배너 이미지 preload — PC/MO 분기 -->
<link rel="preload" as="image"
  href="/images/renewal/banner/banner_01.webp"
  media="(min-width: 768px)">
<link rel="preload" as="image"
  href="/images/renewal/banner/banner_n01.webp"
  media="(max-width: 767px)">`,
      },
      ageQuery: {
        desc: "리뉴얼 자격증 상세페이지에 '본원 통계 결과 ○○대에서 가장 많이 취득한 자격증' 문구를 동적으로 표시하기 위해, license DB의 실 결제 데이터를 기반으로 자격증별 주요 수강 연령대를 산출하는 통계 쿼리를 작성했습니다.",
        points: [
          {
            label: "생년월일 → 나이대 변환",
            desc: "loi_birth(VARCHAR, YYYYMMDD)에서 LEFT(loi_birth, 4)로 출생연도 추출 → YEAR(GETDATE()) - 출생연도로 나이 계산 → CASE WHEN으로 10대~90대 그룹핑.",
          },
          {
            label: "자격증별 연령대 집계",
            desc: "loi_licenseCode + loi_manage 기준으로 GROUP BY하여 연령대별 결제 건수(cnt) 집계. 최근 1년 데이터만 필터링하여 최신 트렌드 반영.",
          },
          {
            label: "TOP 2 추출 — ROW_NUMBER()",
            desc: "PARTITION BY loi_licenseCode, loi_manage ORDER BY cnt DESC로 연령대 순위 산출. rn <= 2 조건으로 1위·2위만 JOIN.",
          },
          {
            label: "정렬 및 표시 처리 (ASP)",
            desc: "두 연령대가 같으면 하나만, 다르면 어린 연령대가 앞에 오도록 CInt(Replace(age,'대','')) 비교 후 정렬하여 '30대, 40대' 형태로 출력.",
          },
        ],
        codeBlock: `WITH AgeStats AS (
  SELECT
    loi_licenseCode, loi_manage,
    CASE
      WHEN YEAR(GETDATE()) - CONVERT(int, LEFT(loi_birth, 4)) BETWEEN 19 AND 28 THEN '20대'
      WHEN YEAR(GETDATE()) - CONVERT(int, LEFT(loi_birth, 4)) BETWEEN 29 AND 38 THEN '30대'
      WHEN YEAR(GETDATE()) - CONVERT(int, LEFT(loi_birth, 4)) BETWEEN 39 AND 48 THEN '40대'
      -- ... 10대~90대
    END AS AgeGroup,
    COUNT(*) AS cnt
  FROM [license].[dbo].[GtblLicenseOrderInfo]
  WHERE loi_groupCode = 'cyberiedu'
    AND loi_settleOpt = '1'
    AND loi_onlycard = 0
    AND CONVERT(int, REPLACE(LEFT(loi_regDate,10),'-',''))
        >= CONVERT(int, REPLACE(CONVERT(varchar(10),
           DATEADD(YEAR,-1,GETDATE()),120),'-',''))
  GROUP BY loi_licenseCode, loi_manage, CASE WHEN ... END
),
RankedAge AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY loi_licenseCode, loi_manage
      ORDER BY cnt DESC
    ) AS rn
  FROM AgeStats
)
SELECT li.li_licenseName, ra.AgeGroup AS MaxAgeGroup, ra.cnt, ra.rn
FROM [license].dbo.GtblLicenseInfo2 li
INNER JOIN RankedAge ra
  ON li.li_licenseCode = ra.loi_licenseCode
  AND ra.rn <= 2
WHERE li.li_licenseName = :lic_name
ORDER BY ra.rn`,
        result: `' ASP — 두 행 순회 후 표시 문자열 조합
topAgeGroup1 = ageStatsRs("MaxAgeGroup")   ' 1위
ageStatsRs.MoveNext
topAgeGroup2 = ageStatsRs("MaxAgeGroup")   ' 2위

If CInt(Replace(top1,"대","")) > CInt(Replace(top2,"대","")) Then
  ageResultText = top2 & ", " & top1  ' ex) 30대, 40대
Else
  ageResultText = top1 & ", " & top2
End If`,
      },
    },

    problems: [
      {
        title: "FOUC — 폰트 초기 로딩 시 스타일 없는 콘텐츠 노출",
        desc: "폰트 로딩 지연으로 인해 페이지 초기 진입 시 텍스트가 스타일 없이 노출되었다가 교체되는 FOUC 현상이 자격증 상세페이지에서 발생.",
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

    // ── Tech Stack — DB → 서버 → 프론트 순으로 재배열
    stack: [
      "MSSQL (CTE · Index · Query Tuning)",
      "Classic ASP (Server Logic)",
      "Cross DB JOIN",
      "Session 인증",
      "SQL Injection 방어",
      "JavaScript (ES6+)",
      "HTML5 / CSS3",
      "contentEditable API",
      "SEO / Core Web Vitals",
      "반응형 웹",
      "Swiper.js",
      "FTP 배포",
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
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✨  ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.93); }
  to   { opacity: 1; transform: scale(1); }
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
  font-family: monospace;
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

const Lightbox = ({ src, caption, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
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
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.8;
  animation: ${fadeUp} 0.8s 0.2s ease both;
`;
/* ★ 추가: 풀스택 타글라인 */
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
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  letter-spacing: 0.5px;
  animation: ${fadeUp} 0.8s 0.3s ease both;
  width: fit-content;
  &::before {
    content: "→";
    opacity: 0.6;
  }
`;

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
const Section = styled.section`
  margin-bottom: 6rem;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚨  PROBLEM & ENVIRONMENT  (신규 섹션)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ProbEnvGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: 3rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const ProbEnvCard = styled.div`
  background: #0f0f0f;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
  &:hover {
    background: rgba(255, 60, 60, 0.03);
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 80, 80, 0.5);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  &:hover::before {
    transform: scaleX(1);
  }
`;
const ProbEnvIcon = styled.div`
  font-size: 1.4rem;
  margin-bottom: 0.8rem;
`;
const ProbEnvLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`;
const ProbEnvDesc = styled.div`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.7;
`;
const ProbEnvIntro = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.9;
  margin-bottom: 2.5rem;
  padding-top: 5rem;
`;
const ProbEnvInfoRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🗄️  ARCHITECTURE STYLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ArchDesc = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.9;
  margin-bottom: 3rem;
`;
const ArchTopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const ScreenshotWrap = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background: #0f0f0f;
`;
const ScreenshotScroll = styled.div`
  height: 420px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px 4px 0 0;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 96, 0.3);
    border-radius: 2px;
  }
`;
const Screenshot = styled.img`
  width: 100%;
  display: block;
  opacity: 0.85;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
`;
const ScreenshotCaption = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: monospace;
`;
const DiagramWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
const DiagramMain = styled.div`
  background: rgba(0, 242, 96, 0.06);
  border: 1px solid rgba(0, 242, 96, 0.3);
  border-radius: 4px;
  padding: 1rem 1.4rem;
  margin-bottom: 0.8rem;
`;
const DiagramMainBadge = styled.div`
  font-size: 0.58rem;
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
  opacity: 0.7;
`;
const DiagramMainName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  font-family: monospace;
  margin-bottom: 0.5rem;
`;
const FieldRow = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;
const Field = styled.span`
  font-size: 0.6rem;
  padding: 0.15rem 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
  font-family: monospace;
`;
const DiagramSection = styled.span`
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
const DiagramChildRow = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: stretch;
  margin-bottom: 0.6rem;
`;
const DiagramConnectBar = styled.div`
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
const DiagramChild = styled.div`
  flex: 1;
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 2px solid rgba(0, 242, 96, 0.25);
  border-radius: 0 4px 4px 0;
  padding: 0.8rem 1rem;
`;
const DiagramChildMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
`;
const DiagramChildName = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #e8e8e8;
  font-family: monospace;
`;
const DiagramChildRole = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.4rem;
`;
const JoinBadge = styled.span`
  font-size: 0.55rem;
  padding: 0.1rem 0.4rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  font-family: monospace;
  letter-spacing: 0.5px;
`;
const CodeBlockWrap = styled.div`
  background: #060606;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  overflow: hidden;
`;
const CodeBlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.2rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;
const CodeBlockLang = styled.span`
  font-size: 0.62rem;
  color: rgba(0, 242, 96, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: monospace;
`;
const CodeBlockDots = styled.div`
  display: flex;
  gap: 6px;
  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }
`;
const CodeBlockBody = styled.pre`
  padding: 1.8rem 2rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.75rem;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.55);
  overflow-x: auto;
  margin: 0;
  .kw {
    color: #c792ea;
  }
  .cm {
    color: rgba(255, 255, 255, 0.22);
    font-style: italic;
  }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚡  QUERY ENGINEERING STYLES  (신규 섹션)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const QEBackground = styled.div`
  background: rgba(0, 242, 96, 0.04);
  border: 1px solid rgba(0, 242, 96, 0.15);
  border-left: 3px solid rgba(0, 242, 96, 0.5);
  border-radius: 0 4px 4px 0;
  padding: 1.4rem 1.8rem;
  margin-bottom: 2.5rem;
`;
const QEBgLabel = styled.div`
  font-size: 0.6rem;
  color: rgba(0, 242, 96, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
`;
const QEBgText = styled.p`
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.85;
  margin: 0;
`;
const QEResultBanner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1.2rem 1.8rem;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  margin-bottom: 2rem;
`;
const QEBefore = styled.div`
  font-size: 0.82rem;
  color: rgba(255, 100, 100, 0.8);
  font-family: monospace;
`;
const QEArrow = styled.div`
  font-size: 1.4rem;
  color: rgba(0, 242, 96, 0.5);
  text-align: center;
`;
const QEAfter = styled.div`
  font-size: 0.82rem;
  color: rgba(0, 242, 96, 0.8);
  font-family: monospace;
  text-align: right;
`;
const QETechGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const QETechItem = styled.div`
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 2px solid rgba(0, 242, 96, 0.4);
  padding: 1rem 1.2rem;
  border-radius: 0 4px 4px 0;
`;
const QETechLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
`;
const QETechDesc = styled.div`
  font-size: 0.77rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.7;
`;
const QEResultTag = styled.div`
  display: inline-block;
  margin-top: 0;
  padding: 0.6rem 1.2rem;
  background: rgba(0, 242, 96, 0.08);
  border: 1px solid rgba(0, 242, 96, 0.25);
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  font-size: 0.8rem;
  border-radius: 2px;
  font-weight: 700;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔒  SECURITY STYLES  (신규 섹션)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SecurityIntro = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.9;
  margin-bottom: 2.5rem;
`;
const SecurityGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 2rem;
`;
const SecurityItem = styled.div`
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 3px solid ${({ accent }) => accent || "rgba(255,80,80,0.4)"};
  padding: 1.4rem 1.8rem;
  border-radius: 0 4px 4px 0;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;
const SecurityItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
`;
const SecurityItemLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
`;
const SecurityItemBadge = styled.span`
  font-size: 0.55rem;
  padding: 0.15rem 0.5rem;
  background: rgba(255, 80, 80, 0.08);
  border: 1px solid rgba(255, 80, 80, 0.2);
  color: rgba(255, 120, 120, 0.7);
  border-radius: 2px;
  letter-spacing: 1px;
  font-family: monospace;
`;
const SecurityItemDesc = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.42);
  line-height: 1.75;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊  METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔧  FEATURE ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔒  BOARD SYSTEM STYLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const BoardBackground = styled.div`
  background: rgba(0, 242, 96, 0.04);
  border: 1px solid rgba(0, 242, 96, 0.15);
  border-left: 3px solid rgba(0, 242, 96, 0.5);
  border-radius: 0 4px 4px 0;
  padding: 1.4rem 1.8rem;
  margin-bottom: 2.5rem;
`;
const BoardBackgroundLabel = styled.div`
  font-size: 0.6rem;
  color: rgba(0, 242, 96, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
`;
const BoardBackgroundText = styled.p`
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.85;
  margin: 0;
`;
const BoardScreenshotRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 3rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const BoardScreenshotItem = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  overflow: hidden;
  background: #0f0f0f;
`;
const BoardScreenshotScroll = styled.div`
  height: 320px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 96, 0.25);
    border-radius: 2px;
  }
`;
const BoardScreenshot = styled.img`
  width: 100%;
  display: block;
  opacity: 0.88;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
`;
const BoardScreenshotCaption = styled.div`
  padding: 0.6rem 0.8rem;
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: monospace;
  letter-spacing: 0.5px;
`;
const BoardSubLabel = styled.div`
  font-size: 0.65rem;
  color: rgba(0, 242, 96, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;
const BoardItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;
const BoardItem = styled.div`
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 2px solid ${({ accent }) => accent || "rgba(0,242,96,0.3)"};
  padding: 1rem 1.2rem;
  border-radius: 0 4px 4px 0;
`;
const BoardItemLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.35rem;
`;
const BoardItemDesc = styled.div`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.7;
`;
const LegacyBadge = styled.span`
  font-size: 0.55rem;
  padding: 0.12rem 0.5rem;
  background: rgba(100, 160, 255, 0.1);
  border: 1px solid rgba(100, 160, 255, 0.25);
  color: rgba(130, 170, 255, 0.7);
  border-radius: 2px;
  letter-spacing: 1px;
  font-family: monospace;
`;
const LegacyBlock = styled.div`
  background: #0f0f0f;
  border: 1px solid rgba(100, 160, 255, 0.15);
  border-left: 3px solid rgba(100, 160, 255, 0.4);
  border-radius: 0 4px 4px 0;
  padding: 1.2rem 1.6rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.85;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋  TEMPLATE SYSTEM STYLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const TplDesc = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.9;
  margin-bottom: 3rem;
`;
const TplBackground = styled.div`
  background: rgba(0, 242, 96, 0.04);
  border: 1px solid rgba(0, 242, 96, 0.15);
  border-left: 3px solid rgba(0, 242, 96, 0.5);
  border-radius: 0 4px 4px 0;
  padding: 1.4rem 1.8rem;
  margin-bottom: 2.5rem;
`;
const TplBackgroundLabel = styled.div`
  font-size: 0.6rem;
  color: rgba(0, 242, 96, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
`;
const TplBackgroundText = styled.p`
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.85;
  margin: 0;
`;
const TplScreenshotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const TplScreenshotItem = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  overflow: hidden;
  background: #0f0f0f;
`;
const TplScreenshotScroll = styled.div`
  height: 280px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 96, 0.25);
    border-radius: 2px;
  }
`;
const TplScreenshot = styled.img`
  width: 100%;
  display: block;
  opacity: 0.85;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
`;
const TplScreenshotCaption = styled.div`
  padding: 0.6rem 0.8rem;
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: monospace;
  letter-spacing: 0.5px;
`;
const TplLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const TplSubLabel = styled.div`
  font-size: 0.65rem;
  color: rgba(0, 242, 96, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;
const SchemaTable = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  overflow: hidden;
`;
const SchemaHeader = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1fr;
  padding: 0.6rem 1rem;
  background: rgba(0, 242, 96, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 0.6rem;
  color: rgba(0, 242, 96, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
`;
const SchemaRow = styled.div`
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
  font-family: monospace;
  font-size: 0.72rem;
  color: #e8e8e8;
`;
const SchemaType = styled.div`
  font-family: monospace;
  font-size: 0.65rem;
  color: rgba(130, 170, 255, 0.7);
`;
const SchemaDesc = styled.div`
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
`;
const HighlightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const HighlightItem = styled.div`
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 2px solid rgba(0, 242, 96, 0.3);
  padding: 1rem 1.2rem;
  border-radius: 0 4px 4px 0;
`;
const HighlightLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
`;
const HighlightDesc = styled.div`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.7;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔄  KPCP RENEWAL STYLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const RenewalDesc = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.9;
  margin-bottom: 3rem;
`;
const BeforeAfterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 3rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const BeforeAfterItem = styled.div`
  border: 1px solid
    ${({ isAfter }) =>
      isAfter ? "rgba(0,242,96,0.25)" : "rgba(255,255,255,0.07)"};
  border-radius: 4px;
  overflow: hidden;
  background: #0f0f0f;
`;
const BeforeAfterBadge = styled.div`
  padding: 0.55rem 1rem;
  font-size: 0.62rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: monospace;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: ${({ isAfter }) =>
    isAfter ? "rgba(0,242,96,0.7)" : "rgba(255,100,100,0.7)"};
  background: ${({ isAfter }) =>
    isAfter ? "rgba(0,242,96,0.04)" : "rgba(255,100,100,0.04)"};
`;
const BeforeAfterScroll = styled.div`
  height: 300px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 96, 0.25);
    border-radius: 2px;
  }
`;
const BeforeAfterImg = styled.img`
  width: 100%;
  display: block;
  opacity: 0.85;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
`;
const BeforeAfterCaption = styled.div`
  padding: 0.6rem 0.8rem;
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.28);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: monospace;
`;
const ChangesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 3rem;
`;
const ChangeRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  gap: 0;
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: none;
  &:first-child {
    border-radius: 4px 4px 0 0;
  }
  &:last-child {
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 0 0 4px 4px;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const ChangeLabel = styled.div`
  padding: 1rem 1.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #e8e8e8;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
`;
const ChangeBefore = styled.div`
  padding: 1rem 1.2rem;
  font-size: 0.75rem;
  color: rgba(255, 100, 100, 0.7);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  line-height: 1.6;
`;
const ChangeAfter = styled.div`
  padding: 1rem 1.2rem;
  font-size: 0.75rem;
  color: rgba(0, 242, 96, 0.8);
  line-height: 1.6;
`;
const RenewalSubLabel = styled.div`
  font-size: 0.65rem;
  color: rgba(0, 242, 96, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;
const FoutBlock = styled.div`
  margin-bottom: 3rem;
`;
const FoutProblem = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.85;
  margin-bottom: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 100, 100, 0.04);
  border: 1px solid rgba(255, 100, 100, 0.12);
  border-left: 3px solid rgba(255, 100, 100, 0.4);
  border-radius: 0 4px 4px 0;
`;
const FoutCodeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const FoutCodeItem = styled.div`
  border: 1px solid
    ${({ isAfter }) =>
      isAfter ? "rgba(0,242,96,0.2)" : "rgba(255,100,100,0.15)"};
  border-radius: 4px;
  overflow: hidden;
  background: #060606;
`;
const FoutCodeHeader = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.6rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  font-family: monospace;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: ${({ isAfter }) =>
    isAfter ? "rgba(0,242,96,0.6)" : "rgba(255,100,100,0.6)"};
  background: rgba(255, 255, 255, 0.02);
`;
const FoutCodeBody = styled.pre`
  padding: 1.2rem;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.7rem;
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.5);
  overflow-x: auto;
  margin: 0;
  .hi {
    color: #00f296;
    font-weight: 700;
  }
  .cm {
    color: rgba(255, 255, 255, 0.22);
    font-style: italic;
  }
  .bad {
    color: rgba(255, 100, 100, 0.7);
  }
`;
const FoutSolution = styled.div`
  font-size: 0.85rem;
  color: rgba(0, 242, 96, 0.7);
  line-height: 1.85;
  padding: 1.2rem 1.5rem;
  background: rgba(0, 242, 96, 0.04);
  border: 1px solid rgba(0, 242, 96, 0.12);
  border-left: 3px solid rgba(0, 242, 96, 0.5);
  border-radius: 0 4px 4px 0;
  &::before {
    content: "→ ";
  }
`;
const AgeQueryBlock = styled.div``;
const AgeQueryDesc = styled.p`
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.85;
  margin-bottom: 2rem;
`;
const AgeQueryPoints = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 2rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const AgeQueryPoint = styled.div`
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 2px solid rgba(0, 242, 96, 0.3);
  padding: 1rem 1.2rem;
  border-radius: 0 4px 4px 0;
`;
const AgeQueryPointLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
`;
const AgeQueryPointDesc = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.7;
`;
const ResultPreview = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: #060606;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.7;
  .highlight {
    color: rgba(0, 242, 96, 0.9);
    font-weight: 700;
  }
  .label {
    font-size: 0.6rem;
    color: rgba(0, 242, 96, 0.5);
    letter-spacing: 2px;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.5rem;
    font-family: monospace;
  }
`;
const RenewalResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: 3rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const RenewalResultCard = styled.div`
  background: #0f0f0f;
  padding: 2rem 1.8rem;
  position: relative;
  overflow: hidden;
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
`;
const RenewalResultLabel = styled.div`
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;
const RenewalResultValue = styled.div`
  font-size: 2.8rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors?.primary ?? "#00ff44"};
  line-height: 1;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(0, 242, 96, 0.3);
`;
const RenewalResultDesc = styled.div`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.5;
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏆  PROBLEM SOLVING + STACK + TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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
  }
`;
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🛠️  SQL HIGHLIGHTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const KEYWORDS = [
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
  let result = code.replace(/(--[^\n]*)/g, `\x00CM\x01$1\x00/CM\x01`);
  KEYWORDS.forEach((kw) => {
    result = result.replace(
      new RegExp(`(?<![\\x00-\\x01a-zA-Z])${kw}(?![a-zA-Z\\x00-\\x01])`, "g"),
      `\x00KW\x01${kw}\x00/KW\x01`,
    );
  });
  return result
    .replace(/\x00KW\x01(.*?)\x00\/KW\x01/g, `<span class="kw">$1</span>`)
    .replace(/\x00CM\x01(.*?)\x00\/CM\x01/g, `<span class="cm">$1</span>`);
};

const highlightFoutCode = (code) =>
  code
    .replace(/(\/\*.*?\*\/|--[^\n]*)/gs, `<span class="cm">$1</span>`)
    .replace(/(font-display:\s*swap)/g, `<span class="hi">$1</span>`)
    .replace(/(\/\* font-display 없음.*?\*\/)/g, `<span class="bad">$1</span>`);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚨  Problem & Environment Section  (신규)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ProblemEnvSection = ({ data, role, environment, scale }) => (
  <div>
    <ProbEnvIntro>{data.intro}</ProbEnvIntro>
    <ProbEnvInfoRow>
      <InfoItem>
        <div className="label">Role</div>
        <div className="value">{role}</div>
      </InfoItem>
      <InfoItem>
        <div className="label">Environment</div>
        <div className="value">{environment}</div>
      </InfoItem>
      <InfoItem>
        <div className="label">Scale</div>
        <div className="value">{scale}</div>
      </InfoItem>
    </ProbEnvInfoRow>
    <SectionLabel>Problem & Environment</SectionLabel>
    <ProbEnvGrid>
      {data.issues.map((issue, i) => (
        <ProbEnvCard key={i}>
          <ProbEnvIcon>{issue.icon}</ProbEnvIcon>
          <ProbEnvLabel>{issue.label}</ProbEnvLabel>
          <ProbEnvDesc>{issue.desc}</ProbEnvDesc>
        </ProbEnvCard>
      ))}
    </ProbEnvGrid>
  </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🗄️  Architecture Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ArchitectureSection = ({ arch, onImgClick }) => (
  <Section>
    <SectionLabel>Data Architecture</SectionLabel>
    <ArchDesc>{arch.desc}</ArchDesc>
    <ArchTopRow>
      <ScreenshotWrap>
        <ScreenshotScroll>
          <ImgClickWrap
            onClick={() => onImgClick(arch.screenshot, arch.screenshotCaption)}
          >
            <Screenshot src={arch.screenshot} alt="과정 상세 페이지" />
          </ImgClickWrap>
        </ScreenshotScroll>
        <ScreenshotCaption>↑ {arch.screenshotCaption}</ScreenshotCaption>
      </ScreenshotWrap>
      <DiagramWrap>
        <DiagramMain>
          <DiagramMainBadge>MAIN TABLE</DiagramMainBadge>
          <DiagramMainName>{arch.tables[0].name}</DiagramMainName>
          <FieldRow>
            {arch.tables[0].fields.map((f) => (
              <Field key={f}>{f}</Field>
            ))}
            <DiagramSection>{arch.tables[0].section}</DiagramSection>
          </FieldRow>
        </DiagramMain>
        {arch.tables.slice(1).map((table, i) => (
          <DiagramChildRow key={i}>
            <DiagramConnectBar>
              <ConnectLine />
              <ConnectDot />
              <ConnectLine style={{ flex: "none", height: "8px" }} />
            </DiagramConnectBar>
            <DiagramChild>
              <DiagramChildMeta>
                <DiagramChildName>{table.name}</DiagramChildName>
                <JoinBadge>{table.join}</JoinBadge>
              </DiagramChildMeta>
              <DiagramChildRole>
                {table.role} · {table.joinKey}
              </DiagramChildRole>
              <FieldRow>
                {table.fields.map((f) => (
                  <Field key={f}>{f}</Field>
                ))}
                <DiagramSection>{table.section}</DiagramSection>
              </FieldRow>
            </DiagramChild>
          </DiagramChildRow>
        ))}
      </DiagramWrap>
    </ArchTopRow>
    <CodeBlockWrap>
      <CodeBlockHeader>
        <CodeBlockLang>SQL — 단일 쿼리로 4개 DB 통합</CodeBlockLang>
        <CodeBlockDots>
          <span />
          <span />
          <span />
        </CodeBlockDots>
      </CodeBlockHeader>
      <CodeBlockBody
        dangerouslySetInnerHTML={{ __html: highlightSQL(arch.codeBlock) }}
      />
    </CodeBlockWrap>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚡  Query Engineering Section  (신규 독립 섹션)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const QueryEngineeringSection = ({ qe }) => (
  <Section>
    <SectionLabel>Query Engineering</SectionLabel>
    <QEBackground>
      <QEBgLabel>Background</QEBgLabel>
      <QEBgText>{qe.background}</QEBgText>
    </QEBackground>
    <QEResultBanner>
      <QEBefore>{qe.before}</QEBefore>
      <QEArrow>→</QEArrow>
      <QEAfter>{qe.after}</QEAfter>
    </QEResultBanner>
    <QETechGrid>
      {qe.techniques.map((t, i) => (
        <QETechItem key={i}>
          <QETechLabel>{t.label}</QETechLabel>
          <QETechDesc>{t.desc}</QETechDesc>
        </QETechItem>
      ))}
    </QETechGrid>
    <QEResultTag>✓ {qe.result}</QEResultTag>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔒  Security Section  (신규 독립 섹션)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SecuritySection = ({ sec }) => (
  <Section>
    <SectionLabel>Security & Access Control</SectionLabel>
    <SecurityIntro>{sec.intro}</SecurityIntro>
    <SecurityGrid>
      {sec.items.map((item, i) => (
        <SecurityItem key={i} accent={item.accent}>
          <SecurityItemHeader>
            <SecurityItemLabel>{item.label}</SecurityItemLabel>
            <SecurityItemBadge>SERVER ENFORCED</SecurityItemBadge>
          </SecurityItemHeader>
          <SecurityItemDesc>{item.desc}</SecurityItemDesc>
        </SecurityItem>
      ))}
    </SecurityGrid>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋  Template System Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const TemplateSystemSection = ({ tpl, onImgClick }) => (
  <Section>
    <SectionLabel>Template System</SectionLabel>
    {tpl.background && (
      <TplBackground>
        <TplBackgroundLabel>Background</TplBackgroundLabel>
        <TplBackgroundText>{tpl.background}</TplBackgroundText>
      </TplBackground>
    )}
    <TplDesc>{tpl.desc}</TplDesc>
    <TplScreenshotGrid>
      {tpl.screenshots.map((s, i) => (
        <TplScreenshotItem key={i}>
          <TplScreenshotScroll>
            <ImgClickWrap onClick={() => onImgClick(s.src, s.caption)}>
              <TplScreenshot src={s.src} alt={s.caption} />
            </ImgClickWrap>
          </TplScreenshotScroll>
          <TplScreenshotCaption>↑ {s.caption}</TplScreenshotCaption>
        </TplScreenshotItem>
      ))}
    </TplScreenshotGrid>
    <TplLayout>
      <div>
        <TplSubLabel>DB Schema — tblBoardAnswerTemplate</TplSubLabel>
        <SchemaTable>
          <SchemaHeader>
            <div>Column</div>
            <div>Type</div>
            <div>Description</div>
          </SchemaHeader>
          {tpl.schema.map((row) => (
            <SchemaRow key={row.column}>
              <SchemaCol>{row.column}</SchemaCol>
              <SchemaType>{row.type}</SchemaType>
              <SchemaDesc>{row.desc}</SchemaDesc>
            </SchemaRow>
          ))}
        </SchemaTable>
      </div>
      <div>
        <TplSubLabel>Key Points</TplSubLabel>
        <HighlightList>
          {tpl.highlights.map((h, i) => (
            <HighlightItem key={i}>
              <HighlightLabel>{h.label}</HighlightLabel>
              <HighlightDesc>{h.desc}</HighlightDesc>
            </HighlightItem>
          ))}
        </HighlightList>
      </div>
    </TplLayout>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔒  Board System Section  (에디터 + 레거시만)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const BoardSystemSection = ({ board, onImgClick }) => (
  <Section>
    <SectionLabel>Board System — Rich Editor</SectionLabel>
    {board.background && (
      <BoardBackground>
        <BoardBackgroundLabel>Background</BoardBackgroundLabel>
        <BoardBackgroundText>{board.background}</BoardBackgroundText>
      </BoardBackground>
    )}
    <BoardScreenshotRow>
      {board.screenshots.map((s, i) => (
        <BoardScreenshotItem key={i}>
          <BoardScreenshotScroll>
            <ImgClickWrap onClick={() => onImgClick(s.src, s.caption)}>
              <BoardScreenshot src={s.src} alt={s.caption} />
            </ImgClickWrap>
          </BoardScreenshotScroll>
          <BoardScreenshotCaption>↑ {s.caption}</BoardScreenshotCaption>
        </BoardScreenshotItem>
      ))}
    </BoardScreenshotRow>
    <BoardSubLabel>Rich Editor Implementation</BoardSubLabel>
    <BoardItemList>
      {board.editor.map((item, i) => (
        <BoardItem key={i} accent="rgba(0,242,96,0.3)">
          <BoardItemLabel>{item.label}</BoardItemLabel>
          <BoardItemDesc>{item.desc}</BoardItemDesc>
        </BoardItem>
      ))}
    </BoardItemList>
    {board.legacyIntegration && (
      <div style={{ marginTop: "2rem" }}>
        <BoardSubLabel
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          Legacy Integration <LegacyBadge>BACKWARD COMPAT</LegacyBadge>
        </BoardSubLabel>
        <LegacyBlock>{board.legacyIntegration}</LegacyBlock>
      </div>
    )}
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔄  KPCP Renewal Section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const KpcpRenewalSection = ({ renewal, onImgClick }) => (
  <Section>
    <SectionLabel>KPCP Renewal — Before / After</SectionLabel>
    <RenewalDesc>{renewal.desc}</RenewalDesc>
    <BeforeAfterGrid>
      {[
        {
          data: renewal.screenshots.before,
          isAfter: false,
          badge: "✕ Before — FOUC 발생",
        },
        {
          data: renewal.screenshots.after,
          isAfter: true,
          badge: "✓ After — 자연스러운 폰트 전환",
        },
      ].map(({ data, isAfter, badge }) => (
        <BeforeAfterItem key={data.src} isAfter={isAfter}>
          <BeforeAfterBadge isAfter={isAfter}>{badge}</BeforeAfterBadge>
          <BeforeAfterScroll>
            <ImgClickWrap onClick={() => onImgClick(data.src, data.caption)}>
              <BeforeAfterImg src={data.src} alt={data.caption} />
            </ImgClickWrap>
          </BeforeAfterScroll>
          <BeforeAfterCaption>↑ {data.caption}</BeforeAfterCaption>
        </BeforeAfterItem>
      ))}
    </BeforeAfterGrid>

    <RenewalSubLabel>주요 변경 사항</RenewalSubLabel>
    <ChangesGrid>
      <ChangeRow>
        <ChangeLabel
          style={{
            color: "rgba(0,242,96,0.5)",
            fontSize: "0.6rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          항목
        </ChangeLabel>
        <ChangeBefore
          style={{
            color: "rgba(255,100,100,0.5)",
            fontSize: "0.6rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Before
        </ChangeBefore>
        <ChangeAfter
          style={{
            color: "rgba(0,242,96,0.5)",
            fontSize: "0.6rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          After
        </ChangeAfter>
      </ChangeRow>
      {renewal.changes.map((c, i) => (
        <ChangeRow key={i}>
          <ChangeLabel>{c.label}</ChangeLabel>
          <ChangeBefore>{c.before}</ChangeBefore>
          <ChangeAfter>{c.after}</ChangeAfter>
        </ChangeRow>
      ))}
    </ChangesGrid>

    <RenewalSubLabel>측정 결과</RenewalSubLabel>
    <RenewalResultsGrid>
      {renewal.results.map((r, i) => (
        <RenewalResultCard key={i}>
          <RenewalResultLabel>{r.label}</RenewalResultLabel>
          <RenewalResultValue>{r.value}</RenewalResultValue>
          <RenewalResultDesc>{r.desc}</RenewalResultDesc>
        </RenewalResultCard>
      ))}
    </RenewalResultsGrid>

    <FoutBlock>
      <RenewalSubLabel>FOUC 문제 해결 — font-display: swap</RenewalSubLabel>
      <FoutProblem>{renewal.fout.problem}</FoutProblem>
      <FoutCodeGrid>
        <FoutCodeItem isAfter={false}>
          <FoutCodeHeader isAfter={false}>
            Before — font-display 없음
          </FoutCodeHeader>
          <FoutCodeBody
            dangerouslySetInnerHTML={{
              __html: highlightFoutCode(renewal.fout.codeBefore),
            }}
          />
        </FoutCodeItem>
        <FoutCodeItem isAfter={true}>
          <FoutCodeHeader isAfter={true}>
            After — font-display: swap 적용
          </FoutCodeHeader>
          <FoutCodeBody
            dangerouslySetInnerHTML={{
              __html: highlightFoutCode(renewal.fout.codeAfter),
            }}
          />
        </FoutCodeItem>
      </FoutCodeGrid>
      <CodeBlockWrap style={{ marginBottom: "1.5rem" }}>
        <CodeBlockHeader>
          <CodeBlockLang>
            HTML — 폰트 + 배너 이미지 preload (PC/MO 분기)
          </CodeBlockLang>
          <CodeBlockDots>
            <span />
            <span />
            <span />
          </CodeBlockDots>
        </CodeBlockHeader>
        <CodeBlockBody
          dangerouslySetInnerHTML={{
            __html: highlightFoutCode(renewal.fout.codePreload),
          }}
        />
      </CodeBlockWrap>
      <FoutSolution>{renewal.fout.solution}</FoutSolution>
    </FoutBlock>

    <AgeQueryBlock>
      <RenewalSubLabel>나이대 통계 쿼리 — license DB 연동</RenewalSubLabel>
      <AgeQueryDesc>{renewal.ageQuery.desc}</AgeQueryDesc>
      <AgeQueryPoints>
        {renewal.ageQuery.points.map((p, i) => (
          <AgeQueryPoint key={i}>
            <AgeQueryPointLabel>{p.label}</AgeQueryPointLabel>
            <AgeQueryPointDesc>{p.desc}</AgeQueryPointDesc>
          </AgeQueryPoint>
        ))}
      </AgeQueryPoints>
      <CodeBlockWrap>
        <CodeBlockHeader>
          <CodeBlockLang>SQL (CTE) — 자격증별 나이대 TOP 2 추출</CodeBlockLang>
          <CodeBlockDots>
            <span />
            <span />
            <span />
          </CodeBlockDots>
        </CodeBlockHeader>
        <CodeBlockBody
          dangerouslySetInnerHTML={{
            __html: highlightSQL(renewal.ageQuery.codeBlock),
          }}
        />
      </CodeBlockWrap>
      <CodeBlockWrap style={{ marginTop: "1rem" }}>
        <CodeBlockHeader>
          <CodeBlockLang>
            Classic ASP — 결과 가공 및 표시 문자열 조합
          </CodeBlockLang>
          <CodeBlockDots>
            <span />
            <span />
            <span />
          </CodeBlockDots>
        </CodeBlockHeader>
        <CodeBlockBody
          dangerouslySetInnerHTML={{
            __html: highlightSQL(renewal.ageQuery.result),
          }}
        />
      </CodeBlockWrap>
      <ResultPreview>
        <span className="label">Output Example</span>
        *본원 통계 결과 <span className="highlight">30대, 40대</span>에서 가장
        많이 취득한 자격증입니다
      </ResultPreview>
    </AgeQueryBlock>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectData.find((p) => p.id === Number(id));

  const [lightbox, setLightbox] = useState(null);
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

      {/* ① HERO */}
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
        {/* ★ 풀스택 타글라인 */}
        <HeroTagline>{project.tagline}</HeroTagline>
      </Hero>

      <Content>
        {/* ② PROBLEM & ENVIRONMENT */}
        <ProblemEnvSection
          data={project.problems_env}
          role={project.role}
          environment={project.environment}
          scale={project.scale}
        />

        {/* ③ DATA ARCHITECTURE */}
        {project.architecture && (
          <ArchitectureSection
            arch={project.architecture}
            onImgClick={openLightbox}
          />
        )}

        {/* ④ QUERY ENGINEERING  ← 독립 섹션 승격 */}
        {project.queryEngineering && (
          <QueryEngineeringSection qe={project.queryEngineering} />
        )}

        {/* ⑤ SECURITY & ACCESS CONTROL  ← 독립 섹션 승격 */}
        {project.securitySystem && (
          <SecuritySection sec={project.securitySystem} />
        )}

        {/* ⑥ PERFORMANCE METRICS  ← 수치는 여기 한 번만 */}
        <Section>
          <SectionLabel>Performance Results</SectionLabel>
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

        {/* ⑦ CORE FEATURES — 기능 구현 */}
        <Section>
          <SectionLabel>Core Features</SectionLabel>
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

        {/* ⑧ BOARD SYSTEM — 에디터 + 레거시 (Security/Query 분리 후) */}
        {project.boardSystem && (
          <BoardSystemSection
            board={project.boardSystem}
            onImgClick={openLightbox}
          />
        )}

        {/* ⑨ TEMPLATE SYSTEM */}
        {project.templateSystem && (
          <TemplateSystemSection
            tpl={project.templateSystem}
            onImgClick={openLightbox}
          />
        )}

        {/* ⑩ KPCP RENEWAL — 프론트 섹션은 뒤로 */}
        {project.kpcpRenewal && (
          <KpcpRenewalSection
            renewal={project.kpcpRenewal}
            onImgClick={openLightbox}
          />
        )}

        {/* ⑪ PROBLEM SOLVING */}
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

        {/* ⑫ TECH STACK — DB → 서버 → 프론트 순 */}
        <Section>
          <SectionLabel>Tech Stack</SectionLabel>
          <StackGrid>
            {project.stack.map((s) => (
              <StackItem key={s}>{s}</StackItem>
            ))}
          </StackGrid>
        </Section>

        {/* ⑬ TIMELINE */}
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
