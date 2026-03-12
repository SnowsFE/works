/* ===================================================
   프로젝트 통합 데이터 파일
   - Projects.jsx (카드 목록) + ProjectDetail.jsx (상세)
   가 모두 이 파일에서 import해 단일 출처를 유지합니다.
=================================================== */

export const projects = [
  /* ─────────────────────────────────────────────── */
  /*  id: 1 — 한국교육평가원                         */
  /* ─────────────────────────────────────────────── */
  {
    id: 1,
    /* 카드 목록 뷰 필드 */
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    github: null,
    live: null,
    desc: "4개 교육원 실서비스 운영. 레거시 환경에서 쿼리 최적화, SEO 개선, 관리자 시스템 설계까지 전반적인 개발을 담당했습니다.",
    stack: ["Classic ASP", "MSSQL", "JavaScript", "반응형 웹"],

    /* 상세 뷰 필드 */
    title: "한국교육평가원",
    period: "2024.12 — 2026.02",
    tag: "PRODUCTION",
    tagline:
      "레거시 ASP·MSSQL 환경에서 분산된 데이터 구조를 통합, 서비스 성능을 개선해온 풀스택 개발자",
    subtitle:
      "4개 교육원 실서비스 운영 · 레거시 환경에서의 성능 최적화 및 UX 개선 · 관리자 시스템 설계 및 구현",
    role: "풀스택 개발 · DB 설계 · 성능 최적화",
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
        before: "4개 분산 DB 단일 쿼리 통합",
        arrow: "4DB → 1Query",
        value: "4DB",
        desc: "외래키 없이 REPLACE 문자열 정규화만으로 Cross DB JOIN 설계 — 레거시 환경에서 스키마 변경 없이 과정 상세 전체 조합",
      },
      {
        before: "1:1 게시판 에디터 리뉴얼",
        arrow: "textarea → Rich Editor",
        value: "직접 구현",
        desc: "Quill·TipTap 없이 contentEditable + XHR 이미지 업로드 파이프라인 직접 구현 — 드래그앤드롭·클립보드 포함",
      },
    ],

    architecture: {
      screenshot: "/media/course-detail.jpg",
      screenshotCaption: "과정 상세 페이지 — 4개 DB 데이터를 단일 뷰로 통합",
      solution:
        "4개 DB에 분산된 데이터를 Cross DB JOIN으로 통합. 외래키 없는 레거시 환경에서 REPLACE 문자열 정규화로 키 불일치를 해결 — 스키마 변경 없이 단일 쿼리로 통합.",
      issue: {
        icon: "🗄️",
        label: "4개 DB 분산 구조",
        desc: "강의 DB · 자격증 DB · 결제 DB · 교육원 DB 각각 분리 운영 — 외래키 없는 레거시 환경에서 Cross DB JOIN 필수",
      },
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
      issue: {
        icon: "🐢",
        label: "게시판 응답 7~8초",
        desc: "구/신 게시판 이원화 + COUNT 별도 쿼리 분리 실행 구조 — 목록 로딩 7~8초, 검색 15초 이상 반복으로 전면 재설계 필요.",
      },
      before: "구/신 게시판 별도 조회 + COUNT 쿼리 분리 — 7~8초",
      solution:
        "CTE UNION ALL + ROW_NUMBER + COUNT(*) OVER() 단일 쿼리로 1~2초로 단축. VARCHAR '오전/오후' 포맷을 CASE WHEN + CHARINDEX + SUBSTRING으로 직접 파싱하여 구/신 게시판을 UNION ALL로 통합.",
      techniques: [
        {
          label: "CTE + UNION ALL",
          desc: "구 게시판(GtblQaABoard)과 신 게시판(tblSukangReading)을 WITH 절 안에서 통합. \n2번의 쿼리를 단일 실행으로 압축.",
        },
        {
          label: "VARCHAR DateTime 파싱",
          desc: 'brd_writeday가 VARCHAR("2025-12-12 오후 8:50:20" 형식)로 저장되어 있어 UNION ALL 후 ORDER BY 불가. CASE WHEN + CHARINDEX + SUBSTRING으로 오전/오후 파싱 후 24시간 포맷으로 통일.',
        },
        {
          label: "ROW_NUMBER() 페이징",
          desc: "ROW_NUMBER() OVER(ORDER BY parsed_date DESC)로 오프셋 기반 페이징. \nOFFSET-FETCH 없이 레거시 환경에서도 동작.",
        },
        {
          label: "COUNT(*) OVER() 인라인 집계",
          desc: "전체 건수 조회를 위한 별도 COUNT 쿼리 제거. COUNT(*) OVER()를 \nSELECT 안에 포함해 단일 쿼리로 총 건수와 데이터를 동시 반환.",
        },
        {
          label: "NOLOCK + 복합 인덱스",
          desc: "읽기 전용 목록에 WITH(NOLOCK) 적용. brd_userId + brd_writeday, brd_isDeleted + brd_writeday 복합 인덱스 2개 추가로 필터링 성능 최적화.",
        },
      ],
      result: "리스트 조회 7~8초 → 1~2초 · 검색 15초 이상 → 1~2초",
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

    boardSystem: {
      background:
        "기존 1:1 게시판 — 단순 텍스트 입력만 가능, 수강생 UX 열악. 수강생 UI·관리자 UI·DB 쿼리까지 전면 재설계를 통해 성능과 사용성 문제 동시 해결. 레거시 ASP 환경 충돌·번들 제약으로 외부 에디터를 배제하고 contentEditable + XHR 기반 파이프라인을 직접 구현.",
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
          desc: "Quill·TipTap 등 외부 에디터 없이 contentEditable + execCommand로 직접 구현. 폰트 패밀리·크기·굵기·색상·정렬·표 삽입까지 커버. 레거시 ASP 환경과의 충돌·번들 크기·커스터마이징 한계를 피하기 위한 선택.",
        },
        {
          label: "이미지 업로드 파이프라인 — 핵심 신규 기능",
          desc: "기존 텍스트 전용 게시판에 이미지 첨부 기능 추가. 클라이언트 사전 검증(타입·2MB·최대 2개) → XHR 비동기 업로드 → 서버 저장 후 URL 반환 → AttachmentManager 상태 관리. \n드래그앤드롭·클립보드 붙여넣기도 동일 파이프라인 통과.",
        },
      ],
      outcome: [
        {
          label: "이미지 첨부로 문의 정확도 향상",
          desc: "기존에는 텍스트로만 문의 → 리뉴얼 후 수강생이 오류 화면·결제 영수증 등 이미지를 직접 첨부. \n 담당자의 답변 정확도 향상 및 불필요한 추가 확인 감소.",
        },
        {
          label: "리치 에디터 도입 후 페이지 체류 시간 증가",
          desc: "단순 textarea 대비 서식·이미지가 포함된 에디터 제공으로\n 수강생의 문의 작성 완성도 향상 및 페이지 체류 시간 증가.",
        },
      ],
      legacyIntegration:
        "기존 GtblQaABoard 테이블의 구 게시글을 신규 UI에서 그대로 열람 가능하도록 legacy_mode=1 파라미터와 GetLegacyPost() 함수로 \n 하위 호환 처리. 신구 게시글이 하나의 글목록에 통합 표시되며, 구 게시글의 댓글은 cmt_brdIdx 기준 별도 조회로 정합성 유지.",
      security: [
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
      ],
    },

    popupSystem: {
      solution:
        "DB 기반 운영형 팝업 관리 시스템 설계·구현. 정적 마크업 수정 없이 관리자가 실시간으로 팝업 등록·수정·활성화 가능하도록 전환 — 노출 기간·클릭 로그까지 통합 관리하는 캠페인 운영 도구로 확장. 단순 카운트가 아닌 tblPopupLog 분리 설계로 pop_click_count를 조회용 캐시로 두고 기간별 집계·A/B 테스트 확장성을 확보.",
      outcome:
        "도입 후 팝업별 클릭 로그 데이터 축적 시작. 과정별 클릭 수 비교를 통해 수강생 선호도 파악 가능 \n 이전에는 어떤 과정이 관심을 받는지 수치로 확인할 방법이 없었으나, 로그 분리 설계로 기간별 집계·A/B 테스트 기반 마련.",
      archCards: [
        {
          badge: "01 · LIST",
          title: "팝업 목록 (popup.asp)",
          desc: "검색·페이징·AJAX 상태 토글·이미지 미리보기가 \n통합된 관리자 대시보드. 실시간 활성/비활성 전환.",
          accent: "rgba(0,242,96,0.6)",
        },
        {
          badge: "02 · REGISTER",
          title: "팝업 등록 (popup_write.asp)",
          desc: "PC/모바일 이미지 분리 업로드, 노출 기간 설정, 활성화 토글. \n서버·클라이언트 이중 유효성 검사.",
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
          desc: "XHR + popup_toggle.asp로 페이지 새로고침 없이 활성/비활성 즉시 반영. \nJSON 응답 파싱 후 DOM 클래스만 교체.",
          accent: "rgba(0,242,96,0.3)",
        },
        {
          icon: "🖼️",
          label: "PC / 모바일 이미지 분리",
          desc: "PC·Mobile 이미지를 각각 업로드. \n 수정 시 existing_image_pc/mobile를 hidden input으로 전달해 미선택 시 자동 유지.",
          accent: "rgba(100,160,255,0.3)",
        },
        {
          icon: "📅",
          label: "기간 기반 노출 쿼리",
          desc: "pop_start_date ≤ GETDATE() ≤ pop_end_date 조건으로 \n 자동 노출·만료. 관리자 등록만으로 지정 시간에 자동 활성화.",
          accent: "rgba(255,160,60,0.3)",
        },
        {
          icon: "📊",
          label: "클릭 로그 분리 설계",
          desc: "pop_click_count는 캐시 컬럼. 실 클릭은 tblPopupLog에 별도 적재해 \n기간별 집계·A/B 테스트 확장 가능한 구조.",
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
        "pop_is_active 활성 + 현재 시각이 노출 기간 내인 팝업만 TOP 1 조회. ORDER BY pop_start_date DESC로 가장 최근 등록된 이벤트 우선 노출.",
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
        "1:1 게시판 답변 시 동일한 내용을 매번 직접 입력하는 비효율 반복. 배송일 안내, 환불 정책 등 유형이 정해진 답변임에도 별도 시스템 부재 — 담당자마다 내용이 달라지는 문제.",
      solution:
        "관리자가 자주 사용하는 답변을 카테고리별로 저장·재사용하는 템플릿 관리 시스템. \n contentEditable 기반 인라인 편집, adminLevel 권한 분기, 배송일 자동 치환, 복사 애니메이션까지 단일 페이지(ASP + Vanilla JS)로 구현. 물리 삭제 배제, brd_isDeleted + brd_deleted_at 기반 논리 삭제 설계를 게시판·팝업·템플릿 전 시스템에 공통 적용.",
      outcome:
        "반복 타이핑 → 클릭 한 번으로 대체. 카테고리별 분류로 원하는 답변 즉시 검색·복사 가능. \n 담당자마다 달랐던 답변 내용이 표준화되어 응대 일관성 향상 — 배송일 자동 치환으로 날짜 계산 실수도 제거.",
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
        { column: "brd_writer", type: "nvarchar", desc: "작성자 (Session AdminID)" },
        { column: "brd_title", type: "nvarchar", desc: "템플릿 제목" },
        { column: "brd_content", type: "nvarchar", desc: "템플릿 내용" },
        { column: "brd_category", type: "nvarchar", desc: "카테고리 (강의 / 배송 / 결제 …)" },
        { column: "brd_regDate", type: "datetime", desc: "등록일" },
        { column: "brd_updateDate", type: "datetime", desc: "수정일 (GETDATE() 자동 갱신)" },
        { column: "brd_is_Deleted", type: "bit", desc: "소프트 삭제 플래그" },
        { column: "brd_deleted_at", type: "datetime", desc: "삭제 시각" },
        { column: "brd_adCheck", type: "bit", desc: "수정 확인 플래그" },
        { column: "brd_isFixed", type: "bit", desc: "-1: 고정 템플릿 / 0: 일반" },
      ],
      highlights: [
        {
          label: "contentEditable 인라인 편집",
          desc: "제목·내용 클릭 즉시 편집 모드 전환. \n 별도 편집 페이지 없이 DOM 내에서 처리하며 바깥 클릭 시 자동 취소.",
        },
        {
          label: "배송일 자동 계산 및 플레이스홀더 치환",
          desc: "ASP에서 license DB의 tb_sendDay를 조회해 배송일을 계산하고 JS 변수로 전달. \n고정 템플릿 내 [배송일1]·[배송일2]·[배송일3] 플레이스홀더를 실제 날짜로 자동 치환.",
        },
        {
          label: "복사 + 시각 피드백",
          desc: "Clipboard API 우선 시도, 실패 시 execCommand fallback. \n복사 성공 시 카드 페이드 애니메이션 + 인라인 '복사되었습니다' 메시지 표시.",
        },
        {
          label: "DOM 덮어씌우지 않는 카테고리 필터",
          desc: "카테고리 전환 시 innerHTML 재생성 없이 기존 요소의 display를 토글. \n인라인 편집 상태 유지 및 불필요한 DOM 재생성 방지.",
        },
      ],
      security: [
        {
          label: "adminLevel 권한 분기",
          desc: "brd_isFixed = -1인 고정 템플릿은 adminLevel ≤ 2만 수정·삭제 가능. 일반 템플릿은 최고관리자 또는 작성자 본인만 삭제 가능. ASP 서버 검증 + JS 클라이언트 이중 체크.",
          accent: "rgba(100, 160, 255, 0.4)",
        },
        {
          label: "소프트 딜리트 패턴",
          desc: "brd_isDeleted = -1 플래그와 brd_deletedAt 타임스탬프로 논리 삭제. 물리 삭제 없이 데이터 보존 및 감사 추적. 이 패턴은 게시판·팝업·템플릿 전 시스템에 동일하게 적용.",
          accent: "rgba(0, 242, 96, 0.3)",
        },
      ],
    },

    kpcpRenewal: {
      desc: "자격증 상세페이지 리뉴얼 과정에서 license DB의 실 결제 데이터를 활용한 개인화 콘텐츠 추가. '본원 통계 결과 ○○대에서 가장 많이 취득한 자격증' 문구를 동적으로 표시하기 위한 통계 쿼리 설계.",
      screenshot: {
        src: "/media/kpcp-stats.png",
        caption: "자격증 상세 — 연령대 통계 문구 동적 표시",
      },
      ageQuery: {
        desc: "리뉴얼 자격증 상세페이지 — '본원 통계 결과 ○○대에서 가장 많이 취득한 자격증' 문구 동적 표시. license DB의 실 결제 데이터 기반으로 자격증별 주요 수강 연령대를 산출하는 통계 쿼리.",
        points: [
          {
            label: "생년월일 → 나이대 변환",
            desc: "loi_birth(VARCHAR, YYYYMMDD)에서 LEFT(loi_birth, 4)로 출생연도 추출 → \n현재연도 - 출생연도로 나이 계산 → CASE WHEN으로 10대~90대 그룹핑.",
          },
          {
            label: "자격증별 연령대 집계",
            desc: "loi_licenseCode + loi_manage 기준으로 GROUP BY하여 \n연령대별 결제 건수(cnt) 집계. 최근 1년 데이터만 필터링하여 최신 트렌드 반영.",
          },
          {
            label: "TOP 2 추출 — ROW_NUMBER()",
            desc: "PARTITION BY loi_licenseCode, loi_manage ORDER BY cnt DESC로 \n연령대 순위 산출. rn <= 2 조건으로 1위·2위만 JOIN.",
          },
          {
            label: "정렬 및 표시 처리 (ASP)",
            desc: "두 연령대가 같으면 하나만, 다르면 어린 연령대가 앞에 오도록 \n CInt(Replace(age,'대','')) 비교 후 정렬하여 '30대, 40대' 형태로 출력.",
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

  /* ─────────────────────────────────────────────── */
  /*  id: 2 — STUDIO CORE (카드 전용)               */
  /* ─────────────────────────────────────────────── */
  {
    id: 2,
    title: "STUDIO CORE",
    desc: "창의적인 아티스트들을 위한 포트폴리오 플랫폼입니다. 부드러운 스크롤 인터랙션과 3D 요소를 활용했습니다.",
    stack: ["Three.js", "GSAP", "React"],
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    github: "#",
    live: "#",
  },
];
