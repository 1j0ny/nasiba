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
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'The thesis', id: 'thesis' },
  { label: 'The lenses', id: 'lenses' },
  { label: 'The diagnosis', id: 'diagnosis' },
  { label: 'Fit', id: 'fit' },
  { label: 'FAQ', id: 'faq' },
];

const revenuePath = [
  ['01', 'Interest', 'Someone notices a problem worth solving.'],
  ['02', 'Understanding', 'They can explain what your product does.'],
  ['03', 'Perceived economic value', 'The outcome feels worth more than the price.'],
  ['04', 'Buying event', 'A moment gives them a reason to act now.'],
  ['05', 'Payment', 'The path to yes is specific and credible.'],
  ['06', 'Expansion', 'The account has somewhere logical to grow.'],
];

const diagnosticLenses = [
  {
    number: '01',
    title: 'Positioning',
    body: 'Who is this for, in the language of a budget owner? Where does your product sit in the category they already understand?',
  },
  {
    number: '02',
    title: 'Economic framing',
    body: 'What does the buyer believe this changes financially — in time, risk, throughput, retention, or margin?',
  },
  {
    number: '03',
    title: 'Offer architecture',
    body: 'Does the structure of plans, packaging, and commitments make the first commercial decision legible?',
  },
  {
    number: '04',
    title: 'Buying events',
    body: 'What event turns a capable user into a buyer? A trigger must be visible before a CTA can work.',
  },
  {
    number: '05',
    title: 'Upgrade logic',
    body: 'Do expansion paths follow a customer’s growing need, or do they feel like arbitrary feature gates?',
  },
  {
    number: '06',
    title: 'Messaging',
    body: 'Only after the commercial logic is clear: does the page make the right idea easy to grasp and repeat?',
  },
];

