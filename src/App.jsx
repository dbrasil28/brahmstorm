import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, Copy, Save, Music2, Flame, Archive, Check, Loader2,
  X, Trash2, ChevronDown, Disc3, Radio, FileText, MessageSquareQuote,
  AlertTriangle, Wand2, Lightbulb, Eraser, Globe, ExternalLink,
  ArrowRight, Lock, Zap, Heart, Code, AtSign, Mail, Settings2,
  Feather, Sliders, Download,
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// ═══════════════════════════════════════════════════════════════════
// Brahmstorm — Root orchestrator (combined single-file build)
//
// Routing by URL hash:
//   - Empty hash  → Landing
//   - "#app"      → App (Brahmstorm prompt forge)
// ═══════════════════════════════════════════════════════════════════

const VIEW_LANDING = 'landing';
const VIEW_APP = 'app';

function getViewFromHash() {
  if (typeof window === 'undefined') return VIEW_LANDING;
  const hash = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
  return hash === 'app' ? VIEW_APP : VIEW_LANDING;
}

export default function Brahmstorm() {
  const [view, setView] = useState(getViewFromHash);

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = view === VIEW_APP
      ? 'Brahmstorm · Studio'
      : 'Brahmstorm · Prompt Forge for Suno AI';
  }, [view]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view]);

  const goToApp = () => {
    window.location.hash = 'app';
    try { localStorage.setItem('bs:seenLanding', '1'); } catch (e) {}
  };

  const goToLanding = () => {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }
    setView(VIEW_LANDING);
  };

  if (view === VIEW_APP) return (
    <>
      <BrahmstormApp onBack={goToLanding} />
      <Analytics />
      <SpeedInsights />
    </>
  );
  return (
    <>
      <BrahmstormLanding onLaunch={goToApp} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// BRAHMSTORM — Landing Page (final)
//
// Design system: 8px spacing grid · Fraunces display + JetBrains Mono ·
// Dark editorial hero, cream paper sections · burnt orange accent ·
// Atmospheric photography from Unsplash CDN.
// ═══════════════════════════════════════════════════════════════════

const PHOTOS = {
  studio: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=85&auto=format',
  hands: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=1200&q=85&auto=format',
  vinyl: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=1600&q=85&auto=format',
  neon: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=1600&q=85&auto=format',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85&auto=format',
};

// onLaunch is provided by parent orchestrator; if used standalone, falls back to hash
function BrahmstormLanding({ onLaunch }) {
  const openApp = () => {
    if (onLaunch) onLaunch();
    else window.location.hash = 'app';
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [lang, setLang] = useState(detectLang);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langBtnRef = useRef(null);
  const tL = LANDING_UI[lang] || LANDING_UI.en;
  useEffect(() => {
    try { localStorage.setItem('bs:lang', lang); } catch (e) {}
    if (typeof document !== 'undefined') {
      document.title = tL.meta_title;
      document.documentElement.lang = lang;
    }
  }, [lang, tL.meta_title]);

  return (
    <div className="min-h-screen w-full bg-stone-100 text-stone-900 relative overflow-x-clip"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { overflow-x: clip; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }

        .grain::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 0.06 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
          opacity: 0.3; mix-blend-mode: multiply;
        }
        .grain-dark::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/><feColorMatrix values='0 0 0 0 0.6  0 0 0 0 0.4  0 0 0 0 0.2  0 0 0 0.08 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
          opacity: 0.4; mix-blend-mode: overlay;
        }
        ::selection { background: #f97316; color: #1c1917; }
        /* Custom hover-fill classes — bypass Tailwind purge for hover bg variants */
        .btn-fill-orange:hover { background-color: rgba(249, 115, 22, 0.08) !important; border-color: #f97316 !important; color: #c2410c !important; }
        .btn-fill-red:hover { background-color: rgba(239, 68, 68, 0.08) !important; border-color: #ef4444 !important; color: #dc2626 !important; }
        .btn-fill-stone:hover { background-color: rgba(28, 25, 23, 0.05) !important; border-color: #a8a29e !important; color: #292524 !important; }
        /* On touch-only devices, suppress sticky :hover after tap */
        @media (hover: none) {
          .btn-fill-orange:hover, .btn-fill-red:hover, .btn-fill-stone:hover {
            background-color: transparent !important;
            border-color: inherit !important;
            color: inherit !important;
          }
        }
        button:focus { outline: none; }
        button:focus-visible { outline: none; }


        .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal.in { opacity: 1; transform: translateY(0); }

        .spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lift { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .lift:hover { transform: translateY(-4px); }

        .glow-amber {
          box-shadow: 0 0 32px -8px rgba(249, 115, 22, 0.4), 0 0 64px -16px rgba(249, 115, 22, 0.25);
        }
        .glow-amber:hover {
          box-shadow: 0 0 48px -8px rgba(249, 115, 22, 0.55), 0 0 96px -16px rgba(249, 115, 22, 0.4);
        }

        .rule-with-label {
          display: flex; align-items: center; gap: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em;
          text-transform: uppercase; color: #78716c;
        }
        .rule-with-label::before, .rule-with-label::after {
          content: ''; flex: 1; height: 1px; background: #d6d3d1;
        }
        .rule-with-label.dark { color: #a8a29e; }
        .rule-with-label.dark::before, .rule-with-label.dark::after { background: #44403c; }

        .vert-label {
          writing-mode: vertical-rl; transform: rotate(180deg);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.4em;
          text-transform: uppercase;
        }

        .screenshot-frame {
          transform: rotate(-1.5deg);
          box-shadow:
            0 24px 48px -16px rgba(28, 25, 23, 0.3),
            0 48px 96px -32px rgba(249, 115, 22, 0.2),
            0 0 0 1px rgba(28, 25, 23, 0.06);
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .screenshot-frame:hover { transform: rotate(0deg) translateY(-8px); }
        .screenshot-frame-2 { transform: rotate(2deg); }
        .screenshot-frame-2:hover { transform: rotate(0deg) translateY(-8px); }

        .tape-label {
          font-family: 'JetBrains Mono', monospace;
          background: #fef3c7; color: #78350f;
          padding: 4px 8px; font-size: 9px;
          letter-spacing: 0.2em; text-transform: uppercase;
          transform: rotate(-2deg);
          box-shadow: 0 4px 8px -2px rgba(28, 25, 23, 0.15);
        }

        .photo-treated {
          filter: contrast(1.05) saturate(0.92) sepia(0.08);
          transition: filter 0.5s ease;
        }
        .photo-treated:hover { filter: contrast(1.1) saturate(1) sepia(0); }

        .pull-quote {
          font-family: 'Fraunces', serif; font-style: italic; font-weight: 300;
          font-size: clamp(24px, 3vw, 36px); line-height: 1.3;
          color: #44403c;
          border-left: 3px solid #f97316;
          padding-left: 24px;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .scroll-pulse { animation: scrollPulse 2s ease-in-out infinite; }

        @keyframes glowBreath {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .glow-breath { animation: glowBreath 4s ease-in-out infinite; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════
          NAV — floats over dark hero
          ═══════════════════════════════════════════════════════════ */}
      <nav className={`absolute top-0 left-0 right-0 z-30 px-6 md:px-12 lg:px-20 py-6 reveal ${mounted ? 'in' : ''}`}>
        {/* ─── MOBILE NAV (stacked) ─── */}
        <div className="md:hidden flex flex-col gap-4">
          {/* Row 1: logo + compact lang button */}
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <Disc3 className="w-7 h-7 text-orange-500 spin-slow" strokeWidth={1.5} />
              <div className="font-display text-xl tracking-tight text-stone-50" style={{ fontWeight: 800, fontStyle: 'italic' }}>
                Brahm<span className="text-orange-500">storm</span>
              </div>
            </a>
            <div className="relative">
              <button onClick={() => setLangMenuOpen(v => !v)}
                aria-label={LANGUAGES.find(l => l.id === lang)?.full}
                className="font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-2 rounded-lg border border-stone-700 text-stone-300 hover:border-orange-500 hover:text-orange-400 transition-all active:scale-95 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span>{LANGUAGES.find(l => l.id === lang)?.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 z-[70] bg-stone-900 border border-stone-700 min-w-[180px] shadow-2xl rounded-lg overflow-hidden">
                    {LANGUAGES.map(l => (
                      <button key={l.id} onClick={() => { setLang(l.id); setLangMenuOpen(false); }}
                        className={`w-full text-left px-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${l.id === lang ? 'bg-orange-500/15 text-orange-400' : 'text-stone-300 hover:bg-stone-800 hover:text-stone-50'}`}>
                        <span className="text-base">{l.flag}</span><span className="flex-1">{l.full}</span>
                        {l.id === lang && <Check className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Row 2: 100% Free outline + ABRIR solid */}
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-orange-500 border-[1.5px] border-orange-500 px-4 py-3 rounded-[10px] flex items-center gap-1.5"
              style={{ fontWeight: 700 }}>
              <Sparkles className="w-3 h-3" /> {tL.hero_badge_free}
            </span>
            <button onClick={openApp}
              className="font-mono text-[13px] uppercase tracking-[0.2em] text-stone-900 bg-orange-500 hover:bg-orange-400 px-5 py-3 rounded-[10px] flex items-center gap-2.5 active:scale-95 transition-all glow-amber"
              style={{ fontWeight: 700 }}>
              {tL.nav_launch} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ─── DESKTOP NAV (unchanged) ─── */}
        <div className="hidden md:flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <Disc3 className="w-7 h-7 text-orange-500 spin-slow" strokeWidth={1.5} />
            <div className="font-display text-xl tracking-tight text-stone-50" style={{ fontWeight: 800, fontStyle: 'italic' }}>
              Brahm<span className="text-orange-500">storm</span>
            </div>
          </a>
          <div className="flex items-center gap-6">
            <a href="#what" onClick={(e) => { e.preventDefault(); document.getElementById('what')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-50 transition-colors">{tL.nav_what}</a>
            <a href="#how" onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-50 transition-colors">{tL.nav_how}</a>
            <a href="#why" onClick={(e) => { e.preventDefault(); document.getElementById('why')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-50 transition-colors">{tL.nav_why}</a>
            <div className="relative">
              <button ref={langBtnRef} onClick={() => setLangMenuOpen(v => !v)}
                aria-label={LANGUAGES.find(l => l.id === lang)?.full}
                className="font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-2.5 rounded-lg border border-stone-700 text-stone-300 hover:border-orange-500 hover:text-orange-400 transition-all active:scale-95 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span>{LANGUAGES.find(l => l.id === lang)?.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 z-[70] bg-stone-900 border border-stone-700 min-w-[180px] shadow-2xl rounded-lg overflow-hidden">
                    {LANGUAGES.map(l => (
                      <button key={l.id} onClick={() => { setLang(l.id); setLangMenuOpen(false); }}
                        className={`w-full text-left px-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${l.id === lang ? 'bg-orange-500/15 text-orange-400' : 'text-stone-300 hover:bg-stone-800 hover:text-stone-50'}`}>
                        <span className="text-base">{l.flag}</span><span className="flex-1">{l.full}</span>
                        {l.id === lang && <Check className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={openApp}
              className="font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-stone-900 transition-all active:scale-95 flex items-center gap-2 glow-amber"
              style={{ fontWeight: 700 }}>
              {tL.nav_launch} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO — dark, dramatic, bold but balanced typography
          Spacing follows 8px grid: pt-32 (128) · mb-8/16/24 stack
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-stone-950 text-stone-50 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-40 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        {/* Atmospheric background photo */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url('${PHOTOS.studio}')`, filter: 'contrast(1.2) saturate(0.8)' }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(12,10,9,0.7) 0%, rgba(12,10,9,0.85) 50%, #0c0a09 100%)'
          }} />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none glow-breath">
          <div className="w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0.08) 30%, transparent 60%)',
              filter: 'blur(20px)'
            }} />
        </div>

        <div className="grain-dark absolute inset-0 pointer-events-none z-[1]" />

        {/* Massive parallax disc */}
        <div className="absolute -top-40 -right-40 z-0 pointer-events-none opacity-20"
          style={{ transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)` }}>
          <Disc3 className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] text-orange-500/30" strokeWidth={0.5} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto w-full">
          {/* Top: FREE badge + descriptor (mb-12 = 64px) */}
          <div className={`flex flex-wrap items-center gap-3 mb-6 md:mb-8 reveal ${mounted ? 'in' : ''}`}
            style={{ transitionDelay: '0.1s' }}>
            <span className="hidden md:inline-flex items-center gap-1.5 bg-orange-500 text-stone-900 px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-[0.25em]"
              style={{ fontWeight: 700 }}>
              <Sparkles className="w-3 h-3" /> {tL.hero_badge_free}
            </span>
            <span className="hidden md:block w-8 h-px bg-stone-700" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-stone-400">
              {tL.hero_descriptor}
            </span>
          </div>

          {/* Headline: 64-128px range, balanced */}
          <h1 className={`font-display leading-[0.92] tracking-[-0.02em] text-stone-50 mb-8 reveal ${mounted ? 'in' : ''}`}
            style={{
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 'clamp(40px, 7vw, 88px)',
              transitionDelay: '0.2s'
            }}>
            {tL.hero_h1_line1}
            <br />
            {tL.hero_h1_line2_pre}<span className="not-italic font-display text-orange-500" style={{ fontStyle: 'normal' }}>{tL.hero_h1_line2_accent}</span>
            <br />
            <span className="text-stone-400">{tL.hero_h1_line3}</span>
          </h1>

          {/* Sub-headline (mb-12 = 64px) */}
          <p className={`font-display text-xl md:text-2xl text-stone-300 leading-snug max-w-3xl mb-6 md:mb-8 reveal ${mounted ? 'in' : ''}`}
            style={{ fontWeight: 400, transitionDelay: '0.32s' }}>
            {tL.hero_sub_pre}<em className="text-stone-50">{tL.hero_sub_em}</em>{tL.hero_sub_post}
          </p>

          {/* CTAs (mb-12 = 64px) */}
          <div className={`flex items-center gap-4 flex-wrap mb-6 md:mb-8 reveal ${mounted ? 'in' : ''}`}
            style={{ transitionDelay: '0.44s' }}>
            <button onClick={openApp}
              className="bg-orange-500 hover:bg-orange-400 text-stone-900 font-mono text-sm uppercase tracking-[0.25em] px-8 py-4 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98] glow-amber"
              style={{ fontWeight: 700 }}>
              <Sparkles className="w-4 h-4" /> {tL.hero_cta_open} <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#what" onClick={(e) => { e.preventDefault(); document.getElementById('what')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="font-mono text-xs uppercase tracking-[0.25em] text-stone-300 hover:text-stone-50 transition-colors flex items-center gap-2 px-3 py-3">
              {tL.hero_cta_see} ↓
            </a>
          </div>

          {/* Stats (8px grid: gap-8/12, pt-8) */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl border-t border-stone-800 pt-6 reveal ${mounted ? 'in' : ''}`}
            style={{ transitionDelay: '0.56s' }}>
            <HeroStat number="5" label={tL.hero_stat_per_day} />
            <HeroStat number="0" label={tL.hero_stat_signup} />
            <HeroStat number="24" label={tL.hero_stat_langs} />
            <HeroStat number="∞" label={tL.hero_stat_creativity} subtle />
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 scroll-pulse">
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-stone-500">
            {tL.hero_scroll}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THE PROBLEM — dark with photo on side
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-stone-950 text-stone-100 py-12 md:py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="grain-dark absolute inset-0 pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/2] rounded-2xl overflow-hidden">
              <img src={PHOTOS.studio}
                alt="Analog studio"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover photo-treated" />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(28, 25, 23, 0.55), rgba(249, 115, 22, 0.35))',
                mixBlendMode: 'multiply'
              }} />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-display italic text-base text-stone-100" style={{ fontWeight: 500 }}>
                  {tL.problem_photo_caption}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rule-with-label dark mb-8">{tL.problem_label}</div>

            <h2 className="font-display leading-[1.05] text-stone-50 mb-8 max-w-2xl"
              style={{
                fontWeight: 700, fontStyle: 'italic',
                fontSize: 'clamp(28px, 3.8vw, 44px)'
              }}>
              {tL.problem_h_pre}
              <br />
              <span className="text-stone-400">{tL.problem_h_mid}</span>
              <br />
              <span className="text-orange-500">{tL.problem_h_accent}</span>
            </h2>

            <div className="space-y-8">
              <ProblemRow num="01" icon={<MessageSquareQuote className="w-4 h-4" />}
                title={tL.problem_p1_title}
                body={tL.problem_p1_body} />
              <ProblemRow num="02" icon={<FileText className="w-4 h-4" />}
                title={tL.problem_p2_title}
                body={tL.problem_p2_body} />
              <ProblemRow num="03" icon={<Zap className="w-4 h-4" />}
                title={tL.problem_p3_title}
                body={tL.problem_p3_body} />
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800">
              <p className="font-display italic leading-snug" style={{
                fontWeight: 500,
                fontSize: 'clamp(18px, 2vw, 26px)',
                color: '#d6d3d1'
              }}>
                {tL.problem_close_pre}
                <br />
                <span className="text-orange-400">{tL.problem_close_accent}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PULL QUOTE breather
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative max-w-[800px] mx-auto">
          <p className="pull-quote">
            {tL.pullquote_pre}
            <em className="text-orange-700"> {tL.pullquote_em}</em>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHAT IT IS — section anchor
          ═══════════════════════════════════════════════════════════ */}
      <section id="what" className="relative z-10 pt-4 pb-12 md:pb-16 px-6 md:px-12 lg:px-20">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto">
          <div className="rule-with-label mb-8">{tL.what_label}</div>

          <h2 className="font-display leading-[1.05] text-stone-900 mb-8 max-w-3xl"
            style={{
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 'clamp(28px, 3.8vw, 44px)'
            }}>
            {tL.what_h_pre}
            <br />
            <span className="text-stone-500">{tL.what_h_accent}</span>
          </h2>

          <div className="space-y-16">
            <FeatureRow num="A1" flip={false} tag={tL.featA1_tag}
              title={<>{tL.featA1_title_pre}<br/>{tL.featA1_title_mid}<em className="text-orange-600">{tL.featA1_title_em}</em>{tL.featA1_title_post}</>}
              body={tL.featA1_body}
              mockup={<MockFreeInspiration tL={tL} />} />

            <FeatureRow num="A2" flip={true} tag={tL.featA2_tag}
              title={<>{tL.featA2_title_pre}<em className="text-orange-600">{tL.featA2_title_em}</em>{tL.featA2_title_post}</>}
              body={tL.featA2_body}
              mockup={<MockAlbumMode tL={tL} />} />

            <FeatureRow num="A3" flip={false} tag={tL.featA3_tag}
              title={<>{tL.featA3_title_pre}<br/>{tL.featA3_title_mid}<em className="text-orange-600">{tL.featA3_title_em}</em>{tL.featA3_title_post}</>}
              body={tL.featA3_body}
              mockup={<MockReference tL={tL} />} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TWO PATHS — descriptive vs technical
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-stone-950 text-stone-100 py-12 md:py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="grain-dark absolute inset-0 pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto">
          <div className="rule-with-label dark mb-8">{tL.twopaths_label}</div>

          <h2 className="font-display leading-[1.05] text-stone-50 mb-6 max-w-3xl"
            style={{
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 'clamp(28px, 3.8vw, 44px)'
            }}>
            {tL.twopaths_h_pre}
            <br />
            <span className="text-stone-400">{tL.twopaths_h_accent}</span>
          </h2>

          <p className="font-display text-lg md:text-xl text-stone-400 max-w-2xl mb-12 leading-relaxed">
            {tL.twopaths_lead}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <PathCard
              icon={<Feather className="w-5 h-5" />}
              numLabel={tL.twopaths_path1_numlabel}
              title={tL.twopaths_path1_title}
              subtitle={tL.twopaths_path1_subtitle}
              body={tL.twopaths_path1_body}
              steps={[
                tL.twopaths_path1_step1,
                tL.twopaths_path1_step2,
                tL.twopaths_path1_step3,
              ]}
            />
            <PathCard
              icon={<Sliders className="w-5 h-5" />}
              numLabel={tL.twopaths_path2_numlabel}
              title={tL.twopaths_path2_title}
              subtitle={tL.twopaths_path2_subtitle}
              body={tL.twopaths_path2_body}
              steps={[
                tL.twopaths_path2_step1,
                tL.twopaths_path2_step2,
                tL.twopaths_path2_step3,
              ]}
              highlighted
            />
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800 max-w-2xl">
            <p className="font-display italic text-stone-300 text-lg md:text-xl leading-relaxed">
              {tL.twopaths_close_pre}
              <em className="text-orange-400"> {tL.twopaths_close_em}</em>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ATMOSPHERIC PHOTO BREAK
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden">
        <div className="relative h-[220px] md:h-[320px] overflow-hidden">
          <img src={PHOTOS.vinyl}
            alt="Vinyl record"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover photo-treated" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-100/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
            <div className="max-w-md">
              <div className="rule-with-label mb-4">{tL.interlude_label}</div>
              <p className="font-display italic text-stone-900 leading-tight"
                style={{ fontWeight: 500, fontSize: 'clamp(18px, 2.4vw, 26px)' }}>
                {tL.interlude_pre}<em className="text-orange-700">{tL.interlude_em}</em>{tL.interlude_post}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
          ═══════════════════════════════════════════════════════════ */}
      <section id="how" className="relative z-10 bg-stone-200/50 py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="rule-with-label mb-8">{tL.how_label}</div>

          <h2 className="font-display leading-[1.05] text-stone-900 mb-8 max-w-3xl"
            style={{
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 'clamp(28px, 3.8vw, 44px)'
            }}>
            {tL.how_h_pre}
            <br />
            {tL.how_h_to}<span className="text-orange-600">{tL.how_h_accent}</span>
            <br />
            <span className="text-stone-500">{tL.how_h_post}</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard num="01" title={tL.how_step1_title} body={tL.how_step1_body} />
            <StepCard num="02" title={tL.how_step2_title} body={tL.how_step2_body} />
            <StepCard num="03" title={tL.how_step3_title} body={tL.how_step3_body} />
          </div>

          <div className="mt-10 flex justify-center">
            <button onClick={openApp}
              className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono text-xs uppercase tracking-[0.25em] px-7 py-4 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98]"
              style={{ fontWeight: 600 }}>
              {tL.how_cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SAVE & REUSE — your library lives in the browser
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="rule-with-label mb-8">{tL.lib_label}</div>

            <h2 className="font-display leading-[1.05] text-stone-900 mb-8 max-w-2xl"
              style={{
                fontWeight: 700, fontStyle: 'italic',
                fontSize: 'clamp(28px, 3.8vw, 44px)'
              }}>
              {tL.lib_h_pre}
              <br />
              <span className="text-orange-600">{tL.lib_h_accent}</span>
            </h2>

            <p className="font-display text-lg md:text-xl text-stone-700 mb-8 max-w-xl leading-relaxed">
              {tL.lib_lead}
            </p>

            <div className="space-y-4">
              <LibraryItem icon={<Archive className="w-4 h-4" />}
                title={tL.lib_i1_title}
                body={tL.lib_i1_body} />
              <LibraryItem icon={<Settings2 className="w-4 h-4" />}
                title={tL.lib_i2_title}
                body={tL.lib_i2_body} />
              <LibraryItem icon={<Download className="w-4 h-4" />}
                title={tL.lib_i3_title}
                body={tL.lib_i3_body} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="screenshot-frame">
              <MockFavorites tL={tL} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY TRUST — soul of the product
          ═══════════════════════════════════════════════════════════ */}
      <section id="why" className="relative z-10 py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:col-start-8 lg:order-2 lg:mt-12">
            <div className="relative aspect-[3/2] rounded-2xl overflow-hidden lift">
              <img src={PHOTOS.headphones}
                alt="Headphones in warm light"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover photo-treated" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-display italic text-base text-stone-100" style={{ fontWeight: 500 }}>
                  {tL.why_photo_caption}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-1 lg:order-1">
            <div className="rule-with-label mb-8">{tL.why_label}</div>

            <h2 className="font-display leading-[1.02] text-stone-900 mb-6"
              style={{
                fontWeight: 800, fontStyle: 'italic',
                fontSize: 'clamp(36px, 5vw, 64px)'
              }}>
              {tL.why_h_pre}
              <br />
              <span className="text-stone-400">{tL.why_h_accent}</span>
            </h2>

            <div className="font-display text-xl md:text-2xl text-stone-700 leading-[1.5] space-y-6 max-w-2xl"
              style={{ fontWeight: 400 }}>
              <p>
                {tL.why_p1_pre}<em>{tL.why_p1_em}</em>{tL.why_p1_post}
              </p>
              <p>
                {tL.why_p2}
              </p>
              <p className="text-stone-900" style={{ fontWeight: 500 }}>
                <em>{tL.why_p3_em}</em>{tL.why_p3_post}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto mt-10 grid md:grid-cols-3 gap-6">
          <PrincipleCard icon={<Lock className="w-5 h-5" />}
            title={tL.prin_p1_title}
            body={tL.prin_p1_body} />
          <PrincipleCard icon={<Heart className="w-5 h-5" />}
            title={tL.prin_p2_title}
            body={tL.prin_p2_body} />
          <PrincipleCard icon={<Globe className="w-5 h-5" />}
            title={tL.prin_p3_title}
            body={tL.prin_p3_body} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ — anticipated questions
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-stone-200/50 py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[900px] mx-auto">
          <div className="rule-with-label mb-8">{tL.faq_label}</div>

          <h2 className="font-display leading-[1.05] text-stone-900 mb-12"
            style={{
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 'clamp(28px, 3.8vw, 44px)'
            }}>
            {tL.faq_h_pre}
            <br />
            <span className="text-stone-500">{tL.faq_h_accent}</span>
          </h2>

          <div className="space-y-6">
            <FAQItem q={tL.faq_q1} a={tL.faq_a1} />
            <FAQItem q={tL.faq_q2} a={tL.faq_a2} />
            <FAQItem q={tL.faq_q3} a={tL.faq_a3} />
            <FAQItem q={tL.faq_q4} a={tL.faq_a4} />
            <FAQItem q={tL.faq_q5} a={tL.faq_a5} />
            <FAQItem q={tL.faq_q6} a={tL.faq_a6} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-stone-950 text-stone-50 py-16 md:py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url('${PHOTOS.neon}')` }} />
          <div className="absolute inset-0 bg-stone-950/70" />
        </div>
        <div className="grain-dark absolute inset-0 pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none glow-breath">
          <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0.1) 30%, transparent 60%)',
              filter: 'blur(20px)'
            }} />
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto text-center">
          <Disc3 className="w-16 h-16 text-orange-500 spin-slow mx-auto mb-8" strokeWidth={1.2} />

          <h2 className="font-display leading-[1.02] mb-8"
            style={{
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 'clamp(36px, 5.5vw, 72px)'
            }}>
            {tL.cta_h_pre}
            <br />
            <span className="text-orange-500">{tL.cta_h_accent}</span>
          </h2>

          <p className="font-display text-lg md:text-xl text-stone-300 max-w-xl mx-auto mb-12 leading-relaxed">
            {tL.cta_lead_pre}
            <br />
            <em className="text-stone-400">{tL.cta_lead_em}</em>
          </p>

          <button onClick={openApp}
            className="bg-orange-500 hover:bg-orange-400 text-stone-900 font-mono text-sm uppercase tracking-[0.25em] px-10 py-5 rounded-xl inline-flex items-center gap-3 transition-all active:scale-[0.98] glow-amber"
            style={{ fontWeight: 700 }}>
            <Sparkles className="w-4 h-4" /> {tL.cta_btn} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 bg-stone-100 px-6 md:px-12 lg:px-20 py-12 border-t border-stone-300">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Disc3 className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            <div className="font-display italic text-base text-stone-900" style={{ fontWeight: 700 }}>
              Brahmstorm
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">· 2026</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="text-stone-500 hover:text-stone-900 transition-colors" title="Twitter"><AtSign className="w-4 h-4" /></a>
            <a href="#" className="text-stone-500 hover:text-stone-900 transition-colors" title="GitHub"><Code className="w-4 h-4" /></a>
            <a href="mailto:hello@brahmstorm.com" className="text-stone-500 hover:text-stone-900 transition-colors" title="Email"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-8 pt-8 border-t border-stone-200">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 leading-relaxed">
            {tL.footer_disclaimer1}
            <br />
            {tL.footer_disclaimer2}
          </p>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Subcomponents
// ═══════════════════════════════════════════════════════════════════

function HeroStat({ number, label, subtle }) {
  return (
    <div>
      <div className={`font-display leading-none mb-2 ${subtle ? 'text-stone-500' : 'text-orange-500'}`}
        style={{ fontWeight: 800, fontStyle: 'italic', fontSize: 'clamp(32px, 4vw, 44px)' }}>
        {number}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 leading-tight">
        {label}
      </div>
    </div>
  );
}

function MockBlock({ label, badges }) {
  return (
    <div className="border border-orange-500/30 rounded-md px-3 py-2 bg-stone-50 flex items-center gap-2 flex-wrap">
      <span className="font-display italic text-[11px] text-stone-700" style={{ fontWeight: 600 }}>{label}</span>
      <span className="font-mono text-[8px] bg-orange-500 text-stone-900 px-1 py-0.5 rounded-sm">{badges.length}</span>
      {badges.slice(0, 2).map((b, i) => (
        <span key={i} className="font-mono text-[9px] text-stone-500 truncate">· {b}</span>
      ))}
    </div>
  );
}

function ProblemRow({ num, icon, title, body }) {
  return (
    <div className="flex gap-5 items-start">
      <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500">{num}</span>
        <span className="text-orange-500">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-xl md:text-2xl text-stone-50 mb-2 leading-tight" style={{ fontWeight: 600, fontStyle: 'italic' }}>
          {title}
        </h3>
        <p className="font-display text-base text-stone-400 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function FeatureRow({ num, flip, tag, title, body, mockup }) {
  return (
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <div className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500">{num}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500">·</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-700">{tag}</span>
        </div>
        <h3 className="font-display leading-[1.08] text-stone-900 mb-6"
          style={{
            fontWeight: 700, fontStyle: 'italic',
            fontSize: 'clamp(24px, 3vw, 40px)'
          }}>
          {title}
        </h3>
        <p className="font-display text-lg md:text-xl text-stone-700 leading-relaxed max-w-lg" style={{ fontWeight: 400 }}>
          {body}
        </p>
      </div>
      <div className={`lg:col-span-6 relative ${flip ? 'lg:order-1' : ''}`}>
        <div className={`screenshot-frame ${flip ? 'screenshot-frame-2' : ''}`}>{mockup}</div>
      </div>
    </div>
  );
}

function MockFreeInspiration({ tL }) {
  return (
    <div className="bg-stone-100 rounded-2xl border border-stone-300 overflow-hidden">
      <div className="bg-gradient-to-br from-orange-500/15 via-orange-500/8 to-transparent p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-orange-500" />
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-700">{tL.mock_free_label}</div>
        </div>
        <p className="font-display italic text-sm text-stone-600 leading-relaxed">
          {tL.mock_free_hint}
        </p>
        <div className="bg-white border border-stone-300 rounded-lg p-3">
          <p className="font-display italic text-base text-stone-900 leading-relaxed">
            {tL.mock_free_example}
          </p>
        </div>
        <button className="w-full bg-orange-500 text-stone-900 font-mono text-[10px] uppercase tracking-[0.2em] py-3 rounded-xl flex items-center justify-center gap-2">
          <Wand2 className="w-3 h-3" /> {tL.mock_free_btn}
        </button>
      </div>
      <div className="px-5 py-4 space-y-2 border-t border-stone-200 bg-stone-50">
        <MockBlock label={tL.mock_block_genre} badges={['trip-hop', 'jazz fusion']} />
        <MockBlock label={tL.mock_block_mood} badges={[tL.mock_badge_melancholic, tL.mock_badge_tense]} />
        <MockBlock label={tL.mock_block_vocals} badges={[tL.mock_badge_reverb_whispers]} />
        <MockBlock label={tL.mock_block_production} badges={[tL.mock_badge_cathedral]} />
      </div>
    </div>
  );
}

function MockAlbumMode({ tL }) {
  const tracks = [
    { num: '01', title: tL.mock_album_t1_title, role: tL.mock_album_t1_role },
    { num: '02', title: tL.mock_album_t2_title, role: tL.mock_album_t2_role },
    { num: '03', title: tL.mock_album_t3_title, role: tL.mock_album_t3_role },
    { num: '04', title: tL.mock_album_t4_title, role: tL.mock_album_t4_role },
    { num: '05', title: tL.mock_album_t5_title, role: tL.mock_album_t5_role },
  ];
  return (
    <div className="bg-stone-100 rounded-2xl border border-stone-300 overflow-hidden">
      <div className="bg-stone-950 px-5 py-3 flex items-center gap-3">
        <Disc3 className="w-5 h-5 text-orange-500 spin-slow" strokeWidth={1.5} />
        <div className="font-display italic text-stone-50 text-base" style={{ fontWeight: 700 }}>
          {tL.mock_album_header}
        </div>
      </div>
      <div className="p-3 space-y-1.5 bg-stone-50">
        {tracks.map(t => (
          <div key={t.num} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-stone-300 bg-white">
            <span className="font-mono text-[9px] text-stone-50 bg-stone-900 px-1.5 py-0.5 rounded-sm tracking-wider">{t.num}</span>
            <div className="flex-1 min-w-0">
              <div className="font-display italic text-sm text-stone-900 truncate" style={{ fontWeight: 600 }}>{t.title}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500 truncate">{t.role}</div>
            </div>
            <Check className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MockReference({ tL }) {
  return (
    <div className="bg-stone-100 rounded-2xl border border-stone-300 overflow-hidden">
      <div className="border border-stone-400 bg-stone-50/60 p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Music2 className="w-4 h-4 text-stone-700" />
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-700">{tL.mock_ref_label}</div>
          <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-emerald-600/50 text-emerald-700 bg-emerald-50 rounded-sm">
            {tL.mock_ref_confidence}
          </span>
        </div>
        <p className="font-display italic text-sm text-stone-600 mb-3">
          {tL.mock_ref_hint}
        </p>
        <div className="bg-white border border-stone-300 rounded-lg p-3 mb-3">
          <p className="font-display text-base text-stone-900">"Black — Pearl Jam"</p>
        </div>
        <button className="w-full bg-stone-900 text-stone-50 font-mono text-[10px] uppercase tracking-[0.2em] py-3 rounded-xl flex items-center justify-center gap-2">
          <Music2 className="w-3 h-3" /> {tL.mock_ref_btn}
        </button>
        <p className="font-display italic text-[13px] text-stone-700 mt-3 pt-3 border-t border-stone-300 leading-relaxed">
          {tL.mock_ref_result}
        </p>
      </div>
    </div>
  );
}

function MockFavorites({ tL }) {
  const items = [
    { kind: 'prompt', label: tL.mock_fav_tag_prompt, title: tL.mock_fav_item1 },
    { kind: 'lyrics', label: tL.mock_fav_tag_lyrics, title: tL.mock_fav_item2 },
    { kind: 'prompt', label: tL.mock_fav_tag_prompt, title: tL.mock_fav_item3 },
  ];
  return (
    <div className="bg-stone-100 rounded-2xl border border-stone-300 overflow-hidden">
      <div className="bg-white border-b border-stone-300 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">{tL.mock_fav_archive}</div>
          <div className="font-display italic text-xl text-stone-900" style={{ fontWeight: 700 }}>{tL.mock_fav_title}</div>
        </div>
        <Archive className="w-5 h-5 text-stone-500" />
      </div>
      <div className="border-b border-stone-300 px-5 py-3 flex gap-1">
        <span className="flex-1 font-mono text-[10px] uppercase tracking-widest px-2.5 py-2 rounded-md border border-orange-500 bg-orange-500/15 text-orange-700 text-center">
          {tL.mock_fav_tab_fav}
        </span>
        <span className="flex-1 font-mono text-[10px] uppercase tracking-widest px-2.5 py-2 rounded-md border border-stone-300 text-stone-500 text-center">
          {tL.mock_fav_tab_hist}
        </span>
      </div>
      <div className="p-4 space-y-2 bg-stone-50">
        {items.map((f, i) => (
          <div key={i} className="bg-white border border-stone-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-mono text-[8px] uppercase tracking-widest px-1 py-0.5 border rounded-sm ${f.kind === 'lyrics' ? 'border-orange-500/40 text-orange-700' : 'border-stone-400 text-stone-600'}`}>
                {f.label}
              </span>
              <span className="font-display italic text-xs text-stone-700 truncate" style={{ fontWeight: 500 }}>{f.title}</span>
            </div>
            <div className="font-mono text-[8px] text-stone-400">{tL.mock_fav_date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ num, title, body }) {
  return (
    <div className="lift bg-white rounded-2xl p-8 border border-stone-300">
      <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange-500 mb-6">{num}</div>
      <h3 className="font-display text-2xl md:text-3xl text-stone-900 mb-4 leading-tight" style={{ fontWeight: 700, fontStyle: 'italic' }}>
        {title}
      </h3>
      <p className="font-display text-base text-stone-600 leading-relaxed">{body}</p>
    </div>
  );
}

function PathCard({ icon, numLabel, title, subtitle, body, steps, highlighted }) {
  return (
    <div className={`lift rounded-2xl p-8 border transition-colors ${highlighted ? 'bg-orange-500/10 border-orange-500/40' : 'bg-stone-900 border-stone-800'}`}>
      <div className="flex items-center gap-3 mb-6">
        <span className={highlighted ? 'text-orange-400' : 'text-orange-500'}>{icon}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">{numLabel}</span>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 mb-2">{subtitle}</div>
      <h3 className="font-display text-3xl md:text-4xl text-stone-50 mb-6 leading-tight" style={{ fontWeight: 700, fontStyle: 'italic' }}>
        {title}
      </h3>
      <p className="font-display text-base md:text-lg text-stone-300 mb-8 leading-relaxed">{body}</p>
      <ul className="space-y-3 border-t border-stone-700 pt-6">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="font-mono text-[10px] text-orange-500 mt-1.5 flex-shrink-0">{(i+1).toString().padStart(2, '0')}</span>
            <span className="font-display text-base text-stone-200 leading-snug">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LibraryItem({ icon, title, body }) {
  return (
    <div className="flex gap-4 items-start py-2">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-700">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display italic text-lg text-stone-900 mb-1" style={{ fontWeight: 700 }}>{title}</h4>
        <p className="font-display text-base text-stone-600 leading-snug">{body}</p>
      </div>
    </div>
  );
}

function PrincipleCard({ icon, title, body }) {
  return (
    <div className="bg-stone-50 border border-stone-300 rounded-xl p-6 lift">
      <div className="text-orange-600 mb-4">{icon}</div>
      <h4 className="font-display italic text-lg text-stone-900 mb-2" style={{ fontWeight: 700 }}>{title}</h4>
      <p className="font-mono text-[11px] uppercase tracking-wider text-stone-500 leading-relaxed">{body}</p>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${open ? 'border-orange-500/40 bg-stone-50' : 'border-stone-300 bg-white'}`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
        <span className="font-display italic text-lg md:text-xl text-stone-900 leading-tight" style={{ fontWeight: 600 }}>
          {q}
        </span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${open ? 'border-orange-500 bg-orange-500 text-stone-900 rotate-45' : 'border-stone-400 text-stone-500'}`}>
          <span className="text-base leading-none" style={{ marginTop: '-2px' }}>+</span>
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 -mt-1">
          <p className="font-display text-base md:text-lg text-stone-700 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP — Brahmstorm prompt forge
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// i18n
// Internal vocabulary keys are ALWAYS in English (Suno responds best
// to English terms). Each language has translation maps for display.
// ═══════════════════════════════════════════════════════════════════

const LANGUAGES = [
  { id: 'en', label: 'EN', full: 'English',    flag: '🇺🇸' },
  { id: 'pt', label: 'PT', full: 'Português',  flag: '🇧🇷' },
  { id: 'es', label: 'ES', full: 'Español',    flag: '🇪🇸' },
  { id: 'fr', label: 'FR', full: 'Français',   flag: '🇫🇷' },
];

// Full English names of each UI language — used inside AI system prompts so the
// AI knows which language to write natural-language fields in (regardless of
// what language the user typed their input in).
const LANG_NAMES = {
  en: 'English',
  pt: 'Brazilian Portuguese',
  es: 'Spanish',
  fr: 'French',
};

// Landing-page translations. Auto-detected from browser locale on first
// visit, then persisted to bs:lang (shared with the studio app).
// Strings are added incrementally — sections still in en are placeholders.
const LANDING_UI = {
  en: {
    nav_what: 'what', nav_how: 'how', nav_why: 'why', nav_launch: 'launch',
    hero_badge_free: '100% Free',
    hero_descriptor: 'prompt forge for Suno AI',
    hero_h1_line1: 'Write Suno prompts',
    hero_h1_line2_pre: 'that ',
    hero_h1_line2_accent: 'actually sound',
    hero_h1_line3: 'like the song you imagined.',
    hero_sub_pre: 'Brahmstorm turns your ',
    hero_sub_em: 'feelings, references and ideas',
    hero_sub_post: ' into production-ready prompts and lyrics for Suno AI — without the trial and error.',
    hero_cta_open: 'Open Brahmstorm',
    hero_cta_see: 'see how it works',
    hero_stat_per_day: 'generations / day',
    hero_stat_signup: 'signup required',
    hero_stat_langs: 'lyric languages',
    hero_stat_creativity: 'creativity',
    hero_scroll: 'scroll',
    problem_photo_caption: 'the gear was simpler. the rules, hidden.',
    problem_label: 'the problem',
    problem_h_pre: 'Suno is powerful.',
    problem_h_mid: 'But it has rules',
    problem_h_accent: 'nobody tells you.',
    problem_p1_title: 'Real artist names get filtered',
    problem_p1_body: "You can't just say 'like Pearl Jam'. Suno strips it. You learn this only after rerolling 12 times.",
    problem_p2_title: "Tags in your language don't work",
    problem_p2_body: "Write [Verso] and Suno sings the word 'verso' instead of treating it as a structure tag.",
    problem_p3_title: 'Prompts get truncated',
    problem_p3_body: 'The 1000-character limit is a graveyard of half-described songs.',
    problem_close_pre: 'Brahmstorm handles all of this.',
    problem_close_accent: "So you don't have to.",
    pullquote_pre: 'Music starts with a feeling.',
    pullquote_em: 'Brahmstorm gives it the form Suno understands.',
    what_label: 'what it is',
    what_h_pre: 'Three things Brahmstorm',
    what_h_accent: 'does better than anyone.',
    featA1_tag: 'The Translator',
    featA1_title_pre: 'Describe a feeling.',
    featA1_title_mid: 'AI fills the ',
    featA1_title_em: 'technical settings',
    featA1_title_post: '.',
    featA1_body: "You don't need to know that 'phonk' is a genre or that 'Rhodes piano in cathedral reverb' is a production style. Write 'noir film score in a rainy Rio'. Brahmstorm decodes it and pre-fills 9 categorized fields you can review and tweak.",
    featA2_tag: 'The Conductor',
    featA2_title_pre: 'Generate a ',
    featA2_title_em: 'cohesive 5-track EP',
    featA2_title_post: ' in one click.',
    featA2_body: 'Same sonic universe, varied tracks. Each song gets a role: opening, single, confession, peak, closing. Like a real album, written in 30 seconds. Nobody else does this.',
    featA3_tag: 'The Compass',
    featA3_title_pre: 'Paste a song you love.',
    featA3_title_mid: 'We extract ',
    featA3_title_em: 'the patterns',
    featA3_title_post: ', never the lyrics.',
    featA3_body: 'Type a song title and artist ("Pearl Jam — Black"), or paste full lyrics. Brahmstorm reads the DNA — mood, structure, perspective, meter — and translates it into a prompt. Original output, every time.',
    twopaths_label: 'two ways in',
    twopaths_h_pre: 'However you think',
    twopaths_h_accent: 'about music.',
    twopaths_lead: 'Some people start with a story. Others start with a kick drum and a tempo. Brahmstorm works with both — and lets you switch fluidly between them.',
    twopaths_path1_numlabel: 'path / 01',
    twopaths_path1_title: 'The Poet',
    twopaths_path1_subtitle: 'Description-first',
    twopaths_path1_body: "Write what you feel. 'A Sunday afternoon in 1973, dust in sunlight, a piano left open.' AI translates the prose into 9 technical fields you can review, refine, or rewrite.",
    twopaths_path1_step1: 'Write a feeling, scene, or memory',
    twopaths_path1_step2: 'AI fills genre, mood, instruments, vocals…',
    twopaths_path1_step3: 'Edit anything you want before generating',
    twopaths_path2_numlabel: 'path / 02',
    twopaths_path2_title: 'The Producer',
    twopaths_path2_subtitle: 'Technical-first',
    twopaths_path2_body: 'Hand-pick every parameter directly. Genre + mood + instruments + tempo + era + production + vocal type + lyrical theme. Full control, no guessing.',
    twopaths_path2_step1: 'Open the categorized blocks',
    twopaths_path2_step2: "Multi-select what fits, single-select what shouldn't conflict",
    twopaths_path2_step3: 'Generate 3 variations or a 5-track EP',
    twopaths_close_pre: 'You can mix both at any time. Start with a feeling, refine the technicals.',
    twopaths_close_em: 'Best of both worlds.',
    interlude_label: 'interlude',
    interlude_pre: 'Every song begins as ',
    interlude_em: 'an idea',
    interlude_post: '. We help yours get heard.',
    how_label: 'how it works',
    how_h_pre: 'From feeling',
    how_h_to: 'to ',
    how_h_accent: 'finished prompt',
    how_h_post: 'in 60 seconds.',
    how_step1_title: 'Describe',
    how_step1_body: "Write a feeling, paste a reference, or open the blocks directly. Whatever's easiest in the moment.",
    how_step2_title: 'Generate',
    how_step2_body: "AI returns 3 variations or a 5-track EP, all under Suno's character limits, ready to paste.",
    how_step3_title: 'Paste in Suno',
    how_step3_body: "One-click 'Open Suno' button copies and opens the right tab. Cmd+V and you're live.",
    how_cta: 'try the flow yourself',
    lib_label: 'your library',
    lib_h_pre: 'Every prompt and lyric',
    lib_h_accent: 'stays with you.',
    lib_lead: 'Save your favorites. Browse your last 50 generations in the history. Filter by prompt or lyrics. Reuse, remix, build on what worked before.',
    lib_i1_title: 'Favorites archive',
    lib_i1_body: 'One click to save. Organized by type. Always one tap away.',
    lib_i2_title: 'Auto-saved history',
    lib_i2_body: 'Last 50 generations kept automatically. Find that one you almost lost.',
    lib_i3_title: 'Yours, locally',
    lib_i3_body: 'Saved in your browser, not a database. Private by design. Export coming soon.',
    why_photo_caption: 'made for the late nights, not the boardroom.',
    why_label: 'why this exists',
    why_h_pre: "This isn't",
    why_h_accent: 'a SaaS.',
    why_p1_pre: 'Brahmstorm was built by ',
    why_p1_em: 'one person',
    why_p1_post: " who got tired of how the existing tools felt. Confusing UX. Login walls. 'Free tiers' that are actually traps.",
    why_p2: "The whole thing runs in your browser. Nothing's stored on a server. Nothing's tracked beyond anonymous page views. Just a tool that does what it says.",
    why_p3_em: '5 free generations every day.',
    why_p3_post: ' No credit card. No upsells. No dark patterns.',
    prin_p1_title: 'No signup',
    prin_p1_body: 'Open and use. Your favorites stay in your browser, not a database.',
    prin_p2_title: 'Made by a creator',
    prin_p2_body: 'Built for music people, by someone who actually uses Suno every week.',
    prin_p3_title: 'Multilingual',
    prin_p3_body: 'Interface in English, Português, Español and Français. Lyrics in even more.',
    faq_label: 'questions',
    faq_h_pre: "Things you're probably",
    faq_h_accent: 'about to ask.',
    faq_q1: 'Is it really free?',
    faq_a1: 'Yes. 5 generations per day, every day. No credit card, no trial period that ends. If usage grows beyond what one person can sustain, paid tiers may come — but the free tier stays.',
    faq_q2: 'Do I need to sign up?',
    faq_a2: "No. Open the app and start. Your favorites and history live in your browser, tied to your device. There's no account, no email collection, no password to forget.",
    faq_q3: 'What happens if I clear my browser?',
    faq_a3: "You lose your saved favorites and history. This is the trade-off of true 'no signup'. An export feature is on the roadmap so you can back up your library to a file.",
    faq_q4: 'How do you count the 5 daily generations?',
    faq_a4: "Anonymous IP-based rate limiting on the server. We don't track your identity, just the count of API calls from your network. Resets every day at midnight UTC.",
    faq_q5: 'Are my prompts and lyrics shared with anyone?',
    faq_a5: "No. They go to Anthropic's API for the AI to process, then come back to you. Nothing is stored on Brahmstorm servers. Nothing is used for training.",
    faq_q6: "Why isn't this a Suno feature?",
    faq_a6: 'Suno is focused on the AI music model. Brahmstorm is a thin layer that sits between you and Suno, helping you describe music in the way Suno understands. Different problems, different teams.',
    cta_h_pre: 'Your next song',
    cta_h_accent: 'starts here.',
    cta_lead_pre: 'Free. 5 generations every day. No signup.',
    cta_lead_em: 'Just open it.',
    cta_btn: 'Open Brahmstorm',
    footer_disclaimer1: 'Brahmstorm is an independent tool, not affiliated with Suno Inc.',
    footer_disclaimer2: 'Suno is a trademark of Suno Inc.',
    mock_free_label: 'free inspiration',
    mock_free_hint: 'describe a feeling, scene, memory — AI fills all fields below.',
    mock_free_example: '"noir film score in a rainy Rio de Janeiro"',
    mock_free_btn: 'fill fields with AI',
    mock_block_genre: 'Genre',
    mock_block_mood: 'Mood',
    mock_block_vocals: 'Vocals',
    mock_block_production: 'Production',
    mock_badge_melancholic: 'melancholic',
    mock_badge_tense: 'tense',
    mock_badge_reverb_whispers: 'reverb whispers',
    mock_badge_cathedral: 'cathedral reverb',
    mock_album_header: '5-track EP generated',
    mock_album_t1_title: 'Last Bus Home',
    mock_album_t1_role: 'opening',
    mock_album_t2_title: 'Rooms We Left Empty',
    mock_album_t2_role: 'introduction',
    mock_album_t3_title: 'The Confession',
    mock_album_t3_role: 'turning point',
    mock_album_t4_title: 'Static & Salt',
    mock_album_t4_role: 'descent',
    mock_album_t5_title: 'A Good Year for Quiet',
    mock_album_t5_role: 'closing',
    mock_ref_label: 'reference track',
    mock_ref_confidence: 'high confidence',
    mock_ref_hint: 'type a song name and artist, or paste full lyrics — AI uses it as a sound compass without copying.',
    mock_ref_btn: 'analyze reference',
    mock_ref_result: 'A 90s grunge ballad with raspy intimate vocals, slow brooding tempo, melancholic and nostalgic atmosphere.',
    mock_fav_archive: 'archive',
    mock_fav_title: 'favorites',
    mock_fav_tab_fav: 'favorites · 12',
    mock_fav_tab_hist: 'history · 47',
    mock_fav_tag_prompt: 'prompt',
    mock_fav_tag_lyrics: 'lyrics',
    mock_fav_item1: 'Late night drives',
    mock_fav_item2: 'The Confession',
    mock_fav_item3: 'Rio noir trip-hop',
    mock_fav_date: 'apr 24 · 19:42',
    meta_title: 'Brahmstorm · Prompt Forge for Suno AI',
  },
  pt: {
    nav_what: 'o quê', nav_how: 'como', nav_why: 'por quê', nav_launch: 'abrir',
    hero_badge_free: '100% Grátis',
    hero_descriptor: 'forja de prompts pra Suno AI',
    hero_h1_line1: 'Escreva prompts pro Suno',
    hero_h1_line2_pre: 'que ',
    hero_h1_line2_accent: 'soam de verdade',
    hero_h1_line3: 'como a música que você imaginou.',
    hero_sub_pre: 'Brahmstorm transforma seus ',
    hero_sub_em: 'sentimentos, referências e ideias',
    hero_sub_post: ' em prompts e letras prontos pra produção no Suno AI — sem tentativa e erro.',
    hero_cta_open: 'Abrir Brahmstorm',
    hero_cta_see: 'veja como funciona',
    hero_stat_per_day: 'gerações / dia',
    hero_stat_signup: 'cadastro necessário',
    hero_stat_langs: 'idiomas pra letras',
    hero_stat_creativity: 'criatividade',
    hero_scroll: 'role',
    problem_photo_caption: 'os equipamentos eram mais simples. as regras, escondidas.',
    problem_label: 'o problema',
    problem_h_pre: 'O Suno é poderoso.',
    problem_h_mid: 'Mas tem regras',
    problem_h_accent: 'que ninguém te conta.',
    problem_p1_title: 'Nomes reais de artistas são filtrados',
    problem_p1_body: 'Você não pode simplesmente dizer "como Pearl Jam". O Suno apaga. Você só descobre depois de gerar 12 vezes.',
    problem_p2_title: 'Tags no seu idioma não funcionam',
    problem_p2_body: 'Escreva [Verso] e o Suno canta a palavra "verso" em vez de tratá-la como tag de estrutura.',
    problem_p3_title: 'Prompts são truncados',
    problem_p3_body: 'O limite de 1000 caracteres é um cemitério de músicas descritas pela metade.',
    problem_close_pre: 'O Brahmstorm cuida de tudo isso.',
    problem_close_accent: 'Pra você não precisar.',
    pullquote_pre: 'A música começa com um sentimento.',
    pullquote_em: 'O Brahmstorm dá a ela a forma que o Suno entende.',
    what_label: 'o que é',
    what_h_pre: 'Três coisas que o Brahmstorm',
    what_h_accent: 'faz melhor que ninguém.',
    featA1_tag: 'O Tradutor',
    featA1_title_pre: 'Descreva um sentimento.',
    featA1_title_mid: 'A IA preenche as ',
    featA1_title_em: 'configurações técnicas',
    featA1_title_post: '.',
    featA1_body: 'Você não precisa saber que "phonk" é um gênero ou que "piano Rhodes com reverb de catedral" é estilo de produção. Escreva "trilha de filme noir num Rio chuvoso". O Brahmstorm decodifica e preenche 9 campos categorizados que você pode revisar e ajustar.',
    featA2_tag: 'O Maestro',
    featA2_title_pre: 'Gere um ',
    featA2_title_em: 'EP coeso de 5 faixas',
    featA2_title_post: ' num clique.',
    featA2_body: 'Mesmo universo sonoro, faixas variadas. Cada música ganha um papel: abertura, single, confissão, ápice, fechamento. Como um álbum de verdade, escrito em 30 segundos. Ninguém mais faz isso.',
    featA3_tag: 'A Bússola',
    featA3_title_pre: 'Cole uma música que você ama.',
    featA3_title_mid: 'Extraímos ',
    featA3_title_em: 'os padrões',
    featA3_title_post: ', nunca a letra.',
    featA3_body: 'Digite título e artista ("Pearl Jam — Black"), ou cole a letra completa. O Brahmstorm lê o DNA — clima, estrutura, perspectiva, métrica — e traduz em prompt. Resultado original, sempre.',
    twopaths_label: 'duas entradas',
    twopaths_h_pre: 'Não importa como você',
    twopaths_h_accent: 'pensa música.',
    twopaths_lead: 'Tem gente que começa por uma história. Outros, por um bumbo e um andamento. O Brahmstorm funciona com os dois — e deixa você alternar fluidamente entre eles.',
    twopaths_path1_numlabel: 'caminho / 01',
    twopaths_path1_title: 'O Poeta',
    twopaths_path1_subtitle: 'Descrição primeiro',
    twopaths_path1_body: 'Escreva o que sente. "Tarde de domingo em 1973, poeira na luz do sol, um piano aberto." A IA traduz a prosa em 9 campos técnicos que você pode revisar, refinar ou reescrever.',
    twopaths_path1_step1: 'Escreva um sentimento, cena ou memória',
    twopaths_path1_step2: 'A IA preenche gênero, clima, instrumentos, vozes…',
    twopaths_path1_step3: 'Edite o que quiser antes de gerar',
    twopaths_path2_numlabel: 'caminho / 02',
    twopaths_path2_title: 'O Produtor',
    twopaths_path2_subtitle: 'Técnico primeiro',
    twopaths_path2_body: 'Escolha cada parâmetro direto. Gênero + clima + instrumentos + andamento + era + produção + tipo de voz + tema da letra. Controle total, sem chute.',
    twopaths_path2_step1: 'Abra os blocos categorizados',
    twopaths_path2_step2: 'Multi-seleção pro que combina, seleção única pro que não pode conflitar',
    twopaths_path2_step3: 'Gere 3 variações ou um EP de 5 faixas',
    twopaths_close_pre: 'Você pode misturar os dois a qualquer hora. Comece por um sentimento, refine os técnicos.',
    twopaths_close_em: 'Melhor dos dois mundos.',
    interlude_label: 'interlúdio',
    interlude_pre: 'Toda música começa como ',
    interlude_em: 'uma ideia',
    interlude_post: '. A gente ajuda a sua a ser ouvida.',
    how_label: 'como funciona',
    how_h_pre: 'Do sentimento',
    how_h_to: 'ao ',
    how_h_accent: 'prompt pronto',
    how_h_post: 'em 60 segundos.',
    how_step1_title: 'Descreva',
    how_step1_body: 'Escreva um sentimento, cole uma referência ou abra os blocos direto. O que for mais fácil na hora.',
    how_step2_title: 'Gere',
    how_step2_body: 'A IA devolve 3 variações ou um EP de 5 faixas, tudo dentro dos limites de caractere do Suno, prontos pra colar.',
    how_step3_title: 'Cole no Suno',
    how_step3_body: 'Botão "Abrir Suno" copia e abre a aba certa num clique. Cmd+V e você tá no ar.',
    how_cta: 'experimente o fluxo',
    lib_label: 'sua biblioteca',
    lib_h_pre: 'Todo prompt e letra',
    lib_h_accent: 'fica com você.',
    lib_lead: 'Salve seus favoritos. Navegue pelas últimas 50 gerações no histórico. Filtre por prompt ou letra. Reaproveite, remixe, construa em cima do que funcionou.',
    lib_i1_title: 'Arquivo de favoritos',
    lib_i1_body: 'Um clique pra salvar. Organizado por tipo. Sempre a um toque.',
    lib_i2_title: 'Histórico automático',
    lib_i2_body: 'Últimas 50 gerações guardadas automaticamente. Ache aquela que você quase perdeu.',
    lib_i3_title: 'Seu, localmente',
    lib_i3_body: 'Salvo no seu navegador, não num banco de dados. Privado por design. Export em breve.',
    why_photo_caption: 'feito pras madrugadas, não pras reuniões.',
    why_label: 'por que existe',
    why_h_pre: 'Isso não é',
    why_h_accent: 'um SaaS.',
    why_p1_pre: 'O Brahmstorm foi feito por ',
    why_p1_em: 'uma pessoa só',
    why_p1_post: ' que cansou de como as ferramentas existentes pareciam. UX confusa. Paredes de login. "Planos grátis" que são armadilhas.',
    why_p2: 'A coisa toda roda no seu navegador. Nada armazenado em servidor. Nada rastreado além de page views anônimas. Só uma ferramenta que faz o que promete.',
    why_p3_em: '5 gerações grátis todo dia.',
    why_p3_post: ' Sem cartão de crédito. Sem upsell. Sem dark patterns.',
    prin_p1_title: 'Sem cadastro',
    prin_p1_body: 'Abra e use. Seus favoritos ficam no seu navegador, não num banco de dados.',
    prin_p2_title: 'Feito por um criador',
    prin_p2_body: 'Construído pra gente da música, por alguém que usa o Suno toda semana.',
    prin_p3_title: 'Multilíngue',
    prin_p3_body: 'Interface em inglês, português, espanhol e francês. Letras em ainda mais línguas.',
    faq_label: 'perguntas',
    faq_h_pre: 'Coisas que você provavelmente',
    faq_h_accent: 'tá prestes a perguntar.',
    faq_q1: 'É grátis mesmo?',
    faq_a1: 'Sim. 5 gerações por dia, todo dia. Sem cartão, sem período de teste que acaba. Se o uso crescer além do que uma pessoa só sustenta, planos pagos podem aparecer — mas o grátis fica.',
    faq_q2: 'Preciso me cadastrar?',
    faq_a2: 'Não. Abra o app e comece. Seus favoritos e histórico vivem no seu navegador, atrelados ao dispositivo. Não tem conta, nem coleta de email, nem senha pra esquecer.',
    faq_q3: 'E se eu limpar o navegador?',
    faq_a3: 'Você perde os favoritos e o histórico. É o preço do "sem cadastro" de verdade. Tá no roadmap um export pra você fazer backup da sua biblioteca num arquivo.',
    faq_q4: 'Como vocês contam as 5 gerações diárias?',
    faq_a4: 'Rate limiting anônimo por IP no servidor. Não rastreamos sua identidade, só o número de chamadas à API da sua rede. Reseta todo dia à meia-noite UTC.',
    faq_q5: 'Meus prompts e letras são compartilhados com alguém?',
    faq_a5: 'Não. Eles vão pra API da Anthropic pra IA processar, e voltam pra você. Nada fica nos servidores do Brahmstorm. Nada é usado pra treino.',
    faq_q6: 'Por que isso não é uma feature do Suno?',
    faq_a6: 'O Suno foca no modelo de IA musical. O Brahmstorm é uma camada fina entre você e o Suno, te ajudando a descrever música do jeito que o Suno entende. Problemas diferentes, times diferentes.',
    cta_h_pre: 'Sua próxima música',
    cta_h_accent: 'começa aqui.',
    cta_lead_pre: 'Grátis. 5 gerações todo dia. Sem cadastro.',
    cta_lead_em: 'É só abrir.',
    cta_btn: 'Abrir Brahmstorm',
    footer_disclaimer1: 'Brahmstorm é uma ferramenta independente, sem afiliação com a Suno Inc.',
    footer_disclaimer2: 'Suno é uma marca registrada da Suno Inc.',
    mock_free_label: 'inspiração livre',
    mock_free_hint: 'descreva um sentimento, cena, memória — a IA preenche todos os campos abaixo.',
    mock_free_example: '"trilha de filme noir num Rio de Janeiro chuvoso"',
    mock_free_btn: 'preencher campos com IA',
    mock_block_genre: 'Gênero',
    mock_block_mood: 'Clima',
    mock_block_vocals: 'Vozes',
    mock_block_production: 'Produção',
    mock_badge_melancholic: 'melancólico',
    mock_badge_tense: 'tenso',
    mock_badge_reverb_whispers: 'sussurros com reverb',
    mock_badge_cathedral: 'reverb de catedral',
    mock_album_header: 'EP de 5 faixas gerado',
    mock_album_t1_title: 'Último Ônibus de Volta',
    mock_album_t1_role: 'abertura',
    mock_album_t2_title: 'Quartos que Esvaziamos',
    mock_album_t2_role: 'introdução',
    mock_album_t3_title: 'A Confissão',
    mock_album_t3_role: 'ponto de virada',
    mock_album_t4_title: 'Estática & Sal',
    mock_album_t4_role: 'descida',
    mock_album_t5_title: 'Um Bom Ano pro Silêncio',
    mock_album_t5_role: 'fechamento',
    mock_ref_label: 'faixa de referência',
    mock_ref_confidence: 'alta confiança',
    mock_ref_hint: 'digite nome da música e artista, ou cole a letra completa — a IA usa como bússola sonora sem copiar.',
    mock_ref_btn: 'analisar referência',
    mock_ref_result: 'Uma balada grunge dos anos 90 com vocais íntimos e ásperos, andamento lento e melancólico, atmosfera nostálgica.',
    mock_fav_archive: 'arquivo',
    mock_fav_title: 'favoritos',
    mock_fav_tab_fav: 'favoritos · 12',
    mock_fav_tab_hist: 'histórico · 47',
    mock_fav_tag_prompt: 'prompt',
    mock_fav_tag_lyrics: 'letra',
    mock_fav_item1: 'Madrugadas dirigindo',
    mock_fav_item2: 'A Confissão',
    mock_fav_item3: 'Rio noir trip-hop',
    mock_fav_date: 'abr 24 · 19:42',
    meta_title: 'Brahmstorm · Forja de Prompts pra Suno AI',
  },
  es: {
    nav_what: 'qué', nav_how: 'cómo', nav_why: 'por qué', nav_launch: 'abrir',
    hero_badge_free: '100% Gratis',
    hero_descriptor: 'forja de prompts para Suno AI',
    hero_h1_line1: 'Escribe prompts para Suno',
    hero_h1_line2_pre: 'que ',
    hero_h1_line2_accent: 'suenan de verdad',
    hero_h1_line3: 'como la canción que imaginaste.',
    hero_sub_pre: 'Brahmstorm convierte tus ',
    hero_sub_em: 'sentimientos, referencias e ideas',
    hero_sub_post: ' en prompts y letras listos para producción en Suno AI — sin prueba y error.',
    hero_cta_open: 'Abrir Brahmstorm',
    hero_cta_see: 'mira cómo funciona',
    hero_stat_per_day: 'generaciones / día',
    hero_stat_signup: 'registros requeridos',
    hero_stat_langs: 'idiomas para letras',
    hero_stat_creativity: 'creatividad',
    hero_scroll: 'desliza',
    problem_photo_caption: 'el equipo era más simple. las reglas, ocultas.',
    problem_label: 'el problema',
    problem_h_pre: 'Suno es potente.',
    problem_h_mid: 'Pero tiene reglas',
    problem_h_accent: 'que nadie te cuenta.',
    problem_p1_title: 'Los nombres reales de artistas se filtran',
    problem_p1_body: 'No puedes decir simplemente "como Pearl Jam". Suno lo borra. Lo aprendes recién después de generar 12 veces.',
    problem_p2_title: 'Las etiquetas en tu idioma no funcionan',
    problem_p2_body: 'Escribe [Verso] y Suno canta la palabra "verso" en vez de tratarla como etiqueta de estructura.',
    problem_p3_title: 'Los prompts se truncan',
    problem_p3_body: 'El límite de 1000 caracteres es un cementerio de canciones descritas a medias.',
    problem_close_pre: 'Brahmstorm se encarga de todo esto.',
    problem_close_accent: 'Para que tú no tengas que hacerlo.',
    pullquote_pre: 'La música empieza con un sentimiento.',
    pullquote_em: 'Brahmstorm le da la forma que Suno entiende.',
    what_label: 'qué es',
    what_h_pre: 'Tres cosas que Brahmstorm',
    what_h_accent: 'hace mejor que nadie.',
    featA1_tag: 'El Traductor',
    featA1_title_pre: 'Describe un sentimiento.',
    featA1_title_mid: 'La IA llena los ',
    featA1_title_em: 'ajustes técnicos',
    featA1_title_post: '.',
    featA1_body: 'No necesitas saber que "phonk" es un género o que "piano Rhodes con reverb de catedral" es un estilo de producción. Escribe "banda sonora noir en un Río lluvioso". Brahmstorm lo decodifica y llena 9 campos categorizados que puedes revisar y ajustar.',
    featA2_tag: 'El Director',
    featA2_title_pre: 'Genera un ',
    featA2_title_em: 'EP cohesionado de 5 pistas',
    featA2_title_post: ' en un clic.',
    featA2_body: 'Mismo universo sonoro, pistas variadas. Cada canción tiene un rol: apertura, single, confesión, clímax, cierre. Como un álbum real, escrito en 30 segundos. Nadie más hace esto.',
    featA3_tag: 'La Brújula',
    featA3_title_pre: 'Pega una canción que ames.',
    featA3_title_mid: 'Extraemos ',
    featA3_title_em: 'los patrones',
    featA3_title_post: ', nunca la letra.',
    featA3_body: 'Escribe título y artista ("Pearl Jam — Black"), o pega la letra completa. Brahmstorm lee el ADN — ambiente, estructura, perspectiva, métrica — y lo traduce en un prompt. Resultado original, siempre.',
    twopaths_label: 'dos vías',
    twopaths_h_pre: 'Sea como sea que pienses',
    twopaths_h_accent: 'la música.',
    twopaths_lead: 'Algunos arrancan con una historia. Otros con un bombo y un tempo. Brahmstorm trabaja con ambos — y te deja alternar fluidamente entre ellos.',
    twopaths_path1_numlabel: 'vía / 01',
    twopaths_path1_title: 'El Poeta',
    twopaths_path1_subtitle: 'Descripción primero',
    twopaths_path1_body: 'Escribe lo que sientes. "Una tarde de domingo de 1973, polvo en la luz, un piano abierto." La IA traduce la prosa en 9 campos técnicos que puedes revisar, refinar o reescribir.',
    twopaths_path1_step1: 'Escribe un sentimiento, escena o recuerdo',
    twopaths_path1_step2: 'La IA llena género, ambiente, instrumentos, voces…',
    twopaths_path1_step3: 'Edita lo que quieras antes de generar',
    twopaths_path2_numlabel: 'vía / 02',
    twopaths_path2_title: 'El Productor',
    twopaths_path2_subtitle: 'Técnica primero',
    twopaths_path2_body: 'Elige cada parámetro a mano. Género + ambiente + instrumentos + tempo + era + producción + tipo de voz + tema lírico. Control total, sin adivinar.',
    twopaths_path2_step1: 'Abre los bloques categorizados',
    twopaths_path2_step2: 'Multi-selección para lo que encaja, selección única para lo que no debe entrar en conflicto',
    twopaths_path2_step3: 'Genera 3 variaciones o un EP de 5 pistas',
    twopaths_close_pre: 'Puedes mezclar ambos en cualquier momento. Empieza con un sentimiento, refina los técnicos.',
    twopaths_close_em: 'Lo mejor de ambos mundos.',
    interlude_label: 'interludio',
    interlude_pre: 'Toda canción empieza como ',
    interlude_em: 'una idea',
    interlude_post: '. Te ayudamos a que la tuya se escuche.',
    how_label: 'cómo funciona',
    how_h_pre: 'Del sentimiento',
    how_h_to: 'al ',
    how_h_accent: 'prompt listo',
    how_h_post: 'en 60 segundos.',
    how_step1_title: 'Describe',
    how_step1_body: 'Escribe un sentimiento, pega una referencia o abre los bloques directo. Lo que sea más fácil en el momento.',
    how_step2_title: 'Genera',
    how_step2_body: 'La IA devuelve 3 variaciones o un EP de 5 pistas, todo bajo los límites de caracteres de Suno, listo para pegar.',
    how_step3_title: 'Pega en Suno',
    how_step3_body: 'Botón "Abrir Suno" copia y abre la pestaña correcta en un clic. Cmd+V y estás en vivo.',
    how_cta: 'prueba el flujo',
    lib_label: 'tu biblioteca',
    lib_h_pre: 'Cada prompt y letra',
    lib_h_accent: 'se queda contigo.',
    lib_lead: 'Guarda tus favoritos. Navega tus últimas 50 generaciones en el historial. Filtra por prompt o letra. Reutiliza, remix, construye sobre lo que funcionó.',
    lib_i1_title: 'Archivo de favoritos',
    lib_i1_body: 'Un clic para guardar. Organizado por tipo. Siempre a un toque.',
    lib_i2_title: 'Historial automático',
    lib_i2_body: 'Últimas 50 generaciones guardadas automáticamente. Encuentra esa que casi perdiste.',
    lib_i3_title: 'Tuyo, en local',
    lib_i3_body: 'Guardado en tu navegador, no en una base de datos. Privado por diseño. Export pronto.',
    why_photo_caption: 'hecho para las madrugadas, no para las reuniones.',
    why_label: 'por qué existe',
    why_h_pre: 'Esto no es',
    why_h_accent: 'un SaaS.',
    why_p1_pre: 'Brahmstorm fue construido por ',
    why_p1_em: 'una sola persona',
    why_p1_post: ' que se cansó de cómo se sentían las herramientas existentes. UX confusa. Muros de login. "Planes gratis" que son trampas.',
    why_p2: 'Todo corre en tu navegador. Nada se almacena en servidor. Nada se rastrea más allá de page views anónimas. Solo una herramienta que hace lo que dice.',
    why_p3_em: '5 generaciones gratis al día.',
    why_p3_post: ' Sin tarjeta. Sin upsell. Sin dark patterns.',
    prin_p1_title: 'Sin registro',
    prin_p1_body: 'Abre y usa. Tus favoritos se quedan en tu navegador, no en una base de datos.',
    prin_p2_title: 'Hecho por un creador',
    prin_p2_body: 'Construido para gente de música, por alguien que usa Suno cada semana.',
    prin_p3_title: 'Multilingüe',
    prin_p3_body: 'Interfaz en inglés, portugués, español y francés. Letras en aún más idiomas.',
    faq_label: 'preguntas',
    faq_h_pre: 'Cosas que probablemente',
    faq_h_accent: 'estás por preguntar.',
    faq_q1: '¿Es realmente gratis?',
    faq_a1: 'Sí. 5 generaciones por día, todos los días. Sin tarjeta, sin periodo de prueba que termina. Si el uso crece más allá de lo que una persona puede sostener, pueden venir planes pagos — pero el gratis se queda.',
    faq_q2: '¿Necesito registrarme?',
    faq_a2: 'No. Abre la app y empieza. Tus favoritos e historial viven en tu navegador, atados a tu dispositivo. No hay cuenta, ni recolección de email, ni contraseña que olvidar.',
    faq_q3: '¿Qué pasa si limpio mi navegador?',
    faq_a3: 'Pierdes tus favoritos guardados y el historial. Es el precio del "sin registro" real. Está en el roadmap un export para que puedas respaldar tu biblioteca en un archivo.',
    faq_q4: '¿Cómo cuentan las 5 generaciones diarias?',
    faq_a4: 'Rate limiting anónimo por IP en el servidor. No rastreamos tu identidad, solo el número de llamadas a la API desde tu red. Se reinicia cada día a medianoche UTC.',
    faq_q5: '¿Mis prompts y letras se comparten con alguien?',
    faq_a5: 'No. Van a la API de Anthropic para que la IA procese, y vuelven a ti. Nada se guarda en los servidores de Brahmstorm. Nada se usa para entrenamiento.',
    faq_q6: '¿Por qué no es una función de Suno?',
    faq_a6: 'Suno se enfoca en el modelo de IA musical. Brahmstorm es una capa fina entre tú y Suno, ayudándote a describir música como Suno entiende. Problemas diferentes, equipos diferentes.',
    cta_h_pre: 'Tu próxima canción',
    cta_h_accent: 'empieza aquí.',
    cta_lead_pre: 'Gratis. 5 generaciones cada día. Sin registro.',
    cta_lead_em: 'Solo ábrelo.',
    cta_btn: 'Abrir Brahmstorm',
    footer_disclaimer1: 'Brahmstorm es una herramienta independiente, sin afiliación con Suno Inc.',
    footer_disclaimer2: 'Suno es una marca registrada de Suno Inc.',
    mock_free_label: 'inspiración libre',
    mock_free_hint: 'describe un sentimiento, escena, recuerdo — la IA llena todos los campos abajo.',
    mock_free_example: '"banda sonora noir en un Río de Janeiro lluvioso"',
    mock_free_btn: 'llenar campos con IA',
    mock_block_genre: 'Género',
    mock_block_mood: 'Ambiente',
    mock_block_vocals: 'Voces',
    mock_block_production: 'Producción',
    mock_badge_melancholic: 'melancólico',
    mock_badge_tense: 'tenso',
    mock_badge_reverb_whispers: 'susurros con reverb',
    mock_badge_cathedral: 'reverb de catedral',
    mock_album_header: 'EP de 5 pistas generado',
    mock_album_t1_title: 'Último Bus a Casa',
    mock_album_t1_role: 'apertura',
    mock_album_t2_title: 'Cuartos que Dejamos Vacíos',
    mock_album_t2_role: 'introducción',
    mock_album_t3_title: 'La Confesión',
    mock_album_t3_role: 'punto de inflexión',
    mock_album_t4_title: 'Estática y Sal',
    mock_album_t4_role: 'descenso',
    mock_album_t5_title: 'Un Buen Año para el Silencio',
    mock_album_t5_role: 'cierre',
    mock_ref_label: 'pista de referencia',
    mock_ref_confidence: 'alta confianza',
    mock_ref_hint: 'escribe nombre de la canción y artista, o pega la letra completa — la IA lo usa como brújula sonora sin copiar.',
    mock_ref_btn: 'analizar referencia',
    mock_ref_result: 'Una balada grunge de los 90 con voces íntimas y ásperas, tempo lento y melancólico, atmósfera nostálgica.',
    mock_fav_archive: 'archivo',
    mock_fav_title: 'favoritos',
    mock_fav_tab_fav: 'favoritos · 12',
    mock_fav_tab_hist: 'historial · 47',
    mock_fav_tag_prompt: 'prompt',
    mock_fav_tag_lyrics: 'letra',
    mock_fav_item1: 'Manejos de madrugada',
    mock_fav_item2: 'La Confesión',
    mock_fav_item3: 'Río noir trip-hop',
    mock_fav_date: 'abr 24 · 19:42',
    meta_title: 'Brahmstorm · Forja de Prompts para Suno AI',
  },
  fr: {
    nav_what: 'quoi', nav_how: 'comment', nav_why: 'pourquoi', nav_launch: 'ouvrir',
    hero_badge_free: '100% Gratuit',
    hero_descriptor: 'forge de prompts pour Suno AI',
    hero_h1_line1: 'Écris des prompts Suno',
    hero_h1_line2_pre: 'qui ',
    hero_h1_line2_accent: 'sonnent vraiment',
    hero_h1_line3: 'comme la chanson imaginée.',
    hero_sub_pre: 'Brahmstorm transforme tes ',
    hero_sub_em: 'émotions, références et idées',
    hero_sub_post: ' en prompts et paroles prêts pour la production sur Suno AI — sans essai-erreur.',
    hero_cta_open: 'Ouvrir Brahmstorm',
    hero_cta_see: 'voir comment ça marche',
    hero_stat_per_day: 'générations / jour',
    hero_stat_signup: 'inscription requise',
    hero_stat_langs: 'langues pour paroles',
    hero_stat_creativity: 'créativité',
    hero_scroll: 'défile',
    problem_photo_caption: 'le matériel était plus simple. les règles, cachées.',
    problem_label: 'le problème',
    problem_h_pre: 'Suno est puissant.',
    problem_h_mid: 'Mais il a des règles',
    problem_h_accent: 'que personne ne te dit.',
    problem_p1_title: "Les vrais noms d'artistes sont filtrés",
    problem_p1_body: 'Tu ne peux pas dire simplement "comme Pearl Jam". Suno le supprime. Tu l\'apprends après avoir relancé 12 fois.',
    problem_p2_title: 'Les tags dans ta langue ne marchent pas',
    problem_p2_body: 'Écris [Verso] et Suno chante le mot "verso" au lieu de le traiter comme une balise de structure.',
    problem_p3_title: 'Les prompts sont coupés',
    problem_p3_body: 'La limite de 1000 caractères est un cimetière de chansons décrites à moitié.',
    problem_close_pre: 'Brahmstorm gère tout ça.',
    problem_close_accent: "Pour que tu n'aies pas à le faire.",
    pullquote_pre: 'La musique commence par une émotion.',
    pullquote_em: 'Brahmstorm lui donne la forme que Suno comprend.',
    what_label: "c'est quoi",
    what_h_pre: 'Trois choses que Brahmstorm',
    what_h_accent: 'fait mieux que personne.',
    featA1_tag: 'Le Traducteur',
    featA1_title_pre: 'Décris une émotion.',
    featA1_title_mid: "L'IA remplit les ",
    featA1_title_em: 'réglages techniques',
    featA1_title_post: '.',
    featA1_body: "Tu n'as pas besoin de savoir que « phonk » est un genre ou que « piano Rhodes avec reverb cathédrale » est un style de production. Écris « bande-son noir dans un Rio pluvieux ». Brahmstorm décode et remplit 9 champs catégorisés que tu peux réviser et ajuster.",
    featA2_tag: 'Le Maestro',
    featA2_title_pre: 'Génère un ',
    featA2_title_em: 'EP cohérent de 5 morceaux',
    featA2_title_post: ' en un clic.',
    featA2_body: "Même univers sonore, morceaux variés. Chaque chanson a un rôle : ouverture, single, confession, sommet, clôture. Comme un vrai album, écrit en 30 secondes. Personne d'autre ne fait ça.",
    featA3_tag: 'La Boussole',
    featA3_title_pre: 'Colle une chanson que tu adores.',
    featA3_title_mid: 'On extrait ',
    featA3_title_em: 'les patterns',
    featA3_title_post: ', jamais les paroles.',
    featA3_body: "Tape titre et artiste (« Pearl Jam — Black »), ou colle les paroles complètes. Brahmstorm lit l'ADN — ambiance, structure, perspective, métrique — et le traduit en prompt. Résultat original, à chaque fois.",
    twopaths_label: 'deux entrées',
    twopaths_h_pre: 'Peu importe comment tu',
    twopaths_h_accent: 'penses la musique.',
    twopaths_lead: "Certains partent d'une histoire. D'autres d'un kick et d'un tempo. Brahmstorm gère les deux — et te laisse passer fluidement de l'un à l'autre.",
    twopaths_path1_numlabel: 'voie / 01',
    twopaths_path1_title: 'Le Poète',
    twopaths_path1_subtitle: "Description d'abord",
    twopaths_path1_body: "Écris ce que tu ressens. « Un dimanche après-midi de 1973, poussière dans la lumière, un piano ouvert. » L'IA traduit la prose en 9 champs techniques que tu peux relire, affiner ou réécrire.",
    twopaths_path1_step1: 'Écris une émotion, une scène ou un souvenir',
    twopaths_path1_step2: "L'IA remplit genre, ambiance, instruments, voix…",
    twopaths_path1_step3: 'Édite ce que tu veux avant de générer',
    twopaths_path2_numlabel: 'voie / 02',
    twopaths_path2_title: 'Le Producteur',
    twopaths_path2_subtitle: "Technique d'abord",
    twopaths_path2_body: 'Choisis chaque paramètre à la main. Genre + ambiance + instruments + tempo + époque + production + type de voix + thème des paroles. Contrôle total, sans deviner.',
    twopaths_path2_step1: 'Ouvre les blocs catégorisés',
    twopaths_path2_step2: 'Multi-sélection pour ce qui colle, sélection unique pour ce qui ne doit pas entrer en conflit',
    twopaths_path2_step3: 'Génère 3 variations ou un EP de 5 morceaux',
    twopaths_close_pre: "Tu peux mélanger les deux à tout moment. Pars d'une émotion, affine les techniques.",
    twopaths_close_em: 'Le meilleur des deux mondes.',
    interlude_label: 'interlude',
    interlude_pre: 'Chaque chanson commence comme ',
    interlude_em: 'une idée',
    interlude_post: '. On aide la tienne à se faire entendre.',
    how_label: 'comment ça marche',
    how_h_pre: "De l'émotion",
    how_h_to: 'au ',
    how_h_accent: 'prompt fini',
    how_h_post: 'en 60 secondes.',
    how_step1_title: 'Décris',
    how_step1_body: 'Écris une émotion, colle une référence ou ouvre les blocs directement. Ce qui est le plus simple sur le moment.',
    how_step2_title: 'Génère',
    how_step2_body: "L'IA renvoie 3 variations ou un EP de 5 morceaux, tout sous les limites de caractères de Suno, prêt à coller.",
    how_step3_title: 'Colle dans Suno',
    how_step3_body: 'Le bouton « Ouvrir Suno » copie et ouvre le bon onglet en un clic. Cmd+V et tu es en ligne.',
    how_cta: 'essaie le flux',
    lib_label: 'ta bibliothèque',
    lib_h_pre: 'Chaque prompt et parole',
    lib_h_accent: 'reste avec toi.',
    lib_lead: "Sauvegarde tes favoris. Parcours tes 50 dernières générations dans l'historique. Filtre par prompt ou paroles. Réutilise, remixe, construis sur ce qui a marché.",
    lib_i1_title: 'Archive des favoris',
    lib_i1_body: 'Un clic pour sauvegarder. Organisé par type. Toujours à portée de doigt.',
    lib_i2_title: 'Historique automatique',
    lib_i2_body: '50 dernières générations gardées automatiquement. Retrouve celle que tu as failli perdre.',
    lib_i3_title: 'Le tien, en local',
    lib_i3_body: 'Sauvegardé dans ton navigateur, pas dans une base de données. Privé par design. Export bientôt.',
    why_photo_caption: 'fait pour les nuits blanches, pas pour les salles de réunion.',
    why_label: 'pourquoi ça existe',
    why_h_pre: "Ce n'est pas",
    why_h_accent: 'un SaaS.',
    why_p1_pre: 'Brahmstorm a été construit par ',
    why_p1_em: 'une seule personne',
    why_p1_post: ' qui en avait marre de ce que les outils existants donnaient. UX confuse. Murs de login. « Plans gratuits » qui sont des pièges.',
    why_p2: "Tout tourne dans ton navigateur. Rien n'est stocké sur un serveur. Rien n'est traqué au-delà des pages vues anonymes. Juste un outil qui fait ce qu'il dit.",
    why_p3_em: '5 générations gratuites par jour.',
    why_p3_post: " Pas de carte de crédit. Pas d'upsell. Pas de dark patterns.",
    prin_p1_title: 'Sans inscription',
    prin_p1_body: 'Ouvre et utilise. Tes favoris restent dans ton navigateur, pas dans une base de données.',
    prin_p2_title: 'Fait par un créateur',
    prin_p2_body: "Construit pour les gens de musique, par quelqu'un qui utilise Suno chaque semaine.",
    prin_p3_title: 'Multilingue',
    prin_p3_body: 'Interface en anglais, portugais, espagnol et français. Paroles dans encore plus de langues.',
    faq_label: 'questions',
    faq_h_pre: 'Les choses que tu vas',
    faq_h_accent: 'sûrement demander.',
    faq_q1: "C'est vraiment gratuit ?",
    faq_a1: "Oui. 5 générations par jour, tous les jours. Pas de carte, pas de période d'essai qui se termine. Si l'usage dépasse ce qu'une personne peut soutenir, des plans payants pourraient arriver — mais le gratuit reste.",
    faq_q2: "Je dois m'inscrire ?",
    faq_a2: "Non. Ouvre l'app et commence. Tes favoris et historique vivent dans ton navigateur, liés à ton appareil. Pas de compte, pas de collecte d'email, pas de mot de passe à oublier.",
    faq_q3: 'Que se passe-t-il si je vide mon navigateur ?',
    faq_a3: "Tu perds tes favoris et historique. C'est le prix du « sans inscription » réel. Un export est dans la roadmap pour que tu puisses sauvegarder ta bibliothèque dans un fichier.",
    faq_q4: 'Comment vous comptez les 5 générations quotidiennes ?',
    faq_a4: "Rate limiting anonyme par IP côté serveur. On ne traque pas ton identité, juste le nombre d'appels à l'API depuis ton réseau. Reset chaque jour à minuit UTC.",
    faq_q5: 'Mes prompts et paroles sont partagés avec quelqu\'un ?',
    faq_a5: "Non. Ils vont vers l'API d'Anthropic pour que l'IA les traite, puis reviennent à toi. Rien n'est stocké sur les serveurs Brahmstorm. Rien n'est utilisé pour l'entraînement.",
    faq_q6: "Pourquoi ce n'est pas une fonctionnalité Suno ?",
    faq_a6: "Suno est focalisé sur le modèle d'IA musical. Brahmstorm est une couche fine entre toi et Suno, t'aidant à décrire la musique comme Suno la comprend. Problèmes différents, équipes différentes.",
    cta_h_pre: 'Ta prochaine chanson',
    cta_h_accent: 'commence ici.',
    cta_lead_pre: 'Gratuit. 5 générations chaque jour. Sans inscription.',
    cta_lead_em: "Tu n'as qu'à l'ouvrir.",
    cta_btn: 'Ouvrir Brahmstorm',
    footer_disclaimer1: 'Brahmstorm est un outil indépendant, sans affiliation avec Suno Inc.',
    footer_disclaimer2: 'Suno est une marque déposée de Suno Inc.',
    mock_free_label: 'inspiration libre',
    mock_free_hint: "décris une émotion, scène, souvenir — l'IA remplit tous les champs en bas.",
    mock_free_example: '« bande-son noir dans un Rio de Janeiro pluvieux »',
    mock_free_btn: "remplir les champs avec l'IA",
    mock_block_genre: 'Genre',
    mock_block_mood: 'Ambiance',
    mock_block_vocals: 'Voix',
    mock_block_production: 'Production',
    mock_badge_melancholic: 'mélancolique',
    mock_badge_tense: 'tendu',
    mock_badge_reverb_whispers: 'chuchotements avec reverb',
    mock_badge_cathedral: 'reverb cathédrale',
    mock_album_header: 'EP de 5 morceaux généré',
    mock_album_t1_title: 'Dernier Bus pour la Maison',
    mock_album_t1_role: 'ouverture',
    mock_album_t2_title: "Pièces Qu'on a Laissées Vides",
    mock_album_t2_role: 'introduction',
    mock_album_t3_title: 'La Confession',
    mock_album_t3_role: 'point de bascule',
    mock_album_t4_title: 'Statique & Sel',
    mock_album_t4_role: 'descente',
    mock_album_t5_title: 'Une Bonne Année pour le Silence',
    mock_album_t5_role: 'clôture',
    mock_ref_label: 'morceau de référence',
    mock_ref_confidence: 'haute confiance',
    mock_ref_hint: "tape le nom de la chanson et l'artiste, ou colle les paroles complètes — l'IA s'en sert comme boussole sonore sans copier.",
    mock_ref_btn: 'analyser la référence',
    mock_ref_result: 'Une ballade grunge des années 90 avec une voix rauque et intime, tempo lent et brumeux, atmosphère mélancolique et nostalgique.',
    mock_fav_archive: 'archive',
    mock_fav_title: 'favoris',
    mock_fav_tab_fav: 'favoris · 12',
    mock_fav_tab_hist: 'historique · 47',
    mock_fav_tag_prompt: 'prompt',
    mock_fav_tag_lyrics: 'paroles',
    mock_fav_item1: 'Conduites nocturnes',
    mock_fav_item2: 'La Confession',
    mock_fav_item3: 'Rio noir trip-hop',
    mock_fav_date: 'avr 24 · 19:42',
    meta_title: 'Brahmstorm · Forge de Prompts pour Suno AI',
  },
};

function detectLang() {
  try {
    const saved = localStorage.getItem('bs:lang');
    if (saved && LANGUAGES.find(l => l.id === saved)) return saved;
  } catch (e) {}
  if (typeof navigator !== 'undefined' && navigator.language) {
    const pref = navigator.language.toLowerCase().split('-')[0];
    if (LANGUAGES.find(l => l.id === pref)) return pref;
  }
  return 'en';
}

const UI = {
  en: {
    subtitle: 'Prompt Forge · Studio', tips: 'tips', favorites: 'favorites', clear: 'clear',
    tab_prompt: 'Prompt', tab_prompt_sub: 'musical description',
    tab_letra: 'Lyrics', tab_letra_sub: 'lyrics for Suno', back_home: 'Back to home',
    customize: 'customize', customize_sub: 'more options', primary_only: 'showing essentials', show_all: 'show all options', hide_advanced: 'hide advanced',
    sheet_done: 'done',
    limit_hint: 'Suno works best with focus. Deselect to swap.',
    presets_title: 'quick starts',
    presets_sub: 'tap a vibe to fill the blocks',
    presets_browse_all: 'browse all',
    presets_modal_title: 'all quick starts',
    shortcuts_title: 'keyboard shortcuts',
    shortcuts_close: 'press esc or ? to close',
    shortcuts_btn: 'shortcuts',
    shortcut_gen_prompt: 'Generate prompt', shortcut_gen_lyrics: 'Generate lyrics',
    shortcut_gen_ep: 'Generate 5-track EP', shortcut_gen_ep_lyrics: 'Generate 5-track EP lyrics',
    shortcut_switch_tab: 'Switch tab (Prompt ↔ Lyrics)',
    shortcut_focus_brief: 'Focus inspiration brief',
    shortcut_toggle_help: 'Toggle this help',
    shortcut_close: 'Close any open modal or sheet',
    live_preview: 'live preview',
    live_preview_empty: 'select blocks to see your prompt build…',
    live_preview_over: 'over Suno character limit',
    inspiration_title: 'be a poet',
    be_producer_title: 'be a producer',
    be_producer_sub: 'fine-tune the technical side',
    tab_producer: 'producer',
    tab_advanced: 'advanced',
    advanced_intro_title: 'vintage gear · pro mode',
    advanced_intro_sub: 'Hand-picked equipment Suno consistently reproduces. Combine with the Producer tab for finer texture.',
    lbl_drum_machines: 'Drum machines',
    lbl_synths: 'Vintage synths & keys',
    lbl_mics: 'Microphones · recording',
    inspiration_prompt_sub: 'describe a feeling, scene, memory — AI fills all fields below.',
    inspiration_letra_sub: 'tell a story, a feeling, an image — AI fills mood, structure, imagery and the hook.',
    inspiration_prompt_ph: 'ex: driving at dawn crying in secret; or: noir film score in a rainy Rio',
    inspiration_letra_ph: 'ex: reuniting with an old love at an airport; or: the last summer before moving',
    fill_with_ai: 'fill fields with AI', interpreting: 'interpreting…', clear_inspiration: 'clear inspiration',
    block_open: 'open', block_clear: 'clear',
    lbl_genre: 'Genre', lbl_mood: 'Mood · atmosphere', lbl_instruments: 'Instruments', lbl_vocals: 'Vocals',
    lbl_era: 'Era / aesthetic', lbl_production: 'Production / mix', lbl_tempo: 'Tempo / BPM',
    lbl_duration: 'Song duration', lbl_language: 'Lyrics language', lbl_theme: 'Lyrical theme', lbl_negative: 'Avoid (negative prompts)',
    lbl_theme_letra: 'Lyrics subject', lbl_mood_letra: 'Emotional tone', lbl_genre_letra: 'Musical genre',
    lbl_size: 'Lyrics size', lbl_verses: 'Verses & choruses', lbl_meter: 'Verse meter',
    lbl_perspective: 'Narrative perspective', lbl_structure: 'Song structure', lbl_rhyme: 'Rhyme scheme',
    lbl_elements: 'Concrete imagery', lbl_hook: 'Key hook',
    ph_theme: 'ex: the first time I saw the ocean, a farewell at the port…',
    ph_negative: 'ex: heavy metal, autotune, drum machine, screaming vocals…',
    ph_theme_letra: 'ex: the last summer at the beach house, running into someone years later…',
    ph_elements: 'ex: January rain, cigarette on the balcony, crumpled letter, old fan buzzing…',
    ph_hook: 'leave blank for AI to create one, or write a key phrase for the chorus',
    out_prompt: 'Output · Prompt', out_letra: 'Output · Lyrics', out_live: 'live', out_side_a: 'prompt · side A',
    out_empty_prompt: 'use the free brief above or open the blocks to start',
    out_empty_letra: 'configure the blocks and click generate. lyrics will use [Verse] [Chorus] tags in English (what Suno recognizes).',
    out_over_limit: (l) => `exceeds Suno's ${l}-character limit. reduce selections or condense.`,
    out_over_limit_letra: (l) => `exceeds Suno's ${l}-character lyrics limit. regenerate with smaller size.`,
    out_copy: 'copy', out_copy_letra: 'copy lyrics', out_copied: 'copied',
    out_save: 'save', out_saved: 'saved',
    out_generate_prompt: 'generate 3 AI variations', out_generate_letra: 'generate lyrics with AI',
    out_forging: 'forging…', out_writing: 'writing lyrics…', out_composing: 'composing verses…',
    phases_prompt: ["reading your context…", "drafting angles…", "polishing the strongest…"], phases_album: ["mapping the sonic universe…", "weaving track 1, 2, 3…", "calibrating coherence…"], phases_letra: ["interpreting the theme…", "finding the voice…", "shaping verses…", "polishing the chorus…"], phases_letras_album: ["building the narrative arc…", "writing track 1…", "writing track 2…", "writing track 3…", "writing track 4…", "writing track 5…", "weaving echoes between tracks…"], phases_ref: ["recognizing the reference…", "extracting patterns…", "mapping to vocabulary…"],
    out_3_variants: '3 variations generated', out_album_generated: '5-track EP generated', out_lines: 'lines',
    out_generate_album: 'generate 5-track EP', out_album_sub: 'cohesive album · same universe, varied tracks',
    out_generate_album_letras: 'generate 5-track EP lyrics', out_album_letras_sub: 'a narrative arc across 5 songs', out_album_letras_generated: '5-track EP lyrics generated',
    out_album_track_label: 'track', out_album_role: 'role',
    need_prompt: 'choose genre, mood or theme first',
    need_letra: 'fill in subject, mood, hook or imagery',
    err_variants: "couldn't generate variations. try again.",
    err_letra: "couldn't generate lyrics. try again.",
    err_interpret: "couldn't interpret. try rephrasing or being more specific.",
    err_daily_limit: "daily limit reached. resets in",
    daily_limit_label: "daily limit reached",
    quota_left: "left today",
    quota_card_remaining: "daily generations remaining",
    quota_card_sub: "shared between prompt and lyrics generations",
    quota_card_exhausted: "daily limit reached",
    quota_card_resets_in: "resets in",
    song_title: 'song title',
    previous_lyrics: 'previous lyrics',
    previous_show: 'show',
    gen_count_singular: 'generation',
    gen_count_plural: 'generations',
    gen_kind_album: 'EP · 5 tracks',
    gen_kind_variations: 'variations',
    clear_all: 'clear all',
    older_hidden: 'older generations hidden',
    toast_filled: '✓ fields filled by AI', toast_copied: '✓ copied to clipboard',
    toast_copy_fail: "couldn't copy automatically",
    open_suno: 'open Suno', open_suno_lyrics: 'open Suno · paste lyrics',
    toast_paste_style: '✓ copied · paste into Suno\'s Styles field',
    toast_paste_lyrics: '✓ copied · paste into Suno\'s Lyrics field',
    toast_prompt_saved: '✓ prompt saved', toast_letra_saved: '✓ lyrics saved',
    fav_title: 'favorites', fav_sub: 'archive', fav_empty: 'nothing saved yet.',
    fav_filter_all: 'all', fav_filter_prompt: 'prompt', fav_filter_letra: 'lyrics',
    ref_title: 'reference track', ref_sub_prompt: 'type a song name and artist, or paste full lyrics — AI uses it as a sound compass without copying.', ref_sub_letra: 'paste a lyric you love — AI extracts patterns (structure, meter, perspective) to apply to your theme.',
    ref_ph: 'ex: "Black — Pearl Jam"  ·  "Wave — Tom Jobim"  ·  paste full lyrics',
    ref_analyze: 'analyze reference', ref_analyzing: 'analyzing…', ref_clear: 'clear reference',
    ref_confidence_high: 'high confidence', ref_confidence_medium: 'partial confidence', ref_confidence_low: 'unknown reference',
    ref_unknown: "I don't know this reference well enough — try a more famous track or paste the lyrics directly.",
    ref_detected_track: 'song detected', ref_detected_lyrics: 'lyrics detected', ref_detected_url: 'link detected',
    ref_warning: 'reference is a compass, not a copy — your output stays original',
    history_title: 'history', history_sub: 'last 50 generations', history_empty: 'no generations yet.', history_clear: 'clear all',
    view_favorites: 'favorites', view_history: 'history',
    tips_title: 'Suno tips', tips_sub: 'learn',
    tips_intro: 'quick guide to get the most out of Suno. these tips complement what this tool already does — it generates the prompt and lyrics, but pasting into Suno and tweaking versions is on you.',
    tips_footer: 'tips updated april 2026 · Suno versions evolve — check official docs',
    footer_copy: 'paste into suno.com and run',
    size_micro_sub: '8 lines, no chorus', size_curta_sub: '1 verse + 1 chorus',
    size_media_sub: '2 verses + chorus + bridge', size_longa_sub: '3 verses + chorus + bridge',
    size_epica_sub: 'full extended structure',
    size_micro: 'micro', size_curta: 'short', size_media: 'medium', size_longa: 'long', size_epica: 'epic',
    verses_count: 'Verse count', verses_sub: 'narrative lines (excluding chorus)',
    chorus_count: 'Chorus repetitions', chorus_sub: 'how many times the chorus appears',
    verses_tip: 'tip: the size preset adjusts these automatically.',
    bpm: { dragged: 'dragged', medium: 'medium', groove: 'groove', fast: 'fast', frantic: 'frantic' },
    duration_teaser: '~30 seconds (teaser)', duration_short: '~1 minute (short)',
    duration_mid: '~2 minutes (mid)', duration_std: '~3 minutes (pop standard)',
    duration_long: '~4 minutes (long)', duration_extended: '5+ minutes (extended)',
  },
  pt: {
    subtitle: 'Forja de Prompts · Studio', tips: 'dicas', favorites: 'favoritos', clear: 'limpar',
    tab_prompt: 'Prompt', tab_prompt_sub: 'descrição musical',
    tab_letra: 'Letra', tab_letra_sub: 'lyrics pro Suno', back_home: 'Voltar pra home',
    customize: 'customizar', customize_sub: 'mais opções', primary_only: 'mostrando o essencial', show_all: 'mostrar todas opções', hide_advanced: 'ocultar avançado',
    sheet_done: 'pronto',
    limit_hint: 'Suno funciona melhor com foco. Desmarque pra trocar.',
    presets_title: 'partidas rápidas',
    presets_sub: 'toque uma vibe pra preencher os blocos',
    presets_browse_all: 'ver todas',
    presets_modal_title: 'todas as partidas',
    shortcuts_title: 'atalhos de teclado',
    shortcuts_close: 'aperte esc ou ? para fechar',
    shortcuts_btn: 'atalhos',
    shortcut_gen_prompt: 'Gerar prompt', shortcut_gen_lyrics: 'Gerar letra',
    shortcut_gen_ep: 'Gerar EP de 5 faixas', shortcut_gen_ep_lyrics: 'Gerar letras do EP',
    shortcut_switch_tab: 'Trocar aba (Prompt ↔ Letra)',
    shortcut_focus_brief: 'Focar inspiração livre',
    shortcut_toggle_help: 'Abrir/fechar essa ajuda',
    shortcut_close: 'Fechar qualquer modal ou sheet aberto',
    live_preview: 'pré-visualização ao vivo',
    live_preview_empty: 'selecione blocos pra ver seu prompt formando…',
    live_preview_over: 'acima do limite do Suno',
    inspiration_title: 'seja um poeta',
    be_producer_title: 'seja um produtor',
    be_producer_sub: 'ajuste o lado técnico',
    tab_producer: 'produtor',
    tab_advanced: 'avançado',
    advanced_intro_title: 'equipamento vintage · modo pro',
    advanced_intro_sub: 'Equipamentos selecionados que o Suno reproduz com fidelidade. Combine com a aba Produtor pra textura mais fina.',
    lbl_drum_machines: 'Drum machines',
    lbl_synths: 'Sintetizadores vintage & teclas',
    lbl_mics: 'Microfones · gravação',
    inspiration_prompt_sub: 'descreva um sentimento, uma cena, uma memória — a IA preenche todos os campos abaixo.',
    inspiration_letra_sub: 'conte uma história, um sentimento, uma imagem — a IA preenche mood, estrutura, imagens e o refrão-chave.',
    inspiration_prompt_ph: 'ex: música pra dirigir de madrugada chorando escondido; ou: trilha de noir num Rio chuvoso',
    inspiration_letra_ph: 'ex: reencontrar um amor antigo num aeroporto; ou: o último verão antes de mudar',
    fill_with_ai: 'preencher campos com IA', interpreting: 'interpretando…', clear_inspiration: 'limpar inspiração',
    block_open: 'abrir', block_clear: 'limpar',
    lbl_genre: 'Gênero', lbl_mood: 'Mood · atmosfera', lbl_instruments: 'Instrumentos', lbl_vocals: 'Vozes',
    lbl_era: 'Era / estética', lbl_production: 'Produção / mixagem', lbl_tempo: 'Tempo / BPM',
    lbl_duration: 'Duração da música', lbl_language: 'Idioma', lbl_theme: 'Tema lírico', lbl_negative: 'Evitar (prompts negativos)',
    lbl_theme_letra: 'Assunto da letra', lbl_mood_letra: 'Tom emocional', lbl_genre_letra: 'Gênero musical',
    lbl_size: 'Tamanho da letra', lbl_verses: 'Versos e refrões', lbl_meter: 'Métrica dos versos',
    lbl_perspective: 'Perspectiva narrativa', lbl_structure: 'Estrutura da música', lbl_rhyme: 'Esquema de rima',
    lbl_elements: 'Imagens concretas', lbl_hook: 'Refrão-chave',
    ph_theme: 'ex: a primeira vez que vi o mar, uma despedida no porto…',
    ph_negative: 'ex: heavy metal, autotune, bateria eletrônica, vocais gritados…',
    ph_theme_letra: 'ex: o último verão na casa da praia, reencontrar alguém depois de anos…',
    ph_elements: 'ex: chuva de janeiro, cigarro na varanda, carta amassada, ventilador velho…',
    ph_hook: 'deixe vazio pra IA criar, ou escreva uma frase-chave pro refrão',
    out_prompt: 'Output · Prompt', out_letra: 'Output · Letra', out_live: 'ao vivo', out_side_a: 'prompt · side A',
    out_empty_prompt: 'use o brief livre acima ou abra os blocos pra começar',
    out_empty_letra: 'configure os blocos e clique em gerar. a letra virá com [Verse] [Chorus] em inglês (é o que o Suno reconhece).',
    out_over_limit: (l) => `excede o limite de ${l} caracteres do Suno. reduza seleções.`,
    out_over_limit_letra: (l) => `excede o limite de ${l} caracteres do Suno. gere com tamanho menor.`,
    out_copy: 'copiar', out_copy_letra: 'copiar letra', out_copied: 'copiado',
    out_save: 'salvar', out_saved: 'salvo',
    out_generate_prompt: 'gerar 3 variações com IA', out_generate_letra: 'gerar letra com IA',
    out_forging: 'forjando…', out_writing: 'escrevendo letra…', out_composing: 'compondo versos…',
    phases_prompt: ["lendo seu contexto…", "rascunhando ângulos…", "polindo o mais forte…"], phases_album: ["mapeando o universo sonoro…", "tecendo faixa 1, 2, 3…", "calibrando coerência…"], phases_letra: ["interpretando o tema…", "encontrando a voz…", "moldando versos…", "polindo o refrão…"], phases_letras_album: ["construindo o arco narrativo…", "escrevendo faixa 1…", "escrevendo faixa 2…", "escrevendo faixa 3…", "escrevendo faixa 4…", "escrevendo faixa 5…", "tecendo ecos entre as faixas…"], phases_ref: ["reconhecendo a referência…", "extraindo padrões…", "mapeando pro vocabulário…"],
    out_3_variants: '3 variações geradas', out_album_generated: 'EP de 5 faixas gerado', out_lines: 'linhas',
    out_generate_album: 'gerar EP de 5 faixas', out_album_sub: 'álbum coeso · mesmo universo, faixas variadas',
    out_generate_album_letras: 'gerar letras do EP (5 faixas)', out_album_letras_sub: 'arco narrativo entre as 5 músicas', out_album_letras_generated: 'letras do EP geradas',
    out_album_track_label: 'faixa', out_album_role: 'papel',
    need_prompt: 'escolha gênero, mood ou tema primeiro',
    need_letra: 'preencha assunto, mood, refrão ou imagens',
    err_variants: 'Não consegui gerar variações. Tenta de novo.',
    err_letra: 'Não consegui gerar a letra. Tenta de novo.',
    err_interpret: 'Não consegui interpretar. Tenta reformular.',
    err_daily_limit: 'Limite diário atingido. Reseta em',
    daily_limit_label: 'limite diário atingido',
    quota_left: 'restantes hoje',
    quota_card_remaining: 'gerações diárias restantes',
    quota_card_sub: 'compartilhadas entre prompt e letras',
    quota_card_exhausted: 'limite diário atingido',
    quota_card_resets_in: 'reseta em',
    song_title: 'título da música',
    previous_lyrics: 'letras anteriores',
    previous_show: 'mostrar',
    gen_count_singular: 'geração',
    gen_count_plural: 'gerações',
    gen_kind_album: 'EP · 5 faixas',
    gen_kind_variations: 'variações',
    clear_all: 'limpar tudo',
    older_hidden: 'gerações antigas ocultas',
    toast_filled: '✓ campos preenchidos pela IA', toast_copied: '✓ copiado',
    toast_copy_fail: 'não foi possível copiar',
    open_suno: 'abrir Suno', open_suno_lyrics: 'abrir Suno · colar letra',
    toast_paste_style: '✓ copiado · cole no campo Styles do Suno',
    toast_paste_lyrics: '✓ copiado · cole no campo Lyrics do Suno',
    toast_prompt_saved: '✓ prompt salvo', toast_letra_saved: '✓ letra salva',
    fav_title: 'favoritos', fav_sub: 'arquivo', fav_empty: 'nenhum item salvo ainda.',
    fav_filter_all: 'todos', fav_filter_prompt: 'prompt', fav_filter_letra: 'letra',
    ref_title: 'faixa de referência', ref_sub_prompt: 'digite o nome da música e artista, ou cole a letra completa — a IA usa como bússola sonora sem copiar.', ref_sub_letra: 'cole uma letra que você curte — a IA extrai padrões (estrutura, métrica, perspectiva) pra aplicar no seu tema.',
    ref_ph: 'ex: "Wave — Tom Jobim"  ·  "Black — Pearl Jam"  ·  cole a letra inteira',
    ref_analyze: 'analisar referência', ref_analyzing: 'analisando…', ref_clear: 'limpar referência',
    ref_confidence_high: 'alta confiança', ref_confidence_medium: 'confiança parcial', ref_confidence_low: 'referência desconhecida',
    ref_unknown: 'não conheço essa referência bem o suficiente — tente uma música mais conhecida ou cole a letra direto.',
    ref_detected_track: 'música detectada', ref_detected_lyrics: 'letra detectada', ref_detected_url: 'link detectado',
    ref_warning: 'referência é bússola, não cópia — seu output continua original',
    history_title: 'histórico', history_sub: 'últimas 50 gerações', history_empty: 'nenhuma geração ainda.', history_clear: 'limpar tudo',
    view_favorites: 'favoritos', view_history: 'histórico',
    tips_title: 'dicas do suno', tips_sub: 'aprender',
    tips_intro: 'guia rápido pra tirar o máximo do suno. essas dicas complementam o que esta ferramenta já faz — ela gera o prompt e a letra, mas quem cola no suno é você.',
    tips_footer: 'dicas atualizadas em abril 2026 · versões do suno evoluem — confira docs oficiais',
    footer_copy: 'cole no suno.com e manda ver',
    size_micro_sub: '8 versos, sem refrão', size_curta_sub: '1 verso + 1 refrão',
    size_media_sub: '2 versos + refrão + ponte', size_longa_sub: '3 versos + refrão + ponte',
    size_epica_sub: 'estrutura completa estendida',
    size_micro: 'micro', size_curta: 'curta', size_media: 'média', size_longa: 'longa', size_epica: 'épica',
    verses_count: 'Quantidade de versos', verses_sub: 'linhas narrativas (excluindo refrão)',
    chorus_count: 'Repetições do refrão', chorus_sub: 'quantas vezes o refrão aparece',
    verses_tip: 'dica: o preset de tamanho ajusta esses valores automaticamente.',
    bpm: { dragged: 'arrastado', medium: 'médio', groove: 'groove', fast: 'acelerado', frantic: 'frenético' },
    duration_teaser: '~30 segundos (teaser)', duration_short: '~1 minuto (curta)',
    duration_mid: '~2 minutos (média)', duration_std: '~3 minutos (padrão pop)',
    duration_long: '~4 minutos (longa)', duration_extended: '5+ minutos (estendida)',
  },
  es: {
    subtitle: 'Forja de Prompts · Studio', tips: 'consejos', favorites: 'favoritos', clear: 'limpiar',
    tab_prompt: 'Prompt', tab_prompt_sub: 'descripción musical',
    tab_letra: 'Letra', tab_letra_sub: 'letra para Suno', back_home: 'Volver al inicio',
    customize: 'personalizar', customize_sub: 'más opciones', primary_only: 'mostrando lo esencial', show_all: 'mostrar todas las opciones', hide_advanced: 'ocultar avanzado',
    sheet_done: 'listo',
    limit_hint: 'Suno funciona mejor con foco. Quita uno para cambiar.',
    presets_title: 'inicios rápidos',
    presets_sub: 'toca un vibe para llenar los bloques',
    presets_browse_all: 'ver todos',
    presets_modal_title: 'todos los inicios',
    shortcuts_title: 'atajos de teclado',
    shortcuts_close: 'pulsa esc o ? para cerrar',
    shortcuts_btn: 'atajos',
    shortcut_gen_prompt: 'Generar prompt', shortcut_gen_lyrics: 'Generar letra',
    shortcut_gen_ep: 'Generar EP de 5 pistas', shortcut_gen_ep_lyrics: 'Generar letras del EP',
    shortcut_switch_tab: 'Cambiar pestaña (Prompt ↔ Letra)',
    shortcut_focus_brief: 'Enfocar inspiración libre',
    shortcut_toggle_help: 'Mostrar/ocultar esta ayuda',
    shortcut_close: 'Cerrar cualquier modal o panel abierto',
    live_preview: 'vista previa en vivo',
    live_preview_empty: 'selecciona bloques para ver tu prompt formándose…',
    live_preview_over: 'sobre el límite de Suno',
    inspiration_title: 'sé un poeta',
    be_producer_title: 'sé un productor',
    be_producer_sub: 'ajusta el lado técnico',
    tab_producer: 'productor',
    tab_advanced: 'avanzado',
    advanced_intro_title: 'equipo vintage · modo pro',
    advanced_intro_sub: 'Equipo seleccionado que Suno reproduce con fidelidad. Combina con la pestaña Productor para textura más fina.',
    lbl_drum_machines: 'Drum machines',
    lbl_synths: 'Sintetizadores vintage & teclas',
    lbl_mics: 'Micrófonos · grabación',
    inspiration_prompt_sub: 'describe un sentimiento, escena, recuerdo — la IA rellena todos los campos.',
    inspiration_letra_sub: 'cuenta una historia, un sentimiento, una imagen — la IA rellena todo.',
    inspiration_prompt_ph: 'ej: música para conducir de madrugada llorando; o: banda sonora noir',
    inspiration_letra_ph: 'ej: reencontrar un amor antiguo; o: el último verano antes de mudarse',
    fill_with_ai: 'rellenar campos con IA', interpreting: 'interpretando…', clear_inspiration: 'limpiar inspiración',
    block_open: 'abrir', block_clear: 'limpiar',
    lbl_genre: 'Género', lbl_mood: 'Mood · atmósfera', lbl_instruments: 'Instrumentos', lbl_vocals: 'Voces',
    lbl_era: 'Era / estética', lbl_production: 'Producción / mezcla', lbl_tempo: 'Tempo / BPM',
    lbl_duration: 'Duración', lbl_language: 'Idioma', lbl_theme: 'Tema lírico', lbl_negative: 'Evitar (prompts negativos)',
    lbl_theme_letra: 'Asunto', lbl_mood_letra: 'Tono emocional', lbl_genre_letra: 'Género musical',
    lbl_size: 'Tamaño', lbl_verses: 'Estrofas y estribillos', lbl_meter: 'Métrica',
    lbl_perspective: 'Perspectiva', lbl_structure: 'Estructura', lbl_rhyme: 'Rima',
    lbl_elements: 'Imágenes concretas', lbl_hook: 'Estribillo clave',
    ph_theme: 'ej: la primera vez que vi el mar, una despedida en el puerto…',
    ph_negative: 'ej: heavy metal, autotune, batería electrónica, voces gritadas…',
    ph_theme_letra: 'ej: el último verano en la playa, reencontrar a alguien…',
    ph_elements: 'ej: lluvia de enero, cigarrillo en el balcón, carta arrugada…',
    ph_hook: 'deja vacío para que la IA cree uno, o escribe una frase clave',
    out_prompt: 'Output · Prompt', out_letra: 'Output · Letra', out_live: 'en vivo', out_side_a: 'prompt · cara A',
    out_empty_prompt: 'usa la inspiración libre arriba o abre los bloques',
    out_empty_letra: 'configura los bloques y genera. la letra usará [Verse] [Chorus] en inglés.',
    out_over_limit: (l) => `excede el límite de ${l} caracteres de Suno.`,
    out_over_limit_letra: (l) => `excede el límite de ${l} caracteres de Suno.`,
    out_copy: 'copiar', out_copy_letra: 'copiar letra', out_copied: 'copiado',
    out_save: 'guardar', out_saved: 'guardado',
    out_generate_prompt: 'generar 3 variaciones con IA', out_generate_letra: 'generar letra con IA',
    out_forging: 'forjando…', out_writing: 'escribiendo…', out_composing: 'componiendo…',
    phases_prompt: ["leyendo el contexto…", "esbozando ángulos…", "puliendo el más fuerte…"], phases_album: ["mapeando el universo sonoro…", "tejiendo pista 1, 2, 3…", "calibrando coherencia…"], phases_letra: ["interpretando el tema…", "encontrando la voz…", "modelando versos…", "puliendo el estribillo…"], phases_letras_album: ["construyendo el arco narrativo…", "escribiendo pista 1…", "escribiendo pista 2…", "escribiendo pista 3…", "escribiendo pista 4…", "escribiendo pista 5…", "tejiendo ecos entre pistas…"], phases_ref: ["reconociendo la referencia…", "extrayendo patrones…", "mapeando al vocabulario…"],
    out_3_variants: '3 variaciones generadas', out_album_generated: 'EP de 5 pistas generado', out_lines: 'líneas',
    out_generate_album: 'generar EP de 5 pistas', out_album_sub: 'álbum coherente · mismo universo, pistas variadas',
    out_generate_album_letras: 'generar letras del EP (5 pistas)', out_album_letras_sub: 'arco narrativo entre las 5 canciones', out_album_letras_generated: 'letras del EP generadas',
    out_album_track_label: 'pista', out_album_role: 'rol',
    need_prompt: 'elige género, mood o tema primero',
    need_letra: 'rellena asunto, mood, estribillo o imágenes',
    err_variants: 'No pude generar variaciones.', err_letra: 'No pude generar la letra.',
    err_interpret: 'No pude interpretar. Reformula.',
    err_daily_limit: 'Límite diario alcanzado. Se reinicia en',
    daily_limit_label: 'límite diario alcanzado',
    quota_left: 'restantes hoy',
    quota_card_remaining: 'generaciones diarias restantes',
    quota_card_sub: 'compartidas entre prompt y letras',
    quota_card_exhausted: 'límite diario alcanzado',
    quota_card_resets_in: 'se reinicia en',
    song_title: 'título de la canción',
    previous_lyrics: 'letras anteriores',
    previous_show: 'mostrar',
    gen_count_singular: 'generación',
    gen_count_plural: 'generaciones',
    gen_kind_album: 'EP · 5 pistas',
    gen_kind_variations: 'variaciones',
    clear_all: 'limpiar todo',
    older_hidden: 'generaciones antiguas ocultas',
    toast_filled: '✓ campos rellenados', toast_copied: '✓ copiado',
    toast_copy_fail: 'no se pudo copiar',
    open_suno: 'abrir Suno', open_suno_lyrics: 'abrir Suno · pegar letra',
    toast_paste_style: '✓ copiado · pega en el campo Styles de Suno',
    toast_paste_lyrics: '✓ copiado · pega en el campo Lyrics de Suno',
    toast_prompt_saved: '✓ prompt guardado', toast_letra_saved: '✓ letra guardada',
    fav_title: 'favoritos', fav_sub: 'archivo', fav_empty: 'nada guardado todavía.',
    fav_filter_all: 'todos', fav_filter_prompt: 'prompt', fav_filter_letra: 'letra',
    ref_title: 'pista de referencia', ref_sub_prompt: 'escribe el nombre y artista, o pega la letra completa — la IA la usa como brújula sin copiar.', ref_sub_letra: 'pega una letra que te guste — la IA extrae patrones para aplicar a tu tema.',
    ref_ph: 'ej: "Bésame Mucho — Consuelo Velázquez"  ·  pega la letra completa',
    ref_analyze: 'analizar referencia', ref_analyzing: 'analizando…', ref_clear: 'limpiar referencia',
    ref_confidence_high: 'alta confianza', ref_confidence_medium: 'confianza parcial', ref_confidence_low: 'referencia desconocida',
    ref_unknown: 'no conozco bien esa referencia — prueba con una más conocida o pega la letra.',
    ref_detected_track: 'canción detectada', ref_detected_lyrics: 'letra detectada', ref_detected_url: 'enlace detectado',
    ref_warning: 'la referencia es brújula, no copia — tu resultado sigue siendo original',
    history_title: 'historial', history_sub: 'últimas 50 generaciones', history_empty: 'sin generaciones aún.', history_clear: 'limpiar todo',
    view_favorites: 'favoritos', view_history: 'historial',
    tips_title: 'consejos de suno', tips_sub: 'aprender',
    tips_intro: 'guía rápida para sacar el máximo de Suno.',
    tips_footer: 'consejos actualizados abril 2026 · consulta docs oficiales',
    footer_copy: 'pega en suno.com y dale',
    size_micro_sub: '8 versos, sin estribillo', size_curta_sub: '1 estrofa + 1 estribillo',
    size_media_sub: '2 estrofas + estribillo + puente', size_longa_sub: '3 estrofas + estribillo + puente',
    size_epica_sub: 'estructura completa extendida',
    size_micro: 'micro', size_curta: 'corta', size_media: 'media', size_longa: 'larga', size_epica: 'épica',
    verses_count: 'Cantidad de versos', verses_sub: 'líneas narrativas (sin estribillo)',
    chorus_count: 'Repeticiones estribillo', chorus_sub: 'cuántas veces aparece',
    verses_tip: 'tip: el preset ajusta estos valores automáticamente.',
    bpm: { dragged: 'arrastrado', medium: 'medio', groove: 'groove', fast: 'rápido', frantic: 'frenético' },
    duration_teaser: '~30 segundos (teaser)', duration_short: '~1 minuto (corta)',
    duration_mid: '~2 minutos (media)', duration_std: '~3 minutos (pop estándar)',
    duration_long: '~4 minutos (larga)', duration_extended: '5+ minutos (extendida)',
  },
  fr: {
    subtitle: 'Forge de Prompts · Studio', tips: 'astuces', favorites: 'favoris', clear: 'effacer',
    tab_prompt: 'Prompt', tab_prompt_sub: 'description musicale',
    tab_letra: 'Paroles', tab_letra_sub: 'paroles pour Suno', back_home: "Retour à l'accueil",
    customize: 'personnaliser', customize_sub: 'plus d\'options', primary_only: 'affichant l\'essentiel', show_all: 'tout afficher', hide_advanced: 'masquer avancé',
    sheet_done: 'terminé',
    limit_hint: 'Suno fonctionne mieux avec focus. Désélectionnez pour échanger.',
    presets_title: 'départs rapides',
    presets_sub: 'touchez une vibe pour remplir les blocs',
    presets_browse_all: 'voir tous',
    presets_modal_title: 'tous les départs',
    shortcuts_title: 'raccourcis clavier',
    shortcuts_close: 'esc ou ? pour fermer',
    shortcuts_btn: 'raccourcis',
    shortcut_gen_prompt: 'Générer le prompt', shortcut_gen_lyrics: 'Générer les paroles',
    shortcut_gen_ep: 'Générer EP 5 morceaux', shortcut_gen_ep_lyrics: "Générer les paroles de l'EP",
    shortcut_switch_tab: "Changer d'onglet (Prompt ↔ Paroles)",
    shortcut_focus_brief: 'Focus inspiration libre',
    shortcut_toggle_help: 'Afficher/masquer cette aide',
    shortcut_close: 'Fermer tout modal ou panneau ouvert',
    live_preview: 'aperçu en direct',
    live_preview_empty: 'sélectionnez des blocs pour voir votre prompt se former…',
    live_preview_over: 'au-dessus de la limite Suno',
    inspiration_title: 'sois un poète',
    be_producer_title: 'sois un producteur',
    be_producer_sub: 'affinez le côté technique',
    tab_producer: 'producteur',
    tab_advanced: 'avancé',
    advanced_intro_title: 'matériel vintage · mode pro',
    advanced_intro_sub: "Équipement sélectionné que Suno reproduit fidèlement. Combinez avec l'onglet Producteur pour une texture plus fine.",
    lbl_drum_machines: 'Boîtes à rythme',
    lbl_synths: 'Synthés vintage & claviers',
    lbl_mics: 'Microphones · enregistrement',
    inspiration_prompt_sub: 'décrivez un sentiment, une scène, un souvenir — l\'IA remplit tous les champs.',
    inspiration_letra_sub: 'racontez une histoire — l\'IA remplit tout.',
    inspiration_prompt_ph: 'ex: musique pour conduire à l\'aube en pleurant; ou: bande-son d\'un film noir',
    inspiration_letra_ph: 'ex: retrouver un ancien amour; ou: le dernier été avant de déménager',
    fill_with_ai: 'remplir avec l\'IA', interpreting: 'interprétation…', clear_inspiration: 'effacer l\'inspiration',
    block_open: 'ouvrir', block_clear: 'effacer',
    lbl_genre: 'Genre', lbl_mood: 'Mood · atmosphère', lbl_instruments: 'Instruments', lbl_vocals: 'Voix',
    lbl_era: 'Époque / esthétique', lbl_production: 'Production / mix', lbl_tempo: 'Tempo / BPM',
    lbl_duration: 'Durée', lbl_language: 'Langue', lbl_theme: 'Thème lyrique', lbl_negative: 'Éviter (prompts négatifs)',
    lbl_theme_letra: 'Sujet', lbl_mood_letra: 'Tonalité émotionnelle', lbl_genre_letra: 'Genre musical',
    lbl_size: 'Taille', lbl_verses: 'Couplets et refrains', lbl_meter: 'Métrique',
    lbl_perspective: 'Perspective', lbl_structure: 'Structure', lbl_rhyme: 'Rime',
    lbl_elements: 'Images concrètes', lbl_hook: 'Refrain clé',
    ph_theme: 'ex: la première fois que j\'ai vu la mer, des adieux au port…',
    ph_negative: 'ex: heavy metal, autotune, batterie électronique, voix criées…',
    ph_theme_letra: 'ex: le dernier été à la maison de plage, retrouver quelqu\'un…',
    ph_elements: 'ex: pluie de janvier, cigarette au balcon, lettre froissée…',
    ph_hook: 'laissez vide pour que l\'IA en crée un, ou écrivez une phrase clé',
    out_prompt: 'Output · Prompt', out_letra: 'Output · Paroles', out_live: 'en direct', out_side_a: 'prompt · face A',
    out_empty_prompt: 'utilisez l\'inspiration libre ou ouvrez les blocs',
    out_empty_letra: 'configurez les blocs et générez. les paroles utiliseront [Verse] [Chorus] en anglais.',
    out_over_limit: (l) => `dépasse la limite de ${l} caractères.`,
    out_over_limit_letra: (l) => `dépasse la limite de ${l} caractères.`,
    out_copy: 'copier', out_copy_letra: 'copier les paroles', out_copied: 'copié',
    out_save: 'sauvegarder', out_saved: 'sauvegardé',
    out_generate_prompt: 'générer 3 variantes avec l\'IA', out_generate_letra: 'générer les paroles',
    out_forging: 'forgeage…', out_writing: 'rédaction…', out_composing: 'composition…',
    phases_prompt: ["lecture du contexte…", "esquisse des angles…", "polissage du plus fort…"], phases_album: ["cartographie de l'univers sonore…", "tissage des titres 1, 2, 3…", "calibrage de la cohérence…"], phases_letra: ["interprétation du thème…", "recherche de la voix…", "modelage des couplets…", "polissage du refrain…"], phases_letras_album: ["construction de l'arc narratif…", "écriture du titre 1…", "écriture du titre 2…", "écriture du titre 3…", "écriture du titre 4…", "écriture du titre 5…", "tissage d'échos entre les titres…"], phases_ref: ["reconnaissance de la référence…", "extraction de patterns…", "mapping au vocabulaire…"],
    out_3_variants: '3 variantes générées', out_album_generated: 'EP de 5 titres généré', out_lines: 'lignes',
    out_generate_album: 'générer EP de 5 titres', out_album_sub: 'album cohérent · même univers, titres variés',
    out_generate_album_letras: 'générer paroles du EP (5 titres)', out_album_letras_sub: 'arc narratif sur les 5 chansons', out_album_letras_generated: 'paroles du EP générées',
    out_album_track_label: 'titre', out_album_role: 'rôle',
    need_prompt: 'choisissez genre, mood ou thème',
    need_letra: 'remplissez sujet, mood, refrain ou images',
    err_variants: 'Impossible de générer.', err_letra: 'Impossible de générer.',
    err_interpret: 'Impossible d\'interpréter.',
    err_daily_limit: 'Limite quotidienne atteinte. Réinitialisation dans',
    daily_limit_label: 'limite quotidienne atteinte',
    quota_left: 'restants aujourd\'hui',
    quota_card_remaining: 'générations quotidiennes restantes',
    quota_card_sub: 'partagées entre prompts et paroles',
    quota_card_exhausted: 'limite quotidienne atteinte',
    quota_card_resets_in: 'réinitialisation dans',
    song_title: 'titre de la chanson',
    previous_lyrics: 'paroles précédentes',
    previous_show: 'voir',
    gen_count_singular: 'génération',
    gen_count_plural: 'générations',
    gen_kind_album: 'EP · 5 pistes',
    gen_kind_variations: 'variations',
    clear_all: 'tout effacer',
    older_hidden: 'anciennes générations cachées',
    toast_filled: '✓ champs remplis', toast_copied: '✓ copié',
    toast_copy_fail: 'impossible de copier',
    open_suno: 'ouvrir Suno', open_suno_lyrics: 'ouvrir Suno · coller paroles',
    toast_paste_style: '✓ copié · collez dans le champ Styles de Suno',
    toast_paste_lyrics: '✓ copié · collez dans le champ Lyrics de Suno',
    toast_prompt_saved: '✓ prompt sauvegardé', toast_letra_saved: '✓ paroles sauvegardées',
    fav_title: 'favoris', fav_sub: 'archive', fav_empty: 'rien de sauvegardé.',
    fav_filter_all: 'tous', fav_filter_prompt: 'prompt', fav_filter_letra: 'paroles',
    ref_title: 'piste de référence', ref_sub_prompt: 'tapez le nom et l\'artiste, ou collez les paroles — l\'IA s\'en sert comme boussole sans copier.', ref_sub_letra: 'collez des paroles que vous aimez — l\'IA extrait les patterns pour les appliquer à votre thème.',
    ref_ph: 'ex: "Ne me quitte pas — Jacques Brel"  ·  collez les paroles',
    ref_analyze: 'analyser la référence', ref_analyzing: 'analyse en cours…', ref_clear: 'effacer la référence',
    ref_confidence_high: 'haute confiance', ref_confidence_medium: 'confiance partielle', ref_confidence_low: 'référence inconnue',
    ref_unknown: 'je ne connais pas assez cette référence — essayez une plus connue ou collez les paroles.',
    ref_detected_track: 'chanson détectée', ref_detected_lyrics: 'paroles détectées', ref_detected_url: 'lien détecté',
    ref_warning: 'la référence est une boussole, pas une copie — votre résultat reste original',
    history_title: 'historique', history_sub: '50 dernières générations', history_empty: 'aucune génération.', history_clear: 'tout effacer',
    view_favorites: 'favoris', view_history: 'historique',
    tips_title: 'astuces suno', tips_sub: 'apprendre',
    tips_intro: 'guide rapide pour Suno.',
    tips_footer: 'astuces avril 2026 · consultez les docs',
    footer_copy: 'collez sur suno.com',
    size_micro_sub: '8 vers, sans refrain', size_curta_sub: '1 couplet + 1 refrain',
    size_media_sub: '2 couplets + refrain + pont', size_longa_sub: '3 couplets + refrain + pont',
    size_epica_sub: 'structure complète',
    size_micro: 'micro', size_curta: 'court', size_media: 'moyen', size_longa: 'long', size_epica: 'épique',
    verses_count: 'Nombre de vers', verses_sub: 'lignes narratives (hors refrain)',
    chorus_count: 'Répétitions refrain', chorus_sub: 'combien de fois',
    verses_tip: 'astuce: le préréglage ajuste automatiquement.',
    bpm: { dragged: 'traîné', medium: 'moyen', groove: 'groove', fast: 'rapide', frantic: 'frénétique' },
    duration_teaser: '~30 secondes (teaser)', duration_short: '~1 minute (court)',
    duration_mid: '~2 minutes (moyen)', duration_std: '~3 minutes (pop standard)',
    duration_long: '~4 minutes (long)', duration_extended: '5+ minutes (étendu)',
  },
};

// ——— Vocabulário (keys em inglês) ———

const GENEROS_CATS_KEYS = {
  electronic_dance: [
    { key: 'deep house',         refs: 'Kerri Chandler, Larry Heard, Moodymann' },
    { key: 'downtempo',          refs: 'Thievery Corporation, Bonobo, Nightmares on Wax' },
    { key: 'drum and bass',      refs: 'Goldie, Roni Size, Netsky' },
    { key: 'dub',                refs: 'King Tubby, Lee Scratch Perry, Scientist' },
    { key: 'organic dubstep',    refs: 'Burial, Mala, Coki' },
    { key: 'EDM',                refs: 'Calvin Harris, Martin Garrix, Marshmello' },
    { key: 'progressive house',  refs: 'Sasha, John Digweed, Eric Prydz' },
    { key: 'hyperpop',           refs: '100 gecs, SOPHIE, Charli XCX' },
    { key: 'italo-disco',        refs: 'Giorgio Moroder, Ryan Paris, Den Harrow' },
    { key: 'jungle',             refs: 'Shy FX, LTJ Bukem, Congo Natty' },
    { key: 'nu-disco',           refs: 'Todd Terje, Lindstrøm, Escort' },
    { key: 'phonk',              refs: 'DJ Smokey, Kordhell, Playaphonk' },
    { key: 'synthpop',           refs: 'Depeche Mode, New Order, Pet Shop Boys' },
    { key: 'synthwave',          refs: 'Kavinsky, The Midnight, FM-84' },
    { key: 'detroit techno',     refs: 'Derrick May, Jeff Mills, Juan Atkins' },
    { key: 'trip-hop',           refs: 'Portishead, Massive Attack, Tricky' },
    { key: 'vaporwave',          refs: 'Macintosh Plus, Saint Pepsi, HOME' },
  ],
  hip_hop_rap: [
    { key: 'boom-bap', refs: 'Nas, Gang Starr, Pete Rock' },
    { key: 'drill', refs: 'Pop Smoke, Chief Keef, Headie One' },
    { key: 'lo-fi hip hop', refs: 'Nujabes, J Dilla, Jinsang' },
    { key: 'trap', refs: 'Future, Travis Scott, Metro Boomin' },
  ],
  rock_alternative: [
    { key: 'atmospheric black metal', refs: 'Wolves in the Throne Room, Agalloch, Drudkh' },
    { key: 'doom metal', refs: 'Black Sabbath, Candlemass, Electric Wizard' },
    { key: 'dream pop', refs: 'Cocteau Twins, Beach House, Mazzy Star' },
    { key: 'math rock', refs: 'Don Caballero, American Football, toe' },
    { key: 'new wave', refs: 'Talking Heads, Blondie, Devo' },
    { key: 'post-punk', refs: 'Joy Division, The Cure, Interpol' },
    { key: 'post-rock', refs: 'Explosions in the Sky, Mogwai, Godspeed You! Black Emperor' },
    { key: 'shoegaze', refs: 'My Bloody Valentine, Slowdive, Ride' },
    { key: 'sludge', refs: 'Eyehategod, Crowbar, Melvins' },
    { key: 'surf rock', refs: 'Dick Dale, The Ventures, The Surfaris' },
  ],
  pop_indie: [
    { key: 'city pop', refs: 'Tatsuro Yamashita, Mariya Takeuchi, Anri' },
    { key: 'disco', refs: 'Chic, Donna Summer, Bee Gees' },
    { key: 'indie folk', refs: 'Fleet Foxes, Bon Iver, Sufjan Stevens' },
  ],
  soul_rnb_jazz: [
    { key: 'gospel soul', refs: 'Aretha Franklin, Mahalia Jackson, Sam Cooke' },
    { key: 'jazz fusion', refs: 'Weather Report, Herbie Hancock, Chick Corea' },
    { key: 'neo-soul', refs: 'Erykah Badu, D\'Angelo, Jill Scott' },
    { key: 'alternative R&B', refs: 'Frank Ocean, The Weeknd, SZA' },
  ],
  brazilian: [
    { key: 'retro axé', refs: 'Daniela Mercury, Timbalada, Olodum' },
    { key: 'bossa nova', refs: 'João Gilberto, Tom Jobim, Vinicius de Moraes' },
    { key: 'brega-funk', refs: 'MC Loma, Kevin o Chris, Shevchenko e Elloco' },
    { key: 'forró pé-de-serra', refs: 'Luiz Gonzaga, Jackson do Pandeiro, Dominguinhos' },
    { key: 'funk carioca', refs: 'MC Marcinho, Anitta, MC Kevinho' },
    { key: 'modern MPB', refs: 'Marisa Monte, Tim Maia, Djavan' },
    { key: 'tropicália', refs: 'Os Mutantes, Gal Costa, Tom Zé' },
    { key: 'samba-jazz', refs: 'Tamba Trio, Sérgio Mendes, Edu Lobo' },
    { key: 'roots sertanejo', refs: 'Tonico e Tinoco, Tião Carreiro, Almir Sater' },
  ],
  latin_caribbean: [
    { key: 'afrobeats', refs: 'Burna Boy, Wizkid, Davido' },
    { key: 'digital cumbia', refs: 'Nicola Cruz, Chancha Vía Circuito, El Búho' },
    { key: 'dancehall', refs: 'Sean Paul, Vybz Kartel, Popcaan' },
    { key: 'roots reggae', refs: 'Bob Marley, Peter Tosh, Burning Spear' },
    { key: 'reggaeton', refs: 'Bad Bunny, Daddy Yankee, J Balvin' },
    { key: 'ska', refs: 'The Specials, Madness, Sublime' },
  ],
  cinematic_ambient: [
    { key: 'ambient', refs: 'Brian Eno, Aphex Twin, Stars of the Lid' },
    { key: 'cinematic orchestral', refs: 'Hans Zimmer, John Williams, Ennio Morricone' },
    { key: 'synth soundtrack', refs: 'Vangelis, Tangerine Dream, Cliff Martinez' },
  ],
};

const CAT_LABELS = {
  en: { electronic_dance: 'electronic / dance', hip_hop_rap: 'hip-hop / rap', rock_alternative: 'rock / alternative',
    pop_indie: 'pop / indie', soul_rnb_jazz: 'soul / r&b / jazz', brazilian: 'brazilian',
    latin_caribbean: 'latin / caribbean', cinematic_ambient: 'cinematic / ambient' },
  pt: { electronic_dance: 'eletrônicos / dança', hip_hop_rap: 'hip-hop / rap', rock_alternative: 'rock / alternativo',
    pop_indie: 'pop / indie', soul_rnb_jazz: 'soul / r&b / jazz', brazilian: 'brasileiros',
    latin_caribbean: 'latinos / caribenhos', cinematic_ambient: 'cinematográfico / ambient' },
  es: { electronic_dance: 'electrónicos / baile', hip_hop_rap: 'hip-hop / rap', rock_alternative: 'rock / alternativo',
    pop_indie: 'pop / indie', soul_rnb_jazz: 'soul / r&b / jazz', brazilian: 'brasileños',
    latin_caribbean: 'latinos / caribeños', cinematic_ambient: 'cinematográfico / ambient' },
  fr: { electronic_dance: 'électronique / danse', hip_hop_rap: 'hip-hop / rap', rock_alternative: 'rock / alternatif',
    pop_indie: 'pop / indie', soul_rnb_jazz: 'soul / r&b / jazz', brazilian: 'brésiliens',
    latin_caribbean: 'latins / caribéens', cinematic_ambient: 'cinématique / ambient' },
};

const GENRE_LABELS = {
  pt: { 'organic dubstep': 'dubstep orgânico', 'progressive house': 'house progressivo', 'detroit techno': 'techno detroit',
    'atmospheric black metal': 'black metal atmosférico', 'alternative R&B': 'R&B alternativo',
    'retro axé': 'axé retrô', 'modern MPB': 'MPB moderna', 'roots sertanejo': 'sertanejo raiz',
    'digital cumbia': 'cumbia digital', 'roots reggae': 'reggae roots',
    'cinematic orchestral': 'orquestral cinemático', 'synth soundtrack': 'trilha synth' },
  es: { 'organic dubstep': 'dubstep orgánico', 'progressive house': 'house progresivo', 'detroit techno': 'techno de Detroit',
    'atmospheric black metal': 'black metal atmosférico', 'alternative R&B': 'R&B alternativo',
    'retro axé': 'axé retro', 'modern MPB': 'MPB moderno', 'roots sertanejo': 'sertanejo raíz',
    'digital cumbia': 'cumbia digital', 'roots reggae': 'reggae roots',
    'cinematic orchestral': 'orquestal cinematográfico', 'synth soundtrack': 'banda sonora synth' },
  fr: { 'organic dubstep': 'dubstep organique', 'progressive house': 'house progressive', 'detroit techno': 'techno de Detroit',
    'atmospheric black metal': 'black metal atmosphérique', 'alternative R&B': 'R&B alternatif',
    'retro axé': 'axé rétro', 'modern MPB': 'MPB moderne', 'roots sertanejo': 'sertanejo racines',
    'digital cumbia': 'cumbia numérique', 'roots reggae': 'reggae roots',
    'cinematic orchestral': 'orchestral cinématique', 'synth soundtrack': 'bande-son synth' },
};

const MOODS_KEYS = ['aggressive','chaotic','contemplative','hopeful','ethereal','euphoric','festive','hypnotic',
  'liberating','melancholic','nostalgic','dreamlike','romantic','sensual','serene','dark','lonely','tense','urgent','vengeful'];

const MOODS_LABELS = {
  pt: { aggressive:'agressivo', chaotic:'caótico', contemplative:'contemplativo', hopeful:'esperançoso', ethereal:'etéreo',
    euphoric:'eufórico', festive:'festivo', hypnotic:'hipnótico', liberating:'libertador', melancholic:'melancólico',
    nostalgic:'nostálgico', dreamlike:'onírico', romantic:'romântico', sensual:'sensual', serene:'sereno',
    dark:'sombrio', lonely:'solitário', tense:'tenso', urgent:'urgente', vengeful:'vingativo' },
  es: { aggressive:'agresivo', chaotic:'caótico', contemplative:'contemplativo', hopeful:'esperanzado', ethereal:'etéreo',
    euphoric:'eufórico', festive:'festivo', hypnotic:'hipnótico', liberating:'liberador', melancholic:'melancólico',
    nostalgic:'nostálgico', dreamlike:'onírico', romantic:'romántico', sensual:'sensual', serene:'sereno',
    dark:'oscuro', lonely:'solitario', tense:'tenso', urgent:'urgente', vengeful:'vengativo' },
  fr: { aggressive:'agressif', chaotic:'chaotique', contemplative:'contemplatif', hopeful:'plein d\'espoir', ethereal:'éthéré',
    euphoric:'euphorique', festive:'festif', hypnotic:'hypnotique', liberating:'libérateur', melancholic:'mélancolique',
    nostalgic:'nostalgique', dreamlike:'onirique', romantic:'romantique', sensual:'sensuel', serene:'serein',
    dark:'sombre', lonely:'solitaire', tense:'tendu', urgent:'urgent', vengeful:'vengeur' },
};

const INSTRUMENTOS_CATS_KEYS = {
  organic_acoustic: ['accordion','harp','slap bass','dry acoustic drums','brushed drums','cello','clarinet','upright bass',
    'orchestral strings','transverse flute','harmonica','fuzz guitar','clean guitar','acoustic piano','Rhodes piano',
    'alto sax','tenor sax','slide guitar','trombone','trumpet','steel string guitar','nylon string guitar','solo violin'],
  electronic_synth: ['analog bass','808 drums','punchy electronic drums','LinnDrum machine','FM bells','high lead',
    'mellotron','atmospheric pad','vintage synthesizer','sub-bass','Moog analog synth','arpeggiator synth','modular synth','theremin'],
  regional_ethnic: ['atabaque','mandolin','berimbau','cavaquinho','didgeridoo','handpan','kalimba','koto',
    'pandeiro','shakuhachi','sitar','surdo','tabla','tamborim','viola caipira'],
  natural_ambient: ['busy café','heavy rain','distant city','crackling fire','crickets at night','passing subway',
    'ocean waves','birds singing','distant thunder','wind in trees'],
  effects_textures: ['lo-fi bitcrusher','cassette tape hiss','analog delay','warm distortion','digital glitches',
    'reversed loop','radio static','hall reverb','old film samples','vinyl crackle'],
};

const INSTR_CAT_LABELS = {
  en: { organic_acoustic:'organic / acoustic', electronic_synth:'electronic / synth', regional_ethnic:'regional / ethnic',
    natural_ambient:'natural / ambient', effects_textures:'effects & textures' },
  pt: { organic_acoustic:'orgânicos / acústicos', electronic_synth:'eletrônicos / sintetizados',
    regional_ethnic:'regionais / étnicos', natural_ambient:'sons naturais', effects_textures:'efeitos e texturas' },
  es: { organic_acoustic:'orgánicos / acústicos', electronic_synth:'electrónicos / sintetizados',
    regional_ethnic:'regionales / étnicos', natural_ambient:'sonidos naturales', effects_textures:'efectos y texturas' },
  fr: { organic_acoustic:'organiques / acoustiques', electronic_synth:'électroniques / synthés',
    regional_ethnic:'régionaux / ethniques', natural_ambient:'sons naturels', effects_textures:'effets et textures' },
};

const INSTR_LABELS = {
  pt: { 'accordion':'acordeão','harp':'arpa','slap bass':'baixo slap','dry acoustic drums':'bateria acústica seca',
    'brushed drums':'bateria com vassouras','cello':'cello','clarinet':'clarinete','upright bass':'contrabaixo acústico',
    'orchestral strings':'cordas orquestrais','transverse flute':'flauta transversal','harmonica':'gaita',
    'fuzz guitar':'guitarra fuzz','clean guitar':'guitarra limpa','acoustic piano':'piano acústico','Rhodes piano':'piano Rhodes',
    'alto sax':'sax alto','tenor sax':'sax tenor','slide guitar':'slide guitar','trombone':'trombone','trumpet':'trompete',
    'steel string guitar':'violão de aço','nylon string guitar':'violão de nylon','solo violin':'violino solo',
    'analog bass':'baixo analógico','808 drums':'bateria 808','punchy electronic drums':'bateria eletrônica punchy',
    'LinnDrum machine':'LinnDrum','FM bells':'FM bells','high lead':'lead agudo','mellotron':'mellotron',
    'atmospheric pad':'pad atmosférico','vintage synthesizer':'sintetizador vintage','sub-bass':'sub-bass',
    'Moog analog synth':'synth analógico Moog','arpeggiator synth':'synth arpeggiador','modular synth':'synth modular','theremin':'theremin',
    'busy café':'cafeteria movimentada','heavy rain':'chuva forte','distant city':'cidade ao longe',
    'crackling fire':'crepitar de fogueira','crickets at night':'grilos à noite','passing subway':'metrô passando',
    'ocean waves':'ondas do mar','birds singing':'pássaros cantando','distant thunder':'trovão distante','wind in trees':'vento em árvores',
    'lo-fi bitcrusher':'bitcrusher lo-fi','cassette tape hiss':'chiado de cassete','analog delay':'delay analógico',
    'warm distortion':'distorção quente','digital glitches':'glitches digitais','reversed loop':'loop invertido',
    'radio static':'estática de rádio','hall reverb':'reverb de salão','old film samples':'samples de filme antigo','vinyl crackle':'vinyl crackle' },
  es: { 'accordion':'acordeón','harp':'arpa','slap bass':'bajo slap','dry acoustic drums':'batería acústica seca',
    'brushed drums':'batería con escobillas','cello':'cello','clarinet':'clarinete','upright bass':'contrabajo',
    'orchestral strings':'cuerdas orquestales','transverse flute':'flauta travesera','harmonica':'armónica',
    'fuzz guitar':'guitarra fuzz','clean guitar':'guitarra limpia','acoustic piano':'piano acústico','Rhodes piano':'piano Rhodes',
    'alto sax':'saxo alto','tenor sax':'saxo tenor','slide guitar':'slide guitar','trombone':'trombón','trumpet':'trompeta',
    'steel string guitar':'guitarra de acero','nylon string guitar':'guitarra de nailon','solo violin':'violín solo',
    'analog bass':'bajo analógico','808 drums':'batería 808','punchy electronic drums':'batería electrónica punchy',
    'LinnDrum machine':'LinnDrum','FM bells':'FM bells','high lead':'lead agudo','mellotron':'mellotron',
    'atmospheric pad':'pad atmosférico','vintage synthesizer':'sintetizador vintage','sub-bass':'sub-bajo',
    'Moog analog synth':'synth Moog','arpeggiator synth':'synth arpegiador','modular synth':'synth modular','theremin':'theremin',
    'busy café':'café concurrido','heavy rain':'lluvia fuerte','distant city':'ciudad a lo lejos',
    'crackling fire':'crepitar de fuego','crickets at night':'grillos','passing subway':'metro pasando',
    'ocean waves':'olas','birds singing':'pájaros','distant thunder':'trueno lejano','wind in trees':'viento en árboles',
    'lo-fi bitcrusher':'bitcrusher','cassette tape hiss':'ruido de casete','analog delay':'delay analógico',
    'warm distortion':'distorsión cálida','digital glitches':'glitches','reversed loop':'loop invertido',
    'radio static':'estática','hall reverb':'reverb','old film samples':'samples antiguos','vinyl crackle':'crujido de vinilo' },
  fr: { 'accordion':'accordéon','harp':'harpe','slap bass':'basse slap','dry acoustic drums':'batterie acoustique sèche',
    'brushed drums':'batterie balais','cello':'violoncelle','clarinet':'clarinette','upright bass':'contrebasse',
    'orchestral strings':'cordes orchestrales','transverse flute':'flûte','harmonica':'harmonica',
    'fuzz guitar':'guitare fuzz','clean guitar':'guitare clean','acoustic piano':'piano acoustique','Rhodes piano':'piano Rhodes',
    'alto sax':'sax alto','tenor sax':'sax ténor','slide guitar':'slide guitar','trombone':'trombone','trumpet':'trompette',
    'steel string guitar':'guitare cordes acier','nylon string guitar':'guitare classique','solo violin':'violon solo',
    'analog bass':'basse analogique','808 drums':'batterie 808','punchy electronic drums':'batterie électronique',
    'LinnDrum machine':'LinnDrum','FM bells':'cloches FM','high lead':'lead aigu','mellotron':'mellotron',
    'atmospheric pad':'nappe','vintage synthesizer':'synthé vintage','sub-bass':'sub-bass',
    'Moog analog synth':'synthé Moog','arpeggiator synth':'arpégiateur','modular synth':'synthé modulaire','theremin':'thérémine',
    'busy café':'café animé','heavy rain':'pluie battante','distant city':'ville au loin',
    'crackling fire':'feu','crickets at night':'grillons','passing subway':'métro',
    'ocean waves':'vagues','birds singing':'oiseaux','distant thunder':'tonnerre','wind in trees':'vent',
    'lo-fi bitcrusher':'bitcrusher','cassette tape hiss':'souffle cassette','analog delay':'delay',
    'warm distortion':'distorsion','digital glitches':'glitches','reversed loop':'boucle inversée',
    'radio static':'parasites','hall reverb':'réverb','old film samples':'samples vieux films','vinyl crackle':'craquement vinyle' },
};

const VOZES_CATS_KEYS = {
  female: ['female pop diva','female ethereal high','female soulful belt','female operatic soprano',
    'female smoky jazz','female breathy intimate','female folk storyteller','female aggressive scream'],
  male: ['male intimate baritone','male raspy bar','male emotional falsetto','male folk storyteller',
    'male cadenced rap flow','male crooner','male aggressive scream','male spoken word'],
  hybrid: ['male-female duet','three-part harmonies','gospel choir','crystal auto-tune',
    'robotic vocoder','reverb whispers','melodic chant','distorted lo-fi vocals',
    'angelic child voice','no vocals (instrumental)'],
};

// Single source of truth — flattened from the categorized list above.
const VOZES_KEYS = [
  ...VOZES_CATS_KEYS.female,
  ...VOZES_CATS_KEYS.male,
  ...VOZES_CATS_KEYS.hybrid,
];

// Legacy keys from older versions of the UI map to the nearest new
// categorized key, so saved favorites / cached AI fills with old keys
// still resolve to a valid selection. Ambiguous gender-less keys
// (aggressive scream, folk storyteller) default to male.
const VOZES_LEGACY_MAP = {
  'ethereal high female voice': 'female ethereal high',
  'deep intimate male voice':   'male intimate baritone',
  'breathy intimate vocals':    'female breathy intimate',
  'soulful belt':               'female soulful belt',
  'operatic soprano':           'female operatic soprano',
  'smoky jazz vocals':          'female smoky jazz',
  'cadenced rap flow':          'male cadenced rap flow',
  'emotional falsetto':         'male emotional falsetto',
  'raspy bar voice':            'male raspy bar',
  'aggressive scream':          'male aggressive scream',
  'folk storyteller':           'male folk storyteller',
  'spoken word':                'male spoken word',
};

function migrateVozesArray(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const k of arr) {
    const mapped = VOZES_LEGACY_MAP[k] || k;
    if (!seen.has(mapped) && VOZES_KEYS.includes(mapped)) {
      seen.add(mapped);
      out.push(mapped);
    }
  }
  return out;
}

const VOZES_LABELS = {
  pt: {
    // categorized keys (current)
    'female pop diva':'diva pop','female ethereal high':'voz feminina etérea aguda',
    'female soulful belt':'belt soul feminino','female operatic soprano':'soprano operístico',
    'female smoky jazz':'vocal jazz fumegante','female breathy intimate':'vocal feminino sussurrado',
    'female folk storyteller':'contadora folk','female aggressive scream':'scream agressivo feminino',
    'male intimate baritone':'barítono íntimo','male raspy bar':'voz rouca de bar',
    'male emotional falsetto':'falsete masculino emocionado','male folk storyteller':'contador folk',
    'male cadenced rap flow':'rap cadenciado','male crooner':'crooner',
    'male aggressive scream':'scream agressivo masculino','male spoken word':'spoken word masculino',
    'male-female duet':'dueto masculino e feminino','three-part harmonies':'harmonias em três vozes',
    'gospel choir':'coro gospel','crystal auto-tune':'auto-tune cristalino',
    'robotic vocoder':'vocoder robótico','reverb whispers':'sussurros com reverb',
    'melodic chant':'cântico melódico','distorted lo-fi vocals':'vocal lo-fi distorcido',
    'angelic child voice':'voz infantil angelical','no vocals (instrumental)':'sem vocais',
    // legacy keys (fallback for any stored data not yet migrated)
    'ethereal high female voice':'voz feminina etérea','deep intimate male voice':'voz masculina grave',
    'breathy intimate vocals':'vocal sussurrado íntimo','soulful belt':'belt soul',
    'operatic soprano':'soprano operístico','smoky jazz vocals':'vocal jazz fumegante',
    'cadenced rap flow':'rap cadenciado','emotional falsetto':'falsete emocionado',
    'raspy bar voice':'voz rouca de bar','aggressive scream':'scream agressivo',
    'folk storyteller':'contador folk','spoken word':'spoken word',
  },
  es: {
    // categorized keys (current)
    'female pop diva':'diva pop','female ethereal high':'voz femenina etérea aguda',
    'female soulful belt':'belt soul femenino','female operatic soprano':'soprano operístico',
    'female smoky jazz':'voz jazz humeante','female breathy intimate':'voz femenina susurrada',
    'female folk storyteller':'narradora folk','female aggressive scream':'grito agresivo femenino',
    'male intimate baritone':'barítono íntimo','male raspy bar':'voz masculina ronca',
    'male emotional falsetto':'falsete masculino emotivo','male folk storyteller':'narrador folk',
    'male cadenced rap flow':'flow rap masculino','male crooner':'crooner',
    'male aggressive scream':'grito agresivo masculino','male spoken word':'palabra hablada masculina',
    'male-female duet':'dúo','three-part harmonies':'armonías a tres voces',
    'gospel choir':'coro gospel','crystal auto-tune':'auto-tune cristalino',
    'robotic vocoder':'vocoder','reverb whispers':'susurros',
    'melodic chant':'cántico melódico','distorted lo-fi vocals':'voz lo-fi distorsionada',
    'angelic child voice':'voz infantil','no vocals (instrumental)':'sin voces',
    // legacy keys (fallback)
    'ethereal high female voice':'voz femenina etérea','deep intimate male voice':'voz masculina grave',
    'breathy intimate vocals':'voz susurrada íntima','soulful belt':'belt soul',
    'operatic soprano':'soprano operístico','smoky jazz vocals':'voz jazz humeante',
    'cadenced rap flow':'flow rap','emotional falsetto':'falsete emotivo',
    'raspy bar voice':'voz ronca','aggressive scream':'grito agresivo',
    'folk storyteller':'narrador folk','spoken word':'palabra hablada',
  },
  fr: {
    // categorized keys (current)
    'female pop diva':'diva pop','female ethereal high':'voix féminine éthérée aiguë',
    'female soulful belt':'belt soul féminin','female operatic soprano':'soprano opératique',
    'female smoky jazz':'voix jazz fumée','female breathy intimate':'voix féminine soufflée',
    'female folk storyteller':'conteuse folk','female aggressive scream':'cri agressif féminin',
    'male intimate baritone':'baryton intime','male raspy bar':'voix masculine éraillée',
    'male emotional falsetto':'fausset masculin émotionnel','male folk storyteller':'conteur folk',
    'male cadenced rap flow':'flow rap masculin','male crooner':'crooner',
    'male aggressive scream':'cri agressif masculin','male spoken word':'parole parlée masculine',
    'male-female duet':'duo','three-part harmonies':'harmonies à trois voix',
    'gospel choir':'chœur gospel','crystal auto-tune':'auto-tune cristallin',
    'robotic vocoder':'vocodeur','reverb whispers':'chuchotements',
    'melodic chant':'chant mélodique','distorted lo-fi vocals':'voix lo-fi distordue',
    'angelic child voice':'voix enfantine','no vocals (instrumental)':'sans voix',
    // legacy keys (fallback)
    'ethereal high female voice':'voix féminine éthérée','deep intimate male voice':'voix masculine grave',
    'breathy intimate vocals':'voix soufflée intime','soulful belt':'belt soul',
    'operatic soprano':'soprano opératique','smoky jazz vocals':'voix jazz fumée',
    'cadenced rap flow':'flow rap','emotional falsetto':'fausset émotionnel',
    'raspy bar voice':'voix éraillée','aggressive scream':'cri agressif',
    'folk storyteller':'conteur folk','spoken word':'parole parlée',
  },
};

const ERAS_KEYS = ['psychedelic 60s','warm analog 70s','synthesized 80s','dirty lo-fi 90s','digital 2000s',
  'contemporary 2020s','timeless','retrofuturistic','22nd century dystopia'];

const ERAS_LABELS = {
  pt: { 'psychedelic 60s':'anos 60 psicodélicos','warm analog 70s':'anos 70 analógicos','synthesized 80s':'anos 80 sintetizados',
    'dirty lo-fi 90s':'anos 90 lo-fi sujos','digital 2000s':'anos 2000 digitais','contemporary 2020s':'contemporâneo 2020s',
    'timeless':'atemporal','retrofuturistic':'retrofuturista','22nd century dystopia':'século XXII distópico' },
  es: { 'psychedelic 60s':'años 60 psicodélicos','warm analog 70s':'años 70 analógicos','synthesized 80s':'años 80 sintetizados',
    'dirty lo-fi 90s':'años 90 lo-fi','digital 2000s':'años 2000 digitales','contemporary 2020s':'contemporáneo 2020s',
    'timeless':'atemporal','retrofuturistic':'retrofuturista','22nd century dystopia':'siglo XXII distópico' },
  fr: { 'psychedelic 60s':'années 60 psychédéliques','warm analog 70s':'années 70 analogiques','synthesized 80s':'années 80 synthétisées',
    'dirty lo-fi 90s':'années 90 lo-fi','digital 2000s':'années 2000 numériques','contemporary 2020s':'contemporain 2020',
    'timeless':'intemporel','retrofuturistic':'rétrofuturiste','22nd century dystopia':'dystopie du XXIIe' },
};

const PRODUCOES_KEYS = ['cinematic wide','cathedral reverb space','recorded on a porch','pristine hi-fi',
  'lo-fi cassette tape','mastered for vinyl','dry minimalist','shoegaze wall of sound','punchy compressed',
  'raw live in studio','dirty and distorted'];

const PROD_LABELS = {
  pt: { 'cinematic wide':'cinematográfico wide','cathedral reverb space':'reverb catedral','recorded on a porch':'gravado numa varanda',
    'pristine hi-fi':'hi-fi pristino','lo-fi cassette tape':'lo-fi cassete','mastered for vinyl':'masterizado pra vinil',
    'dry minimalist':'minimalista seco','shoegaze wall of sound':'parede de som shoegaze','punchy compressed':'punchy compresso',
    'raw live in studio':'raw ao vivo','dirty and distorted':'sujo e distorcido' },
  es: { 'cinematic wide':'cinematográfico amplio','cathedral reverb space':'reverb catedral','recorded on a porch':'grabado en porche',
    'pristine hi-fi':'hi-fi prístino','lo-fi cassette tape':'lo-fi casete','mastered for vinyl':'masterizado para vinilo',
    'dry minimalist':'minimalista seco','shoegaze wall of sound':'muro shoegaze','punchy compressed':'punchy comprimido',
    'raw live in studio':'en vivo crudo','dirty and distorted':'sucio y distorsionado' },
  fr: { 'cinematic wide':'cinématographique','cathedral reverb space':'reverb cathédrale','recorded on a porch':'enregistré sous porche',
    'pristine hi-fi':'hi-fi cristallin','lo-fi cassette tape':'lo-fi cassette','mastered for vinyl':'masterisé vinyle',
    'dry minimalist':'minimaliste sec','shoegaze wall of sound':'mur shoegaze','punchy compressed':'punchy compressé',
    'raw live in studio':'live brut','dirty and distorted':'sale et distordu' },
};

const VOZES_CAT_LABELS = {
  en: { female: 'Female voices', male: 'Male voices', hybrid: 'Hybrid · neutral · special' },
  pt: { female: 'Vozes femininas', male: 'Vozes masculinas', hybrid: 'Hibridas · neutras · especiais' },
  es: { female: 'Voces femeninas', male: 'Voces masculinas', hybrid: 'Hibridas · neutras · especiales' },
  fr: { female: 'Voix feminines', male: 'Voix masculines', hybrid: 'Hybrides · neutres · speciales' },
};

const TEMPOS_KEYS = [
  { key: 'dragged', bpm: '60-80 BPM' }, { key: 'medium', bpm: '90-110 BPM' },
  { key: 'groove', bpm: '110-130 BPM' }, { key: 'fast', bpm: '130-150 BPM' },
  { key: 'frantic', bpm: '150-180 BPM' },
];

const DURACOES_KEYS = ['duration_teaser','duration_short','duration_mid','duration_std','duration_long','duration_extended'];
const DURATION_EN = {
  duration_teaser:'~30 seconds (teaser)', duration_short:'~1 minute (short)', duration_mid:'~2 minutes (mid)',
  duration_std:'~3 minutes (pop standard)', duration_long:'~4 minutes (long)', duration_extended:'5+ minutes (extended)',
};

const IDIOMAS_KEYS = [
  'Brazilian Portuguese','English','Spanish','French','Italian','German',
  'Japanese','Korean','Mandarin Chinese','Cantonese','Hindi','Arabic',
  'Russian','Hebrew','Turkish','Greek','Polish','Dutch',
  'Swedish','Indonesian','Thai','Vietnamese','Tagalog','Swahili',
  'instrumental'
];
const IDIOMA_LABELS = {
  pt: {
    'Brazilian Portuguese':'português brasileiro','English':'inglês','Spanish':'espanhol','French':'francês',
    'Italian':'italiano','German':'alemão','Japanese':'japonês','Korean':'coreano',
    'Mandarin Chinese':'mandarim','Cantonese':'cantonês','Hindi':'híndi','Arabic':'árabe',
    'Russian':'russo','Hebrew':'hebraico','Turkish':'turco','Greek':'grego',
    'Polish':'polonês','Dutch':'holandês','Swedish':'sueco','Indonesian':'indonésio',
    'Thai':'tailandês','Vietnamese':'vietnamita','Tagalog':'tagalo','Swahili':'suaíli',
    'instrumental':'instrumental'
  },
  es: {
    'Brazilian Portuguese':'portugués brasileño','English':'inglés','Spanish':'español','French':'francés',
    'Italian':'italiano','German':'alemán','Japanese':'japonés','Korean':'coreano',
    'Mandarin Chinese':'mandarín','Cantonese':'cantonés','Hindi':'hindi','Arabic':'árabe',
    'Russian':'ruso','Hebrew':'hebreo','Turkish':'turco','Greek':'griego',
    'Polish':'polaco','Dutch':'neerlandés','Swedish':'sueco','Indonesian':'indonesio',
    'Thai':'tailandés','Vietnamese':'vietnamita','Tagalog':'tagalo','Swahili':'suajili',
    'instrumental':'instrumental'
  },
  fr: {
    'Brazilian Portuguese':'portugais brésilien','English':'anglais','Spanish':'espagnol','French':'français',
    'Italian':'italien','German':'allemand','Japanese':'japonais','Korean':'coréen',
    'Mandarin Chinese':'mandarin','Cantonese':'cantonais','Hindi':'hindi','Arabic':'arabe',
    'Russian':'russe','Hebrew':'hébreu','Turkish':'turc','Greek':'grec',
    'Polish':'polonais','Dutch':'néerlandais','Swedish':'suédois','Indonesian':'indonésien',
    'Thai':'thaï','Vietnamese':'vietnamien','Tagalog':'tagalog','Swahili':'swahili',
    'instrumental':'instrumental'
  },
};

const ESTRUTURAS_KEYS = [
  'AABA (jazz form)', 'intro / verse / chorus / verse / chorus / outro', 'hypnotic loop with variations',
  'chorus first / verses after', 'verses only (continuous narrative)', 'verse / pre-chorus / chorus (repeat)',
  'verse / chorus / verse / chorus / bridge / chorus',
];
const ESTR_LABELS = {
  pt: { 'AABA (jazz form)':'AABA (formato jazz)','intro / verse / chorus / verse / chorus / outro':'intro / verso / refrão / verso / refrão / outro',
    'hypnotic loop with variations':'loop hipnótico com variações','chorus first / verses after':'refrão primeiro / versos depois',
    'verses only (continuous narrative)':'só versos (narrativa)','verse / pre-chorus / chorus (repeat)':'verso / pré-refrão / refrão',
    'verse / chorus / verse / chorus / bridge / chorus':'verso / refrão / verso / refrão / ponte / refrão' },
  es: { 'AABA (jazz form)':'AABA (jazz)','intro / verse / chorus / verse / chorus / outro':'intro / estrofa / estribillo / estrofa / estribillo / outro',
    'hypnotic loop with variations':'loop hipnótico','chorus first / verses after':'estribillo primero',
    'verses only (continuous narrative)':'solo estrofas','verse / pre-chorus / chorus (repeat)':'estrofa / pre-estribillo / estribillo',
    'verse / chorus / verse / chorus / bridge / chorus':'estrofa / estribillo / estrofa / estribillo / puente / estribillo' },
  fr: { 'AABA (jazz form)':'AABA (jazz)','intro / verse / chorus / verse / chorus / outro':'intro / couplet / refrain / couplet / refrain / outro',
    'hypnotic loop with variations':'boucle hypnotique','chorus first / verses after':'refrain d\'abord',
    'verses only (continuous narrative)':'couplets seuls','verse / pre-chorus / chorus (repeat)':'couplet / pré-refrain / refrain',
    'verse / chorus / verse / chorus / bridge / chorus':'couplet / refrain / couplet / refrain / pont / refrain' },
};

const PERSP_KEYS = ['collective (we)','dialogue between two voices','stream of consciousness','letter form',
  'omniscient narrator','third-person narrative','first person (I)','second person (speaking to you)'];
const PERSP_LABELS = {
  pt: { 'collective (we)':'coletivo (nós)','dialogue between two voices':'diálogo entre duas vozes',
    'stream of consciousness':'fluxo de consciência','letter form':'forma de carta','omniscient narrator':'narrador onisciente',
    'third-person narrative':'terceira pessoa','first person (I)':'primeira pessoa (eu)','second person (speaking to you)':'segunda pessoa' },
  es: { 'collective (we)':'colectivo (nosotros)','dialogue between two voices':'diálogo','stream of consciousness':'flujo de conciencia',
    'letter form':'forma de carta','omniscient narrator':'narrador omnisciente','third-person narrative':'tercera persona',
    'first person (I)':'primera persona (yo)','second person (speaking to you)':'segunda persona' },
  fr: { 'collective (we)':'collectif (nous)','dialogue between two voices':'dialogue','stream of consciousness':'flux de conscience',
    'letter form':'forme de lettre','omniscient narrator':'narrateur omniscient','third-person narrative':'troisième personne',
    'first person (I)':'première personne (je)','second person (speaking to you)':'deuxième personne' },
};

const RIMAS_KEYS = ['alternating rhyme ABAB','near rhyme / assonance','paired rhyme AABB',
  'internal rhyme mid-verse','rhyme only in chorus','no rhyme (free verse)'];
const RIMAS_LABELS = {
  pt: { 'alternating rhyme ABAB':'rima alternada ABAB','near rhyme / assonance':'rima toante','paired rhyme AABB':'rima emparelhada AABB',
    'internal rhyme mid-verse':'rima interna','rhyme only in chorus':'rima só no refrão','no rhyme (free verse)':'sem rima' },
  es: { 'alternating rhyme ABAB':'rima alterna ABAB','near rhyme / assonance':'rima asonante','paired rhyme AABB':'rima pareada AABB',
    'internal rhyme mid-verse':'rima interna','rhyme only in chorus':'rima solo estribillo','no rhyme (free verse)':'sin rima' },
  fr: { 'alternating rhyme ABAB':'rime alternée ABAB','near rhyme / assonance':'rime assonante','paired rhyme AABB':'rime plate AABB',
    'internal rhyme mid-verse':'rime interne','rhyme only in chorus':'rime au refrain','no rhyme (free verse)':'sans rime' },
};

const METRICAS_KEYS = ['short direct verses (up to 8 syllables)','balanced medium verses (8-12 syllables)',
  'long narrative verses (12+ syllables)','varied meter (short in chorus, long in verses)'];
const METR_LABELS = {
  pt: { 'short direct verses (up to 8 syllables)':'versos curtos (até 8 sílabas)',
    'balanced medium verses (8-12 syllables)':'versos médios (8-12 sílabas)',
    'long narrative verses (12+ syllables)':'versos longos (12+ sílabas)',
    'varied meter (short in chorus, long in verses)':'métrica variada' },
  es: { 'short direct verses (up to 8 syllables)':'versos cortos (8 sílabas)',
    'balanced medium verses (8-12 syllables)':'versos medios (8-12 sílabas)',
    'long narrative verses (12+ syllables)':'versos largos (12+ sílabas)',
    'varied meter (short in chorus, long in verses)':'métrica variada' },
  fr: { 'short direct verses (up to 8 syllables)':'vers courts (8 syllabes)',
    'balanced medium verses (8-12 syllables)':'vers moyens (8-12 syllabes)',
    'long narrative verses (12+ syllables)':'vers longs (12+ syllabes)',
    'varied meter (short in chorus, long in verses)':'métrique variée' },
};

// Quick-start presets — combinations of selections that work well together.
// Organized by category so we can render a categorized picker.
// Each preset is curated to use only vocab keys that exist in the app.
const PRESETS = [
  // ─── CINEMATIC & ATMOSPHERIC ───
  { id: 'lofi-sunset', label: 'Lo-fi Sunset', icon: '🌅', category: 'cinematic',
    generos: ['lo-fi hip hop', 'downtempo'], moods: ['contemplative', 'nostalgic'],
    instrumentos: ['rhodes piano', 'jazz drums', 'soft bass'], vozes: [],
    eras: ['analog 70s'], producoes: ['cassette warmth'], tempos: ['slow'] },
  { id: 'noir-thriller', label: 'Noir Thriller', icon: '🎬', category: 'cinematic',
    generos: ['cinematic orchestral', 'trip-hop'], moods: ['tense', 'dark'],
    instrumentos: ['upright bass', 'muted trumpet', 'brushed drums'], vozes: [],
    eras: [], producoes: ['cathedral reverb'], tempos: ['slow'] },
  { id: 'cosmic-ambient', label: 'Cosmic Ambient', icon: '🌌', category: 'cinematic',
    generos: ['ambient', 'dream pop'], moods: ['ethereal', 'serene'],
    instrumentos: ['analog synthesizer', 'soft pads'], vozes: ['reverb whispers'],
    eras: [], producoes: ['cathedral reverb'], tempos: ['slow'] },
  { id: 'post-rock', label: 'Post-Rock Anthem', icon: '🎸', category: 'cinematic',
    generos: ['post-rock', 'shoegaze'], moods: ['contemplative', 'hopeful'],
    instrumentos: ['electric guitar', 'crashing drums', 'bass guitar'], vozes: [],
    eras: [], producoes: ['wall of sound'], tempos: ['medium'] },
  { id: 'jazz-cafe', label: 'Jazz Café', icon: '☕', category: 'cinematic',
    generos: ['jazz fusion', 'soul jazz'], moods: ['serene', 'romantic'],
    instrumentos: ['upright bass', 'jazz drums', 'rhodes piano'], vozes: [],
    eras: ['analog 60s'], producoes: ['live room ambience'], tempos: ['medium'] },

  // ─── BRAZILIAN ───
  { id: 'brazilian-soul', label: 'Brazilian Soul', icon: '🌴', category: 'brazilian',
    generos: ['bossa nova', 'samba jazz', 'MPB'], moods: ['romantic', 'serene'],
    instrumentos: ['nylon-string guitar', 'acoustic piano'], vozes: ['male emotional falsetto'],
    eras: ['analog 70s'], producoes: [], tempos: ['medium'] },
  { id: 'trap-brasil', label: 'Trap Brasil', icon: '🔥', category: 'brazilian',
    generos: ['trap', 'funk carioca'], moods: ['aggressive', 'urgent'],
    instrumentos: ['808 sub bass', 'hi-hat rolls', 'synth lead'], vozes: [],
    eras: [], producoes: ['heavy auto-tune'], tempos: ['driving'] },
  { id: 'samba-bar', label: 'Samba Bar', icon: '🥁', category: 'brazilian',
    generos: ['samba', 'pagode'], moods: ['festive', 'liberating'],
    instrumentos: ['cavaquinho', 'pandeiro', 'surdo drum'], vozes: ['three-part harmonies'],
    eras: [], producoes: ['live room ambience'], tempos: ['medium'] },
  { id: 'mpb-acoustic', label: 'MPB Acoustic', icon: '🎶', category: 'brazilian',
    generos: ['MPB', 'bossa nova'], moods: ['contemplative', 'romantic'],
    instrumentos: ['acoustic guitar', 'flute'], vozes: ['male emotional falsetto'],
    eras: ['analog 70s'], producoes: ['intimate room sound'], tempos: ['slow'] },
  { id: 'sertanejo-pop', label: 'Sertanejo Pop', icon: '🤠', category: 'brazilian',
    generos: ['country pop', 'pop'], moods: ['romantic', 'liberating'],
    instrumentos: ['acoustic guitar', 'sanfona', 'modern drums'], vozes: [],
    eras: [], producoes: ['polished pop production'], tempos: ['medium'] },

  // ─── ELECTRONIC ───
  { id: 'synthwave-drive', label: 'Synthwave Drive', icon: '🚗', category: 'electronic',
    generos: ['synthwave', 'italo-disco'], moods: ['nostalgic', 'urgent'],
    instrumentos: ['analog synthesizer', 'drum machine'], vozes: [],
    eras: ['neon 80s'], producoes: ['gated reverb drums'], tempos: ['driving'] },
  { id: 'deep-house', label: 'Deep House', icon: '🏠', category: 'electronic',
    generos: ['deep house', 'tech house'], moods: ['hypnotic', 'liberating'],
    instrumentos: ['analog synthesizer', '808 sub bass', 'drum machine'], vozes: [],
    eras: [], producoes: ['club mix'], tempos: ['driving'] },
  { id: 'dnb', label: 'Drum & Bass', icon: '⚡', category: 'electronic',
    generos: ['drum and bass', 'jungle'], moods: ['urgent', 'euphoric'],
    instrumentos: ['808 sub bass', 'breakbeat drums'], vozes: [],
    eras: [], producoes: ['club mix'], tempos: ['frantic'] },
  { id: 'techno-warehouse', label: 'Techno Warehouse', icon: '🏭', category: 'electronic',
    generos: ['detroit techno', 'minimal techno'], moods: ['hypnotic', 'tense'],
    instrumentos: ['analog synthesizer', 'drum machine'], vozes: [],
    eras: [], producoes: ['warehouse reverb'], tempos: ['driving'] },
  { id: 'chillwave', label: 'Chillwave', icon: '🌊', category: 'electronic',
    generos: ['chillwave', 'dream pop'], moods: ['nostalgic', 'dreamlike'],
    instrumentos: ['analog synthesizer', 'soft pads', 'drum machine'], vozes: ['reverb whispers'],
    eras: ['neon 80s'], producoes: ['cassette warmth'], tempos: ['medium'] },

  // ─── ACOUSTIC & FOLK ───
  { id: 'indie-folk', label: 'Indie Folk', icon: '🍂', category: 'acoustic',
    generos: ['indie folk', 'americana'], moods: ['melancholic', 'contemplative'],
    instrumentos: ['acoustic guitar', 'banjo', 'fiddle'], vozes: ['three-part harmonies'],
    eras: [], producoes: ['intimate room sound'], tempos: ['slow'] },
  { id: 'americana', label: 'Americana', icon: '🌾', category: 'acoustic',
    generos: ['americana', 'country folk'], moods: ['contemplative', 'hopeful'],
    instrumentos: ['acoustic guitar', 'pedal steel', 'upright bass'], vozes: ['three-part harmonies'],
    eras: [], producoes: ['analog tape'], tempos: ['medium'] },
  { id: 'singer-songwriter', label: 'Singer-Songwriter', icon: '🎤', category: 'acoustic',
    generos: ['indie folk', 'singer-songwriter'], moods: ['melancholic', 'contemplative'],
    instrumentos: ['acoustic guitar', 'piano'], vozes: ['male emotional falsetto'],
    eras: [], producoes: ['intimate room sound'], tempos: ['slow'] },
  { id: 'celtic-folk', label: 'Celtic Folk', icon: '🍀', category: 'acoustic',
    generos: ['celtic', 'folk'], moods: ['hopeful', 'liberating'],
    instrumentos: ['fiddle', 'tin whistle', 'bodhrán'], vozes: ['three-part harmonies'],
    eras: [], producoes: ['live room ambience'], tempos: ['medium'] },

  // ─── URBAN & POP ───
  { id: 'neo-soul', label: 'Neo-Soul', icon: '💜', category: 'urban',
    generos: ['neo-soul', 'r&b'], moods: ['romantic', 'sensual'],
    instrumentos: ['rhodes piano', 'soft bass', 'jazz drums'], vozes: ['male emotional falsetto'],
    eras: [], producoes: ['warm analog'], tempos: ['medium'] },
  { id: 'rb-slow', label: 'R&B Slow Jam', icon: '🌙', category: 'urban',
    generos: ['r&b', 'contemporary r&b'], moods: ['sensual', 'romantic'],
    instrumentos: ['analog synthesizer', '808 sub bass'], vozes: ['male emotional falsetto'],
    eras: [], producoes: ['polished pop production'], tempos: ['slow'] },
  { id: 'boom-bap', label: 'Hip-Hop Boom-Bap', icon: '🎧', category: 'urban',
    generos: ['boom bap', 'hip hop'], moods: ['contemplative', 'aggressive'],
    instrumentos: ['sampled drums', 'jazz piano sample', '808 sub bass'], vozes: [],
    eras: ['analog 90s'], producoes: ['vinyl crackle'], tempos: ['medium'] },
  { id: 'drill', label: 'Drill', icon: '🌐', category: 'urban',
    generos: ['drill', 'trap'], moods: ['aggressive', 'tense'],
    instrumentos: ['808 sub bass', 'hi-hat rolls', 'sliding bass'], vozes: [],
    eras: [], producoes: ['dark mix'], tempos: ['driving'] },
  { id: 'pop-anthem', label: 'Pop Anthem', icon: '✨', category: 'urban',
    generos: ['pop', 'electropop'], moods: ['euphoric', 'liberating'],
    instrumentos: ['analog synthesizer', 'modern drums', 'electric guitar'], vozes: [],
    eras: [], producoes: ['polished pop production'], tempos: ['driving'] },
];

// Featured presets shown inline on the main view (most universal vibes)
const FEATURED_PRESET_IDS = ['lofi-sunset', 'brazilian-soul', 'synthwave-drive', 'indie-folk'];

// Categories with display labels per language
const PRESET_CATEGORIES = {
  cinematic: { en: 'Cinematic', pt: 'Cinemático', es: 'Cinemático', fr: 'Cinématographique' },
  brazilian: { en: 'Brazilian', pt: 'Brasileiro', es: 'Brasileño', fr: 'Brésilien' },
  electronic: { en: 'Electronic', pt: 'Eletrônico', es: 'Electrónico', fr: 'Électronique' },
  acoustic: { en: 'Acoustic & Folk', pt: 'Acústico & Folk', es: 'Acústico & Folk', fr: 'Acoustique & Folk' },
  urban: { en: 'Urban & Pop', pt: 'Urbano & Pop', es: 'Urbano & Pop', fr: 'Urbain & Pop' },
};

// ─── ADVANCED VOCABULARY ─────────────────────────────────────────
const DRUM_MACHINES_KEYS = ['TR-808','TR-909','TR-707','LinnDrum','SP-1200','MPC-60','MPC-2000','DMX','CR-78','Drumtraks','Simmons SDS-V','Alesis HR-16'];
const DRUM_MACHINES_HINTS = {
  en: { 'TR-808':'hip-hop / trap / R&B — booming sub-bass kick', 'TR-909':'house / techno — punchy snappy kick', 'TR-707':'80s pop — clean digital drums', 'LinnDrum':'80s pop — tight realistic samples', 'SP-1200':'90s boom-bap — gritty sampled drums', 'MPC-60':'classic hip-hop — Akai swing groove', 'MPC-2000':'90s/00s rap — sharper digital MPC', 'DMX':'early 80s hip-hop — Oberheim crunch', 'CR-78':'late 70s — soft analog rhythms', 'Drumtraks':'80s synth-pop — Sequential Circuits', 'Simmons SDS-V':'80s rock — electronic toms', 'Alesis HR-16':'late 80s — DIY home studio' },
  pt: { 'TR-808':'hip-hop / trap / R&B — kick subgrave estourado', 'TR-909':'house / techno — kick estaladinho', 'TR-707':'pop dos 80s — bateria digital limpa', 'LinnDrum':'pop dos 80s — samples realistas', 'SP-1200':'boom-bap dos 90s — bateria suja sampleada', 'MPC-60':'hip-hop clássico — swing Akai', 'MPC-2000':'rap 90s/00s — MPC mais nítido', 'DMX':'hip-hop início dos 80s — Oberheim seco', 'CR-78':'fim dos 70s — ritmos analógicos suaves', 'Drumtraks':'synth-pop 80s — Sequential Circuits', 'Simmons SDS-V':'rock 80s — toms eletrônicos', 'Alesis HR-16':'fim dos 80s — estúdio caseiro' },
  es: { 'TR-808':'hip-hop / trap / R&B — kick sub-grave', 'TR-909':'house / techno — kick contundente', 'TR-707':'pop 80s — batería digital limpia', 'LinnDrum':'pop 80s — samples realistas', 'SP-1200':'boom-bap 90s — batería sucia', 'MPC-60':'hip-hop clásico — swing Akai', 'MPC-2000':'rap 90s/00s — MPC más nítida', 'DMX':'hip-hop inicio 80s — Oberheim', 'CR-78':'finales 70s — ritmos analógicos', 'Drumtraks':'synth-pop 80s — Sequential', 'Simmons SDS-V':'rock 80s — toms electrónicos', 'Alesis HR-16':'finales 80s — estudio casero' },
  fr: { 'TR-808':'hip-hop / trap / R&B — kick sub-bass', 'TR-909':'house / techno — kick percutant', 'TR-707':'pop 80s — batterie numérique propre', 'LinnDrum':'pop 80s — samples réalistes', 'SP-1200':'boom-bap 90s — batterie sale', 'MPC-60':'hip-hop classique — swing Akai', 'MPC-2000':'rap 90s/00s — MPC plus nette', 'DMX':'hip-hop début 80s — Oberheim', 'CR-78':'fin 70s — rythmes analogiques', 'Drumtraks':'synth-pop 80s — Sequential', 'Simmons SDS-V':'rock 80s — toms électroniques', 'Alesis HR-16':'fin 80s — home studio' },
};

const SYNTHS_KEYS = ['Moog Minimoog','Moog Modular','Roland Juno-60','Roland Juno-106','Roland Jupiter-8','Yamaha DX7','Sequential Prophet-5','Korg M1','ARP 2600','Oberheim OB-X','Mellotron','Hammond B3','Rhodes Mark II','Wurlitzer 200A','Clavinet D6'];
const SYNTHS_HINTS = {
  en: { 'Moog Minimoog':'iconic fat analog bass — funk, prog, Stevie Wonder', 'Moog Modular':'cosmic sci-fi sweeps — Wendy Carlos, Tangerine Dream', 'Roland Juno-60':'lush analog pads — synthwave, dream pop', 'Roland Juno-106':'warm 80s polyphony — synth-pop, new wave', 'Roland Jupiter-8':'cinematic strings — 80s film scores', 'Yamaha DX7':'crystal FM bells — 80s pop, smooth jazz', 'Sequential Prophet-5':'analog warmth — Michael Jackson, Madonna', 'Korg M1':'late 80s digital — house piano, organ', 'ARP 2600':'experimental leads — Pete Townshend, Stevie Wonder', 'Oberheim OB-X':'huge analog brass — Van Halen, Rush', 'Mellotron':'string tape ensemble — Beatles, King Crimson, prog rock', 'Hammond B3':'soulful organ — Booker T, jazz, gospel', 'Rhodes Mark II':'electric piano warmth — soul, jazz fusion', 'Wurlitzer 200A':'bright honky electric — Ray Charles, Supertramp', 'Clavinet D6':'funky percussive keys — Stevie Wonder Superstition' },
  pt: { 'Moog Minimoog':'baixo analógico icônico — funk, prog', 'Moog Modular':'sweeps cósmicos sci-fi — Wendy Carlos', 'Roland Juno-60':'pads analógicos lush — synthwave', 'Roland Juno-106':'polifonia 80s quente — synth-pop', 'Roland Jupiter-8':'cordas cinemáticas — trilhas 80s', 'Yamaha DX7':'sinos FM cristalinos — pop 80s', 'Sequential Prophet-5':'calor analógico — Michael Jackson', 'Korg M1':'digital fim 80s — piano house', 'ARP 2600':'leads experimentais — Stevie Wonder', 'Oberheim OB-X':'metais analógicos — Van Halen', 'Mellotron':'cordas em fita — Beatles, prog rock', 'Hammond B3':'órgão soul — Booker T, jazz', 'Rhodes Mark II':'piano elétrico — soul, jazz fusion', 'Wurlitzer 200A':'elétrico brilhante — Ray Charles', 'Clavinet D6':'teclas percussivas — Stevie Wonder' },
  es: { 'Moog Minimoog':'bajo analógico icónico — funk', 'Moog Modular':'barridos cósmicos — Wendy Carlos', 'Roland Juno-60':'pads analógicos — synthwave', 'Roland Juno-106':'polifonía 80s cálida', 'Roland Jupiter-8':'cuerdas cinemáticas', 'Yamaha DX7':'campanas FM cristalinas', 'Sequential Prophet-5':'calor analógico', 'Korg M1':'digital finales 80s', 'ARP 2600':'leads experimentales', 'Oberheim OB-X':'bronces analógicos', 'Mellotron':'cuerdas en cinta — Beatles', 'Hammond B3':'órgano soul, jazz', 'Rhodes Mark II':'piano eléctrico soul', 'Wurlitzer 200A':'eléctrico brillante', 'Clavinet D6':'teclas percusivas funk' },
  fr: { 'Moog Minimoog':'basse analogique iconique — funk', 'Moog Modular':'balayages cosmiques — Wendy Carlos', 'Roland Juno-60':'pads analogiques — synthwave', 'Roland Juno-106':'polyphonie 80s chaleureuse', 'Roland Jupiter-8':'cordes cinématiques', 'Yamaha DX7':'cloches FM cristallines', 'Sequential Prophet-5':'chaleur analogique', 'Korg M1':'numérique fin 80s', 'ARP 2600':'leads expérimentaux', 'Oberheim OB-X':'cuivres analogiques', 'Mellotron':'cordes sur bande — Beatles', 'Hammond B3':'orgue soul, jazz', 'Rhodes Mark II':'piano électrique soul', 'Wurlitzer 200A':'électrique brillant', 'Clavinet D6':'touches percussives funk' },
};

const MICS_KEYS = ['Shure SM7B','Neumann U87','Neumann U47','Sennheiser MD421','AKG C414','Royer R-121 ribbon','Coles 4038 ribbon','RCA 44 vintage ribbon','Shure SM57 close-mic','condenser pair stereo','lo-fi room mic','cassette dictaphone'];
const MICS_HINTS = {
  en: { 'Shure SM7B':'intimate radio voice — podcast / Michael Jackson Thriller', 'Neumann U87':'studio standard — pop vocals, jazz', 'Neumann U47':'warm vintage — Sinatra, Beatles', 'Sennheiser MD421':'punchy drums and amps — rock', 'AKG C414':'detailed acoustic — guitars, piano', 'Royer R-121 ribbon':'smooth guitar amps — vintage warmth', 'Coles 4038 ribbon':'BBC drum overheads — jazz, orchestra', 'RCA 44 vintage ribbon':'40s/50s broadcast vibe', 'Shure SM57 close-mic':'tight snare and amp — live energy', 'condenser pair stereo':'wide capture — choir, room ambience', 'lo-fi room mic':'distant, washy — bedroom record vibe', 'cassette dictaphone':'crushed lo-fi — found-tape aesthetic' },
  pt: { 'Shure SM7B':'voz íntima — podcast / Michael Jackson Thriller', 'Neumann U87':'padrão de estúdio — vocais pop', 'Neumann U47':'vintage quente — Sinatra, Beatles', 'Sennheiser MD421':'baterias e amps — rock', 'AKG C414':'detalhe acústico — violões, piano', 'Royer R-121 ribbon':'amps de guitarra — calor vintage', 'Coles 4038 ribbon':'overheads BBC — jazz, orquestra', 'RCA 44 vintage ribbon':'vibe rádio 40s/50s', 'Shure SM57 close-mic':'caixa colada — energia ao vivo', 'condenser pair stereo':'captura ampla — coro, ambiência', 'lo-fi room mic':'distante, lavado — quarto demo', 'cassette dictaphone':'lo-fi esmagado — fita achada' },
  es: { 'Shure SM7B':'voz íntima — podcast / Thriller', 'Neumann U87':'estándar — voces pop, jazz', 'Neumann U47':'vintage cálido — Sinatra', 'Sennheiser MD421':'baterías y amps — rock', 'AKG C414':'detalle acústico', 'Royer R-121 ribbon':'amps guitarra — calor vintage', 'Coles 4038 ribbon':'overheads BBC — jazz', 'RCA 44 vintage ribbon':'radio 40s/50s', 'Shure SM57 close-mic':'caja cercana — energía', 'condenser pair stereo':'captura amplia', 'lo-fi room mic':'distante — demo casera', 'cassette dictaphone':'lo-fi triturado' },
  fr: { 'Shure SM7B':'voix intime — podcast / Thriller', 'Neumann U87':'standard — voix pop, jazz', 'Neumann U47':'vintage chaleureux — Sinatra', 'Sennheiser MD421':'batteries et amplis — rock', 'AKG C414':'détail acoustique', 'Royer R-121 ribbon':'amplis guitare — chaleur vintage', 'Coles 4038 ribbon':'overheads BBC — jazz', 'RCA 44 vintage ribbon':'radio 40s/50s', 'Shure SM57 close-mic':'caisse proche — énergie', 'condenser pair stereo':'capture large', 'lo-fi room mic':'distant — démo maison', 'cassette dictaphone':'lo-fi écrasé' },
};

function getDrumHint(k, lang) { return DRUM_MACHINES_HINTS[lang]?.[k] || DRUM_MACHINES_HINTS.en[k] || ''; }
function getSynthHint(k, lang) { return SYNTHS_HINTS[lang]?.[k] || SYNTHS_HINTS.en[k] || ''; }
function getMicHint(k, lang) { return MICS_HINTS[lang]?.[k] || MICS_HINTS.en[k] || ''; }

// Soft caps per category — based on Suno best practices.
// Prompts with more than these tend to dilute or be ignored by Suno.
const MULTI_LIMITS = {
  generos: 3,      // Suno handles 1-2 well, 3 max for fusion
  moods: 4,        // emotional layers are more permissive
  instrumentos: 6, // arrangements naturally have multiple
  vozes: 2,        // 2 voices = duet, more is chaos
  eras: 2,         // genre + era usually suffice
  producoes: 2,    // production styles compound at 2 max
  drum_machines: 2,// drum machines blend at 2
  synths: 3,       // up to 3 vintage synths
  mics: 2,         // mic combinations are usually 1-2
};

const TAMANHOS_LETRA = [
  { id: 'micro', chars: 250,  versos: 8,  refroes: 0 },
  { id: 'curta', chars: 500,  versos: 4,  refroes: 1 },
  { id: 'media', chars: 1000, versos: 8,  refroes: 2 },
  { id: 'longa', chars: 1800, versos: 12, refroes: 3 },
  { id: 'epica', chars: 2800, versos: 16, refroes: 3 },
];

const LIMITE_PROMPT = 1000;
const LIMITE_LETRA = 3000;

// ——— Tips ———
const TIPS = {
  en: [
    { categoria: 'Suno AI versions', icone: '🎚', items: [
      'v3.5 (2024): stable, max 4 min. Good for classic experimentation.',
      'v4 (Nov 2024): vocal quality much better than v3.5. Introduced Extend, Cover and Persona.',
      'v4.5 (May 2025): max 8 min. Much better prompt adherence, expressive vocals, genre mashups work well.',
      'v4.5+ (Jul 2025): adds Add Vocals and Add Instrumental.',
      'v5 (2025): much higher audio fidelity, more natural vocals.',
      'v5.5 (Mar 2026): voice cloning, custom models, preference memory.',
      'Tip: same prompt in v4 vs v4.5 vs v5 produces very different songs. Try at least 2 versions.',
    ]},
    { categoria: 'Prompt (Style field)', icone: '✍', items: [
      'Approximate limit: 1000 characters.',
      'Be sensory and specific: "lo-fi beats with vinyl crackle and Rhodes piano in cathedral reverb" beats "chill music".',
      'DO NOT name real artists — Suno filters direct references. Describe the style instead.',
      'Use commas to separate elements.',
      'Creative combinations work great in v4.5+: "EDM + folk", "gregorian chant + trap".',
    ]},
    { categoria: 'Powerful lyrics tags', icone: '🏷', items: [
      'Structure: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Bridge], [Outro].',
      'Instrumental: [Instrumental], [Guitar Solo], [Drum Break], [Sax Solo].',
      'Vocal direction: [Whispered], [Shouted], [Spoken Word], [Falsetto].',
      'Dynamics: [Build Up], [Drop], [Silence].',
      'Backing vocals: use parentheses in the lyrics: "I miss you (miss you so)".',
      'ALWAYS use English tags — Suno does not recognize tags in other languages and will sing them as lyrics!',
    ]},
    { categoria: 'Suno modes', icone: '⚙', items: [
      'Simple: describe in natural language, Suno generates everything.',
      'Custom Mode: full control. USE THIS for best results (this tool is built for it).',
      'Instrumental toggle: same song without vocals.',
    ]},
    { categoria: 'Advanced features', icone: '🔁', items: [
      'Extend: continue a song from any second.',
      'Cover: regenerate the same lyrics in another genre.',
      'Persona (v4+): saves voice and style for reuse.',
      'Add Vocals / Add Instrumental (v4.5+).',
      'Stems (paid): export separate tracks for DAW mixing.',
    ]},
    { categoria: 'Languages', icone: '🌍', items: [
      'English is still best-interpreted.',
      'Portuguese works very well in v4+.',
      'Spanish and Japanese give good results. French is more uneven.',
    ]},
    { categoria: 'Golden tips', icone: '💎', items: [
      'Generate 3-5 versions of the same prompt — best is rarely the first.',
      'If a song came out almost perfect, use Extend or Cover instead of starting over.',
      'Shorter lyrics tend to have stronger melody.',
      'Describe the imaginary audio engineer: "mixed lo-fi cassette" changes a lot.',
      'Drums: "808 bass" vs "acoustic jazz kit" radically changes the track.',
    ]},
  ],
  pt: [
    { categoria: 'versões da IA do Suno', icone: '🎚', items: [
      'v3.5 (2024): estável, máx 4 min.',
      'v4 (nov/2024): qualidade vocal muito superior. Introduziu Extend, Cover e Persona.',
      'v4.5 (mai/2025): máx 8 min. Muito melhor aderência ao prompt, combinações de gênero funcionam.',
      'v4.5+ (jul/2025): adiciona Add Vocals e Add Instrumental.',
      'v5 (2025): fidelidade muito mais alta, vocais mais naturais.',
      'v5.5 (mar/2026): voice cloning, modelos customizados, memória de preferências.',
      'Dica: mesmo prompt em v4 vs v4.5 vs v5 produz músicas muito diferentes. Teste 2 versões.',
    ]},
    { categoria: 'prompt (campo Style)', icone: '✍', items: [
      'Limite: ~1000 caracteres.',
      'Seja sensorial: "lo-fi beats com vinyl crackle e piano Rhodes" supera "música relaxante".',
      'NÃO cite artistas reais — o Suno filtra referências diretas.',
      'Use vírgulas pra separar elementos.',
      'Combinações criativas funcionam no v4.5+.',
    ]},
    { categoria: 'marcações nas lyrics', icone: '🏷', items: [
      'Estrutura: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Bridge], [Outro].',
      'Instrumental: [Instrumental], [Guitar Solo], [Drum Break].',
      'Direção vocal: [Whispered], [Shouted], [Falsetto].',
      'Dinâmica: [Build Up], [Drop], [Silence].',
      'Backing vocals: parênteses na letra: "Sinto falta (falta de você)".',
      'SEMPRE use tags em inglês — o Suno não reconhece tags em português e canta elas como letra!',
    ]},
    { categoria: 'modos do Suno', icone: '⚙', items: [
      'Simple: descreve em linguagem natural, Suno gera tudo.',
      'Custom Mode: controle total. USE ESTE pro melhor resultado.',
      'Instrumental toggle: mesma música sem vocais.',
    ]},
    { categoria: 'features avançadas', icone: '🔁', items: [
      'Extend: continua música a partir de qualquer segundo.',
      'Cover: regera a letra em outro gênero.',
      'Persona (v4+): salva voz e estilo pra reusar.',
      'Add Vocals / Add Instrumental (v4.5+).',
      'Stems (pagos): exporta faixas separadas pra DAW.',
    ]},
    { categoria: 'idiomas', icone: '🌍', items: [
      'Inglês ainda é o melhor interpretado.',
      'Português funciona muito bem no v4+.',
      'Espanhol e japonês dão bons resultados. Francês é mais irregular.',
    ]},
    { categoria: 'dicas de ouro', icone: '💎', items: [
      'Gere 3-5 versões do mesmo prompt — a melhor quase nunca é a primeira.',
      'Se saiu quase perfeito, use Extend ou Cover em vez de começar do zero.',
      'Letras curtas tendem a ter melodia mais forte.',
      'Descreva o engenheiro imaginário: "mixado lo-fi fita cassete" muda muito.',
      'Bateria: "808" vs "kit acústico de jazz" muda radicalmente.',
    ]},
  ],
  es: [
    { categoria: 'versiones de Suno', icone: '🎚', items: [
      'v3.5 (2024): estable, máx 4 min. Buena para experimentación clásica.',
      'v4 (nov 2024): calidad vocal muy superior a v3.5. Introdujo Extend, Cover y Persona.',
      'v4.5 (mayo 2025): máx 8 min. Mucha mejor adherencia al prompt, voces expresivas, mashups de género funcionan bien.',
      'v4.5+ (jul 2025): añade Add Vocals y Add Instrumental.',
      'v5 (2025): fidelidad de audio mucho más alta, voces más naturales.',
      'v5.5 (mar 2026): clonación de voz, modelos personalizados, memoria de preferencias.',
      'Tip: el mismo prompt en v4 vs v4.5 vs v5 produce canciones muy diferentes. Prueba al menos 2 versiones.',
    ]},
    { categoria: 'prompt (campo Style)', icone: '✍', items: [
      'Límite aproximado: 1000 caracteres.',
      'Sé sensorial y específico: "lo-fi beats con vinyl crackle y piano Rhodes en reverb de catedral" supera a "música chill".',
      'NO menciones artistas reales — Suno filtra referencias directas. Describe el estilo en su lugar.',
      'Usa comas para separar elementos.',
      'Combinaciones creativas funcionan genial en v4.5+: "EDM + folk", "canto gregoriano + trap".',
    ]},
    { categoria: 'etiquetas de letras', icone: '🏷', items: [
      'Estructura: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Bridge], [Outro].',
      'Instrumental: [Instrumental], [Guitar Solo], [Drum Break], [Sax Solo].',
      'Dirección vocal: [Whispered], [Shouted], [Spoken Word], [Falsetto].',
      'Dinámica: [Build Up], [Drop], [Silence].',
      'Coros: usa paréntesis en la letra: "Te extraño (te extraño tanto)".',
      'SIEMPRE usa etiquetas en inglés — Suno no reconoce etiquetas en otros idiomas y las cantará como letra!',
    ]},
    { categoria: 'modos de Suno', icone: '⚙', items: [
      'Simple: describe en lenguaje natural, Suno genera todo.',
      'Custom Mode: control total. USA ESTE para mejores resultados (esta herramienta está hecha para eso).',
      'Instrumental toggle: misma canción sin voces.',
    ]},
    { categoria: 'funciones avanzadas', icone: '🔁', items: [
      'Extend: continúa una canción desde cualquier segundo.',
      'Cover: regenera la misma letra en otro género.',
      'Persona (v4+): guarda voz y estilo para reutilizar.',
      'Add Vocals / Add Instrumental (v4.5+).',
      'Stems (de pago): exporta pistas separadas para mezclar en DAW.',
    ]},
    { categoria: 'idiomas', icone: '🌍', items: [
      'Inglés sigue siendo el mejor interpretado.',
      'Portugués funciona muy bien en v4+.',
      'Español y japonés dan buenos resultados. Francés es más irregular.',
    ]},
    { categoria: 'tips de oro', icone: '💎', items: [
      'Genera 3-5 versiones del mismo prompt — la mejor casi nunca es la primera.',
      'Si una canción salió casi perfecta, usa Extend o Cover en lugar de empezar de cero.',
      'Letras más cortas tienden a tener mejor melodía.',
      'Describe al ingeniero de audio imaginario: "mezclado lo-fi cassette" cambia mucho.',
      'Batería: "808" vs "kit acústico de jazz" cambia radicalmente la pista.',
    ]},
  ],
  fr: [
    { categoria: 'versions Suno', icone: '🎚', items: [
      'v3.5 (2024) : stable, max 4 min. Bon pour de l\'expérimentation classique.',
      'v4 (nov 2024) : qualité vocale bien supérieure à v3.5. Introduit Extend, Cover et Persona.',
      'v4.5 (mai 2025) : max 8 min. Bien meilleure adhérence au prompt, voix expressives, mashups de genres marchent bien.',
      'v4.5+ (juil 2025) : ajoute Add Vocals et Add Instrumental.',
      'v5 (2025) : fidélité audio bien plus haute, voix plus naturelles.',
      'v5.5 (mars 2026) : clonage vocal, modèles personnalisés, mémoire de préférences.',
      'Astuce : le même prompt en v4 vs v4.5 vs v5 produit des chansons très différentes. Essaie au moins 2 versions.',
    ]},
    { categoria: 'prompt (champ Style)', icone: '✍', items: [
      'Limite approximative : 1000 caractères.',
      'Sois sensoriel et précis : « lo-fi beats avec vinyl crackle et piano Rhodes en reverb cathédrale » bat « musique chill ».',
      'NE cite PAS d\'artistes réels — Suno filtre les références directes. Décris le style à la place.',
      'Utilise des virgules pour séparer les éléments.',
      'Combinaisons créatives marchent super bien en v4.5+ : « EDM + folk », « chant grégorien + trap ».',
    ]},
    { categoria: 'balises de paroles', icone: '🏷', items: [
      'Structure : [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Bridge], [Outro].',
      'Instrumental : [Instrumental], [Guitar Solo], [Drum Break], [Sax Solo].',
      'Direction vocale : [Whispered], [Shouted], [Spoken Word], [Falsetto].',
      'Dynamique : [Build Up], [Drop], [Silence].',
      'Chœurs : utilise des parenthèses dans les paroles : « Tu me manques (manques tellement) ».',
      'TOUJOURS utiliser des balises en anglais — Suno ne reconnaît pas les balises dans d\'autres langues et les chantera comme paroles !',
    ]},
    { categoria: 'modes Suno', icone: '⚙', items: [
      'Simple : décris en langage naturel, Suno génère tout.',
      'Custom Mode : contrôle total. UTILISE-LE pour de meilleurs résultats (cet outil est fait pour ça).',
      'Instrumental toggle : même chanson sans voix.',
    ]},
    { categoria: 'fonctionnalités avancées', icone: '🔁', items: [
      'Extend : continue une chanson depuis n\'importe quelle seconde.',
      'Cover : régénère les mêmes paroles dans un autre genre.',
      'Persona (v4+) : sauvegarde voix et style pour réutiliser.',
      'Add Vocals / Add Instrumental (v4.5+).',
      'Stems (payant) : exporte les pistes séparées pour mixer en DAW.',
    ]},
    { categoria: 'langues', icone: '🌍', items: [
      'L\'anglais reste le mieux interprété.',
      'Le portugais marche très bien en v4+.',
      'L\'espagnol et le japonais donnent de bons résultats. Le français est plus inégal.',
    ]},
    { categoria: 'astuces d\'or', icone: '💎', items: [
      'Génère 3-5 versions du même prompt — la meilleure est rarement la première.',
      'Si une chanson est sortie presque parfaite, utilise Extend ou Cover au lieu de tout recommencer.',
      'Des paroles plus courtes ont tendance à avoir une mélodie plus forte.',
      'Décris l\'ingé son imaginaire : « mixé lo-fi cassette » change beaucoup.',
      'Batterie : « 808 » vs « kit acoustique jazz » change radicalement la piste.',
    ]},
  ],
};

// ═══════════════════════════════════════════════════════════════════
// Helpers (declared once, used everywhere)
// ═══════════════════════════════════════════════════════════════════

const getGenreLabel = (k, lang) => lang === 'en' ? k : (GENRE_LABELS[lang]?.[k] || k);
const getInstrLabel = (k, lang) => lang === 'en' ? k : (INSTR_LABELS[lang]?.[k] || k);
const getMoodLabel = (k, lang) => lang === 'en' ? k : (MOODS_LABELS[lang]?.[k] || k);
const getVozLabel = (k, lang) => lang === 'en' ? k : (VOZES_LABELS[lang]?.[k] || k);
const getEraLabel = (k, lang) => lang === 'en' ? k : (ERAS_LABELS[lang]?.[k] || k);
const getProdLabel = (k, lang) => lang === 'en' ? k : (PROD_LABELS[lang]?.[k] || k);
const getTempoLabel = (k, lang) => UI[lang].bpm[k] || k;
const getDurationLabel = (k, lang) => UI[lang][k] || DURATION_EN[k];
const getDurationEN = (k) => DURATION_EN[k];
const getIdiomaLabel = (k, lang) => lang === 'en' ? k : (IDIOMA_LABELS[lang]?.[k] || k);
const getEstrLabel = (k, lang) => lang === 'en' ? k : (ESTR_LABELS[lang]?.[k] || k);
const getPerspLabel = (k, lang) => lang === 'en' ? k : (PERSP_LABELS[lang]?.[k] || k);
const getRimaLabel = (k, lang) => lang === 'en' ? k : (RIMAS_LABELS[lang]?.[k] || k);
const getMetrLabel = (k, lang) => lang === 'en' ? k : (METR_LABELS[lang]?.[k] || k);

const sortByLabel = (arr, getLabel, lang) =>
  arr.slice().sort((a, b) => {
    const la = getLabel(typeof a === 'object' ? a.key : a, lang).toLocaleLowerCase(lang);
    const lb = getLabel(typeof b === 'object' ? b.key : b, lang).toLocaleLowerCase(lang);
    return la.localeCompare(lb, lang);
  });

const INSTRUMENTOS_FLAT = Object.values(INSTRUMENTOS_CATS_KEYS).flat();
const TEMPO_KEYS_FLAT = TEMPOS_KEYS.map(t => t.key);
const GENEROS_FLAT = Object.values(GENEROS_CATS_KEYS).flat().map(g => g.key);


// Detect what kind of reference the user pasted
function detectarTipoReferencia(texto) {
  if (!texto || !texto.trim()) return 'empty';
  const t = texto.trim();
  // URL detection
  const urlPatterns = [
    /youtube\.com\/watch/i, /youtu\.be\//i, /music\.youtube\.com/i,
    /open\.spotify\.com\/track/i, /spotify\.com\/track/i,
    /music\.apple\.com/i, /soundcloud\.com/i, /deezer\.com/i, /tidal\.com/i,
  ];
  if (urlPatterns.some(re => re.test(t))) return 'url';
  // Lyrics: contains structural tags or many line breaks
  if (/\[(?:Verse|Chorus|Bridge|Intro|Outro|Verso|Refr[ãa]o|Couplet|Refrain)/i.test(t)) return 'lyrics';
  const linhas = t.split(/\n/).filter(l => l.trim()).length;
  const palavras = t.split(/\s+/).length;
  if (linhas >= 4 && palavras >= 25) return 'lyrics';
  // Otherwise treat as track/artist name
  return 'track';
}

// Try to extract a readable label from common URL formats (best-effort, client-side)
function extrairLabelDeURL(url) {
  try {
    const u = new URL(url);
    if (/youtube\.com|youtu\.be/i.test(u.hostname)) {
      const v = u.searchParams.get('v') || u.pathname.split('/').pop();
      return v ? `YouTube video ${v}` : 'YouTube video';
    }
    if (/spotify/i.test(u.hostname)) {
      const id = u.pathname.split('/').pop();
      return id ? `Spotify track ${id}` : 'Spotify track';
    }
    if (/apple/i.test(u.hostname)) return 'Apple Music track';
    if (/soundcloud/i.test(u.hostname)) {
      return `SoundCloud: ${u.pathname.replace(/^\//, '').replace(/\//g, ' / ')}`;
    }
    return url;
  } catch (_) {
    return url;
  }
}

function composePrompt(s) {
  // Suno front-loads processing — vocals/genre/mood get priority weighting.
  // Order: vocals → genre → mood → tempo → era → production → instrumentation
  //        → duration → language → theme → negative prompts (last, with explicit "avoid:" prefix)
  const parts = [];
  if (s.vozes?.length) parts.push(`${s.vozes.join(' + ')} vocals`);
  if (s.generos?.length) parts.push(`${s.generos.join(' / ')}`);
  if (s.moods?.length) parts.push(`${s.moods.join(' · ')} atmosphere`);
  if (s.tempos?.length) {
    const tt = s.tempos.map(k => {
      const t = TEMPOS_KEYS.find(x => x.key === k);
      return t ? `${k} (${t.bpm})` : k;
    });
    parts.push(`${tt.join(' → ')} tempo`);
  }
  if (s.eras?.length) parts.push(`${s.eras.join(' + ')} aesthetic`);
  if (s.producoes?.length) parts.push(`${s.producoes.join(' + ')} production`);
  if (s.drumMachines?.length) parts.push(`drums: ${s.drumMachines.join(' + ')}`);
  if (s.synths?.length) parts.push(`synths: ${s.synths.join(' + ')}`);
  if (s.mics?.length) parts.push(`mic'd with: ${s.mics.join(', ')}`);
  if (s.instrumentos?.length) parts.push(`instrumentation: ${s.instrumentos.join(', ')}`);
  if (s.tema?.trim()) parts.push(`theme: ${s.tema.trim()}`);
  if (s.negativos?.trim()) parts.push(`avoid: ${s.negativos.trim()}`);
  return parts.length ? parts.join('. ') + '.' : '';
}

function sanitizarLetra(texto) {
  if (!texto) return '';
  let t = texto.trim();
  t = t.replace(/^```[a-z]*\n?/gim, '').replace(/```$/gm, '').trim();
  const mapa = [
    [/\[\s*intro\s*\]/gi, '[Intro]'], [/\[\s*outro\s*\]/gi, '[Outro]'],
    [/\[\s*fim\s*\]/gi, '[End]'], [/\[\s*end\s*\]/gi, '[End]'],
    [/\[\s*verso\s*(\d+)\s*\]/gi, '[Verse $1]'], [/\[\s*verso\s*\]/gi, '[Verse]'],
    [/\[\s*pré[- ]?refrão\s*\]/gi, '[Pre-Chorus]'], [/\[\s*pre[- ]?refrao\s*\]/gi, '[Pre-Chorus]'],
    [/\[\s*refrão\s*\]/gi, '[Chorus]'], [/\[\s*refrao\s*\]/gi, '[Chorus]'],
    [/\[\s*ponte\s*\]/gi, '[Bridge]'],
    [/\[\s*estrofa\s*(\d+)\s*\]/gi, '[Verse $1]'], [/\[\s*estrofa\s*\]/gi, '[Verse]'],
    [/\[\s*estribillo\s*\]/gi, '[Chorus]'], [/\[\s*pre[- ]?estribillo\s*\]/gi, '[Pre-Chorus]'],
    [/\[\s*puente\s*\]/gi, '[Bridge]'],
    [/\[\s*couplet\s*(\d+)\s*\]/gi, '[Verse $1]'], [/\[\s*couplet\s*\]/gi, '[Verse]'],
    [/\[\s*refrain\s*\]/gi, '[Chorus]'], [/\[\s*pré[- ]?refrain\s*\]/gi, '[Pre-Chorus]'],
    [/\[\s*pre[- ]?refrain\s*\]/gi, '[Pre-Chorus]'], [/\[\s*pont\s*\]/gi, '[Bridge]'],
    [/\[\s*verse\s+(\d+)\s*\]/gi, '[Verse $1]'], [/\[\s*chorus\s*\]/gi, '[Chorus]'],
    [/\[\s*pre[- ]?chorus\s*\]/gi, '[Pre-Chorus]'], [/\[\s*bridge\s*\]/gi, '[Bridge]'],
    [/\[\s*instrumental\s*\]/gi, '[Instrumental]'],
  ];
  mapa.forEach(([re, sub]) => { t = t.replace(re, sub); });
  const firstTagMatch = t.match(/\[[A-Za-z][^\]]*\]/);
  if (firstTagMatch && firstTagMatch.index > 0) t = t.slice(firstTagMatch.index);
  const finaisPoluentes = [
    /\n\s*---+\s*$/m, /\n\s*===+\s*$/m, /\n\s*\*\*\*+\s*$/m,
    /\n\s*\(?\s*(total|caracteres?|chars?|count|nota|note|observação|observacao|comentário|comentario|observation)\s*[:=].*$/gmi,
  ];
  finaisPoluentes.forEach(re => {
    const m = t.match(re);
    if (m && m.index !== undefined) t = t.slice(0, m.index);
  });
  return t.trim();
}

async function copiarParaClipboard(texto) {
  if (!texto) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch (_) {}
  try {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { ta.setSelectionRange(0, texto.length); } catch (_) {}
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) { return false; }
}

// ═══════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════
function BrahmstormApp({ onBack } = {}) {
  const [lang, setLang] = useState(detectLang);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langBtnRef = useRef(null);
  const [langMenuPos, setLangMenuPos] = useState(null);

  // Recalculate menu position whenever it opens, on resize, or on scroll
  useEffect(() => {
    if (!langMenuOpen) { setLangMenuPos(null); return; }
    const recalc = () => {
      const btn = langBtnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const menuW = 180;
      const margin = 8;
      // Always anchor to button's left edge, then clamp to viewport
      let left = rect.left;
      // If menu would overflow right edge, push it back
      if (left + menuW > window.innerWidth - margin) {
        left = window.innerWidth - menuW - margin;
      }
      // If pushed too far left (somehow), clamp to margin
      if (left < margin) left = margin;
      setLangMenuPos({ left, top: rect.bottom + 4 });
    };
    recalc();
    window.addEventListener('resize', recalc);
    window.addEventListener('scroll', recalc, true);
    return () => {
      window.removeEventListener('resize', recalc);
      window.removeEventListener('scroll', recalc, true);
    };
  }, [langMenuOpen]);

  const t = UI[lang];

  const [tab, setTab] = useState('prompt');

  // ─── Per-tab states (separated so switching tabs doesn't bleed config) ───
  // PROMPT tab states
  const [generosPrompt, setGenerosPrompt] = useState([]);
  const [moodsPrompt, setMoodsPrompt] = useState([]);
  const [erasPrompt, setErasPrompt] = useState([]);
  const [temaPrompt, setTemaPrompt] = useState('');
  // LYRICS tab states
  const [generosLetra, setGenerosLetra] = useState([]);
  const [moodsLetra, setMoodsLetra] = useState([]);
  const [erasLetra, setErasLetra] = useState([]);
  const [idiomasLetra, setIdiomasLetra] = useState([]);
  const [duracoesLetra, setDuracoesLetra] = useState([]);
  const [temaLetra, setTemaLetra] = useState('');

  // ─── Active getters/setters: indirection based on current tab.
  // Rest of the code keeps using `generos`, `setGeneros`, etc — unchanged. ───
  const generos    = tab === 'prompt' ? generosPrompt    : generosLetra;
  const setGeneros = tab === 'prompt' ? setGenerosPrompt : setGenerosLetra;
  const moods      = tab === 'prompt' ? moodsPrompt      : moodsLetra;
  const setMoods   = tab === 'prompt' ? setMoodsPrompt   : setMoodsLetra;
  const eras       = tab === 'prompt' ? erasPrompt       : erasLetra;
  const setEras    = tab === 'prompt' ? setErasPrompt    : setErasLetra;
  // idiomas + duracoes only exist in Lyrics tab now (Prompt tab doesn't use them)
  const idiomas    = idiomasLetra;
  const setIdiomas = setIdiomasLetra;
  const duracoes   = duracoesLetra;
  const setDuracoes = setDuracoesLetra;
  const tema       = tab === 'prompt' ? temaPrompt       : temaLetra;
  const setTema    = tab === 'prompt' ? setTemaPrompt    : setTemaLetra;

  // Tab-exclusive states (no indirection needed — only one tab uses each)
  const [instrumentos, setInstrumentos] = useState([]);
  const [vozes, setVozes] = useState([]);
  const [producoes, setProducoes] = useState([]);
  const [tempos, setTempos] = useState([]);
  const [estruturas, setEstruturas] = useState([]);
  const [perspectivas, setPerspectivas] = useState([]);
  const [rimas, setRimas] = useState([]);
  const [elementos, setElementos] = useState('');
  const [refraoChave, setRefraoChave] = useState('');
  const [negativos, setNegativos] = useState('');
  const [tamanhoLetra, setTamanhoLetra] = useState('');
  const [numVersos, setNumVersos] = useState(0);
  const [numRefroes, setNumRefroes] = useState(0);
  const [metricas, setMetricas] = useState([]);

  // Advanced sub-tab selections (vintage gear)
  const [drumMachines, setDrumMachines] = useState([]);
  const [synths, setSynths] = useState([]);
  const [mics, setMics] = useState([]);

  const [briefLivrePrompt, setBriefLivrePrompt] = useState('');
  const [briefLivreLetra, setBriefLivreLetra] = useState('');
  const briefLivre = tab === 'prompt' ? briefLivrePrompt : briefLivreLetra;
  const setBriefLivre = tab === 'prompt' ? setBriefLivrePrompt : setBriefLivreLetra;
  const [loadingPreencher, setLoadingPreencher] = useState(false);
  const [referenciaPrompt, setReferenciaPrompt] = useState('');
  const [referenciaLetra, setReferenciaLetra] = useState('');
  const referencia = tab === 'prompt' ? referenciaPrompt : referenciaLetra;
  const setReferencia = tab === 'prompt' ? setReferenciaPrompt : setReferenciaLetra;
  const [refResult, setRefResult] = useState(null); // { confidence, kind, message }
  const [loadingRef, setLoadingRef] = useState(false);

  const [aiVariants, setAiVariants] = useState([]);
  const [aiVariantsKind, setAiVariantsKind] = useState('variations');
  const [promptGenerations, setPromptGenerations] = useState([]);
  const [lyricsGenerations, setLyricsGenerations] = useState([]);
  const [letrasHistorico, setLetrasHistorico] = useState([]);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingLetra, setLoadingLetra] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [loadingKind, setLoadingKind] = useState(null); // 'variations' | 'album' | 'letra' | 'letrasAlbum' | 'ref' | null

  // cycles through phase messages while AI is processing
  // returns a stop function
  const startPhaseCycle = (phases, intervalMs = 2200) => {
    if (!phases || !phases.length) return () => {};
    let idx = 0;
    setLoadingPhase(phases[0]);
    const id = setInterval(() => {
      idx = Math.min(idx + 1, phases.length - 1);
      setLoadingPhase(phases[idx]);
    }, intervalMs);
    return () => {
      clearInterval(id);
      setLoadingPhase('');
    };
  };
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);
  const [toast, setToast] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerFilter, setDrawerFilter] = useState('todos');
  const [drawerView, setDrawerView] = useState('favoritos');
  const [tipsOpen, setTipsOpen] = useState(false);
  const [advancedSheetOpen, setAdvancedSheetOpen] = useState(false);
  const [mobileShowAdvanced, setMobileShowAdvanced] = useState(false);
  const [mobileSheetKey, setMobileSheetKey] = useState(null);
  const [mobileSheetData, setMobileSheetData] = useState(null);

  // Lock body scroll using position:fixed pattern (preserves scroll position natively)
  const savedScrollRef = useRef(0);
  const outputRef = useRef(null);
  const blocksRef = useRef(null);
  // Turnstile: render the widget once on mount; reuse via reset() for each
  // AI call. Calling render() repeatedly on the same container silently
  // breaks Turnstile, which is why non-owners hit verification_failed on
  // their second generation.
  const turnstileWidgetIdRef = useRef(null);
  const turnstileTokenResolverRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!sitekey) return;
    let cancelled = false;
    let pollId = null;
    const tryRender = () => {
      if (cancelled) return;
      if (!window.turnstile) {
        pollId = setTimeout(tryRender, 200);
        return;
      }
      const container = document.getElementById('turnstile-container');
      if (!container) return;
      try {
        turnstileWidgetIdRef.current = window.turnstile.render('#turnstile-container', {
          sitekey,
          size: 'invisible',
          callback: (token) => {
            const resolve = turnstileTokenResolverRef.current;
            turnstileTokenResolverRef.current = null;
            if (resolve) resolve(token || '');
          },
          'error-callback': () => {
            const resolve = turnstileTokenResolverRef.current;
            turnstileTokenResolverRef.current = null;
            if (resolve) resolve('');
          },
          'expired-callback': () => {
            // Token expired — next call will reset() to refresh.
          },
        });
      } catch (e) {
        console.warn('Turnstile render failed', e);
      }
    };
    tryRender();
    return () => {
      cancelled = true;
      if (pollId) clearTimeout(pollId);
      try {
        if (window.turnstile && turnstileWidgetIdRef.current) {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        }
      } catch (e) {}
      turnstileWidgetIdRef.current = null;
      turnstileTokenResolverRef.current = null;
    };
  }, []);
  useEffect(() => {
    const anySheetOpen = mobileSheetKey || drawerOpen || tipsOpen;
    if (anySheetOpen) {
      const y = window.scrollY || window.pageYOffset || 0;
      savedScrollRef.current = y;
      // Pin the body in place at current scroll position. This visually freezes
      // the page (no jump to top) while preventing scroll behind the sheet.
      document.body.style.position = 'fixed';
      document.body.style.top = `-${y}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      if (mobileSheetKey) document.body.setAttribute('data-sheet-open', 'true');
      return () => {
        // Undo pinning
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.removeAttribute('data-sheet-open');
        // Restore scroll
        window.scrollTo(0, savedScrollRef.current);
      };
    }
  }, [mobileSheetKey, drawerOpen, tipsOpen]);

  // When tab changes, close any open mobile sheet (its content belongs to a specific tab)
  useEffect(() => {
    setMobileSheetKey(null);
    setMobileSheetData(null);
  }, [tab]);

  // Modal state for keyboard shortcuts help (shown when user presses ?)
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [presetsModalOpen, setPresetsModalOpen] = useState(false);

  const [producerTab, setProducerTabState] = useState(() => {
    try { return localStorage.getItem('bs:producerTab') || 'producer'; } catch (e) { return 'producer'; }
  });
  const setProducerTab = (val) => {
    setProducerTabState(val);
    try { localStorage.setItem('bs:producerTab', val); } catch (e) {}
  };

  // Keyboard shortcuts (desktop power users)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKeyDown = (e) => {
      // Skip if user is typing in an input/textarea (unless it's our shortcut to escape)
      const target = e.target;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + Enter — generate primary action of current tab
      if (mod && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          // Shift adds: generate album
          if (tab === 'prompt') gerarAlbum();
          else gerarLetrasAlbum();
        } else {
          if (tab === 'prompt') gerarPrompts();
          else gerarLetra();
        }
        return;
      }

      // Cmd/Ctrl + L — switch tab
      if (mod && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setTab(t => t === 'prompt' ? 'letra' : 'prompt');
        return;
      }

      // Skip remaining shortcuts when typing
      if (isTyping) return;

      // ? — open shortcuts help modal
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShortcutsOpen(v => !v);
        return;
      }

      // / — focus brief inspiration textarea
      if (e.key === '/') {
        e.preventDefault();
        const briefEl = document.querySelector('[data-brief-input="true"]');
        if (briefEl) briefEl.focus();
        return;
      }

      // Escape — close any open modal/sheet
      if (e.key === 'Escape') {
        if (shortcutsOpen) { setShortcutsOpen(false); return; }
        if (mobileSheetKey) { setMobileSheetKey(null); setMobileSheetData(null); return; }
        if (drawerOpen) { setDrawerOpen(false); return; }
        if (tipsOpen) { setTipsOpen(false); return; }
        if (langMenuOpen) { setLangMenuOpen(false); return; }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, shortcutsOpen, mobileSheetKey, drawerOpen, tipsOpen, langMenuOpen]);

  // Scroll to output when content is generated (mobile only — desktop has sticky output)
  useEffect(() => {
    const hasContent = aiVariants.length > 0 || lyricsGenerations.length > 0;
    if (!hasContent) return;
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    const el = outputRef.current;
    if (!el) return;
    // Wait for DOM paint, then scroll
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [aiVariants, lyricsGenerations]);
  const advancedBlockClass = mobileShowAdvanced ? '' : 'hidden md:block';
  const [openBlocks, setOpenBlocks] = useState({ genero: true, ltema: true });

  // Auto-close other blocks when opening a new one (desktop only — keeps focus single).
  // Mobile uses bottom sheets, so this doesn't apply there.
  const toggleBlock = (k) => setOpenBlocks(p => {
    const isCurrentlyOpen = !!p[k];
    if (isCurrentlyOpen) {
      // simple toggle off
      return { ...p, [k]: false };
    }
    // Opening: close all others on desktop. On mobile this still works fine
    // because mobile blocks open sheets, not the inline accordion (which is hidden).
    return { [k]: true };
  });
  const toggleItem = (arr, setter, item, max) => {
    if (arr.includes(item)) {
      // always allow deselect
      setter(arr.filter(x => x !== item));
    } else {
      // when adding, enforce max if provided
      if (max && arr.length >= max) return; // silently refuse — Block UI shows the limit
      setter([...arr, item]);
    }
  };
  const toggleSingle = (arr, setter, item) =>
    setter(arr[0] === item ? [] : [item]);

  // Apply a quick-start preset — fills the relevant multi-select blocks at once.
  // Filters by valid vocab keys to gracefully ignore renamed/missing entries.
  const applyPreset = (preset) => {
    if (!preset) return;
    setGeneros((preset.generos || []).filter(x => GENEROS_FLAT.includes(x)).slice(0, MULTI_LIMITS.generos));
    setMoods((preset.moods || []).filter(x => MOODS_KEYS.includes(x)).slice(0, MULTI_LIMITS.moods));
    setInstrumentos((preset.instrumentos || []).filter(x => INSTRUMENTOS_FLAT.includes(x)).slice(0, MULTI_LIMITS.instrumentos));
    setVozes(migrateVozesArray(preset.vozes).slice(0, MULTI_LIMITS.vozes));
    setEras((preset.eras || []).filter(x => ERAS_KEYS.includes(x)).slice(0, MULTI_LIMITS.eras));
    setProducoes((preset.producoes || []).filter(x => PRODUCOES_KEYS.includes(x)).slice(0, MULTI_LIMITS.producoes));
    setTempos((preset.tempos || []).filter(x => TEMPO_KEYS_FLAT.includes(x)).slice(0, 1));
    setOpenBlocks(prev => ({ ...prev, genero: true, mood: true, instr: true }));
    setProducerTab('producer');
    if (typeof window !== 'undefined' && blocksRef.current) {
      requestAnimationFrame(() => {
        const HEADER_OFFSET = window.innerWidth < 768 ? 24 : 132;
        const top = blocksRef.current.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    }
  };

  // Swipe between tabs (mobile only)
  const swipeStart = useRef(null);
  const onSwipeStart = (e) => {
    const touch = e.touches?.[0];
    if (!touch) return;
    swipeStart.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  };
  const onSwipeEnd = (e) => {
    if (!swipeStart.current) return;
    const touch = e.changedTouches?.[0];
    if (!touch) { swipeStart.current = null; return; }
    const dx = touch.clientX - swipeStart.current.x;
    const dy = touch.clientY - swipeStart.current.y;
    const dt = Date.now() - swipeStart.current.t;
    swipeStart.current = null;
    // require: horizontal dominant, > 70px, < 600ms, vertical < 60px
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 600 && Math.abs(dy) < 60) {
      if (dx < 0 && tab === 'prompt') setTab('letra');
      else if (dx > 0 && tab === 'letra') setTab('prompt');
    }
  };

  const aplicarTamanho = (id) => {
    const tm = TAMANHOS_LETRA.find(x => x.id === id);
    if (!tm) return;
    setTamanhoLetra(id); setNumVersos(tm.versos); setNumRefroes(tm.refroes);
  };

  const promptComposto = useMemo(() => composePrompt({
    generos, moods, instrumentos, vozes, eras, producoes, tempos, tema, negativos,
    drumMachines, synths, mics,
  }), [generos, moods, instrumentos, vozes, eras, producoes, tempos, tema, negativos, drumMachines, synths, mics]);

  const promptLen = promptComposto.length;
  const promptOverLimit = promptLen > LIMITE_PROMPT;

  useEffect(() => {
    try {
      const favRaw = localStorage.getItem('bs:favoritos');
      if (favRaw) {
        const parsed = JSON.parse(favRaw);
        if (Array.isArray(parsed)) setFavoritos(parsed);
      }
      const histRaw = localStorage.getItem('bs:historico');
      if (histRaw) {
        const parsedH = JSON.parse(histRaw);
        if (Array.isArray(parsedH)) setHistorico(parsedH);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('bs:lang', lang); } catch (e) {}
  }, [lang]);

  const mostrarToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), msg.length > 30 ? 3500 : 2200); };

  const salvar = (texto, tipo, titulo = '', key = null) => {
    if (!texto?.trim()) return;
    const novo = { texto: texto.trim(), tipo, titulo: titulo || (tipo === 'letra' ? 'Lyrics' : 'Prompt'), data: new Date().toISOString() };
    setFavoritos(prev => {
      const updated = [novo, ...prev].slice(0, 100);
      try { localStorage.setItem('bs:favoritos', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    if (key) { setSavedKey(key); setTimeout(() => setSavedKey(null), 1800); }
    mostrarToast(tipo === 'letra' ? t.toast_letra_saved : t.toast_prompt_saved);
  };

  const removerFavorito = (idx) => {
    setFavoritos(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      try { localStorage.setItem('bs:favoritos', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const adicionarAoHistorico = (texto, tipo, titulo = '') => {
    if (!texto?.trim()) return;
    const item = {
      texto: texto.trim(),
      tipo,
      titulo: titulo || (tipo === 'letra' ? 'Lyrics' : 'Prompt'),
      data: new Date().toISOString(),
    };
    setHistorico(prev => {
      const updated = [item, ...prev].slice(0, 50);
      try { localStorage.setItem('bs:historico', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const limparHistorico = () => {
    setHistorico([]);
    try { localStorage.setItem('bs:historico', JSON.stringify([])); } catch (e) {}
  };

  const copiar = async (texto, key) => {
    const ok = await copiarParaClipboard(texto);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
      mostrarToast(t.toast_copied);
    } else {
      mostrarToast(t.toast_copy_fail);
    }
  };

  const copiarEAbrirSuno = async (texto, key, kind = 'style') => {
    const ok = await copiarParaClipboard(texto);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2400);
      mostrarToast(kind === 'lyrics' ? t.toast_paste_lyrics : t.toast_paste_style);
      // small delay so the toast renders before tab switch
      setTimeout(() => {
        window.open('https://suno.com/create', '_blank', 'noopener,noreferrer');
      }, 150);
    } else {
      mostrarToast(t.toast_copy_fail);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // chamarAI — single entry point for all AI calls.
  // In dev (no /api/generate available), falls back to direct Anthropic API.
  // ─────────────────────────────────────────────────────────────────
  // Quota state — reflects the user's daily generation budget (5/day).
  // Updated by chamarAI() after each call based on the _quota field
  // returned by /api/generate. In dev (localhost), quota is null.
  // ─────────────────────────────────────────────────────────────────
  const [quota, setQuota] = useState(null); // { used, limit, remaining } | null

  // Helper: format ms remaining until next UTC midnight as "Xh Ym"
  const msUntilNextUTCMidnight = () => {
    const now = new Date();
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
    return next.getTime() - now.getTime();
  };
  const formatTimeUntilReset = (ms) => {
    if (ms <= 0) return '0m';
    const h = Math.floor(ms / (60 * 60 * 1000));
    const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  // Tick every minute so the countdown stays fresh while the user is on the page
  const [tickClock, setTickClock] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTickClock(t => t + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // chamarAI — single entry point for all AI calls.
  // In dev (no /api/generate available), falls back to direct Anthropic API.
  // In production, calls our serverless proxy with Turnstile + fingerprint.
  // ─────────────────────────────────────────────────────────────────
  const chamarAI = async ({ system, messages, max_tokens = 1500 }) => {
    const useProxy = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

    if (useProxy) {
      // Get a fresh Turnstile token from the persistent widget rendered on mount.
      // Each token is one-time-use, so we reset() before every call to refresh.
      let turnstileToken = '';
      if (window.turnstile && turnstileWidgetIdRef.current && import.meta.env.VITE_TURNSTILE_SITE_KEY) {
        turnstileToken = await new Promise((resolve) => {
          turnstileTokenResolverRef.current = resolve;
          try {
            window.turnstile.reset(turnstileWidgetIdRef.current);
          } catch (e) {
            turnstileTokenResolverRef.current = null;
            resolve('');
            return;
          }
          // Safety timeout — if Turnstile doesn't fire callback within 8s,
          // proceed with empty token (server will reject with verification_failed
          // if turnstile is required, surfacing the issue rather than hanging).
          setTimeout(() => {
            if (turnstileTokenResolverRef.current === resolve) {
              turnstileTokenResolverRef.current = null;
              resolve('');
            }
          }, 8000);
        });
      }

      const fingerprint = btoa(
        [navigator.userAgent, navigator.language, screen.width, screen.height, new Date().getTimezoneOffset()].join('|')
      ).slice(0, 32);

      // Owner bypass: read token from localStorage if set.
      // To enable: in browser console, run:
      //   localStorage.setItem('bs:ownerToken', 'your-secret-token-here')
      // To disable: localStorage.removeItem('bs:ownerToken')
      let ownerToken = '';
      try { ownerToken = localStorage.getItem('bs:ownerToken') || ''; } catch (e) {}

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, messages, max_tokens, turnstileToken, fingerprint, ownerToken }),
      });

      // 429 = daily limit hit. Update quota state and throw a recognizable error.
      if (res.status === 429) {
        const err = await res.json().catch(() => ({}));
        if (typeof err.used === 'number' && typeof err.limit === 'number') {
          setQuota({ used: err.used, limit: err.limit, remaining: 0 });
        }
        const error = new Error('daily_limit');
        error.code = 'daily_limit';
        throw error;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `request_failed_${res.status}`);
      }

      const data = await res.json();
      // Update quota tracker from the server's response
      if (data._quota) setQuota(data._quota);
      return data;
    }

    // DEV / artifact env: call Anthropic directly
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens, system, messages }),
    });
    if (!res.ok) throw new Error(`anthropic_${res.status}`);
    return await res.json();
  };

  // Centralized error message mapper. Recognizes daily_limit and shows
  // the proper localized message; falls back to a generic error otherwise.
  const handleAIError = (err, fallbackKey = 'err_variants') => {
    if (err && err.code === 'daily_limit') {
      setErrorMsg(t.err_daily_limit);
      return;
    }
    setErrorMsg(t[fallbackKey] || t.err_variants);
  };

  // Quota-aware button state. Returns label + whether button should be disabled.
  // - When quota exhausted: disabled, shows "DAILY LIMIT REACHED"
  // - When generating: shows the loading phase
  // - Otherwise: shows the action label + remaining counter "(4/5)" if known
  const isQuotaExhausted = quota && quota.remaining !== undefined && quota.remaining <= 0;
  const getQuotaSuffix = () => {
    if (!quota || quota.limit === undefined) return '';
    const remaining = Math.max(0, quota.limit - quota.used);
    return ` · ${remaining}/${quota.limit}`;
  };

  const preencherPromptComIA = async () => {
    if (!briefLivre.trim()) return;
    setLoadingPreencher(true); setErrorMsg('');
    try {
      const sp = `You are a creative music director. Translate the user's free inspiration into concrete selections within a FIXED vocabulary.

USER INSPIRATION (any language):
"${briefLivre.trim()}"

USER UI LANGUAGE: ${LANG_NAMES[lang] || 'English'} — write all natural-language fields ("tema") in this language regardless of what language the user typed their inspiration in.

VOCABULARY (use EXACT English keys):
generos: ${GENEROS_FLAT.join(' | ')}
moods: ${MOODS_KEYS.join(' | ')}
instrumentos: ${INSTRUMENTOS_FLAT.join(' | ')}
vozes: ${VOZES_KEYS.join(' | ')}
eras: ${ERAS_KEYS.join(' | ')}
producoes: ${PRODUCOES_KEYS.join(' | ')}
tempos: ${TEMPO_KEYS_FLAT.join(' | ')}
RULES:
1. Use ONLY exact strings from lists.
2. 1-3 items per field, up to 5 for instrumentos.
3. "tema": 1 sentence (max 20 words) in ${LANG_NAMES[lang] || 'English'}.

Return ONLY JSON, no markdown:
{"generos":[],"moods":[],"instrumentos":[],"vozes":[],"eras":[],"producoes":[],"tempos":[],"tema":""}`;
      const data = await chamarAI({ messages: [{ role: 'user', content: sp }], max_tokens: 1500 });
      const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      const p = JSON.parse(txt.replace(/```json|```/g, '').trim());
      setGeneros((p.generos || []).filter(x => GENEROS_FLAT.includes(x)));
      setMoods((p.moods || []).filter(x => MOODS_KEYS.includes(x)));
      setInstrumentos((p.instrumentos || []).filter(x => INSTRUMENTOS_FLAT.includes(x)));
      setVozes(migrateVozesArray(p.vozes));
      setEras((p.eras || []).filter(x => ERAS_KEYS.includes(x)));
      setProducoes((p.producoes || []).filter(x => PRODUCOES_KEYS.includes(x)));
      setTempos((p.tempos || []).filter(x => TEMPO_KEYS_FLAT.includes(x)).slice(0, 1));
      if (p.tema) setTema(p.tema);
      setOpenBlocks(prev => ({ ...prev, genero: true, mood: true, instr: true }));
      setProducerTab('producer');
      mostrarToast(t.toast_filled);
      // Scroll user to the now-filled blocks (mobile only — desktop already shows them)
      if (typeof window !== 'undefined' && blocksRef.current) {
        requestAnimationFrame(() => {
          const HEADER_OFFSET = window.innerWidth < 768 ? 24 : 132;
          const top = blocksRef.current.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
          window.scrollTo({ top, behavior: 'smooth' });
        });
      }
    } catch (err) {
      handleAIError(err, 'err_interpret');
    } finally {
      setLoadingPreencher(false);
    }
  };

  const preencherLetraComIA = async () => {
    if (!briefLivre.trim()) return;
    setLoadingPreencher(true); setErrorMsg('');
    try {
      const sp = `You are a music director. Translate user's inspiration into selections within fixed vocabulary.

INSPIRATION:
"${briefLivre.trim()}"

USER UI LANGUAGE: ${LANG_NAMES[lang] || 'English'} — write all natural-language fields ("tema", "elementos", "refraoChave") in this language regardless of what language the user typed their inspiration in.

VOCABULARY (EXACT English keys):
generos: ${GENEROS_FLAT.join(' | ')}
moods: ${MOODS_KEYS.join(' | ')}
eras: ${ERAS_KEYS.join(' | ')}
perspectivas: ${PERSP_KEYS.join(' | ')}
estruturas: ${ESTRUTURAS_KEYS.join(' | ')}
rimas: ${RIMAS_KEYS.join(' | ')}
duracoes: ${DURACOES_KEYS.join(' | ')}
idiomas: ${IDIOMAS_KEYS.join(' | ')}
metricas: ${METRICAS_KEYS.join(' | ')}
tamanhoLetra IDs: ${TAMANHOS_LETRA.map(tm => tm.id).join(' | ')}

RULES:
1. Use ONLY exact strings.
2. 1-3 items per field.
3. "idiomas": pick EXACTLY ONE — the language the song's lyrics will be SUNG in (the user's stated intention; do not also include the UI language).
4. "tema", "elementos", "refraoChave" in ${LANG_NAMES[lang] || 'English'}.
5. "tamanhoLetra": pick by density.

Return ONLY JSON:
{"generos":[],"moods":[],"eras":[],"perspectivas":[],"estruturas":[],"rimas":[],"duracoes":[],"idiomas":[],"metricas":[],"tamanhoLetra":"media","tema":"","elementos":"","refraoChave":""}`;
      const data = await chamarAI({ messages: [{ role: 'user', content: sp }], max_tokens: 1500 });
      const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      const p = JSON.parse(txt.replace(/```json|```/g, '').trim());
      setGeneros((p.generos || []).filter(x => GENEROS_FLAT.includes(x)));
      setMoods((p.moods || []).filter(x => MOODS_KEYS.includes(x)));
      setEras((p.eras || []).filter(x => ERAS_KEYS.includes(x)));
      setPerspectivas((p.perspectivas || []).filter(x => PERSP_KEYS.includes(x)).slice(0, 1));
      setEstruturas((p.estruturas || []).filter(x => ESTRUTURAS_KEYS.includes(x)).slice(0, 1));
      setRimas((p.rimas || []).filter(x => RIMAS_KEYS.includes(x)).slice(0, 1));
      setDuracoes((p.duracoes || []).filter(x => DURACOES_KEYS.includes(x)));
      setMetricas((p.metricas || []).filter(x => METRICAS_KEYS.includes(x)).slice(0, 1));
      // A song is sung in exactly one language. AI sometimes returns both
      // the user-input language and the UI language — keep only the first.
      const idsOk = (p.idiomas || []).filter(x => IDIOMAS_KEYS.includes(x)).slice(0, 1);
      setIdiomas(idsOk);
      if (p.tema) setTema(p.tema);
      if (p.elementos) setElementos(p.elementos);
      if (p.refraoChave) setRefraoChave(p.refraoChave);
      if (p.tamanhoLetra && TAMANHOS_LETRA.find(tm => tm.id === p.tamanhoLetra)) {
        const tm = TAMANHOS_LETRA.find(x => x.id === p.tamanhoLetra);
        setTamanhoLetra(p.tamanhoLetra); setNumVersos(tm.versos); setNumRefroes(tm.refroes);
      }
      setOpenBlocks(prev => ({ ...prev, ltema: true, lmood: true, refrao: true, elem: true, ltam: true }));
      mostrarToast(t.toast_filled);
      // Scroll user to the now-filled blocks (mobile only)
      if (typeof window !== 'undefined' && blocksRef.current) {
        requestAnimationFrame(() => {
          const HEADER_OFFSET = window.innerWidth < 768 ? 24 : 132;
          const top = blocksRef.current.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
          window.scrollTo({ top, behavior: 'smooth' });
        });
      }
    } catch (err) {
      handleAIError(err, 'err_interpret');
    } finally {
      setLoadingPreencher(false);
    }
  };

  const analisarReferencia = async () => {
    if (!referencia.trim()) return;
    setLoadingRef(true); setLoadingKind('ref'); setErrorMsg(''); setRefResult(null);
    const stopPhases = startPhaseCycle(t.phases_ref);
    const tipo = detectarTipoReferencia(referencia);
    const limparRef = (s) => s.length > 4000 ? s.slice(0, 4000) : s;
    let payload = limparRef(referencia.trim());
    if (tipo === 'url') {
      const label = extrairLabelDeURL(payload);
      payload = `URL: ${payload}\nDetected: ${label}\n\nNote: I cannot fetch the audio. Use only what you know from this URL/title and your training data about the song or channel.`;
    }
    const isLyricsTab = tab === 'letra';

    const systemPrompt = `You are a music director. The user provided a REFERENCE (a song name, artist, or full lyrics) to use as a sound/style compass — NOT to copy. Your job is to extract the underlying patterns and translate them into our fixed Suno vocabulary.

REFERENCE TYPE DETECTED: ${tipo}
USER UI LANGUAGE: ${LANG_NAMES[lang] || 'English'} — write the "message" field in this language regardless of what language the reference text is in.
${isLyricsTab ? 'CONTEXT: user is working on LYRICS — focus on lyrical patterns (perspective, structure, meter, rhyme, mood, imagery).' : 'CONTEXT: user is working on PROMPT — focus on sonic patterns (genre, mood, instruments, vocals, era, production, tempo).'}

REFERENCE CONTENT:
---
${payload}
---

CRITICAL RULES:
1. NEVER copy lyrics or specific phrases from the reference. Output is descriptive only.
2. Be HONEST about confidence:
   - "high" — you know this song/artist well, confident in your description
   - "medium" — you have partial knowledge or are inferring from genre/era cues
   - "low" — you don't recognize the reference; admit it openly
3. Use ONLY exact strings from these vocabularies:

generos: ${GENEROS_FLAT.join(' | ')}
moods: ${MOODS_KEYS.join(' | ')}
instrumentos: ${INSTRUMENTOS_FLAT.join(' | ')}
vozes: ${VOZES_KEYS.join(' | ')}
eras: ${ERAS_KEYS.join(' | ')}
producoes: ${PRODUCOES_KEYS.join(' | ')}
tempos: ${TEMPO_KEYS_FLAT.join(' | ')}
duracoes: ${DURACOES_KEYS.join(' | ')}
idiomas: ${IDIOMAS_KEYS.join(' | ')}
${isLyricsTab ? `perspectivas: ${PERSP_KEYS.join(' | ')}
estruturas: ${ESTRUTURAS_KEYS.join(' | ')}
rimas: ${RIMAS_KEYS.join(' | ')}
metricas: ${METRICAS_KEYS.join(' | ')}` : ''}

4. Select 1-3 items per field (never more), only those that you can defend from the reference.
5. If confidence is "low", return mostly empty arrays and set message to explain you don't know it.
6. ${isLyricsTab ? 'If lyrics were pasted, you may extract patterns (perspective, structure, meter, rhyme) with confidence. NEVER copy lines.' : 'NEVER mention real artist names in fields — only patterns.'}

Return ONLY this JSON, no preamble:
{
  "confidence": "high" | "medium" | "low",
  "message": "1-2 sentence honest summary of what you recognized — write in ${LANG_NAMES[lang] || 'English'}",
  "fields": {
    "generos": [], "moods": [], "instrumentos": [], "vozes": [], "eras": [],
    "producoes": [], "tempos": [], "duracoes": [], "idiomas": []${isLyricsTab ? ',\n    "perspectivas": [], "estruturas": [], "rimas": [], "metricas": []' : ''}
  }
}`;

    try {
      const data = await chamarAI({ messages: [{ role: 'user', content: systemPrompt }], max_tokens: 1500 });
      const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      const parsed = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const f = parsed.fields || {};
      const conf = parsed.confidence || 'low';

      if (Array.isArray(f.generos))      setGeneros(f.generos.filter(x => GENEROS_FLAT.includes(x)));
      if (Array.isArray(f.moods))        setMoods(f.moods.filter(x => MOODS_KEYS.includes(x)));
      if (Array.isArray(f.instrumentos)) setInstrumentos(f.instrumentos.filter(x => INSTRUMENTOS_FLAT.includes(x)));
      if (Array.isArray(f.vozes))        setVozes(migrateVozesArray(f.vozes));
      if (Array.isArray(f.eras))         setEras(f.eras.filter(x => ERAS_KEYS.includes(x)));
      if (Array.isArray(f.producoes))    setProducoes(f.producoes.filter(x => PRODUCOES_KEYS.includes(x)));
      if (Array.isArray(f.tempos))       setTempos(f.tempos.filter(x => TEMPO_KEYS_FLAT.includes(x)).slice(0, 1));
      if (isLyricsTab && Array.isArray(f.duracoes))  setDuracoes(f.duracoes.filter(x => DURACOES_KEYS.includes(x)));
      if (isLyricsTab && Array.isArray(f.idiomas))   setIdiomas(f.idiomas.filter(x => IDIOMAS_KEYS.includes(x)).slice(0, 1));
      if (isLyricsTab) {
        if (Array.isArray(f.perspectivas)) setPerspectivas(f.perspectivas.filter(x => PERSP_KEYS.includes(x)).slice(0, 1));
        if (Array.isArray(f.estruturas))   setEstruturas(f.estruturas.filter(x => ESTRUTURAS_KEYS.includes(x)).slice(0, 1));
        if (Array.isArray(f.rimas))        setRimas(f.rimas.filter(x => RIMAS_KEYS.includes(x)).slice(0, 1));
        if (Array.isArray(f.metricas))     setMetricas(f.metricas.filter(x => METRICAS_KEYS.includes(x)).slice(0, 1));
      }

      setRefResult({ confidence: conf, kind: tipo, message: parsed.message || '' });
      setProducerTab('producer');
      mostrarToast(t.toast_filled);
    } catch (_) {
      setRefResult({ confidence: 'low', kind: tipo, message: t.ref_unknown });
    } finally {
      stopPhases();
      setLoadingRef(false); setLoadingKind(null);
    }
  };

    const preencherComIA = tab === 'prompt' ? preencherPromptComIA : preencherLetraComIA;

  const gerarPrompts = async () => {
    setLoadingPrompt(true); setLoadingKind('variations'); setErrorMsg(''); setAiVariantsKind('variations');
    const stopPhases = startPhaseCycle(t.phases_prompt);
    try {
      const brief = `You are a Suno AI prompt expert. Generate 3 CREATIVE and SPECIFIC prompt variations IN ENGLISH (Suno works best in English), each with a different angle.

STRICT RULES:
- Each prompt MUST be UNDER 950 characters (Suno's 1000-char limit)
- Be evocative, sensory, specific in production
- DO NOT mention real artists
- DO NOT include lyrics
- Write everything in ENGLISH

User brief:
${promptComposto}

Return ONLY JSON:
{"variacoes":[{"titulo":"short evocative name","prompt":"full prompt under 950 chars"},{"titulo":"...","prompt":"..."},{"titulo":"...","prompt":"..."}]}`;
      const data = await chamarAI({ messages: [{ role: 'user', content: brief }], max_tokens: 1500 });
      const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      const p = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const variantes = p.variacoes || [];
      setAiVariants(prev => [...variantes, ...prev]);
      setPromptGenerations(prev => [
        { id: 'g' + Date.now(), ts: Date.now(), kind: 'variations', items: variantes, expanded: true },
        ...prev.map(g => ({ ...g, expanded: false })),
      ]);
      variantes.forEach(v => adicionarAoHistorico(v.prompt, 'prompt', v.titulo));
    } catch (err) {
      handleAIError(err, 'err_variants');
    } finally {
      stopPhases();
      setLoadingPrompt(false); setLoadingKind(null);
    }
  };

  const gerarAlbum = async () => {
    setLoadingPrompt(true); setLoadingKind('album'); setErrorMsg(''); setAiVariantsKind('album');
    const stopPhases = startPhaseCycle(t.phases_album);
    try {
      // Collect titles from past album/lyrics-album generations so the AI knows
      // not to repeat them. Without this it converges on the same set every call.
      const previousAlbumTitles = promptGenerations
        .filter(g => g.kind === 'album')
        .flatMap(g => (g.items || []).map(v => v && v.titulo).filter(Boolean))
        .slice(0, 30);
      const avoidBlock = previousAlbumTitles.length
        ? `\nALREADY-GENERATED TITLES IN THIS SESSION (do NOT reuse, do NOT use close variations):\n${previousAlbumTitles.map(s => `- ${s}`).join('\n')}\n`
        : '';
      // Random creative angle nudges the AI toward a different shape every call.
      const angles = [
        'lean into the after-midnight hours of the album arc',
        'frame this EP around motion (commute, drive, train)',
        'frame this EP around a single room across time',
        'frame this EP around weather shifts and seasonal mood',
        'frame this EP as overheard letters or voicemails',
        'frame this EP around objects (a guitar, a postcard, a key)',
        'lean into pre-dawn quiet versus mid-day intensity',
        'frame this EP as a single conversation broken across 5 songs',
      ];
      const angle = angles[Math.floor(Math.random() * angles.length)];
      const brief = `You are a music director designing a 5-track cohesive EP/album. All tracks share the same SONIC UNIVERSE (genre, vocals, production, era) but each track has a distinct emotional arc, BPM, and lyrical theme — like tracks 1-5 of a real album.

Think of it as: same band, same producer, same studio session, but 5 different songs with different roles in the album narrative (opener, single, ballad, peak, closer).

STRICT RULES:
- Each prompt MUST be UNDER 950 characters (Suno's 1000-char limit)
- Keep genre/vocals/production/era CONSISTENT across all 5 tracks
- VARY: tempo, mood, intensity, lyrical theme — each track has a clear role
- Be evocative, sensory, specific in production
- DO NOT mention real artists
- DO NOT include lyrics
- Write everything in ENGLISH
- Track titles MUST be original — never reuse generic placeholders like "The Confession", "Peak Moment", "Slow Fade"

CREATIVE ANGLE FOR THIS EP: ${angle}
${avoidBlock}
User brief (the sonic universe):
${promptComposto}

Generate 5 tracks. Each title should be original, evocative, and hint at its role in the album.

Return ONLY JSON:
{"variacoes":[{"titulo":"track 1 · role hint","prompt":"..."},{"titulo":"track 2 · role hint","prompt":"..."},{"titulo":"track 3 · role hint","prompt":"..."},{"titulo":"track 4 · role hint","prompt":"..."},{"titulo":"track 5 · role hint","prompt":"..."}]}`;
      const data = await chamarAI({ messages: [{ role: 'user', content: brief }], max_tokens: 2500 });
      const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      const p = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const variantes = p.variacoes || [];
      setAiVariants(prev => [...variantes, ...prev]);
      setPromptGenerations(prev => [
        { id: 'g' + Date.now(), ts: Date.now(), kind: 'album', items: variantes, expanded: true },
        ...prev.map(g => ({ ...g, expanded: false })),
      ]);
      variantes.forEach(v => adicionarAoHistorico(v.prompt, 'prompt', v.titulo));
    } catch (err) {
      handleAIError(err, 'err_variants');
    } finally {
      stopPhases();
      setLoadingPrompt(false); setLoadingKind(null);
    }
  };

  const gerarLetra = async () => {
    setLoadingLetra(true); setLoadingKind('letra'); setErrorMsg('');
    const stopPhases = startPhaseCycle(t.phases_letra);
    const tc = TAMANHOS_LETRA.find(x => x.id === tamanhoLetra) || TAMANHOS_LETRA[2];
    const targetVersos = numVersos > 0 ? numVersos : tc.versos;
    const targetRefroes = numRefroes > 0 ? numRefroes : tc.refroes;
    const targetIdiomas = idiomas.length ? idiomas.join(' / ') : 'Brazilian Portuguese';
    try {
      const brief = `You are an experienced songwriter. Write ONE original evocative song with these specs.

━━━ SIZE LIMITS (STRICT) ━━━
Target: ${tc.id}
MAX characters: ${tc.chars}
Verses: ${targetVersos}
Chorus repetitions: ${targetRefroes}
Meter: ${metricas.join(', ') || 'balanced'}

DO NOT exceed ${tc.chars} characters. Cut verses if needed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lyrics language: ${targetIdiomas}
Genre: ${generos.join(', ') || 'open'}
Tone: ${moods.join(', ') || 'open'}
Duration: ${duracoes.map(getDurationEN).join(' to ') || 'standard'}
Era: ${eras.join(', ') || 'timeless'}
Perspective: ${perspectivas.join(', ') || 'open'}
Structure: ${estruturas.join(' OR ') || 'verse/chorus/verse/chorus/bridge/chorus'}
Rhyme: ${rimas.join(', ') || 'open'}
Theme: ${tema || '(pick a coherent theme)'}
Concrete imagery: ${elementos || '(create original sensory imagery)'}
Hook: ${refraoChave || '(create a catchy original chorus)'}

━━━ CRITICAL SUNO RULES ━━━
Suno ONLY recognizes structural tags in ENGLISH. NEVER use [Verso], [Refrão], [Estrofa], [Couplet] — these are READ AS LYRICS by the singer and ruin the song.

USE ONLY these EXACT tags:
[Intro] [Verse 1] [Verse 2] [Verse 3] [Pre-Chorus] [Chorus] [Bridge]
[Instrumental] [Instrumental Break] [Outro] [End]

The lyrics themselves stay in: ${targetIdiomas}. Only TAGS are in English.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANDATORY:
1. Use ONLY English tags above.
2. DO NOT exceed ${tc.chars} chars.
3. For "micro"/"curta" — radically lean.
4. Concrete sensory imagery, no abstraction.
5. Avoid clichés.
6. No real artists or brands.
7. Consistent meter.
8. Memorable chorus, write fully ONCE then [Chorus] tags.
9. NO TEXT before first [Intro] or [Verse 1]. No comments, no preamble.
10. First line MUST start with [.

Return ONLY the formatted lyrics, copy-paste-ready for Suno.

━━━ TITLE ━━━
Before the lyrics, output a single line:
TITLE: [Song Title]

Then a blank line, then the lyrics starting with [Intro] or [Verse 1].
The TITLE line is for our app to display the song name — it will not be sent to Suno.`;
      const data = await chamarAI({ messages: [{ role: 'user', content: brief }], max_tokens: 2000 });
      const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      const titleMatch = txt.match(/^\s*TITLE:\s*(.+?)\s*$/im);
      const songTitle = titleMatch ? titleMatch[1].trim() : (tema || 'Untitled');
      const lyricsBody = txt.replace(/^\s*TITLE:\s*.+$/im, '').trim();
      const limpa = sanitizarLetra(lyricsBody);
      setLetrasHistorico(prev => [{ titulo: songTitle, letra: limpa, ts: Date.now() }, ...prev]);
      adicionarAoHistorico(limpa, 'letra', songTitle);
      setLyricsGenerations(prev => [
        { id: 'lg' + Date.now(), ts: Date.now(), kind: 'avulsa', items: [{ titulo: songTitle, letra: limpa }], expanded: true },
        ...prev.map(g => ({ ...g, expanded: false })),
      ]);
    } catch (err) {
      handleAIError(err, 'err_letra');
    } finally {
      stopPhases();
      setLoadingLetra(false); setLoadingKind(null);
    }
  };

  const gerarLetrasAlbum = async () => {
    setLoadingLetra(true); setLoadingKind('letrasAlbum'); setErrorMsg('');
    const stopPhases = startPhaseCycle(t.phases_letras_album);
    const tc = TAMANHOS_LETRA.find(x => x.id === tamanhoLetra) || TAMANHOS_LETRA[2];
    const targetIdiomas = idiomas.length ? idiomas.join(' / ') : 'Brazilian Portuguese';
    // Collect titles from past EP-lyric generations so the AI doesn't repeat
    // them when the user re-rolls with the same brief.
    const previousAlbumTitles = lyricsGenerations
      .filter(g => g.kind === 'letrasAlbum')
      .flatMap(g => (g.items || []).map(v => v && v.titulo).filter(Boolean))
      .slice(0, 30);
    const avoidBlock = previousAlbumTitles.length
      ? `\nALREADY-GENERATED TITLES IN THIS SESSION (do NOT reuse, do NOT use close variations):\n${previousAlbumTitles.map(s => `- ${s}`).join('\n')}\n`
      : '';
    try {
      const brief = `You are a songwriter writing the LYRICS for a 5-track cohesive EP. The user has set a sonic universe and a thematic core. Write 5 ORIGINAL songs that share the same emotional/conceptual world but explore DIFFERENT facets of it — like an album narrative arc.
${avoidBlock}

━━━ CRITICAL: VARY THE SUBJECT MATTER ━━━
The 5 tracks must NOT repeat the same topic. They share the same UNIVERSE but each song looks at it from a DIFFERENT angle, character, time period, or perspective.

Example: if the central theme is "a father protects his family":
  ✅ Track 1: father's daily routine of vigilance
  ✅ Track 2: a memory from his own childhood
  ✅ Track 3: the day he realized he couldn't protect everyone
  ✅ Track 4: his daughter watching him grow old
  ✅ Track 5: him now teaching a grandchild

  ❌ AVOID: 5 songs all about the same topic with the same hook idea repeated.

━━━ NARRATIVE ARC (think of it like a 5-act story) ━━━
Track 1 — OPENING: establish the world, set the emotional baseline. Subject A.
Track 2 — INTRODUCTION: deepen the story, introduce a related but DIFFERENT conflict. Subject B.
Track 3 — TURNING POINT: shift perspective or time. Subject C, NOT a rephrase of A or B.
Track 4 — DESCENT: aftermath, doubt, OR completely different angle. Subject D.
Track 5 — CLOSING: resolution. Subject E that loops back to A but with new meaning.

Each track must have a UNIQUE subject within the shared universe. Each chorus must have a DIFFERENT central image — DO NOT reuse the same metaphor or hook idea across tracks.

━━━ SIZE PER TRACK ━━━
Target size: ${tc.id}
MAX characters per track: ${tc.chars}
Verses per track: 6-10 narrative lines
Chorus repetitions per track: 2-3

DO NOT exceed ${tc.chars} characters per track. Lean is better than bloated.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ THEMATIC + STYLISTIC SHARED CONTEXT ━━━
Lyrics language: ${targetIdiomas}
Genre: ${generos.join(', ') || 'open'}
Tone: ${moods.join(', ') || 'open'}
Era: ${eras.join(', ') || 'timeless'}
Perspective: ${perspectivas.join(', ') || 'open'}
Rhyme: ${rimas.join(', ') || 'open'}
Meter: ${metricas.join(', ') || 'balanced'}
Central theme of the EP: ${tema || '(invent a coherent thematic core)'}
Concrete imagery (recurring across tracks): ${elementos || '(create original recurring sensory imagery)'}
Hook of the title track: ${refraoChave || '(create a memorable hook)'}

IMPORTANT: Some imagery, motifs, or phrases should ECHO across tracks — recurring images, characters, places — so the album feels like ONE work, not 5 disconnected songs. But each track must STAND ALONE as a complete song.

━━━ CRITICAL SUNO RULES ━━━
Suno ONLY recognizes structural tags in ENGLISH. NEVER use [Verso], [Refrão], [Estrofa], [Couplet] — these are READ AS LYRICS by the singer and ruin the song.

USE ONLY these EXACT tags:
[Intro] [Verse 1] [Verse 2] [Verse 3] [Pre-Chorus] [Chorus] [Bridge]
[Instrumental] [Instrumental Break] [Outro] [End]

The lyrics themselves stay in: ${targetIdiomas}. Only TAGS are in English.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANDATORY for every track:
1. Use ONLY English tags above.
2. DO NOT exceed ${tc.chars} chars per track.
3. Concrete sensory imagery, no abstraction.
4. Avoid clichés.
5. No real artists or brands.
6. Memorable chorus per track. Write in full ONCE then [Chorus] tags for repeats.
7. The lyrics field MUST start with an opening bracket [.

Return ONLY this JSON, no preamble, no markdown:
{
  "tracks": [
    {"titulo": "track 1 title", "papel": "Opening (short role hint)", "letra": "[Intro]\nfull formatted lyrics ready for Suno"},
    {"titulo": "track 2 title", "papel": "Introduction", "letra": "..."},
    {"titulo": "track 3 title", "papel": "Turning Point", "letra": "..."},
    {"titulo": "track 4 title", "papel": "Descent", "letra": "..."},
    {"titulo": "track 5 title", "papel": "Closing", "letra": "..."}
  ]
}`;
      const data = await chamarAI({ messages: [{ role: 'user', content: brief }], max_tokens: 8000 });
      const txt = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      const parsed = JSON.parse(txt.replace(/```json|```/g, '').trim());
      const tracks = (parsed.tracks || []).map(tr => ({
        ...tr,
        letra: sanitizarLetra(tr.letra || ''),
      }));
      // log each track to history
      tracks.forEach((tr, i) => adicionarAoHistorico(tr.letra, 'letra', tr.titulo || `Track ${i+1}`));
      setLyricsGenerations(prev => [
        { id: 'lg' + Date.now(), ts: Date.now(), kind: 'album', items: tracks, expanded: true, trackExpanded: { 0: true } },
        ...prev.map(g => ({ ...g, expanded: false })),
      ]);
    } catch (err) {
      handleAIError(err, 'err_letra');
    } finally {
      stopPhases();
      setLoadingLetra(false); setLoadingKind(null);
    }
  };

  const podeGerarPrompt = generos.length || moods.length || tema.trim();
  const podeGerarLetra = tema.trim() || refraoChave.trim() || elementos.trim() || moods.length;

  const favoritosFiltrados = drawerFilter === 'todos' ? favoritos : favoritos.filter(f => f.tipo === drawerFilter);
  const historicoFiltrado = drawerFilter === 'todos' ? historico : historico.filter(f => f.tipo === drawerFilter);
  const itensExibidos = drawerView === 'historico' ? historicoFiltrado : favoritosFiltrados;

  return (
    <div className="min-h-screen w-full bg-stone-100 text-stone-900 relative" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { overflow-x: clip; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .wrap-any { overflow-wrap: anywhere; word-break: break-word; }
        .grain::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 0.06 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
          opacity: 0.35; mix-blend-mode: multiply;
        }
        .glow-amber { box-shadow: 0 0 32px -8px rgba(249, 115, 22, 0.28); }
        .spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input, select, textarea { font-family: inherit; overflow-wrap: anywhere; word-break: break-word; }
        ::selection { background: #f97316; color: #1c1917; }
        /* Custom hover-fill classes — bypass Tailwind purge for hover bg variants */
        .btn-fill-orange:hover { background-color: rgba(249, 115, 22, 0.08) !important; border-color: #f97316 !important; color: #c2410c !important; }
        .btn-fill-red:hover { background-color: rgba(239, 68, 68, 0.08) !important; border-color: #ef4444 !important; color: #dc2626 !important; }
        .btn-fill-stone:hover { background-color: rgba(28, 25, 23, 0.05) !important; border-color: #a8a29e !important; color: #292524 !important; }
        /* On touch-only devices, suppress sticky :hover after tap */
        @media (hover: none) {
          .btn-fill-orange:hover, .btn-fill-red:hover, .btn-fill-stone:hover {
            background-color: transparent !important;
            border-color: inherit !important;
            color: inherit !important;
          }
        }
        button:focus { outline: none; }
        button:focus-visible { outline: none; }

        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #a8a29e; border-radius: 3px; }
        .toast-enter { animation: toastIn 0.25s ease-out; }
        @keyframes toastIn { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @media (max-width: 767px) {
          .sheet-up { animation: sheetUp 0.32s cubic-bezier(0.32, 0.72, 0, 1); }
        }
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .glow-pulse { animation: glowPulse 1.6s ease-in-out infinite; }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 32px -8px rgba(249, 115, 22, 0.4), 0 0 60px -20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 48px -6px rgba(249, 115, 22, 0.7), 0 0 90px -16px rgba(249, 115, 22, 0.5); }
        }
        .scale-in { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes scaleIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        /* Default: hide both, then show in correct media query */
        [data-desktop-only="true"] { display: none !important; }
        [data-mobile-only="true"] { display: none !important; }
        @media (min-width: 768px) {
          [data-desktop-only="true"] { display: block !important; }
          [data-mobile-only="true"] { display: none !important; }
        }
        @media (max-width: 767.98px) {
          [data-mobile-only="true"] { display: block !important; }
          [data-desktop-only="true"] { display: none !important; }
        }
        /* When mobile sheet is open, suppress all box-shadows and animations on the page behind */
        body[data-sheet-open="true"] .glow-amber,
        body[data-sheet-open="true"] .glow-pulse {
          box-shadow: none !important;
          animation: none !important;
        }
      `}</style>

      <div className="grain absolute inset-0 pointer-events-none z-0" />

      <header style={{ backgroundColor: '#0c0a09', borderBottomColor: '#292524' }} className="relative z-[60] border-b px-5 md:px-10 py-5 text-stone-300">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => {
              if (onBack) onBack();
              else { window.location.hash = ''; }
            }}
            className="flex items-center gap-3 group transition-opacity hover:opacity-80 active:scale-95"
            title={t.back_home}>
            <Disc3 className="w-8 h-8 text-orange-500 spin-slow" strokeWidth={1.5} />
            <div className="text-left">
              <div className="font-mono text-[10px] tracking-[0.3em] text-stone-400 uppercase">{t.subtitle}</div>
              <h1 className="font-display text-2xl md:text-3xl tracking-tight leading-none text-stone-50" style={{ fontWeight: 800, fontStyle: 'italic' }}>
                Brahm<span className="text-orange-500">storm</span>
              </h1>
            </div>
          </button>
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button ref={langBtnRef} onClick={() => setLangMenuOpen(v => !v)}
                className="font-mono text-xs uppercase tracking-widest px-3 py-2 border border-stone-700 hover:border-orange-500 hover:text-orange-400 transition-all active:scale-95 flex items-center gap-2 rounded-lg">
                <Globe className="w-3.5 h-3.5" /> {LANGUAGES.find(l => l.id === lang)?.label}
              </button>
              {langMenuOpen && langMenuPos && (
                <>
                  <div className="fixed inset-0 z-[74]" onClick={() => setLangMenuOpen(false)} />
                  <div style={{
                    backgroundColor: '#1c1917',
                    top: `${langMenuPos.top}px`,
                    left: `${langMenuPos.left}px`,
                  }} className="fixed z-[75] border border-stone-700 min-w-[180px] shadow-2xl">
                    {LANGUAGES.map(l => (
                      <button key={l.id} onClick={() => { setLang(l.id); setLangMenuOpen(false); }}
                        className={`w-full text-left px-3 py-3 font-mono text-xs uppercase tracking-widest transition-all active:scale-[0.99] flex items-center gap-2 ${l.id === lang ? 'bg-orange-500/15 text-orange-400' : 'text-stone-300 hover:bg-stone-800 hover:text-stone-50'}`}>
                        <span className="text-base">{l.flag}</span><span className="flex-1">{l.full}</span>
                        {l.id === lang && <Check className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setTipsOpen(true)}
              className="font-mono text-xs uppercase tracking-widest px-3 py-2 border border-stone-700 hover:border-orange-500 hover:text-orange-400 transition-all active:scale-95 flex items-center gap-2 rounded-lg">
              <Lightbulb className="w-3.5 h-3.5" /> {t.tips}
            </button>
            <button onClick={() => setDrawerOpen(true)}
              className="font-mono text-xs uppercase tracking-widest px-3 py-2 border border-stone-700 hover:border-orange-500 hover:text-orange-400 transition-all active:scale-95 flex items-center gap-2 rounded-lg">
              <Archive className="w-3.5 h-3.5" /> {t.favorites} · {favoritos.length}
            </button>
            <button onClick={() => setShortcutsOpen(true)} title={t.shortcuts_title}
              data-desktop-only="true"
              className="hidden md:flex font-mono text-xs uppercase tracking-widest w-8 h-8 border border-stone-700 hover:border-orange-500 hover:text-orange-400 transition-all active:scale-95 items-center justify-center rounded-lg" style={{ fontWeight: 700 }}>
              ?
            </button>
          </div>
        </div>
      </header>

      <div style={{ backgroundColor: 'rgba(28, 25, 23, 0.96)', borderBottomColor: '#292524' }} className="hidden md:block sticky top-0 z-40 backdrop-blur border-b px-5 md:px-10 shadow-lg shadow-stone-900/40">
        <div className="flex gap-0">
          <TabButton active={tab === 'prompt'} onClick={() => setTab('prompt')} icon={FileText} label={t.tab_prompt} sub={t.tab_prompt_sub} />
          <TabButton active={tab === 'letra'} onClick={() => setTab('letra')} icon={MessageSquareQuote} label={t.tab_letra} sub={t.tab_letra_sub} />
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav style={{ backgroundColor: 'rgba(28, 25, 23, 0.96)', borderTopColor: '#292524' }} className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur border-t shadow-2xl shadow-stone-900/40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex">
          <button onClick={() => setTab('prompt')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 border-t-2 transition-all active:scale-95 ${tab === 'prompt' ? 'border-orange-500 text-stone-50' : 'border-transparent text-stone-500'}`}>
            <FileText className={`w-5 h-5 ${tab === 'prompt' ? 'text-orange-500' : ''}`} strokeWidth={1.5} />
            <span className="font-display italic text-sm leading-none" style={{ fontWeight: 700 }}>{t.tab_prompt}</span>
          </button>
          <button onClick={() => setTab('letra')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 border-t-2 transition-all active:scale-95 ${tab === 'letra' ? 'border-orange-500 text-stone-50' : 'border-transparent text-stone-500'}`}>
            <MessageSquareQuote className={`w-5 h-5 ${tab === 'letra' ? 'text-orange-500' : ''}`} strokeWidth={1.5} />
            <span className="font-display italic text-sm leading-none" style={{ fontWeight: 700 }}>{t.tab_letra}</span>
          </button>
        </div>
      </nav>

      {/* Desktop-only: floating index sidebar with quick jumps to blocks */}
      <IndexNav tab={tab}
        promptCounts={{ genero: generos.length, mood: moods.length, tema: tema.trim() ? 1 : 0, instr: instrumentos.length, voz: vozes.length, era: eras.length, prod: producoes.length, tempo: tempos.length, neg: negativos.trim() ? 1 : 0 }}
        letraCounts={{ ltema: tema.trim() ? 1 : 0, lmood: moods.length, lgen: generos.length, refrao: refraoChave.trim() ? 1 : 0, ltam: tamanhoLetra ? 1 : 0, lcount: (numVersos > 0 || numRefroes > 0) ? 1 : 0, lmetr: metricas.length, lpersp: perspectivas.length, lstr: estruturas.length, lrhy: rimas.length, lera: eras.length, lidi: idiomas.length, lelem: elementos.trim() ? 1 : 0 }}
        labels={t}
        onOpen={(id) => setOpenBlocks({ [id]: true })} />

      <main className="relative z-10 px-5 md:px-10 py-8 md:py-10 pb-24 md:pb-10 max-w-[1400px] mx-auto">
        {/* Daily quota card — hidden for owner (unlimited), shown to everyone else.
            Becomes a soft red tint when 0 generations remain. */}
        {(() => {
          const isOwnerLocal = quota && quota.owner;
          if (isOwnerLocal) return null;
          const used = quota && typeof quota.used === 'number' ? quota.used : 0;
          const limit = quota && typeof quota.limit === 'number' ? quota.limit : 5;
          const remaining = Math.max(0, limit - used);
          const exhausted = remaining === 0 && quota !== null;
          // tickClock is referenced so the timer re-evaluates each minute
          const _ = tickClock;
          const cardBg = exhausted
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-orange-500/8 border-orange-500/30';
          const accent = exhausted ? 'text-red-700' : 'text-orange-700';
          return (
            <div className={`mb-6 rounded-xl border ${cardBg} px-4 py-3 flex items-center justify-between gap-4 flex-wrap`}>
              <div className="flex items-center gap-3 min-w-0">
                {exhausted ? (
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${accent}`} />
                ) : (
                  <Sparkles className={`w-4 h-4 flex-shrink-0 ${accent}`} />
                )}
                <div className="min-w-0">
                  <div className={`font-mono text-[11px] uppercase tracking-[0.2em] ${accent}`} style={{ fontWeight: 600 }}>
                    {exhausted
                      ? (t.quota_card_exhausted || 'daily limit reached')
                      : `${remaining} / ${limit} ${t.quota_card_remaining || 'generations remaining today'}`}
                  </div>
                  <div className="font-display italic text-sm text-stone-600 mt-0.5 wrap-any">
                    {exhausted
                      ? <>{t.quota_card_resets_in || 'resets in'} <strong className="font-mono not-italic">{formatTimeUntilReset(msUntilNextUTCMidnight())}</strong></>
                      : (t.quota_card_sub || 'shared between prompt and lyrics generations')}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-3 min-w-0" onTouchStart={onSwipeStart} onTouchEnd={onSwipeEnd}>
            {/* Brief livre */}
            <div className="relative rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-500/15 via-orange-500/8 to-transparent p-5 mb-2 glow-amber">
              <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Wand2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div className="font-mono text-[13px] uppercase tracking-[0.2em] text-orange-700" style={{ fontWeight: 700 }}>{t.inspiration_title}</div>
                </div>
                {briefLivre.trim() && (
                  <button onClick={() => setBriefLivre('')} title={t.clear_inspiration}
                    className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border border-orange-500/30 text-orange-700/70 hover:border-red-500 hover:text-red-600 transition-all active:scale-90 flex items-center gap-1.5 flex-shrink-0">
                    <Eraser className="w-3 h-3" /> {t.clear}
                  </button>
                )}
              </div>
              <p className="font-display italic text-sm text-stone-600 mb-3 wrap-any" style={{ fontWeight: 400 }}>
                {tab === 'prompt' ? t.inspiration_prompt_sub : t.inspiration_letra_sub}
              </p>
              <textarea data-brief-input="true" value={briefLivre} onChange={e => setBriefLivre(e.target.value)}
                placeholder={tab === 'prompt' ? t.inspiration_prompt_ph : t.inspiration_letra_ph} rows={3}
                className="wrap-any w-full max-w-full bg-stone-100/70 border border-stone-300 focus:border-orange-500 focus:outline-none p-3 rounded-lg font-display text-base placeholder:text-stone-400 resize-none transition-colors mb-3" />
              <button onClick={preencherComIA} disabled={loadingPreencher || !briefLivre.trim()}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-stone-300 disabled:text-stone-500 text-stone-900 font-mono text-xs uppercase tracking-[0.2em] px-4 py-3 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:cursor-not-allowed">
                {loadingPreencher ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.interpreting}</> : <><Wand2 className="w-4 h-4" /> {t.fill_with_ai}</>}
              </button>
              {errorMsg && (
                <div className="font-mono text-[11px] text-red-600 text-center mt-3 flex items-center justify-center gap-2">
                  {errorMsg === t.err_daily_limit ? (
                    <>
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      <span>{errorMsg} <strong className="font-mono">{formatTimeUntilReset(msUntilNextUTCMidnight())}</strong></span>
                    </>
                  ) : (
                    <p>{errorMsg}</p>
                  )}
                </div>
              )}
            </div>

            {/* Reference track */}
            <div className="relative rounded-2xl border border-stone-400 bg-stone-50/60 p-5 mb-2">
              <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Music2 className="w-4 h-4 text-stone-700 flex-shrink-0" />
                  <div className="font-mono text-[13px] uppercase tracking-[0.2em] text-stone-700" style={{ fontWeight: 700 }}>{t.ref_title}</div>
                  {refResult && (
                    <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border flex-shrink-0 ${
                      refResult.confidence === 'high' ? 'border-emerald-600/50 text-emerald-700 bg-emerald-50' :
                      refResult.confidence === 'medium' ? 'border-amber-600/50 text-amber-700 bg-amber-50' :
                      'border-stone-400 text-stone-500 bg-stone-100'
                    }`}>
                      {refResult.confidence === 'high' ? t.ref_confidence_high :
                       refResult.confidence === 'medium' ? t.ref_confidence_medium :
                       t.ref_confidence_low}
                    </span>
                  )}
                </div>
                {referencia.trim() && (
                  <button onClick={() => { setReferencia(''); setRefResult(null); }} title={t.ref_clear}
                    className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border border-stone-400 text-stone-500 hover:border-red-500 hover:text-red-600 transition-all active:scale-90 flex items-center gap-1.5 flex-shrink-0">
                    <Eraser className="w-3 h-3" /> {t.clear}
                  </button>
                )}
              </div>
              <p className="font-display italic text-sm text-stone-600 mb-3 wrap-any" style={{ fontWeight: 400 }}>
                {tab === 'prompt' ? t.ref_sub_prompt : t.ref_sub_letra}
              </p>
              <textarea value={referencia} onChange={e => { setReferencia(e.target.value); if (refResult) setRefResult(null); }}
                placeholder={t.ref_ph} rows={3}
                className="wrap-any w-full max-w-full bg-white border border-stone-300 focus:border-stone-700 focus:outline-none p-3 rounded-lg font-display text-base placeholder:text-stone-400 resize-none transition-colors mb-2" />
              {referencia.trim() && (() => {
                const tipoLive = detectarTipoReferencia(referencia);
                const labelMap = { url: t.ref_detected_url, lyrics: t.ref_detected_lyrics, track: t.ref_detected_track };
                return (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">· {labelMap[tipoLive] || ''}</p>
                );
              })()}
              <button onClick={analisarReferencia} disabled={loadingRef || !referencia.trim()}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 text-stone-50 font-mono text-xs uppercase tracking-[0.2em] px-4 py-3 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:cursor-not-allowed">
                {loadingRef ? <><Loader2 className="w-4 h-4 animate-spin" /> {loadingPhase || t.ref_analyzing}</> : <><Music2 className="w-4 h-4" /> {t.ref_analyze}</>}
              </button>
              {refResult?.message && (
                <p className="font-display italic text-[13px] text-stone-700 mt-3 wrap-any leading-relaxed border-t border-stone-300 pt-3">
                  {refResult.message}
                </p>
              )}
              <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mt-3 italic">
                {t.ref_warning}
              </p>
            </div>

            <div ref={blocksRef} className="scroll-mt-24" />

            {/* Quick-start presets (prompt tab only) */}
            {tab === 'prompt' && (
              <div className="rounded-xl border border-stone-300 bg-white/40 p-4 mb-2">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-700">{t.presets_title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-400 italic">· {t.presets_sub}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.filter(p => FEATURED_PRESET_IDS.includes(p.id)).map(p => (
                    <button key={p.id} onClick={() => applyPreset(p)}
                      className="font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-2 rounded-lg border border-stone-300 text-stone-700 btn-fill-orange transition-all active:scale-[0.97] flex items-center gap-2">
                      <span className="text-base leading-none">{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                  <button onClick={() => setPresetsModalOpen(true)}
                    className="font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-2 rounded-lg border border-orange-500/40 bg-orange-500/5 text-orange-700 btn-fill-orange transition-all active:scale-[0.97] flex items-center gap-2">
                    <span>{t.presets_browse_all || 'browse all'} ({PRESETS.length}) →</span>
                  </button>
                </div>
              </div>
            )}

            {tab === 'prompt' && (
              <div className="pt-8 mb-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <Sliders className="w-4 h-4 text-stone-500 flex-shrink-0" />
                  <div>
                    <div className="font-mono text-[13px] uppercase tracking-[0.2em] text-stone-800" style={{ fontWeight: 700 }}>
                      {t.be_producer_title}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-400 italic mt-0.5">
                      {t.be_producer_sub}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-stone-100 border border-stone-300 rounded-lg p-1">
                  <button onClick={() => setProducerTab('producer')}
                    className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-md transition-all ${producerTab === 'producer' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
                    {t.tab_producer || 'producer'}
                  </button>
                  <button onClick={() => setProducerTab('advanced')}
                    className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${producerTab === 'advanced' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
                    {t.tab_advanced || 'advanced'}
                    {(drumMachines.length + synths.length + mics.length) > 0 && (
                      <span className="font-mono text-[8px] tabular-nums px-1 py-0.5 rounded-sm bg-orange-500 text-stone-900" style={{ fontWeight: 700 }}>
                        {drumMachines.length + synths.length + mics.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {tab === 'prompt' && producerTab === 'producer' && (
              <>
                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} keyId="genero" label={t.lbl_genre} count={generos.length} max={MULTI_LIMITS.generos} limitHint={t.limit_hint}
                  preview={generos.map(k => getGenreLabel(k, lang))} open={openBlocks.genero} onToggle={toggleBlock}
                  onClear={() => setGeneros([])} tClear={t.block_clear} tOpen={t.block_open}>
                  {Object.entries(GENEROS_CATS_KEYS).map(([catKey, items]) => (
                    <div key={catKey} className="mb-5 last:mb-0">
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-2 pb-1 border-b border-stone-300">
                        {CAT_LABELS[lang][catKey]}
                      </div>
                      <div className="grid grid-cols-1 gap-1 min-w-0">
                        {sortByLabel(items, getGenreLabel, lang).map(o => {
                          const active = generos.includes(o.key);
                          return (
                            <button key={o.key} onClick={() => toggleItem(generos, setGeneros, o.key, MULTI_LIMITS.generos)}
                              className={`flex items-start gap-2 px-2.5 py-2 rounded-md border text-left transition-all active:scale-[0.98] min-w-0 ${active ? 'border-orange-500 bg-orange-500/15' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-200'}`}>
                              <span className="pt-0.5 flex-shrink-0"><CheckBox active={active} /></span>
                              <span className="min-w-0 flex-1 flex items-baseline gap-2 flex-wrap">
                                <span className={`font-mono text-[11px] leading-4 wrap-any ${active ? 'text-orange-800' : 'text-stone-700'}`}>{getGenreLabel(o.key, lang)}</span>
                                <span className={`font-display italic text-[11px] leading-4 wrap-any ${active ? 'text-orange-700/60' : 'text-stone-500/70'}`}>{o.refs}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} keyId="mood" label={t.lbl_mood} count={moods.length} max={MULTI_LIMITS.moods} limitHint={t.limit_hint} preview={moods.map(k => getMoodLabel(k, lang))}
                  open={openBlocks.mood} onToggle={toggleBlock} onClear={() => setMoods([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <GridSelect options={sortByLabel(MOODS_KEYS, getMoodLabel, lang)} values={moods}
                    onToggle={(k) => toggleItem(moods, setMoods, k, MULTI_LIMITS.moods)} getLabel={(k) => getMoodLabel(k, lang)} />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="instr" label={t.lbl_instruments} count={instrumentos.length} max={MULTI_LIMITS.instrumentos} limitHint={t.limit_hint} preview={instrumentos.map(k => getInstrLabel(k, lang))}
                  open={openBlocks.instr} onToggle={toggleBlock} onClear={() => setInstrumentos([])} tClear={t.block_clear} tOpen={t.block_open}>
                  {Object.entries(INSTRUMENTOS_CATS_KEYS).map(([catKey, items]) => (
                    <div key={catKey} className="mb-5 last:mb-0">
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-2 pb-1 border-b border-stone-300">
                        {INSTR_CAT_LABELS[lang][catKey]}
                      </div>
                      <GridSelect options={sortByLabel(items, getInstrLabel, lang)} values={instrumentos}
                        onToggle={(k) => toggleItem(instrumentos, setInstrumentos, k, MULTI_LIMITS.instrumentos)} getLabel={(k) => getInstrLabel(k, lang)} />
                    </div>
                  ))}
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="voz" label={t.lbl_vocals} count={vozes.length} max={MULTI_LIMITS.vozes} limitHint={t.limit_hint} preview={vozes.map(k => getVozLabel(k, lang))}
                  open={openBlocks.voz} onToggle={toggleBlock} onClear={() => setVozes([])} tClear={t.block_clear} tOpen={t.block_open}>
                  {Object.entries(VOZES_CATS_KEYS).map(([catKey, items]) => (
                    <div key={catKey} className="mb-5 last:mb-0">
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-2 pb-1 border-b border-stone-300">
                        {VOZES_CAT_LABELS[lang]?.[catKey] || VOZES_CAT_LABELS.en[catKey]}
                      </div>
                      <div className="grid grid-cols-1 gap-1 min-w-0">
                        <ListSelect options={sortByLabel(items, getVozLabel, lang)} values={vozes}
                          onToggle={(k) => toggleItem(vozes, setVozes, k, MULTI_LIMITS.vozes)} getLabel={(k) => getVozLabel(k, lang)} />
                      </div>
                    </div>
                  ))}
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="era" label={t.lbl_era} count={eras.length} max={MULTI_LIMITS.eras} limitHint={t.limit_hint} preview={eras.map(k => getEraLabel(k, lang))}
                  open={openBlocks.era} onToggle={toggleBlock} onClear={() => setEras([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={ERAS_KEYS} values={eras}
                    onToggle={(k) => toggleItem(eras, setEras, k, MULTI_LIMITS.eras)} getLabel={(k) => getEraLabel(k, lang)} />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="prod" label={t.lbl_production} count={producoes.length} max={MULTI_LIMITS.producoes} limitHint={t.limit_hint} preview={producoes.map(k => getProdLabel(k, lang))}
                  open={openBlocks.prod} onToggle={toggleBlock} onClear={() => setProducoes([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={sortByLabel(PRODUCOES_KEYS, getProdLabel, lang)} values={producoes}
                    onToggle={(k) => toggleItem(producoes, setProducoes, k, MULTI_LIMITS.producoes)} getLabel={(k) => getProdLabel(k, lang)} />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="tempo" label={t.lbl_tempo} count={tempos.length} preview={tempos.map(k => getTempoLabel(k, lang))}
                  open={openBlocks.tempo} onToggle={toggleBlock} onClear={() => setTempos([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <div className="space-y-1">
                    {TEMPOS_KEYS.map(tm => {
                      const active = tempos.includes(tm.key);
                      return (
                        <button key={tm.key} onClick={() => toggleSingle(tempos, setTempos, tm.key)}
                          className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border transition-all active:scale-[0.99] ${active ? 'border-orange-500 bg-orange-500/15 text-orange-700' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>
                          <span className="flex items-center gap-2.5 min-w-0">
                            <RadioDot active={active} />
                            <span className="font-display italic truncate leading-4" style={{ fontWeight: 500 }}>{getTempoLabel(tm.key, lang)}</span>
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-widest flex-shrink-0">{tm.bpm}</span>
                        </button>
                      );
                    })}
                  </div>
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} keyId="tema" label={t.lbl_theme} count={tema.trim() ? 1 : 0} preview={tema ? [tema] : []}
                  open={openBlocks.tema} onToggle={toggleBlock} onClear={() => setTema('')} tClear={t.block_clear} tOpen={t.block_open}>
                  <textarea value={tema} onChange={e => setTema(e.target.value)} placeholder={t.ph_theme} rows={3}
                    className="wrap-any w-full max-w-full bg-stone-200 border border-stone-300 focus:border-orange-500 focus:outline-none p-3 rounded-lg font-display text-base placeholder:text-stone-400 resize-none transition-colors" />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="negativos" label={t.lbl_negative} count={negativos.trim() ? 1 : 0} preview={negativos ? [negativos] : []}
                  open={openBlocks.negativos} onToggle={toggleBlock} onClear={() => setNegativos('')} tClear={t.block_clear} tOpen={t.block_open}>
                  <textarea value={negativos} onChange={e => setNegativos(e.target.value)} placeholder={t.ph_negative} rows={2}
                    className="wrap-any w-full max-w-full bg-stone-200 border border-stone-300 focus:border-orange-500 focus:outline-none p-3 rounded-lg font-display text-base placeholder:text-stone-400 resize-none transition-colors" />
                </Block>

                <button onClick={(e) => { setMobileShowAdvanced(v => !v); e.currentTarget.blur(); }}
                  className="md:hidden w-full font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-3 border border-stone-400 text-stone-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 rounded-xl">
                  {mobileShowAdvanced ? <>− {t.hide_advanced}</> : <>+ {t.show_all}</>}
                </button>
              </>
            )}

            {tab === 'prompt' && producerTab === 'advanced' && (
              <>
                <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-4 py-3 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Sliders className="w-3.5 h-3.5 text-orange-700 flex-shrink-0" />
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-700" style={{ fontWeight: 700 }}>{t.advanced_intro_title || 'vintage gear · pro mode'}</div>
                  </div>
                  <p className="font-display italic text-sm text-stone-600 leading-relaxed">
                    {t.advanced_intro_sub || 'Hand-picked equipment Suno consistently reproduces.'}
                  </p>
                </div>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData}
                  keyId="drumMachines" label={t.lbl_drum_machines || 'Drum machines'} count={drumMachines.length} max={MULTI_LIMITS.drum_machines} limitHint={t.limit_hint}
                  preview={drumMachines} open={openBlocks.drumMachines} onToggle={toggleBlock}
                  onClear={() => setDrumMachines([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={DRUM_MACHINES_KEYS} values={drumMachines}
                    onToggle={(k) => toggleItem(drumMachines, setDrumMachines, k, MULTI_LIMITS.drum_machines)}
                    getLabel={(k) => k} getHint={(k) => getDrumHint(k, lang)} />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData}
                  keyId="synths" label={t.lbl_synths || 'Vintage synths & keys'} count={synths.length} max={MULTI_LIMITS.synths} limitHint={t.limit_hint}
                  preview={synths} open={openBlocks.synths} onToggle={toggleBlock}
                  onClear={() => setSynths([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={SYNTHS_KEYS} values={synths}
                    onToggle={(k) => toggleItem(synths, setSynths, k, MULTI_LIMITS.synths)}
                    getLabel={(k) => k} getHint={(k) => getSynthHint(k, lang)} />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData}
                  keyId="mics" label={t.lbl_mics || 'Microphones · recording'} count={mics.length} max={MULTI_LIMITS.mics} limitHint={t.limit_hint}
                  preview={mics} open={openBlocks.mics} onToggle={toggleBlock}
                  onClear={() => setMics([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={MICS_KEYS} values={mics}
                    onToggle={(k) => toggleItem(mics, setMics, k, MULTI_LIMITS.mics)}
                    getLabel={(k) => k} getHint={(k) => getMicHint(k, lang)} />
                </Block>
              </>
            )}

            {tab === 'letra' && (
              <>
                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} keyId="ltema" label={t.lbl_theme_letra} count={tema.trim() ? 1 : 0} preview={tema ? [tema] : []}
                  open={openBlocks.ltema} onToggle={toggleBlock} onClear={() => setTema('')} tClear={t.block_clear} tOpen={t.block_open}>
                  <textarea value={tema} onChange={e => setTema(e.target.value)} placeholder={t.ph_theme_letra} rows={3}
                    className="wrap-any w-full max-w-full bg-stone-200 border border-stone-300 focus:border-orange-500 focus:outline-none p-3 rounded-lg font-display text-base placeholder:text-stone-400 resize-none transition-colors" />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} keyId="lmood" label={t.lbl_mood_letra} count={moods.length} max={MULTI_LIMITS.moods} limitHint={t.limit_hint} preview={moods.map(k => getMoodLabel(k, lang))}
                  open={openBlocks.lmood} onToggle={toggleBlock} onClear={() => setMoods([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <GridSelect options={sortByLabel(MOODS_KEYS, getMoodLabel, lang)} values={moods}
                    onToggle={(k) => toggleItem(moods, setMoods, k, MULTI_LIMITS.moods)} getLabel={(k) => getMoodLabel(k, lang)} />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="lgen" label={t.lbl_genre_letra} count={generos.length} max={MULTI_LIMITS.generos} limitHint={t.limit_hint} preview={generos.map(k => getGenreLabel(k, lang))}
                  open={openBlocks.lgen} onToggle={toggleBlock} onClear={() => setGeneros([])} tClear={t.block_clear} tOpen={t.block_open}>
                  {Object.entries(GENEROS_CATS_KEYS).map(([catKey, items]) => (
                    <div key={catKey} className="mb-5 last:mb-0">
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-700 font-bold mb-2 pb-1 border-b border-stone-300">
                        {CAT_LABELS[lang][catKey]}
                      </div>
                      <div className="grid grid-cols-1 gap-1 min-w-0">
                        {sortByLabel(items, getGenreLabel, lang).map(o => {
                          const active = generos.includes(o.key);
                          return (
                            <button key={o.key} onClick={() => toggleItem(generos, setGeneros, o.key, MULTI_LIMITS.generos)}
                              className={`flex items-start gap-2 px-2.5 py-2 rounded-md border text-left transition-all active:scale-[0.98] min-w-0 ${active ? 'border-orange-500 bg-orange-500/15' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-200'}`}>
                              <span className="pt-0.5 flex-shrink-0"><CheckBox active={active} /></span>
                              <span className="min-w-0 flex-1 flex items-baseline gap-2 flex-wrap">
                                <span className={`font-mono text-[11px] leading-4 wrap-any ${active ? 'text-orange-800' : 'text-stone-700'}`}>{getGenreLabel(o.key, lang)}</span>
                                <span className={`font-display italic text-[11px] leading-4 wrap-any ${active ? 'text-orange-700/60' : 'text-stone-500/70'}`}>{o.refs}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} keyId="ltam" label={t.lbl_size} count={tamanhoLetra ? 1 : 0} preview={tamanhoLetra ? [t[`size_${tamanhoLetra}`]] : []}
                  open={openBlocks.ltam} onToggle={toggleBlock} tClear={t.block_clear} tOpen={t.block_open}>
                  <div className="space-y-1">
                    {TAMANHOS_LETRA.map(tm => {
                      const active = tamanhoLetra === tm.id;
                      return (
                        <button key={tm.id} onClick={() => aplicarTamanho(tm.id)}
                          className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border transition-all active:scale-[0.99] ${active ? 'border-orange-500 bg-orange-500/15' : 'border-stone-300 hover:border-stone-500'}`}>
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-3 h-3 rounded-full border flex-shrink-0 transition-all ${active ? 'bg-orange-500 border-orange-500' : 'border-stone-500'}`} />
                            <span className="min-w-0">
                              <span className={`font-display italic block ${active ? 'text-orange-800' : 'text-stone-800'}`} style={{ fontWeight: 600 }}>{t[`size_${tm.id}`]}</span>
                              <span className="font-mono text-[10px] text-stone-500 block">{t[`size_${tm.id}_sub`]}</span>
                            </span>
                          </span>
                          <span className={`font-mono text-[10px] tracking-widest flex-shrink-0 tabular-nums ${active ? 'text-orange-700' : 'text-stone-500'}`}>~{tm.chars}c</span>
                        </button>
                      );
                    })}
                  </div>
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="lcount" label={t.lbl_verses} count={(numVersos > 0 || numRefroes > 0) ? 1 : 0} preview={(numVersos > 0 || numRefroes > 0) ? [`${numVersos} · ${numRefroes}`] : []}
                  open={openBlocks.lcount} onToggle={toggleBlock} tClear={t.block_clear} tOpen={t.block_open}>
                  <div className="space-y-3">
                    <Stepper label={t.verses_count} sub={t.verses_sub} value={numVersos} onChange={setNumVersos} min={0} max={24} step={2} />
                    <Stepper label={t.chorus_count} sub={t.chorus_sub} value={numRefroes} onChange={setNumRefroes} min={0} max={5} step={1} />
                    <p className="font-mono text-[10px] text-stone-500 leading-relaxed pt-1 border-t border-stone-300">{t.verses_tip}</p>
                  </div>
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="lmetr" label={t.lbl_meter} count={metricas.length} preview={metricas.map(k => getMetrLabel(k, lang))}
                  open={openBlocks.lmetr} onToggle={toggleBlock} onClear={() => setMetricas([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={METRICAS_KEYS} values={metricas}
                    onToggle={(k) => toggleSingle(metricas, setMetricas, k)} getLabel={(k) => getMetrLabel(k, lang)} single />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="persp" label={t.lbl_perspective} count={perspectivas.length} preview={perspectivas.map(k => getPerspLabel(k, lang))}
                  open={openBlocks.persp} onToggle={toggleBlock} onClear={() => setPerspectivas([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={sortByLabel(PERSP_KEYS, getPerspLabel, lang)} values={perspectivas}
                    onToggle={(k) => toggleSingle(perspectivas, setPerspectivas, k)} getLabel={(k) => getPerspLabel(k, lang)} single />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="estr" label={t.lbl_structure} count={estruturas.length} preview={estruturas.map(k => getEstrLabel(k, lang))}
                  open={openBlocks.estr} onToggle={toggleBlock} onClear={() => setEstruturas([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={sortByLabel(ESTRUTURAS_KEYS, getEstrLabel, lang)} values={estruturas}
                    onToggle={(k) => toggleSingle(estruturas, setEstruturas, k)} getLabel={(k) => getEstrLabel(k, lang)} single />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="rima" label={t.lbl_rhyme} count={rimas.length} preview={rimas.map(k => getRimaLabel(k, lang))}
                  open={openBlocks.rima} onToggle={toggleBlock} onClear={() => setRimas([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={sortByLabel(RIMAS_KEYS, getRimaLabel, lang)} values={rimas}
                    onToggle={(k) => toggleSingle(rimas, setRimas, k)} getLabel={(k) => getRimaLabel(k, lang)} single />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="lera" label={t.lbl_era} count={eras.length} max={MULTI_LIMITS.eras} limitHint={t.limit_hint} preview={eras.map(k => getEraLabel(k, lang))}
                  open={openBlocks.lera} onToggle={toggleBlock} onClear={() => setEras([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <ListSelect options={ERAS_KEYS} values={eras}
                    onToggle={(k) => toggleItem(eras, setEras, k, MULTI_LIMITS.eras)} getLabel={(k) => getEraLabel(k, lang)} />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="lidi" label={t.lbl_language} count={idiomas.length} preview={idiomas.map(k => getIdiomaLabel(k, lang))}
                  open={openBlocks.lidi} onToggle={toggleBlock} onClear={() => setIdiomas([])} tClear={t.block_clear} tOpen={t.block_open}>
                  <GridSelect options={sortByLabel(IDIOMAS_KEYS, getIdiomaLabel, lang)} values={idiomas}
                    onToggle={(k) => toggleSingle(idiomas, setIdiomas, k)} getLabel={(k) => getIdiomaLabel(k, lang)} single />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} className={advancedBlockClass} keyId="elem" label={t.lbl_elements} count={elementos.trim() ? 1 : 0} preview={elementos ? [elementos] : []}
                  open={openBlocks.elem} onToggle={toggleBlock} onClear={() => setElementos('')} tClear={t.block_clear} tOpen={t.block_open}>
                  <textarea value={elementos} onChange={e => setElementos(e.target.value)} placeholder={t.ph_elements} rows={3}
                    className="wrap-any w-full max-w-full bg-stone-200 border border-stone-300 focus:border-orange-500 focus:outline-none p-3 rounded-lg font-display text-base placeholder:text-stone-400 resize-none transition-colors" />
                </Block>

                <Block mobileSheetKey={mobileSheetKey} setMobileSheetKey={setMobileSheetKey} setMobileSheetData={setMobileSheetData} keyId="refrao" label={t.lbl_hook} count={refraoChave.trim() ? 1 : 0} preview={refraoChave ? [refraoChave] : []}
                  open={openBlocks.refrao} onToggle={toggleBlock} onClear={() => setRefraoChave('')} tClear={t.block_clear} tOpen={t.block_open}>
                  <textarea value={refraoChave} onChange={e => setRefraoChave(e.target.value)} placeholder={t.ph_hook} rows={2}
                    className="wrap-any w-full max-w-full bg-stone-200 border border-stone-300 focus:border-orange-500 focus:outline-none p-3 rounded-lg font-display text-base placeholder:text-stone-400 resize-none transition-colors" />
                </Block>

                <button onClick={(e) => { setMobileShowAdvanced(v => !v); e.currentTarget.blur(); }}
                  className="md:hidden w-full font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-3 border border-stone-400 text-stone-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 rounded-xl">
                  {mobileShowAdvanced ? <>− {t.hide_advanced}</> : <>+ {t.show_all}</>}
                </button>
              </>
            )}
          </div>

          {/* Output */}
          <div ref={outputRef} className="lg:col-span-2 min-w-0 scroll-mt-24">
            <div className="lg:sticky lg:top-24 space-y-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin">
              {/* Live Preview (desktop only, prompt tab) */}
              {tab === 'prompt' && (
                <div data-desktop-only="true" className="hidden md:block bg-stone-50 border border-stone-300 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 glow-breath" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-700" style={{ fontWeight: 600 }}>{t.live_preview || 'live preview'}</span>
                    </div>
                    <span className={`font-mono text-[10px] tabular-nums ${promptOverLimit ? 'text-red-600' : 'text-stone-400'}`} style={{ fontWeight: 600 }}>
                      {promptLen}/{LIMITE_PROMPT}
                    </span>
                  </div>
                  {promptComposto ? (
                    <p className="font-mono text-[12px] text-stone-700 leading-relaxed wrap-any whitespace-pre-wrap">
                      {promptComposto}
                    </p>
                  ) : (
                    <p className="font-display italic text-sm text-stone-400 leading-relaxed">
                      {t.live_preview_empty || 'select blocks to see your prompt build…'}
                    </p>
                  )}
                  {promptOverLimit && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-300">
                      <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0" />
                      <span className="font-mono text-[10px] text-red-700 italic">{t.live_preview_over || 'over Suno character limit'}</span>
                    </div>
                  )}
                </div>
              )}
              {tab === 'prompt' && (
                <>
                  <button onClick={gerarPrompts} disabled={loadingPrompt || !podeGerarPrompt || isQuotaExhausted}
                    className={`w-full bg-orange-500 hover:bg-orange-400 disabled:bg-stone-300 disabled:text-stone-500 text-stone-900 font-mono text-xs uppercase tracking-[0.2em] px-4 py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:shadow-none disabled:cursor-not-allowed ${loadingKind === 'variations' && !isQuotaExhausted ? 'glow-pulse' : isQuotaExhausted ? '' : 'glow-amber'}`}>
                    {isQuotaExhausted
                      ? <>{t.daily_limit_label.toUpperCase()}</>
                      : loadingKind === 'variations'
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> {loadingPhase || t.out_forging}</>
                        : <><Sparkles className="w-4 h-4" /> {t.out_generate_prompt}{getQuotaSuffix()}</>}
                  </button>
                  <button onClick={gerarAlbum} disabled={loadingPrompt || !podeGerarPrompt || isQuotaExhausted}
                    className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 text-stone-50 px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-[0.98] disabled:cursor-not-allowed">
                    {isQuotaExhausted ? (
                      <span className="font-mono text-xs uppercase tracking-[0.2em]">{t.daily_limit_label.toUpperCase()}</span>
                    ) : loadingKind === 'album' ? (
                      <span className="font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> {loadingPhase || t.out_forging}
                      </span>
                    ) : (
                      <>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                          <Disc3 className="w-4 h-4" /> {t.out_generate_album}{getQuotaSuffix()}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                          {t.out_album_sub}
                        </span>
                      </>
                    )}
                  </button>
                  {!podeGerarPrompt && (
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">{t.need_prompt}</span>
                    </div>
                  )}
                  {errorMsg && errorMsg !== t.err_interpret && (
                    <div className="font-mono text-[11px] text-red-600 text-center flex items-center justify-center gap-2">
                      {errorMsg === t.err_daily_limit ? (
                        <>
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span>{errorMsg} <strong className="font-mono">{formatTimeUntilReset(msUntilNextUTCMidnight() - tickClock * 0)}</strong></span>
                        </>
                      ) : (
                        <p>{errorMsg}</p>
                      )}
                    </div>
                  )}

                  {promptGenerations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-stone-600">
                          <Flame className="w-3 h-3 text-orange-600" />
                          <span>{promptGenerations.length} {promptGenerations.length === 1 ? (t.gen_count_singular || 'generation') : (t.gen_count_plural || 'generations')}</span>
                        </div>
                        <button onClick={() => setPromptGenerations([])}
                          className="font-mono text-[9px] uppercase tracking-widest text-stone-500 hover:text-red-600 transition-colors flex items-center gap-1">
                          <X className="w-3 h-3" /> {t.clear_all || 'clear all'}
                        </button>
                      </div>

                      {promptGenerations.slice(0, 8).map((gen) => {
                        const isAlbum = gen.kind === 'album';
                        const isOpen = gen.expanded;
                        const headerColor = isAlbum ? 'bg-stone-900 text-stone-50' : 'bg-orange-500/15 text-orange-700';
                        const borderColor = isAlbum ? 'border-stone-700' : 'border-orange-500/30';
                        const tsLabel = new Date(gen.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const toggle = () => setPromptGenerations(prev => prev.map(g => g.id === gen.id ? { ...g, expanded: !g.expanded } : g));
                        return (
                          <div key={gen.id} className={`rounded-xl border ${borderColor} overflow-hidden bg-stone-50/40`}>
                            <button onClick={toggle}
                              className={`w-full ${headerColor} px-4 py-2.5 flex items-center justify-between gap-3 transition-all hover:opacity-90 active:scale-[0.998]`}>
                              <div className="flex items-center gap-2 min-w-0">
                                {isAlbum ? <Disc3 className="w-3.5 h-3.5 flex-shrink-0" /> : <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />}
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] flex-shrink-0" style={{ fontWeight: 700 }}>
                                  {isAlbum ? (t.gen_kind_album || 'EP · 5 tracks') : `${gen.items.length} ${t.gen_kind_variations || 'variations'}`}
                                </span>
                                <span className="font-mono text-[10px] tabular-nums opacity-70 flex-shrink-0">· {tsLabel}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                              <div className="p-3 space-y-3">
                                {gen.items.map((v, i) => {
                                  const vLen = v.prompt?.length || 0;
                                  const vOver = vLen > LIMITE_PROMPT;
                                  const itemKey = `${gen.id}_${i}`;
                                  return (
                                    <div key={itemKey} className="rounded-lg border border-stone-300 bg-white p-3">
                                      <div className="flex items-baseline justify-between mb-2 gap-3">
                                        <div className="font-display italic text-base text-orange-700 min-w-0 wrap-any" style={{ fontWeight: 600 }}>{v.titulo}</div>
                                        <div className={`font-mono text-[9px] uppercase tracking-widest flex-shrink-0 tabular-nums ${vOver ? 'text-red-600' : 'text-stone-400'}`}>
                                          {isAlbum ? `t${i + 1}` : `v${i + 1}`} · {vLen}c
                                        </div>
                                      </div>
                                      <p className="font-display text-sm leading-relaxed text-stone-800 mb-3 wrap-any">{v.prompt}</p>
                                      <div className="flex gap-2 flex-wrap">
                                        <button onClick={() => copiarEAbrirSuno(v.prompt, `${itemKey}_open`, 'style')}
                                          className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-md bg-orange-500 hover:bg-orange-400 text-stone-900 transition-all active:scale-95 flex items-center gap-1.5">
                                          {copiedKey === `${itemKey}_open` ? <><Check className="w-3 h-3" /> {t.out_copied}</> : <><ExternalLink className="w-3 h-3" /> {t.open_suno}</>}
                                        </button>
                                        <button onClick={() => copiar(v.prompt, itemKey)}
                                          className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-md border border-stone-400 btn-fill-orange transition-all active:scale-95 flex items-center gap-1.5">
                                          {copiedKey === itemKey ? <><Check className="w-3 h-3" /> {t.out_copied}</> : <><Copy className="w-3 h-3" /> {t.out_copy}</>}
                                        </button>
                                        <button onClick={() => salvar(v.prompt, 'prompt', v.titulo, `${itemKey}_save`)}
                                          className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-md border border-stone-400 btn-fill-orange transition-all active:scale-95 flex items-center gap-1.5">
                                          {savedKey === `${itemKey}_save` ? <><Check className="w-3 h-3" /> {t.out_saved}</> : <><Save className="w-3 h-3" /> {t.out_save}</>}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {promptGenerations.length > 8 && (
                        <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 italic text-center py-2">
                          {(t.older_hidden || 'older generations hidden')} · {promptGenerations.length - 8}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {tab === 'letra' && (
                <>
                  <button onClick={gerarLetra} disabled={loadingLetra || !podeGerarLetra || isQuotaExhausted}
                    className={`w-full bg-orange-500 hover:bg-orange-400 disabled:bg-stone-300 disabled:text-stone-500 text-stone-900 font-mono text-xs uppercase tracking-[0.2em] px-4 py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:shadow-none disabled:cursor-not-allowed ${loadingKind === 'letra' && !isQuotaExhausted ? 'glow-pulse' : isQuotaExhausted ? '' : 'glow-amber'}`}>
                    {isQuotaExhausted
                      ? <>{t.daily_limit_label.toUpperCase()}</>
                      : loadingKind === 'letra'
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> {loadingPhase || t.out_writing}</>
                        : <><Sparkles className="w-4 h-4" /> {t.out_generate_letra}{getQuotaSuffix()}</>}
                  </button>
                  <button onClick={gerarLetrasAlbum} disabled={loadingLetra || !podeGerarLetra || isQuotaExhausted}
                    className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 text-stone-50 px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-[0.98] disabled:cursor-not-allowed">
                    {isQuotaExhausted ? (
                      <span className="font-mono text-xs uppercase tracking-[0.2em]">{t.daily_limit_label.toUpperCase()}</span>
                    ) : loadingKind === 'letrasAlbum' ? (
                      <span className="font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> {loadingPhase || t.out_writing}
                      </span>
                    ) : (
                      <>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                          <Disc3 className="w-4 h-4" /> {t.out_generate_album_letras}{getQuotaSuffix()}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
                          {t.out_album_letras_sub}
                        </span>
                      </>
                    )}
                  </button>
                  {!podeGerarLetra && (
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">{t.need_letra}</span>
                    </div>
                  )}
                  {errorMsg && errorMsg !== t.err_interpret && (
                    <div className="font-mono text-[11px] text-red-600 text-center flex items-center justify-center gap-2">
                      {errorMsg === t.err_daily_limit ? (
                        <>
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span>{errorMsg} <strong className="font-mono">{formatTimeUntilReset(msUntilNextUTCMidnight() - tickClock * 0)}</strong></span>
                        </>
                      ) : (
                        <p>{errorMsg}</p>
                      )}
                    </div>
                  )}

                  {lyricsGenerations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-stone-600">
                          <Flame className="w-3 h-3 text-orange-600" />
                          <span>{lyricsGenerations.length} {lyricsGenerations.length === 1 ? (t.gen_count_singular || 'generation') : (t.gen_count_plural || 'generations')}</span>
                        </div>
                        <button onClick={() => setLyricsGenerations([])}
                          className="font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-red-600 transition-colors flex items-center gap-1">
                          <X className="w-3 h-3" /> {t.clear_all || 'clear all'}
                        </button>
                      </div>

                      {lyricsGenerations.slice(0, 8).map((gen) => {
                        const isAlbum = gen.kind === 'album';
                        const headerColor = isAlbum ? 'bg-stone-900 text-stone-50' : 'bg-orange-500/15 text-orange-700';
                        const borderColor = isAlbum ? 'border-stone-700' : 'border-orange-500/30';
                        const tsLabel = new Date(gen.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const toggle = () => setLyricsGenerations(prev =>
                          prev.map(g => g.id === gen.id ? { ...g, expanded: !g.expanded } : g)
                        );
                        const toggleTrack = (i) => setLyricsGenerations(prev =>
                          prev.map(g => g.id === gen.id ? { ...g, trackExpanded: { ...(g.trackExpanded || {}), [i]: !(g.trackExpanded || {})[i] } } : g)
                        );
                        return (
                          <div key={gen.id} className={`rounded-xl border ${borderColor} overflow-hidden`}>
                            <button onClick={toggle} className={`w-full ${headerColor} px-4 py-2.5 flex items-center justify-between gap-3 transition-colors`}>
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {isAlbum ? <Disc3 className="w-3.5 h-3.5 flex-shrink-0" /> : <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />}
                                <span className="font-mono text-[10px] uppercase tracking-widest truncate">
                                  {isAlbum ? (t.gen_kind_album || 'EP') : (gen.items[0]?.titulo || 'lyrics')}
                                </span>
                                <span className="font-mono text-[9px] tracking-widest opacity-60 flex-shrink-0">· {tsLabel}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${gen.expanded ? 'rotate-0' : '-rotate-90'}`} />
                            </button>
                            {gen.expanded && (
                              <div className="p-3 space-y-3 bg-stone-50/40">
                                {isAlbum ? (
                                  gen.items.map((tr, i) => {
                                    const trExpanded = (gen.trackExpanded || {})[i];
                                    const linhas = tr.letra.split('\n').filter(l => l.trim() && !l.trim().startsWith('[')).length;
                                    const excedeLimite = tr.letra.length > LIMITE_LETRA;
                                    return (
                                      <div key={i} className="rounded-xl border border-stone-300 bg-stone-50/80 overflow-hidden">
                                        <button onClick={() => toggleTrack(i)}
                                          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-stone-200/40 transition-colors text-left active:bg-stone-200/80">
                                          <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform flex-shrink-0 ${trExpanded ? 'rotate-0' : '-rotate-90'}`} />
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-50 bg-stone-900 px-1.5 py-0.5 flex-shrink-0">
                                              {t.out_album_track_label} {i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                              <div className="font-display italic text-base text-stone-900 truncate" style={{ fontWeight: 600 }}>{tr.titulo}</div>
                                              {tr.papel && <div className="font-mono text-[9px] uppercase tracking-widest text-stone-500 truncate">{tr.papel}</div>}
                                            </div>
                                          </div>
                                          <span className={`font-mono text-[9px] tracking-widest tabular-nums flex-shrink-0 ${excedeLimite ? 'text-red-600' : 'text-stone-500'}`}>
                                            {linhas} · {tr.letra.length}c
                                          </span>
                                        </button>
                                        {trExpanded && (
                                          <div className="border-t border-stone-300">
                                            <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin">
                                              <pre className="font-display text-[14px] leading-relaxed text-stone-900 whitespace-pre-wrap wrap-any" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{tr.letra}</pre>
                                            </div>
                                            {excedeLimite && (
                                              <div className="border-t border-red-200 bg-red-50 px-4 py-2 flex items-start gap-2">
                                                <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                                                <p className="font-mono text-[10px] text-red-700 leading-relaxed">{t.out_over_limit_letra(LIMITE_LETRA)}</p>
                                              </div>
                                            )}
                                            <div className="border-t border-stone-300 p-3 flex gap-2 flex-wrap">
                                              <button onClick={() => copiarEAbrirSuno(tr.letra, `${gen.id}-tr-open-${i}`, 'lyrics')}
                                                className="flex-1 min-w-[140px] font-mono text-[10px] uppercase tracking-widest px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-stone-900 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                {copiedKey === `${gen.id}-tr-open-${i}` ? <><Check className="w-3 h-3" /> {t.out_copied}</> : <><ExternalLink className="w-3 h-3" /> {t.open_suno_lyrics}</>}
                                              </button>
                                              <button onClick={() => copiar(tr.letra, `${gen.id}-tr-copy-${i}`)}
                                                className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-2 rounded-md border border-stone-400 btn-fill-orange transition-all active:scale-95 flex items-center gap-1.5">
                                                {copiedKey === `${gen.id}-tr-copy-${i}` ? <><Check className="w-3 h-3" /> {t.out_copied}</> : <><Copy className="w-3 h-3" /> {t.out_copy}</>}
                                              </button>
                                              <button onClick={() => salvar(tr.letra, 'letra', tr.titulo, `${gen.id}-tr-save-${i}`)}
                                                className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-2 rounded-md border border-stone-400 btn-fill-orange transition-all active:scale-95 flex items-center gap-1.5">
                                                {savedKey === `${gen.id}-tr-save-${i}` ? <><Check className="w-3 h-3" /> {t.out_saved}</> : <><Save className="w-3 h-3" /> {t.out_save}</>}
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                ) : (
                                  gen.items.map((it, i) => {
                                    const linhas = it.letra.split('\n').filter(l => l.trim() && !l.trim().startsWith('[')).length;
                                    const excedeLimite = it.letra.length > LIMITE_LETRA;
                                    return (
                                      <div key={i} className="rounded-xl border border-stone-300 bg-stone-50/80 overflow-hidden">
                                        <div className="bg-stone-200 border-b border-stone-300 px-4 py-2 flex items-center justify-between gap-2">
                                          <div className="font-display italic text-sm text-stone-900 truncate" style={{ fontWeight: 600 }}>{it.titulo}</div>
                                          <div className={`font-mono text-[10px] tracking-widest tabular-nums flex items-center gap-2 flex-shrink-0 ${excedeLimite ? 'text-red-600' : 'text-stone-500'}`}>
                                            <span>{linhas} {t.out_lines}</span><span className="text-stone-300">·</span><span>{it.letra.length}c</span>
                                          </div>
                                        </div>
                                        <div className="p-5 max-h-[500px] overflow-y-auto scrollbar-thin">
                                          <pre className="font-display text-[15px] leading-relaxed text-stone-900 whitespace-pre-wrap wrap-any" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{it.letra}</pre>
                                        </div>
                                        {excedeLimite && (
                                          <div className="border-t border-red-200 bg-red-50 px-4 py-2 flex items-start gap-2">
                                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <p className="font-mono text-[10px] text-red-700 leading-relaxed">{t.out_over_limit_letra(LIMITE_LETRA)}</p>
                                          </div>
                                        )}
                                        <div className="border-t border-stone-300 p-3 flex gap-2 flex-wrap">
                                          <button onClick={() => copiarEAbrirSuno(it.letra, `${gen.id}-letra-open-${i}`, 'lyrics')}
                                            className="flex-1 min-w-[140px] font-mono text-[11px] uppercase tracking-widest px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-stone-900 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            {copiedKey === `${gen.id}-letra-open-${i}` ? <><Check className="w-3.5 h-3.5" /> {t.out_copied}</> : <><ExternalLink className="w-3.5 h-3.5" /> {t.open_suno_lyrics}</>}
                                          </button>
                                          <button onClick={() => copiar(it.letra, `${gen.id}-letra-copy-${i}`)}
                                            className="font-mono text-[11px] uppercase tracking-widest px-3 py-2 rounded-lg border border-stone-400 btn-fill-orange transition-all active:scale-95 flex items-center gap-2">
                                            {copiedKey === `${gen.id}-letra-copy-${i}` ? <><Check className="w-3.5 h-3.5" /> {t.out_copied}</> : <><Copy className="w-3.5 h-3.5" /> {t.out_copy_letra}</>}
                                          </button>
                                          <button onClick={() => salvar(it.letra, 'letra', it.titulo, `${gen.id}-letra-save-${i}`)}
                                            className="font-mono text-[11px] uppercase tracking-widest px-3 py-2 border border-stone-700 hover:border-orange-500 hover:text-orange-400 transition-all active:scale-95 flex items-center gap-2 rounded-lg">
                                            {savedKey === `${gen.id}-letra-save-${i}` ? <><Check className="w-3.5 h-3.5" /> {t.out_saved}</> : <><Save className="w-3.5 h-3.5" /> {t.out_save}</>}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {lyricsGenerations.length > 8 && (
                        <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 text-center py-2">
                          {(t.older_hidden || 'older generations hidden')} · {lyricsGenerations.length - 8}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-20 pt-6 border-t border-stone-300 font-mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center justify-between flex-wrap gap-2">
          <span>© brahmstorm · {new Date().getFullYear()}</span>
          <span className="flex items-center gap-2"><Music2 className="w-3 h-3" /> {t.footer_copy}</span>
        </footer>
      </main>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-stretch justify-stretch md:justify-end" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md max-h-[90vh] md:max-h-none md:h-full bg-stone-100 rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-stone-300 overflow-y-auto scrollbar-thin sheet-up" onClick={e => e.stopPropagation()}>
            <div className="md:hidden flex justify-center pt-2 pb-1"><div className="w-10 h-1 rounded-full bg-stone-400/60" /></div>
            <div className="sticky top-0 bg-stone-100 border-b border-stone-300 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
                  {drawerView === 'historico' ? t.history_sub : t.fav_sub}
                </div>
                <h3 className="font-display italic text-xl" style={{ fontWeight: 700 }}>
                  {drawerView === 'historico' ? t.history_title : t.fav_title}
                </h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-stone-500 hover:text-stone-900 transition-all active:scale-90"><X className="w-5 h-5" /></button>
            </div>
            <div className="border-b border-stone-300 px-5 py-3 flex gap-1">
              <button onClick={() => setDrawerView('favoritos')}
                className={`flex-1 font-mono text-[10px] uppercase tracking-widest px-2.5 py-2 rounded-md border transition-all active:scale-[0.98] ${drawerView === 'favoritos' ? 'border-orange-500 bg-orange-500/15 text-orange-700' : 'border-stone-300 text-stone-500 btn-fill-stone'}`}>
                {t.view_favorites} · {favoritos.length}
              </button>
              <button onClick={() => setDrawerView('historico')}
                className={`flex-1 font-mono text-[10px] uppercase tracking-widest px-2.5 py-2 rounded-md border transition-all active:scale-[0.98] ${drawerView === 'historico' ? 'border-orange-500 bg-orange-500/15 text-orange-700' : 'border-stone-300 text-stone-500 btn-fill-stone'}`}>
                {t.view_history} · {historico.length}
              </button>
            </div>
            <div className="border-b border-stone-300 px-5 py-3 flex gap-1 flex-wrap items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {[{ id: 'todos', label: t.fav_filter_all }, { id: 'prompt', label: t.fav_filter_prompt }, { id: 'letra', label: t.fav_filter_letra }].map(f => {
                  const sourceList = drawerView === 'historico' ? historico : favoritos;
                  return (
                    <button key={f.id} onClick={() => setDrawerFilter(f.id)}
                      className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-md border transition-all active:scale-95 ${drawerFilter === f.id ? 'border-orange-500 bg-orange-500/15 text-orange-700' : 'border-stone-300 text-stone-500 btn-fill-stone'}`}>
                      {f.label} {f.id !== 'todos' && `· ${sourceList.filter(x => x.tipo === f.id).length}`}
                    </button>
                  );
                })}
              </div>
              {drawerView === 'historico' && historico.length > 0 && (
                <button onClick={limparHistorico}
                  className="font-mono text-[10px] uppercase tracking-widest px-2 py-1.5 rounded-md border border-stone-300 text-stone-500 btn-fill-red transition-all active:scale-95 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> {t.history_clear}
                </button>
              )}
            </div>
            <div className="p-5 space-y-3">
              {itensExibidos.length === 0 && (
                <p className="font-mono text-xs text-stone-400 uppercase tracking-wider">
                  {drawerView === 'historico' ? t.history_empty : t.fav_empty}
                </p>
              )}
              {itensExibidos.map((f, idx) => {
                const origIdx = drawerView === 'historico' ? historico.indexOf(f) : favoritos.indexOf(f);
                const keyId = drawerView === 'historico' ? `h${origIdx}` : `f${origIdx}`;
                return (
                  <div key={`${drawerView}-${origIdx}-${idx}`} className="rounded-xl border border-stone-300 bg-stone-50/60 p-3 min-w-0">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border flex-shrink-0 ${f.tipo === 'letra' ? 'border-orange-500/40 text-orange-700' : 'border-stone-400 text-stone-600'}`}>{f.tipo}</span>
                        {f.titulo && <span className="font-display italic text-sm text-stone-700 truncate" style={{ fontWeight: 500 }}>{f.titulo}</span>}
                      </div>
                    </div>
                    <pre className="font-display text-sm leading-relaxed text-stone-800 mb-3 whitespace-pre-wrap wrap-any max-h-48 overflow-y-auto scrollbar-thin" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{f.texto}</pre>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">{new Date(f.data).toLocaleString(lang, { dateStyle: 'short', timeStyle: 'short' })}</span>
                      <div className="flex gap-1">
                        <button onClick={() => copiar(f.texto, keyId)} className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border border-stone-400 btn-fill-orange transition-all active:scale-90">
                          {copiedKey === keyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                        {drawerView === 'historico' ? (
                          <button onClick={() => salvar(f.texto, f.tipo, f.titulo, `save-h${origIdx}`)}
                            title={t.out_save}
                            className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border border-stone-400 btn-fill-orange transition-all active:scale-90">
                            {savedKey === `save-h${origIdx}` ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                          </button>
                        ) : (
                          <button onClick={() => removerFavorito(origIdx)} className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border border-stone-400 btn-fill-red transition-all active:scale-90">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tipsOpen && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-stretch justify-stretch md:justify-end" onClick={() => setTipsOpen(false)}>
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg max-h-[90vh] md:max-h-none md:h-full bg-stone-100 rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-stone-300 overflow-y-auto scrollbar-thin sheet-up" onClick={e => e.stopPropagation()}>
            <div className="md:hidden flex justify-center pt-2 pb-1"><div className="w-10 h-1 rounded-full bg-stone-400/60" /></div>
            <div className="sticky top-0 bg-stone-100 border-b border-stone-300 px-5 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">{t.tips_sub}</div>
                  <h3 className="font-display italic text-xl" style={{ fontWeight: 700 }}>{t.tips_title}</h3>
                </div>
              </div>
              <button onClick={() => setTipsOpen(false)} className="text-stone-500 hover:text-stone-900 transition-all active:scale-90"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-6">
              <p className="font-display italic text-sm text-stone-600 border-b border-stone-300 pb-5 wrap-any">{t.tips_intro}</p>
              {(TIPS[lang] || TIPS.en).map((secao, idx) => (
                <div key={idx} className="space-y-2.5">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-300">
                    <span className="text-lg">{secao.icone}</span>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-700">{secao.categoria}</h4>
                  </div>
                  <ul className="space-y-2">
                    {secao.items.map((item, j) => (
                      <li key={j} className="font-display text-[14px] leading-relaxed text-stone-700 flex gap-2.5 wrap-any">
                        <span className="text-orange-500/70 flex-shrink-0 mt-1.5">◆</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="pt-4 border-t border-stone-300 font-mono text-[10px] uppercase tracking-widest text-stone-400">{t.tips_footer}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile global block sheet (single one, swaps content) */}
      {mobileSheetKey && mobileSheetData && (
        <div
          data-mobile-only="true"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 85 }}
          onClick={() => { setMobileSheetKey(null); setMobileSheetData(null); }}>
          {/* Backdrop */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(12, 10, 9, 0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
          {/* Sheet — anchored to bottom, fixed height via dvh */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '85dvh', maxHeight: '85vh' }}
            className="bg-stone-100 rounded-t-3xl border-t border-stone-300 flex flex-col sheet-up shadow-2xl">
            <div className="flex justify-center pt-2 pb-1 flex-shrink-0"><div className="w-10 h-1 rounded-full bg-stone-400/60" /></div>
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-stone-300 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="font-display italic text-2xl text-stone-900 truncate" style={{ fontWeight: 700 }}>{mobileSheetData.label}</span>
                {mobileSheetData.count > 0 && (
                  <span className="font-mono text-[10px] uppercase tracking-widest flex-shrink-0 tabular-nums rounded-sm px-2 py-0.5 bg-orange-500 text-stone-900">
                    {mobileSheetData.max ? `${mobileSheetData.count}/${mobileSheetData.max}` : mobileSheetData.count}
                  </span>
                )}
              </div>
              <button onClick={() => { setMobileSheetKey(null); setMobileSheetData(null); }}
                className="font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-md bg-stone-900 text-stone-50 hover:bg-stone-800 transition-all active:scale-95 flex-shrink-0">
                {t.sheet_done}
              </button>
            </div>
            {mobileSheetData.max && mobileSheetData.count >= mobileSheetData.max && mobileSheetData.limitHint && (
              <div className="px-5 py-2 bg-red-50 border-b border-red-200 flex items-center gap-2 flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span className="font-mono text-[10px] text-red-700 italic">{mobileSheetData.limitHint}</span>
              </div>
            )}
            <div className="overflow-y-auto scrollbar-thin px-5 py-4 flex-1 min-h-0">
              {mobileSheetData.children}
            </div>
            {mobileSheetData.onClear && mobileSheetData.count > 0 && (
              <div className="border-t border-stone-300 px-5 py-3 flex-shrink-0">
                <button onClick={() => { mobileSheetData.onClear(); }}
                  className="w-full font-mono text-[11px] uppercase tracking-widest px-3 py-2.5 rounded-lg border border-stone-400 text-stone-600 btn-fill-red transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <Eraser className="w-3.5 h-3.5" /> {mobileSheetData.tClear}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick-starts modal — categorized picker for all 25+ presets */}
      {presetsModalOpen && (
        <div className="fixed inset-0 z-[88] flex items-end md:items-center justify-center" onClick={() => setPresetsModalOpen(false)}>
          <div className="absolute inset-0 bg-stone-950/70" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
          <div onClick={e => e.stopPropagation()}
            className="relative w-full md:max-w-3xl md:mx-6 bg-stone-100 rounded-t-3xl md:rounded-2xl shadow-2xl border-t md:border border-stone-300 overflow-hidden flex flex-col"
            style={{ maxHeight: '85dvh' }}>
            <div className="flex justify-center pt-2 pb-1 flex-shrink-0 md:hidden"><div className="w-10 h-1 rounded-full bg-stone-400/60" /></div>
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-stone-300 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="font-display italic text-xl md:text-2xl text-stone-900 truncate" style={{ fontWeight: 700 }}>{t.presets_modal_title}</span>
              </div>
              <button onClick={() => setPresetsModalOpen(false)}
                className="font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-md bg-stone-900 text-stone-50 hover:bg-stone-800 transition-all active:scale-95 flex-shrink-0">
                {t.sheet_done}
              </button>
            </div>
            <div className="overflow-y-auto scrollbar-thin px-5 py-4 flex-1 min-h-0">
              {Object.entries(PRESET_CATEGORIES).map(([catId, catLabels]) => {
                const catPresets = PRESETS.filter(p => p.category === catId);
                if (catPresets.length === 0) return null;
                return (
                  <div key={catId} className="mb-5 last:mb-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-700 mb-2 pb-1 border-b border-stone-300">
                      {catLabels[lang] || catLabels.en}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {catPresets.map(p => (
                        <button key={p.id} onClick={() => { applyPreset(p); setPresetsModalOpen(false); }}
                          className="font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-3 rounded-lg border border-stone-300 bg-white text-stone-700 btn-fill-orange transition-all active:scale-[0.97] flex items-center gap-2 text-left">
                          <span className="text-lg leading-none flex-shrink-0">{p.icon}</span>
                          <span className="truncate">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts help modal (desktop) */}
      {shortcutsOpen && (
        <div data-desktop-only="true" className="hidden md:flex fixed inset-0 z-[88] items-center justify-center" onClick={() => setShortcutsOpen(false)}>
          <div className="absolute inset-0 bg-stone-950/70" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
          <div onClick={e => e.stopPropagation()} className="relative w-full max-w-lg mx-6 bg-stone-100 rounded-2xl shadow-2xl border border-stone-300 overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-300 flex items-center justify-between">
              <h3 className="font-display italic text-2xl text-stone-900" style={{ fontWeight: 700 }}>{t.shortcuts_title}</h3>
              <button onClick={() => setShortcutsOpen(false)}
                className="font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-md bg-stone-900 text-stone-50 hover:bg-stone-800 transition-all active:scale-95">
                ESC
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                { keys: ['⌘', '↵'], desc: tab === 'prompt' ? t.shortcut_gen_prompt : t.shortcut_gen_lyrics },
                { keys: ['⌘', '⇧', '↵'], desc: tab === 'prompt' ? t.shortcut_gen_ep : t.shortcut_gen_ep_lyrics },
                { keys: ['⌘', 'L'], desc: t.shortcut_switch_tab },
                { keys: ['/'], desc: t.shortcut_focus_brief },
                { keys: ['?'], desc: t.shortcut_toggle_help },
                { keys: ['ESC'], desc: t.shortcut_close },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-stone-200 last:border-b-0">
                  <span className="font-display text-base text-stone-700">{s.desc}</span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    {s.keys.map((k, j) => (
                      <span key={j} className="font-mono text-[11px] text-stone-700 bg-stone-200 border border-stone-300 px-2 py-1 rounded-md min-w-[26px] text-center" style={{ fontWeight: 600 }}>{k}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-stone-200/50 border-t border-stone-300">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500 italic text-center">{t.shortcuts_close}</p>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] toast-enter">
          <div className="bg-stone-900 text-stone-50 px-4 py-2.5 font-mono text-xs uppercase tracking-widest border border-stone-200 shadow-2xl">{toast}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Subcomponents
// ═══════════════════════════════════════════════════════════════════

function Block({ keyId, label, count, max, preview = [], open, onToggle, onClear, tClear, tOpen, children, className = '', mobileSheetKey, setMobileSheetKey, setMobileSheetData, limitHint }) {
  const previewArr = Array.isArray(preview) ? preview : [];
  const atLimit = max && count >= max;
  // When this block IS the active mobile sheet, refresh its data when stable values change.
  // We exclude `children` and `onClear` from deps to avoid infinite loop (those are new refs every render).
  // We include `preview` (joined as a string) so single-select changes also trigger re-sync
  // (count can stay 1 when swapping selection in a single-select block).
  const previewSig = previewArr.map(p => typeof p === 'string' ? p : (p?.label || '')).join('|');
  useEffect(() => {
    if (mobileSheetKey === keyId && setMobileSheetData) {
      setMobileSheetData({ keyId, label, count, max, children, onClear, tClear, limitHint });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileSheetKey, keyId, count, max, label, tClear, previewSig]);
  return (
    <div data-section={keyId} className={`scroll-mt-24 rounded-xl border transition-colors min-w-0 overflow-hidden ${count > 0 ? 'border-orange-500/30' : 'border-stone-400/50'} ${className}`}>
      <div className="flex items-stretch">
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768 && setMobileSheetKey) {
              if (setMobileSheetData) {
                setMobileSheetData({ keyId, label, count, max, children, onClear, tClear, limitHint });
              }
              setMobileSheetKey(keyId);
            } else {
              onToggle(keyId);
            }
          }}
          className="flex-1 min-w-0 flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-stone-50/80 active:bg-stone-200/60 transition-colors text-left">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform flex-shrink-0 hidden md:block ${open ? 'rotate-0' : '-rotate-90'}`} />
            <ChevronDown className="w-4 h-4 text-stone-500 flex-shrink-0 md:hidden -rotate-90" />
            <span className="font-display italic text-lg text-stone-900 flex-shrink-0" style={{ fontWeight: 600 }}>{label}</span>
            {count > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-widest flex-shrink-0 tabular-nums rounded-sm px-1.5 py-0.5 bg-orange-500 text-stone-900">
                {max ? `${count}/${max}` : count}
              </span>
            )}
            {previewArr.length > 0 && (
              <span className={`font-mono text-[10px] text-stone-500 truncate min-w-0 flex-1 ${open ? 'md:hidden' : ''}`}>
                {previewArr.slice(0, 3).map(p => {
                  const s = typeof p === 'string' ? p : (p.label || '');
                  return s.length > 28 ? s.slice(0, 28) + '…' : s;
                }).join(' · ')}
                {previewArr.length > 3 && ` · +${previewArr.length - 3}`}
              </span>
            )}
          </div>
          {count === 0 && !open && max && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 flex-shrink-0 hidden md:inline">
              max {max}
            </span>
          )}
          {/* "open" hint removed — the chevron already indicates clickability */}
        </button>
        {onClear && count > 0 && (
          <button onClick={(e) => { e.stopPropagation(); onClear(); }} title={tClear}
            className="px-3 border-l border-stone-300 text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest flex-shrink-0">
            <Eraser className="w-3 h-3" />
            <span className="hidden md:inline">{tClear}</span>
          </button>
        )}
      </div>
      {/* Desktop only: inline accordion content. Mobile uses single global sheet. */}
      {open && <div data-desktop-only="true" className="hidden md:block border-t border-stone-300 bg-stone-100/40 min-w-0">
        {atLimit && limitHint && (
          <div className="px-4 pt-3 pb-2 border-b border-red-200 bg-red-50 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <span className="font-mono text-[10px] text-red-700 italic">{limitHint}</span>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>}
    </div>
  );
}

// Desktop-only collapsible index sidebar with quick jumps + scroll spy.
// Hidden in mobile. Defaults to collapsed (small tab); expands on hover/click.
function IndexNav({ tab, promptCounts, letraCounts, labels, onOpen }) {
  const [activeSection, setActiveSection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // user-clicked section is "pinned" briefly so spy doesn't fight with the scroll animation
  const pinnedRef = useRef(null);

  // reset active when tab switches (sections list changes)
  useEffect(() => { setActiveSection(null); pinnedRef.current = null; }, [tab]);

  const sections = useMemo(() => {
    if (tab === 'prompt') return [
      { id: 'genero', label: labels.lbl_genre, count: promptCounts.genero },
      { id: 'mood', label: labels.lbl_mood, count: promptCounts.mood },
      { id: 'instr', label: labels.lbl_instruments, count: promptCounts.instr },
      { id: 'voz', label: labels.lbl_vocals, count: promptCounts.voz },
      { id: 'era', label: labels.lbl_era, count: promptCounts.era },
      { id: 'prod', label: labels.lbl_production, count: promptCounts.prod },
      { id: 'tempo', label: labels.lbl_tempo, count: promptCounts.tempo },
      { id: 'tema', label: labels.lbl_theme, count: promptCounts.tema },
      { id: 'negativos', label: labels.lbl_negative, count: promptCounts.neg },
    ];
    return [
      { id: 'ltema', label: labels.lbl_theme_letra, count: letraCounts.ltema },
      { id: 'lmood', label: labels.lbl_mood_letra, count: letraCounts.lmood },
      { id: 'lgen', label: labels.lbl_genre_letra, count: letraCounts.lgen },
      { id: 'ltam', label: labels.lbl_size, count: letraCounts.ltam },
      { id: 'lcount', label: labels.lbl_verses, count: letraCounts.lcount },
      { id: 'lmetr', label: labels.lbl_meter, count: letraCounts.lmetr },
      { id: 'persp', label: labels.lbl_perspective, count: letraCounts.lpersp },
      { id: 'estr', label: labels.lbl_structure, count: letraCounts.lstr },
      { id: 'rima', label: labels.lbl_rhyme, count: letraCounts.lrhy },
      { id: 'lera', label: labels.lbl_era, count: letraCounts.lera },
      { id: 'lidi', label: labels.lbl_language, count: letraCounts.lidi },
      { id: 'elem', label: labels.lbl_elements, count: letraCounts.lelem },
      { id: 'refrao', label: labels.lbl_hook, count: letraCounts.refrao },
    ];
  }, [tab, promptCounts, letraCounts, labels]);

  // Scroll spy: track which section is in view. Skip when a click is pinned.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (pinnedRef.current) return; // ignore until pin clears
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length === 0) return;
      visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const id = visible[0].target.getAttribute('data-section');
      if (id) setActiveSection(id);
    }, { rootMargin: '-140px 0px -55% 0px', threshold: 0 });

    sections.forEach(s => {
      const el = document.querySelector(`[data-section="${s.id}"]`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // Jump: open the block first, wait for layout, then scroll with header offset.
  // Does NOT close the panel — only Close button or backdrop click does that.
  const jumpTo = (id) => {
    // 1. Mark as active immediately for instant feedback in the menu
    setActiveSection(id);
    pinnedRef.current = id;
    // 2. Tell the parent to open this block (closes others — single open by design)
    if (onOpen) onOpen(id);
    // 3. Wait two frames for the block to expand, then scroll with offset
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-section="${id}"]`);
        if (!el) return;
        const HEADER_OFFSET = 132;
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => { pinnedRef.current = null; }, 700);
      });
    });
  };

  const filledCount = sections.filter(s => s.count > 0).length;

  return (
    <>
      {/* Page-wide backdrop — ONLY when expanded. Closes panel on click. */}
      {isOpen && (
        <div data-desktop-only="true"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 70 }}
          className="hidden md:block"
          onClick={() => setIsOpen(false)} />
      )}

      <aside data-desktop-only="true"
        style={{ position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 71 }}
        className="hidden md:block">
        {/* Collapsed: vertical tab on the edge — count goes below the icon to keep tab narrow */}
        {!isOpen && (
          <button onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1.5 bg-stone-50/90 backdrop-blur border border-stone-300 border-l-0 rounded-r-xl py-3 px-2 shadow-md hover:bg-stone-100 transition-all active:scale-[0.97]"
            title="Open section index">
            <div className="flex flex-col gap-1">
              <div className="w-3 h-px bg-stone-500" />
              <div className="w-3 h-px bg-stone-500" />
              <div className="w-3 h-px bg-stone-500" />
            </div>
            {filledCount > 0 && (
              <span className="font-mono text-[9px] tabular-nums bg-orange-500 text-stone-900 px-1 py-0.5 rounded-sm leading-none" style={{ fontWeight: 700 }}>
                {filledCount}
              </span>
            )}
          </button>
        )}

        {/* Expanded panel — clicks inside this stop propagation so they don't bubble to the backdrop */}
        {isOpen && (
          <div onClick={(e) => e.stopPropagation()}
            className="bg-stone-50/95 backdrop-blur border border-stone-300 border-l-0 rounded-r-2xl py-2 shadow-xl flex flex-col">
            <div className="flex items-center justify-between gap-3 px-4 pb-2 border-b border-stone-200">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-700" style={{ fontWeight: 700 }}>
                sections
              </span>
              <button onClick={() => setIsOpen(false)}
                className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-colors">
                close
              </button>
            </div>
            <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto scrollbar-thin px-2 py-2">
              {sections.map(s => {
                const isActive = activeSection === s.id;
                const hasContent = s.count > 0;
                return (
                  <button key={s.id} onClick={() => jumpTo(s.id)}
                    className={`group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-all active:scale-[0.98] min-w-[180px] ${isActive ? 'bg-orange-500 text-stone-900' : 'btn-fill-stone'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full transition-all flex-shrink-0 ${isActive ? 'bg-stone-900 scale-125' : hasContent ? 'bg-orange-500' : 'bg-stone-400'}`} />
                    <span className={`font-mono text-[10px] uppercase tracking-[0.15em] flex-1 text-left truncate ${isActive ? 'text-stone-900' : hasContent ? 'text-stone-700' : 'text-stone-500'}`} style={{ fontWeight: isActive ? 700 : 500 }}>
                      {s.label}
                    </span>
                    {s.count > 0 && (
                      <span className={`font-mono text-[8px] tabular-nums px-1 py-0.5 rounded-sm flex-shrink-0 ${isActive ? 'bg-stone-900 text-orange-400' : 'bg-orange-500 text-stone-900'}`} style={{ fontWeight: 700 }}>
                        {s.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function CheckBox({ active }) {
  return (
    <span className={`w-4 h-4 rounded-[5px] border flex items-center justify-center flex-shrink-0 transition-all ${active ? 'bg-orange-500 border-orange-500' : 'border-stone-500'}`}>
      {active && <Check className="w-3 h-3 text-stone-900" strokeWidth={3} />}
    </span>
  );
}

function RadioDot({ active }) {
  return (
    <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${active ? 'border-orange-500 bg-orange-500/10' : 'border-stone-500'}`}>
      {active && <span className="w-2 h-2 rounded-full bg-orange-500" />}
    </span>
  );
}

function GridSelect({ options, values, onToggle, getLabel, single }) {
  const Indicator = single ? RadioDot : CheckBox;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 min-w-0">
      {options.map(o => {
        const active = values.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-md border text-left transition-all active:scale-[0.98] min-w-0 ${active ? 'border-orange-500 bg-orange-500/15' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-200'}`}>
            <Indicator active={active} />
            <span className={`font-mono text-[11px] leading-4 wrap-any min-w-0 ${active ? 'text-orange-800' : 'text-stone-700'}`}>{getLabel ? getLabel(o) : o}</span>
          </button>
        );
      })}
    </div>
  );
}

function ListSelect({ options, values, onToggle, getLabel, getHint, single }) {
  const Indicator = single ? RadioDot : CheckBox;
  return (
    <div className="space-y-1 min-w-0">
      {options.map(o => {
        const active = values.includes(o);
        const hint = getHint ? getHint(o) : '';
        return (
          <button key={o} onClick={() => onToggle(o)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md border text-left transition-all active:scale-[0.99] min-w-0 ${active ? 'border-orange-500 bg-orange-500/15' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-200'}`}>
            <span className="flex-shrink-0 mt-0.5"><Indicator active={active} /></span>
            <div className="min-w-0 flex-1">
              <span className={`font-display text-sm leading-tight wrap-any block ${active ? 'text-orange-800' : 'text-stone-800'}`} style={{ fontWeight: 500 }}>{getLabel ? getLabel(o) : o}</span>
              {hint && (
                <span className="font-mono text-[10px] text-stone-500 italic block mt-0.5 wrap-any">{hint}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, sub }) {
  return (
    <button onClick={onClick}
      className={`px-5 py-4 flex items-center gap-3 border-b-2 transition-all active:scale-[0.98] ${active ? 'border-orange-500 text-stone-50' : 'border-transparent text-stone-500 hover:text-stone-100'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-orange-500' : ''}`} strokeWidth={1.5} />
      <div className="text-left">
        <div className="font-display italic text-lg leading-none" style={{ fontWeight: 700 }}>{label}</div>
        <div className="font-mono text-[9px] uppercase tracking-widest mt-0.5">{sub}</div>
      </div>
    </button>
  );
}

function Stepper({ label, sub, value, onChange, min = 0, max = 99, step = 1 }) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  const atMin = value <= min, atMax = value >= max;
  return (
    <div className="flex items-center justify-between gap-3 border border-stone-300 px-3 py-2.5 bg-stone-100/40">
      <div className="min-w-0 flex-1">
        <div className="font-display text-sm text-stone-800" style={{ fontWeight: 500 }}>{label}</div>
        {sub && <div className="font-mono text-[10px] text-stone-500 mt-0.5">{sub}</div>}
      </div>
      <div className="flex items-center gap-0 flex-shrink-0">
        <button onClick={dec} disabled={atMin}
          className={`w-8 h-8 rounded-md border border-stone-400 flex items-center justify-center font-mono text-base transition-all active:scale-90 ${atMin ? 'text-stone-300 cursor-not-allowed' : 'text-stone-700 hover:bg-orange-500 hover:text-stone-900 hover:border-orange-500'}`}>−</button>
        <div className="w-10 h-8 border-t border-b border-stone-400 flex items-center justify-center font-mono text-sm text-orange-700 tabular-nums bg-stone-200">{value}</div>
        <button onClick={inc} disabled={atMax}
          className={`w-8 h-8 rounded-md border border-stone-400 flex items-center justify-center font-mono text-base transition-all active:scale-90 ${atMax ? 'text-stone-300 cursor-not-allowed' : 'text-stone-700 hover:bg-orange-500 hover:text-stone-900 hover:border-orange-500'}`}>+</button>
      </div>
    </div>
  );
}