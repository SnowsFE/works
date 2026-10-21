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
    desc: "4개 교육원 실서비스 운영. 쿼리 최적화·사람인 REST API 배치 자동화·관리자 시스템 설계까지 레거시 ASP 환경에서 풀스택 개발을 담당했습니다.",
    stack: ["Classic ASP", "MSSQL", "사람인 REST API", "Windows Scheduler", "JavaScript"],

    /* 상세 뷰 필드 */
    title: "한국교육평가원",
    titleHighlight: "원",
    period: "2024.12 — 현재",
    tag: "PRODUCTION",
    tagline:
      "레거시 ASP·MSSQL 환경에서 DB 최적화, 외부 API 배치 자동화, 관리자 시스템까지 설계·운영한 풀스택 개발자",
    subtitle:
      "4개 교육원 실서비스 운영 · 쿼리 최적화 및 DB 설계 · 사람인 API 배치 파이프라인 · 관리자 시스템 구현",
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
        before: "취업정보 수동 업데이트 구조",
        arrow: "수동 → 배치 자동화",
        value: "288회/일",
        desc: "사람인 REST API × Windows 스케쥴러 배치 파이프라인 — 12개 직무 카테고리를 1시간 간격 자동 수집. VBScript JSON 파싱, HTTP_HOST 기반 4개 교육원 분기, IP 화이트리스트 보안까지 단일 코드베이스로 구현",
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

    recruitCenter: {
      solution:
        "사람인 REST API를 직무코드 기준 카테고리별 수집·저장하는 배치 파이프라인. Windows 작업 스케쥴러 → batch_saramin.bat → msedge.exe 외부 호출로 서버 내부 지연을 완전 배제. HTTP_HOST 기반 도메인 감지로 4개 교육원 브랜드 테마를 자동 분기하는 단일 코드베이스 공용 서비스.",

      orgThemes: [
        { key: "kpcp", domain: "kpcp.co.kr", name: "한국능력교육평가원", color: "#d95f6e" },
        { key: "kpei", domain: "kpei.co.kr", name: "한국심리교육협회", color: "#c47a3a" },
        { key: "lei", domain: "lei.or.kr", name: "사회교육중앙회", color: "#3aafc8" },
        { key: "ili", domain: "ili.or.kr", name: "국제자격검정원", color: "#5577d4" },
      ],

      apiQuota: {
        dailyLimit: 500,
        categories: 12,
        perCall: 100,
        intervalHours: 1,
        maxDailyUsage: 288,
        efficiency: "57.6%",
        desc: "12개 카테고리 × 24회(1시간 간격) = 288회/일 — 일 한도 500회의 57.6%만 사용",
      },

      flowSteps: [
        { label: "Windows 스케쥴러", text: "1시간 간격" },
        { label: "배치 실행", text: "batch_saramin.bat" },
        { label: "외부 호출", text: "msedge.exe" },
        { label: "ASP 배치", text: "batch_saramin.asp" },
        { label: "사람인 API", text: "oapi.saramin.co.kr" },
        { label: "DB 갱신", text: "tblAPIJobResult" },
      ],

      features: [
        {
          icon: "⚙️",
          label: "배치 외부 호출 — 내부 지연 배제",
          desc: "ASP 자체 실행 대신 작업 스케쥴러 → bat 파일 → msedge.exe로 ASP 페이지 외부 호출. 서버 내부 응답 대기 없이 독립 실행 — 배치 지연 제거.",
          accent: "rgba(0,242,96,0.3)",
        },
        {
          icon: "🎨",
          label: "도메인별 테마 자동 분기",
          desc: "HTTP_HOST로 kpcp·kpei·lei·ili 4개 도메인 감지 후 Primary 색상·로고 자동 전환. 단일 index.asp 코드베이스로 4개 기관 동시 운영.",
          accent: "rgba(100,160,255,0.3)",
        },
        {
          icon: "📊",
          label: "API 호출 최적화 — 일 288회",
          desc: "일 500회 제한 대비 12카테고리 × 24시간 = 288회 최대 사용(57.6%). grp_id 단위 DELETE → INSERT로 항상 최신 데이터 유지. 0건 응답 시 기존 데이터 보존.",
          accent: "rgba(255,160,60,0.3)",
        },
        {
          icon: "🔒",
          label: "IP 제한 + 로그인 월",
          desc: "배치 페이지는 REMOTE_ADDR 화이트리스트로 외부 접근 차단. 채용 공고는 비로그인 사용자 카드 클릭 시 로그인 페이지로 리다이렉트(returnUrl 포함).",
          accent: "rgba(255,80,80,0.3)",
        },
        {
          icon: "📱",
          label: "방문 추적 — IF EXISTS UPSERT",
          desc: "tblRecruitVisit: mem_id + site_id + device_type + visit_date 복합 조건으로 UPSERT. 당일 첫 방문 INSERT, 재방문은 daily_cnt +1. PC/모바일 User-Agent 자동 판별.",
          accent: "rgba(0,242,96,0.25)",
        },
        {
          icon: "🔍",
          label: "검색 · 정렬 · 페이징",
          desc: "직무 카테고리 필터 + 기업명·직무명 키워드 검색. 마감 빠른순/늦은순·등록일 최신순/오래된순 4가지 정렬. ROW_NUMBER() 페이징(21건/페이지).",
          accent: "rgba(100,160,255,0.25)",
        },
      ],

      tables: {
        group: {
          name: "tblAPICertGroup",
          role: "직무코드 그룹",
          rows: [
            ["grp_id", "int", "PK — 카테고리 ID"],
            ["grp_nm", "nvarchar", "카테고리명 (UI 표시)"],
            ["grp_jcd", "nvarchar", "사람인 job_cd"],
          ],
        },
        result: {
          name: "tblAPIJobResult",
          role: "수집 결과 캐시",
          rows: [
            ["job_grpId", "int", "FK → tblAPICertGroup"],
            ["job_company", "nvarchar(100)", "기업명"],
            ["job_title", "nvarchar(200)", "공고 제목"],
            ["job_location", "nvarchar(100)", "근무지"],
            ["job_salary", "nvarchar(100)", "급여조건"],
            ["job_deadline", "date", "마감일 (NULL = 상시채용)"],
            ["job_url", "nvarchar(500)", "공고 URL"],
            ["job_postDt", "date", "등록일"],
          ],
        },
        visit: {
          name: "tblRecruitVisit",
          role: "방문 추적 (UPSERT)",
          rows: [
            ["mem_id", "nvarchar", "수강생 ID"],
            ["mem_name", "nvarchar", "수강생 이름"],
            ["site_id", "nvarchar", "교육원 식별자"],
            ["device_type", "nvarchar", "pc / mobile"],
            ["visit_date", "date", "방문일 (UPSERT 기준)"],
            ["daily_cnt", "int", "당일 방문 횟수"],
            ["last_visit", "datetime", "마지막 방문 시각"],
          ],
        },
      },

      security: [
        {
          label: "IP 화이트리스트 — 배치 페이지 접근 제한",
          desc: "REMOTE_ADDR로 허용 IP를 서버에서 검증. 미허용 IP는 'Access Denied' 즉시 반환. 배치 URL 외부 노출 시에도 인가된 서버에서만 실행 가능.",
          accent: "rgba(255, 80, 80, 0.5)",
        },
        {
          label: "비로그인 사용자 접근 차단",
          desc: "Session userid를 JS 변수(isLoggedIn)로 전달. 비로그인 카드 클릭 시 e.preventDefault() + 로그인 리다이렉트. returnUrl 파라미터로 로그인 후 원래 페이지 복귀.",
          accent: "rgba(255, 80, 80, 0.4)",
        },
      ],
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
      {
        category: "External API & Batch",
        items: [
          "사람인 REST API",
          "Windows Task Scheduler",
          "Batch Script (.bat)",
          "MSXML2.ServerXMLHTTP",
          "JSON 파싱 (순수 VBScript)",
          "IP 접근 제한",
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
      {
        date: "2026.05",
        content: "취업정보센터 구축",
        detail: "사람인 API 배치 수집 파이프라인, 4개 교육원 공용 취업정보센터 오픈, 방문 추적 시스템 설계",
      },
      {
        date: "2026.07",
        content: "ILI 리뉴얼",
        detail: "메인 · 자격증 안내 · 자격증 상세 PC · 모바일 반응형 리뉴얼, 과정 목록 DB 연동",
      },
      {
        date: "2026.08",
        content: "나의강의실 리뉴얼",
        detail: "KPEI · LEI · KPCP 순차 적용, 시험 합격 후 자격증 신청 · 1급 바로 응시 동선 추가",
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  /*  id: 2 — 마이크로레이더 (MicroRadar)            */
  /* ─────────────────────────────────────────────── */
  {
    id: 2,
    /* 카드 목록 뷰 필드 */
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    github: null,
    live: "https://microradar.kr",
    desc: "나스닥 마이크로캡 실시간 뉴스·SEC 공시 서비스. 수집 파이프라인부터 AI 등급 분석·SSE 스트리밍·서버 배포까지 혼자 설계하고 운영 비용 $0로 상시 가동 중입니다.",
    stack: ["Node.js", "React", "MySQL", "Redis", "SSE", "Gemini API"],

    /* 상세 뷰 필드 */
    title: "마이크로레이더",
    titleHighlight: "더",
    period: "2026.06 — 현재",
    tag: "LIVE SERVICE",
    heroNote: "개인 프로젝트 · 1인 개발",
    heroCodeLang: "js",
    tagline:
      "수집 · AI 분석 · 실시간 스트리밍 · 배포까지 혼자 설계하고 무료 티어 조합만으로 상시 운영하는 실서비스",
    subtitle:
      "나스닥 마이크로캡(시총 5억 달러 이하) 전용 · 1차 보도자료 직수집 · Gemini 등급 분석 · SSE 실시간 피드 · OCI + Cloudflare 무중단 운영",
    role: "기획 · 백엔드 · 프론트엔드 · 인프라 (1인)",
    environment: "Node.js · React · MySQL · Redis · OCI",
    scale: "실서비스 운영 중 · microradar.kr",

    metrics: [
      {
        before: "뉴스 소스가 2차 매체(Benzinga·Yahoo) 하나",
        arrow: "2차 매체 → 1차 보도자료",
        value: "30초",
        desc: "GlobeNewswire·PRNewswire·Newsfile 3개 PR 와이어를 직수집. 2차 매체가 받아쓰기 전 원문을 30초 주기로 먼저 잡는 구조로 전환",
      },
      {
        before: "AI 분석 큐가 429로 멈춰 백로그 적체",
        arrow: "무기한 정지 → 전량 복원",
        value: "517건",
        desc: "원인 3중 — 모델 별칭의 조용한 이동 · 429 후 6시간 과잉 정지 · 일일 카운터 UTC 기준. 명시 모델 고정 + PT 리셋 정렬 + 정지 1시간 단축으로 밀린 517건 전량 해소",
      },
      {
        before: "서버 · 데이터 · AI 월 운영비",
        arrow: "유료 스택 → 무료 티어 조합",
        value: "$0",
        desc: "OCI 프리티어(1GB) + Cloudflare + SEC·Finnhub·FINRA·Gemini 무료 티어. 도메인 외 고정비 없이 실서비스 상시 가동",
      },
    ],

    /* ── 시스템 아키텍처 ── */
    systemArch: {
      issue: {
        icon: "🧱",
        label: "1GB 단일 VM · 무료 티어 제약",
        desc: "프리티어 1GB VM 한 대에 API·DB·캐시·워커 6종을 전부 올려야 하는 구조 — 메모리 여유·외부 API 호출 한도·오리진 노출까지 한 번에 설계해야 했다",
      },
      solution:
        "역할별로 계층을 끊고 각 계층에서 새는 자원을 막는 방식으로 설계. Cloudflare가 오리진을 가리고 트래픽을 흡수, Nginx가 SSE만 버퍼링을 끄고 나머지는 정적 캐시, Node는 단일 프로세스에 워커를 태우되 폴링 주기를 외부 API 한도에서 역산, Redis는 영구 저장이 아니라 중복 제거·카운터·캐시 전용으로만 사용.",
      layers: [
        {
          tier: "CLIENT",
          name: "React SPA (Vite)",
          desc: "TanStack Query 무한스크롤 + EventSource 실시간 갱신. 관심종목은 서버 없이 localStorage",
          accent: "rgba(100,160,255,0.6)",
        },
        {
          tier: "EDGE",
          name: "Cloudflare",
          desc: "Universal SSL · DDoS 흡수 · 오리진 IP 은닉. 프록시 ON 고정 (OFF면 Origin Cert가 무효)",
          accent: "rgba(255,160,60,0.6)",
        },
        {
          tier: "WEB",
          name: "Nginx :443",
          desc: "Origin Certificate · /api 리버스 프록시 · /api/stream 만 proxy_buffering off · SPA 폴백",
          accent: "rgba(0,242,96,0.6)",
        },
        {
          tier: "APP",
          name: "Node.js + Express (PM2 :4000)",
          desc: "REST · SSE 브로드캐스터 · 폴링 워커 6종 · node-cron 배치. 127.0.0.1 바인딩으로 Nginx만 접근",
          accent: "rgba(0,242,96,0.6)",
        },
        {
          tier: "DATA",
          name: "MySQL 8 · Redis",
          desc: "MySQL은 영구 저장(7 테이블) · Redis는 중복 제거·카운터·캐시 전용. 둘 다 127.0.0.1 바인딩",
          accent: "rgba(190,120,255,0.6)",
        },
        {
          tier: "EXTERNAL",
          name: "SEC EDGAR · PR 와이어 · Finnhub · FINRA · Gemini",
          desc: "전부 무료 티어 — 각 API의 한도가 곧 폴링 주기 설계 제약이 된다",
          accent: "rgba(255,80,80,0.6)",
        },
      ],
      workers: [
        ["prWirePoller", "30초", "GlobeNewswire·PRNewswire·Newsfile 1차 보도자료"],
        ["finnhubPoller", "1분", "종목 뉴스 + 시총·플로트 메타 갱신"],
        ["secPoller", "2분", "SEC 8-K·S-1·S-3·424B·SC 13D 공시 감지"],
        ["aiQueue", "72초", "Gemini 분석 큐 (일일 한도 내 최신순 처리)"],
        ["translitSync", "30분", "기업명 한글 음역 (티커당 1회, 영구 저장)"],
        ["cikSync · retryBatch", "일 1회", "CIK↔티커 매핑 동기화 · 스킵분 재처리"],
      ],
      cache: [
        ["dedup:news:{url}", "뉴스 URL 중복 제거", "7일"],
        ["dedup:filing:{url}", "공시 URL 중복 제거", "7일"],
        ["meta:{ticker}", "종목 메타 캐시", "30분"],
        ["cik:{cik}", "CIK → 티커 매핑", "24시간"],
        ["gemini:rpd:{PT날짜}", "AI 일일 호출 카운터", "PT 자정"],
        ["ipban:{ip}", "남용 IP 자동 차단", "15분"],
      ],
      codeLang: "nginx",
      codeBlock: `# SSE — 버퍼링을 끄지 않으면 이벤트가 Nginx 버퍼에 갇혀
# 실시간이 아니게 된다. 일반 /api 블록과 반드시 분리한다.
location /api/stream {
  proxy_pass http://127.0.0.1:4000;
  proxy_http_version 1.1;
  proxy_set_header Connection '';

  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 24h;
  chunked_transfer_encoding on;
}

location /api/ {
  proxy_pass http://127.0.0.1:4000;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location / {
  root /var/www/microradar;
  try_files $uri /index.html;      # SPA 폴백
}`,
    },

    /* ── 수집 파이프라인 ── */
    collect: {
      issue: {
        icon: "📡",
        label: "\"우리만 없는 뉴스\"가 생기는 구조",
        desc: "뉴스 소스가 Finnhub 무료(Benzinga·Yahoo 등 2차 매체) 하나뿐이라 마이크로캡의 1차 보도자료를 통째로 놓쳤다. 공시도 8-K·S-1 두 종뿐이라 증자·행동주의 지분 공시가 빠졌다.",
      },
      solution:
        "소스를 1차 보도자료까지 끌어올리고, 들어오는 양이 늘어난 만큼 게이트를 앞단으로 옮겼다. PR 와이어 3곳을 직접 폴링해 원문을 먼저 잡고, 폼타입을 5종으로 넓히되 시총 게이트를 SEC 본문 다운로드 이전에 걸어 대형주 공시가 파이프라인에 들어오기 전에 잘라낸다.",
      sources: [
        {
          key: "PR WIRE ×3",
          name: "GlobeNewswire · PRNewswire · Newsfile",
          cycle: "30초",
          color: "#00f260",
          desc: "1차 보도자료 원문. 와이어마다 티커 확보 방식이 달라 전략을 분리 — GlobeNewswire는 RSS category(Nasdaq:XXXX), PRNewswire·Newsfile은 본문 관용구 (NASDAQ: XXXX) 정규식 추출",
        },
        {
          key: "SEC EDGAR",
          name: "8-K · S-1 · S-3 · 424B · SC 13D",
          cycle: "2분",
          color: "#64a0ff",
          desc: "company_tickers.json을 일 1회 받아 CIK↔티커를 미리 매핑 — 공시 건별 API 조회 0회. 본문과 EX-99.1 보도자료를 Range 다운로드로 추출",
        },
        {
          key: "FINNHUB",
          name: "종목 뉴스 · 시총 · 플로트 · 섹터",
          cycle: "1분",
          color: "#ffa03c",
          desc: "무료 60req/분을 전역 슬롯(1.1초 간격)으로 직렬화. 여러 워커가 동시에 부르면 한도가 터지므로 호출을 한 줄로 세운다",
        },
        {
          key: "FINRA · SEC FTD",
          name: "공매도 잔고 · 일별 비율 · 인도실패",
          cycle: "일 1회",
          color: "#be78ff",
          desc: "종목 상세의 보조 지표. 압축 파일을 외부 의존성 없이 zlib으로 직접 해제·파싱하고 유니버스 종목만 적재",
        },
      ],
      flowSteps: [
        { label: "수집", text: "PR · SEC · Finnhub" },
        { label: "중복 제거", text: "URL · 스토리 · 언어" },
        { label: "게이트", text: "시총 ≤ $500M" },
        { label: "저장", text: "MySQL" },
        { label: "1차 송출", text: "SSE (제목)" },
        { label: "AI 큐", text: "등급 분석" },
      ],

      screenshot: {
        src: "/media/microradar-stock.png",
        caption:
          "종목 상세 — 4개 소스(PR 뉴스 · SEC 공시 · Finnhub 메타 · FINRA 공매도)가 한 종목으로 모인 화면",
      },
      dedup: [
        {
          badge: "01 · URL",
          title: "URL 중복 — Redis SET",
          desc: "가장 기본. 같은 링크는 7일간 재수집하지 않는다.\n소스가 늘어도 하나의 네임스페이스를 공유해 교차 중복까지 막는다.",
          accent: "rgba(0,242,96,0.6)",
        },
        {
          badge: "02 · STORY",
          title: "동일 사건 재송출",
          desc: "같은 보도자료를 URL만 바꿔 다시 내보내는 케이스.\n제목 정규화 키로 사건 단위 중복을 잡는다.",
          accent: "rgba(100,160,255,0.6)",
        },
        {
          badge: "03 · LANG",
          title: "다국어 동시 송출 — 실측 9건 → 1건",
          desc: "와이어가 같은 PR을 8개 언어로 뿌리는데 URL이 전부 달라 1·2단계를 그대로 통과한다.\n문자셋 검사 + 감지 언어 조합으로 영어 원문 1건만 통과시킨다.",
          accent: "rgba(255,80,80,0.6)",
        },
      ],
      features: [
        {
          icon: "🎯",
          label: "시총 게이트를 본문 요청 *이전*에",
          desc: "Finnhub 시총 단위는 백만달러, DB는 천달러 — ×1000 변환이 빠지면 게이트가 통째로 무력화된다.\n대형주를 SEC 본문 다운로드 전에 잘라내 실측 한 사이클 23건 차단 = AI 23건·SEC 요청 23건 절감.",
          accent: "rgba(0,242,96,0.3)",
        },
        {
          icon: "📄",
          label: "제목이 아니라 본문을 읽는다",
          desc: "8-K 제목은 \"8-K - COMPANY (CIK) (Filer)\"가 전부라 제목만 넣으면 AI가 \"특별한 내용 없음\"만 반환한다.\n공시 index에서 본문 + EX-99.1 보도자료를 추출해 분석 입력으로 사용.",
          accent: "rgba(100,160,255,0.3)",
        },
        {
          icon: "🧹",
          label: "집계성 노이즈 배제",
          desc: "\"오늘의 급등락 종목 리스트\"·매크로 시황(Nasdaq/Dow/S&P/Gold) 기사는 특정 종목의 사건이 아니다.\n피드를 덮는 주범이라 수집 단계에서 제외 — 실측 69건 정리.",
          accent: "rgba(255,160,60,0.3)",
        },
        {
          icon: "⚖️",
          label: "로펌 집단소송 광고 차단",
          desc: "PR 와이어 최대 노이즈. 실측 PRNewswire 티커 보유 건 12/12가 전부 이것이었다.\n한 종목에 로펌마다 수십 건씩 뿌려 피드를 점거하므로 전량 제외.",
          accent: "rgba(255,80,80,0.3)",
        },
        {
          icon: "🚫",
          label: "거래 불가 종목 제외",
          desc: "티커 매핑에 실패하는 공시는 대개 CMBS 신탁·부동산 펀드처럼 개인이 거래할 수 없는 대상이다.\n매핑 실패 시 저장하지 않고 버린다 — 실측 79건 정리.",
          accent: "rgba(190,120,255,0.3)",
        },
        {
          icon: "🔤",
          label: "티커 선택 우선순위",
          desc: "한 CIK에 보통주와 우선주 티커가 함께 잡혀 우선주로 덮이는 문제(GL → GL-PD).\n하이픈 없는 보통주 티커를 우선 선택 — 하이픈 티커 541건 → 20건.",
          accent: "rgba(0,242,96,0.25)",
        },
      ],
      tables: {
        news: {
          name: "tblNews",
          role: "뉴스",
          rows: [
            ["ticker", "varchar(20)", "종목 티커"],
            ["title / titleKo", "varchar(500)", "원문 · 번역 제목"],
            ["content", "text", "기사 원문 (AI 입력)"],
            ["url", "varchar ascii", "UNIQUE — 중복 방지"],
            ["grade / direction", "char · varchar", "S~D · bullish/bearish"],
            ["summary / reason", "varchar", "AI 요약 · 등급 근거"],
            ["marketCap", "bigint", "천달러 단위"],
            ["isProcessed", "tinyint", "0 미처리 / 1 완료 / -1 스킵"],
          ],
        },
        filings: {
          name: "tblFilings",
          role: "SEC 공시",
          rows: [
            ["ticker / cik", "varchar", "티커 · CIK 백업"],
            ["formType", "varchar(20)", "8-K · S-1 · S-3 · 424B · 13D"],
            ["content", "text", "본문 + EX-99.1 (AI 입력)"],
            ["url", "varchar ascii", "UNIQUE"],
            ["filedAt", "datetime", "공시 시각"],
            ["grade / direction", "char · varchar", "AI 등급 · 방향"],
            ["summary / category", "varchar", "AI 요약 · 분류"],
            ["isProcessed", "tinyint", "분석 상태"],
          ],
        },
      },
      codeLang: "js",
      codeBlock: `// ── 3단 중복 제거 ──────────────────────────────
// 1) URL — 같은 링크는 7일간 재수집하지 않는다
const fresh = await redis.set('dedup:news:' + url, 1, 'NX', 'EX', WEEK);
if (!fresh) return null;

// 2) 스토리 — 같은 보도자료를 URL만 바꿔 재송출하는 케이스
const storyKey = title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 120);
if (!(await redis.set('dedup:story:' + storyKey, 1, 'NX', 'EX', WEEK))) return null;

// 3) 언어 — 와이어가 같은 PR을 8개 언어로 뿌리는데 URL이 전부 다르다.
//    문자셋만으로는 부족했다. 중국어 제목에 섞인 영문 단어 때문에
//    구글 언어감지가 en으로 오답을 내는 케이스가 있어 두 판정을 조합한다.
if (hasNonLatinScript(title)) return null;          // 한글 · 가나 · 한자
if (await detectLang(title) !== 'en') return null;  // 힌디 · 말레이 등 라틴 표기

// ── 시총 게이트 (본문 요청 이전) ────────────────
// Finnhub 단위: 백만달러 / DB 단위: 천달러  ->  x1000 변환 필수
const meta = await getMeta(ticker);
if (!meta.marketCap || meta.marketCap > CAP_LIMIT) return null;  // > $500M

// 여기까지 통과한 것만 SEC 본문을 내려받는다
const body = await fetchFilingBody(url);`,
    },

    /* ── AI 분석 파이프라인 ── */
    ai: {
      issue: {
        icon: "🛑",
        label: "AI 분석 큐 정지 · 백로그 517건",
        desc: "무료 한도 안에서 돌던 분석 큐가 429로 멈추고 재개되지 않았다. 원인이 하나가 아니라 모델 별칭 · 정지 시간 · 카운터 기준 세 곳에 동시에 있었다.",
      },
      solution:
        "429를 \"한도 초과\" 한 덩어리로 보지 않고 원인을 셋으로 분해해 각각 고쳤다. 더불어 무료 한도가 모델별로 독립이라는 점을 이용해 뉴스 분석과 기업명 음역에 서로 다른 모델을 배정 — 한쪽이 다른 쪽의 한도를 갉아먹지 않는 구조로 분리했다.",
      rootCauses: [
        {
          badge: "01 · MODEL",
          title: "별칭이 조용히 이동했다",
          desc: "`-latest` 별칭을 구글이 다른 모델로 옮겼고,\n옮겨간 모델의 소진된 한도를 그대로 물려받아 429.\n→ 명시 버전으로 고정.",
          accent: "rgba(255,80,80,0.6)",
        },
        {
          badge: "02 · BACKOFF",
          title: "정지 6시간이 너무 길었다",
          desc: "그 사이 백로그가 폭증하고, 리셋 시각이 지나도\n깨어나지 않아 쓸 수 있는 한도를 낭비했다.\n→ 1시간으로 단축.",
          accent: "rgba(255,160,60,0.6)",
        },
        {
          badge: "03 · COUNTER",
          title: "카운터 기준이 어긋났다",
          desc: "일일 카운터가 UTC 날짜인데 구글 리셋은 PT 자정.\n7~8시간 어긋나 리셋 전에 먼저 막혔다.\n→ PT 날짜로 정정.",
          accent: "rgba(100,160,255,0.6)",
        },
      ],
      quota: [
        { value: "500", label: "무료 RPD / 모델" },
        { value: "2", label: "모델 분리 운영" },
        { value: "330", label: "실사용 / 일" },
        { value: "$0", label: "AI 비용", highlight: true },
      ],
      grades: [
        { grade: "S", color: "#8B5CF6", desc: "주가 급등락 가능 — FDA 승인·거절, 대형 계약, 기관 대량매수" },
        { grade: "A", color: "#10B981", desc: "명확한 호재/악재 — 실적 개선, 파트너십, 내부자 대량매수" },
        { grade: "B", color: "#6B7280", desc: "약한 호재/악재 또는 중립" },
        { grade: "C", color: "#F59E0B", desc: "약한 악재" },
        { grade: "D", color: "#EF4444", desc: "주가 급락 가능 — 상장폐지 경고, 대형 소송, 실적 쇼크" },
      ],
      features: [
        {
          icon: "🧠",
          label: "thinkingBudget: 0 은 선택이 아니라 필수",
          desc: "flash 계열은 thinking 모드가 기본 ON이다.\n끄지 않으면 추론 토큰만 전부 소진하고 본문이 빈 채로 MAX_TOKENS 종료된다 — 호출은 나갔는데 결과가 없다.",
          accent: "rgba(0,242,96,0.3)",
        },
        {
          icon: "📌",
          label: "`-latest` 별칭 금지",
          desc: "별칭은 구글이 예고 없이 다른 모델로 옮긴다.\n옮겨간 모델의 한도가 이미 소진된 상태라 정상 사용량에서도 429가 났다 — 명시 버전으로 고정.",
          accent: "rgba(255,80,80,0.3)",
        },
        {
          icon: "🕐",
          label: "카운터는 PT 날짜 기준",
          desc: "구글 한도 리셋은 태평양 자정.\nUTC로 세면 7~8시간 어긋나 리셋 직후 한도를 못 쓰고, 리셋 전에 먼저 막힌다.",
          accent: "rgba(255,160,60,0.3)",
        },
        {
          icon: "🔀",
          label: "429는 한 덩어리가 아니다",
          desc: "분당 한도(RPM)는 지수 백오프 재시도, 일일 한도(RPD)는 -1 스킵 후 새벽 배치 복원, 지출 상한은 큐 일시정지.\n하나로 묶어 처리하면 무한 재시도에 빠진다 — 실제로 3일간 같은 항목을 재시도한 사고가 있었다.",
          accent: "rgba(100,160,255,0.3)",
        },
        {
          icon: "⏱️",
          label: "최신순 처리 (id DESC)",
          desc: "오래된 것부터 처리하면 방금 들어온 뉴스가 큐 맨 뒤에서 대기한다.\n최신순으로 뒤집어 새 뉴스가 수십 초 안에 등급을 받는다.",
          accent: "rgba(0,242,96,0.25)",
        },
        {
          icon: "🇰🇷",
          label: "기업명 한글 음역 분리",
          desc: "무료 번역기는 브랜드명을 뜻으로 옮긴다(High Tide → \"바닷물\").\n음역 전용 모델로 티커당 1회만 호출해 영구 저장 — 1,191종목 일괄 백필.",
          accent: "rgba(190,120,255,0.3)",
        },
      ],
      samples: [
        {
          ticker: "INO",
          nameKo: "이노비오 파마슈티컬스",
          grade: "D",
          color: "#EF4444",
          category: "유상증자",
          summary:
            "INOVIO Pharmaceuticals, 2,000만 달러 규모의 공모 유상증자 발행가 결정. 기존 주주 지분 가치 희석 불가피",
          reason: "대규모 유상증자로 인한 주주 가치 희석 및 단기 주가 하락 압력 발생",
        },
        {
          ticker: "FLYE",
          nameKo: "플라이-이 그룹",
          grade: "B",
          color: "#6B7280",
          category: "상폐위험",
          summary:
            "Fly-E Group(FLYE), 2026년 3월 31일 마감 회계연도 10-K 보고서 제출 완료에 따른 나스닥 상장 유지 규정 준수 확인 및 상장 폐지 위험 해소",
          reason: "지연되었던 정기 보고서 제출로 인한 상장 폐지 경고가 해소됨에 따른 리스크 완화",
        },
        {
          ticker: "LBGJ",
          nameKo: "리 방 인터내셔널",
          grade: "D",
          color: "#EF4444",
          category: "상폐위험",
          summary:
            "LBGJ, 1주당 200주를 합치는 1:200 비율의 역주식 분할(액면병합) 결정. 2026년 8월 3일부터 적용 예정",
          reason: "나스닥 상장 유지 요건 충족을 위한 액면병합으로, 극심한 주가 부진 및 상장폐지 위험 시사",
        },
      ],
      sampleNote:
        "위 3건은 서비스가 실제로 출력한 결과입니다. 등급은 AI 추정이므로 서비스 UI에도 면책을 함께 노출합니다.",
      codeLang: "js",
      codeBlock: `// 모델은 명시 버전으로 고정 — '-latest' 별칭은 구글이 조용히
// 다른 모델로 옮겨서, 그 모델의 소진된 한도를 그대로 물려받는다.
const MODEL = 'gemini-3.1-flash-lite';

// 일일 카운터는 PT(태평양) 자정 기준 — 구글 리셋 시각과 맞춘다
const key = 'gemini:rpd:' + todayPT();
const used = await redis.incr(key);
if (used === 1) await redis.expireat(key, nextMidnightPT());
if (used > DAILY_BUDGET) return { skip: 'RPD' };

const res = await callGemini(MODEL, {
  contents: [{ role: 'user', parts: [{ text: buildPrompt(item) }] }],
  generationConfig: {
    temperature: 0,                        // 같은 입력 -> 같은 등급
    maxOutputTokens: 500,
    responseMimeType: 'application/json',
    thinkingConfig: { thinkingBudget: 0 }, // 안 끄면 추론 토큰만 쓰고 빈 응답
  },
});

// 429를 한 덩어리로 처리하면 무한 재시도에 빠진다 — 원인별로 분기
if (res.status === 429) {
  if (isRpm(res)) return retryWithBackoff();   // 분당 한도: 1s -> 2s -> 4s
  if (isRpd(res)) return markSkipped(item);    // 일일 한도: isProcessed = -1
  return pauseQueue(ONE_HOUR);                 // 지출 상한: 큐 일시정지
}`,
    },

    /* ── 실시간 스트리밍 ── */
    realtime: {
      issue: {
        icon: "⏳",
        label: "등급을 기다리면 뉴스가 늦게 뜬다",
        desc: "AI 분석은 큐를 거치므로 수십 초가 걸린다. 분석이 끝난 뒤에야 화면에 올리면 정작 속보성이 사라지고, 사용자는 새로고침을 눌러야 새 뉴스를 본다.",
      },
      solution:
        "노출을 2단계로 쪼갰다. 수집 즉시 제목과 원문 링크를 SSE로 먼저 내보내고(1차), AI 분석이 끝나면 같은 id에 등급·요약만 patch 이벤트로 덧씌운다(2차). 사용자는 뉴스를 바로 보고, 등급 배지는 잠시 뒤 카드 위에서 채워진다.",
      flowSteps: [
        { label: "수집", text: "워커 INSERT" },
        { label: "1차 송출", text: "news / filing" },
        { label: "화면", text: "제목 · 원문링크" },
        { label: "AI 완료", text: "grade_update" },
        { label: "패치", text: "등급 · 요약" },
        { label: "유지", text: "heartbeat 30s" },
      ],
      events: [
        ["news", "새 뉴스 저장 직후", "tblNews 레코드 전체"],
        ["filing", "새 공시 저장 직후", "tblFilings 레코드 전체"],
        ["grade_update", "AI 분석 완료", "id + grade + summary 부분 패치"],
        ["heartbeat", "30초마다", "연결 유지 핑"],
      ],

      screenshots: [
        {
          src: "/media/microradar-feed.png",
          caption:
            "실시간 피드 — 좌 관심종목 · 중앙 피드(등급 컬러바 · 방향 · 카테고리) · 우 인라인 종목 상세",
          h: "470px",
        },
        {
          src: "/media/microradar-mobile.png",
          caption: "모바일 — 등급 한 줄 · 더보기 접기",
          h: "470px",
        },
      ],
      features: [
        {
          icon: "📵",
          label: "모바일 백그라운드 복귀 재연결",
          desc: "다른 앱에 갔다 오면 최신이 아니었다. 원인은 두 겹 — 포커스 복귀 시 재요청이 꺼져 있었고,\n더 근본적으로 OS가 SSE를 끊는데 브라우저 자동 재연결이 화면이 켜진 뒤에야 깨어났다.\nvisibilitychange·online 시점에 연결이 OPEN이 아니면 강제 재연결.",
          accent: "rgba(0,242,96,0.3)",
        },
        {
          icon: "🔢",
          label: "탭 배지는 발행 시각 기준",
          desc: "다른 탭에 가 있는 동안 쌓인 건수를 탭 제목에 (3)으로 표시.\n수집 시각으로 세면 2차 매체 기사(발행 6~21시간 전)까지 +1 되어 배지 숫자와 피드가 어긋난다.\n마지막으로 본 시점 이후 *발행된* 것만 센다.",
          accent: "rgba(100,160,255,0.3)",
        },
        {
          icon: "🔎",
          label: "클라이언트 필터 재검사",
          desc: "SSE 항목은 서버 필터를 우회해 피드 맨 앞에 꽂히는 경로다.\n검사가 없으면 \"등급 S만 보는 중인데 방금 수집돼 grade=null인 항목이 올라오는\" 현상이 생긴다.",
          accent: "rgba(255,160,60,0.3)",
        },
        {
          icon: "🔌",
          label: "스트림 1개로 통합",
          desc: "브라우저는 도메인당 SSE 연결을 6개로 제한한다.\n뉴스·공시를 따로 열지 않고 이벤트 타입으로 구분하는 단일 스트림으로 통합. rate limit 카운트에서도 제외.",
          accent: "rgba(190,120,255,0.3)",
        },
      ],
      codeLang: "js",
      codeBlock: `// ── 서버: 2단계 노출 ───────────────────────────
// 1차 — 수집 즉시 제목·원문 링크부터 내보낸다 (등급을 기다리지 않는다)
if (result.affectedRows) broadcast('news', row);   // INSERT IGNORE -> 실제 신규만

// 2차 — 분석이 끝나면 같은 id에 등급·요약만 덧씌운다
broadcast('grade_update', {
  id, grade, direction, summary, category, isProcessed: 1,
});

// ── 클라이언트: 모바일 복귀 재연결 ─────────────
// OS가 백그라운드에서 SSE를 끊는데, 브라우저 자동 재연결은
// 화면이 다시 켜진 뒤에야 깨어난다 -> 그 공백을 직접 메운다
const revive = () => {
  if (esRef.current?.readyState !== EventSource.OPEN) connect();
};
document.addEventListener('visibilitychange', revive);
window.addEventListener('online', revive);`,
    },

    /* ── 보안 · 운영 ── */
    security: {
      issue: {
        icon: "🌐",
        label: "인증 없는 공개 서비스",
        desc: "로그인이 없어 계정 탈취 위험은 없지만, 반대로 누구나 API를 그대로 두드릴 수 있다. 오리진 서버 노출·크롤러 남용·관리자 페이지 존재 노출이 실제 위협이 된다.",
      },
      solution:
        "지킬 대상을 자산이 아니라 가용성과 비용으로 잡았다. Cloudflare 뒤에 오리진을 완전히 숨기고, 남용 트래픽은 애플리케이션에 닿기 전에 끊고, 관리자 영역은 인증 실패가 아니라 \"존재하지 않음\"으로 응답한다.",
      features: [
        {
          icon: "🛡️",
          label: "Cloudflare IP 대역만 허용",
          desc: "iptables에서 80/443을 Cloudflare 공식 IP 대역(15개)에만 열고 그 외 직접 접근은 차단.\n오리진 IP를 알아내도 우회 접속이 되지 않는다 — 프록시 OFF 상태 운영은 금지.",
          accent: "rgba(0,242,96,0.3)",
        },
        {
          icon: "🕵️",
          label: "관리자 영역 존재 은닉",
          desc: "키가 없거나 틀리면 API는 401이 아니라 404, 페이지는 메인으로 리다이렉트 — 존재 자체를 숨긴다.\nrobots.txt에 관리자 경로를 일부러 적지 않는다. Disallow가 오히려 위치를 광고하는 꼴이라 은닉 전략과 정면 충돌한다.",
          accent: "rgba(255,80,80,0.3)",
        },
        {
          icon: "🚧",
          label: "남용 IP 자동 차단",
          desc: "10초에 100건을 넘기면(사람이 낼 수 없는 속도) 15분 밴.\nRedis 장애 시에는 fail-open — 캐시가 죽었다고 전체 트래픽을 막으면 장애가 서비스 중단이 된다.",
          accent: "rgba(255,160,60,0.3)",
        },
        {
          icon: "🚦",
          label: "2단 Rate Limit",
          desc: "10초 30건(버스트) + 1분 60건(지속) 이중 적용.\n실 클라이언트 IP는 CF-Connecting-IP 기준 — Cloudflare→Nginx 2단 프록시라 trust proxy 설정이 없으면 전원이 같은 IP로 집계된다.",
          accent: "rgba(100,160,255,0.3)",
        },
        {
          icon: "🧪",
          label: "입력 하드닝",
          desc: "모든 쿼리 파라미터 바인딩, LIKE 와일드카드(%, _) 이스케이프, limit 1~100 · offset 0 이상 클램프.\n주소창의 ?limit=-5 하나로 서버 500을 유발할 수 있던 문제를 포함해 정리.",
          accent: "rgba(190,120,255,0.3)",
        },
        {
          icon: "🔑",
          label: "비밀키 격리",
          desc: ".env는 웹 비공개 경로에 chmod 600, 웹 루트에는 빌드 산출물만 배포(소스·문서·.env 미배포).\n관리자 경로는 nginx access_log off — 쿼리스트링의 키가 접근 로그에 남지 않게.",
          accent: "rgba(0,242,96,0.25)",
        },
      ],
      items: [
        {
          label: "관리자 인증 — 고정 시간 비교",
          desc: "환경변수 키를 timingSafeEqual로 비교해 응답 시간 차이로 키를 추측하는 경로를 막는다. 과거 로그에 남았을 가능성이 있는 키는 즉시 교체(rotate).",
          accent: "rgba(255, 80, 80, 0.5)",
        },
        {
          label: "데이터 계층 외부 차단",
          desc: "MySQL·Redis 모두 127.0.0.1 바인딩 + Redis requirepass. DB 계정은 SELECT·INSERT·UPDATE·DELETE 최소 권한만 부여하고 DDL 권한 없음.",
          accent: "rgba(255, 80, 80, 0.4)",
        },
        {
          label: "외부 API 키 서버 경유 강제",
          desc: "Gemini·Finnhub 등 모든 외부 호출은 서버에서만 수행. 프론트 번들에 키가 포함되지 않으며 브라우저 네트워크 탭에 외부 API 호출이 노출되지 않는다.",
          accent: "rgba(255, 150, 50, 0.4)",
        },
      ],
    },

    stackGroups: [
      {
        category: "Frontend",
        items: [
          "React 18",
          "TypeScript",
          "Vite",
          "TanStack Query",
          "Zustand",
          "styled-components",
          "EventSource (SSE)",
          "무한스크롤 · 스켈레톤",
        ],
      },
      {
        category: "Backend",
        items: [
          "Node.js 20",
          "Express",
          "mysql2 (커넥션 풀)",
          "ioredis",
          "node-cron",
          "Helmet",
          "express-rate-limit",
          "SSE 브로드캐스터",
        ],
      },
      {
        category: "Data",
        items: [
          "MySQL 8",
          "Redis",
          "복합 인덱스",
          "오프셋 페이징",
          "INSERT IGNORE 멱등 수집",
          "isProcessed 상태 머신",
        ],
      },
      {
        category: "AI & External API",
        items: [
          "Gemini API",
          "프롬프트 설계 · JSON 강제",
          "SEC EDGAR",
          "Finnhub",
          "FINRA",
          "RSS · Atom 파싱",
          "전역 레이트 슬롯",
        ],
      },
      {
        category: "Infra & Ops",
        items: [
          "OCI 프리티어",
          "Nginx",
          "PM2",
          "Cloudflare (Origin Cert · WAF)",
          "iptables",
          "배포 스크립트",
          "Vitest",
        ],
      },
      {
        category: "SEO & 접근성",
        items: [
          "Open Graph · Twitter Card",
          "JSON-LD",
          "canonical",
          "robots · sitemap",
          "prefers-reduced-motion",
          "WCAG 확대 허용",
        ],
      },
    ],

    timeline: [
      {
        date: "2026.06",
        content: "설계 · 문서 선작성",
        detail: "아키텍처 · DB 스키마 · API 명세 · AI 파이프라인을 코드보다 먼저 문서화, 모노레포 구조 확정",
      },
      {
        date: "2026.07 초",
        content: "백엔드 MVP",
        detail: "SEC · Finnhub 수집, Gemini 분석 큐, REST API + SSE 스트림 완성",
      },
      {
        date: "2026.07.08",
        content: "첫 프로덕션 배포 (v1.0)",
        detail: "OCI 서버 구축, Cloudflare HTTPS · Origin Cert, microradar.kr 오픈",
      },
      {
        date: "2026.07.10",
        content: "분석 품질 개선",
        detail: "8-K 본문 · EX-99.1 파싱으로 제목 기반 분석 탈피, Vitest 단위 테스트 도입",
      },
      {
        date: "2026.07.15",
        content: "1차 보도자료 직수집",
        detail: "PR 와이어 3곳 추가, 공시에도 시총 게이트 적용, 단일 페이지 통합 · SEO 정비",
      },
      {
        date: "2026.07.20",
        content: "대시보드 · 종목 상세 고도화",
        detail: "3열 레이아웃, 인라인 종목 상세, 공매도 · 인도실패 차트, 관심종목 동선 정리",
      },
      {
        date: "2026.07.23",
        content: "AI 큐 정지 사고 해결",
        detail: "모델 고정 · PT 리셋 정렬 · 정지 단축으로 백로그 517건 해소, 다국어 중복 차단",
      },
      {
        date: "2026.08 — 09",
        content: "알림 · 이벤트 기능 확장",
        detail: "텔레그램 S · A 등급 즉시 알림 봇, 인수합병 · 액면병합 · 티커 변경 탭, UI 전면 개편",
      },
      {
        date: "2026.10 현재",
        content: "상시 운영",
        detail: "실시간 피드 무중단 가동, 운영 비용 $0 유지",
      },
    ],
  },
];
