import { type ReactNode, useEffect, useState } from 'react';
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
    problem: 'The product explained monitoring functionality before making the trader outcome sufficiently obvious.',
    intervention: 'Repositioned the hero around faster identification of high-confluence setups, fewer charts, and decision filtering.',
    shortOutcome: 'The product moved from mechanism-led messaging toward a clearer outcome-led hero built around the trader\'s decision process.',
    shift: { from: 'Monitor symbols and timeframes', to: 'Find high-confluence setups in seconds — not after 30 charts.', label: 'POSITIONING SHIFT' },
  },
  {
    slug: 'convert-fast',
    name: 'Convert.FAST',
    engagement: 'Positioning · Hero Architecture',
    problem: 'The product was more capable than the hero made it appear. The opportunity was to make the primary job-to-be-done explicit.',
    intervention: 'Moved from generic file conversion toward bulk processing, speed, explicit workflow and explicit output.',
    shortOutcome: 'The hero became more specific and aligned the product\'s strongest capability with a concrete user job.',
    shift: { from: 'File conversion', to: 'Bulk File Conversion. Fast.', label: 'PRIMARY JOB', supporting: 'Drop up to 1,000 files. Get one ZIP back.' },
  },
  {
    slug: 'creativelens',
    name: 'CreativeLens',
    engagement: 'Messaging · Economic Framing',
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

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-6 flex items-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-[#e96a3a]' : 'text-[#e15b2e]'}`}>
      <span className="h-px w-8 bg-current" />
      <span>{children}</span>
    </div>
  );
}

/* ─── Shared Footer ─── */

