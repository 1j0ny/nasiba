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
  { label: 'DIAGNOSIS', id: 'diagnosis' },
  { label: 'CASES', id: 'cases-nav', href: '/cases' },
  { label: 'ABOUT', id: 'about-nav', href: '/about' },
  { label: 'FAQ', id: 'faq' },
];

/* ─── Data ─── */

const revenuePath = [
  ['01', 'INTEREST', 'Someone notices a problem.'],
  ['02', 'UNDERSTANDING', 'They understand what the product does.'],
  ['03', 'PERCEIVED ECONOMIC VALUE', 'The outcome feels worth paying for.'],
  ['04', 'BUYING EVENT', 'Something creates a rational reason to act now.'],
  ['05', 'PAYMENT', 'The paid decision is specific and credible.'],
  ['06', 'EXPANSION', 'The next level of value has a logical trigger.'],
];

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
    shortOutcome: 'The product moved from mechanism-led messaging toward a clearer outcome-led hero built around the trader\u2019s decision process.',
  },
  {
    slug: 'convertfast',
    name: 'Convert.FAST',
    engagement: 'Positioning · Hero Architecture',
    problem: 'The product was more capable than the hero made it appear. The opportunity was to make the primary job-to-be-done explicit.',
    intervention: 'Moved from generic file conversion toward bulk processing, speed, explicit workflow and explicit output.',
    shortOutcome: 'The hero became more specific and aligned the product\u2019s strongest capability with a concrete user job.',
  },
  {
    slug: 'creativelens',
    name: 'CreativeLens',
    engagement: 'Messaging · Economic Framing',
    problem: 'There was a gap between product capability and economic value. The product risked entering the mental category of \u201canother AI creative analysis tool.\u201d',
    intervention: 'Shifted messaging from \u201CAI analyzes creatives\u201D toward understanding what deserves more budget, what needs more testing, and what should stop receiving spend.',
    shortOutcome: 'The messaging became more outcome-led and connected creative analysis more directly to the commercial decisions behind paid acquisition.',
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
    implementation: 'The founder implemented the recommended positioning direction. The resulting direction centered on: Find high-confluence setups in seconds \u2014 not after 30 charts. Supporting concept: ConfluenceMeter scans symbols and timeframes to surface moments when the trader\u2019s conditions align.',
    outcome: 'The product moved from mechanism-led messaging toward a clearer outcome-led hero built around the trader\u2019s decision process.',
    engagementType: 'Positioning · Messaging · Hero Architecture',
  },
  convertfast: {
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

const founderFeedback = [
  { client: 'ConfluenceMeter Founder', quote: 'Really appreciated the work and the direction.' },
  { client: 'Convert.FAST Founder', quote: 'The direction made sense and was useful in refining the hero.' },
  { client: 'CreativeLens Founder', quote: 'Really appreciated the feedback \u2014 it was helpful.' },
];

const faqs = [
  ['What does asynchronous mean?', 'No recurring meetings or calls. The engagement is conducted through the product, website, pricing, onboarding and business context you provide, with the diagnosis delivered asynchronously.'],
  ['What is the $1,000 Revenue Leak Diagnosis?', 'A fixed-scope, asynchronous inspection of the commercial gaps between product interest and payment \u2014 from positioning and economic value to buying events, upgrade logic, and messaging. It produces a clear commercial map, not a generic audit or a pile of copy suggestions.'],
  ['What do I receive?', 'You receive the six-part diagnosis: Revenue Leak, Root Cause, Economic Logic, Buying Event, Offer / Upgrade Logic, and Priority Map. The delivery includes an annotated revenue path, a written diagnosis, prioritized recommendations, and an asynchronous walkthrough of the thinking.'],
  ['How long does the diagnosis take?', 'The Revenue Leak Diagnosis is delivered in 3\u20134 days, asynchronously. The broader Revenue Architecture engagement is 2 weeks, asynchronous.'],
  ['How much does each offer cost?', 'The Revenue Leak Diagnosis is $1,000. Revenue Architecture is $10,000 for broader architectural problems that require rebuilding the commercial system around the leak.'],
  ['Do I need to book a call?', 'No. There is no call required to start. The work begins with a focused intake and the materials listed in What I Need. Any clarification happens asynchronously.'],
  ['Is this a copywriting project?', 'No. Copy is one possible expression of the diagnosis, not the deliverable. The work maps the commercial system underneath the words: who buys, why now, what they value, how they enter, and where expansion becomes credible.'],
  ['What do you need from us?', 'A short intake, product access or a guided walkthrough, your current pricing and plan logic, and the seven inputs listed below. The requests stay focused and the work stays asynchronous.'],
  ['Who is this for?', 'B2B and AI SaaS companies with existing users, traffic or demand and a monetization problem worth solving.'],
  ['What happens after the diagnosis?', 'You can use the map internally, or choose the separate $10,000 Revenue Architecture engagement if the diagnosis reveals a broader architectural problem. The $10,000 engagement is not required for a single leak.'],
  ['Do you work on retainers?', 'No. The work is deliberately focused and asynchronous.'],
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
              { label: 'Diagnosis', href: '/#diagnosis' },
              { label: 'Revenue Architecture', href: '/#engagement' },
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
          <p className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted}`}>Paul \u2014 Founder &amp; Principal</p>
          <div className="mt-3 space-y-2">
            <p>
              <a href="https://www.linkedin.com/in/paul-coll/" target="_blank" rel="noopener noreferrer" className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>LinkedIn \u2192</a>
            </p>
            <p>
              <a href="https://x.com/1Paul_coll" target="_blank" rel="noopener noreferrer" className={`font-mono-ui text-[10px] uppercase tracking-[.12em] ${textMuted} border-b border-transparent pb-0.5 transition-colors ${linkHover}`}>X / Twitter \u2192</a>
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
        <button type="button" onClick={() => handleNavigation('top')} className={`group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 ${accentBorder}`} aria-label="NASIBA, back to top">
          <span className={`flex h-7 w-7 items-center justify-center border ${accentBorder} font-mono-ui text-[11px] font-bold ${accentText}`}>N</span>
          <span>
            <span className={`block font-mono-ui text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${accentText} group-hover:text-[${dark ? '#e96a3a' : '#c94a22'}]`}>NASIBA</span>
            <span className={`mt-0.5 block font-mono-ui text-[8px] uppercase tracking-[0.12em] ${dark ? 'text-[#f5f0e7]/45' : 'text-[#202536]/45'}`}>Revenue architecture for SaaS</span>
          </span>
        </button>
        <nav className="hidden items-center gap-5 xl:gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => handleNavigation(item.id)} className={`font-mono-ui text-[9px] uppercase tracking-[0.13em] ${textMuted} transition-colors ${dark ? 'hover:text-[#f5f0e7]' : 'hover:text-[#202536]'} focus-visible:outline-none focus-visible:ring-2 ${accentBorder} focus-visible:ring-offset-2 ${dark ? 'focus-visible:ring-offset-[#202536]' : 'focus-visible:ring-offset-[#f5f0e7]'}`}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => handleNavigation('offer')} className={`flex items-center gap-2 ${btnBg} px-4 py-2.5 font-mono-ui text-[9px] font-bold uppercase tracking-[0.1em] ${btnText} transition-colors ${hoverBg} focus-visible:outline-none focus-visible:ring-2 ${dark ? 'focus-visible:ring-[#f5f0e7]' : 'focus-visible:ring-[#202536]'}`}>
            START THE DIAGNOSIS \u2014 $1,000 <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </nav>
        <button type="button" className={`inline-flex h-10 w-10 items-center justify-center border ${dark ? 'border-[#f5f0e7]/25' : 'border-[#202536]/25'} ${textMain} md:hidden`} onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X size={19} /> : <Menu size={19} />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className={`${border} border-b ${bg} px-2 py-4 md:hidden`} aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => handleNavigation(item.id)} className={`flex w-full items-center justify-between border-b ${dark ? 'border-[#f5f0e7]/10' : 'border-[#cfc7b7]'} px-3 py-4 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] ${dark ? 'text-[#f5f0e7]/75' : 'text-[#202536]/75'} last:border-0 focus-visible:outline-none focus-visible:ring-2 ${accentBorder}`}>
              {item.label}
              <ArrowDownRight size={14} className={accentText} />
            </button>
          ))}
          <button type="button" onClick={() => handleNavigation('offer')} className={`mt-3 flex w-full items-center justify-between ${btnBg} px-3 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] ${btnText}`}>
            START THE DIAGNOSIS \u2014 $1,000 <ArrowRight size={14} />
          </button>
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
          <Eyebrow dark>Commercial diagnosis / 001</Eyebrow>
          <h1 className="font-display text-[clamp(4.5rem,10vw,9rem)] leading-[.87] tracking-[-0.07em] text-[#f5f0e7]">
            Find where your SaaS is <span className="text-[#e96a3a]">losing revenue.</span>
          </h1>
          <p className="mt-9 max-w-[650px] text-balance text-[18px] leading-[1.55] text-[#f5f0e7]/68 sm:text-[21px]">
            An asynchronous diagnosis of the commercial gaps between product interest and payment \u2014 from positioning and economic value to buying events, upgrade logic and messaging.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button type="button" onClick={() => onNavigate('offer')} className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]">
              START THE REVENUE LEAK DIAGNOSIS \u2014 $1,000 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="mt-7 font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] text-[#f5f0e7]/78">$1,000 \u00b7 3\u20134 DAYS \u00b7 ASYNCHRONOUS</div>
          <p className="mt-5 max-w-[520px] text-[14px] leading-[1.5] text-[#f5f0e7]/48">For SaaS products that already have users, traffic or demand \u2014 but aren&apos;t converting enough of it into revenue.</p>
        </div>
        <div className="reveal reveal-delay-2 relative min-h-[300px] lg:mb-4">
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#f5f0e7]/25 pt-4">
            <div className="mb-8 flex items-center justify-between font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[#f5f0e7]/50"><span>Where interest stops</span><span className="text-[#e96a3a]">\u2192</span></div>
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
      <div className="absolute bottom-0 left-5 font-mono-ui text-[10px] tracking-[.15em] text-[#f5f0e7]/30 sm:left-8 lg:left-12">01 / 08</div>
    </section>
  );
}

function Thesis() {
  return (
    <section id="thesis" className="scroll-mt-10 border-b border-[#cfc7b7] bg-[#f5f0e7]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-24 lg:px-12 lg:py-36">
        <div><Eyebrow>02 / THE THESIS</Eyebrow><p className="max-w-[300px] font-mono-ui text-[11px] uppercase leading-[1.7] tracking-[.14em] text-[#6c6b68]">Start with the commercial architecture, not the loudest page.</p></div>
        <div>
          <h2 className="max-w-[850px] font-display text-[clamp(3rem,6.4vw,6.6rem)] leading-[.93] tracking-[-.06em] text-[#202536]">Most monetization problems <em className="text-[#e15b2e]">aren&apos;t</em> copy problems.</h2>
          <p className="mt-10 max-w-[820px] border-t border-[#cfc7b7] pt-8 text-[19px] leading-[1.55] text-[#444650]">You can have a strong product, real users and meaningful traffic \u2014 and still lose revenue because the path from interest to payment isn&apos;t commercially coherent.</p>
          <p className="mt-7 max-w-[720px] text-[17px] leading-[1.6] text-[#55575c]">If the commercial architecture is broken, rewriting the homepage only makes the same problem sound better.</p>
        </div>
      </div>
    </section>
  );
}

function RevenuePath() {
  return (
    <section id="path" className="bg-[#e96a3a] text-[#202536]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col justify-between gap-8 border-b border-[#202536]/25 pb-8 lg:flex-row lg:items-end">
          <div><Eyebrow dark>03 / THE REVENUE PATH</Eyebrow><h2 className="max-w-[680px] font-display text-[clamp(3rem,5vw,5rem)] leading-[.92] tracking-[-.06em]">Interest is not revenue.</h2></div>
          <p className="max-w-[350px] text-[15px] leading-[1.55] text-[#202536]/70">Revenue moves through a sequence: INTEREST \u2192 UNDERSTANDING \u2192 PERCEIVED ECONOMIC VALUE \u2192 BUYING EVENT \u2192 PAYMENT \u2192 EXPANSION.</p>
        </div>
        <p className="mt-8 max-w-[650px] font-display text-[28px] leading-[1.05] tracking-[-.04em]">Revenue leaks when one of these transitions breaks.</p>
        <div className="mt-12 grid grid-cols-1 gap-px bg-[#202536]/25 sm:grid-cols-2 lg:grid-cols-6">
          {revenuePath.map(([number, title, body], index) => (
            <article key={number} className="group min-h-[250px] bg-[#e96a3a] p-5 transition-colors hover:bg-[#f18a61] lg:min-h-[315px] lg:p-6">
              <div className="flex items-center justify-between font-mono-ui text-[10px] tracking-[.12em]"><span>{number}</span>{index < revenuePath.length - 1 ? <ArrowRight size={14} /> : <Circle size={9} fill="currentColor" />}</div>
              <div className="mt-16 lg:mt-24"><h3 className="max-w-[170px] font-display text-[28px] leading-[.92] tracking-[-.04em]">{title}</h3><p className="mt-4 text-[14px] leading-[1.45] text-[#202536]/67">{body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Lenses() {
  return (
    <section id="lenses" className="scroll-mt-10 bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div><Eyebrow dark>04 / THE LENSES</Eyebrow><h2 className="max-w-[460px] font-display text-[clamp(3.5rem,6vw,6.4rem)] leading-[.9] tracking-[-.07em]">Six ways to find a leak.</h2><p className="mt-8 max-w-[310px] text-[15px] leading-[1.6] text-[#f5f0e7]/58">Not a scorecard. A way to inspect the whole commercial chain before choosing a fix.</p></div>
          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {diagnosticLenses.map(([number, title, body]) => (
              <article key={number} className="border-t border-[#f5f0e7]/20 py-6"><div className="flex justify-between font-mono-ui text-[10px] text-[#e96a3a]"><span>{number}</span><span>+</span></div><h3 className="mt-9 font-display text-[31px] tracking-[-.04em]">{title}</h3><p className="mt-3 max-w-[310px] text-[14px] leading-[1.55] text-[#f5f0e7]/58">{body}</p></article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className="border-b border-[#cfc7b7] bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <Eyebrow>05 / THE CORRECTION</Eyebrow>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <h2 className="max-w-[600px] font-display text-[clamp(3rem,5.5vw,5.8rem)] leading-[.9] tracking-[-.07em] text-[#202536]">Don&apos;t rewrite the homepage before fixing the economics.</h2>
          <div className="grid grid-cols-1 gap-px bg-[#202536]/20 sm:grid-cols-2">
            <div className="bg-[#c9c4ba] p-6 sm:p-8"><div className="mb-20 flex justify-between font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#202536]/50"><span>Weak approach</span><Minus size={14} /></div><p className="font-display text-[27px] leading-[1.05] tracking-[-.04em] text-[#202536]/70">&ldquo;The headline is unclear. Let&apos;s make it punchier.&rdquo;</p><ul className="mt-8 space-y-4 font-mono-ui text-[10px] uppercase leading-[1.55] tracking-[.1em] text-[#202536]/55"><li>\u2014 Treats the symptom</li><li>\u2014 Starts with the page</li><li>\u2014 Produces more opinions</li></ul></div>
            <div className="bg-[#202536] p-6 text-[#f5f0e7] sm:p-8"><div className="mb-20 flex justify-between font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e96a3a]"><span>Commercial approach</span><Plus size={14} /></div><p className="font-display text-[27px] leading-[1.05] tracking-[-.04em]">&ldquo;What has to be true for this buyer to pay?&rdquo;</p><ul className="mt-8 space-y-4 font-mono-ui text-[10px] uppercase leading-[1.55] tracking-[.1em] text-[#f5f0e7]/55"><li>\u2014 Finds the constraint</li><li>\u2014 Starts with the buyer</li><li>\u2014 Produces a sequence</li></ul></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Diagnosis() {
  return (
    <section id="diagnosis" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-[#cfc7b7] pb-8 sm:flex-row sm:items-end"><div><Eyebrow>06 / THE DIAGNOSIS</Eyebrow><h2 className="font-display text-[clamp(3.5rem,6vw,6.4rem)] leading-[.9] tracking-[-.07em] text-[#202536]">One diagnosis.<br /><em className="text-[#e15b2e]">A clear commercial map.</em></h2></div><span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#6c6b68]">Six useful outputs</span></div>
        <div className="grid grid-cols-1 gap-px border-y border-[#cfc7b7] bg-[#cfc7b7] md:grid-cols-2 lg:grid-cols-3">
          {outputs.map(([number, title, body]) => <article key={number} className="min-h-[270px] bg-[#f5f0e7] p-6 sm:p-8"><span className="font-mono-ui text-[10px] text-[#e15b2e]">{number}</span><h3 className="mt-14 font-display text-[32px] leading-[.95] tracking-[-.05em] text-[#202536]">{title}</h3><p className="mt-4 text-[14px] leading-[1.55] text-[#55575c]">{body}</p></article>)}
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const [requested, setRequested] = useState(false);
  return (
    <section id="offer" className="scroll-mt-10 bg-[#e96a3a] text-[#202536]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
          <div><Eyebrow dark>07 / THE OFFER</Eyebrow><h2 className="max-w-[760px] font-display text-[clamp(4rem,8vw,8.5rem)] leading-[.85] tracking-[-.08em]">Revenue Leak Diagnosis</h2><p className="mt-9 max-w-[650px] text-[20px] leading-[1.45] text-[#202536]/75">A focused analysis of where your current path from interest to payment is breaking, what is causing the leakage, and what commercial architecture needs to change.</p><div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#202536]/25 pt-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#202536]/65"><span>$1,000</span><span>3\u20134 DAYS</span><span>ASYNCHRONOUS</span><span>FIXED SCOPE</span></div></div>
          <div className="bg-[#202536] p-7 text-[#f5f0e7] sm:p-10">
            <div className="flex items-start justify-between border-b border-[#f5f0e7]/20 pb-8"><span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#e96a3a]">The working room</span><span className="font-display text-[52px] leading-none tracking-[-.06em]">$1,000</span></div>
            <p className="mt-8 text-[17px] leading-[1.5] text-[#f5f0e7]/78">A fixed-scope inspection that identifies where revenue is leaking and gives you a clear commercial map for what to do next.</p>
            <ul className="mt-8 space-y-4 text-[15px] leading-[1.45] text-[#f5f0e7]/70"><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Positioning diagnosis</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Economic framing analysis</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Offer / upgrade architecture</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Buying-event analysis</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Revenue leak identification</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Priority recommendations</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Messaging and homepage implications</li></ul>
            <button type="button" onClick={() => setRequested(true)} className="mt-10 flex w-full items-center justify-between bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]">{requested ? 'REQUEST NOTED \u2014 I\u2019LL BE IN TOUCH.' : 'START THE $1,000 DIAGNOSIS'} <ArrowRight size={16} /></button>
            {requested && <p className="mt-4 font-mono-ui text-[10px] uppercase leading-[1.5] tracking-[.1em] text-[#f5f0e7]/55">This prototype records your intent locally. The final intake channel can be connected here.</p>}
          </div>
        </div>
        <p className="mt-14 border-t border-[#202536]/25 pt-5 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#202536]/68">No retainer. No recurring commitment. No ongoing consulting.</p>
      </div>
    </section>
  );
}

function Engagement() {
  return (
    <section id="engagement" className="scroll-mt-10 bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div><Eyebrow dark>08 / THE ENGAGEMENT</Eyebrow><h2 className="max-w-[500px] font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[.88] tracking-[-.07em]">Diagnose.<br /><em className="text-[#e96a3a]">Then rebuild.</em></h2><p className="mt-8 max-w-[350px] text-[16px] leading-[1.6] text-[#f5f0e7]/60">Two steps, only when the problem calls for both.</p></div>
          <div>
            <div className="border-t border-[#f5f0e7]/20 py-8"><div className="flex items-start gap-5"><span className="font-mono-ui text-[10px] text-[#e96a3a]">01</span><div><h3 className="font-display text-[40px] leading-none tracking-[-.05em]">DIAGNOSE</h3><p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/65">$1,000 \u00b7 3\u20134 days \u00b7 Asynchronous. Find the leak, its root cause, and the priority map. This is enough when one commercial transition is unclear.</p></div></div></div>
            <div className="border-y border-[#f5f0e7]/20 py-8"><div className="flex items-start gap-5"><span className="font-mono-ui text-[10px] text-[#e96a3a]">02</span><div><h3 className="font-display text-[40px] leading-none tracking-[-.05em]">REBUILD</h3><p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/65">For products where the diagnosis reveals a broader problem in how positioning, economics, offers, buying events and upgrades work together.</p><div className="mt-5 flex items-baseline gap-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#e96a3a]"><span>$10,000</span><span>2 weeks \u00b7 Asynchronous</span></div><ul className="mt-6 grid max-w-[570px] grid-cols-1 gap-x-6 gap-y-3 border-t border-[#f5f0e7]/15 pt-5 font-mono-ui text-[10px] uppercase leading-[1.5] tracking-[.1em] text-[#f5f0e7]/55 sm:grid-cols-2"><li>\u2014 Positioning audit</li><li>\u2014 Economic framing</li><li>\u2014 Offer ladder restructuring</li><li>\u2014 Buying-event design</li><li>\u2014 Pricing &amp; upgrade logic</li><li>\u2014 Homepage &amp; messaging implementation guidance</li></ul><button type="button" onClick={() => scrollToSection('offer')} className="mt-8 border-b border-[#e96a3a] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a] transition-colors hover:text-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]">EXPLORE REVENUE ARCHITECTURE \u2192</button></div></div></div>
            <p className="mt-9 max-w-[580px] font-display text-[29px] leading-[1.05] tracking-[-.04em] text-[#f5f0e7]">The diagnosis identifies the leak. Revenue Architecture rebuilds the system around it.</p>
            <p className="mt-5 max-w-[530px] text-[15px] leading-[1.55] text-[#f5f0e7]/58">Not every diagnosis requires deeper work. The second engagement exists when the commercial problem is architectural rather than isolated.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [['01', 'CONTEXT', 'You provide the product, pricing, funnel, onboarding and relevant business context.'], ['02', 'DIAGNOSIS', 'Paul analyzes the commercial path asynchronously.'], ['03', 'DELIVERY', 'You receive the diagnosis and prioritized recommendations within 3\u20134 days.']];
  const inputs = ['Product / website', 'Pricing', 'Acquisition context', 'Conversion or activation context', 'Onboarding flow', 'Relevant analytics or business data', 'Anything you already know about the monetization problem'];
  return (
    <section id="how-it-works" className="scroll-mt-10 border-b border-[#cfc7b7] bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <Eyebrow>09 / HOW IT WORKS</Eyebrow>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
          <div><h2 className="max-w-[620px] font-display text-[clamp(3.5rem,6vw,6.3rem)] leading-[.88] tracking-[-.07em] text-[#202536]\">A quiet process.<br /><em className="text-[#e15b2e]\">A sharper answer.</em></h2><div className="mt-14 border-t border-[#202536]/20">{steps.map(([number, title, body]) => <article key={number} className="grid grid-cols-[48px_1fr] gap-4 border-b border-[#202536]/20 py-7"><span className="font-mono-ui text-[10px] text-[#e15b2e]">{number}</span><div><h3 className="font-mono-ui text-[11px] font-bold uppercase tracking-[.14em] text-[#202536]">{title}</h3><p className="mt-3 max-w-[440px] text-[16px] leading-[1.55] text-[#55575c]">{body}</p></div></article>)}<p className="pt-6 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#6c6b68]">No recurring meetings. No retainer.</p></div></div>
          <div className="bg-[#f5f0e7] p-7 sm:p-10"><div className="flex items-center justify-between border-b border-[#cfc7b7] pb-5"><h3 className="font-display text-[39px] leading-none tracking-[-.05em] text-[#202536]">WHAT I NEED</h3><span className="font-mono-ui text-[10px] text-[#e15b2e]">07 INPUTS</span></div><ol className="mt-4">{inputs.map((input, index) => <li key={input} className="grid grid-cols-[36px_1fr] gap-3 border-b border-[#cfc7b7] py-4 text-[14px] leading-[1.45] text-[#55575c]"><span className="font-mono-ui text-[10px] text-[#e15b2e]">0{index + 1}</span><span>{input}</span></li>)}</ol></div>
        </div>
      </div>
    </section>
  );
}

function CasesTeaser() {
  return (
    <section id="cases" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="border-t border-[#cfc7b7] pt-10">
          <Eyebrow>CLIENT WORK</Eyebrow>
          <h2 className="font-display text-[clamp(3.5rem,6vw,6.3rem)] leading-[.88] tracking-[-.07em] text-[#202536]">Commercial diagnosis<br /><em className="text-[#e15b2e]">and positioning work.</em></h2>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-[#55575c]">Commercial diagnosis and positioning work across SaaS products.</p>
        </div>
        <div className="mt-12 border-t border-[#cfc7b7]">
          {casesData.map((c) => (
            <a key={c.slug} href={`/cases/${c.slug}`} className="group flex items-center justify-between border-b border-[#cfc7b7] py-8 transition-colors hover:bg-[#f5f0e7]/60 sm:py-10">
              <div className="flex items-center gap-6">
                <h3 className="font-mono-ui text-[12px] font-bold uppercase tracking-[.14em] text-[#202536] group-hover:text-[#e15b2e]">{c.name}</h3>
                <span className="hidden sm:inline font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#6c6b68]">{c.engagement}</span>
              </div>
              <span className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e15b2e] opacity-0 transition-opacity group-hover:opacity-100">VIEW CASE \u2192</span>
            </a>
          ))}
        </div>
        <div className="mt-8">
          <a href="/cases" className="inline-flex items-center gap-3 border-b border-[#e15b2e] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e15b2e] transition-colors hover:text-[#c94a22]">VIEW ALL CASES \u2192</a>
        </div>
      </div>
    </section>
  );
}

function WhoThisIsFor() {
  const goodFit = [
    'Existing users and active traffic',
    'Unclear conversion path from interest to payment',
    'Monetisation friction at pricing, upgrade or onboarding',
    'Founder-led SaaS with commercial architecture questions',
  ];
  const notFit = [
    'Pre-PMF products still searching for product-market fit',
    'Traffic-only problems with no underlying product demand',
    'Generic copywriting or brand refresh projects',
    'Execution retainer relationships',
  ];
  return (
    <section id="who-this-is-for" className="scroll-mt-10 bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <Eyebrow>WHO THIS IS FOR</Eyebrow>
            <h2 className="mt-4 max-w-[480px] font-display text-[clamp(3rem,5.5vw,5.5rem)] leading-[.9] tracking-[-.07em] text-[#202536]">Built for SaaS companies with demand \u2014 but unclear conversion.</h2>
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

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1100px] px-5 py-24 sm:px-8 lg:py-32">
        <Eyebrow>FAQ</Eyebrow>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24"><h2 className="font-display text-[clamp(3.3rem,5.5vw,5.6rem)] leading-[.9] tracking-[-.07em] text-[#202536]">The useful<br /><em className="text-[#e15b2e]">short version.</em></h2><div className="border-t border-[#cfc7b7]">{faqs.map(([question, answer], index) => { const isOpen = openIndex === index; return <div key={question} className="border-b border-[#cfc7b7]"><button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e15b2e]" aria-expanded={isOpen}><span className="font-display text-[25px] leading-[1.1] tracking-[-.03em] text-[#202536]">{question}</span><ChevronDown size={18} className={`shrink-0 text-[#e15b2e] transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <div className="max-w-[620px] pb-7 pr-8 text-[15px] leading-[1.6] text-[#55575c]">{answer}</div>}</div>; })}</div></div>
      </div>
    </section>
  );
}