const faqs = [
  {
    question: 'Is this a copywriting project?',
    answer:
      'No. Copy is one possible expression of the diagnosis, not the deliverable. I map the commercial system underneath the words: who buys, why now, what they value, how they enter, and where expansion becomes credible.',
  },
  {
    question: 'What do you need from us?',
    answer:
      'A short intake, access to the product or a guided walkthrough, your current pricing and plan logic, and any evidence you already have: call notes, activation patterns, funnel observations, or customer language. I work asynchronously and keep requests focused.',
  },
  {
    question: 'Who is this best suited for?',
    answer:
      'A SaaS founder or CEO with a live product, existing users and demand, and a specific feeling that revenue is not keeping up. It is especially useful before a homepage rewrite, pricing change, or larger acquisition push.',
  },
  {
    question: 'Do you implement the recommendations?',
    answer:
      'The fixed-scope engagement is a diagnosis, not implementation. You receive the commercial map and a prioritized set of moves. If you want help translating that map into a later project, that can be discussed separately — there is no retainer attached.',
  },
  {
    question: 'Why asynchronous?',
    answer:
      'The work benefits from uninterrupted inspection. Async gives me room to study the product, pricing, and evidence without turning the diagnosis into a string of meetings. You get a considered point of view in 3–4 days, not a workshop full of unprocessed notes.',
  },
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
        <button
          type="button"
          onClick={() => scrollToSection('top')}
          className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]"
          data-testid="button-wordmark"
          aria-label="Revenue Architecture, back to top"
        >
          <span className="flex h-7 w-7 items-center justify-center border border-[#e96a3a] font-mono-ui text-[11px] font-bold text-[#e96a3a]">RA</span>
          <span className="font-mono-ui text-[11px] font-bold uppercase tracking-[0.16em] transition-colors group-hover:text-[#e96a3a]">Revenue Architecture</span>
        </button>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.id)}
              className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[#f5f0e7]/65 transition-colors hover:text-[#f5f0e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202536]"
              data-testid={`link-nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNavigation('offer')}
            className="flex items-center gap-2 bg-[#e96a3a] px-4 py-2.5 font-mono-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]"
            data-testid="button-nav-diagnosis"
          >
            Start the Diagnosis <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-[#f5f0e7]/25 text-[#f5f0e7] md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          data-testid="button-mobile-menu"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="border-b border-[#f5f0e7]/20 bg-[#202536] px-2 py-4 md:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.id)}
              className="flex w-full items-center justify-between border-b border-[#f5f0e7]/10 px-3 py-4 text-left font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[#f5f0e7]/75 last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e96a3a]"
              data-testid={`link-mobile-nav-${item.id}`}
            >
              {item.label}
              <ArrowDownRight size={14} className="text-[#e96a3a]" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNavigation('offer')}
            className="mt-3 flex w-full items-center justify-between bg-[#e96a3a] px-3 py-4 font-mono-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#202536]"
            data-testid="button-mobile-diagnosis"
          >
            Start the Diagnosis <ArrowRight size={14} />
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
        <div className="reveal max-w-[760px]">
          <Eyebrow dark>Commercial diagnosis / 001</Eyebrow>
          <h1 className="font-display text-[clamp(4.5rem,10vw,9rem)] leading-[.87] tracking-[-0.07em] text-[#f5f0e7]">
            Find where your SaaS is <span className="text-[#e96a3a]">losing revenue.</span>
          </h1>
          <p className="mt-9 max-w-[610px] text-balance text-[18px] leading-[1.55] text-[#f5f0e7]/68 sm:text-[21px]">
            An asynchronous diagnosis of the commercial gaps between product interest and payment — from positioning and economic value to buying events, upgrade logic and messaging.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onNavigate('offer')}
              className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[11px] font-bold uppercase tracking-[0.12em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]"
              data-testid="button-hero-cta"
            >
              Get the Revenue Leak Diagnosis — $1,000
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.13em] text-[#f5f0e7]/45">Async · 3–4 days · Fixed scope</span>
          </div>
        </div>
        <div className="reveal reveal-delay-2 relative min-h-[300px] lg:mb-4">
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#f5f0e7]/25 pt-4">
            <div className="mb-8 flex items-center justify-between font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[#f5f0e7]/50">
              <span>Where interest stops</span><span className="text-[#e96a3a]">→</span>
            </div>
            <div className="relative flex h-[150px] items-end justify-between gap-2">
              {[82, 63, 49, 36, 25, 17].map((height, index) => (
                <div key={height} className="relative flex h-full flex-1 items-end">
                  <div className={`w-full ${index === 3 ? 'bg-[#e96a3a]' : 'bg-[#f5f0e7]/20'}`} style={{ height: `${height}%` }} />
                  {index === 3 && <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono-ui text-[9px] uppercase tracking-[.1em] text-[#e96a3a]">the leak</span>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f5f0e7]/40">
              <span>Demand</span><span>Payment</span>
            </div>
          </div>
          <p className="absolute right-0 top-0 max-w-[190px] border-l border-[#e96a3a] pl-4 text-[14px] leading-[1.45] text-[#f5f0e7]/65">No more guessing which page, plan, or CTA to rewrite first.</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-5 font-mono-ui text-[10px] tracking-[.15em] text-[#f5f0e7]/30 sm:left-8 lg:left-12">01 / 09</div>
    </section>
  );
}

function Thesis() {
  return (
    <section id="thesis" className="scroll-mt-10 border-b border-[#cfc7b7] bg-[#f5f0e7]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-24 lg:px-12 lg:py-36">
        <div>
          <Eyebrow>01 / The thesis</Eyebrow>
          <p className="max-w-[300px] font-mono-ui text-[11px] uppercase leading-[1.7] tracking-[.14em] text-[#6c6b68]">Your product may not need more traffic.</p>
        </div>
        <div>
          <h2 className="max-w-[850px] font-display text-[clamp(3rem,6.4vw,6.6rem)] leading-[.93] tracking-[-.06em] text-[#202536]">
            Most monetization problems <em className="text-[#e15b2e]">aren&apos;t</em> copy problems.
          </h2>
          <div className="mt-10 grid max-w-[850px] grid-cols-1 gap-8 border-t border-[#cfc7b7] pt-8 sm:grid-cols-2">
            <p className="text-[17px] leading-[1.6] text-[#444650]">They are architectural. The product creates interest, but the commercial system does not help a buyer understand the value, recognize the moment, or choose a way in.</p>
            <p className="text-[17px] leading-[1.6] text-[#444650]">I look for the break in the revenue path — then turn the finding into a map your team can act on without another month of guessing.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RevenuePath() {
  return (
    <section className="bg-[#e96a3a] text-[#202536]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col justify-between gap-8 border-b border-[#202536]/25 pb-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow dark>02 / The revenue path</Eyebrow>
            <h2 className="max-w-[680px] font-display text-[clamp(3rem,5vw,5rem)] leading-[.92] tracking-[-.06em]">Interest is not revenue.</h2>
          </div>
          <p className="max-w-[315px] text-[15px] leading-[1.55] text-[#202536]/70">Every stage asks a different commercial question. A leak at one stage makes the next stage look guilty.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-px bg-[#202536]/25 sm:grid-cols-2 lg:grid-cols-6">
          {revenuePath.map(([number, title, body], index) => (
            <div key={number} className="group min-h-[230px] bg-[#e96a3a] p-5 transition-colors hover:bg-[#f18a61] lg:min-h-[300px] lg:p-6" data-testid={`card-revenue-stage-${index}`}>
              <div className="flex items-center justify-between font-mono-ui text-[10px] tracking-[.12em]">
                <span>{number}</span>
                {index < revenuePath.length - 1 ? <ArrowRight size={14} /> : <Circle size={9} fill="currentColor" />}
              </div>
              <div className="mt-16 lg:mt-28">
                <h3 className="font-display text-[28px] leading-none tracking-[-.04em]">{title}</h3>
                <p className="mt-4 text-[14px] leading-[1.45] text-[#202536]/67">{body}</p>
              </div>
            </div>
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
          <div>
            <Eyebrow dark>03 / The lenses</Eyebrow>
            <h2 className="max-w-[460px] font-display text-[clamp(3.5rem,6vw,6.4rem)] leading-[.9] tracking-[-.07em]">Six ways to find a leak.</h2>
            <p className="mt-8 max-w-[310px] text-[15px] leading-[1.6] text-[#f5f0e7]/58">Not a scorecard. A way to inspect the whole commercial chain before choosing a fix.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {diagnosticLenses.map((lens) => (
              <article key={lens.number} className="border-t border-[#f5f0e7]/20 py-6" data-testid={`card-lens-${lens.number}`}>
                <div className="flex justify-between font-mono-ui text-[10px] text-[#e96a3a]"><span>{lens.number}</span><span>+</span></div>
                <h3 className="mt-9 font-display text-[31px] tracking-[-.04em]">{lens.title}</h3>
                <p className="mt-3 max-w-[310px] text-[14px] leading-[1.55] text-[#f5f0e7]/58">{lens.body}</p>
              </article>
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
        <Eyebrow>04 / The correction</Eyebrow>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <h2 className="max-w-[600px] font-display text-[clamp(3rem,5.5vw,5.8rem)] leading-[.9] tracking-[-.07em] text-[#202536]">Don&apos;t rewrite the homepage before fixing the economics.</h2>
          <div className="grid grid-cols-1 gap-px bg-[#202536]/20 sm:grid-cols-2">
            <div className="bg-[#c9c4ba] p-6 sm:p-8">
              <div className="mb-20 flex justify-between font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#202536]/50"><span>Weak approach</span><Minus size={14} /></div>
              <p className="font-display text-[27px] leading-[1.05] tracking-[-.04em] text-[#202536]/70">“The headline is unclear. Let&apos;s make it punchier.”</p>
              <ul className="mt-8 space-y-4 font-mono-ui text-[10px] uppercase leading-[1.55] tracking-[.1em] text-[#202536]/55">
                <li>— Treats the symptom</li><li>— Starts with the page</li><li>— Produces more opinions</li>
              </ul>
            </div>
            <div className="bg-[#202536] p-6 text-[#f5f0e7] sm:p-8">
              <div className="mb-20 flex justify-between font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e96a3a]"><span>Commercial approach</span><Plus size={14} /></div>
              <p className="font-display text-[27px] leading-[1.05] tracking-[-.04em]">“What has to be true for this buyer to pay?”</p>
              <ul className="mt-8 space-y-4 font-mono-ui text-[10px] uppercase leading-[1.55] tracking-[.1em] text-[#f5f0e7]/55">
                <li>— Finds the constraint</li><li>— Starts with the buyer</li><li>— Produces a sequence</li>
              </ul>
            </div>
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
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-[#cfc7b7] pb-8 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>05 / The output</Eyebrow>
            <h2 className="font-display text-[clamp(3.5rem,6vw,6.4rem)] leading-[.9] tracking-[-.07em] text-[#202536]">One diagnosis.<br /><em className="text-[#e15b2e]">A clear commercial map.</em></h2>
          </div>
          <span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#6c6b68]">Delivered in 3–4 days</span>
        </div>
        <div className="grid grid-cols-1 gap-0 border-y border-[#cfc7b7] lg:grid-cols-[1.1fr_.9fr]">
          <div className="grid grid-cols-1 gap-10 border-b border-[#cfc7b7] py-10 sm:grid-cols-2 lg:border-b-0 lg:border-r lg:pr-16">
            {[
              ['01', 'A revenue path map', 'Where interest turns into understanding, value, buying intent, payment, and expansion — with the most likely break marked.'],
              ['02', 'A prioritized diagnosis', 'The commercial constraint, the evidence behind it, and what not to spend time fixing yet.'],
              ['03', 'A move sequence', 'A practical order for pricing, offer, product, sales, and messaging decisions.'],
              ['04', 'A founder handoff', 'A concise async walkthrough so your team can use the thinking without a follow-up workshop.'],
            ].map(([number, title, body]) => (
              <div key={number} data-testid={`text-deliverable-${number}`}>
                <span className="font-mono-ui text-[10px] text-[#e15b2e]">{number}</span>
                <h3 className="mt-5 font-display text-[28px] leading-none tracking-[-.04em] text-[#202536]">{title}</h3>
                <p className="mt-4 text-[14px] leading-[1.55] text-[#55575c]">{body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-12 py-10 lg:pl-16">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#6c6b68]">What it is</p>
              <p className="mt-5 max-w-[390px] font-display text-[34px] leading-[1.03] tracking-[-.045em] text-[#202536]">A fixed-scope inspection for a product with real demand and an unclear commercial path.</p>
            </div>
            <div className="border-l-2 border-[#e15b2e] pl-5">
              <p className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#e15b2e]">What it is not</p>
              <p className="mt-4 max-w-[390px] text-[16px] leading-[1.55] text-[#55575c]">A retainer, a generic audit, a bundle of homepage rewrites, or a promise to solve a problem before looking at it.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudies() {
  const cases = [
    ['01', 'The “free forever” ceiling', 'Sample strategic situation', 'A workflow product had a loyal free cohort and plenty of product interest, but the paid threshold was hidden behind feature language.', 'Inspect the moment when a team outgrows the free plan. The question is not “which feature do we gate?” but “what new economic responsibility arrives?”'],
    ['02', 'The broad ICP problem', 'Sample strategic situation', 'A developer tool spoke to builders, team leads, and executives at once. Each audience could understand it; none could immediately own the buying case.', 'Separate user, champion, and economic buyer. Give the offer one sharp job before asking the page to serve three.'],
    ['03', 'The annual plan dead-end', 'Sample strategic situation', 'A B2B platform led with an annual commitment before a buyer had a reason to trust the product inside a real workflow.', 'Find the smaller buying event that earns the right to ask for commitment. Price is not always the first friction.'],
    ['04', 'The invisible expansion path', 'Sample strategic situation', 'A product grew inside accounts, but its plans described features rather than the new volume, risk, or coordination the account had taken on.', 'Make expansion follow the customer’s changing economic shape — not an arbitrary ladder of checkboxes.'],
  ];
  return (
    <section className="bg-[#ddd8ce]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>06 / Working situations</Eyebrow>
            <h2 className="max-w-[760px] font-display text-[clamp(3.4rem,6vw,6.3rem)] leading-[.89] tracking-[-.07em] text-[#202536]">The kind of pattern<br /><em className="text-[#e15b2e]">I look for.</em></h2>
          </div>
          <p className="max-w-[250px] font-mono-ui text-[10px] uppercase leading-[1.65] tracking-[.12em] text-[#6c6b68]">Evidence-style examples.<br />No client claims. No invented results.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-px bg-[#202536]/20 md:grid-cols-2">
          {cases.map(([number, title, label, setup, move]) => (
            <article key={number} className="bg-[#ddd8ce] p-6 transition-colors hover:bg-[#e9e4db] sm:p-9" data-testid={`card-case-${number}`}>
              <div className="flex items-center justify-between border-b border-[#202536]/20 pb-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#6c6b68]"><span>{number}</span><span className="text-[#e15b2e]">{label}</span></div>
              <h3 className="mt-8 max-w-[420px] font-display text-[36px] leading-[.98] tracking-[-.05em] text-[#202536]">{title}</h3>
              <p className="mt-7 text-[16px] leading-[1.55] text-[#444650]">{setup}</p>
              <div className="mt-8 border-l-2 border-[#e15b2e] pl-4"><p className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#e15b2e]">Diagnostic angle</p><p className="mt-3 text-[14px] leading-[1.55] text-[#55575c]">{move}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicAnalyses() {
  return (
    <section className="bg-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <Eyebrow>07 / Selected public analyses</Eyebrow>
            <h2 className="max-w-[480px] font-display text-[clamp(3.3rem,5.7vw,6rem)] leading-[.9] tracking-[-.07em] text-[#202536]">A public trail of commercial questions.</h2>
          </div>
          <div className="border-t border-[#cfc7b7]">
            {[
              ['Pricing pages', 'What a pricing table teaches a buyer before they ever click a plan.'],
              ['Activation moments', 'The difference between a user completing setup and a buyer recognizing value.'],
              ['Expansion design', 'Why “more features” is often a weaker expansion story than more responsibility.'],
            ].map(([title, description], index) => (
              <div key={title} className="grid grid-cols-[48px_1fr] gap-5 border-b border-[#cfc7b7] py-7" data-testid={`row-analysis-${index}`}>
                <span className="font-mono-ui text-[10px] text-[#e15b2e]">0{index + 1}</span>
                <div><h3 className="font-display text-[29px] leading-none tracking-[-.04em] text-[#202536]">{title}</h3><p className="mt-3 max-w-[500px] text-[15px] leading-[1.55] text-[#55575c]">{description}</p><span className="mt-4 inline-block font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#6c6b68]">Public note · no endorsement implied</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Fit() {
  return (
    <section id="fit" className="scroll-mt-10 bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-32">
        <div>
          <Eyebrow dark>08 / Qualification</Eyebrow>
          <h2 className="max-w-[500px] font-display text-[clamp(3.4rem,6vw,6.4rem)] leading-[.9] tracking-[-.07em]">This is for products that already have something to lose.</h2>
        </div>
        <div className="grid grid-cols-1 gap-px bg-[#f5f0e7]/20 sm:grid-cols-2">
          <div className="bg-[#202536] p-7 sm:p-9">
            <div className="mb-14 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8f948f]"><Check size={14} className="text-[#e96a3a]" /> Good fit</div>
            <ul className="space-y-5 text-[16px] leading-[1.45] text-[#f5f0e7]/70"><li>You have a live product and existing users.</li><li>There is demand, but the path to payment feels soft.</li><li>You are considering pricing, packaging, or a conversion push.</li><li>You want a point of view before commissioning more production.</li></ul>
          </div>
          <div className="bg-[#303545] p-7 sm:p-9">
            <div className="mb-14 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8f948f]"><X size={14} className="text-[#e96a3a]" /> Not a fit</div>
            <ul className="space-y-5 text-[16px] leading-[1.45] text-[#f5f0e7]/55"><li>You need a logo, a brand voice, or a content calendar.</li><li>You are still validating whether anyone wants the product.</li><li>You want a large research project or ongoing consulting hours.</li><li>You are looking for a guaranteed conversion number.</li></ul>
          </div>
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
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
          <div>
            <Eyebrow dark>09 / The offer</Eyebrow>
            <h2 className="max-w-[760px] font-display text-[clamp(4rem,8vw,8.5rem)] leading-[.85] tracking-[-.08em]">Revenue Leak Diagnosis</h2>
            <p className="mt-9 max-w-[620px] text-[20px] leading-[1.45] text-[#202536]/75">A sharp, asynchronous inspection of the commercial gaps between interest and payment.</p>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#202536]/25 pt-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[#202536]/65"><span>Async</span><span>3–4 days</span><span>Fixed scope</span><span>No retainer</span></div>
          </div>
          <div className="bg-[#202536] p-7 text-[#f5f0e7] sm:p-10">
            <div className="flex items-start justify-between border-b border-[#f5f0e7]/20 pb-8"><span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#e96a3a]">The working room</span><span className="font-display text-[52px] leading-none tracking-[-.06em]">$1,000</span></div>
            <ul className="mt-8 space-y-4 text-[15px] leading-[1.45] text-[#f5f0e7]/70"><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Intake and product context review</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Revenue path and six-lens diagnosis</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Prioritized commercial move sequence</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#e96a3a]" /> Async walkthrough and handoff</li></ul>
            <button type="button" onClick={() => setRequested(true)} className="mt-10 flex w-full items-center justify-between bg-[#e96a3a] px-5 py-4 font-mono-ui text-[11px] font-bold uppercase tracking-[.12em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" data-testid="button-start-diagnosis">{requested ? 'Request noted — I’ll be in touch.' : 'Start the Diagnosis'} <ArrowRight size={16} /></button>
            {requested && <p className="mt-4 font-mono-ui text-[10px] uppercase leading-[1.5] tracking-[.1em] text-[#f5f0e7]/55" data-testid="status-diagnosis-request">This prototype records your intent locally. The final intake channel can be connected here.</p>}
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
        <Eyebrow>Questions before the room</Eyebrow>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <h2 className="font-display text-[clamp(3.3rem,5.5vw,5.6rem)] leading-[.9] tracking-[-.07em] text-[#202536]">The useful<br /><em className="text-[#e15b2e]">short version.</em></h2>
          <div className="border-t border-[#cfc7b7]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="border-b border-[#cfc7b7]">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e15b2e]" aria-expanded={isOpen} data-testid={`button-faq-${index}`}>
                    <span className="font-display text-[25px] leading-[1.1] tracking-[-.03em] text-[#202536]">{faq.question}</span>
                    <ChevronDown size={18} className={`shrink-0 text-[#e15b2e] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <div className="max-w-[620px] pb-7 pr-8 text-[15px] leading-[1.6] text-[#55575c]" data-testid={`text-faq-answer-${index}`}>{faq.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section className="bg-[#202536] text-[#f5f0e7]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="max-w-[1000px]">
          <Eyebrow dark>Close the gap</Eyebrow>
          <h2 className="font-display text-[clamp(4rem,9vw,9.2rem)] leading-[.84] tracking-[-.08em]">Your product may not need more traffic<span className="text-[#e96a3a]">.</span></h2>
          <div className="mt-12 flex flex-col items-start gap-7 sm:flex-row sm:items-center">
            <button type="button" onClick={() => onNavigate('offer')} className="group flex items-center gap-5 bg-[#e96a3a] px-5 py-4 font-mono-ui text-[11px] font-bold uppercase tracking-[.12em] text-[#202536] transition-colors hover:bg-[#f18a61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]" data-testid="button-final-cta">Get the Revenue Leak Diagnosis — $1,000 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
            <span className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/45">A better question may be cheaper than more traffic.</span>
          </div>
        </div>
        <footer className="mt-24 flex flex-col justify-between gap-8 border-t border-[#f5f0e7]/20 pt-7 sm:flex-row sm:items-end">
          <div><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center border border-[#e96a3a] font-mono-ui text-[11px] font-bold text-[#e96a3a]">RA</span><span className="font-mono-ui text-[11px] font-bold uppercase tracking-[.16em]">Revenue Architecture</span></div><p className="mt-4 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#f5f0e7]/38">Commercial clarity for products with demand.</p></div>
          <div className="font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#f5f0e7]/38">© {new Date().getFullYear()} · Private working room</div>
        </footer>
      </div>
    </section>
  );
}

function Home() {
  useEffect(() => {
    document.title = 'Revenue Architecture — Find where your SaaS is losing revenue.';
    const description = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'An asynchronous Revenue Leak Diagnosis for SaaS founders with demand, users, and a commercial gap between interest and payment.');
    document.head.appendChild(description);
    const ogTitle = document.querySelector('meta[property="og:title"]') ?? document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Revenue Architecture — Find where your SaaS is losing revenue.');
    document.head.appendChild(ogTitle);
    const ogDescription = document.querySelector('meta[property="og:description"]') ?? document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'A commercial diagnosis for the gap between product interest and payment.');
    document.head.appendChild(ogDescription);
    const favicon = document.querySelector('link[rel="icon"]') ?? document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('type', 'image/svg+xml');
    favicon.setAttribute('href', 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 fill=%22%23202536%22/%3E%3Cpath d=%22M7 7h18v4H11v4h10v4H11v6H7z%22 fill=%22%23e96a3a%22/%3E%3C/svg%3E');
    document.head.appendChild(favicon);
  }, []);

  const navigate = (id: string) => scrollToSection(id, undefined);
  return (
    <main className="page-grain overflow-hidden">
      <Hero onNavigate={navigate} />
      <Thesis />
      <RevenuePath />
      <Lenses />
      <Comparison />
      <Diagnosis />
      <CaseStudies />
      <PublicAnalyses />
      <Fit />
      <Offer />
      <FAQ />
      <FinalCTA onNavigate={navigate} />
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

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