function SiteFooter({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const dark = variant === 'dark';
  const textMain = dark ? 'text-[#f5f0e7]' : 'text-[#202536]';
  const textMuted = dark ? 'text-[#f5f0e7]/38' : 'text-[#6c6b68]';
  const border = dark ? 'border-[#f5f0e7]/20' : 'border-[#cfc7b7]';
  const accentBorder = dark ? 'border-[#e96a3a]' : 'border-[#e15b2e]';
  const linkHover = dark ? 'hover:text-[#e96a3a] hover:border-[#e96a3a]' : 'hover:text-[#e15b2e] hover:border-[#e15b2e]';

  return (
    <footer className={`mt-24 border-t ${border} pt-10`}>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className={`flex h-7 w-7 items-center justify-center border ${accentBorder} font-mono-ui text-[11px] font-bold ${dark ? 'text-[#e96a3a]' : 'text-[#e15b2e]'}`}>N</span>
            <span className={`font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] ${textMain}`}>NASIBA</span>
          </div>
          <p className={`mt-4 font-mono-ui text-[9px] uppercase tracking-[.13em] ${textMuted}`}>Revenue Architecture for SaaS.</p>
        </div>

        {/* Navigation */}
        <div>
          <p className={`font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] ${textMuted} mb-4`}>Navigation</p>
          <ul className="space-y-2">
            {[
              { label: 'Diagnosis', href: '/diagnosis' },
              { label: 'Revenue Architecture', href: '/revenue-architecture' },
              { label: 'Cases', href: '/cases' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className={`font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] ${textMuted} mb-4`}>Contact</p>
          <a href="mailto:paul@nasiba.co" className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>paul@nasiba.co</a>
        </div>

        {/* Founder */}
        <div>
          <p className={`font-mono-ui text-[9px] font-bold uppercase tracking-[.14em] ${textMuted} mb-4`}>Founder</p>
          <p className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted}`}>Paul — Founder &amp; Principal</p>
          <div className="mt-3 space-y-2">
            <p>
              <a href="https://www.linkedin.com/in/paul-coll/" target="_blank" rel="noopener noreferrer" className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>LinkedIn →</a>
            </p>
            <p>
              <a href="https://x.com/1Paul_coll" target="_blank" rel="noopener noreferrer" className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>X / Twitter →</a>
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-10 flex flex-col justify-between gap-4 border-t ${border} pt-6 sm:flex-row sm:items-center`}>
        <div className={`font-mono-ui text-[9px] uppercase tracking-[.13em] ${textMuted}`}>&copy; {new Date().getFullYear()} Nasiba</div>
        <div className="flex gap-5">
          <a href="/privacy" className={`font-mono-ui text-[9px] uppercase tracking-[.13em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>Privacy</a>
          <a href="/terms" className={`font-mono-ui text-[9px] uppercase tracking-[.13em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>Terms</a>
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
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between border-b ${border} pb-5`}>
        <a href="/" className={`group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 ${accentBorder}`} aria-label="NASIBA, back to top">
          <span className={`flex h-7 w-7 items-center justify-center border ${accentBorder} font-mono-ui text-[11px] font-bold ${accentText}`}>N</span>
          <span>
            <span className={`block font-mono-ui text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${accentText}`}>NASIBA</span>
            <span className={`mt-0.5 block font-mono-ui text-[8px] uppercase tracking-[0.12em] ${dark ? 'text-[#f5f0e7]/45' : 'text-[#202536]/45'}`}>Revenue architecture for SaaS</span>
          </span>
        </a>
        <nav className="hidden items-center gap-5 xl:gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} onClick={(e) => { if (item.href.startsWith('/#')) { e.preventDefault(); scrollToSection(item.id); } }} className={`font-mono-ui text-[9px] uppercase tracking-[0.13em] ${textMuted} transition-colors ${dark ? 'hover:text-[#f5f0e7]' : 'hover:text-[#202536]'} focus-visible:outline-none focus-visible:ring-2 ${accentBorder} focus-visible:ring-offset-2 ${dark ? 'focus-visible:ring-offset-[#202536]' : 'focus-visible:ring-offset-[#f5f0e7]'}`}>
              {item.label}
            </a>
          ))}
          <a href="/start" className={`flex items-center gap-2 ${btnBg} px-4 py-2.5 font-mono-ui text-[9px] font-bold uppercase tracking-[0.1em] ${btnText} transition-colors ${hoverBg} focus-visible:outline-none focus-visible:ring-2 ${dark ? 'focus-visible:ring-[#f5f0e7]' : 'focus-visible:ring-[#202536]'}`}>
            START DIAGNOSIS <ArrowRight size={13} strokeWidth={2.5} />
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
            <a key={item.id} href={item.href} onClick={(e) => { if (item.href.startsWith('/#')) { e.preventDefault(); scrollToSection(item.id); } }} className={`flex w-full items-center justify-between border-b ${dark ? 'border-[#f5f0e7]/10' : 'border-[#cfc7b7]'} px-3 py-4 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] ${dark ? 'text-[#f5f0e7]/75' : 'text-[#202536]/75'} last:border-0 focus-visible:outline-none focus-visible:ring-2 ${accentBorder}`}>
              {item.label}
              <ArrowDownRight size={14} className={accentText} />
            </a>
          ))}
          <a href="/start" className={`mt-3 flex w-full items-center justify-between ${btnBg} px-3 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] ${btnText}`}>
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
      <div className="mx-auto grid min-h-[780px] max-w-[1400px] grid-cols-1 items-end gap-16 px-5 pb-20 pt-40 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)] lg:gap-20 lg:px-12 lg:pb-28 lg:pt-48">
        <div className="reveal max-w-[790px]">
          <div className="mb-6 flex items-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#e96a3a]">
            <span className="h-px w-8 bg-current" />
            <span>Commercial diagnosis</span>
          </div>
          <h1 className="font-display text-[clamp(4.5rem,10vw,9rem)] leading-[.87] tracking-[-0.07em] text-[#f5f0e7]">
            Find where your SaaS is <span className="text-[#e96a3a]">losing revenue.</span>
          </h1>
          <p className="mt-9 max-w-[650px] text-balance text-[18px] leading-[1.55] text-[#f5f0e7]/68 sm:text-[21px]">
            An asynchronous diagnosis of the commercial gaps between product interest and payment — from positioning and economic value to buying events, upgrade logic and messaging.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]">
              START THE REVENUE LEAK DIAGNOSIS <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="mt-7 font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] text-[#f5f0e7]/78">$1,000 · 3–4 DAYS · ASYNCHRONOUS</div>
          <p className="mt-5 max-w-[520px] text-[14px] leading-[1.5] text-[#f5f0e7]/48">For SaaS products that already have users, traffic or demand — but aren&apos;t converting enough of it into revenue.</p>
        </div>
        <div className="reveal reveal-delay-2 relative min-h-[300px] lg:mb-4">
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#f5f0e7]/25 pt-4">
            <div className="mb-8 flex items-center justify-between font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[#f5f0e7]/50"><span>Where interest stops</span><span className="text-[#e96a3a]">→</span></div>
            <div className="relative flex h-[150px] items-end justify-between gap-2">
              {[82, 63, 49, 36, 25, 17].map((height, index) => (
                <div key={height} className="relative flex h-full flex-1 items-end">
                  <div className={`w-full ${index === 3 ? 'bg-[#e96a3a]' : 'bg-[#f5f0e7]/20'}`} style={{ height: `${height}%` }} />
                  {index === 3 && <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono-ui text-[9px] uppercase tracking-[.1em] text-[#e96a3a]">the leak</span>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f5f0e7]/40"><span>Demand</span><span>Payment</span></div>
          </div>
          <p className="absolute right-0 top-0 max-w-[190px] border-l border-[#e96a3a] pl-4 text-[14px] leading-[1.45] text-[#f5f0e7]/65">No more guessing which page, plan, or CTA to rewrite first.</p>
        </div>
      </div>
    </section>
  );
}

/* Revenue Path — with thesis idea integrated, single canonical DOM structure */
function RevenuePathMap() {
  const steps = [
    { name: 'INTEREST', active: true },
    { name: 'UNDERSTANDING', active: true },
    { name: 'ECONOMIC VALUE', active: true },
    { name: 'BUYING EVENT', active: false },
    { name: 'PAYMENT', active: true },
    { name: 'EXPANSION', active: true },
  ];
  const annotations = [
    { position: 'ECONOMIC VALUE', text: '"Buyer understands the product but cannot justify the price."', side: 'bottom' as const },
    { position: 'BUYING EVENT', text: '"Free solves the core job. Paid only adds usage."', side: 'top' as const },
    { position: 'PAYMENT', text: '"Enterprise value exists, but the product is still framed as a utility."', side: 'bottom' as const },
  ];

  return (
    <section id="path" className="bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="max-w-[800px]">
          <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[#e96a3a]">The Revenue Path</p>
          <h2 className="mt-6 font-display text-[clamp(3rem,6vw,6rem)] leading-[.9] tracking-[-.07em]">Interest is not revenue.</h2>
          <p className="mt-6 max-w-[600px] text-[17px] leading-[1.6] text-[#f5f0e7]/55">
            Most monetization problems aren&apos;t copy problems. Revenue moves through a sequence of commercial transitions. When one breaks, demand stops becoming payment.
          </p>
        </div>

        {/* The broken path diagram — single canonical structure, CSS responsive */}
        <div className="mt-20 border-t border-[#f5f0e7]/15 pt-12">
          <div className="relative">
            {/* Desktop: horizontal path */}
            <div className="hidden lg:flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step.name} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-12 w-12 items-center justify-center border font-mono-ui text-[9px] font-bold tracking-[.1em] ${step.active ? 'border-[#e96a3a] text-[#e96a3a]' : 'border-[#f5f0e7]/20 text-[#f5f0e7]/30'}`}>
                      {step.active ? <Check size={16} /> : <span className="text-[#e96a3a]">✗</span>}
                    </div>
                    <span className={`mt-3 font-mono-ui text-[9px] uppercase tracking-[.12em] ${step.active ? 'text-[#f5f0e7]/70' : 'text-[#e96a3a]'}`}>{step.name}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`mx-3 h-px w-16 ${step.active && steps[i + 1].active ? 'bg-[#f5f0e7]/25' : 'bg-[#e96a3a]/40 border-t border-dashed border-[#e96a3a]'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical path */}
            <div className="lg:hidden space-y-0">
              {steps.map((step, i) => (
                <div key={step.name} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-10 w-10 items-center justify-center border font-mono-ui text-[9px] font-bold ${step.active ? 'border-[#e96a3a] text-[#e96a3a]' : 'border-[#f5f0e7]/20 text-[#f5f0e7]/30'}`}>
                      {step.active ? <Check size={14} /> : <span className="text-[#e96a3a]">✗</span>}
                    </div>
                    {i < steps.length - 1 && <div className={`w-px h-8 ${step.active && steps[i + 1].active ? 'bg-[#f5f0e7]/25' : 'bg-[#e96a3a]/40'}`} />}
                  </div>
                  <span className={`pt-2.5 font-mono-ui text-[10px] uppercase tracking-[.12em] ${step.active ? 'text-[#f5f0e7]/70' : 'text-[#e96a3a]'}`}>{step.name}</span>
                </div>
              ))}
            </div>

            {/* Annotations */}
            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {annotations.map((a) => (
                <div key={a.position} className="border-l-2 border-[#e96a3a] pl-5">
                  <p className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#e96a3a]">{a.position}</p>
                  <p className="mt-3 font-display text-[17px] leading-[1.4] tracking-[-.02em] text-[#f5f0e7]/60 italic">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Leak examples — varied visual treatment, not uniform feature cards */
function RevenueLeakExamples() {
  return (
    <section className="bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="max-w-[900px]">
          <h2 className="font-display text-[clamp(2.8rem,5.5vw,5rem)] leading-[.9] tracking-[-.07em] text-[#202536]">
            What a revenue leak actually looks like.
          </h2>
        </div>

        {/* Example 1 — wide annotation style */}
        <div className="mt-20 border-t border-[#202536]/15 pt-12 pb-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[120px_1fr] lg:gap-16">
            <div>
              <span className="font-mono-ui text-[11px] text-[#e15b2e]">01</span>
              <p className="mt-3 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#e15b2e]">Path marker: Buying Event</p>
            </div>
            <div className="max-w-[680px]">
              <h3 className="font-display text-[28px] leading-[1.1] tracking-[-.03em] text-[#202536]">FREE SOLVES THE CORE JOB.</h3>
              <p className="mt-4 text-[17px] leading-[1.55] text-[#55575c]">The paid plan adds more usage, but no materially different outcome.</p>
              <div className="mt-6 border-l-2 border-[#e15b2e] pl-5">
                <p className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#e15b2e]">Commercial consequence</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#55575c]">The user likes the product but has no economic reason to upgrade.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example 2 — right-aligned annotation */}
        <div className="border-t border-[#202536]/15 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono-ui text-[11px] text-[#e15b2e]">02</span>
                <span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#e15b2e]">Path marker: Economic Value</span>
              </div>
              <h3 className="font-display text-[28px] leading-[1.1] tracking-[-.03em] text-[#202536]">THE ENTERPRISE VALUE IS REAL.</h3>
              <p className="mt-4 max-w-[520px] text-[17px] leading-[1.55] text-[#55575c]">The homepage still sells the product as a developer utility.</p>
            </div>
            <div className="flex items-start border-l-2 border-[#e15b2e] pl-5 lg:mt-8">
              <div>
                <p className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#e15b2e]">Commercial consequence</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-[#55575c]">High-value buyers compare it against cheap tools instead of infrastructure or headcount.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example 3 — marginal note style */}
        <div className="border-t border-[#202536]/15 pt-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[120px_1fr] lg:gap-16">
            <div>
              <span className="font-mono-ui text-[11px] text-[#e15b2e]">03</span>
              <p className="mt-3 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#e15b2e]">Path marker: Expansion</p>
            </div>
            <div className="max-w-[680px]">
              <h3 className="font-display text-[28px] leading-[1.1] tracking-[-.03em] text-[#202536]">THE BUYING SIGNAL ALREADY EXISTS.</h3>
              <p className="mt-4 text-[17px] leading-[1.55] text-[#55575c]">The customer becomes operationally overwhelmed, but the product never surfaces the next offer.</p>
              <p className="mt-6 font-display text-[18px] leading-[1.4] tracking-[-.02em] text-[#202536]/45 italic">Expansion only happens after the customer asks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Consolidated Diagnosis + Offer — one primary homepage section */
function Diagnosis() {
  return (
    <section id="diagnosis" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
          <div>
            <h2 className="max-w-[760px] font-display text-[clamp(3.5rem,6vw,6.4rem)] leading-[.88] tracking-[-.08em] text-[#202536]">
              One diagnosis.<br /><em className="text-[#e15b2e]">A clear commercial map.</em>
            </h2>
            <p className="mt-9 max-w-[540px] text-[18px] leading-[1.5] text-[#55575c]">
              A focused async commercial diagnosis of where the path from interest to payment is breaking — covering positioning, economic framing, offer and upgrade logic, buying events, pricing logic, and messaging implications.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-px border-y border-[#cfc7b7] bg-[#cfc7b7] md:grid-cols-2 lg:grid-cols-3">
              {outputs.map(([number, title, body]) => (
                <article key={number} className="min-h-[200px] bg-[#f5f0e7] p-5 sm:p-6">
                  <span className="font-mono-ui text-[10px] text-[#e15b2e]">{number}</span>
                  <h3 className="mt-8 font-display text-[26px] leading-[.95] tracking-[-.05em] text-[#202536]">{title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.5] text-[#55575c]">{body}</p>
                </article>
              ))}
            </div>
          </div>
          <div id="offer" className="bg-[#202536] p-7 text-[#f5f0e7] sm:p-10">
            <div className="flex items-start justify-between border-b border-[#f5f0e7]/20 pb-8">
              <span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#e96a3a]">The working room</span>
              <span className="font-display text-[52px] leading-none tracking-[-.06em]">$1,000</span>
            </div>
            <p className="mt-8 text-[17px] leading-[1.5] text-[#f5f0e7]/78">A fixed-scope inspection that identifies where revenue is leaking and gives you a clear commercial map for what to do next.</p>
            <ul className="mt-8 space-y-4 text-[15px] leading-[1.45] text-[#f5f0e7]/70">
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Positioning diagnosis</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Economic framing analysis</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Offer / upgrade architecture</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Buying-event analysis</li>
              <li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Priority recommendations</li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#f5f0e7]/55">
              <span>3–4 DAYS</span>
              <span>ASYNCHRONOUS</span>
              <span>FIXED SCOPE</span>
            </div>
            <a href="/start" className="mt-8 flex w-full items-center justify-between bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]">
              START THE DIAGNOSIS <ArrowRight size={16} />
            </a>
            <p className="mt-8 border-t border-[#f5f0e7]/15 pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#f5f0e7]/40">No retainer. No recurring commitment. No ongoing consulting.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Client Work — heading change, no agency framing */
function CasesTeaser() {
  return (
    <section id="client-work" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="max-w-[700px]">
          <h2 className="font-display text-[clamp(3rem,5.5vw,5rem)] leading-[.88] tracking-[-.07em] text-[#202536]">Client work.</h2>
          <p className="mt-6 text-[17px] leading-[1.6] text-[#55575c]">Selected commercial work across SaaS products.</p>
        </div>

        <div className="mt-16 space-y-0">
          {casesData.map((c) => (
            <div key={c.slug} className="border-t border-[#cfc7b7]">
              <a href={`/cases/${c.slug}`} className="group block py-10 transition-colors hover:bg-[#f5f0e7]/60 sm:py-12">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="sm:w-[200px]">
                    <h3 className="font-mono-ui text-[12px] font-bold uppercase tracking-[.14em] text-[#202536] group-hover:text-[#e15b2e]">{c.name}</h3>
                    <p className="mt-2 font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#6c6b68]">{c.engagement}</p>
                  </div>
                  <div className="flex-1 max-w-[600px]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                      <div className="flex-1">
                        <p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#6c6b68]">{c.shift.label}</p>
                        <p className="mt-2 font-display text-[15px] leading-[1.4] tracking-[-.01em] text-[#202536]/40 line-through">{c.shift.from}</p>
                      </div>
                      <span className="hidden sm:block font-mono-ui text-[14px] text-[#e15b2e]">→</span>
                      <div className="flex-1">
                        <p className="font-display text-[17px] leading-[1.35] tracking-[-.02em] text-[#202536]">{c.shift.to}</p>
                        {c.shift.supporting && <p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#6c6b68]">{c.shift.supporting}</p>}
                      </div>
                    </div>
                  </div>
                  <span className="hidden sm:block font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e15b2e] opacity-0 transition-opacity group-hover:opacity-100">VIEW CASE →</span>
                </div>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a href="/cases" className="inline-flex items-center gap-3 border-b border-[#e15b2e] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e15b2e] transition-colors hover:text-[#c94a22]">VIEW ALL CASES →</a>
        </div>
      </div>
    </section>
  );
}

/* Revenue Architecture — deeper engagement */
function Engagement() {
  return (
    <section id="engagement" className="scroll-mt-10 bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[#e96a3a]">The deeper engagement</p>
            <h2 className="mt-6 max-w-[500px] font-display text-[clamp(3rem,5.5vw,5.5rem)] leading-[.88] tracking-[-.07em]">Diagnose.<br /><em className="text-[#e96a3a]">Then rebuild.</em></h2>
            <p className="mt-8 max-w-[350px] text-[16px] leading-[1.6] text-[#f5f0e7]/60">Two steps, only when the problem calls for both.</p>
          </div>
          <div>
            <div className="border-t border-[#f5f0e7]/20 py-8">
              <div className="flex items-start gap-5">
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">01</span>
                <div>
                  <h3 className="font-display text-[40px] leading-none tracking-[-.05em]">DIAGNOSE</h3>
                  <p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/65">Find the leak, its root cause, and the priority map. This is enough when one commercial transition is unclear.</p>
                </div>
              </div>
            </div>
            <div className="border-y border-[#f5f0e7]/20 py-8">
              <div className="flex items-start gap-5">
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">02</span>
                <div>
                  <h3 className="font-display text-[40px] leading-none tracking-[-.05em]">REBUILD</h3>
                  <p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/65">For products where the diagnosis reveals a broader problem in how positioning, economics, offers, buying events and upgrades work together.</p>
                  <div className="mt-5 flex items-baseline gap-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#e96a3a]">
                    <span>$10,000</span>
                    <span>2 weeks · Asynchronous</span>
                  </div>
                  <ul className="mt-6 grid max-w-[570px] grid-cols-1 gap-x-6 gap-y-3 border-t border-[#f5f0e7]/15 pt-5 font-mono-ui text-[10px] uppercase leading-[1.5] tracking-[.1em] text-[#f5f0e7]/55 sm:grid-cols-2">
                    <li>— Positioning audit</li>
                    <li>— Economic framing</li>
                    <li>— Offer ladder restructuring</li>
                    <li>— Buying-event design</li>
                    <li>— Pricing &amp; upgrade logic</li>
                    <li>— Homepage &amp; messaging implementation guidance</li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="mt-9 max-w-[580px] font-display text-[29px] leading-[1.05] tracking-[-.04em] text-[#f5f0e7]">The diagnosis identifies the leak. Revenue Architecture rebuilds the system around it.</p>
            <p className="mt-5 max-w-[530px] text-[15px] leading-[1.55] text-[#f5f0e7]/58">Not every diagnosis requires deeper work. The second engagement exists when the commercial problem is architectural rather than isolated.</p>
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
      <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <h2 className="max-w-[480px] font-display text-[clamp(3rem,5vw,5rem)] leading-[.9] tracking-[-.07em] text-[#202536]">Built for SaaS with demand — but unclear conversion.</h2>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="border-t border-[#202536]/20 pt-6">
              <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#202536]/50">Good fit</span>
              <ul className="mt-6 space-y-4">
                {goodFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#55575c]"><Check size={16} className="mt-0.5 shrink-0 text-[#e15b2e]" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[#202536]/20 pt-6">
              <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#202536]/50">Not fit</span>
              <ul className="mt-6 space-y-4">
                {notFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#55575c]"><Minus size={16} className="mt-0.5 shrink-0 text-[#202536]/30" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* FAQ — reduced to 5 genuine buying objections */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-10 bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1100px] px-5 py-28 sm:px-8 lg:py-36">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <h2 className="font-display text-[clamp(3.3rem,5.5vw,5.6rem)] leading-[.9] tracking-[-.07em] text-[#202536]">The useful<br /><em className="text-[#e15b2e]">short version.</em></h2>
          <div className="border-t border-[#202536]/15">
            {homepageFaqs.map(([question, answer], index) => {
              const isOpen = openIndex === index;
              return (
                <div key={question} className="border-b border-[#202536]/15">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e15b2e]" aria-expanded={isOpen}>
                    <span className="font-display text-[25px] leading-[1.1] tracking-[-.03em] text-[#202536]">{question}</span>
                    <ChevronDown size={18} className={`shrink-0 text-[#e15b2e] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <div className="max-w-[620px] pb-7 pr-8 text-[15px] leading-[1.6] text-[#55575c]">{answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Final CTA — reduced price repetition */
function FinalCTA({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section className="bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="max-w-[1000px]">
          <h2 className="font-display text-[clamp(4rem,9vw,9.2rem)] leading-[.84] tracking-[-.08em]">Your product may not need more traffic<span className="text-[#e96a3a]">.</span></h2>
          <p className="mt-8 max-w-[590px] text-[18px] leading-[1.55] text-[#f5f0e7]/60">It may need a better path from the attention you already have to the revenue you want.</p>
          <div className="mt-12 flex flex-col items-start gap-7 sm:flex-row sm:items-center">
            <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]">START THE DIAGNOSIS → <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
            <a href="mailto:paul@nasiba.co" className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45 border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">EMAIL PAUL</a>
          </div>
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
          <div className="mb-6 flex items-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#e96a3a]">
            <span className="h-px w-8 bg-current" />
            <span>REVENUE LEAK DIAGNOSIS</span>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-[.88] tracking-[-.07em]">
            Start with the problem.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.55] text-[#f5f0e7]/65">
            Give us the minimum context needed to understand where monetization appears to be breaking. If it looks like a fit, you&apos;ll receive the next step by email.
          </p>
          <div className="mt-6 flex items-baseline gap-4 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#f5f0e7]/55">
            <span>$1,000</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>3–4 days</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>asynchronous</span>
          </div>
        </div>

        {submitted ? (
          <div className="mt-16 border-t border-[#f5f0e7]/20 pt-12">
            <div className="mb-6 flex items-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#e96a3a]">
              <span className="h-px w-8 bg-current" />
              <span>SUBMITTED</span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[.9] tracking-[-.06em]">
              REQUEST RECEIVED.
            </h2>
            <p className="mt-6 max-w-[480px] text-[17px] leading-[1.55] text-[#f5f0e7]/65">
              If the diagnosis looks like a fit, Paul will reply by email with the next step and payment details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-12 border-t border-[#f5f0e7]/20 pt-10 space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="start-name" className="block font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/60 mb-3">Name</label>
              <input
                id="start-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`w-full border ${fieldErrors.name ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-transparent px-4 py-3.5 font-mono-ui text-[13px] text-[#f5f0e7] outline-none transition-colors placeholder:text-[#f5f0e7]/30 focus:border-[#e96a3a] sm:text-[14px]`}
                placeholder="Your name"
              />
              {fieldErrors.name && <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#e96a3a]">{fieldErrors.name}</p>}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="start-website" className="block font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/60 mb-3">Company / product URL</label>
              <input
                id="start-website"
                name="website"
                type="url"
                autoComplete="url"
                required
                className={`w-full border ${fieldErrors.website ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-transparent px-4 py-3.5 font-mono-ui text-[13px] text-[#f5f0e7] outline-none transition-colors placeholder:text-[#f5f0e7]/30 focus:border-[#e96a3a] sm:text-[14px]`}
                placeholder="https://"
              />
              {fieldErrors.website && <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#e96a3a]">{fieldErrors.website}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="start-email" className="block font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/60 mb-3">Work email</label>
              <input
                id="start-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full border ${fieldErrors.email ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-transparent px-4 py-3.5 font-mono-ui text-[13px] text-[#f5f0e7] outline-none transition-colors placeholder:text-[#f5f0e7]/30 focus:border-[#e96a3a] sm:text-[14px]`}
                placeholder="you@company.com"
              />
              {fieldErrors.email && <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.1em] text-[#e96a3a]">{fieldErrors.email}</p>}
            </div>

            {/* Primary Issue */}
            <div>
              <label htmlFor="start-issue" className="block font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/60 mb-3">Where does the problem seem to be?</label>
              <select
                id="start-issue"
                name="primaryIssue"
                required
                className={`w-full border ${fieldErrors.primaryIssue ? 'border-[#e96a3a]' : 'border-[#f5f0e7]/20'} bg-[#202536] px-4 py-3.5 font-mono-ui text-[13px] text-[#f5f0e7] outline-none transition-colors focus:border-[#e96a3a] sm:text-[14px]`}
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
                className="flex w-full items-center justify-between bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7] disabled:opacity-60 disabled:cursor-not-allowed"
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
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <div className="mb-6 flex items-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#e96a3a]">
            <span className="h-px w-8 bg-current" />
            <span>REVENUE ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em]">
            Rebuild the path from interest to revenue.
          </h1>
          <p className="mt-6 max-w-[640px] text-[18px] leading-[1.55] text-[#f5f0e7]/65">
            When the diagnosis shows that the problem is structural, Revenue Architecture redesigns the commercial system around the buying decision — positioning, economic framing, offers, buying events, pricing and upgrade logic.
          </p>
          <div className="mt-6 flex items-baseline gap-4 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#f5f0e7]/55">
            <span>$10,000</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>2 weeks</span>
            <span className="text-[#f5f0e7]/30">·</span>
            <span>asynchronous</span>
          </div>
        </div>

        {/* What it covers */}
        <div className="mt-28">
          <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[#e96a3a]">What the engagement covers</p>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {covers.map(([title, body]) => (
              <article key={title} className="border-t border-[#f5f0e7]/20 py-6">
                <h3 className="font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#e96a3a]">{title}</h3>
                <p className="mt-4 max-w-[340px] text-[15px] leading-[1.55] text-[#f5f0e7]/58">{body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Relationship */}
        <div className="mt-28 border-t border-[#f5f0e7]/15 pt-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <div className="border-t border-[#f5f0e7]/20 py-8">
                <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#e96a3a]">01</span>
                <h3 className="mt-4 font-display text-[clamp(2rem,3.5vw,3rem)] leading-none tracking-[-.05em]">DIAGNOSE</h3>
                <p className="mt-2 font-mono-ui text-[11px] uppercase tracking-[.12em] text-[#f5f0e7]/45">Revenue Leak Diagnosis</p>
                <p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e96a3a]">$1,000 · 3–4 days</p>
                <p className="mt-4 max-w-[380px] text-[16px] leading-[1.5] text-[#f5f0e7]/60">Find the break.</p>
              </div>
            </div>
            <div>
              <div className="border-t border-[#f5f0e7]/20 py-8">
                <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#e96a3a]">02</span>
                <h3 className="mt-4 font-display text-[clamp(2rem,3.5vw,3rem)] leading-none tracking-[-.05em]">REBUILD</h3>
                <p className="mt-2 font-mono-ui text-[11px] uppercase tracking-[.12em] text-[#f5f0e7]/45">Revenue Architecture</p>
                <p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e96a3a]">$10,000 · 2 weeks</p>
                <p className="mt-4 max-w-[380px] text-[16px] leading-[1.5] text-[#f5f0e7]/60">Rebuild the system around it.</p>
              </div>
            </div>
          </div>
          <p className="mt-8 font-display text-[22px] leading-[1.2] tracking-[-.03em] text-[#f5f0e7]/70">Two steps, only when the problem calls for both.</p>
        </div>

        {/* Who it is for */}
        <div className="mt-28 border-t border-[#f5f0e7]/15 pt-12">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[.9] tracking-[-.06em]">Who Revenue Architecture is for</h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="border-t border-[#f5f0e7]/20 pt-6">
              <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/50">Strong fit</span>
              <ul className="mt-6 space-y-4">
                {strongFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#f5f0e7]/60"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[#f5f0e7]/20 pt-6">
              <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/50">Not fit</span>
              <ul className="mt-6 space-y-4">
                {notFit.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-[#f5f0e7]/60"><Minus size={16} className="mt-0.5 shrink-0 text-[#f5f0e7]/30" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-28 border-t border-[#f5f0e7]/15 pt-12">
          <p className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-.05em]">The revenue problem starts with the diagnosis.</p>
          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a href="/start" className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]">START WITH THE DIAGNOSIS <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
          </div>
          <p className="mt-5 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
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
  const [, setLocation] = useLocation();
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
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            Revenue Leak Diagnosis
          </h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-[#f5f0e7]/65">
            A focused async commercial diagnosis of where the path from interest to payment is breaking.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#f5f0e7]/55">
            <span>$1,000</span>
            <span>3–4 DAYS</span>
            <span>ASYNCHRONOUS</span>
            <span>FIXED SCOPE</span>
          </div>
        </div>

        {/* Diagnostic Lenses */}
        <div className="mt-32">
          <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-[#e96a3a]">Diagnostic method</p>
          <h2 className="mt-6 max-w-[460px] font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[.9] tracking-[-.07em]">Six ways to find a leak.</h2>
          <p className="mt-8 max-w-[420px] text-[15px] leading-[1.6] text-[#f5f0e7]/58">Not a scorecard. A way to inspect the whole commercial chain before choosing a fix.</p>
          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosticLenses.map(([number, title, body]) => (
              <article key={number} className="border-t border-[#f5f0e7]/20 py-6">
                <div className="flex justify-between font-mono-ui text-[10px] text-[#e96a3a]"><span>{number}</span><span>+</span></div>
                <h3 className="mt-9 font-display text-[31px] tracking-[-.04em]">{title}</h3>
                <p className="mt-3 max-w-[310px] text-[14px] leading-[1.55] text-[#f5f0e7]/58">{body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Detailed FAQ */}
        <div className="mt-32 border-t border-[#f5f0e7]/15 pt-16">
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[.9] tracking-[-.07em]">Questions</h2>
          <div className="mt-12 space-y-0">
            {diagnosisFaqs.map(([question, answer]) => (
              <div key={question} className="border-b border-[#f5f0e7]/15 py-6">
                <p className="font-display text-[22px] leading-[1.1] tracking-[-.03em] text-[#f5f0e7]">{question}</p>
                <p className="mt-4 max-w-[620px] text-[15px] leading-[1.6] text-[#f5f0e7]/58">{answer}</p>
              </div>
            ))}
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
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Nasiba — statement */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            A specialist Revenue Architecture agency for SaaS.
          </h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-[#f5f0e7]/65">
            Nasiba works on the commercial path between product interest and revenue — positioning, economic framing, offers, buying events and upgrade logic.
          </p>
        </div>

        {/* Why Nasiba exists */}
        <div className="mt-32 max-w-[800px]">
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[.92] tracking-[-.06em] text-[#f5f0e7]">
            Revenue problems are often diagnosed at the wrong level.
          </h2>
          <p className="mt-8 text-[17px] leading-[1.6] text-[#f5f0e7]/55">
            Nasiba exists to examine the commercial path as a system — not as a collection of isolated conversion problems. Most SaaS teams are trained to optimize individual components. But revenue depends on a sequence of commercial transitions. Nasiba exists to identify where that sequence breaks.
          </p>
        </div>

        {/* Senior Work Stays Senior */}
        <div className="mt-32 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] tracking-[-.05em] text-[#f5f0e7]/85">
              Senior work stays senior.
            </h2>
            <p className="mt-6 max-w-[480px] text-[17px] leading-[1.6] text-[#f5f0e7]/55">
              The person diagnosing the commercial problem stays close to the strategic work. No account layer, no retainer structure, and no handoff to a generic delivery team.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4 border-t border-[#f5f0e7]/15 pt-6">
              <div className="flex items-center gap-4">
                <span className="h-px w-6 bg-[#e96a3a]" />
                <span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f5f0e7]/45">Direct strategic involvement</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="h-px w-6 bg-[#e96a3a]" />
                <span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f5f0e7]/45">Fixed scope</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="h-px w-6 bg-[#e96a3a]" />
                <span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f5f0e7]/45">Async delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paul */}
        <div className="mt-32 border-t border-[#f5f0e7]/15 pt-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-24">
            <div>
              <div className="flex h-14 w-14 items-center justify-center border border-[#e96a3a] font-mono-ui text-[16px] font-bold text-[#e96a3a]">P</div>
              <p className="mt-6 font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] text-[#f5f0e7]">Paul</p>
              <p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">Founder &amp; Principal</p>
              <div className="mt-6 space-y-2">
                <p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
                  <a href="https://www.linkedin.com/in/paul-coll/" target="_blank" rel="noopener noreferrer" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">LinkedIn →</a>
                </p>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
                  <a href="https://x.com/1Paul_coll" target="_blank" rel="noopener noreferrer" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">X / Twitter →</a>
                </p>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
                  <a href="mailto:paul@nasiba.co" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">paul@nasiba.co</a>
                </p>
              </div>
            </div>
            <div className="max-w-[600px]">
              <p className="text-[17px] leading-[1.6] text-[#f5f0e7]/65">
                Paul leads Nasiba&apos;s diagnostic and strategic work across positioning, economic value, offers, buying events and monetization architecture.
              </p>
              <div className="mt-8">
                <a href="/cases" className="inline-flex items-center gap-3 border-b border-[#e96a3a] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a] transition-colors hover:text-[#f18a61]">VIEW CLIENT CASES →</a>
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
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <h1 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            Client work
          </h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-[#f5f0e7]/65">
            Selected commercial diagnosis, positioning and messaging work across SaaS products.
          </p>
        </div>

        {/* Cases List */}
        <div className="mt-20 border-t border-[#f5f0e7]/15">
          {casesData.map((c) => (
            <a key={c.slug} href={`/cases/${c.slug}`} className="group grid grid-cols-1 gap-4 border-b border-[#f5f0e7]/15 py-10 transition-colors hover:bg-[#f5f0e7]/5 sm:grid-cols-[200px_1fr] sm:gap-8 sm:py-12">
              <div>
                <h2 className="font-mono-ui text-[12px] font-bold uppercase tracking-[.14em] text-[#f5f0e7] group-hover:text-[#e96a3a]">{c.name}</h2>
                <p className="mt-3 font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#e96a3a]">{c.engagement}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <span className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#e96a3a]">Problem</span>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#f5f0e7]/58">{c.problem}</p>
                </div>
                <div>
                  <span className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#e96a3a]">Intervention</span>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#f5f0e7]/58">{c.intervention}</p>
                </div>
                <div>
                  <span className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#e96a3a]">Outcome</span>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#f5f0e7]/58">{c.shortOutcome}</p>
                </div>
              </div>
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
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e96a3a]">
            <a href="/cases" className="transition-colors hover:text-[#f18a61]">CASES</a> → {data.name.toUpperCase()}
          </p>
          <h1 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            {data.name}
          </h1>
          <p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#e96a3a]">
            {data.engagementType}
          </p>
        </div>

        {/* Sections */}
        <div className="mt-20 border-t border-[#f5f0e7]/15">
          {sections.map((section) => (
            <article key={section.label} className="grid grid-cols-1 gap-6 border-b border-[#f5f0e7]/15 py-10 sm:grid-cols-[120px_1fr] sm:gap-10">
              <div>
                <span className="font-mono-ui text-[10px] text-[#e96a3a]">{section.label}</span>
                <h3 className="mt-3 font-mono-ui text-[11px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/70">{section.title}</h3>
              </div>
              <div className="max-w-[720px]">
                <p className="text-[16px] leading-[1.6] text-[#f5f0e7]/65">{section.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between border-t border-[#f5f0e7]/15 pt-8">
          <a href="/cases" className="inline-flex items-center gap-3 border-b border-[#e96a3a] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a] transition-colors hover:text-[#f18a61]">← ALL CASES</a>
          <a href={isLast ? '/cases' : `/cases/${nextSlug}`} className="inline-flex items-center gap-3 border-b border-[#e96a3a] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a] transition-colors hover:text-[#f18a61]">{isLast ? 'ALL CASES' : `${nextName.toUpperCase()}`} →</a>
        </div>

        <SiteFooter variant="dark" />
      </div>
    </main>
  );
}

/* ─── Privacy & Terms Pages ─── */

function PrivacyPage() {
  const [, setLocation] = useLocation();
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
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[.9] tracking-[-.06em] text-[#202536]">Privacy</h1>
        <p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#6c6b68]">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="mt-12 space-y-8 border-t border-[#cfc7b7] pt-10 text-[16px] leading-[1.65] text-[#55575c]">
          <p>Nasiba (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the nasiba.co website. This page informs you of our policies regarding the collection, use and disclosure of personal information when you use our service.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Information Collection</h2>
          <p>We collect information you provide directly, such as when you initiate a diagnosis engagement, contact us by email, or provide business context as part of an engagement.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Use of Information</h2>
          <p>We use collected information to deliver our services, communicate with you, and improve our offerings. We do not sell your personal information to third parties.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Confidentiality</h2>
          <p>All business context, product information and materials shared during an engagement are treated as confidential. We do not share client information without explicit consent.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Contact</h2>
          <p>For privacy-related inquiries, contact <a href="mailto:paul@nasiba.co" className="border-b border-[#e15b2e] pb-0.5 text-[#e15b2e] transition-colors hover:text-[#c94a22]">paul@nasiba.co</a>.</p>
        </div>
        <SiteFooter variant="light" />
      </div>
    </main>
  );
}

function TermsPage() {
  const [, setLocation] = useLocation();
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
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[.9] tracking-[-.06em] text-[#202536]">Terms</h1>
        <p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#6c6b68]">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="mt-12 space-y-8 border-t border-[#cfc7b7] pt-10 text-[16px] leading-[1.65] text-[#55575c]">
          <p>These terms govern your use of nasiba.co and any engagement with Nasiba. By engaging our services, you agree to the following terms.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Services</h2>
          <p>Nasiba provides Revenue Architecture diagnosis and strategic consulting services for SaaS companies. All engagements are fixed-scope and asynchronous unless otherwise agreed in writing.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Engagement Terms</h2>
          <p>The Revenue Leak Diagnosis is $1,000, delivered in 3–4 business days. Revenue Architecture is $10,000, delivered in 2 weeks. Payment is due before work begins. There are no retainers or recurring commitments.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Deliverables</h2>
          <p>Deliverables are as described in the engagement scope. Nasiba provides strategic direction and recommendations. Implementation is the responsibility of the client unless otherwise agreed.</p>
          <h2 className="font-display text-[24px] tracking-[-.04em] text-[#202536]">Contact</h2>
          <p>For terms-related inquiries, contact <a href="mailto:paul@nasiba.co" className="border-b border-[#e15b2e] pb-0.5 text-[#e15b2e] transition-colors hover:text-[#c94a22]">paul@nasiba.co</a>.</p>
        </div>
        <SiteFooter variant="light" />
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