function FinalCTA({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section className="bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="max-w-[1000px]"><Eyebrow dark>Start with the leak</Eyebrow><h2 className="font-display text-[clamp(4rem,9vw,9.2rem)] leading-[.84] tracking-[-.08em]">Your product may not need more traffic<span className="text-[#e96a3a]">.</span></h2><p className="mt-8 max-w-[590px] text-[18px] leading-[1.55] text-[#f5f0e7]/60">It may need a better path from the attention you already have to the revenue you want.</p><div className="mt-12 flex flex-col items-start gap-7 sm:flex-row sm:items-center"><button type="button" onClick={() => onNavigate('offer')} className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]">START THE $1,000 DIAGNOSIS \u2192 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button><a href="mailto:paul@nasiba.co" className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45 border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">EMAIL PAUL</a></div></div>
        <SiteFooter variant="dark" />
      </div>
    </section>
  );
}

/* ─── Home ─── */

function Home() {
  useEffect(() => {
    document.title = 'Nasiba \u2014 Revenue Architecture for SaaS';
    const description = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'Nasiba diagnoses the commercial gaps between SaaS product interest and revenue \u2014 positioning, economic value, offers, buying events and upgrade logic.');
    document.head.appendChild(description);
    const ogTitle = document.querySelector('meta[property="og:title"]') ?? document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Nasiba \u2014 Revenue Architecture for SaaS');
    document.head.appendChild(ogTitle);
    const ogDescription = document.querySelector('meta[property="og:description"]') ?? document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'Nasiba diagnoses the commercial gaps between SaaS product interest and revenue \u2014 positioning, economic value, offers, buying events and upgrade logic.');
    document.head.appendChild(ogDescription);
  }, []);

  const [, setLocation] = useLocation();
  const navigate = (id: string) => {
    if (id === 'about-nav') { setLocation('/about'); return; }
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    scrollToSection(id);
  };
  return <main className="page-grain overflow-hidden"><Hero onNavigate={navigate} /><Thesis /><RevenuePath /><Lenses /><Comparison /><Diagnosis /><Offer /><Engagement /><HowItWorks /><CasesTeaser /><WhoThisIsFor /><FAQ /><FinalCTA onNavigate={navigate} /></main>;
}

