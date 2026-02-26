import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦  PROJECT DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const projectData = [
  {
    id: 1,
    title: "한국교육평가원",
    period: "2024.12 — 2026.02",
    tag: "PRODUCTION",
    tagline:
      "레거시 ASP·MSSQL 환경에서 분산된 데이터 구조를 통합, 서비스의 성능을 개선해온 풀스택 개발자",
    subtitle:
      "4개 교육원 실서비스 운영 · 레거시 환경에서의 성능 최적화 및 UX 개선 · 관리자 시스템 설계 및 구현",
    problems_env: {
      intro:
        "KPCP, KPEI, LEI, ILI 4개 교육원의 실서비스를 Classic ASP 기반 레거시 환경에서 운영했습니다. 쿼리 병목 분석, DB 설계, 보안 강화, SEO 개선까지 전반을 직접 설계하고 실서버에 반영했습니다.",
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
          desc: "구/신 게시판 이원화 + COUNT 별도 쿼리 — 목록 로딩 7~8초, 검색 15초 이상",
          icon: "🐢",
        },
        {
          label: "FOUC · SEO 미흡",
          desc: "font-display 미적용 · JS 기반 레이아웃 분기 → FOUC, LCP 저하, SEO 미흡",
          icon: "📉",
        },
      ],
    },
    role: "프론트엔드 개발 · DB 설계 · 성능 최적화",
    environment: "Classic ASP · MSSQL · 실서버 운영",
    scale: "4개 교육원 · 160개 과정 · 실사용자 대상",
    metrics: [
      {
        before: "1:1 게시판 리스트 조회",
        arrow: "7~8s → 1~2s",
        value: "5배",
        desc: "CTE 통합 쿼리 + 복합 인덱스 적용으로 전체 성능 5배 향상",
      },
      {
        before: "자격증 상세 SEO 점수",
        arrow: "기존 대비 +20% 이상",
        value: "100점",
        desc: "Lighthouse SEO 100점 달성 · 시맨틱 태그 구조 개선",
      },
      {
        before: "자격증 상세 LCP",
        arrow: "40% → 61%",
        value: "+21%p",
        desc: "JS resize 로직을 CSS로 전환 · 성능 50% 개선",
      },
    ],
    architecture: {
      screenshot: "/media/course-detail.jpg",
      screenshotCaption: "과정 상세 페이지 — 4개 DB 데이터를 단일 뷰로 통합",
      desc: "4개 DB에 분산된 데이터를 Cross DB JOIN으로 통합하고, 문자열 정규화(REPLACE)로 키 불일치를 해결했습니다.",
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
    queryEngineering: {
      title: "Query Engineering — 7~8s → 1~2s",
      background:
        "관리자 1:1 게시판 목록은 구/신 게시판을 별도 조회하고 COUNT 쿼리를 따로 실행하는 구조였습니다. 목록 로딩 7~8초, 검색 15초 이상이 반복되어 전면 재설계가 필요했습니다.",
      before: "구/신 게시판 별도 조회 + COUNT 쿼리 분리 — 7~8초",
      after: "CTE UNION ALL + ROW_NUMBER + COUNT(*) OVER() 단일 쿼리 — 1~2초",
      techniques: [
        {
          label: "CTE + UNION ALL",
          desc: "구 게시판(GtblQaABoard)과 신 게시판(tblSukangReading)을 WITH 절 안에서 통합. 2번의 쿼리를 단일 실행으로 압축.",
        },
        {
          label: "VARCHAR DateTime 파싱",
          desc: 'brd_writeday가 VARCHAR("2025-12-12 오후 8:50:20" 형식)로 저장되어 있어 UNION ALL 후 ORDER BY 불가. CASE WHEN + CHARINDEX + SUBSTRING으로 오전/오후 파싱 후 24시간 포맷으로 통일.',
        },
        {
          label: "ROW_NUMBER() 페이징",
          desc: "ROW_NUMBER() OVER(ORDER BY parsed_date DESC)로 오프셋 기반 페이징. OFFSET-FETCH 없이 레거시 환경에서도 동작.",
        },
        {
          label: "COUNT(*) OVER() 인라인 집계",
          desc: "전체 건수 조회를 위한 별도 COUNT 쿼리 제거. COUNT(*) OVER()를 SELECT 안에 포함해 단일 쿼리로 총 건수와 데이터를 동시 반환.",
        },
        {
          label: "NOLOCK + 복합 인덱스",
          desc: "읽기 전용 목록에 WITH(NOLOCK) 적용. brd_userId + brd_writeday, brd_isDeleted + brd_writeday 복합 인덱스 2개 추가로 필터링 성능 최적화.",
        },
      ],
      result: "리스트 조회 7~8초 → 1~2초 · 검색 15초 이상 → 3초대",
      codeBlock: `WITH BoardCTE AS (
  -- 구 게시판
  SELECT
    brd_idx, brd_userId, brd_title, brd_content,
    brd_isDeleted,
    CONVERT(varchar(23), brd_writeday, 120) AS parsed_date,
    'legacy' AS board_type
  FROM GtblQaABoard WITH(NOLOCK)
  WHERE brd_isDeleted = 0

  UNION ALL

  -- 신 게시판 (VARCHAR datetime 파싱)
  SELECT
    brd_idx, brd_userId, brd_title, brd_content,
    brd_isDeleted,
    CASE
      WHEN CHARINDEX('오후', brd_writeday) > 0
        AND CONVERT(int, SUBSTRING(brd_writeday,12,2)) < 12
        THEN SUBSTRING(brd_writeday,1,11)
          + RIGHT('0'+CONVERT(varchar,CONVERT(int,SUBSTRING(brd_writeday,12,2))+12),2)
          + SUBSTRING(brd_writeday,14,9)
      WHEN CHARINDEX('오전', brd_writeday) > 0
        AND CONVERT(int, SUBSTRING(brd_writeday,12,2)) = 12
        THEN REPLACE(brd_writeday,'오전 12','00')
      ELSE REPLACE(REPLACE(brd_writeday,'오전 ',''),'오후 ','')
    END AS parsed_date,
    'new' AS board_type
  FROM tblSukangReading WITH(NOLOCK)
  WHERE brd_isDeleted = 0
),
Paged AS (
  SELECT *,
    ROW_NUMBER() OVER (ORDER BY parsed_date DESC) AS rn,
    COUNT(*) OVER ()                               AS total_cnt
  FROM BoardCTE
)
SELECT * FROM Paged
WHERE rn BETWEEN :offset AND :offset + :page_size - 1
ORDER BY rn`,
    },
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
          desc: "brd_isDeleted = -1 플래그와 brd_deletedAt 타임스탬프로 논리 삭제. 물리 삭제 없이 데이터 보존 및 감사 추적 가능.",
          accent: "rgba(0, 242, 96, 0.3)",
        },
      ],
    },
    popupSystem: {
      background:
        "신규 과정 개설 시 팝업을 HTML 구조에 직접 하드코딩해야 하는 비효율적인 구조를 개선하기 위해, DB 기반 운영형 팝업 관리 시스템을 설계·구현했습니다. 정적 마크업 수정 없이 관리자가 실시간으로 팝업을 등록·수정·활성화할 수 있도록 전환하고, 노출 기간·클릭 로그까지 통합 관리 가능한 캠페인 운영 도구로 확장했습니다.",
      archCards: [
        {
          badge: "01 · LIST",
          title: "팝업 목록 (popup.asp)",
          desc: "검색·페이징·AJAX 상태 토글·이미지 미리보기가 통합된 관리자 대시보드. 실시간 활성/비활성 전환.",
          accent: "rgba(0,242,96,0.6)",
        },
        {
          badge: "02 · REGISTER",
          title: "팝업 등록 (popup_write.asp)",
          desc: "PC/모바일 이미지 분리 업로드, 노출 기간 설정, 활성화 토글. 서버·클라이언트 이중 유효성 검사.",
          accent: "rgba(100,160,255,0.6)",
        },
        {
          badge: "03 · EDIT",
          title: "팝업 수정 (popup_edit.asp)",
          desc: "기존 데이터 바인딩, 이미지 미선택 시 기존 파일 유지(existing_image 패턴), datetime-local 포맷 변환.",
          accent: "rgba(255,160,60,0.6)",
        },
      ],
      flowSteps: [
        { label: "Admin 등록", text: "popup_write.asp" },
        { label: "파일 처리", text: "DEXT FileUpload" },
        { label: "DB 저장", text: "tblPopup3" },
        { label: "사용자 노출", text: "나의강의실 연동" },
        { label: "클릭 발생", text: "tblPopupLog" },
        { label: "통계 집계", text: "pop_click_count" },
      ],
      features: [
        {
          icon: "⚡",
          label: "AJAX 상태 토글",
          desc: "XHR + popup_toggle.asp로 페이지 새로고침 없이 활성/비활성 즉시 반영. JSON 응답 파싱 후 DOM 클래스만 교체.",
          accent: "rgba(0,242,96,0.3)",
        },
        {
          icon: "🖼️",
          label: "PC / 모바일 이미지 분리",
          desc: "PC·Mobile 이미지를 각각 업로드. 수정 시 existing_image_pc/mobile를 hidden input으로 전달해 미선택 시 자동 유지.",
          accent: "rgba(100,160,255,0.3)",
        },
        {
          icon: "📅",
          label: "기간 기반 노출 쿼리",
          desc: "pop_start_date ≤ GETDATE() ≤ pop_end_date 조건으로 자동 노출·만료. 관리자 등록만으로 지정 시간에 자동 활성화.",
          accent: "rgba(255,160,60,0.3)",
        },
        {
          icon: "📊",
          label: "클릭 로그 분리 설계",
          desc: "pop_click_count는 캐시 컬럼. 실 클릭은 tblPopupLog에 별도 적재해 기간별 집계·A/B 테스트 확장 가능한 구조.",
          accent: "rgba(255,80,80,0.3)",
        },
        {
          icon: "🔍",
          label: "이미지 호버 미리보기",
          desc: "목록 썸네일 호버 시 원본을 툴팁으로 확대 표시. 뷰포트 경계를 계산해 오른쪽·왼쪽·위쪽 자동 배치.",
          accent: "rgba(0,242,96,0.25)",
        },
        {
          icon: "📁",
          label: "타임스탬프 파일명",
          desc: "YYYYMMDDHHMMSS 타임스탬프를 파일명에 붙여 충돌 방지. 모바일 이미지는 _m 접미사로 구분.",
          accent: "rgba(100,160,255,0.25)",
        },
      ],
      tables: {
        main: {
          name: "tblPopup3",
          role: "팝업 마스터",
          rows: [
            ["pop_idx", "int", "PK / AUTO"],
            ["pop_title", "nvarchar", "팝업 제목"],
            ["pop_image_pc", "nvarchar", "PC 이미지 경로"],
            ["pop_image_mobile", "nvarchar", "모바일 이미지 경로"],
            ["pop_is_active", "bit", "-1: 활성 / 0: 비활성"],
            ["pop_start_date", "datetime", "노출 시작"],
            ["pop_end_date", "datetime", "노출 종료"],
            ["pop_click_count", "int", "캐시 클릭수"],
            ["pop_created_at", "datetime", "등록일 GETDATE()"],
            ["pop_updated_at", "datetime", "수정일 GETDATE()"],
          ],
        },
        log: {
          name: "tblPopupLog",
          role: "클릭 로그 (분리 설계)",
          rows: [
            ["log_idx", "int", "PK / AUTO"],
            ["pop_idx", "int", "FK → tblPopup3"],
            ["user_id", "nvarchar", "수강생 ID"],
            ["click_date", "datetime", "클릭 시각"],
          ],
        },
      },
      queryDesc:
        "사용자 페이지에서는 pop_is_active가 활성이고 현재 시각이 노출 기간 안에 있는 팝업만 TOP 1로 조회합니다. ORDER BY pop_start_date DESC로 가장 최근 등록된 이벤트를 우선 노출.",
      queryCode: `SELECT TOP 1 *
FROM tblPopup3
WHERE (pop_is_active = 1 OR pop_is_active = -1)
  AND pop_start_date <= GETDATE()
  AND pop_end_date   >= GETDATE()
ORDER BY pop_start_date DESC,
         pop_created_at  DESC`,
      screenshots: {
        register: {
          src: "/media/popup-register.jpg",
          caption: "팝업 등록 — PC/모바일 이미지 분리 업로드 + 노출 기간 설정",
        },
        edit: {
          src: "/media/popup-edit.jpg",
          caption: "팝업 수정 — 기존 이미지 미리보기 + 선택적 교체 패턴",
        },
      },
    },
    templateSystem: {
      background:
        "담당자들이 1:1 게시판 답변 시 동일한 내용을 매번 직접 입력하는 비효율이 반복됐습니다. 배송일 안내, 환불 정책 등 유형이 정해진 답변임에도 별도 시스템이 없어 담당자마다 내용이 달라지는 문제도 있었습니다.",
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
          desc: "ASP에서 license DB의 tb_sendDay를 조회해 배송일을 계산하고 JS 변수로 전달. 고정 템플릿 내 [배송일1]·[배송일2]·[배송일3] 플레이스홀더를 실제 날짜로 자동 치환.",
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
    kpcpRenewal: {
      desc: "기존 레거시 자격증 상세페이지를 시맨틱 HTML5 구조로 전면 리뉴얼했습니다. FOUC·FOUT 문제 해결, 반응형 레이아웃 재설계, license DB 통계 쿼리 연동을 통한 개인화 콘텐츠 추가까지 함께 진행했습니다.",
      screenshots: {
        before: {
          src: "/media/kpcp-before.gif",
          caption: "리뉴얼 전 — 리소스 로딩 전 콘텐츠 노출, FOUC 발생",
        },
        after: {
          src: "/media/kpcp-after.gif",
          caption: "리뉴얼 후 — preload 적용, 자연스러운 렌더링",
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
          before: "배너·리소스 preload 없음 → 스타일 없는 콘텐츠 순간 노출",
          after:
            "배너 이미지 preload (PC/MO 분기) → 로딩 완료 후 자연스러운 렌더링",
        },
        {
          label: "FOUT",
          before:
            "@font-face font-display 미적용 → 폰트 로딩 차단 또는 교체 시 텍스트 깜빡임",
          after:
            "font-display: swap → fallback 폰트 즉시 렌더링, 로딩 완료 시 자연스럽게 교체",
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
        foucProblem:
          "배너 이미지 및 주요 리소스에 preload가 없어, 페이지 초기 렌더링 시 스타일이 적용되지 않은 콘텐츠가 순간적으로 노출되는 FOUC(Flash of Unstyled Content)가 발생했습니다. Before/After GIF에서 확인할 수 있는 깜빡임이 이 문제입니다.",
        foucSolution:
          "배너 이미지에 PC/MO 분기 preload link를 추가하여, 브라우저가 렌더링 전에 핵심 리소스를 미리 다운로드하도록 우선순위를 지정했습니다.",
        foutProblem:
          "@font-face 선언에 font-display 속성이 없어, 커스텀 폰트(Cafe24Ohsquare) 로딩이 완료될 때까지 텍스트가 보이지 않거나, 폰트 교체 시 텍스트가 다시 그려지는 FOUT(Flash of Unstyled Text)도 함께 발생하고 있었습니다.",
        foutSolution:
          "font-display: swap 적용으로 폰트 로딩 중 fallback 폰트를 즉시 노출하고, 로딩 완료 시 자연스럽게 교체되도록 처리했습니다. 추가로 woff2 포맷 preload link를 추가하여 폰트 파일 다운로드 우선순위를 끌어올렸습니다.",
        codeBefore: `@font-face {
  font-family: 'Cafe24Ohsquare';
  src: url('/application/new_list/Cafe24Ohsquare.woff2') format('woff2'),
       url('/application/new_list/Cafe24Ohsquare.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  /* font-display 없음 → FOUT 발생 */
}`,
        codeAfter: `@font-face {
  font-family: 'Cafe24Ohsquare';
  src: url('/application/new_list/Cafe24Ohsquare.woff2') format('woff2'),
       url('/application/new_list/Cafe24Ohsquare.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  font-display: swap; /* ← 추가: 폰트 로딩 중 fallback 폰트 즉시 노출 */
}`,
        codePreload: `<!-- 폰트 preload — woff2 우선 다운로드 (FOUT 완화) -->
<link rel="preload" as="font" type="font/woff2"
  href="/application/new_list/Cafe24Ohsquare.woff2"
  crossorigin>

<!-- ★ 배너 이미지 preload — PC/MO 분기 (FOUC 해결) -->
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
            desc: "loi_birth(VARCHAR, YYYYMMDD)에서 LEFT(loi_birth, 4)로 출생연도 추출 → 현재연도 - 출생연도로 나이 계산 → CASE WHEN으로 10대~90대 그룹핑.",
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
        aspResult: `' ASP — 두 행 순회 후 표시 문자열 조합
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
    stackGroups: [
      {
        category: "Database",
        items: [
          "MSSQL",
          "CTE · UNION ALL",
          "ROW_NUMBER() 페이징",
          "Cross DB JOIN",
          "복합 인덱스",
          "Query Tuning",
          "소프트 딜리트",
        ],
      },
      {
        category: "Server",
        items: [
          "Classic ASP",
          "ADODB.Command",
          "파라미터화 쿼리",
          "Session 인증",
          "adminLevel 권한",
          "SQL Injection 방어",
        ],
      },
      {
        category: "Frontend",
        items: [
          "JavaScript (ES6+)",
          "HTML5 · CSS3",
          "contentEditable API",
          "XHR 비동기 업로드",
          "Clipboard API",
          "Swiper.js",
          "반응형 웹",
        ],
      },
      {
        category: "Performance & SEO",
        items: [
          "Core Web Vitals",
          "font-display: swap",
          "woff2 preload",
          "LCP 최적화",
          "Lighthouse SEO 100",
          "시맨틱 HTML5",
        ],
      },
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

const NAV_ITEMS = [
  { id: "metrics", label: "Performance" },
  { id: "overview", label: "Overview" },
  { id: "popup", label: "Popup System" },
  { id: "query", label: "Query Engineering" },
  { id: "architecture", label: "Architecture" },
  { id: "security", label: "Security" },
  { id: "board", label: "Board System" },
  { id: "template", label: "Template System" },
  { id: "kpcp", label: "KPCP Renewal" },
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
   🔧  DESIGN SYSTEM — SHARED PRIMITIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* --- Layout --- */

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
  padding: 0 4rem 8rem;
  @media (max-width: 768px) {
    padding: 0 1.5rem 5rem;
  }
`;

const Section = styled.section`
  margin-bottom: 7rem;
  scroll-margin-top: 80px;
`;

/** 2열 그리드. cols/gap/bp props로 커스텀 가능 */
const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => cols || "1fr 1fr"};
  gap: ${({ gap }) => gap || "1rem"};
  @media (max-width: ${({ bp }) => bp || "900px"}) {
    grid-template-columns: 1fr;
  }
`;

/* --- Typography --- */

/**
 * 섹션 레이블. variant: 'green'(기본) | 'orange' | 'red'
 * withLine prop: 우측에 수평선 추가
 */
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
`;

/* --- Cards & Borders --- */

/**
 * 좌측 보더 배너. variant: 'green'(기본) | 'red' | 'orange'
 */
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

/**
 * 좌측 보더 카드. accent prop으로 컬러 지정
 */
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

/* --- Screenshot Pattern --- */

/** 클릭 가능한 이미지 래퍼 — 줌 커서 + ⤢ 아이콘 */
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

/** 스크린샷을 담는 외곽 박스. highlight prop: 초록 테두리 */
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

/** 스크롤 가능한 이미지 영역 */
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

/* --- DB Table --- */

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

/* --- Misc Shared --- */

/** 필드 태그 (Architecture diagram) */
const FieldTag = styled.span`
  font-size: 0.6rem;
  padding: 0.15rem 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
  font-family: ${C.mono};
`;

/** 섹션 위치 표시 태그 */
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

/** JOIN 뱃지 */
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

/** SERVER ENFORCED 뱃지 */
const ServerBadge = styled.span`
  font-size: 0.55rem;
  padding: 0.15rem 0.5rem;
  background: rgba(255, 80, 80, 0.08);
  border: 1px solid rgba(255, 80, 80, 0.2);
  color: rgba(255, 120, 120, 0.7);
  border-radius: 2px;
  letter-spacing: 1px;
  font-family: ${C.mono};
`;

/** BACKWARD COMPAT 뱃지 */
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

/** 결과 표시 칩 (✓ 접두어 포함) */
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

/** 플로우 스텝 구분선 화살표 */
const FlowArrow = styled.div`
  font-size: 0.85rem;
  color: ${C.greenFaint};
  flex-shrink: 0;
`;

/** 플로우 스텝 항목 */
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

const highlightFontCode = (code) =>
  code
    .replace(/(\/\*.*?\*\/|--[^\n]*)/gs, `<span class="cm">$1</span>`)
    .replace(/(font-display:\s*swap)/g, `<span class="hi">$1</span>`)
    .replace(/(\/\* font-display 없음.*?\*\/)/g, `<span class="bad">$1</span>`)
    .replace(
      /(\/\* font-display 미적용.*?\*\/)/g,
      `<span class="bad">$1</span>`,
    )
    .replace(/(FOUC|FOUT)/g, `<span class="hi">$1</span>`);

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
  font-size: 3.5rem;
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

const MetricsSection = ({ metrics }) => (
  <Section id="metrics" style={{ marginTop: "6rem" }}>
    <SubLabel withLine mb="2.5rem">
      Performance Results
    </SubLabel>
    <MetricsGrid>
      {metrics.map((m, i) => (
        <MetricCard key={i}>
          <MetricBefore>{m.before}</MetricBefore>
          <MetricArrow>{m.arrow}</MetricArrow>
          <MetricValue>{m.value}</MetricValue>
          <MetricDesc>{m.desc}</MetricDesc>
        </MetricCard>
      ))}
    </MetricsGrid>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📐  SECTION — OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const OverviewMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
  justify-content: space-between;
`;

const OverviewMetaItem = styled.div`
  border-left: 2px solid ${C.green};
  padding-left: 1.2rem;
`;

const OverviewMetaItemLabel = styled.div`
  font-size: 0.65rem;
  color: ${C.green};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
`;

const OverviewMetaItemValue = styled.div`
  font-size: 0.9rem;
  color: ${C.text};
`;

const IssueGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
`;

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
`;

const OverviewSection = ({ data, role, environment, scale }) => (
  <Section id="overview" style={{ marginTop: "6rem" }}>
    <SubLabel withLine mb="2.5rem">
      Overview
    </SubLabel>
    <ProseText m="0 0 2.5rem">{data.intro}</ProseText>
    <OverviewMeta>
      {[
        ["Role", role],
        ["Environment", environment],
        ["Scale", scale],
      ].map(([label, value]) => (
        <OverviewMetaItem key={label}>
          <OverviewMetaItemLabel>{label}</OverviewMetaItemLabel>
          <OverviewMetaItemValue>{value}</OverviewMetaItemValue>
        </OverviewMetaItem>
      ))}
    </OverviewMeta>
    <IssueGrid>
      {data.issues.map((issue, i) => (
        <IssueBanner key={i} variant="red">
          <IssueIcon>{issue.icon}</IssueIcon>
          <div>
            <IssueLabel>{issue.label}</IssueLabel>
            <IssueDesc>{issue.desc}</IssueDesc>
          </div>
        </IssueBanner>
      ))}
    </IssueGrid>
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
    <SubLabel withLine mb="2.5rem">
      Data Architecture
    </SubLabel>
    <ProseText m="0 0 2rem">{arch.desc}</ProseText>
    <TwoColGrid
      gap="2rem"
      style={{ marginBottom: "2rem", alignItems: "start" }}
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
   ⚡  SECTION — QUERY ENGINEERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const QEBeforeAfter = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1.2rem 1.8rem;
  background: #0a0a0a;
  border: 1px solid ${C.border};
  border-radius: 4px;
  margin-bottom: 2rem;
`;

const QEBeforeText = styled.div`
  font-size: 0.82rem;
  color: rgba(255, 100, 100, 0.8);
  font-family: ${C.mono};
  text-align: center;
`;

const QEArrow = styled.div`
  font-size: 1.4rem;
  color: ${C.greenFaint};
  text-align: center;
`;

const QEAfterText = styled.div`
  font-size: 0.82rem;
  color: rgba(0, 242, 96, 0.8);
  font-family: ${C.mono};
  text-align: center;
`;

const TechCardTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
`;

const TechCardDesc = styled.div`
  font-size: 0.77rem;
  color: ${C.textDim};
  line-height: 1.7;
`;

const QueryEngineeringSection = ({ qe }) => (
  <Section id="query">
    <SubLabel withLine mb="2.5rem">
      Query Engineering
    </SubLabel>
    <SideBanner style={{ marginBottom: "2rem" }}>
      <SubLabel mb="0.6rem">Background</SubLabel>
      <ProseText size="0.88rem">{qe.background}</ProseText>
    </SideBanner>

    <QEBeforeAfter>
      <QEBeforeText>{qe.before}</QEBeforeText>
      <QEArrow>→</QEArrow>
      <QEAfterText>{qe.after}</QEAfterText>
    </QEBeforeAfter>

    <TwoColGrid style={{ marginBottom: "2rem" }}>
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
   🔒  SECTION — SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SecurityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 2rem;
`;

const SecurityCard = styled(BorderCard)`
  border-left-width: 3px;
`;

const SecurityCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
`;

const SecurityCardTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
`;

const SecurityCardDesc = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.42);
  line-height: 1.75;
`;

const SecuritySection = ({ sec }) => (
  <Section id="security">
    <SubLabel withLine mb="2.5rem">
      Security & Access Control
    </SubLabel>
    <ProseText m="0 0 2.5rem">{sec.intro}</ProseText>
    <SecurityList>
      {sec.items.map((item, i) => (
        <SecurityCard key={i} accent={item.accent} p="1.4rem 1.8rem">
          <SecurityCardHeader>
            <SecurityCardTitle>{item.label}</SecurityCardTitle>
            <ServerBadge>SERVER ENFORCED</ServerBadge>
          </SecurityCardHeader>
          <SecurityCardDesc>{item.desc}</SecurityCardDesc>
        </SecurityCard>
      ))}
    </SecurityList>
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
  margin-bottom: 2.5rem;
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
  margin-bottom: 2.5rem;
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
`;

const FeatureCardInner = styled.div``;

const DBLogNote = styled.div`
  padding: 0.8rem 1rem;
  border-top: 1px solid rgba(0, 242, 96, 0.08);
  font-size: 0.68rem;
  color: rgba(0, 242, 96, 0.55);
  line-height: 1.65;
`;

const PopupManagementSection = ({ data, onImgClick }) => (
  <Section id="popup">
    <SubLabel withLine mb="2.5rem">
      Time-based Campaign Popup System
    </SubLabel>

    <IssueBanner variant="red" style={{ marginBottom: "2.5rem" }}>
      <IssueIcon>📢</IssueIcon>
      <div>
        <IssueLabel>신규 과정 홍보 = 수동 공지 의존</IssueLabel>
        <IssueDesc>
          과정 개설 시 담당자가 직접 공지사항을 작성하거나 팝업을 매번
          하드코딩으로 수정하는 구조. 노출 기간 제어·클릭 통계 집계가
          불가능했습니다.
        </IssueDesc>
      </div>
    </IssueBanner>

    <ProseText m="0 0 2.5rem">{data.background}</ProseText>

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
    <TwoColGrid style={{ marginBottom: "2.5rem" }}>
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
    <TwoColGrid style={{ marginBottom: "2.5rem" }}>
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
    <TwoColGrid style={{ marginBottom: "2rem" }}>
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
   📋  SECTION — BOARD SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const EditorCardTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.35rem;
`;

const EditorCardDesc = styled.div`
  font-size: 0.78rem;
  color: ${C.textDim};
  line-height: 1.7;
`;

const LegacyBanner = styled(BorderCard)`
  border-left-width: 3px;
  font-size: 0.85rem;
  color: ${C.textDim};
  line-height: 1.85;
`;

const LegacyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BoardSystemSection = ({ board, onImgClick }) => (
  <Section id="board">
    <SubLabel withLine mb="2.5rem">
      Board System — Rich Editor
    </SubLabel>
    <SideBanner style={{ marginBottom: "2.5rem" }}>
      <SubLabel mb="0.6rem">Background</SubLabel>
      <ProseText size="0.88rem">{board.background}</ProseText>
    </SideBanner>

    <TwoColGrid style={{ marginBottom: "3rem" }}>
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

    {board.legacyIntegration && (
      <div style={{ marginTop: "2rem" }}>
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
`;

const TemplateSystemSection = ({ tpl, onImgClick }) => (
  <Section id="template">
    <SubLabel withLine mb="2.5rem">
      Template System
    </SubLabel>
    <IssueBanner variant="red" style={{ marginBottom: "2.5rem" }}>
      <IssueIcon>🔄</IssueIcon>
      <div>
        <IssueLabel>반복 업무 비효율</IssueLabel>
        <IssueDesc>{tpl.background}</IssueDesc>
      </div>
    </IssueBanner>
    <ProseText m="0 0 3rem">{tpl.desc}</ProseText>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "1rem",
        marginBottom: "3rem",
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
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔄  SECTION — KPCP RENEWAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const RenewalResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: ${C.border};
  border: 1px solid ${C.border};
  margin-bottom: 3rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RenewalResultCard = styled.div`
  background: ${C.bgCard};
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
    background: ${C.green};
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
  color: ${C.textFaint};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const RenewalResultValue = styled.div`
  font-size: 2.8rem;
  font-weight: 900;
  color: ${C.green};
  line-height: 1;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(0, 242, 96, 0.3);
`;

const RenewalResultDesc = styled.div`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.5;
`;

const ChangesGrid = styled.div`
  border: 1px solid ${C.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 3rem;
`;

const ChangeRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  background: ${C.bgCard};
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChangeCellBase = styled.div`
  padding: 1rem 1.2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  &:last-child {
    border-right: none;
  }
  display: flex;
  align-items: center;
`;

const ChangeHeaderCell = styled(ChangeCellBase)`
  font-size: 0.6rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ color }) => color};
`;

const ChangeLabelCell = styled(ChangeCellBase)`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.text};
`;

const ChangeBeforeCell = styled(ChangeCellBase)`
  font-size: 0.75rem;
  color: rgba(255, 100, 100, 0.7);
  line-height: 1.6;
  align-items: flex-start;
`;

const ChangeAfterCell = styled(ChangeCellBase)`
  font-size: 0.75rem;
  color: rgba(0, 242, 96, 0.8);
  line-height: 1.6;
  align-items: flex-start;
  border-right: none;
`;

const FoutCodeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.2rem;
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
  background: ${C.bgDeep};
`;

const FoutCodeHeader = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.6rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  font-family: ${C.mono};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: ${({ isAfter }) =>
    isAfter ? "rgba(0,242,96,0.6)" : "rgba(255,100,100,0.6)"};
  background: rgba(255, 255, 255, 0.02);
`;

const ScreenshotBadgeBar = styled.div`
  padding: 0.55rem 1rem;
  font-size: 0.62rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: ${C.mono};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: ${({ isAfter }) =>
    isAfter ? "rgba(0,242,96,0.7)" : "rgba(255,100,100,0.7)"};
  background: ${({ isAfter }) =>
    isAfter ? "rgba(0,242,96,0.04)" : "rgba(255,100,100,0.04)"};
`;

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

const FoutVariantBanner = styled(SideBanner)`
  margin-bottom: 1.2rem;
  background: ${({ variant }) =>
    variant === "fouc" ? "rgba(255,150,50,0.04)" : C.greenBg};
  border: 1px solid
    ${({ variant }) =>
      variant === "fouc" ? "rgba(255,150,50,0.15)" : C.greenBorder};
`;

const FoutVariantType = styled.div`
  font-size: 0.62rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: ${C.mono};
  margin-bottom: 0.4rem;
  color: ${({ variant }) =>
    variant === "fouc" ? "rgba(255,160,60,0.75)" : "rgba(255,120,120,0.7)"};
`;

const FoutVariantTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
`;

const FoutSolution = styled.div`
  font-size: 0.78rem;
  color: ${({ variant }) =>
    variant === "fouc" ? "rgba(255,200,100,0.8)" : "rgba(0,242,96,0.75)"};
  line-height: 1.7;
`;

const KpcpRenewalSection = ({ renewal, onImgClick }) => (
  <Section id="kpcp">
    <SubLabel withLine mb="2.5rem">
      KPCP Renewal — Before / After
    </SubLabel>
    <ProseText m="0 0 2.5rem">{renewal.desc}</ProseText>

    <SubLabel>FOUC — Flash of Unstyled Content</SubLabel>
    <TwoColGrid style={{ marginBottom: "3rem" }}>
      {[
        {
          shot: renewal.screenshots.before,
          isAfter: false,
          badge: "✕ Before — FOUC 발생",
        },
        {
          shot: renewal.screenshots.after,
          isAfter: true,
          badge: "✓ After — 자연스러운 렌더링",
        },
      ].map(({ shot, isAfter, badge }) => (
        <ScreenshotBox key={shot.src} highlight={isAfter}>
          <ScreenshotBadgeBar isAfter={isAfter}>{badge}</ScreenshotBadgeBar>
          <ScrollBox h="300px">
            <ImgClickWrap onClick={() => onImgClick(shot.src, shot.caption)}>
              <ScreenshotImg
                src={shot.src}
                alt={shot.caption}
                style={{ opacity: 0.85 }}
              />
            </ImgClickWrap>
          </ScrollBox>
          <ScreenshotCaption>↑ {shot.caption}</ScreenshotCaption>
        </ScreenshotBox>
      ))}
    </TwoColGrid>

    <SubLabel>측정 결과</SubLabel>
    <RenewalResultsGrid>
      {renewal.results.map((r, i) => (
        <RenewalResultCard key={i}>
          <RenewalResultLabel>{r.label}</RenewalResultLabel>
          <RenewalResultValue>{r.value}</RenewalResultValue>
          <RenewalResultDesc>{r.desc}</RenewalResultDesc>
        </RenewalResultCard>
      ))}
    </RenewalResultsGrid>

    <SubLabel>주요 변경 사항</SubLabel>
    <ChangesGrid>
      <ChangeRow>
        <ChangeHeaderCell color="rgba(0,242,96,0.5)">항목</ChangeHeaderCell>
        <ChangeHeaderCell color="rgba(255,100,100,0.5)">
          Before
        </ChangeHeaderCell>
        <ChangeHeaderCell
          color="rgba(0,242,96,0.5)"
          style={{ borderRight: "none" }}
        >
          After
        </ChangeHeaderCell>
      </ChangeRow>
      {renewal.changes.map((c, i) => (
        <ChangeRow key={i}>
          <ChangeLabelCell>{c.label}</ChangeLabelCell>
          <ChangeBeforeCell>{c.before}</ChangeBeforeCell>
          <ChangeAfterCell>{c.after}</ChangeAfterCell>
        </ChangeRow>
      ))}
    </ChangesGrid>

    <SubLabel>FOUC · FOUT 문제 해결</SubLabel>
    {[
      {
        variant: "fouc",
        type: "FOUC — Flash of Unstyled Content",
        title: "배너 이미지가 스타일 없이 순간 노출되는 문제",
        problem: renewal.fout.foucProblem,
        solution: renewal.fout.foucSolution,
      },
      {
        variant: "fout",
        type: "FOUT — Flash of Unstyled Text",
        title: "폰트 로딩 전 텍스트가 깜빡이거나 재그려지는 문제",
        problem: renewal.fout.foutProblem,
        solution: renewal.fout.foutSolution,
      },
    ].map(({ variant, type, title, problem, solution }) => (
      <FoutVariantBanner key={variant} variant={variant}>
        <FoutVariantType variant={variant}>{type}</FoutVariantType>
        <FoutVariantTitle>{title}</FoutVariantTitle>
        <ProseText size="0.8rem" m="0 0 0.6rem 0">
          {problem}
        </ProseText>
        <FoutSolution variant={variant}>→ 해결: {solution}</FoutSolution>
      </FoutVariantBanner>
    ))}

    <CodeToggle
      lang="CSS"
      label="FOUT 해결 — font-display: swap Before / After"
    >
      <FoutCodeGrid>
        {[
          {
            isAfter: false,
            label: "Before — font-display 없음 (FOUT 발생)",
            code: renewal.fout.codeBefore,
          },
          {
            isAfter: true,
            label: "After — font-display: swap 적용 (FOUT 해결)",
            code: renewal.fout.codeAfter,
          },
        ].map(({ isAfter, label, code }) => (
          <FoutCodeItem key={label} isAfter={isAfter}>
            <FoutCodeHeader isAfter={isAfter}>{label}</FoutCodeHeader>
            <CodeBlockBody
              dangerouslySetInnerHTML={{ __html: highlightFontCode(code) }}
            />
          </FoutCodeItem>
        ))}
      </FoutCodeGrid>
    </CodeToggle>

    <CodeToggle
      lang="HTML"
      label="FOUC + FOUT 완화 — 배너 이미지 · 폰트 preload (PC/MO 분기)"
    >
      <CodeBlockBody
        dangerouslySetInnerHTML={{
          __html: highlightFontCode(renewal.fout.codePreload),
        }}
      />
    </CodeToggle>

    <div style={{ marginTop: "3rem" }}>
      <SubLabel>나이대 통계 쿼리 — license DB 연동</SubLabel>
      <ProseText size="0.88rem" m="0 0 2rem">
        {renewal.ageQuery.desc}
      </ProseText>
      <TwoColGrid style={{ marginBottom: "2rem" }}>
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
        *본원 통계 결과 <AgeQueryHighlight>30대, 40대</AgeQueryHighlight>에서
        가장 많이 취득한 자격증입니다
      </AgeQueryOutputBox>
    </div>
  </Section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🧩  TECH STACK SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const StackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 6rem;
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
    <SubLabel withLine mb="2.5rem">
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
   📅  TIMELINE SECTION
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
    <SubLabel withLine mb="2.5rem">
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
  const project = projectData.find((p) => p.id === Number(id));

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
        <MetricsSection metrics={project.metrics} />
        <OverviewSection
          data={project.problems_env}
          role={project.role}
          environment={project.environment}
          scale={project.scale}
        />
        {project.popupSystem && (
          <PopupManagementSection
            data={project.popupSystem}
            onImgClick={openLightbox}
          />
        )}
        {project.queryEngineering && (
          <QueryEngineeringSection qe={project.queryEngineering} />
        )}
        {project.architecture && (
          <ArchitectureSection
            arch={project.architecture}
            onImgClick={openLightbox}
          />
        )}
        {project.securitySystem && (
          <SecuritySection sec={project.securitySystem} />
        )}
        {project.boardSystem && (
          <BoardSystemSection
            board={project.boardSystem}
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
