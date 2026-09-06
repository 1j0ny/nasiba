import { Fragment, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Menu,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, useRoute, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

/* ─── Navigation ─── */

const navItems = [
  { label: 'DIAGNOSIS', id: 'diagnosis', href: '/diagnosis' },
  { label: 'REVENUE ARCHITECTURE', id: 'revenue-architecture', href: '/revenue-architecture' },
  { label: 'CASES', id: 'cases-nav', href: '/cases' },
  { label: 'ABOUT', id: 'about-nav', href: '/about' },
];

/* ─── Data ─── */

const diagnosticLenses = [
  ['01', 'Positioning', 'Who is this for, in the language of a budget owner? Where does your product sit in the category they already understand?'],
  ['02', 'Economic framing', 'What does the buyer believe this changes financially — in time, risk, throughput, retention, or margin?'],
  ['03', 'Offer architecture', 'Does the structure of plans, packaging, and commitments make the first commercial decision legible?'],
  ['04', 'Buying events', 'What event turns a capable user into a buyer? A trigger must be visible before a CTA can work.'],
  ['05', 'Upgrade logic', "Do expansion paths follow a customer's growing need, or do they feel like arbitrary feature gates?"],
  ['06', 'Messaging', 'Only after the commercial logic is clear: does the page make the right idea easy to grasp and repeat?'],
];

const outputs = [
  ['01', 'Revenue Leak', 'Where the commercial path currently breaks.'],
  ['02', 'Root Cause', 'Why the current structure creates the friction.'],
  ['03', 'Economic Logic', 'What the buyer needs to perceive as worth paying for.'],
  ['04', 'Buying Event', 'What should create a rational reason to buy now.'],
  ['05', 'Offer / Upgrade Logic', 'What should change across free, paid and expansion stages.'],
  ['06', 'Priority Map', 'What should be fixed first, second and third.'],
];

const casesData = [
  {
    slug: 'confluencemeter',
    name: 'ConfluenceMeter',
    engagement: 'Positioning · Messaging · Hero Architecture',
    diagnosticLeak: 'MECHANISM BEFORE VALUE',
    problem: 'The product explained monitoring functionality before making the trader outcome sufficiently obvious.',
    intervention: 'Repositioned the hero around faster identification of high-confluence setups, fewer charts, and decision filtering.',
    shortOutcome: 'The product moved from mechanism-led messaging toward a clearer outcome-led hero built around the trader\'s decision process.',
    shift: { from: 'Monitor symbols and timeframes', to: 'Find high-confluence setups in seconds — not after 30 charts.', label: 'POSITIONING SHIFT' },
  },
  {
    slug: 'convert-fast',
    name: 'Convert.FAST',
    engagement: 'Positioning · Hero Architecture',
    diagnosticLeak: 'CAPABILITY HIDDEN BY CATEGORY',
    problem: 'The product was more capable than the hero made it appear. The opportunity was to make the primary job-to-be-done explicit.',
    intervention: 'Moved from generic file conversion toward bulk processing, speed, explicit workflow and explicit output.',
    shortOutcome: 'The hero became more specific and aligned the product\'s strongest capability with a concrete user job.',
    shift: { from: 'File conversion', to: 'Bulk File Conversion. Fast.', label: 'PRIMARY JOB', supporting: 'Drop up to 1,000 files. Get one ZIP back.' },
  },
  {
    slug: 'creativelens',
    name: 'CreativeLens',
    engagement: 'Messaging · Economic Framing',
    diagnosticLeak: 'CAPABILITY → ECONOMIC DECISION GAP',
    problem: 'There was a gap between product capability and economic value. The product risked entering the mental category of "another AI creative analysis tool."',
    intervention: 'Shifted messaging from "AI analyzes creatives" toward understanding what deserves more budget, what needs more testing, and what should stop receiving spend.',
    shortOutcome: 'The messaging became more outcome-led and connected creative analysis more directly to the commercial decisions behind paid acquisition.',
    shift: { from: 'Analyze ad creatives', to: 'Understand what deserves more budget, more testing, or no more spend.', label: 'COMMERCIAL DECISION' },
  },
];

const caseDetails: Record<string, {
  name: string;
  context: string;
  commercialProblem: string;
  diagnosis: string;
  strategicDirection: string;
  implementation: string;
  outcome: string;
  engagementType: string;
}> = {
  confluencemeter: {
    name: 'ConfluenceMeter',
    context: 'ConfluenceMeter helps traders surface moments when trading conditions align across multiple symbols and timeframes.',
    commercialProblem: 'The product explained monitoring functionality before making the trader outcome sufficiently obvious. Visitors needed to understand when the product mattered, what type of trader it was for, how it reduced manual chart scanning, and why it was different from a signal service.',
    diagnosis: 'The mechanism was appearing before the value. The visitor first had to understand how ConfluenceMeter worked instead of immediately recognizing: \u201cThis helps me find high-confluence setups faster.\u201d There was also an ICP clarity issue. The messaging needed stronger relevance to intraday traders, disciplined traders and part-time traders.',
    strategicDirection: 'Reposition the hero around faster identification of high-confluence setups, fewer charts, decision filtering, conditions aligning, and not being a signal service.',
    implementation: 'The founder implemented the recommended positioning direction. The resulting direction centered on: Find high-confluence setups in seconds — not after 30 charts. Supporting concept: ConfluenceMeter scans symbols and timeframes to surface moments when the trader\u2019s conditions align.',
    outcome: 'The product moved from mechanism-led messaging toward a clearer outcome-led hero built around the trader\u2019s decision process.',
    engagementType: 'Positioning · Messaging · Hero Architecture',
  },
  'convert-fast': {
    name: 'Convert.FAST',
    context: 'Convert.FAST is an online file-conversion product with a strong bulk-processing workflow. Its product capabilities include high-volume file conversion.',
    commercialProblem: 'The product was capable of handling a meaningful bulk-conversion job, but the first-screen story did not communicate that capability as strongly as the product itself delivered it.',
    diagnosis: 'The product was more capable than the hero made it appear. The opportunity was to make the primary job-to-be-done explicit: fast bulk file conversion.',
    strategicDirection: 'Move from generic file conversion toward bulk processing, speed, explicit workflow and explicit output. Make the job concrete: upload many files, process them quickly, receive one usable output.',
    implementation: 'The founder implemented a hero direction based on the recommended positioning. The resulting direction centered around: Bulk File Conversion. Fast. And: Drop up to 1,000 files. Get one ZIP back.',
    outcome: 'The hero became more specific and aligned the product\u2019s strongest capability with a concrete user job.',
    engagementType: 'Positioning · Hero Architecture',
  },
  creativelens: {
    name: 'CreativeLens',
    context: 'CreativeLens is a SaaS product for analyzing advertising creatives. It helps marketers and founders reason about which creatives deserve further testing, scaling or reduced spend.',
    commercialProblem: 'The product communicated creative analysis, but the commercial value behind the analysis was less explicit. The buyer needed a stronger connection between creative analysis and testing decisions, scaling decisions, conversion performance, wasted ad spend and budget allocation.',
    diagnosis: 'There was a gap between product capability and economic value. The product risked entering the mental category: \u201canother AI creative analysis tool\u201d instead of \u201ca decision layer for performance marketers.\u201d',
    strategicDirection: 'Shift messaging away from \u201CAI analyzes creatives\u201D toward: understand what deserves more budget, what needs more testing, and what should stop receiving spend. Strengthen relevance to performance marketers, founders and paid acquisition teams.',
    implementation: 'The founder implemented the recommended messaging direction.',
    outcome: 'The messaging became more outcome-led and connected creative analysis more directly to the commercial decisions behind paid acquisition.',
    engagementType: 'Messaging · Economic Framing',
  },
};

/* ─── Homepage FAQ (reduced to genuine buying objections) ─── */

const homepageFaqs = [
  ['What does asynchronous mean?', 'No recurring meetings or calls. The engagement is conducted through the product, website, pricing, onboarding and business context you provide, with the diagnosis delivered asynchronously.'],
  ['Do I need to book a call?', 'No. There is no call required to start. The work begins with a focused intake and the materials listed in What I Need. Any clarification happens asynchronously.'],
  ['What do you need from us to start?', 'A short intake, product access or a guided walkthrough, your current pricing and plan logic, and the seven inputs listed on the diagnosis page. The requests stay focused and the work stays asynchronous.'],
  ['What happens after the diagnosis?', 'You can use the map internally, or choose the separate Revenue Architecture engagement if the diagnosis reveals a broader architectural problem. The deeper engagement is not required for a single leak.'],
  ['Do you work on retainers?', 'No. The work is deliberately focused and asynchronous.'],
];

/* ─── /diagnosis FAQ (detailed) ─── */

const diagnosisFaqs = [
  ['What is the Revenue Leak Diagnosis?', 'A fixed-scope, asynchronous inspection of the commercial gaps between product interest and payment — from positioning and economic value to buying events, upgrade logic, and messaging. It produces a clear commercial map, not a generic audit or a pile of copy suggestions.'],
  ['What do I receive?', 'You receive the six-part diagnosis: Revenue Leak, Root Cause, Economic Logic, Buying Event, Offer / Upgrade Logic, and Priority Map. The delivery includes an annotated revenue path, a written diagnosis, prioritized recommendations, and an asynchronous walkthrough of the thinking.'],
  ['How long does the diagnosis take?', 'The Revenue Leak Diagnosis is delivered in 3–4 days, asynchronously. The broader Revenue Architecture engagement is 2 weeks, asynchronous.'],
  ['How much does each offer cost?', 'The Revenue Leak Diagnosis is $1,000. Revenue Architecture is $10,000 for broader architectural problems that require rebuilding the commercial system around the leak.'],
  ['Is this a copywriting project?', 'No. Copy is one possible expression of the diagnosis, not the deliverable. The work maps the commercial system underneath the words: who buys, why now, what they value, how they enter, and where expansion becomes credible.'],
  ['Who is this for?', 'B2B and AI SaaS companies with existing users, traffic or demand and a monetization problem worth solving.'],
];

/* ─── Helpers ─── */

function scrollToSection(id: string, onDone?: () => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  onDone?.();
}

/* ─── IntersectionObserver-based scroll reveal hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* Reveal wrapper: wraps children with scroll-triggered fade-up */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`${visible ? 'sr-only-init sr-visible' : 'sr-only-init'} ${className}`} style={{ transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  );
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] ${dark ? 'text-[#e96a3a]' : 'text-[#e15b2e]'}`} style={{ fontFamily: 'var(--app-font-sans)' }}>
      <span className="h-px w-8 bg-current" />
      <span>{children}</span>
    </div>
  );
}

/* ─── Shared Footer ─── */

function SiteFooter({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const dark = variant === 'dark';
  const textMain = dark ? 'text-[#f5f0e7]' : 'text-[#202536]';
  const textMuted = dark ? 'text-[#f5f0e7]/55' : 'text-[#6c6b68]';
  const textMutedStrong = dark ? 'text-[#f5f0e7]/70' : 'text-[#55575c]';
  const border = dark ? 'border-[#f5f0e7]/20' : 'border-[#cfc7b7]';
  const accentBorder = dark ? 'border-[#e96a3a]' : 'border-[#e15b2e]';
  const linkHover = dark ? 'hover:text-[#e96a3a] hover:border-[#e96a3a]' : 'hover:text-[#e15b2e] hover:border-[#e15b2e]';

  return (
    <footer className={`mt-20 border-t ${border} pt-10`}>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className={`flex h-7 w-7 items-center justify-center border ${accentBorder} font-mono-ui text-[11px] font-bold ${dark ? 'text-[#e96a3a]' : 'text-[#e15b2e]'}`}>N</span>
            <span className={`font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] ${textMain}`}>NASIBA</span>
          </div>
          <p className={`mt-4 text-[12px] tracking-[.03em] ${textMutedStrong}`} style={{ fontFamily: 'var(--app-font-sans)' }}>Revenue Architecture for SaaS.</p>
        </div>

        {/* Navigation */}
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[.1em] ${textMuted} mb-4`} style={{ fontFamily: 'var(--app-font-sans)' }}>Navigation</p>
          <ul className="space-y-2.5">
            {[
              { label: 'Diagnosis', href: '/diagnosis' },
              { label: 'Revenue Architecture', href: '/revenue-architecture' },
              { label: 'Cases', href: '/cases' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} className={`text-[12px] tracking-[.03em] ${textMutedStrong} border-b border-transparent pb-0.5 transition-colors ${linkHover}`} style={{ fontFamily: 'var(--app-font-sans)' }}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[.1em] ${textMuted} mb-4`} style={{ fontFamily: 'var(--app-font-sans)' }}>Contact</p>
          <a href="mailto:paul@nasiba.co" className={`text-[12px] tracking-[.03em] ${textMutedStrong} border-b border-transparent pb-0.5 transition-colors ${linkHover}`} style={{ fontFamily: 'var(--app-font-sans)' }}>paul@nasiba.co</a>
        </div>

        {/* Founder */}
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[.1em] ${textMuted} mb-4`} style={{ fontFamily: 'var(--app-font-sans)' }}>Founder</p>
          <p className={`text-[12px] tracking-[.03em] ${textMutedStrong}`} style={{ fontFamily: 'var(--app-font-sans)' }}>Paul — Founder &amp; Principal</p>
          <div className="mt-3 space-y-2">
            <p>
              <a href="https://www.linkedin.com/in/paul-coll/" target="_blank" rel="noopener noreferrer" className={`text-[12px] tracking-[.03em] ${textMutedStrong} border-b border-transparent pb-0.5 transition-colors ${linkHover}`} style={{ fontFamily: 'var(--app-font-sans)' }}>LinkedIn →</a>
            </p>
            <p>
              <a href="https://x.com/1Paul_coll" target="_blank" rel="noopener noreferrer" className={`text-[12px] tracking-[.03em] ${textMutedStrong} border-b border-transparent pb-0.5 transition-colors ${linkHover}`} style={{ fontFamily: 'var(--app-font-sans)' }}>X / Twitter →</a>
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-10 flex flex-col justify-between gap-4 border-t ${border} pt-6 sm:flex-row sm:items-center`}>
        <div className={`text-[11px] tracking-[.06em] ${textMuted}`} style={{ fontFamily: 'var(--app-font-sans)' }}>&copy; {new Date().getFullYear()} Nasiba</div>
        <div className="flex gap-5">
          <a href="/privacy" className={`text-[11px] tracking-[.06em] ${textMuted} border-b border-transparent pb-0.5 transition-colors duration-200 ${linkHover}`} style={{ fontFamily: 'var(--app-font-sans)' }}>Privacy</a>
          <a href="/terms" className={`text-[11px] tracking-[.06em] ${textMuted} border-b border-transparent pb-0.5 transition-colors duration-200 ${linkHover}`} style={{ fontFamily: 'var(--app-font-sans)' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

/* ─── Header ─── */

function Header({ onNavigate, variant = 'dark' }: { onNavigate: (id: string) => void; variant?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false);
  const dark = variant === 'dark';
  const textMain = dark ? 'text-[#f5f0e7]' : 'text-[#202536]';
  const textMuted = dark ? 'text-[#f5f0e7]/65' : 'text-[#202536]/65';
  const border = dark ? 'border-[#f5f0e7]/20' : 'border-[#cfc7b7]';
  const accentBorder = dark ? 'border-[#e96a3a]' : 'border-[#e15b2e]';
  const accentText = dark ? 'text-[#e96a3a]' : 'text-[#e15b2e]';
  const bg = dark ? 'bg-[#202536]' : 'bg-[#f5f0e7]';
  const btnBg = dark ? 'bg-[#e96a3a]' : 'bg-[#e15b2e]';
  const btnText = dark ? 'text-[#202536]' : 'text-[#f5f0e7]';
  const hoverBg = dark ? 'hover:bg-[#f18a61]' : 'hover:bg-[#c94a22]';

  const handleNavigation = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header className={`absolute left-0 right-0 top-0 z-40 px-5 py-5 ${textMain} sm:px-8 lg:px-12`}>
      <div className={`mx-auto flex max-w-[1180px] items-center justify-between border-b ${border} pb-5`}>
        <a href="/" className={`group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 ${accentBorder}`} aria-label="NASIBA, back to top">
          <span className={`flex h-7 w-7 items-center justify-center border ${accentBorder} font-mono-ui text-[11px] font-bold ${accentText}`}>N</span>
          <span>
            <span className={`block font-mono-ui text-[12px] font-bold uppercase tracking-[0.16em] transition-colors ${accentText}`}>NASIBA</span>
            <span className={`mt-0.5 block text-[10px] tracking-[0.04em] ${dark ? 'text-[#f5f0e7]/60' : 'text-[#202536]/60'}`} style={{ fontFamily: 'var(--app-font-sans)' }}>Revenue architecture for SaaS</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 xl:gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} onClick={(e) => { if (item.href.startsWith('/#')) { e.preventDefault(); scrollToSection(item.id); } }} className={`text-[12px] font-medium uppercase tracking-[0.08em] ${textMuted} transition-colors ${dark ? 'hover:text-[#f5f0e7]' : 'hover:text-[#202536]'} focus-visible:outline-none focus-visible:ring-2 ${accentBorder} focus-visible:ring-offset-2 ${dark ? 'focus-visible:ring-offset-[#202536]' : 'focus-visible:ring-offset-[#f5f0e7]'}`} style={{ fontFamily: 'var(--app-font-sans)' }}>
              {item.label}
            </a>
          ))}
          <a href="/start" className={`flex items-center gap-2 ${btnBg} px-5 py-2.5 radius-btn text-[11px] font-bold uppercase tracking-[0.1em] ${btnText} transition-all duration-[160ms] ${hoverBg} hover-lift focus-visible:outline-none focus-visible:ring-2 ${dark ? 'focus-visible:ring-[#f5f0e7]' : 'focus-visible:ring-[#202536]'}`} style={{ fontFamily: 'var(--app-font-sans)' }}>
            START DIAGNOSIS <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </nav>
        <button type="button" className={`inline-flex h-10 w-10 items-center justify-center border ${dark ? 'border-[#f5f0e7]/25' : 'border-[#202536]/25'} ${textMain} md:hidden`} onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X size={19} /> : <Menu size={19} />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className={`${border} border-b ${bg} px-2 py-4 md:hidden`} aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} onClick={(e) => { if (item.href.startsWith('/#')) { e.preventDefault(); scrollToSection(item.id); } }} className={`flex w-full items-center justify-between border-b ${dark ? 'border-[#f5f0e7]/10' : 'border-[#cfc7b7]'} px-3 py-4 text-left text-[12px] font-medium uppercase tracking-[0.08em] ${dark ? 'text-[#f5f0e7]/75' : 'text-[#202536]/75'} last:border-0 focus-visible:outline-none focus-visible:ring-2 ${accentBorder}`} style={{ fontFamily: 'var(--app-font-sans)' }}>
              {item.label}
              <ArrowDownRight size={14} className={accentText} />
            </a>
          ))}
          <a href="/start" className={`mt-3 flex w-full items-center justify-between ${btnBg} px-3 py-4 radius-btn text-[11px] font-bold uppercase tracking-[0.1em] ${btnText} transition-all duration-[160ms]`} style={{ fontFamily: 'var(--app-font-sans)' }}>
            START DIAGNOSIS <ArrowRight size={14} />
          </a>
        </nav>
      )}
    </header>
  );
}

/* ─── Home Sections ─── */

function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={onNavigate} />
      <div className="mx-auto grid min-h-[560px] max-w-[1180px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-36 sm:px-8 lg:grid-cols-[55%_45%] lg:gap-12 lg:px-12 lg:pb-20 lg:pt-40">
        {/* LEFT: Hero copy — anchored to left column, staged entrance */}
        <div>
          <div className="hero-eyebrow mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <span className="h-px w-8 bg-current" />
            <span>Commercial diagnosis</span>
          </div>
          <h1 className="font-display text-[clamp(3rem,7vw,6.2rem)] leading-[.88] tracking-[-0.07em] text-[#f5f0e7]">
            <span className="hero-headline inline">Find where your SaaS is </span><span className="hero-headline-orange inline text-[#e96a3a]">losing revenue.</span>
          </h1>
          <p className="hero-body mt-7 max-w-[520px] text-balance text-[17px] leading-[1.55] text-[#f5f0e7]/72 sm:text-[18px]">
            An asynchronous diagnosis of the commercial gaps between product interest and payment — from positioning and economic value to buying events, upgrade logic and messaging.
          </p>
          <div className="hero-cta mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 radius-btn text-[11px] font-bold uppercase tracking-[0.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" style={{ fontFamily: 'var(--app-font-sans)' }}>
              START THE REVENUE LEAK DIAGNOSIS <ArrowRight size={16} className="transition-transform duration-[160ms] group-hover:translate-x-1.5" />
            </a>
          </div>
          <div className="hero-meta mt-6 text-[12px] font-semibold uppercase tracking-[.12em] text-[#f5f0e7]/82" style={{ fontFamily: 'var(--app-font-sans)' }}>$1,000 · 3–4 DAYS · ASYNCHRONOUS</div>
          <p className="hero-sub mt-4 max-w-[480px] text-[15px] font-medium leading-[1.5] text-[#f5f0e7]/85">For SaaS with users and demand — but weak paid conversion.</p>
        </div>

        {/* RIGHT: Diagnostic composition — one coherent diagram, staged animation */}
        <div className="flex flex-col justify-end lg:pb-2">
          <div className="border-t border-[#f5f0e7]/25 pt-5">
            {/* Top annotation: WHERE INTEREST STOPS */}
            <div className="hero-graph-annotation mb-5 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[.1em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Where interest stops</span>
              <span className="text-[#e96a3a] text-[16px]">→</span>
            </div>

            {/* Middle: THE LEAK marker + note — integrated as one unit */}
            <div className="mb-6 flex items-start gap-5">
              <div className="hero-graph-leak flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>the leak</span>
                <div className="mt-2 w-px h-5 bg-[#e96a3a]" />
              </div>
              <p className="hero-graph-note max-w-[180px] text-[13px] leading-[1.45] text-[#f5f0e7]/65">No more guessing which page, plan, or CTA to rewrite first.</p>
            </div>

            {/* Bottom: bar path from DEMAND to PAYMENT — bars animate sequentially */}
            <div className="hero-graph-bars flex h-[120px] items-end justify-between gap-2" style={{ transformOrigin: 'bottom' }}>
              {[82, 63, 49, 36, 25, 17].map((height, index) => (
                <div key={height} className="relative flex h-full flex-1 items-end" style={{ animationDelay: `${.95 + index * .08}s` }}>
                  <div className={`w-full ${index === 3 ? 'bg-[#e96a3a]' : 'bg-[#f5f0e7]/22'}`} style={{ height: `${height}%`, transformOrigin: 'bottom' }} />
                </div>
              ))}
            </div>
            <div className="hero-graph-labels mt-3 flex justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[.1em] text-[#f5f0e7]/45" style={{ fontFamily: 'var(--app-font-sans)' }}>Demand</span>
              <span className="text-[10px] font-medium uppercase tracking-[.1em] text-[#f5f0e7]/45" style={{ fontFamily: 'var(--app-font-sans)' }}>Payment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Revenue Path — continuous diagnostic map, anchored annotations */
function RevenuePathMap() {
  const steps = [
    { name: 'INTEREST', active: true },
    { name: 'UNDERSTANDING', active: true },
    { name: 'ECONOMIC VALUE', active: true, annotation: '"Buyer understands the product but cannot justify the price."' },
    { name: 'BUYING EVENT', active: false, annotation: '"Free solves the core job. Paid only adds usage."' },
    { name: 'PAYMENT', active: true, annotation: '"Enterprise value exists, but the product is still framed as a utility."' },
    { name: 'EXPANSION', active: true },
  ];

  return (
    <section id="path" className="bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <div className="max-w-[800px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>The Revenue Path</p>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[.9] tracking-[-.07em]">Interest is not revenue.</h2>
            <p className="mt-6 max-w-[600px] text-[17px] leading-[1.6] text-[#f5f0e7]/70">
              Most monetization problems aren&apos;t copy problems. Revenue moves through a sequence of commercial transitions. When one breaks, demand stops becoming payment.
            </p>
          </div>
        </Reveal>

        {/* Path diagram with inline anchored annotations + drawing animation */}
        <div className="mt-16 border-t border-[#f5f0e7]/15 pt-14">
          <div className="relative">
            {/* Continuous horizontal line — draws left to right */}
            <div className="path-line hidden lg:block absolute top-[15px] left-0 right-0 h-px bg-[#f5f0e7]/20" />
            {/* Break at Buying Event — draws after main line */}
            <div className="path-break hidden lg:block absolute top-[15px] left-[48%] w-[8%] h-px" style={{ backgroundImage: 'repeating-linear-gradient(to right, #e96a3a 0px, #e96a3a 4px, transparent 4px, transparent 10px)' }} />

            {/* Stages + inline annotations grid */}
            <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-4">
              {steps.map((step) => {
                const isBreak = !step.active;
                const hasAnnotation = !!step.annotation;
                return (
                  <div key={step.name} className="flex flex-col">
                    {/* Stage anchor */}
                    <div className="path-stage flex flex-col items-center lg:items-center">
                      <div className={`relative flex h-[30px] w-[30px] items-center justify-center ${isBreak ? 'border-2 border-[#e96a3a] border-dashed' : 'border border-[#e96a3a]/70'} radius-block bg-[#202536] z-10`}>
                        {isBreak && <span className="text-[#e96a3a] text-[11px] font-bold">✗</span>}
                        {!isBreak && <div className="h-2 w-2 rounded-full bg-[#e96a3a]" />}
                      </div>
                      <span className={`mt-3 text-[10px] font-medium uppercase tracking-[.08em] text-center ${isBreak ? 'text-[#e96a3a] font-semibold' : 'text-[#f5f0e7]/65'}`} style={{ fontFamily: 'var(--app-font-sans)' }}>{step.name}</span>
                    </div>
                    {/* Inline annotation — anchored below its stage, staggered */}
                    {hasAnnotation && (
                      <div className="path-annotation mt-4 border-l-2 border-[#e96a3a] pl-4 pr-2">
                        <p className="font-display text-[15px] leading-[1.4] tracking-[-.02em] text-[#f5f0e7]/70">{step.annotation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Leak examples — controlled asymmetry within shared grid */
function RevenueLeakExamples() {
  return (
    <section className="bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <div className="max-w-[900px]">
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-[.9] tracking-[-.07em] text-[#202536]">
              What a revenue leak actually looks like.
            </h2>
          </div>
        </Reveal>

        {/* Example 1 — marker + dominant center-left observation */}
        <Reveal delay={.1}>
          <div className="mt-16 border-t border-[#202536]/15 pt-12 pb-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[100px_1fr_300px] lg:gap-8">
              <div>
                <span className="font-mono-ui text-[11px] text-[#e15b2e]">01</span>
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[.1em] text-[#e15b2e]" style={{ fontFamily: 'var(--app-font-sans)' }}>Buying Event</p>
              </div>
              <div>
                <h3 className="font-display text-[26px] leading-[1.1] tracking-[-.03em] text-[#202536]">FREE SOLVES THE CORE JOB.</h3>
                <p className="mt-4 text-[16px] leading-[1.55] text-[#44464c]">The paid plan adds more usage, but no materially different outcome.</p>
              </div>
              <div className="border-l-2 border-[#e15b2e] pl-6">
                <p className="text-[10px] font-medium uppercase tracking-[.1em] text-[#e15b2e]" style={{ fontFamily: 'var(--app-font-sans)' }}>Commercial consequence</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#44464c]">The user likes the product but has no economic reason to upgrade.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Example 2 — marker + observation left, consequence right */}
        <Reveal delay={.15}>
          <div className="border-t border-[#202536]/15 py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[100px_1fr_300px] lg:gap-8">
              <div>
                <span className="font-mono-ui text-[11px] text-[#e15b2e]">02</span>
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[.1em] text-[#e15b2e]" style={{ fontFamily: 'var(--app-font-sans)' }}>Economic Value</p>
              </div>
              <div>
                <h3 className="font-display text-[26px] leading-[1.1] tracking-[-.03em] text-[#202536]">THE ENTERPRISE VALUE IS REAL.</h3>
                <p className="mt-4 text-[16px] leading-[1.55] text-[#44464c]">The homepage still sells the product as a developer utility.</p>
              </div>
              <div className="border-l-2 border-[#e15b2e] pl-6">
                <p className="text-[10px] font-medium uppercase tracking-[.1em] text-[#e15b2e]" style={{ fontFamily: 'var(--app-font-sans)' }}>Commercial consequence</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#44464c]">High-value buyers compare it against cheap tools instead of infrastructure or headcount.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Example 3 — marker + wider observation, softer consequence */}
        <Reveal delay={.2}>
          <div className="border-t border-[#202536]/15 pt-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[100px_1fr_300px] lg:gap-8">
              <div>
                <span className="font-mono-ui text-[11px] text-[#e15b2e]">03</span>
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[.1em] text-[#e15b2e]" style={{ fontFamily: 'var(--app-font-sans)' }}>Expansion</p>
              </div>
              <div>
                <h3 className="font-display text-[26px] leading-[1.1] tracking-[-.03em] text-[#202536]">THE BUYING SIGNAL ALREADY EXISTS.</h3>
                <p className="mt-4 text-[16px] leading-[1.55] text-[#44464c]">The customer becomes operationally overwhelmed, but the product never surfaces the next offer.</p>
                <p className="mt-5 font-display text-[17px] leading-[1.4] tracking-[-.02em] text-[#202536]/50 italic">Expansion only happens after the customer asks.</p>
              </div>
              <div className="border-l-2 border-[#e15b2e]/40 pl-6">
                <p className="text-[10px] font-medium uppercase tracking-[.1em] text-[#e15b2e]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Commercial consequence</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#44464c]/70">Growth stalls silently. No expansion path is surfaced.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Consolidated Diagnosis + Offer — one primary homepage section */
function Diagnosis() {
  return (
    <section id="diagnosis" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div>
            <Reveal>
              <h2 className="max-w-[760px] font-display text-[clamp(2.8rem,5vw,5rem)] leading-[.88] tracking-[-.08em] text-[#202536]">
                One diagnosis.<br /><em className="text-[#e15b2e]">A clear commercial map.</em>
              </h2>
              <p className="mt-8 max-w-[540px] text-[17px] leading-[1.55] text-[#44464c]">
                A focused async commercial diagnosis of where the path from interest to payment is breaking — covering positioning, economic framing, offer and upgrade logic, buying events, pricing logic, and messaging implications.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {outputs.map(([number, title, body], idx) => (
                <Reveal key={number} delay={.1 + idx * .06}>
                  <article className="border-t border-[#cfc7b7] pt-5 pb-4 transition-colors duration-200">
                    <span className="font-mono-ui text-[10px] text-[#e15b2e]">{number}</span>
                    <h3 className="mt-5 font-display text-[22px] leading-[.95] tracking-[-.04em] text-[#202536]">{title}</h3>
                    <p className="mt-3 text-[15px] leading-[1.55] text-[#44464c]">{body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={.2}>
          <div id="offer" className="bg-[#202536] p-8 text-[#f5f0e7] radius-panel sm:p-10 transition-all duration-200 hover:shadow-lg hover-proximity">
            <div className="flex items-start justify-between border-b border-[#f5f0e7]/20 pb-8">
              <span className="text-[11px] font-medium uppercase tracking-[.12em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>The working room</span>
              <span className="font-display text-[52px] leading-none tracking-[-.06em]">$1,000</span>
            </div>
            <p className="mt-8 text-[17px] leading-[1.5] text-[#f5f0e7]/80">A fixed-scope inspection that identifies where revenue is leaking and gives you a clear commercial map for what to do next.</p>
            <ul className="mt-8 space-y-4 text-[15px] leading-[1.45] text-[#f5f0e7]/75 list-editorial">
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Positioning diagnosis</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Economic framing analysis</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Offer / upgrade architecture</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Buying-event analysis</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Priority recommendations</li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>
              <span>3–4 DAYS</span>
              <span>ASYNCHRONOUS</span>
              <span>FIXED SCOPE</span>
            </div>
            <a href="/start" className="mt-8 flex w-full items-center justify-between bg-[#e96a3a] px-5 py-4 radius-btn text-[11px] font-bold uppercase tracking-[.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" style={{ fontFamily: 'var(--app-font-sans)' }}>
              START THE DIAGNOSIS <ArrowRight size={16} />
            </a>
            <a href="/sample-diagnosis" className="mt-4 inline-flex items-center gap-2 border-b border-[#f5f0e7]/25 pb-0.5 text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/65 transition-colors duration-200 hover:text-[#e96a3a] hover:border-[#e96a3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
              VIEW A SAMPLE DIAGNOSIS <ArrowRight size={12} />
            </a>
            <p className="mt-8 border-t border-[#f5f0e7]/15 pt-5 text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/45" style={{ fontFamily: 'var(--app-font-sans)' }}>No retainer. No recurring commitment. No ongoing consulting.</p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Client Work — consistent column grid, transformation as hero */
function CasesTeaser() {
  return (
    <section id="client-work" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <div className="max-w-[700px]">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.2rem)] leading-[.88] tracking-[-.07em] text-[#202536]">Client work.</h2>
            <p className="mt-5 text-[17px] leading-[1.6] text-[#44464c]">Selected commercial work across SaaS products.</p>
          </div>
        </Reveal>

        {/* Consistent 3-zone grid: product / old→new transition / view */}
        <div className="mt-10 space-y-0">
          {casesData.map((c, idx) => (
            <Reveal key={c.slug} delay={.1 + idx * .08}>
            <div className="border-t border-[#cfc7b7]">
              <a href={`/cases/${c.slug}`} className="group grid grid-cols-1 gap-4 py-8 transition-all duration-[200ms] hover:bg-[#f5f0e7]/50 hover:translate-y-[-1px] sm:grid-cols-[200px_1fr_auto] sm:gap-8 sm:items-center sm:py-9 px-0 radius-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e15b2e]">
                {/* Zone 1: Product name + engagement */}
                <div>
                  <h3 className="font-display text-[20px] font-semibold tracking-[-.03em] text-[#202536] group-hover:text-[#e15b2e] transition-colors duration-200">{c.name}</h3>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[.08em] text-[#6c6b68]" style={{ fontFamily: 'var(--app-font-sans)' }}>{c.engagement}</p>
                  <p className="mt-3 text-[9px] font-semibold uppercase tracking-[.12em] text-[#e15b2e]/80" style={{ fontFamily: 'var(--app-font-sans)' }}>
                    DIAGNOSTIC LEAK
                  </p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#202536]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>
                    {c.diagnosticLeak}
                  </p>
                </div>

                {/* Zone 2: Old frame → New frame transition */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex-1 transition-all duration-200 group-hover:opacity-60">
                    <p className="text-[10px] font-medium uppercase tracking-[.1em] text-[#6c6b68]" style={{ fontFamily: 'var(--app-font-sans)' }}>{c.shift.label}</p>
                    <p className="mt-1.5 font-display text-[15px] leading-[1.4] tracking-[-.01em] text-[#202536]/40 line-through decoration-[#e15b2e]/20">{c.shift.from}</p>
                  </div>
                  <span className="hidden sm:block font-display text-[18px] text-[#e15b2e] transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                  <div className="flex-1 transition-all duration-200 group-hover:opacity-100">
                    <p className="font-display text-[16px] leading-[1.35] tracking-[-.02em] text-[#202536] font-medium">{c.shift.to}</p>
                    {c.shift.supporting && <p className="mt-1 text-[10px] font-medium uppercase tracking-[.08em] text-[#6c6b68]" style={{ fontFamily: 'var(--app-font-sans)' }}>{c.shift.supporting}</p>}
                  </div>
                </div>

                {/* Zone 3: View affordance */}
                <span className="hidden sm:flex items-center text-[10px] font-semibold uppercase tracking-[.1em] text-[#e15b2e] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" style={{ fontFamily: 'var(--app-font-sans)' }}>VIEW CASE →</span>
              </a>
            </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={.3}>
          <div className="mt-8">
            <a href="/cases" className="inline-flex items-center gap-3 border-b-2 border-[#e15b2e] pb-1.5 text-[12px] font-semibold uppercase tracking-[.1em] text-[#e15b2e] transition-colors duration-200 hover:text-[#c94a22]" style={{ fontFamily: 'var(--app-font-sans)' }}>VIEW ALL CASES →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Revenue Architecture — deeper engagement */
function Engagement() {
  return (
    <section id="engagement" className="scroll-mt-10 bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div className="lg:flex lg:flex-col lg:justify-center">
            <Reveal>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>The deeper engagement</p>
              <h2 className="mt-6 max-w-[480px] font-display text-[clamp(2.6rem,4.5vw,4.5rem)] leading-[.88] tracking-[-.07em]">Diagnose.<br /><em className="text-[#e96a3a]">Then rebuild.</em></h2>
              <p className="mt-8 max-w-[360px] text-[16px] leading-[1.6] text-[#f5f0e7]/70">Two steps, only when the problem calls for both.</p>
            </Reveal>
          </div>
          <div>
            <Reveal delay={.15}>
            <div className="border-t border-[#f5f0e7]/20 py-8">
              <div className="flex items-start gap-5">
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">01</span>
                <div>
                  <h3 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] leading-none tracking-[-.05em]">DIAGNOSE</h3>
                  <p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/72">Find the leak, its root cause, and the priority map. This is enough when one commercial transition is unclear.</p>
                </div>
              </div>
            </div>
            </Reveal>
            <Reveal delay={.25}>
            <div className="border-y border-[#f5f0e7]/20 py-8">
              <div className="flex items-start gap-5">
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">02</span>
                <div>
                  <h3 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] leading-none tracking-[-.05em]">REBUILD</h3>
                  <p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/72">For products where the diagnosis reveals a broader problem in how positioning, economics, offers, buying events and upgrades work together.</p>
                  <div className="mt-5 flex items-baseline gap-5 text-[11px] font-medium uppercase tracking-[.12em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
                    <span>$10,000</span>
                    <span>2 weeks · Asynchronous</span>
                  </div>
                  <ul className="mt-6 grid max-w-[570px] grid-cols-1 gap-x-6 gap-y-3 border-t border-[#f5f0e7]/15 pt-5 text-[11px] font-medium uppercase leading-[1.5] tracking-[.08em] text-[#f5f0e7]/65 sm:grid-cols-2 list-editorial" style={{ fontFamily: 'var(--app-font-sans)' }}>
                    <li className="flex items-start gap-2.5"><span className="text-[#e96a3a] mt-0.5 shrink-0">—</span> Positioning audit</li>
                    <li className="flex items-start gap-2.5"><span className="text-[#e96a3a] mt-0.5 shrink-0">—</span> Economic framing</li>
                    <li className="flex items-start gap-2.5"><span className="text-[#e96a3a] mt-0.5 shrink-0">—</span> Offer ladder restructuring</li>
                    <li className="flex items-start gap-2.5"><span className="text-[#e96a3a] mt-0.5 shrink-0">—</span> Buying-event design</li>
                    <li className="flex items-start gap-2.5"><span className="text-[#e96a3a] mt-0.5 shrink-0">—</span> Pricing &amp; upgrade logic</li>
                    <li className="flex items-start gap-2.5"><span className="text-[#e96a3a] mt-0.5 shrink-0">—</span> Homepage &amp; messaging implementation guidance</li>
                  </ul>
                </div>
              </div>
            </div>
            </Reveal>
            <Reveal delay={.3}>
            <p className="mt-9 max-w-[580px] font-display text-[clamp(1.4rem,2.3vw,1.7rem)] leading-[1.08] tracking-[-.03em] text-[#f5f0e7]">The diagnosis identifies the leak. Revenue Architecture rebuilds the system around it.</p>
            <p className="mt-5 max-w-[530px] text-[15px] leading-[1.55] text-[#f5f0e7]/68">Not every diagnosis requires deeper work. The second engagement exists when the commercial problem is architectural rather than isolated.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Fit — compact, MONETIZATION spelling */
function WhoThisIsFor() {
  const goodFit = [
    'Existing users and active traffic',
    'Unclear conversion path from interest to payment',
    'Monetization friction at pricing, upgrade or onboarding',
    'SaaS with commercial architecture questions',
  ];
  const notFit = [
    'Pre-PMF products still searching for product-market fit',
    'Traffic-only problems with no underlying product demand',
    'Generic copywriting or brand refresh projects',
    'Execution retainer relationships',
  ];
  return (
    <section id="who-this-is-for" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div>
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[.9] tracking-[-.07em] text-[#202536]">Built for SaaS with demand — but unclear conversion.</h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <Reveal delay={.1}>
            <div className="border-t border-[#202536]/20 pt-6">
              <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#202536]/55" style={{ fontFamily: 'var(--app-font-sans)' }}>Good fit</span>
              <ul className="mt-6 space-y-4 list-editorial">
                {goodFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#44464c]"><Check size={16} className="mt-0.5 shrink-0 text-[#e15b2e]" />{item}</li>
                ))}
              </ul>
            </div>
            </Reveal>
            <Reveal delay={.18}>
            <div className="border-t border-[#202536]/20 pt-6">
              <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#202536]/55" style={{ fontFamily: 'var(--app-font-sans)' }}>Not fit</span>
              <ul className="mt-6 space-y-4 list-editorial">
                {notFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#44464c]"><Minus size={16} className="mt-0.5 shrink-0 text-[#202536]/30" />{item}</li>
                ))}
              </ul>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* FAQ — reduced to 5 genuine buying objections, answers always in DOM */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-10 bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[.9] tracking-[-.07em] text-[#202536]">The useful<br />short version.</h2>
          <div className="border-t border-[#202536]/15">              {homepageFaqs.map(([question, answer], index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-answer-${index}`;
              return (
                <div key={question} className="border-b border-[#202536]/15">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left transition-colors duration-200 hover:bg-[#ddd8ce]/50 px-3 -mx-3 radius-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e15b2e]" aria-expanded={isOpen} aria-controls={answerId}>
                    <span className="font-display text-[22px] leading-[1.1] tracking-[-.02em] text-[#202536]">{question}</span>
                    <ChevronDown size={18} className={`shrink-0 text-[#e15b2e] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div id={answerId} role="region" className="faq-answer" data-state={isOpen ? 'open' : 'closed'} aria-labelledby={`faq-q-${index}`}>
                    <div className="max-w-[620px] pb-7 pr-8 text-[16px] leading-[1.6] text-[#44464c]">{answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Final CTA — quieter than hero, reduced size */
function FinalCTA({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section className="bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-[1000px]">
          <Reveal>
            <h2 className="font-display text-[clamp(3rem,7.2vw,7rem)] leading-[.86] tracking-[-.08em]">Your product may not need more traffic<span className="text-[#e96a3a]">.</span></h2>
            <p className="mt-8 max-w-[590px] text-[18px] leading-[1.55] text-[#f5f0e7]/68">It may need a better path from the attention you already have to the revenue you want.</p>
          </Reveal>
          <Reveal delay={.15}>
            <div className="mt-12 flex flex-col items-start gap-7 sm:flex-row sm:items-center">
              <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 radius-btn text-[11px] font-bold uppercase tracking-[.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" style={{ fontFamily: 'var(--app-font-sans)' }}>START THE DIAGNOSIS <ArrowRight size={16} className="transition-transform duration-[160ms] group-hover:translate-x-1.5" /></a>
              <a href="mailto:paul@nasiba.co" className="text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/50 border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>EMAIL PAUL</a>
            </div>
          </Reveal>
        </div>
        <SiteFooter variant="dark" />
      </div>
    </section>
  );
}

/* ─── Home ─── */

function Home() {
  useEffect(() => {
    document.title = 'Nasiba — Revenue Architecture for SaaS';
    const description = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'Nasiba diagnoses the commercial gaps between SaaS product interest and revenue — positioning, economic value, offers, buying events and upgrade logic.');
    document.head.appendChild(description);
    const ogTitle = document.querySelector('meta[property="og:title"]') ?? document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Nasiba — Revenue Architecture for SaaS');
    document.head.appendChild(ogTitle);
    const ogDescription = document.querySelector('meta[property="og:description"]') ?? document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'Nasiba diagnoses the commercial gaps between SaaS product interest and revenue — positioning, economic value, offers, buying events and upgrade logic.');
    document.head.appendChild(ogDescription);
  }, []);

  const [, setLocation] = useLocation();
  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    scrollToSection(id);
  };

  return <main className="page-grain overflow-hidden">
    <Hero onNavigate={navigate} />
    <RevenuePathMap />
    <RevenueLeakExamples />
    <Diagnosis />
    <CasesTeaser />
    <Engagement />
    <WhoThisIsFor />
    <FAQ />
    <FinalCTA onNavigate={navigate} />
  </main>;
}

/* ─── /start — Intake Page ─── */

function StartPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'Start a Revenue Leak Diagnosis — Nasiba';
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'Start a $1,000 asynchronous Revenue Leak Diagnosis for your SaaS. Share your product and primary monetization issue to begin.');
    document.head.appendChild(meta);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const website = String(fd.get('website') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const primaryIssue = String(fd.get('primaryIssue') ?? '').trim();
    const botcheck = String(fd.get('botcheck') ?? '');

    const errors: Record<string, string> = {};
    if (!name) errors.name = 'Name is required';
    if (!website) errors.website = 'URL is required';
    else {
      const w = website.startsWith('http') ? website : `https://${website}`;
      try { new URL(w); } catch { errors.website = 'Enter a valid URL or domain'; }
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required';
    if (!primaryIssue) errors.primaryIssue = 'Please select an option';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '18d32bf8-529c-48e6-bbcc-bf70f948700c');
      fd.append('name', name);
      fd.append('website', website);
      fd.append('email', email);
      fd.append('primaryIssue', primaryIssue);
      fd.append('subject', `New Revenue Leak Diagnosis — ${website}`);
      fd.append('replyto', email);
      fd.append('botcheck', botcheck);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        throw new Error(data.message || 'Submission failed');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again, or email paul@nasiba.co.');
    } finally {
      setSubmitting(false);
    }
  };

  const [, setLocation] = useLocation();
  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[640px] px-5 pb-20 pt-40 sm:px-8 lg:pb-28">
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <div className="mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <span className="h-px w-8 bg-current" />
            <span>REVENUE LEAK DIAGNOSIS</span>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-[.88] tracking-[-.07em]">
            Start with the problem.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.55] text-[#f5f0e7]/70">
            Give us the minimum context needed to understand where monetization appears to be breaking. If it looks like a fit, you&apos;ll receive the next step by email.
          </p>
          <div className="mt-6 flex items-baseline gap-4 text-[12px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <span>$1,000</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>3–4 days</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>asynchronous</span>
          </div>
        </div>

        {submitted ? (
          <div className="mt-16 border-t border-[#f5f0e7]/20 pt-12">
            <div className="mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
              <span className="h-px w-8 bg-current" />
              <span>SUBMITTED</span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[.9] tracking-[-.06em]">
              REQUEST RECEIVED.
            </h2>
            <p className="mt-6 max-w-[480px] text-[17px] leading-[1.55] text-[#f5f0e7]/70">
              If the diagnosis looks like a fit, Paul will reply by email with the next step and payment details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-12 border-t border-[#f5f0e7]/20 pt-10 space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="start-name" className="block text-[12px] font-semibold uppercase tracking-[.1em] text-[#f5f0e7]/70 mb-3" style={{ fontFamily: 'var(--app-font-sans)' }}>Name</label>
              <input
                id="start-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`w-full border ${fieldErrors.name ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-transparent px-4 py-3.5 radius-input font-mono-ui text-[14px] text-[#f5f0e7] outline-none transition-colors placeholder:text-[#f5f0e7]/30 focus:border-[#e96a3a] focus-visible:outline-2 focus-visible:outline-[#e96a3a]`}
                placeholder="Your name"
              />
              {fieldErrors.name && <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#e96a3a]">{fieldErrors.name}</p>}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="start-website" className="block text-[12px] font-semibold uppercase tracking-[.1em] text-[#f5f0e7]/70 mb-3" style={{ fontFamily: 'var(--app-font-sans)' }}>Company / product URL</label>
              <input
                id="start-website"
                name="website"
                type="text"
                autoComplete="url"
                required
                className={`w-full border ${fieldErrors.website ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-transparent px-4 py-3.5 radius-input font-mono-ui text-[14px] text-[#f5f0e7] outline-none transition-colors placeholder:text-[#f5f0e7]/30 focus:border-[#e96a3a] focus-visible:outline-2 focus-visible:outline-[#e96a3a]`}
                placeholder="https://"
              />
              {fieldErrors.website && <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#e96a3a]">{fieldErrors.website}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="start-email" className="block text-[12px] font-semibold uppercase tracking-[.1em] text-[#f5f0e7]/70 mb-3" style={{ fontFamily: 'var(--app-font-sans)' }}>Work email</label>
              <input
                id="start-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full border ${fieldErrors.email ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-transparent px-4 py-3.5 radius-input font-mono-ui text-[14px] text-[#f5f0e7] outline-none transition-colors placeholder:text-[#f5f0e7]/30 focus:border-[#e96a3a] focus-visible:outline-2 focus-visible:outline-[#e96a3a]`}
                placeholder="you@company.com"
              />
              {fieldErrors.email && <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#e96a3a]">{fieldErrors.email}</p>}
            </div>

            {/* Primary Issue */}
            <div>
              <label htmlFor="start-issue" className="block text-[12px] font-semibold uppercase tracking-[.1em] text-[#f5f0e7]/70 mb-3" style={{ fontFamily: 'var(--app-font-sans)' }}>Where does the problem seem to be?</label>
              <select
                id="start-issue"
                name="primaryIssue"
                required
                className={`w-full border ${fieldErrors.primaryIssue ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-[#202536] px-4 py-3.5 radius-input font-mono-ui text-[14px] text-[#f5f0e7] outline-none transition-colors focus:border-[#e96a3a] focus-visible:outline-2 focus-visible:outline-[#e96a3a]`}
                defaultValue=""
              >
                <option value="" disabled>Select an issue</option>
                <option value="Weak paid conversion">Weak paid conversion</option>
                <option value="No upgrade trigger">No upgrade trigger</option>
                <option value="Unclear buying event">Unclear buying event</option>
                <option value="Pricing / packaging">Pricing / packaging</option>
                <option value="Weak value framing">Weak value framing</option>
                <option value="Unclear positioning">Unclear positioning</option>
                <option value="Expansion stalls">Expansion stalls</option>
                <option value="Not sure yet">Not sure yet</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.primaryIssue && <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#e96a3a]">{fieldErrors.primaryIssue}</p>}
            </div>

            {/* Honeypot — Web3Forms botcheck */}
            <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-between bg-[#e96a3a] px-5 py-4 radius-btn text-[11px] font-bold uppercase tracking-[.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7] disabled:opacity-60 disabled:cursor-not-allowed" style={{ fontFamily: 'var(--app-font-sans)' }}
              >
                {submitting ? 'SENDING...' : 'SEND DIAGNOSIS REQUEST'} <ArrowRight size={16} />
              </button>
              <p className="mt-3 font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f5f0e7]/40">No call required. No retainer attached.</p>
            </div>

            {error && (
              <div className="border border-[#e96a3a]/40 bg-[#e96a3a]/10 px-5 py-4">
                <p className="font-mono-ui text-[11px] uppercase tracking-[.1em] text-[#e96a3a]">{error}</p>
              </div>
            )}
          </form>
        )}

        <div className="mt-12 border-t border-[#f5f0e7]/15 pt-8">
          <p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
            Prefer email? <a href="mailto:paul@nasiba.co" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">paul@nasiba.co</a>
          </p>
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}

/* ─── /revenue-architecture — Full Page ─── */

function RevenueArchitecturePage() {
  useEffect(() => {
    document.title = 'Revenue Architecture — Nasiba';
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'A focused two-week engagement to rebuild SaaS positioning, economic framing, offers, buying events, pricing and upgrade logic around the path to revenue.');
    document.head.appendChild(meta);
  }, []);

  const [, setLocation] = useLocation();
  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') return;
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  const covers = [
    ['POSITIONING', 'Clarify who the product is for, what category it belongs in, and what the buyer believes they are purchasing.'],
    ['ECONOMIC FRAMING', 'Connect product capability to workload removed, revenue created, cost reduced, risk reduced, throughput increased or another relevant economic outcome.'],
    ['OFFER ARCHITECTURE', 'Restructure the commercial path across free, paid and expansion stages.'],
    ['BUYING-EVENT DESIGN', 'Define the event or threshold that creates a rational reason to buy now.'],
    ['PRICING & UPGRADE LOGIC', 'Align packaging and expansion with increasing customer value rather than arbitrary feature gates.'],
    ['MESSAGING IMPLEMENTATION GUIDANCE', 'Translate the commercial architecture into homepage, pricing, onboarding and upgrade messaging direction.'],
  ];

  const strongFit = [
    'Existing SaaS product',
    'Existing users / traffic / demand',
    'Evidence of commercial friction',
    'Monetization problem appears structural',
    'Team can implement strategic changes',
  ];

  const notFit = [
    'Pre-PMF product',
    'Traffic acquisition problem only',
    'Generic copywriting request',
    'Ongoing execution retainer',
    'Company looking only for more features',
  ];

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <div className="mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <span className="h-px w-8 bg-current" />
            <span>REVENUE ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em]">
            Rebuild the path from interest to revenue.
          </h1>
          <p className="mt-6 max-w-[640px] text-[18px] leading-[1.55] text-[#f5f0e7]/70">
            When the diagnosis shows that the problem is structural, Revenue Architecture redesigns the commercial system around the buying decision — positioning, economic framing, offers, buying events, pricing and upgrade logic.
          </p>
          <div className="mt-6 flex items-baseline gap-4 text-[12px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <span>$10,000</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>2 weeks</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>asynchronous</span>
          </div>
        </div>

        {/* What it covers */}
        <div className="mt-24">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>What the engagement covers</p>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {covers.map(([title, body]) => (
              <article key={title} className="border-t border-[#f5f0e7]/15 py-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>{title}</h3>
                <p className="mt-3 max-w-[340px] text-[15px] leading-[1.55] text-[#f5f0e7]/68">{body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Relationship */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="border-t border-[#f5f0e7]/20 py-8">
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">01</span>
                <h3 className="mt-4 font-display text-[clamp(2rem,3.5vw,3rem)] leading-none tracking-[-.05em]">DIAGNOSE</h3>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[.1em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Revenue Leak Diagnosis</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>$1,000 · 3–4 days</p>
                <p className="mt-4 max-w-[380px] text-[16px] leading-[1.5] text-[#f5f0e7]/68">Find the break.</p>
              </div>
            </div>
            <div>
              <div className="border-t border-[#f5f0e7]/20 py-8">
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">02</span>
                <h3 className="mt-4 font-display text-[clamp(2rem,3.5vw,3rem)] leading-none tracking-[-.05em]">REBUILD</h3>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[.1em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Revenue Architecture</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>$10,000 · 2 weeks</p>
                <p className="mt-4 max-w-[380px] text-[16px] leading-[1.5] text-[#f5f0e7]/68">Rebuild the system around it.</p>
              </div>
            </div>
          </div>
          <p className="mt-8 font-display text-[20px] leading-[1.2] tracking-[-.03em] text-[#f5f0e7]/75">Two steps, only when the problem calls for both.</p>
        </div>

        {/* Who it is for */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[.9] tracking-[-.06em]">Who Revenue Architecture is for</h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="border-t border-[#f5f0e7]/20 pt-6">
              <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Strong fit</span>
              <ul className="mt-6 space-y-4">
                {strongFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#f5f0e7]/68"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[#f5f0e7]/20 pt-6">
              <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Not fit</span>
              <ul className="mt-6 space-y-4">
                {notFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#f5f0e7]/68"><Minus size={16} className="mt-0.5 shrink-0 text-[#f5f0e7]/30" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <p className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.08] tracking-[-.04em]">The revenue problem starts with the diagnosis.</p>
          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 radius-btn text-[11px] font-bold uppercase tracking-[.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" style={{ fontFamily: 'var(--app-font-sans)' }}>START WITH THE DIAGNOSIS <ArrowRight size={16} className="transition-transform duration-[160ms] group-hover:translate-x-1" /></a>
          </div>
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/50" style={{ fontFamily: 'var(--app-font-sans)' }}>
            Already diagnosed the problem? Email <a href="mailto:paul@nasiba.co" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">paul@nasiba.co</a>
          </p>
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}

/* ─── /architecture — Legacy redirect ─── */

function ArchitectureRedirect() {
  useEffect(() => {
    window.location.replace('/revenue-architecture');
  }, []);
  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="font-mono-ui text-[11px] uppercase tracking-[.14em] text-[#f5f0e7]/50">Redirecting to Revenue Architecture...</p>
      </div>
    </main>
  );
}

/* ─── /diagnosis page — holds the removed lenses + detailed FAQ ─── */

function DiagnosisPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = 'Revenue Leak Diagnosis — Nasiba';
  }, []);

  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') return;
    setLocation('/');
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            Revenue Leak Diagnosis
          </h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-[#f5f0e7]/65">
            A focused async commercial diagnosis of where the path from interest to payment is breaking.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[12px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <span>$1,000</span>
            <span>3–4 DAYS</span>
            <span>ASYNCHRONOUS</span>
            <span>FIXED SCOPE</span>
          </div>
          <a href="/sample-diagnosis" className="mt-6 inline-flex items-center gap-2 border-b border-[#f5f0e7]/25 pb-0.5 text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/65 transition-colors duration-200 hover:text-[#e96a3a] hover:border-[#e96a3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
            VIEW A SAMPLE DIAGNOSIS <ArrowRight size={12} />
          </a>
        </div>

        {/* Diagnostic Lenses */}
        <div className="mt-28">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Diagnostic method</p>
          <h2 className="mt-5 max-w-[460px] font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[.9] tracking-[-.07em]">Six ways to find a leak.</h2>
          <p className="mt-7 max-w-[420px] text-[15px] leading-[1.6] text-[#f5f0e7]/68">Not a scorecard. A way to inspect the whole commercial chain before choosing a fix.</p>
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosticLenses.map(([number, title, body]) => (
              <article key={number} className="border-t border-[#f5f0e7]/15 py-5">
                <div className="flex justify-between font-mono-ui text-[10px] text-[#e96a3a]"><span>{number}</span><span>+</span></div>
                <h3 className="mt-8 font-display text-[26px] tracking-[-.04em]">{title}</h3>
                <p className="mt-3 max-w-[310px] text-[15px] leading-[1.55] text-[#f5f0e7]/68">{body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Detailed FAQ */}
        <div className="mt-28 border-t border-[#f5f0e7]/15 pt-14">
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[.9] tracking-[-.07em]">Questions</h2>
          <div className="mt-12 space-y-0">
            {diagnosisFaqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              const answerId = `diag-faq-answer-${index}`;
              return (
                <div key={question} className="border-b border-[#f5f0e7]/15">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left transition-colors duration-200 hover:bg-[#202536]/50 px-3 -mx-3 radius-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]" aria-expanded={isOpen} aria-controls={answerId}>
                    <span className="font-display text-[20px] leading-[1.1] tracking-[-.02em] text-[#f5f0e7]">{question}</span>
                    <ChevronDown size={18} className={`shrink-0 text-[#e96a3a] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div id={answerId} role="region" className="faq-answer" data-state={isOpen ? 'open' : 'closed'}>
                    <div className="max-w-[620px] pb-7 pr-8 text-[16px] leading-[1.6] text-[#f5f0e7]/70">{answer}</div>
                  </div>
                </div>
              );
            })}          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <p className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.08] tracking-[-.04em]">Ready to find the leak?</p>
          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 radius-btn text-[11px] font-bold uppercase tracking-[.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" style={{ fontFamily: 'var(--app-font-sans)' }}>START THE DIAGNOSIS <ArrowRight size={16} className="transition-transform duration-[160ms] group-hover:translate-x-1" /></a>
            <a href="mailto:paul@nasiba.co" className="text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/50 border-b border-[#f5f0e7]/20 pb-0.5 transition-colors duration-200 hover:text-[#e96a3a] hover:border-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>EMAIL PAUL</a>
          </div>
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}


/* ─── About Page ─── */

function About() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = 'About — Nasiba';
  }, []);

  const navigate = (id: string) => {
    if (id === 'about-nav') return;
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Nasiba — statement */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            A specialist Revenue Architecture agency for SaaS.
          </h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-[#f5f0e7]/70">
            Nasiba works on the commercial path between product interest and revenue — positioning, economic framing, offers, buying events and upgrade logic.
          </p>
        </div>

        {/* Why Nasiba exists */}
        <div className="mt-28 max-w-[800px]">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[.92] tracking-[-.06em] text-[#f5f0e7]">
            Revenue problems are often diagnosed at the wrong level.
          </h2>
          <p className="mt-7 text-[17px] leading-[1.65] text-[#f5f0e7]/68">
            Nasiba exists to examine the commercial path as a system — not as a collection of isolated conversion problems. Most SaaS teams are trained to optimize individual components. But revenue depends on a sequence of commercial transitions. Nasiba exists to identify where that sequence breaks.
          </p>
        </div>

        {/* Senior Work Stays Senior */}
        <div className="mt-28 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.05] tracking-[-.05em] text-[#f5f0e7]/85">
              Senior work stays senior.
            </h2>
            <p className="mt-6 max-w-[480px] text-[16px] leading-[1.6] text-[#f5f0e7]/68">
              The person diagnosing the commercial problem stays close to the strategic work. No account layer, no retainer structure, and no handoff to a generic delivery team.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4 border-t border-[#f5f0e7]/15 pt-6">
              <div className="flex items-center gap-4">
                <span className="h-px w-6 bg-[#e96a3a]" />
                <span className="text-[12px] tracking-[.04em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Direct strategic involvement</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="h-px w-6 bg-[#e96a3a]" />
                <span className="text-[12px] tracking-[.04em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Fixed scope</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="h-px w-6 bg-[#e96a3a]" />
                <span className="text-[12px] tracking-[.04em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Async delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paul */}
        <div className="mt-28 border-t border-[#f5f0e7]/15 pt-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-24">
            <div>
              <div className="flex h-14 w-14 items-center justify-center border border-[#e96a3a] font-mono-ui text-[16px] font-bold text-[#e96a3a]">P</div>
              <p className="mt-6 font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] text-[#f5f0e7]">Paul</p>
              <p className="mt-1 text-[12px] tracking-[.04em] text-[#f5f0e7]/60" style={{ fontFamily: 'var(--app-font-sans)' }}>Founder &amp; Principal</p>
              <div className="mt-6 space-y-2">
                <p className="text-[12px] tracking-[.04em] text-[#f5f0e7]/60">
                  <a href="https://www.linkedin.com/in/paul-coll/" target="_blank" rel="noopener noreferrer" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">LinkedIn →</a>
                </p>
                <p className="text-[12px] tracking-[.04em] text-[#f5f0e7]/60">
                  <a href="https://x.com/1Paul_coll" target="_blank" rel="noopener noreferrer" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">X / Twitter →</a>
                </p>
                <p className="text-[12px] tracking-[.04em] text-[#f5f0e7]/60">
                  <a href="mailto:paul@nasiba.co" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">paul@nasiba.co</a>
                </p>
              </div>
            </div>
            <div className="max-w-[600px]">
              <p className="text-[17px] leading-[1.6] text-[#f5f0e7]/70">
                Paul leads Nasiba&apos;s diagnostic and strategic work across positioning, economic value, offers, buying events and monetization architecture.
              </p>
              <div className="mt-8">
                <a href="/cases" className="inline-flex items-center gap-3 border-b-2 border-[#e96a3a] pb-1.5 text-[12px] font-semibold uppercase tracking-[.1em] text-[#e96a3a] transition-colors duration-200 hover:text-[#f18a61]" style={{ fontFamily: 'var(--app-font-sans)' }}>VIEW CLIENT CASES →</a>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}

/* ─── Cases Index Page ─── */

function CasesIndex() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = 'Client Work — Nasiba';
  }, []);

  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') return;
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            Client work
          </h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-[#f5f0e7]/70">
            Selected commercial diagnosis, positioning and messaging work across SaaS products.
          </p>
        </div>

        {/* Cases List */}
        <div className="mt-20 border-t border-[#f5f0e7]/15">
          {casesData.map((c) => (
            <a key={c.slug} href={`/cases/${c.slug}`} className="group grid grid-cols-1 gap-4 border-b border-[#f5f0e7]/15 py-10 transition-all duration-200 hover:bg-[#f5f0e7]/[.03] hover:translate-y-[-2px] radius-block sm:grid-cols-[200px_1fr] sm:gap-8 sm:py-12">
              <div>
                <h2 className="font-display text-[20px] font-semibold tracking-[-.02em] text-[#f5f0e7] group-hover:text-[#e96a3a] transition-colors duration-200">{c.name}</h2>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[.08em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>{c.engagement}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[.08em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Problem</span>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#f5f0e7]/65">{c.problem}</p>
                </div>
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[.08em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Intervention</span>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#f5f0e7]/65">{c.intervention}</p>
                </div>
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[.08em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Outcome</span>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#f5f0e7]/65">{c.shortOutcome}</p>
                </div>
              </div>
              <span className="hidden sm:flex items-center text-[11px] font-semibold uppercase tracking-[.1em] text-[#e96a3a] opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ fontFamily: 'var(--app-font-sans)' }}>VIEW CASE →</span>
            </a>
          ))}
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}

/* ─── Case Detail Page ─── */

function CaseDetail({ slug }: { slug: string }) {
  const [, setLocation] = useLocation();
  const data = caseDetails[slug];

  useEffect(() => {
    if (data) document.title = `${data.name} — Nasiba`;
  }, [data]);

  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  if (!data) return <NotFound />;

  const sections = [
    { label: '01', title: 'CONTEXT', body: data.context },
    { label: '02', title: 'COMMERCIAL PROBLEM', body: data.commercialProblem },
    { label: '03', title: 'DIAGNOSIS', body: data.diagnosis },
    { label: '04', title: 'STRATEGIC DIRECTION', body: data.strategicDirection },
    { label: '05', title: 'IMPLEMENTATION', body: data.implementation },
    { label: '06', title: 'OUTCOME', body: data.outcome },
  ];

  /* Case navigation */
  const caseSlugs = casesData.map((c) => c.slug);
  const currentIndex = caseSlugs.indexOf(slug);
  const nextSlug = currentIndex < caseSlugs.length - 1 ? caseSlugs[currentIndex + 1] : caseSlugs[0];
  const nextName = casesData.find((c) => c.slug === nextSlug)?.name ?? 'All Cases';
  const isLast = currentIndex === caseSlugs.length - 1;

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <p className="text-[12px] font-medium uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <a href="/cases" className="transition-colors hover:text-[#f18a61]">CASES</a> → {data.name.toUpperCase()}
          </p>
          <h1 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            {data.name}
          </h1>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>
            {data.engagementType}
          </p>
        </div>

        {/* Sections */}
        <div className="mt-20 border-t border-[#f5f0e7]/15">
          {sections.map((section, idx) => (
            <article key={section.label} className={`grid grid-cols-1 gap-6 border-b border-[#f5f0e7]/15 py-10 sm:grid-cols-[120px_1fr] sm:gap-10 transition-colors duration-200 px-3 -mx-3 ${idx % 2 === 0 ? 'hover:bg-[#f5f0e7]/[.02]' : ''}`}>
              <div>
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">{section.label}</span>
                <h3 className="mt-3 text-[11px] font-semibold uppercase tracking-[.1em] text-[#f5f0e7]/75" style={{ fontFamily: 'var(--app-font-sans)' }}>{section.title}</h3>
              </div>
              <div className="max-w-[720px]">
                <p className="text-[16px] leading-[1.6] text-[#f5f0e7]/70">{section.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between border-t border-[#f5f0e7]/15 pt-8">
          <a href="/cases" className="inline-flex items-center gap-3 border-b-2 border-[#e96a3a] pb-1.5 text-[11px] font-semibold uppercase tracking-[.1em] text-[#e96a3a] transition-colors duration-200 hover:text-[#f18a61]" style={{ fontFamily: 'var(--app-font-sans)' }}>← ALL CASES</a>
          <a href={isLast ? '/cases' : `/cases/${nextSlug}`} className="inline-flex items-center gap-3 border-b-2 border-[#e96a3a] pb-1.5 text-[11px] font-semibold uppercase tracking-[.1em] text-[#e96a3a] transition-colors duration-200 hover:text-[#f18a61]" style={{ fontFamily: 'var(--app-font-sans)' }}>{isLast ? 'ALL CASES' : `${nextName.toUpperCase()}`} →</a>
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}

/* ─── Privacy & Terms Pages ─── */

function PrivacyPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = 'Privacy — Nasiba';
  }, []);

  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#f5f0e7]">
      <Header onNavigate={navigate} variant="light" />
      <div className="mx-auto max-w-[900px] px-5 pb-20 pt-40 sm:px-8 lg:pb-28">
        <div className="border-t border-[#cfc7b7] pt-6">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[.9] tracking-[-.06em] text-[#202536]">Privacy</h1>
          <p className="mt-4 text-[12px] font-medium uppercase tracking-[.08em] text-[#6c6b68]" style={{ fontFamily: 'var(--app-font-sans)' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="mt-12 space-y-8 border-t border-[#cfc7b7] pt-10 text-[16px] leading-[1.7] text-[#55575c]">
          <p>Nasiba (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the nasiba.co website. This page informs you of our policies regarding the collection, use and disclosure of personal information when you use our service.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Information Collection</h2>
          <p>We collect information you provide directly, such as when you initiate a diagnosis engagement, contact us by email, or provide business context as part of an engagement.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Use of Information</h2>
          <p>We use collected information to deliver our services, communicate with you, and improve our offerings. We do not sell your personal information to third parties.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Confidentiality</h2>
          <p>All business context, product information and materials shared during an engagement are treated as confidential. We do not share client information without explicit consent.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Contact</h2>
          <p>For privacy-related inquiries, contact <a href="mailto:paul@nasiba.co" className="border-b border-[#e15b2e] pb-0.5 text-[#e15b2e] transition-colors duration-200 hover:text-[#c94a22]">paul@nasiba.co</a>.</p>
        </div>
        <SiteFooter variant="light" />
      </div>
    </main>
  );
}

function TermsPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = 'Terms — Nasiba';
  }, []);

  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#f5f0e7]">
      <Header onNavigate={navigate} variant="light" />
      <div className="mx-auto max-w-[900px] px-5 pb-20 pt-40 sm:px-8 lg:pb-28">
        <div className="border-t border-[#cfc7b7] pt-6">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[.9] tracking-[-.06em] text-[#202536]">Terms</h1>
          <p className="mt-4 text-[12px] font-medium uppercase tracking-[.08em] text-[#6c6b68]" style={{ fontFamily: 'var(--app-font-sans)' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="mt-12 space-y-8 border-t border-[#cfc7b7] pt-10 text-[16px] leading-[1.7] text-[#55575c]">
          <p>These terms govern your use of nasiba.co and any engagement with Nasiba. By engaging our services, you agree to the following terms.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Services</h2>
          <p>Nasiba provides Revenue Architecture diagnosis and strategic consulting services for SaaS companies. All engagements are fixed-scope and asynchronous unless otherwise agreed in writing.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Engagement Terms</h2>
          <p>The Revenue Leak Diagnosis is $1,000, delivered in 3–4 business days. Revenue Architecture is $10,000, delivered in 2 weeks. Payment is due before work begins. There are no retainers or recurring commitments.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Deliverables</h2>
          <p>Deliverables are as described in the engagement scope. Nasiba provides strategic direction and recommendations. Implementation is the responsibility of the client unless otherwise agreed.</p>
          <h2 className="font-display text-[22px] tracking-[-.04em] text-[#202536]">Contact</h2>
          <p>For terms-related inquiries, contact <a href="mailto:paul@nasiba.co" className="border-b border-[#e15b2e] pb-0.5 text-[#e15b2e] transition-colors duration-200 hover:text-[#c94a22]">paul@nasiba.co</a>.</p>
        </div>
        <SiteFooter variant="light" />
      </div>
    </main>
  );
}

/* ─── /sample-diagnosis — Illustrative output of the diagnosis ─── */

const sampleLeakStages = [
  { name: 'INTEREST', state: 'intact' },
  { name: 'UNDERSTANDING', state: 'intact' },
  { name: 'ECONOMIC VALUE', state: 'intact' },
  { name: 'BUYING EVENT', state: 'break' },
  { name: 'PAYMENT', state: 'intact' },
  { name: 'EXPANSION', state: 'intact' },
];

const sampleOutputs = [
  {
    number: '01',
    title: 'Revenue Leak',
    headline: 'Free solves the core job.',
    explanation: 'The free plan already gives the user the outcome that brought them to the product. Paid mostly increases capacity rather than creating a meaningfully more valuable commercial state.',
    consequence: 'Users can like the product without developing a rational reason to upgrade.',
  },
  {
    number: '02',
    title: 'Root Cause',
    headline: 'Packaging is organized around usage, not increasing value.',
    explanation: 'The commercial boundary is defined by how much the user can do rather than by when the product becomes more economically important.',
    upgradeAsks: {
      current: '“Do you need more?”',
      shouldAsk: '“Has this become important enough to pay for?”',
    },
    consequence: 'Usage growth does not automatically create willingness to pay.',
  },
  {
    number: '03',
    title: 'Economic Logic',
    headline: 'Paid needs to correspond to a more valuable state.',
    explanation: 'The paid tier should become rational when the workflow becomes more economically or operationally important.',
    signals: [
      'Recurring team use',
      'Workflow dependency',
      'Coordination across users',
      'Reduced manual workload',
      'Reliability requirements',
      'Operational risk if the product disappears',
    ],
    signalsNote: 'Illustrative signals — not measured facts, and not all will apply.',
  },
  {
    number: '04',
    title: 'Buying Event',
    headline: 'The buying event is operational dependency.',
    explanation: 'The rational reason to pay appears when the product stops being an occasional utility and becomes part of a recurring workflow the customer depends on.',
    diagnosticQuestion: 'What observable event tells us the user has crossed from experimentation into dependency?',
    signals: [
      'Second team member invited',
      'Workflow becomes recurring',
      'Project/client volume crosses a threshold',
      'Integrations become necessary',
      'Exports/reports become operational',
      'Product becomes embedded in a client-facing process',
    ],
    signalsNote: 'Illustrative possibilities a diagnosis would test against product data — not measured facts.',
  },
  {
    number: '05',
    title: 'Offer / Upgrade Logic',
    headline: 'Move paid value closer to the buying event.',
    explanation: 'Instead of making paid mostly “more free,” make the paid tier correspond to the point where the workflow becomes operationally important.',
    ladder: [
      { stage: 'FREE', body: 'Prove the workflow' },
      { stage: 'PAID', body: 'Operate the workflow repeatedly / collaboratively / reliably' },
      { stage: 'EXPANSION', body: 'Support increasing organizational dependency' },
    ],
  },
];

const samplePriorities = [
  {
    rank: 'PRIORITY 1',
    title: 'Define the observable buying event.',
    why: 'Without it, packaging and upgrade prompts have no reliable commercial anchor.',
  },
  {
    rank: 'PRIORITY 2',
    title: 'Rebuild the free → paid boundary around increasing customer value.',
    why: 'The offer should reflect the commercial transition identified above.',
  },
  {
    rank: 'PRIORITY 3',
    title: 'Rewrite upgrade and homepage framing around the economic transition.',
    why: 'Messaging should express the commercial architecture rather than compensate for an unclear one.',
  },
];

function SampleLeakMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setDrawn(true); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setDrawn(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="border-t border-[#f5f0e7]/15 pt-10">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>The sample leak map</p>
        <p className="text-[10px] font-medium uppercase tracking-[.1em] text-[#f5f0e7]/45" style={{ fontFamily: 'var(--app-font-sans)' }}>Structural map — not measured data</p>
      </div>

      {/* Desktop: horizontal path, mirrors the homepage Revenue Path language */}
      <div className="mt-12 hidden lg:block">
        <div className="relative">
          <div
            className="absolute left-0 right-0 top-[15px] h-px bg-[#f5f0e7]/20 origin-left"
            style={{ transform: drawn ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform .9s cubic-bezier(.22,1,.36,1) .2s' }}
          />
          <div
            className="absolute top-[15px] left-[48%] h-px w-[8%]"
            style={{
              backgroundImage: 'repeating-linear-gradient(to right, #e96a3a 0px, #e96a3a 4px, transparent 4px, transparent 10px)',
              transformOrigin: 'left center',
              transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform .4s cubic-bezier(.22,1,.36,1) .9s',
              opacity: drawn ? 1 : 0,
            }}
          />
          <div className="grid grid-cols-6 gap-4">
            {sampleLeakStages.map((stage, i) => (
              <div key={stage.name} className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-[30px] w-[30px] items-center justify-center radius-block bg-[#202536] ${stage.state === 'break' ? 'border-2 border-dashed border-[#e96a3a]' : 'border border-[#e96a3a]/70'}`}
                  style={{
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? 'translateY(0)' : 'translateY(6px)',
                    transition: `opacity .35s cubic-bezier(.22,1,.36,1) ${.35 + i * .15}s, transform .35s cubic-bezier(.22,1,.36,1) ${.35 + i * .15}s`,
                  }}
                >
                  {stage.state === 'break'
                    ? <span className="text-[11px] font-bold text-[#e96a3a]">✗</span>
                    : <div className="h-2 w-2 rounded-full bg-[#e96a3a]" />}
                </div>
                <span
                  className={`mt-3 text-center text-[10px] uppercase tracking-[.08em] ${stage.state === 'break' ? 'font-semibold text-[#e96a3a]' : 'font-medium text-[#f5f0e7]/65'}`}
                  style={{
                    fontFamily: 'var(--app-font-sans)',
                    opacity: drawn ? 1 : 0,
                    transition: `opacity .35s ease ${.45 + i * .15}s`,
                  }}
                >
                  {stage.name}
                </span>
                {stage.state === 'break' && (
                  <span
                    className="mt-2 text-[9px] font-bold uppercase tracking-[.12em] text-[#e96a3a]"
                    style={{
                      fontFamily: 'var(--app-font-sans)',
                      opacity: drawn ? 1 : 0,
                      transition: `opacity .35s ease 1.25s`,
                    }}
                  >
                    Primary break
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* Textual annotation of the break — meaning is never carried by color alone */}
          <div
            className="mt-8 border-l-2 border-[#e96a3a] pl-4"
            style={{
              opacity: drawn ? 1 : 0,
              transform: drawn ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity .4s ease 1.3s, transform .4s cubic-bezier(.22,1,.36,1) 1.3s',
            }}
          >
            <p className="font-display text-[15px] leading-[1.4] tracking-[-.02em] text-[#f5f0e7]/70">“The buyer never reaches a rational reason to pay — paid only offers more of what free already solved.”</p>
          </div>
        </div>
      </div>

      {/* Mobile: simplified stacked map */}
      <div className="mt-10 lg:hidden">
        <ol className="space-y-0">
          {sampleLeakStages.map((stage, i) => (
            <li key={stage.name} className="relative flex gap-4 pb-6 last:pb-0">
              {i < sampleLeakStages.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[14px] top-[30px] h-[calc(100%-30px)] w-px ${stage.state === 'break' ? 'bg-[#e96a3a]' : 'bg-[#f5f0e7]/20'}`}
                />
              )}
              <div className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center radius-block bg-[#202536] ${stage.state === 'break' ? 'border-2 border-dashed border-[#e96a3a]' : 'border border-[#e96a3a]/70'}`}>
                {stage.state === 'break'
                  ? <span className="text-[11px] font-bold text-[#e96a3a]">✗</span>
                  : <div className="h-2 w-2 rounded-full bg-[#e96a3a]" />}
              </div>
              <div className="pt-1">
                <p className={`text-[11px] font-medium uppercase tracking-[.08em] ${stage.state === 'break' ? 'font-semibold text-[#e96a3a]' : 'text-[#f5f0e7]/65'}`} style={{ fontFamily: 'var(--app-font-sans)' }}>{stage.name}</p>
                {stage.state === 'break' && (
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Primary break</p>
                )}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 border-l-2 border-[#e96a3a] pl-4">
          <p className="font-display text-[15px] leading-[1.4] tracking-[-.02em] text-[#f5f0e7]/70">“The buyer never reaches a rational reason to pay — paid only offers more of what free already solved.”</p>
        </div>
      </div>
    </div>
  );
}

function SampleDiagnosisPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = 'Sample Revenue Leak Diagnosis — Nasiba';
    const description = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'See an illustrative Revenue Leak Diagnosis showing how Nasiba identifies the commercial break, root cause, buying event, offer logic and priority map for a SaaS product.');
    document.head.appendChild(description);
    const ogTitle = document.querySelector('meta[property="og:title"]') ?? document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Sample Revenue Leak Diagnosis — Nasiba');
    document.head.appendChild(ogTitle);
    const ogDescription = document.querySelector('meta[property="og:description"]') ?? document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'See an illustrative Revenue Leak Diagnosis showing how Nasiba identifies the commercial break, root cause, buying event, offer logic and priority map for a SaaS product.');
    document.head.appendChild(ogDescription);
  }, []);

  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    if (id === 'revenue-architecture') { setLocation('/revenue-architecture'); return; }
    if (id === 'diagnosis') { setLocation('/diagnosis'); return; }
    setLocation('/');
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Compact hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Sample Revenue Leak Diagnosis</p>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[.9] tracking-[-.06em] text-[#f5f0e7]">
            See what the diagnosis actually produces.
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-[1.55] text-[#f5f0e7]/70">
            A simplified example of how Nasiba identifies the commercial break, explains why it exists, and maps what should change first.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#f5f0e7]/55" style={{ fontFamily: 'var(--app-font-sans)' }}>
            <span>ILLUSTRATIVE EXAMPLE</span>
            <span>NO CLIENT DATA</span>
            <span>NO MEASURED RESULTS</span>
          </div>
          <p className="mt-4 max-w-[620px] border-l-2 border-[#e96a3a] pl-4 text-[13px] leading-[1.5] text-[#f5f0e7]/60">
            This example is illustrative. It does not represent confidential client data or measured client results.
          </p>
        </div>

        {/* Scenario — the fictional product the diagnosis runs on */}
        <Reveal>
          <div className="mt-20">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>The scenario</p>
            <h2 className="mt-5 max-w-[560px] font-display text-[clamp(1.9rem,3.5vw,3rem)] leading-[.92] tracking-[-.05em]">A B2B SaaS workflow tool.</h2>
            <p className="mt-4 max-w-[560px] text-[14px] leading-[1.5] text-[#f5f0e7]/55" style={{ fontFamily: 'var(--app-font-sans)' }}>
              A fictional product used throughout this example. Any resemblance to a specific company is coincidental.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border-t border-[#f5f0e7]/15 py-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Product type</h3>
                <p className="mt-3 max-w-[320px] text-[15px] leading-[1.55] text-[#f5f0e7]/68">A B2B SaaS workflow tool.</p>
              </div>
              <div className="border-t border-[#f5f0e7]/15 py-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Current commercial model</h3>
                <p className="mt-3 max-w-[320px] text-[15px] leading-[1.55] text-[#f5f0e7]/68"><span className="text-[#f5f0e7]/85">Free plan:</span> solves the core individual workflow. <span className="text-[#f5f0e7]/85">Paid plan:</span> mostly increases usage limits and adds minor convenience features.</p>
              </div>
              <div className="border-t border-[#f5f0e7]/15 py-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Observed problem</h3>
                <p className="mt-3 max-w-[320px] text-[15px] leading-[1.55] text-[#f5f0e7]/68">Users adopt the product, but paid upgrades remain weak. There is usage and demand, but no strong commercial transition from free usage to payment.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Leak map — one strong visual artifact */}
        <div className="mt-20">
          <SampleLeakMap />
        </div>

        {/* Six diagnostic outputs — same structure as the actual deliverable */}
        <div className="mt-24">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>The diagnosis</p>
            <h2 className="mt-5 max-w-[640px] font-display text-[clamp(2rem,4vw,3.4rem)] leading-[.9] tracking-[-.06em]">The six outputs, as a client would receive them.</h2>
          </Reveal>

          <div className="mt-14 border-t border-[#f5f0e7]/15">
            {sampleOutputs.map((section, idx) => (
              <Reveal key={section.number} delay={.05 + idx * .05}>
                <article className="grid grid-cols-1 gap-6 border-b border-[#f5f0e7]/15 py-10 sm:grid-cols-[140px_1fr] sm:gap-10">
                  <div>
                    <span className="font-mono-ui text-[10px] text-[#e96a3a]">{section.number}</span>
                    <h3 className="mt-3 text-[11px] font-semibold uppercase tracking-[.1em] text-[#f5f0e7]/75" style={{ fontFamily: 'var(--app-font-sans)' }}>{section.title}</h3>
                  </div>
                  <div className="max-w-[720px]">
                    <p className="font-display text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.05] tracking-[-.04em] text-[#f5f0e7]">{section.headline}</p>
                    <p className="mt-4 text-[16px] leading-[1.6] text-[#f5f0e7]/70">{section.explanation}</p>

                    {section.upgradeAsks && (
                      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="border border-[#f5f0e7]/15 radius-block px-4 py-3.5">
                          <p className="text-[9px] font-semibold uppercase tracking-[.12em] text-[#f5f0e7]/45" style={{ fontFamily: 'var(--app-font-sans)' }}>The upgrade currently asks</p>
                          <p className="mt-2 font-display text-[16px] leading-[1.35] tracking-[-.02em] text-[#f5f0e7]/60">{section.upgradeAsks.current}</p>
                        </div>
                        <div className="border border-[#e96a3a]/40 radius-block px-4 py-3.5">
                          <p className="text-[9px] font-semibold uppercase tracking-[.12em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>It should ask</p>
                          <p className="mt-2 font-display text-[16px] leading-[1.35] tracking-[-.02em] text-[#f5f0e7]">{section.upgradeAsks.shouldAsk}</p>
                        </div>
                      </div>
                    )}

                    {section.signals && (
                      <div className="mt-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#f5f0e7]/50" style={{ fontFamily: 'var(--app-font-sans)' }}>{section.number === '03' ? 'Possible value signals' : 'Possible signals'}</p>
                        <ul className="mt-3 grid max-w-[560px] grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                          {section.signals.map((signal) => (
                            <li key={signal} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-[#f5f0e7]/65"><span className="mt-2 h-px w-3 shrink-0 bg-[#e96a3a]" />{signal}</li>
                          ))}
                        </ul>
                        {section.signalsNote && (
                          <p className="mt-3 text-[12px] italic leading-[1.5] text-[#f5f0e7]/45">{section.signalsNote}</p>
                        )}
                      </div>
                    )}

                    {section.diagnosticQuestion && (
                      <p className="mt-6 border-l-2 border-[#e96a3a] pl-4 font-display text-[16px] italic leading-[1.45] tracking-[-.02em] text-[#f5f0e7]/75">{section.diagnosticQuestion}</p>
                    )}

                    {section.ladder && (
                      <div className="mt-6 max-w-[480px]">
                        {section.ladder.map((step, i) => (
                          <Fragment key={step.stage}>
                            {i > 0 && <div className="flex justify-center py-2 text-[#e96a3a]" aria-hidden="true">↓</div>}
                            <div className="border border-[#f5f0e7]/15 radius-block px-5 py-4">
                              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>{step.stage}</p>
                              <p className="mt-1.5 font-display text-[16px] leading-[1.35] tracking-[-.02em] text-[#f5f0e7]/85">{step.body}</p>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 border-l-2 border-[#e96a3a] pl-4">
                      <p className="text-[10px] font-medium uppercase tracking-[.1em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>Commercial consequence</p>
                      <p className="mt-2 text-[15px] leading-[1.5] text-[#f5f0e7]/65">{section.consequence}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Priority map — ranked rows */}
        <div className="mt-24">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>06 · Priority Map</p>
            <h2 className="mt-5 max-w-[640px] font-display text-[clamp(2rem,4vw,3.4rem)] leading-[.9] tracking-[-.06em]">What should change first.</h2>
          </Reveal>
          <div className="mt-12 border-t border-[#f5f0e7]/15">
            {samplePriorities.map((priority, idx) => (
              <Reveal key={priority.rank} delay={.08 + idx * .08}>
                <div className="grid grid-cols-1 gap-3 border-b border-[#f5f0e7]/15 py-7 sm:grid-cols-[130px_1fr] sm:gap-8">
                  <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>{priority.rank}</span>
                  <div className="max-w-[680px]">
                    <p className="font-display text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.15] tracking-[-.03em] text-[#f5f0e7]">{priority.title}</p>
                    <p className="mt-2 text-[14px] leading-[1.5] text-[#f5f0e7]/60"><span className="font-semibold uppercase tracking-[.08em] text-[#f5f0e7]/45" style={{ fontFamily: 'var(--app-font-sans)' }}>Why {priority.rank === 'PRIORITY 1' ? 'first' : priority.rank === 'PRIORITY 2' ? 'second' : 'third'}:</span> {priority.why}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <p className="max-w-[640px] font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.08] tracking-[-.04em]">If your SaaS already has users and demand but too little of it becomes revenue, start with the diagnosis.</p>
          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 radius-btn text-[11px] font-bold uppercase tracking-[.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" style={{ fontFamily: 'var(--app-font-sans)' }}>START THE DIAGNOSIS <ArrowRight size={16} className="transition-transform duration-[160ms] group-hover:translate-x-1" /></a>
            <a href="/diagnosis" className="text-[11px] font-medium uppercase tracking-[.12em] text-[#f5f0e7]/50 border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]" style={{ fontFamily: 'var(--app-font-sans)' }}>BACK TO REVENUE LEAK DIAGNOSIS</a>
          </div>
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}

/* ─── Router ─── */

export function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/cases" component={CasesIndex} />
        <Route path="/cases/:slug">
          {(params) => <CaseDetail slug={params.slug} />}
        </Route>
        <Route path="/diagnosis" component={DiagnosisPage} />
        <Route path="/sample-diagnosis" component={SampleDiagnosisPage} />
        <Route path="/start" component={StartPage} />
        <Route path="/revenue-architecture" component={RevenueArchitecturePage} />
        <Route path="/architecture" component={ArchitectureRedirect} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

/* ─── App ─── */

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
