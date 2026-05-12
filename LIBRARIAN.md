# LIBRARIAN.md — Tights Survey

> **Purpose:** Per-repo structural memory. Read on Step 0.5 of every Coder/Architect dispatch. Updated after every PR.
> **Last updated:** 2026-05-12

## Repo overview

Backalast Turnout Tights Survey is a Next.js 15 app for fit-testing ballet tights. Users provide measurements (height, waist, hip); the app recommends a size, walks through a 4-step fit feedback survey, and persists responses as JSONL. Admin dashboard at `/admin/responses` shows all submissions with filtering and export.

## Feature inventory

| Feature | Status | Primary files | Notes |
|---|---|---|---|
| Survey form (4-step wizard) | Live | `src/components/Step[1-4]*.tsx`, `src/components/SurveyClient.tsx` | Steps: measurements → size recommendation → fit feedback → follow-up email |
| Size calculation engine | Live | `src/lib/sizing.ts` | 9 sizes (CM, CL, 3XS–XL); height + waist/hip percentages |
| Admin response viewer | Live | `src/app/admin/responses/AdminResponsesClient.tsx` | Server-side reads JSONL; client renders table with detail modal |
| Data export | Live | `src/app/api/admin/export/route.ts` | GET `/api/admin/export` serves JSONL download |
| Response persistence | Live | `src/app/actions.ts` | Server action writes JSONL to `/data/responses.jsonl` |
| Size guide panel | Stub | `src/components/SizeGuidePanel.tsx` | Component defined, not rendered in survey flow |

## Module graph

```
src/app/
├── page.tsx → SurveyClient.tsx (4-step orchestrator)
│   ├── Step1Measurements.tsx (cm/in toggle, height/waist/hip)
│   ├── Step2Recommendation.tsx (show recommended size, picker)
│   ├── Step3FitFeedback.tsx (7-point fit scale, verdict, comments)
│   ├── Step4Additional.tsx (email, submit)
│   └── Confirmation.tsx
├── actions.ts (submitSurvey → /data/responses.jsonl)
└── admin/responses/ (SSR reads JSONL, passes to AdminResponsesClient)
    └── api/admin/export/route.ts (JSONL stream download)

src/lib/sizing.ts (SIZE_CHART, calculateSize, HEIGHT_RANGES)
```

## Key integrations

- Storage: `/data/responses.jsonl` (local filesystem, Docker volume mount)
- No database; no external services
- Fonts: Google Fonts (Montserrat)

## Known gaps / stubs

- SizeGuidePanel.tsx: defined, not rendered
- No auth on `/admin/responses` or export endpoint (internal use only)
- `turnoutSupport`/`turnoutComments` fields shown in admin but not captured in survey forms (schema mismatch)
- No email validation on follow-up email field

## Deployment

- Docker: multi-stage build (node:20-alpine), standalone Next.js output, port 3000
- Data volume: `/data/responses.jsonl` must be mounted as persistent volume
- No env file required (no external integrations)
