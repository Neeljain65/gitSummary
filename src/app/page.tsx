import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import { GitBranch, Bot, Mic, ChevronRight, Play, Github, Shield } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Starfield + Grain overlays */}
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-60" />
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/* Nav */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="shine metallic-stroke flex size-10 items-center justify-center rounded-xl">
              <GitBranch className="size-5 text-zinc-200" />
            </div>
            <span className="text-xl font-bold metallic-text">GitSummary</span>
          </div>
          <nav className="flex items-center gap-2">
            {userId ? (
              <Link href="/dashboard">
                <Button className="chrome-button rounded-lg px-5 py-2 text-sm font-semibold">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-zinc-200 hover:bg-white/10">Sign in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="chrome-button rounded-lg px-5 py-2 text-sm font-semibold">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-zinc-200">
            <Shield className="size-4" /> Enterprise-grade AI for developers
          </div>

          <h1 className="metallic-text text-5xl font-extrabold tracking-tight sm:text-6xl">
            Build smarter with a chrome-grade AI copilot
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-zinc-300">
            Chrome-silver intelligence for your code, meetings, and commits. Ask. Analyze. Act. GitSummary blends steel-solid reliability with cutting-edge AI.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={userId ? "/dashboard" : "/sign-up"}>
              <Button className="chrome-button shine rounded-lg px-6 py-3 font-semibold">
                <Play className="mr-2 size-4" /> Start Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-lg border-white/20 bg-white/5 px-6 py-3 text-zinc-200 hover:bg-white/10">
                <Github className="mr-2 size-4" /> View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="metallic-stroke shine rounded-2xl p-6">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-white/10">
              <Bot className="size-5 text-zinc-100" />
            </div>
            <h3 className="text-lg font-semibold">AI Code Assistant</h3>
            <p className="mt-2 text-sm text-zinc-300">Ask context-aware questions about your codebase with vector-embedded precision.</p>
            <div className="mt-4 inline-flex items-center text-sm text-zinc-200">
              Learn more <ChevronRight className="ml-1 size-4" />
            </div>
          </div>

          <div className="metallic-stroke shine rounded-2xl p-6">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-white/10">
              <Mic className="size-5 text-zinc-100" />
            </div>
            <h3 className="text-lg font-semibold">Meeting Intelligence</h3>
            <p className="mt-2 text-sm text-zinc-300">Upload recordings, auto-transcribe, extract issues, and brief your team.</p>
            <div className="mt-4 inline-flex items-center text-sm text-zinc-200">
              Learn more <ChevronRight className="ml-1 size-4" />
            </div>
          </div>

          <div className="metallic-stroke shine rounded-2xl p-6 lg:col-span-1 sm:col-span-2">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-white/10">
              <GitBranch className="size-5 text-zinc-100" />
            </div>
            <h3 className="text-lg font-semibold">Commit Summaries</h3>
            <p className="mt-2 text-sm text-zinc-300">AI summarizes diffs to steel-strong insights about changes and impact.</p>
            <div className="mt-4 inline-flex items-center text-sm text-zinc-200">
              Learn more <ChevronRight className="ml-1 size-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Commit Snippets */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 text-center">
          <h2 className="metallic-text text-3xl font-bold sm:text-4xl">Live Commit Snapshots</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Steel-sharp insight into what changed and why—rendered as clean, readable diffs.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="metallic-stroke shine rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <GitBranch className="size-4" />
                <span>feat: AI streaming answer UI</span>
              </div>
              <span>by neel • 2h ago</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[12px] leading-relaxed text-zinc-200">
              <pre className="whitespace-pre-wrap">
{`diff --git a/src/app/(protected)/dashboard/ask-question.tsx b/src/app/(protected)/dashboard/ask-question.tsx
@@
 + for await (const delta of readStreamableValue(output)) {
 +   if (delta) setAnswer((prev) => prev + delta)
 + }
 + setLoading(false)
`}
              </pre>
            </div>
          </div>

          {/* Card 2 - AI Powered Code Review */}
          <div className="metallic-stroke shine rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Bot className="size-4" />
                <span className="font-medium">AI Review: safety + performance</span>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">AI</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[12px] leading-relaxed text-zinc-200">
              <pre className="whitespace-pre-wrap">
{`// Review Summary
// ✓ Streams answer incrementally
// ✓ Proper error handling added
// • Consider debouncing user input
// • Validate project.id before request

diff --git a/src/app/(protected)/dashboard/action.ts b/src/app/(protected)/dashboard/action.ts

`}
              </pre>
            </div>
          </div>
          
          {/* Card 3 - Replicate in-app Commit Design */}
          <div className="metallic-stroke shine rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="relative pl-10">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 h-full w-px bg-gray-200" />

      {/* Commit dot */}
      <Image
        src="https://avatars.githubusercontent.com/u/583231?v=4"
        alt="Commit author avatar"
        width={32}
        height={32}
        className="absolute left-1 top-2 h-8 w-8 rounded-full bg-gray-300 border-2 border-white"
      />

      {/* Commit content */}
      <div>
        {/* Header */}
        <div className="ml-2 flex items-center text-sm text-gray-600">
          
          <a href="#" className="font-medium  hover:underline">
            john_doe
          </a>
          <span className="ml-1">committed</span>
          <span className="ml-auto text-xs text-gray-400">2 hours ago</span>
        </div>

        {/* Commit title */}
        <p className="ml-2 mt-1 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
          refactor: dialog streaming
        </p>

        {/* Commit message */}
        <pre className="mt-1 text-xs   p-2 rounded text-white whitespace-pre-wrap">
  {`* Use createStreamableValue for RSC streaming
  * Dialog content scroll with max-h to prevent overflow
  * Add chrome button hover and metallic stroke panel`}
        </pre>
      </div>
    </div>
     <div className="relative pl-10">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 h-full w-px bg-gray-200" />

      {/* Commit dot */}
      <Image
        src="https://avatars.githubusercontent.com/u/583231?v=4"
        alt="Commit author avatar"
        width={32}
        height={32}
        className="absolute left-1 top-2 h-8 w-8 rounded-full bg-gray-300 border-2 border-white"
      />

      {/* Commit content */}
      <div>
        {/* Header */}
        <div className="ml-2 flex items-center text-sm text-gray-600">
          
          <a href="#" className="font-medium  hover:underline">
            john_doe
          </a>
          <span className="ml-1">committed</span>
          <span className="ml-auto text-xs text-gray-400">2 hours ago</span>
        </div>

        {/* Commit title */}
        <p className="mt-1 ml-2 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
          refactor: dialog streaming
        </p>

        {/* Commit message */}
        <pre className="mt-1 text-xs   p-2 rounded text-white whitespace-pre-wrap">
  {`* Use createStreamableValue for RSC streaming
  * Dialog content scroll with max-h to prevent overflow
  * Add chrome button hover and metallic stroke panel`}
        </pre>
      </div>
    </div>
  </div>

        </div>
      </section>
<section className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
        <div className="mb-10 text-center">
          <h2 className="metallic-text text-3xl font-bold sm:text-4xl">Ask the Codebase</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Chat with your repository like a teammate. Fast, streaming answers grounded in your code.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          {/* Chat panel */}
          <div className="metallic-stroke shine rounded-2xl p-0">
            <div className="border-b border-white/10 p-4 text-sm text-zinc-200">AI Code Assistant</div>
            <div className="space-y-3 p-4">
              {/* User message */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-1 text-xs text-zinc-300">You</div>
                <p className="text-sm text-zinc-100">How do we stream AI answers for the AskQuestion dialog?</p>
              </div>
              {/* AI message */}
              <div className="rounded-xl border border-white/10 bg-black/60 p-3">
                <div className="mb-1 text-xs text-zinc-400">GitSummary AI</div>
                <p className="text-sm text-zinc-200">
                  Use <span className="text-white/90">createStreamableValue</span> on the server and
                  <span className="text-white/90"> readStreamableValue</span> on the client. Update local state as
                  deltas arrive to render the answer progressively inside the dialog.
                </p>
                <div className="mt-3 rounded-lg border border-white/10 bg-black/70 p-3 font-mono text-[12px] text-zinc-200">
                  {`for await (const delta of readStreamableValue(output)) {
  if (delta) setAnswer((prev) => prev + delta)
}`}
                </div>
              </div>
              {/* Disabled input mock */}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 opacity-70">
                <input disabled className="w-full bg-transparent px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none" placeholder="Type your question..." />
                <Button disabled className="chrome-button rounded-md px-4 py-2 text-xs">Send</Button>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="metallic-stroke shine rounded-2xl p-6">
            <h3 className="text-lg font-semibold">What you can ask</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-white/70" /> Explain the purpose of a file or component.</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-white/70" /> How a function works and edge cases to consider.</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-white/70" /> Where a bug might originate based on recent commits.</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-white/70" /> Summarize differences between two commits.</li>
            </ul>
            <div className="mt-6">
              <Link href="/sign-up">
                <Button className="chrome-button rounded-lg px-5 py-2 text-sm font-semibold">Try it on your repo</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8 text-center">
          <h2 className="metallic-text text-3xl font-bold sm:text-4xl">FAQ</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">Quick answers about GitSummary’s chrome-grade AI.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="metallic-stroke rounded-2xl p-5">
            <h3 className="text-base font-semibold">How does the AI Q&A work?</h3>
            <p className="mt-2 text-sm text-zinc-300">We embed your code with vectors and ground the chat on those embeddings, streaming answers in real time.</p>
          </div>
          <div className="metallic-stroke rounded-2xl p-5">
            <h3 className="text-base font-semibold">Do you store my code?</h3>
            <p className="mt-2 text-sm text-zinc-300">Embeddings and summaries are stored for fast search. Raw code access follows your project’s settings.</p>
          </div>
          <div className="metallic-stroke rounded-2xl p-5">
            <h3 className="text-base font-semibold">What about meetings?</h3>
            <p className="mt-2 text-sm text-zinc-300">Upload recordings—AssemblyAI transcribes and we extract issues and summaries for quick review.</p>
          </div>
          <div className="metallic-stroke rounded-2xl p-5">
            <h3 className="text-base font-semibold">Can I try it free?</h3>
            <p className="mt-2 text-sm text-zinc-300">Yes—sign up and connect a repo to explore the dashboard, commits, and Q&A.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="metallic-stroke shine mx-auto max-w-3xl rounded-2xl p-6 text-center">
          <h2 className="metallic-text text-2xl font-bold">Connect with us</h2>
          <p className="mt-2 text-sm text-zinc-300">Questions, feedback, or partnerships? We’d love to hear from you.</p>
          <div className="mt-4">
            <a href="mailto:hello@gitsummary.app" className="chrome-button inline-block rounded-lg px-5 py-2 text-sm font-semibold">hello@gitsummary.app</a>
          </div>
        </div>
      </section>

    </main>
  );
}