/* ─── About Page ─── */

function About() {
  const [, setLocation] = useLocation();
  const navigate = (id: string) => {
    if (id === 'about-nav') return;
    if (id === 'cases-nav') { setLocation('/cases'); return; }
    setLocation('/');
    window.setTimeout(() => scrollToSection(id), 50);
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* 01 \u2014 NASIBA */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <Eyebrow dark>01 / NASIBA</Eyebrow>
          <h1 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
            A specialist Revenue Architecture agency for SaaS.
          </h1>
          <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-[#f5f0e7]/65">
            Nasiba works on the commercial path between product interest and revenue \u2014 positioning, economic framing, offers, buying events and upgrade logic.
          </p>
        </div>

        {/* 02 \u2014 Why Nasiba Exists */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <Eyebrow dark>02 / WHY NASIBA EXISTS</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
            <div>
              <h2 className="max-w-[480px] font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-[.9] tracking-[-.06em] text-[#f5f0e7]">
                Most SaaS teams are trained to optimize individual components.
              </h2>
            </div>
            <div>
              <p className="max-w-[600px] text-[17px] leading-[1.6] text-[#f5f0e7]/65">
                Traffic. Landing pages. Activation. Pricing. Funnels. Copy. Conversion rates. But revenue depends on a sequence of commercial transitions. A product can have attention, users, product value and traffic \u2014 and still fail to turn enough of that demand into payment.
              </p>
              <div className="mt-10 border-l-2 border-[#e96a3a] pl-6">
                <p className="font-display text-[22px] leading-[1.35] tracking-[-.03em] text-[#f5f0e7]/80">
                  Revenue problems are often diagnosed too late \u2014 and at the wrong level.
                </p>
              </div>
              <p className="mt-8 max-w-[560px] text-[16px] leading-[1.6] text-[#f5f0e7]/50">
                Nasiba exists to identify where that sequence breaks.
              </p>
            </div>
          </div>
        </div>

        {/* 03 \u2014 Small by Design */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <Eyebrow dark>03 / SMALL BY DESIGN</Eyebrow>
          <div className="mt-8 max-w-[680px]">
            <p className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-.05em] text-[#f5f0e7]/85">
              Small by design.
            </p>
            <p className="mt-8 text-[17px] leading-[1.6] text-[#f5f0e7]/55">
              Nasiba is intentionally narrow: focused engagements, direct senior involvement, fixed scope, and no layers between diagnosis and strategic work.
            </p>
            <ul className="mt-8 space-y-3 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/48">
              <li>\u2014 Founder-led</li>
              <li>\u2014 Fixed scope</li>
              <li>\u2014 No retainers</li>
              <li>\u2014 No account managers</li>
              <li>\u2014 No handoffs between sales and strategy</li>
            </ul>
          </div>
        </div>

        {/* 04 \u2014 Behind Nasiba */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <Eyebrow dark>04 / BEHIND NASIBA</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[.4fr_1.6fr] lg:gap-24">
            <div>
              <div className="flex h-14 w-14 items-center justify-center border border-[#e96a3a] font-mono-ui text-[16px] font-bold text-[#e96a3a]">P</div>
              <p className="mt-6 font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] text-[#f5f0e7]">Founder &amp; Principal</p>
              <div className="mt-6 space-y-2">
                <p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
                  <a href="https://www.linkedin.com/in/paul-coll/" target="_blank" rel="noopener noreferrer" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">LinkedIn \u2192</a>
                </p>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
                  <a href="https://x.com/1Paul_coll" target="_blank" rel="noopener noreferrer" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">X / Twitter \u2192</a>
                </p>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">
                  <a href="mailto:paul@nasiba.co" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors hover:text-[#e96a3a] hover:border-[#e96a3a]">paul@nasiba.co</a>
                </p>
              </div>
            </div>
            <div>
              <p className="max-w-[600px] text-[17px] leading-[1.6] text-[#f5f0e7]/65">
                Paul leads Nasiba\u2019s diagnostic and strategic work across positioning, economic value, offers, buying events and monetization architecture.
              </p>
            </div>
          </div>
        </div>

        {/* Founder Feedback */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <Eyebrow dark>FOUNDER FEEDBACK</Eyebrow>
          <div className="mt-8 space-y-0 border-t border-[#f5f0e7]/15">
            {founderFeedback.map((fb) => (
              <article key={fb.client} className="border-b border-[#f5f0e7]/15 py-8">
                <div className="border-l-2 border-[#e96a3a] pl-6">
                  <p className="font-display text-[18px] leading-[1.4] tracking-[-.02em] text-[#f5f0e7]/70 italic">
                    &ldquo;{fb.quote}&rdquo;
                  </p>
                </div>
                <p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#e96a3a]">{fb.client}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Cases */}
        <div className="mt-24 border-t border-[#f5f0e7]/15 pt-10">
          <Eyebrow dark>CLIENT WORK</Eyebrow>
          <div className="mt-8 space-y-0 border-t border-[#f5f0e7]/15">
            {casesData.map((c) => (
              <a key={c.slug} href={`/cases/${c.slug}`} className="group flex items-center justify-between border-b border-[#f5f0e7]/15 py-6 transition-colors hover:bg-[#f5f0e7]/5">
                <div className="flex items-center gap-5">
                  <h3 className="font-mono-ui text-[11px] font-bold uppercase tracking-[.14em] text-[#f5f0e7]/80 group-hover:text-[#e96a3a]">{c.name}</h3>
                  <span className="hidden sm:inline font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f5f0e7]/35">{c.engagement}</span>
                </div>
                <span className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e96a3a] opacity-0 transition-opacity group-hover:opacity-100">VIEW CASE \u2192</span>
              </a>
            ))}
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
    setLocation('/');
    window.setTimeout(() => scrollToSection(id), 50);
  };

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <Eyebrow dark>CASES</Eyebrow>
          <h1 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] leading-[.87] tracking-[-.07em] text-[#f5f0e7]">
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
    setLocation('/');
    window.setTimeout(() => scrollToSection(id), 50);
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

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]">
      <Header onNavigate={navigate} />
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">

        {/* Hero */}
        <div className="border-t border-[#f5f0e7]/20 pt-6">
          <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e96a3a]">
            <a href="/cases" className="transition-colors hover:text-[#f18a61]">CASES</a> \u2192 {data.name.toUpperCase()}
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

        {/* CTA */}
        <div className="mt-16">
          <a href="/cases" className="inline-flex items-center gap-3 border-b border-[#e96a3a] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a] transition-colors hover:text-[#f18a61]">\u2190 ALL CASES</a>
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
    setLocation('/');
    window.setTimeout(() => scrollToSection(id), 50);
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
    setLocation('/');
    window.setTimeout(() => scrollToSection(id), 50);
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
          <p>The Revenue Leak Diagnosis is $1,000, delivered in 3\u20134 business days. Revenue Architecture is $10,000, delivered in 2 weeks. Payment is due before work begins. There are no retainers or recurring commitments.</p>
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

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/cases" component={CasesIndex} />
        <Route path="/cases/:slug">
          {(params) => <CaseDetail slug={params.slug} />}
        </Route>
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
