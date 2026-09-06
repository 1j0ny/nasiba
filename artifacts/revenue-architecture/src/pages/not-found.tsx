import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main className="page-grain min-h-[100dvh] bg-[#202536] text-[#f5f0e7] flex items-center justify-center">
      <div className="mx-auto max-w-[600px] px-5 text-center">
        <div className="mb-6 flex items-center justify-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#e96a3a]">
          <span className="h-px w-8 bg-current" />
          <span>NOT FOUND</span>
          <span className="h-px w-8 bg-current" />
        </div>
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[.88] tracking-[-.07em] text-[#f5f0e7]">
          404
        </h1>
        <p className="mt-6 text-[17px] leading-[1.55] text-[#f5f0e7]/58">
          This page does not exist. If you arrived here from an internal link, something may have changed.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setLocation('/')}
            className="bg-[#e96a3a] px-5 py-3.5 radius-btn font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#202536] transition-all duration-[160ms] hover:bg-[#f18a61] hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]"
          >
            BACK TO HOME
          </button>
          <button
            type="button"
            onClick={() => setLocation('/start')}
            className="border border-[#f5f0e7]/20 px-5 py-3.5 radius-btn font-mono-ui text-[10px] font-bold uppercase tracking-[.1em] text-[#f5f0e7]/60 transition-all duration-[160ms] hover:border-[#e96a3a] hover:text-[#e96a3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5f0e7]"
          >
            START DIAGNOSIS
          </button>
        </div>
        <p className="mt-8 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#f5f0e7]/35">
          Or email <a href="mailto:paul@nasiba.co" className="border-b border-[#f5f0e7]/20 pb-0.5 transition-colors duration-200 hover:text-[#e96a3a] hover:border-[#e96a3a]">paul@nasiba.co</a>
        </p>
      </div>
    </main>
  );
}
