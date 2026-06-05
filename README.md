# eijex-web

Company landing page for [eijex](https://www.eijex.com) — open-source computational tools for plant synthetic biology.

**Live:** [www.eijex.com](https://www.eijex.com)

## Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [next-themes](https://github.com/pacocoursey/next-themes) — dark/light mode
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

## Deployment

Pushed to `main` → auto-deployed to Vercel → served at `www.eijex.com`.

Naked domain (`eijex.com`) redirects to `www.eijex.com` via Cloudflare Redirect Rule.

## Related

- [FactorForge](https://factorforge.eijex.com) — CDS optimization engine
- [Eijex MCP](https://mcp.eijex.com) — MCP server for AI agent access
- [eijex GitHub](https://github.com/eijex)
