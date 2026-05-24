import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code2, ExternalLink, FileText, LifeBuoy, Rocket, ShieldCheck, Sparkles, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getBackendDocsBaseUrl } from '@/utils/api';

const docsBaseUrl = getBackendDocsBaseUrl();
const swaggerUrl = `${docsBaseUrl}/api-docs`;
const swaggerJsonUrl = `${docsBaseUrl}/api-docs.json`;

const sections = [
  {
    title: 'Quick Start',
    icon: Rocket,
    badge: '5 minute setup',
    summary: 'Bring up the frontend and backend with the correct env and port coordination.',
    bullets: [
      'Install dependencies in both workspaces.',
      'Configure the frontend API URL and backend database, Redis, SMTP, and origin settings.',
      'Start the backend on port 5000 and the frontend on port 5173.',
      'Verify landing page navigation, documentation links, and support submissions.',
    ],
  },
  {
    title: 'Architecture',
    icon: Code2,
    badge: 'Engineering view',
    summary: 'Understand the client, API, persistence, queueing, and docs surfaces.',
    bullets: [
      'The landing page and authenticated app shell are React routes in the frontend app.',
      'The backend is Express + MongoDB + Redis + Nodemailer with Swagger mounted at runtime.',
      'Support requests persist as tickets and are queued to internal and user mail flows.',
      'The docs center links to both the human-readable UI and the OpenAPI JSON spec.',
    ],
  },
  {
    title: 'API Reference',
    icon: TerminalSquare,
    badge: 'Live contract',
    summary: 'Inspect the interactive documentation generated from the backend source tree.',
    bullets: [
      'Swagger UI is available at `/api-docs`.',
      'The raw OpenAPI JSON is available at `/api-docs.json`.',
      'All request/response contracts shown in Swagger are sourced from route annotations and config.',
      'Use the docs when integrating clients, debugging auth issues, or validating deployments.',
    ],
  },
  {
    title: 'Deployment',
    icon: ShieldCheck,
    badge: 'Production checklist',
    summary: 'Use the same docs page for local, staging, and production verification.',
    bullets: [
      'Set `FRONTEND_URL`, `CLIENT_URL`, and `ALLOWED_ORIGINS` to the deployed frontend origin.',
      'Provide SMTP credentials and a support inbox before enabling live support submissions.',
      'Confirm MongoDB, Redis, and queue health before release.',
      'Rebuild both apps after changing routing, env vars, or Swagger wiring.',
    ],
  },
  {
    title: 'Support Operations',
    icon: LifeBuoy,
    badge: 'Runbook',
    summary: 'Explain how FAQ contact submissions become production support tickets.',
    bullets: [
      'Every submission gets a ticket number and a persisted record.',
      'Rate limiting reduces spam and provides a stable operational envelope.',
      'The support inbox receives a structured ticket summary for triage.',
      'The user receives an acknowledgment email when the request is accepted.',
    ],
  },
];

const envSnippet = `# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/english-practice
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SUPPORT_EMAIL=support@cognitospeak.com

# Frontend
VITE_API_URL=http://localhost:5000/api`;

const DocumentationCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/10 dark:text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-[8%] right-[6%] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16)_0%,transparent_65%)]" />
        <div className="absolute bottom-[10%] left-[4%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_65%)]" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400">
            <ArrowLeft className="h-4 w-4" /> Back to landing page
          </Link>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white/80 text-slate-700 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <a href={swaggerJsonUrl} target="_blank" rel="noreferrer">
                <FileText className="mr-2 h-4 w-4" /> Open OpenAPI JSON
              </a>
            </Button>
            <Button asChild className="rounded-full bg-emerald-500 text-white hover:bg-emerald-400">
              <a href={swaggerUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Open Swagger UI
              </a>
            </Button>
          </div>
        </div>

        <section className="grid gap-6 rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 lg:grid-cols-[1.4fr_0.9fr] lg:p-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300">Documentation Center</Badge>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Product documentation with the engineering depth needed to ship safely.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              This docs center covers setup, architecture, API usage, deployment, and support operations. It is intended to be the source of truth for developers working on CognitoSpeak in local, staging, and production environments.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                <a href={swaggerUrl} target="_blank" rel="noreferrer">
                  <BookOpen className="mr-2 h-4 w-4" /> Read API docs
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white/90 text-slate-700 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <a href="#setup">
                  <Sparkles className="mr-2 h-4 w-4" /> Jump to setup
                </a>
              </Button>
            </div>
          </motion.div>

          <Card className="border-slate-200/70 bg-slate-950 text-white shadow-none dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-emerald-400" /> Operational snapshot
              </CardTitle>
              <CardDescription className="text-slate-400">The most relevant implementation details at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Support path</p>
                <p className="mt-2 text-sm text-slate-200">FAQ submission -&gt; MongoDB ticket -&gt; email queue -&gt; internal inbox + user acknowledgment</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Docs endpoints</p>
                <p className="mt-2 text-sm text-slate-200">Swagger UI at <span className="font-mono text-emerald-300">/api-docs</span> and OpenAPI JSON at <span className="font-mono text-emerald-300">/api-docs.json</span></p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Primary stack</p>
                <p className="mt-2 text-sm text-slate-200">React, Vite, Express, MongoDB, Redis, Nodemailer, Swagger</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="setup" className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <CardHeader>
              <CardTitle className="text-slate-950 dark:text-white">Environment template</CardTitle>
              <CardDescription>Keep the frontend and backend aligned before testing routes or support flows.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-100 shadow-inner">
                <code>{envSnippet}</code>
              </pre>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <CardHeader>
              <CardTitle className="text-slate-950 dark:text-white">What to verify first</CardTitle>
              <CardDescription>Use this checklist before you treat the docs as authoritative in a new environment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Backend starts with Swagger mounted and the `/api-docs` UI available.',
                'Landing page documentation button resolves to this page, not a placeholder route.',
                'Support submissions create a ticket and emit both inbound and acknowledgment emails.',
                'All configured origins and URLs match your deployed frontend and API hosts.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-6">
          <div>
            <Badge className="mb-3 bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200">Detailed sections</Badge>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Implementation guide</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Card className="h-full border-slate-200/70 bg-white/85 backdrop-blur-xl transition-transform hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950/80">
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <section.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                        {section.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-slate-950 dark:text-white">{section.title}</CardTitle>
                    <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">{section.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                      {section.bullets.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-950 dark:text-white">
                <BookOpen className="h-5 w-5 text-emerald-500" /> Engineering notes
              </CardTitle>
              <CardDescription>These details are the difference between a working surface and a reliable one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
              <p>Keep the API, docs, and support flows together. If the backend URL changes, update the frontend API base, Swagger links, and deployment origin list in the same change.</p>
              <p>Support requests are not just UI events. They persist as structured records, are throttled to prevent abuse, and are delivered through a queue so the UX stays responsive under load.</p>
              <p>Production readiness here means a documented endpoint, a ticket record, an internal inbox, and a user acknowledgment. If one of those is missing, the implementation is incomplete.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-slate-950 text-white shadow-none dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Cross-links</CardTitle>
              <CardDescription className="text-slate-400">Jump to the live surfaces most closely related to documentation work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start rounded-2xl bg-white/10 text-white hover:bg-white/15">
                <a href={swaggerUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Swagger UI
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10">
                <Link to="/">
                  <Rocket className="mr-2 h-4 w-4" /> Landing page
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10">
                <Link to="/pricing">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Pricing and support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10 bg-slate-200/80 dark:bg-slate-800" />

        <section className="mb-4 flex flex-col gap-4 rounded-[2rem] border border-slate-200/70 bg-white/85 p-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">Need the live API contract?</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Open the Swagger UI or raw JSON spec to inspect the current backend surface.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-emerald-500 text-white hover:bg-emerald-400">
              <a href={swaggerUrl} target="_blank" rel="noreferrer">
                Open Swagger UI
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <a href={swaggerJsonUrl} target="_blank" rel="noreferrer">
                Open JSON spec
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DocumentationCenter;