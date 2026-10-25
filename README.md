# eijex-web

Company landing page for [eijex](https://www.eijex.com) — open-source research software for reproducible plant CDS design, human-supervised workflow governance, and evidence traceability.

**Live:** [www.eijex.com](https://www.eijex.com)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-yellow?style=flat&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/eijex)


## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [next-themes](https://github.com/pacocoursey/next-themes) — dark/light mode
- Markdown Research Notes with reviewed public-copy boundaries
- Deployed on [Vercel](https://vercel.com)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Research Notes

The public archive is served from `content/research-notes/` at
[`/research-notes`](https://www.eijex.com/research-notes). These Markdown files are
curated public copies; the site does not read private or internal workspace notes.

Each note records editorial status, evidence scope, and book-oriented section/order
metadata. The archive also exposes an RSS feed at `/research-notes/feed.xml`.

Before publishing changes, run:

```bash
npm run check:claims
npm run lint
npm run build
```

## Deployment

Pushed to `main` → auto-deployed to Vercel → served at `www.eijex.com`.

Naked domain (`eijex.com`) redirects to `www.eijex.com` via Cloudflare Redirect Rule.

## Related

- [FactorForge](https://factorforge.eijex.com) — CDS design engine
- [Eijex MCP](https://mcp.eijex.com) — MCP-compatible public tool access
- [AgentOS](https://github.com/eijex/eijex-agentOps) — public human-supervised workflow control-plane code
- [ValidationHub](https://github.com/eijex/eijex-validationHub) — public evidence-registry code and schemas
- Evidence Toolkit — development-stage sequence-free evidence-package contract and validator
- [eijex GitHub](https://github.com/eijex)

## Support

- [GitHub Sponsors](https://github.com/sponsors/eijex)
- [PayPal](https://paypal.me/munkyukim)

## Current source update — deployment paused

FactorForge copy distinguishes sequence-only baseline from experimental local 3DP comparison, labels watermark disabled, and describes ResearchOS/AgentOS/ValidationHub responsibilities. Application version copy follows the current FactorForge package v3.5.5; historical benchmark figures are unchanged. Local synthetic integration is software evidence, not partner approval or wet-lab performance. These edits do not change the deployed website until an authorized deployment.

Job 389 supersedes the Job 388 local-only browser routing: the FactorForge source now implements direct stateless 3DP browser/API testing with uploaded exact-match structure and reviewed positions. No ResearchOS approval or ValidationHub record is collected in this test path. It is unreleased; public MCP tools do not yet expose this execution mode.
