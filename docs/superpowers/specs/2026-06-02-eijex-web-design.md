# www.eijex.com — Design Spec

**Date**: 2026-06-02  
**Status**: Approved  
**Brainstormed**: Yes

---

## 배경 / 문제

FactorForge v3.2.0 릴리즈 전 eijex의 공식 웹사이트가 없다. JOSS 리뷰어, 연구자, 파트너가 eijex 조직과 제품을 한눈에 파악할 수 있는 공개 랜딩 페이지가 필요하다.

---

## 목표

- eijex 조직의 신뢰성 확보 (연구소 포지셔닝)
- FactorForge 채택 유도 (pip install, docs, web app)
- 향후 제품 추가에 대비한 확장 가능한 구조

---

## 범위 (Scope)

**In scope:**
- www.eijex.com 단일 랜딩 페이지 (single-page)
- 영어 전용
- Vercel 배포 (기존 factorforge.eijex.com, mcp.eijex.com과 동일)

**Out of scope:**
- 서브페이지 (About, Blog 등 별도 페이지)
- 한국어 다국어 지원
- 미발표 제품 노출 (YieldPredict 등 비공개 제품 일체 금지)
- 인증/로그인 기능

---

## 기술 스택

| 항목 | 결정 | 이유 |
|------|------|------|
| Framework | Next.js 15 (App Router) | eijex-mcp과 스택 통일, 향후 동적 기능 확장 용이 |
| Styling | Tailwind CSS | 빠른 반응형 구현 |
| 배포 | Vercel | 기존 인프라 재사용 |
| 레포 | `eijex-web` (신규) | eijex-mcp와 분리 |

---

## 디자인 방향

**스타일**: Fresh Open-source — 밝고 생동감 있는 teal-to-green 팔레트  
**컬러 팔레트**:
- Primary: `#0d9488` (teal-600)
- Dark accent: `#134e4a` → `#14532d` (gradient, stats bar + footer)
- Light accent: `#2dd4bf` (teal-300, 숫자/로고 on dark bg)
- Background: `#f0fdfa` → `#f8fafc` → `#f0fdf4` (hero gradient)
- Text: `#0f172a` (heading), `#64748b` (body)

**로고**: eijex wordmark (teal-to-navy gradient, 제공된 logo.jpg 참조)

---

## 페이지 섹션 구성 (상단→하단)

### 1. Nav
- 좌: eijex 로고 (wordmark, gradient)
- 우: Products · About · GitHub · Get started (CTA 버튼)
- 스타일: white bg, bottom border

### 2. About Strip
- Nav 바로 아래, teal 배경 (#f0fdfa)
- 1-2줄 미션 스테이트먼트
- 예시: *"eijex builds open-source computational tools for plant synthetic biology — peer-reviewed, reproducible, and freely available to the research community."*

### 3. Hero
- Gradient background (teal → slate → green)
- Badge: `OPEN SOURCE · PLANT SYNTHETIC BIOLOGY`
- H1: "Open tools for plant synthetic biology."
- Sub: "From sequence to expression — reproducibly."
- CTA 2개: `Explore FactorForge →` (filled) + `View on GitHub` (outline)

### 4. Access Options
- "Available via" 라벨
- 뱃지 4개 (가로 나열):
  - `pip install factorforge-cds`
  - `conda install factorforge-cds` + "soon" 뱃지 (Bioconda PR #65834 머지 전)
  - `docker pull eijex/factorforge`
  - `Web App ↗` (factorforge.eijex.com)
- Bioconda 머지 후 "soon" 뱃지 제거

### 5. Stats Bar
- Dark gradient bg (`#134e4a` → `#14532d`)
- 4개 수치: mean CAI (0.76) · AA identity (100%) · CDS benchmarked (3,876) · latest release (v3.1.8)
- 수치 색상: `#2dd4bf`, 레이블: `#99f6e4`
- 버전 숫자는 릴리즈마다 업데이트 필요

### 6. Products (2열 카드)
- 섹션 타이틀: "Products" + "Tools built for the bench and the pipeline."
- **FactorForge 카드**: 이름 + `CDS Design Engine` + 설명 + pip 코드 스니펫 + Docs / GitHub 버튼
- **Eijex MCP 카드**: 이름 + `AI Agent Access` + 설명 + mcp.eijex.com + Connect / Docs 버튼
- 카드 아이콘 사각형 없음 — 텍스트 중심
- 모바일: 1열로 스택

### 7. Footer (3+1 컬럼)
- 좌: eijex 브랜드 + 1줄 설명
- Products 컬럼: FactorForge, Eijex MCP
- Resources 컬럼: Documentation, GitHub, PyPI, Zenodo/DOI
- Citation 컬럼: DOI 코드블록 (`10.5281/zenodo.20407331`)
- 하단: © 2026 eijex · MIT / AGPL-3.0
- 배경: `#134e4a` → `#14532d` gradient

---

## 반응형 (Mobile)

| 요소 | 모바일 처리 |
|------|------------|
| Nav | 햄버거 메뉴 or 축약 (Products, GitHub만) |
| Hero | 폰트 크기 축소, 버튼 세로 스택 |
| Access Options | 세로 스택 |
| Stats Bar | 2×2 그리드 |
| Products | 1열 스택 |
| Footer | 1열 스택 |

---

## 콘텐츠 유지보수 규칙

- Stats Bar 수치 (버전, 벤치마크) → 릴리즈마다 수동 업데이트 또는 GitHub API 연동
- Bioconda "soon" 뱃지 → PR #65834 머지 후 제거
- 미공개 제품(YieldPredict 등) → 절대 노출 금지

---

## Acceptance Criteria

- [ ] www.eijex.com Vercel 배포 완료
- [ ] 모바일(375px) + 데스크탑(1280px) 모두 정상 렌더링
- [ ] 모든 외부 링크 (GitHub, PyPI, Zenodo, factorforge.eijex.com, mcp.eijex.com) 작동
- [ ] Bioconda "soon" 뱃지 표시
- [ ] Lighthouse Performance ≥ 90
- [ ] 미공개 제품명 코드/텍스트 어디에도 없음
