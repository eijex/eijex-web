# eijex-web

Company landing page for [eijex](https://www.eijex.com) — open-source research software for reproducible plant CDS design, human-supervised workflow governance, and evidence traceability.

**Live:** [www.eijex.com](https://www.eijex.com)

[![Sponsor](https://img.shields.io/badge/Sponsor-EA4AAA?style=flat&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/eijex)


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
- [eijex GitHub](https://github.com/eijex)

## Support

- [GitHub Sponsors](https://github.com/sponsors/eijex)
- [PayPal](https://paypal.me/munkyukim)
