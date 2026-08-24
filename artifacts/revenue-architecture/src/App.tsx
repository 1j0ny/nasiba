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
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'THE THESIS', id: 'thesis' },
  { label: 'THE LENSES', id: 'lenses' },
  { label: 'THE DIAGNOSIS', id: 'diagnosis' },
  { label: 'THE ENGAGEMENT', id: 'engagement' },
  { label: 'WORK', id: 'work' },
  { label: 'ABOUT', id: 'about' },
  { label: 'FAQ', id: 'faq' },
];

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
  ['05', 'Upgrade logic', 'Do expansion paths follow a customer’s growing need, or do they feel like arbitrary feature gates?'],
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

const faqs = [
  ['What does asynchronous mean?', 'No recurring meetings or calls. The engagement is conducted through the product, website, pricing, onboarding and business context you provide, with the diagnosis delivered asynchronously.'],
  ['What is the $1,000 Revenue Leak Diagnosis?', 'A fixed-scope, asynchronous inspection of the commercial gaps between product interest and payment — from positioning and economic value to buying events, upgrade logic, and messaging. It produces a clear commercial map, not a generic audit or a pile of copy suggestions.'],
  ['What do I receive?', 'You receive the six-part diagnosis: Revenue Leak, Root Cause, Economic Logic, Buying Event, Offer / Upgrade Logic, and Priority Map. The delivery includes an annotated revenue path, a written diagnosis, prioritized recommendations, and an asynchronous walkthrough of the thinking.'],
  ['How long does the diagnosis take?', 'The Revenue Leak Diagnosis is delivered in 3–4 days, asynchronously. The broader Revenue Architecture engagement is 2 weeks, asynchronous.'],
  ['How much does each offer cost?', 'The Revenue Leak Diagnosis is $1,000. Revenue Architecture is $10,000 for broader architectural problems that require rebuilding the commercial system around the leak.'],
  ['Do I need to book a call?', 'No. There is no call required to start. The work begins with a focused intake and the materials listed in What I Need. Any clarification happens asynchronously.'],
  ['Is this a copywriting project?', 'No. Copy is one possible expression of the diagnosis, not the deliverable. The work maps the commercial system underneath the words: who buys, why now, what they value, how they enter, and where expansion becomes credible.'],
  ['What do you need from us?', 'A short intake, product access or a guided walkthrough, your current pricing and plan logic, and the seven inputs listed below. The requests stay focused and the work stays asynchronous.'],
  ['Who is this for?', 'B2B and AI SaaS companies with existing users, traffic or demand and a monetization problem worth solving.'],
  ['What happens after the diagnosis?', 'You can use the map internally, or choose the separate $10,000 Revenue Architecture engagement if the diagnosis reveals a broader architectural problem. The $10,000 engagement is not required for a single leak.'],
  ['Do you work on retainers?', 'No. The work is deliberately focused and asynchronous.'],
];

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

function Header({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const handleNavigation = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };
  return (
    <header className="absolute left-0 right-0 top-0 z-40 px-5 py-5 text-[#f5f0e7] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between border-b border-[#f5f0e7]/20 pb-5">
        <button type="button" onClick={() => handleNavigation('top')} className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]" data-testid="button-wordmark" aria-label="NASIBA, back to top">
          <span className="flex h-7 w-7 items-center justify-center border border-[#e96a3a] font-mono-ui text-[11px] font-bold text-[#e96a3a]">N</span>
          <span>
            <span className="block font-mono-ui text-[11px] font-bold uppercase tracking-[0.18em] transition-colors group-hover:text-[#e96a3a]">NASIBA</span>
            <span className="mt-0.5 block font-mono-ui text-[8px] uppercase tracking-[0.12em] text-[#f5f0e7]/45">Revenue architecture for SaaS</span>
          </span>
        </button>
        <nav className="hidden items-center gap-5 xl:gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => handleNavigation(item.id)} className="font-mono-ui text-[9px] uppercase tracking-[0.13em] text-[#f5f0e7]/65 transition-colors hover:text-[#f5f0e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202536]" data-testid={`link-nav-${item.id}`}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => handleNavigation('offer')} className="flex items-center gap-2 bg-[#e96a3a] px-4 py-2.5 font-mono-ui text-[9px] font-bold uppercase tracking-[0.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" data-testid="button-nav-diagnosis">
            START THE DIAGNOSIS — $1,000 <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </nav>
        <button type="button" className="inline-flex h-10 w-10 items-center justify-center border border-[#f5f0e7]/25 text-[#f5f0e7] md:hidden" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="mobile-navigation" data-testid="button-mobile-menu">
          {open ? <X size={19} /> : <Menu size={19} />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="border-b border-[#f5f0e7]/20 bg-[#202536] px-2 py-4 md:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => handleNavigation(item.id)} className="flex w-full items-center justify-between border-b border-[#f5f0e7]/10 px-3 py-4 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[#f5f0e7]/75 last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]" data-testid={`link-mobile-nav-${item.id}`}>
              {item.label}
              <ArrowDownRight size={14} className="text-[#e96a3a]" />
            </button>
          ))}
          <button type="button" onClick={() => handleNavigation('offer')} className="mt-3 flex w-full items-center justify-between bg-[#e96a3a] px-3 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#202536]" data-testid="button-mobile-diagnosis">
            START THE DIAGNOSIS — $1,000 <ArrowRight size={14} />
          </button>
        </nav>
      )}
    </header>
  );
}

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
            An asynchronous diagnosis of the commercial gaps between product interest and payment — from positioning and economic value to buying events, upgrade logic and messaging.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button type="button" onClick={() => onNavigate('offer')} className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" data-testid="button-hero-cta">
              START THE REVENUE LEAK DIAGNOSIS — $1,000 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="mt-7 font-mono-ui text-[11px] font-bold uppercase tracking-[.16em] text-[#f5f0e7]/78" data-testid="text-hero-offer-details">$1,000 · 3–4 DAYS · ASYNCHRONOUS</div>
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
      <div className="absolute bottom-0 left-5 font-mono-ui text-[10px] tracking-[.15em] text-[#f5f0e7]/30 sm:left-8 lg:left-12">01 / 10</div>
    </section>
  );
}

function Thesis() {
  return (
    <section id="thesis" className="scroll-mt-10 border-b border-[#cfc7b7] bg-[#f5f0e7]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-24 lg:px-12 lg:py-36">
        <div><Eyebrow>01 / THE THESIS</Eyebrow><p className="max-w-[300px] font-mono-ui text-[11px] uppercase leading-[1.7] tracking-[.14em] text-[#6c6b68]">Start with the commercial architecture, not the loudest page.</p></div>
        <div>
          <h2 className="max-w-[850px] font-display text-[clamp(3rem,6.4vw,6.6rem)] leading-[.93] tracking-[-.06em] text-[#202536]">Most monetization problems <em className="text-[#e15b2e]">aren&apos;t</em> copy problems.</h2>
          <p className="mt-10 max-w-[820px] border-t border-[#cfc7b7] pt-8 text-[19px] leading-[1.55] text-[#444650]">You can have a strong product, real users and meaningful traffic — and still lose revenue because the path from interest to payment isn&apos;t commercially coherent.</p>
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
          <div><Eyebrow dark>02 / THE REVENUE PATH</Eyebrow><h2 className="max-w-[680px] font-display text-[clamp(3rem,5vw,5rem)] leading-[.92] tracking-[-.06em]">Interest is not revenue.</h2></div>
          <p className="max-w-[350px] text-[15px] leading-[1.55] text-[#202536]/70">Revenue moves through a sequence: INTEREST → UNDERSTANDING → PERCEIVED ECONOMIC VALUE → BUYING EVENT → PAYMENT → EXPANSION.</p>
        </div>
        <p className="mt-8 max-w-[650px] font-display text-[28px] leading-[1.05] tracking-[-.04em]">Revenue leaks when one of these transitions breaks.</p>
        <div className="mt-12 grid grid-cols-1 gap-px bg-[#202536]/25 sm:grid-cols-2 lg:grid-cols-6">
          {revenuePath.map(([number, title, body], index) => (
            <article key={number} className="group min-h-[250px] bg-[#e96a3a] p-5 transition-colors hover:bg-[#f18a61] lg:min-h-[315px] lg:p-6" data-testid={`card-revenue-stage-${index}`}>
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
          <div><Eyebrow dark>03 / THE LENSES</Eyebrow><h2 className="max-w-[460px] font-display text-[clamp(3.5rem,6vw,6.4rem)] leading-[.9] tracking-[-.07em]">Six ways to find a leak.</h2><p className="mt-8 max-w-[310px] text-[15px] leading-[1.6] text-[#f5f0e7]/58">Not a scorecard. A way to inspect the whole commercial chain before choosing a fix.</p></div>
          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {diagnosticLenses.map(([number, title, body]) => (
              <article key={number} className="border-t border-[#f5f0e7]/20 py-6" data-testid={`card-lens-${number}`}><div className="flex justify-between font-mono-ui text-[10px] text-[#e96a3a]"><span>{number}</span><span>+</span></div><h3 className="mt-9 font-display text-[31px] tracking-[-.04em]">{title}</h3><p className="mt-3 max-w-[310px] text-[14px] leading-[1.55] text-[#f5f0e7]/58">{body}</p></article>
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
        <Eyebrow>04 / THE CORRECTION</Eyebrow>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <h2 className="max-w-[600px] font-display text-[clamp(3rem,5.5vw,5.8rem)] leading-[.9] tracking-[-.07em] text-[#202536]">Don&apos;t rewrite the homepage before fixing the economics.</h2>
          <div className="grid grid-cols-1 gap-px bg-[#202536]/20 sm:grid-cols-2">
            <div className="bg-[#c9c4ba] p-6 sm:p-8"><div className="mb-20 flex justify-between font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#202536]/50"><span>Weak approach</span><Minus size={14} /></div><p className="font-display text-[27px] leading-[1.05] tracking-[-.04em] text-[#202536]/70">“The headline is unclear. Let&apos;s make it punchier.”</p><ul className="mt-8 space-y-4 font-mono-ui text-[10px] uppercase leading-[1.55] tracking-[.1em] text-[#202536]/55"><li>— Treats the symptom</li><li>— Starts with the page</li><li>— Produces more opinions</li></ul></div>
            <div className="bg-[#202536] p-6 text-[#f5f0e7] sm:p-8"><div className="mb-20 flex justify-between font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e96a3a]"><span>Commercial approach</span><Plus size={14} /></div><p className="font-display text-[27px] leading-[1.05] tracking-[-.04em]">“What has to be true for this buyer to pay?”</p><ul className="mt-8 space-y-4 font-mono-ui text-[10px] uppercase leading-[1.55] tracking-[.1em] text-[#f5f0e7]/55"><li>— Finds the constraint</li><li>— Starts with the buyer</li><li>— Produces a sequence</li></ul></div>
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
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-[#cfc7b7] pb-8 sm:flex-row sm:items-end"><div><Eyebrow>05 / THE DIAGNOSIS</Eyebrow><h2 className="font-display text-[clamp(3.5rem,6vw,6.4rem)] leading-[.9] tracking-[-.07em] text-[#202536]">One diagnosis.<br /><em className="text-[#e15b2e]">A clear commercial map.</em></h2></div><span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#6c6b68]">Six useful outputs</span></div>
        <div className="grid grid-cols-1 gap-px border-y border-[#cfc7b7] bg-[#cfc7b7] md:grid-cols-2 lg:grid-cols-3">
          {outputs.map(([number, title, body]) => <article key={number} className="min-h-[270px] bg-[#f5f0e7] p-6 sm:p-8" data-testid={`card-output-${number}`}><span className="font-mono-ui text-[10px] text-[#e15b2e]">{number}</span><h3 className="mt-14 font-display text-[32px] leading-[.95] tracking-[-.05em] text-[#202536]">{title}</h3><p className="mt-4 text-[14px] leading-[1.55] text-[#55575c]">{body}</p></article>)}
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
          <div><Eyebrow dark>06 / THE OFFER</Eyebrow><h2 className="max-w-[760px] font-display text-[clamp(4rem,8vw,8.5rem)] leading-[.85] tracking-[-.08em]">Revenue Leak Diagnosis</h2><p className="mt-9 max-w-[650px] text-[20px] leading-[1.45] text-[#202536]/75">A focused analysis of where your current path from interest to payment is breaking, what is causing the leakage, and what commercial architecture needs to change.</p><div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#202536]/25 pt-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#202536]/65"><span>$1,000</span><span>3–4 DAYS</span><span>ASYNCHRONOUS</span><span>FIXED SCOPE</span></div></div>
          <div className="bg-[#202536] p-7 text-[#f5f0e7] sm:p-10">
            <div className="flex items-start justify-between border-b border-[#f5f0e7]/20 pb-8"><span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#e96a3a]">The working room</span><span className="font-display text-[52px] leading-none tracking-[-.06em]">$1,000</span></div>
            <p className="mt-8 text-[17px] leading-[1.5] text-[#f5f0e7]/78">A fixed-scope inspection that identifies where revenue is leaking and gives you a clear commercial map for what to do next.</p>
            <ul className="mt-8 space-y-4 text-[15px] leading-[1.45] text-[#f5f0e7]/70"><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Positioning diagnosis</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Economic framing analysis</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Offer / upgrade architecture</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Buying-event analysis</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Revenue leak identification</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Priority recommendations</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Messaging and homepage implications</li></ul>
            <button type="button" onClick={() => setRequested(true)} className="mt-10 flex w-full items-center justify-between bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" data-testid="button-start-diagnosis">{requested ? 'REQUEST NOTED — I’LL BE IN TOUCH.' : 'START THE DIAGNOSIS — $1,000'} <ArrowRight size={16} /></button>
            {requested && <p className="mt-4 font-mono-ui text-[10px] uppercase leading-[1.5] tracking-[.1em] text-[#f5f0e7]/55" data-testid="status-diagnosis-request">This prototype records your intent locally. The final intake channel can be connected here.</p>}
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
          <div><Eyebrow dark>07 / THE ENGAGEMENT</Eyebrow><h2 className="max-w-[500px] font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[.88] tracking-[-.07em]">Diagnose.<br /><em className="text-[#e96a3a]">Then rebuild.</em></h2><p className="mt-8 max-w-[350px] text-[16px] leading-[1.6] text-[#f5f0e7]/60">Two steps, only when the problem calls for both.</p></div>
          <div>
            <div className="border-t border-[#f5f0e7]/20 py-8"><div className="flex items-start gap-5"><span className="font-mono-ui text-[10px] text-[#e96a3a]">01</span><div><h3 className="font-display text-[40px] leading-none tracking-[-.05em]">DIAGNOSE</h3><p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/65">$1,000 · 3–4 days · Asynchronous. Find the leak, its root cause, and the priority map. This is enough when one commercial transition is unclear.</p></div></div></div>
            <div className="border-y border-[#f5f0e7]/20 py-8"><div className="flex items-start gap-5"><span className="font-mono-ui text-[10px] text-[#e96a3a]">02</span><div><h3 className="font-display text-[40px] leading-none tracking-[-.05em]">REBUILD</h3><p className="mt-4 max-w-[540px] text-[16px] leading-[1.6] text-[#f5f0e7]/65">For products where the diagnosis reveals a broader problem in how positioning, economics, offers, buying events and upgrades work together.</p><div className="mt-5 flex items-baseline gap-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#e96a3a]"><span>$10,000</span><span>2 weeks · Asynchronous</span></div><ul className="mt-6 grid max-w-[570px] grid-cols-1 gap-x-6 gap-y-3 border-t border-[#f5f0e7]/15 pt-5 font-mono-ui text-[10px] uppercase leading-[1.5] tracking-[.1em] text-[#f5f0e7]/55 sm:grid-cols-2"><li>— Positioning audit</li><li>— Economic framing</li><li>— Offer ladder restructuring</li><li>— Buying-event design</li><li>— Pricing &amp; upgrade logic</li><li>— Homepage &amp; messaging implementation guidance</li></ul><button type="button" onClick={() => scrollToSection('offer')} className="mt-8 border-b border-[#e96a3a] pb-1 font-mono-ui text-[10px] font-bold uppercase tracking-[.12em] text-[#e96a3a] transition-colors hover:text-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]" data-testid="button-explore-architecture">EXPLORE REVENUE ARCHITECTURE →</button></div></div></div>
            <p className="mt-9 max-w-[580px] font-display text-[29px] leading-[1.05] tracking-[-.04em] text-[#f5f0e7]">The diagnosis identifies the leak. Revenue Architecture rebuilds the system around it.</p>
            <p className="mt-5 max-w-[530px] text-[15px] leading-[1.55] text-[#f5f0e7]/58">Not every diagnosis requires deeper work. The second engagement exists when the commercial problem is architectural rather than isolated.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [['01', 'CONTEXT', 'You provide the product, pricing, funnel, onboarding and relevant business context.'], ['02', 'DIAGNOSIS', 'I analyze the commercial path asynchronously.'], ['03', 'DELIVERY', 'You receive the diagnosis and prioritized recommendations within 3–4 days.']];
  const inputs = ['Product / website', 'Pricing', 'Acquisition context', 'Conversion or activation context', 'Onboarding flow', 'Relevant analytics or business data', 'Anything you already know about the monetization problem'];
  return (
    <section id="how-it-works" className="scroll-mt-10 border-b border-[#cfc7b7] bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <Eyebrow>08 / HOW IT WORKS</Eyebrow>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
          <div><h2 className="max-w-[620px] font-display text-[clamp(3.5rem,6vw,6.3rem)] leading-[.88] tracking-[-.07em] text-[#202536]">A quiet process.<br /><em className="text-[#e15b2e]">A sharper answer.</em></h2><div className="mt-14 border-t border-[#202536]/20">{steps.map(([number, title, body]) => <article key={number} className="grid grid-cols-[48px_1fr] gap-4 border-b border-[#202536]/20 py-7"><span className="font-mono-ui text-[10px] text-[#e15b2e]">{number}</span><div><h3 className="font-mono-ui text-[11px] font-bold uppercase tracking-[.14em] text-[#202536]">{title}</h3><p className="mt-3 max-w-[440px] text-[16px] leading-[1.55] text-[#55575c]">{body}</p></div></article>)}<p className="pt-6 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#6c6b68]">No recurring meetings. No retainer.</p></div></div>
          <div className="bg-[#f5f0e7] p-7 sm:p-10"><div className="flex items-center justify-between border-b border-[#cfc7b7] pb-5"><h3 className="font-display text-[39px] leading-none tracking-[-.05em] text-[#202536]">WHAT I NEED</h3><span className="font-mono-ui text-[10px] text-[#e15b2e]">07 INPUTS</span></div><ol className="mt-4">{inputs.map((input, index) => <li key={input} className="grid grid-cols-[36px_1fr] gap-3 border-b border-[#cfc7b7] py-4 text-[14px] leading-[1.45] text-[#55575c]"><span className="font-mono-ui text-[10px] text-[#e15b2e]">0{index + 1}</span><span>{input}</span></li>)}</ol></div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="scroll-mt-10 bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <Eyebrow>09 / WORK</Eyebrow>
        <div className="grid min-h-[320px] grid-cols-1 items-end gap-12 border-t border-[#cfc7b7] pt-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <h2 className="font-display text-[clamp(3.5rem,6vw,6.3rem)] leading-[.88] tracking-[-.07em] text-[#202536]">Work will<br /><em className="text-[#e15b2e]">appear here.</em></h2>
          <p className="max-w-[520px] border-l-2 border-[#e15b2e] pl-5 text-[17px] leading-[1.6] text-[#55575c]">This space is reserved for future material. No examples are presented here yet.</p>
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
        <Eyebrow>10 / FAQ</Eyebrow>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24"><h2 className="font-display text-[clamp(3.3rem,5.5vw,5.6rem)] leading-[.9] tracking-[-.07em] text-[#202536]">The useful<br /><em className="text-[#e15b2e]">short version.</em></h2><div className="border-t border-[#cfc7b7]">{faqs.map(([question, answer], index) => { const isOpen = openIndex === index; return <div key={question} className="border-b border-[#cfc7b7]"><button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e15b2e]" aria-expanded={isOpen} data-testid={`button-faq-${index}`}><span className="font-display text-[25px] leading-[1.1] tracking-[-.03em] text-[#202536]">{question}</span><ChevronDown size={18} className={`shrink-0 text-[#e15b2e] transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <div className="max-w-[620px] pb-7 pr-8 text-[15px] leading-[1.6] text-[#55575c]" data-testid={`text-faq-answer-${index}`}>{answer}</div>}</div>; })}</div></div>
      </div>
    </section>
  );
}

function FinalCTA({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section className="bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="max-w-[1000px]"><Eyebrow dark>Start with the leak</Eyebrow><h2 className="font-display text-[clamp(4rem,9vw,9.2rem)] leading-[.84] tracking-[-.08em]">Your product may not need more traffic<span className="text-[#e96a3a]">.</span></h2><p className="mt-8 max-w-[590px] text-[18px] leading-[1.55] text-[#f5f0e7]/60">It may need a better path from the attention you already have to the revenue you want.</p><div className="mt-12 flex flex-col items-start gap-7 sm:flex-row sm:items-center"><button type="button" onClick={() => onNavigate('offer')} className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" data-testid="button-final-cta">START THE $1,000 DIAGNOSIS → <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button><span className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">No retainer. No recurring commitment.</span></div></div>
        <footer className="mt-24 flex flex-col justify-between gap-8 border-t border-[#f5f0e7]/20 pt-7 sm:flex-row sm:items-end"><div><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center border border-[#e96a3a] font-mono-ui text-[11px] font-bold text-[#e96a3a]">N</span><span className="font-mono-ui text-[11px] font-bold uppercase tracking-[.16em]">NASIBA</span></div><p className="mt-4 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#f5f0e7]/38">Revenue architecture for SaaS.</p></div><div className="font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#f5f0e7]/38">© {new Date().getFullYear()} · Private working room</div></footer>
      </div>
    </section>
  );
}

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
    if (id === 'about') {
      setLocation('/about');
      return;
    }
    scrollToSection(id);
  };
  return <main className="page-grain overflow-hidden"><Hero onNavigate={navigate} /><Thesis /><RevenuePath /><Lenses /><Comparison /><Diagnosis /><Offer /><Engagement /><HowItWorks /><Work /><FAQ /><FinalCTA onNavigate={navigate} /></main>;
}

function About() {
  const [, setLocation] = useLocation();
  const navigate = (id: string) => {
    if (id === 'about') return;
    setLocation('/');
    window.setTimeout(() => scrollToSection(id), 50);
  };
  return <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7]"><Header onNavigate={navigate} /><div className="mx-auto flex min-h-[100dvh] max-w-[1400px] items-end px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28"><div className="border-t border-[#f5f0e7]/20 pt-6"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e96a3a]">ABOUT</p><p className="mt-5 font-display text-[clamp(2rem,4vw,4rem)] leading-none tracking-[-.05em] text-[#f5f0e7]/55">About content will be added later.</p></div></div></main>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/about" component={About} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;