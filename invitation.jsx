// invitation.jsx — 80 Teresa
// Full-bleed mobile invitation that lives inside the iOS frame.

const { useState, useEffect, useRef, useMemo } = React;

// ───────────── Watercolor flower (original SVG, iris-inspired) ─────────────
function Flower({ palette, intensity = 'medium', drift = true }) {
  // 6 petals radiating; each is a curved teardrop with watercolor gradient.
  const petalCount = 6;
  const opacity = { subtle: 0.65, medium: 0.85, dramatic: 1 }[intensity];
  return (
    <svg viewBox="-260 -300 520 600" style={{
      width: '100%', height: '100%', display: 'block',
      filter: 'drop-shadow(0 12px 30px rgba(40,60,140,0.1))',
    }}>
      <defs>
        {/* watercolor edge */}
        <filter id="wc" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="5"/>
          <feDisplacementMap in="SourceGraphic" scale="14"/>
          <feGaussianBlur stdDeviation="0.6"/>
        </filter>
        {/* paper grain */}
        <filter id="grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
          <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.2  0 0 0 0 0.4  0 0 0 0.18 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
        {/* petal gradient — center deep, edges soft */}
        <radialGradient id="petalGrad" cx="50%" cy="85%" r="85%">
          <stop offset="0%" stopColor={palette.flowerCenter} stopOpacity="0.95"/>
          <stop offset="35%" stopColor={palette.flowerMid} stopOpacity="0.9"/>
          <stop offset="75%" stopColor={palette.flowerEdge} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={palette.flowerEdge} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="petalGradBack" cx="50%" cy="85%" r="85%">
          <stop offset="0%" stopColor={palette.flowerMid} stopOpacity="0.7"/>
          <stop offset="60%" stopColor={palette.flowerEdge} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={palette.flowerEdge} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c97a"/>
          <stop offset="50%" stopColor="#c89b3b"/>
          <stop offset="100%" stopColor="#8a6418"/>
        </linearGradient>
        {/* a single petal shape — used for both layers */}
        <symbol id="petal" overflow="visible">
          <path d="M 0 20 C -55 -20 -90 -100 -55 -200 C -28 -270 0 -280 0 -280 C 0 -280 28 -270 55 -200 C 90 -100 55 -20 0 20 Z"
            fill="url(#petalGrad)" filter="url(#wc)"/>
          {/* darker vein near center */}
          <path d="M 0 -10 C -8 -60 -10 -130 -3 -220" stroke={palette.vein} strokeWidth="1.2" fill="none" opacity="0.55"/>
          <path d="M -20 -90 C -25 -140 -22 -180 -10 -210" stroke={palette.vein} strokeWidth="0.8" fill="none" opacity="0.4"/>
          <path d="M 20 -90 C 25 -140 22 -180 10 -210" stroke={palette.vein} strokeWidth="0.8" fill="none" opacity="0.4"/>
        </symbol>
      </defs>

      <g style={{ opacity }}>
        {/* back layer — softer, slightly larger, rotated half */}
        {Array.from({ length: petalCount }).map((_, i) => {
          const a = (360 / petalCount) * i + 30;
          return (
            <g key={'b' + i} transform={`rotate(${a}) scale(1.08)`}>
              <g style={{
                transformOrigin: '0 0',
                animation: drift ? `petalBob 9s ease-in-out infinite ${i * 0.3}s` : 'none',
              }}>
                <use href="#petal" opacity="0.55"/>
              </g>
            </g>
          );
        })}
        {/* front petals */}
        {Array.from({ length: petalCount }).map((_, i) => {
          const a = (360 / petalCount) * i;
          return (
            <g key={'f' + i} transform={`rotate(${a})`}>
              <g style={{
                transformOrigin: '0 0',
                animation: drift ? `petalBob 7s ease-in-out infinite ${i * 0.4}s` : 'none',
              }}>
                <use href="#petal"/>
              </g>
            </g>
          );
        })}
        {/* gold center */}
        <g>
          <circle r="22" fill="url(#goldGrad)" opacity="0.95"/>
          <circle r="22" fill="none" stroke="#8a6418" strokeWidth="0.6" opacity="0.6"/>
          {/* stamens — fine gold strokes radiating */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (360 / 12) * i;
            return (
              <g key={'s' + i} transform={`rotate(${a})`}>
                <line x1="0" y1="-18" x2="0" y2="-44" stroke="url(#goldGrad)" strokeWidth="1.1" strokeLinecap="round"/>
                <circle cx="0" cy="-46" r="2.2" fill="#d9b14a"/>
              </g>
            );
          })}
          {/* paper grain over center */}
          <circle r="20" fill="#fff" filter="url(#grain)" opacity="0.35"/>
        </g>
      </g>
    </svg>
  );
}

// ───────────── Gold particles drifting upward ─────────────
function Particles({ count = 18, on = true }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 4,
      size: 2 + Math.random() * 4,
      drift: (Math.random() - 0.5) * 60,
    }));
  }, [count]);
  if (!on) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.left}%`, bottom: -20,
          width: p.size, height: p.size, borderRadius: '50%',
          background: 'radial-gradient(circle, #f5d98a 0%, #c89b3b 60%, transparent 100%)',
          boxShadow: '0 0 6px rgba(232,201,122,0.6)',
          animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          ['--drift']: `${p.drift}px`,
        }}/>
      ))}
    </div>
  );
}

// ───────────── Shooting stars — occasional, drift across the card ─────────────
function ShootingStars({ on = true }) {
  // Each star is anchored at a different vertical position so they appear at
  // multiple scroll depths. Animations are long with brief visible windows
  // (defined in the HTML keyframes) — the effect is subtle and sporadic.
  const stars = useMemo(() => ([
    { top:   70, anim: 'shoot1', dur: 6,  delay: 0,   len: 130, thick: 2.2 },
    { top:  340, anim: 'shoot3', dur: 7,  delay: 1.5, len: 120, thick: 2 },
    { top:  720, anim: 'shoot2', dur: 6,  delay: 3,   len: 135, thick: 2.4 },
    { top: 1120, anim: 'shoot1', dur: 8,  delay: 4.5, len: 115, thick: 1.8 },
    { top: 1480, anim: 'shoot3', dur: 7,  delay: 2,   len: 130, thick: 2.2 },
    { top: 1820, anim: 'shoot4', dur: 8,  delay: 5,   len: 140, thick: 2.2 },
    { top:  200, anim: 'shoot2', dur: 9,  delay: 6,   len: 110, thick: 1.8 },
    { top:  980, anim: 'shoot3', dur: 8,  delay: 3.5, len: 125, thick: 2 },
  ]), []);
  if (!on) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      overflow: 'hidden', zIndex: 1,
    }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', top: s.top, left: 0,
          width: s.len, height: s.thick,
          background: 'linear-gradient(90deg, transparent 0%, rgba(232,201,122,0.5) 45%, rgba(255,250,235,1) 100%)',
          borderRadius: 999,
          boxShadow: '0 0 14px rgba(232,201,122,0.7), 0 0 30px rgba(232,201,122,0.4)',
          animation: `${s.anim} ${s.dur}s linear ${s.delay}s infinite`,
          opacity: 0,
        }}>
          {/* bright head */}
          <div style={{
            position: 'absolute', right: -2, top: '50%',
            transform: 'translate(0, -50%)',
            width: 7, height: 7, borderRadius: '50%',
            background: '#fffaeb',
            boxShadow: '0 0 14px 4px rgba(245,217,138,1), 0 0 28px 6px rgba(232,201,122,0.7), 0 0 50px rgba(232,201,122,0.4)',
          }}/>
        </div>
      ))}
    </div>
  );
}

// ───────────── Countdown ─────────────
function Countdown({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const Cell = ({ n, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56 }}>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontSize: 44,
        lineHeight: 1, color: 'var(--ink)', letterSpacing: '0.02em',
      }}>{String(n).padStart(2, '0')}</div>
      <div style={{
        fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 6,
      }}>{label}</div>
    </div>
  );
  const Sep = () => (
    <div style={{ width: 1, height: 32, background: 'var(--gold)', opacity: 0.45, alignSelf: 'center' }}/>
  );
  return (
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12,
        padding: '14px 4px',
      }}>
      <Cell n={d} label="Días"/>
      <Sep/>
      <Cell n={h} label="Hrs"/>
      <Sep/>
      <Cell n={m} label="Min"/>
      <Sep/>
      <Cell n={s} label="Seg"/>
    </div>
  );
}

// ───────────── Music — YouTube IFrame API (pre-loaded, robust play/pause) ─────────────
function useYouTubeAudio(videoId) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef(null);
  const wantPlayRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const ensureHost = () => {
      let host = document.getElementById('yt-audio-host');
      if (!host) {
        host = document.createElement('div');
        host.id = 'yt-audio-host';
        // YouTube needs ≥200×200 to allow playback. Keep legit size, place off-screen.
        host.style.cssText = 'position:fixed;left:-2000px;top:-2000px;width:240px;height:240px;pointer-events:none;opacity:0;';
        document.body.appendChild(host);
      }
      let mount = document.getElementById('yt-audio-mount');
      if (!mount) {
        mount = document.createElement('div');
        mount.id = 'yt-audio-mount';
        host.appendChild(mount);
      }
      return mount;
    };

    const createPlayer = () => {
      if (cancelled || playerRef.current) return;
      ensureHost();
      playerRef.current = new window.YT.Player('yt-audio-mount', {
        videoId,
        width: '240',
        height: '240',
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setReady(true);
            if (wantPlayRef.current && playerRef.current) {
              try { playerRef.current.unMute && playerRef.current.unMute(); } catch (e) {}
              try { playerRef.current.playVideo && playerRef.current.playVideo(); } catch (e) {}
            }
          },
          onStateChange: (e) => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
            else if (
              e.data === window.YT.PlayerState.PAUSED ||
              e.data === window.YT.PlayerState.ENDED ||
              e.data === window.YT.PlayerState.CUED
            ) setPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const existing = document.getElementById('yt-iframe-api');
      if (!existing) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') { try { prev(); } catch (e) {} }
        createPlayer();
      };
    }

    return () => { cancelled = true; };
  }, [videoId]);

  const play = () => {
    wantPlayRef.current = true;
    const p = playerRef.current;
    if (p && typeof p.playVideo === 'function') {
      try { p.unMute && p.unMute(); } catch (e) {}
      try { p.playVideo(); } catch (e) {}
      setPlaying(true);
    } else {
      // Player not ready yet — onReady will pick this up.
      setPlaying(true);
    }
  };

  const pause = () => {
    wantPlayRef.current = false;
    const p = playerRef.current;
    if (p && typeof p.pauseVideo === 'function') {
      try { p.pauseVideo(); } catch (e) {}
    }
    setPlaying(false);
  };

  return { playing, play, pause, ready };
}

// ───────────── Envelope (opening sequence) ─────────────
function Envelope({ palette, onOpen, onClickStart }) {
  // Phases: 0 idle · 1 sealBreak · 2 flapOpens · 3 letterRises · 4 expand
  const [phase, setPhase] = useState(0);
  const [sealLoaded, setSealLoaded] = useState(false);
  useEffect(() => {
    let mounted = true;
    let imageReady = false;
    let timerDone = false;
    const finish = () => {
      if (imageReady && timerDone && mounted) setSealLoaded(true);
    };
    const img = new Image();
    img.onload = () => { imageReady = true; finish(); };
    img.onerror = () => { imageReady = true; finish(); };
    img.src = 'assets/sello.png';
    if (img.complete) imageReady = true;
    const t = setTimeout(() => { timerDone = true; finish(); }, 1000);
    // Also finish if image was already cached
    finish();
    return () => { mounted = false; clearTimeout(t); };
  }, []);
  const handle = () => {
    if (phase !== 0) return;
    // Fire music + any other "needs-user-gesture" work synchronously, inside the click.
    if (typeof onClickStart === 'function') {
      try { onClickStart(); } catch (e) {}
    }
    setPhase(1);
    setTimeout(() => setPhase(2), 350);
    setTimeout(() => setPhase(3), 900);
    setTimeout(() => setPhase(4), 1700);
    setTimeout(() => onOpen(), 2000);
  };
  const opening = phase >= 1;
  const burst = phase >= 1 ? Array.from({ length: 20 }) : [];
  return (
    <div onClick={handle} style={{
      position: 'absolute', inset: 0, zIndex: 100, cursor: phase === 0 ? 'pointer' : 'default',
      background: `radial-gradient(120% 80% at 50% 30%, ${palette.bgWarm} 0%, ${palette.bg} 70%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 700ms ease',
      opacity: phase >= 4 ? 0 : 1,
      overflow: 'hidden',
    }}>
      <Particles count={12} on={true}/>

      {/* Gold burst particles emitted at seal break */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 80 }}>
        {burst.map((_, i) => {
          const a = (Math.PI * 2 * i) / burst.length + (i * 0.13);
          const dist = 140 + Math.random() * 120;
          const dx = Math.cos(a) * dist;
          const dy = Math.sin(a) * dist - 40;
          return (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: '50%',
              width: 5, height: 5, borderRadius: '50%',
              background: 'radial-gradient(circle, #f5d98a 0%, #c89b3b 60%, transparent 100%)',
              boxShadow: '0 0 10px rgba(232,201,122,0.85)',
              transform: 'translate(-50%, -50%)',
              animation: `burst 1100ms cubic-bezier(.15,.7,.25,1) forwards`,
              animationDelay: `${i * 8}ms`,
              ['--bx']: `${dx}px`, ['--by']: `${dy}px`,
            }}/>
          );
        })}
      </div>

      {/* Loading state — elegant breathing monogram until seal is decoded */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 18,
        opacity: sealLoaded ? 0 : 1,
        transition: 'opacity 400ms ease',
        pointerEvents: 'none',
      }}>
        <svg width="64" height="64" viewBox="0 0 64 64" style={{
          animation: 'breathe 1.8s ease-in-out infinite',
        }}>
          {/* outer ring */}
          <circle cx="32" cy="32" r="29" fill="none" stroke={palette.gold} strokeWidth="0.6" opacity="0.45"/>
          {/* inner ring */}
          <circle cx="32" cy="32" r="24" fill="none" stroke={palette.gold} strokeWidth="0.4" opacity="0.3"/>
          {/* rotating arc */}
          <g style={{ transformOrigin: '32px 32px', animation: 'spin 2.4s linear infinite' }}>
            <path d="M 32 6 A 26 26 0 0 1 56 24" fill="none" stroke={palette.gold} strokeWidth="1" strokeLinecap="round"/>
          </g>
          {/* dot at center */}
          <circle cx="32" cy="32" r="2.2" fill={palette.gold}/>
        </svg>
        <div style={{
          fontFamily: 'Jost, sans-serif', fontSize: 9, letterSpacing: '0.5em',
          textTransform: 'uppercase', color: palette.inkSoft, opacity: 0.7,
          paddingLeft: '0.5em',
        }}>preparando</div>
      </div>

      {/* whole envelope assembly — fades in only once the seal image is decoded */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: sealLoaded ? 1 : 0,
        transition: 'opacity 600ms ease 200ms',
      }}>

      {/* Soft desk shadow under the envelope */}
      <div style={{
        position: 'absolute', width: 360, height: 50,
        left: '50%', top: '50%',
        transform: 'translate(-50%, 95px)',
        background: 'radial-gradient(ellipse, rgba(40,30,15,0.28) 0%, transparent 65%)',
        filter: 'blur(3px)', pointerEvents: 'none',
      }}/>

      <div style={{
        position: 'relative', width: 320, height: 215,
        transform: phase >= 4
          ? 'scale(2.2) translateY(-40px)'
          : phase >= 3
            ? 'scale(1.08) translateY(-10px) rotate(-1deg)'
            : phase >= 1
              ? 'scale(1.04) translateY(-6px) rotate(-1deg)'
              : 'scale(1) rotate(-1.5deg)',
        transition: phase >= 4
          ? 'transform 600ms cubic-bezier(.6,.2,.4,1)'
          : 'transform 1100ms cubic-bezier(.2,.7,.2,1)',
        filter: 'drop-shadow(0 18px 28px rgba(40,30,15,0.18))',
      }}>
        {/* Realistic envelope SVG */}
        <svg viewBox="0 0 320 215" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            {/* Paper grain — fine fibers */}
            <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise"/>
              <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.22 0" result="grain"/>
              <feComposite in="grain" in2="SourceGraphic" operator="in"/>
            </filter>
            {/* Soft watercolor blotches in paper */}
            <filter id="paperBlotch" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" result="t"/>
              <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.55  0 0 0 0 0.3  0 0 0 0.12 0"/>
            </filter>
            {/* Rough edge displacement */}
            <filter id="roughEdge">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2"/>
              <feDisplacementMap in="SourceGraphic" scale="1.2"/>
            </filter>

            {/* Paper gradient — warm cream with light variation */}
            <linearGradient id="paperBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#f7eed7"/>
              <stop offset="45%"  stopColor="#efe2c2"/>
              <stop offset="100%" stopColor="#e6d5ad"/>
            </linearGradient>
            <linearGradient id="paperFlap" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%"   stopColor="#f3e7c8"/>
              <stop offset="60%"  stopColor="#ead9b3"/>
              <stop offset="100%" stopColor="#d9c391"/>
            </linearGradient>
            {/* Subtle inside-the-envelope dark gradient (visible at flap edge) */}
            <linearGradient id="inside" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%"   stopColor="#8a7344"/>
              <stop offset="35%"  stopColor="#c4ad7c"/>
              <stop offset="100%" stopColor="#e6d5ad"/>
            </linearGradient>

            {/* Subtle gold ornament pattern */}
            <pattern id="goldFrame" x="0" y="0" width="320" height="215" patternUnits="userSpaceOnUse">
              <rect x="12" y="12" width="296" height="191" fill="none" stroke={palette.gold} strokeWidth="0.4" opacity="0.45"/>
              <rect x="9" y="9" width="302" height="197" fill="none" stroke={palette.gold} strokeWidth="0.25" opacity="0.3"/>
            </pattern>
          </defs>

          {/* Envelope body (back layer) */}
          <g>
            <rect x="0" y="0" width="320" height="215" rx="2" fill="url(#paperBody)"/>
            {/* warm blotches */}
            <rect x="0" y="0" width="320" height="215" rx="2" fill="url(#paperBlotch)" opacity="0.55"/>
            {/* paper grain */}
            <rect x="0" y="0" width="320" height="215" rx="2" fill="#000" filter="url(#paperGrain)" opacity="0.5"/>
            {/* gold inner frame */}
            <rect x="0" y="0" width="320" height="215" rx="2" fill="url(#goldFrame)"/>

            {/* diagonal seam lines (envelope folds — back triangles) */}
            <path d="M 0 215 L 160 130 L 320 215 Z" fill="rgba(180,140,80,0.10)"/>
            <path d="M 0 0   L 160 85  L 320 0 Z" fill="rgba(140,100,40,0.06)"/>
            {/* fold creases */}
            <line x1="0" y1="0"   x2="160" y2="85"  stroke="rgba(120,90,40,0.32)" strokeWidth="0.6"/>
            <line x1="320" y1="0" x2="160" y2="85"  stroke="rgba(120,90,40,0.32)" strokeWidth="0.6"/>
            <line x1="0" y1="215"   x2="160" y2="130" stroke="rgba(120,90,40,0.32)" strokeWidth="0.6"/>
            <line x1="320" y1="215" x2="160" y2="130" stroke="rgba(120,90,40,0.32)" strokeWidth="0.6"/>

            {/* shadow under the closed flap (when not opening) */}
            {!opening && (
              <path d="M 0 0 L 320 0 L 160 90 Z"
                fill="rgba(60,40,15,0.22)"
                filter="url(#roughEdge)"/>
            )}
          </g>
        </svg>

        {/* FLAP — separate SVG so we can 3D-rotate it */}
        <svg viewBox="0 0 320 130" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 130,
          transformOrigin: 'top center',
          transform: phase >= 2 ? 'rotateX(-178deg)' : 'rotateX(0deg)',
          transition: 'transform 1100ms cubic-bezier(.4,.1,.3,1)',
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 2px 3px rgba(60,40,15,0.15))',
          zIndex: 3,
        }}>
          {/* front side of flap */}
          <g style={{ backfaceVisibility: 'hidden' }}>
            <path d="M 0 0 L 320 0 L 160 105 Z" fill="url(#paperFlap)"/>
            <path d="M 0 0 L 320 0 L 160 105 Z" fill="url(#paperBlotch)" opacity="0.6"/>
            <path d="M 0 0 L 320 0 L 160 105 Z" fill="#000" filter="url(#paperGrain)" opacity="0.55"/>
            {/* inner gold edge along the flap */}
            <path d="M 8 4 L 312 4 L 160 96 Z" fill="none" stroke={palette.gold} strokeWidth="0.4" opacity="0.45"/>
            <path d="M 12 8 L 308 8 L 160 87 Z" fill="none" stroke={palette.gold} strokeWidth="0.25" opacity="0.3"/>
            {/* subtle highlight along top edge */}
            <path d="M 0 0 L 320 0 L 319 1 L 1 1 Z" fill="rgba(255,250,230,0.5)"/>
            {/* shadow at the tip (where flap meets body) */}
            <path d="M 100 70 Q 160 110 220 70 L 160 105 Z" fill="rgba(80,55,20,0.18)" opacity="0.7"/>
          </g>
          {/* back side (visible when opened) */}
          <g style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', transformOrigin: 'center' }}>
            <path d="M 0 0 L 320 0 L 160 105 Z" fill="url(#inside)"/>
            <path d="M 0 0 L 320 0 L 160 105 Z" fill="#000" filter="url(#paperGrain)" opacity="0.4"/>
          </g>
        </svg>

        {/* Wax seal — breaks and flies off in phase 1 */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 4,
        }}>
          <img src="assets/sello.png" alt="" style={{
            width: 88, height: 88, objectFit: 'contain',
            marginTop: 18,
            filter: 'drop-shadow(0 4px 6px rgba(60,30,5,0.45)) drop-shadow(0 1px 1px rgba(0,0,0,0.25))',
            transform: phase >= 1
              ? 'scale(1.6) rotate(38deg) translate(60px, -160px)'
              : 'scale(1) rotate(-2deg)',
            opacity: phase >= 2 ? 0 : 1,
            transition: phase >= 1
              ? 'transform 800ms cubic-bezier(.4,.1,.3,1), opacity 500ms ease 500ms'
              : 'transform 700ms cubic-bezier(.4,.1,.3,1)',
          }}/>
        </div>

        {/* The Letter — rises out of the envelope in phase 3 */}
        <div style={{
          position: 'absolute', left: 26, right: 26,
          top: phase >= 3 ? -110 : 30,
          height: 210,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 4 ? 'scale(1.05)' : 'scale(1)',
          transition: 'top 1000ms cubic-bezier(.2,.7,.2,1), opacity 500ms ease, transform 600ms ease',
          zIndex: 5,
          background: 'linear-gradient(180deg, #fffaf0 0%, #fbf3e0 100%)',
          boxShadow: '0 12px 28px rgba(40,30,15,0.25), 0 0 0 1px rgba(200,155,59,0.35) inset, 0 0 0 6px rgba(255,250,240,0.7) inset, 0 0 0 7px rgba(200,155,59,0.4) inset',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px 20px',
        }}>
          <div style={{
            fontFamily: 'Jost, sans-serif', fontSize: 9, letterSpacing: '0.5em',
            textTransform: 'uppercase', color: palette.inkSoft, opacity: 0.8,
            paddingLeft: '0.5em',
          }}>se celebran mis</div>
          <div style={{
            fontFamily: '"Italiana", "Cormorant Garamond", serif', fontWeight: 400,
            fontSize: 64, lineHeight: 1, color: palette.ink, margin: '8px 0 4px',
            letterSpacing: '-0.02em',
          }}>80</div>
          <svg width="60" height="6" viewBox="0 0 60 6" style={{ margin: '4px 0' }}>
            <line x1="0" y1="3" x2="22" y2="3" stroke={palette.gold} strokeWidth="0.5"/>
            <line x1="38" y1="3" x2="60" y2="3" stroke={palette.gold} strokeWidth="0.5"/>
            <circle cx="30" cy="3" r="1.4" fill={palette.gold}/>
          </svg>
          <div style={{
            fontFamily: '"Pinyon Script", cursive', fontWeight: 400,
            fontSize: 38, lineHeight: 1, color: palette.ink, marginTop: 4,
          }}>Teresa</div>
        </div>

        {/* Postage-style monogram in the top-left of the envelope */}
        <div style={{
          position: 'absolute', top: 14, left: 16,
          fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          fontSize: 11, letterSpacing: '0.18em', color: palette.gold,
          opacity: 0.55, transform: 'rotate(-1deg)', pointerEvents: 'none',
        }}>27 · VI · MMXXVI</div>
      </div>
      {/* end fade wrapper */}
      </div>

      {/* prompt — disappears as soon as user taps to open */}
      <div style={{
        position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center',
        opacity: sealLoaded && phase === 0 ? 0.55 : 0,
        transition: 'opacity 400ms ease',
        fontFamily: 'Jost, sans-serif', fontSize: 11.5, letterSpacing: '0.42em',
        textTransform: 'uppercase', color: palette.ink,
        animation: sealLoaded && phase === 0 ? 'pulse 2.4s ease-in-out infinite' : 'none',
      }}>
        Tocá para abrir
      </div>
    </div>
  );
}

// ───────────── Buttons ─────────────
function PrimaryButton({ children, onClick, href, gold }) {
  const Comp = href ? 'a' : 'button';
  return (
    <Comp href={href} target={href ? '_blank' : undefined} rel="noopener" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
      width: '100%', padding: '20px 24px',
      border: '0.5px solid var(--gold)',
      background: 'transparent',
      color: 'var(--ink)',
      fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
      fontSize: 19, fontWeight: 400,
      letterSpacing: '0.12em',
      borderRadius: 0, textDecoration: 'none', cursor: 'pointer',
      transition: 'all 350ms ease',
      position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--bg-warm)'; e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.letterSpacing = '0.16em'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.letterSpacing = '0.12em'; }}>
      {children}
    </Comp>
  );
}
function GhostButton({ children, onClick, href }) {
  const Comp = href ? 'a' : 'button';
  return (
    <Comp href={href} target={href ? '_blank' : undefined} rel="noopener" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
      width: '100%', padding: '20px 24px',
      border: '0.5px solid rgba(120, 90, 40, 0.35)',
      background: 'transparent', color: 'var(--ink)',
      fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
      fontSize: 19, fontWeight: 400,
      letterSpacing: '0.12em',
      borderRadius: 0, textDecoration: 'none', cursor: 'pointer',
      transition: 'all 350ms ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--bg-warm)'; e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.letterSpacing = '0.16em'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'rgba(120, 90, 40, 0.35)'; e.currentTarget.style.letterSpacing = '0.12em'; }}>
      {children}
    </Comp>
  );
}

// ───────────── Calendar (.ics) ─────────────
function buildICS() {
  const dt = (s) => s.replace(/[-:]/g, '').replace('.000', '');
  // Sat 27 Jun 2026 12:00 UYT (UTC-3) → 15:00 UTC
  const start = '20260627T150000Z';
  const end   = '20260627T180000Z';
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Teresa80//ES',
    'BEGIN:VEVENT',
    'UID:teresa80-2026@invitacion',
    `DTSTAMP:${dt(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    'SUMMARY:80 años de Teresa',
    'LOCATION:Salón El Viejo Oliva\\, Alberto Dura 3693\\, Montevideo',
    'DESCRIPTION:Una celebración muy especial. Dress code: semi formal.',
    'END:VEVENT','END:VCALENDAR',
  ].join('\r\n');
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}

// ───────────── Ethereal reveal wrappers ─────────────
const RevealContext = React.createContext(false);

function Reveal({ delay = 0, anim = 'rise', enabled, children, style }) {
  const className = enabled ? 'ethereal-' + anim : '';
  return (
    <div className={className} style={{
      animationDelay: enabled ? `${delay}ms` : undefined,
      opacity: enabled ? undefined : 0,
      ...style,
    }}>{children}</div>
  );
}
// Triggers entrance when the element scrolls into view. Provides `visible` via
// RevealContext so nested <Staggered> children animate AFTER scrolling in.
// Does NOT trigger on mount — requires the user to actually scroll first.
function ScrollReveal({ anim = null, delay = 0, threshold = 0.3, children, style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    let observer = null;
    const startObserving = () => {
      if (observer || !ref.current) return;
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      }, {
        threshold,
        // Element must be 25% inside the viewport to trigger
        rootMargin: '-12% 0px -25% 0px',
      });
      observer.observe(ref.current);
    };
    const onScroll = () => {
      if (window.scrollY > 40) {
        startObserving();
        window.removeEventListener('scroll', onScroll);
      }
    };
    // If user already scrolled past the gate (e.g. refresh mid-page), observe immediately
    if (window.scrollY > 40) startObserving();
    else window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, [threshold]);
  const cls = anim && visible ? 'ethereal-' + anim : '';
  return (
    <RevealContext.Provider value={visible}>
      <div ref={ref} className={cls} style={{
        animationDelay: visible && anim ? `${delay}ms` : undefined,
        opacity: anim ? (visible ? undefined : 0) : undefined,
        ...style,
      }}>{children}</div>
    </RevealContext.Provider>
  );
}
// Used inside ScrollReveal to stagger children animations in cascade.
function Staggered({ anim = 'fade', delay = 0, children, style }) {
  const visible = React.useContext(RevealContext);
  return (
    <div className={visible ? 'ethereal-' + anim : ''} style={{
      animationDelay: visible ? `${delay}ms` : undefined,
      opacity: visible ? undefined : 0,
      ...style,
    }}>{children}</div>
  );
}

// ───────────── Main invitation card ─────────────
function InvitationCard({ tweaks, opened, music }) {
  const palette = PALETTES[tweaks.palette];
  const target = new Date('2026-06-27T13:00:00-03:00').getTime();
  const wa = `https://wa.me/59895092897?text=${encodeURIComponent('Teresa! Como estas? Te confirmo mi asistencia en tus 80 años.')}`;
  const maps = 'https://maps.app.goo.gl/b3TfFkkhbvK9LNAWA';

  return (
    <div style={{
      ['--bg']: palette.bg, ['--bg-warm']: palette.bgWarm,
      ['--ink']: palette.ink, ['--ink-soft']: palette.inkSoft,
      ['--gold']: palette.gold, ['--blue']: palette.flowerCenter,
      position: 'relative', minHeight: '100%',
      // Vertical gradient: cream at the top → dark ink at the bottom.
      // Transition lives around the venue/CTA area.
      background: '#f6efde',
      color: palette.ink, overflow: 'hidden',
    }}>
      {/* Soft paper grain on top of cream */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.17  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        opacity: 0.35, mixBlendMode: 'multiply',
      }}/>

      <Particles on={tweaks.particles && opened} count={tweaks.particles ? 16 : 0}/>
      <ShootingStars on={tweaks.shootingStars && opened}/>

      {/* HERO — transparent florals + overlay name lockup */}
      <div style={{
        position: 'relative', width: '100%',
        opacity: opened ? 1 : 0,
        transition: 'opacity 1400ms ease 100ms',
      }}>
        <img src="assets/florals.png" alt="" style={{
          width: '100%', display: 'block',
          transformOrigin: '50% 50%',
          animation: opened ? 'flowerEnter 2400ms cubic-bezier(.2,.7,.2,1) both' : 'none',
          opacity: opened ? undefined : 0,
          filter: tweaks.palette === 'azulProfundo'
            ? 'saturate(1.08) hue-rotate(-6deg) brightness(0.98)'
            : tweaks.palette === 'azulFrancia'
              ? 'saturate(1.05) hue-rotate(-10deg)'
              : 'none',
        }} onAnimationEnd={(e) => {
          // After ethereal entrance, hand off to the gentle sway loop
          e.currentTarget.style.animation = 'flowerSway 9s ease-in-out infinite';
          e.currentTarget.style.transformOrigin = '50% 100%';
        }}/>

        {/* Centered name lockup — uniform spacing system (gap = 22px) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          paddingTop: 64,         // breathing room above eyebrow
          paddingBottom: 180,     // reserves bottom area for invocation
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 18,
          }}>
            {/* Gold ornament above the eyebrow — fills the top empty space */}
            <Reveal enabled={opened} anim="fade" delay={100} style={{ marginTop: -80, marginBottom: 4 }}>
              <svg width="120" height="22" viewBox="0 0 120 22" style={{ display: 'block' }} aria-hidden="true">
                {/* Outer flourishes — long tapered hairlines */}
                <path d="M 4 11 C 18 11 26 11 40 11" fill="none" stroke={palette.gold} strokeWidth="0.7" strokeLinecap="round"/>
                <path d="M 80 11 C 94 11 102 11 116 11" fill="none" stroke={palette.gold} strokeWidth="0.7" strokeLinecap="round"/>
                {/* Inner curls — small ornamental swirls */}
                <path d="M 40 11 C 44 8 46 6 48 9 C 49 10.5 47.5 12 46 11.5" fill="none" stroke={palette.gold} strokeWidth="0.6" strokeLinecap="round"/>
                <path d="M 80 11 C 76 8 74 6 72 9 C 71 10.5 72.5 12 74 11.5" fill="none" stroke={palette.gold} strokeWidth="0.6" strokeLinecap="round"/>
                {/* Side dots */}
                <circle cx="50" cy="11" r="1.1" fill={palette.gold}/>
                <circle cx="70" cy="11" r="1.1" fill={palette.gold}/>
                {/* Center diamond + small accents */}
                <path d="M 60 5 L 64.5 11 L 60 17 L 55.5 11 Z" fill="none" stroke={palette.gold} strokeWidth="0.6" strokeLinejoin="round"/>
                <circle cx="60" cy="11" r="1.4" fill={palette.gold}/>
              </svg>
            </Reveal>

            {/* Eyebrow */}
            <Reveal enabled={opened} anim="fade" delay={200}>
              <div style={{
                fontFamily: 'Jost, sans-serif', fontSize: 11, fontWeight: 500,
                letterSpacing: '0.32em',
                textTransform: 'uppercase', color: palette.ink, opacity: 0.95,
                paddingLeft: '0.32em',
              }}>te espero para celebrar mis</div>
            </Reveal>

            {/* 80 numeral — focal point */}
            <Reveal enabled={opened} anim="glow" delay={600}>
              <div style={{
                fontFamily: '"Italiana", "Cormorant Garamond", serif',
                fontWeight: 400, fontSize: 124, lineHeight: 0.85,
                color: palette.ink, letterSpacing: '-0.02em',
                margin: '-2px 0',
                animation: tweaks.letterGlow ? 'letterGlow 4.5s ease-in-out 0.5s infinite' : 'none',
              }}>80</div>
            </Reveal>

            {/* AÑOS label below 80 */}
            <Reveal enabled={opened} anim="fade" delay={700}>
              <div style={{
                fontFamily: 'Jost, sans-serif', fontSize: 11, fontWeight: 500,
                letterSpacing: '0.5em',
                textTransform: 'uppercase', color: palette.ink, opacity: 0.95,
                paddingLeft: '0.5em',
              }}>años</div>
            </Reveal>

            {/* Gold hairline + dot ornament — draws across */}
            <Reveal enabled={opened} anim="fade" delay={800}>
              <svg width="74" height="6" viewBox="0 0 74 6">
                <line x1="0" y1="3" x2="30" y2="3" stroke={palette.gold} strokeWidth="0.6"/>
                <line x1="44" y1="3" x2="74" y2="3" stroke={palette.gold} strokeWidth="0.6"/>
                <circle cx="37" cy="3" r="1.6" fill={palette.gold} className="shimmer"/>
              </svg>
            </Reveal>

            {/* Teresa script — magical reveal */}
            <Reveal enabled={opened} anim="glow" delay={1000}>
              <div style={{
                fontFamily: '"Pinyon Script", cursive', fontWeight: 400,
                fontSize: 76, lineHeight: 1, color: palette.ink,
                letterSpacing: '0.01em',
                animation: tweaks.letterGlow ? 'letterGlow 5s ease-in-out 2s infinite' : 'none',
              }}>Teresa</div>
            </Reveal>
          </div>
        </div>

        {/* Invocation copy — anchored to bottom of hero, near where flowers end */}
        <Reveal enabled={opened} anim="rise" delay={1500} style={{
          position: 'absolute', left: 0, right: 0, bottom: 36,
        }}>
          <div style={{
            padding: '0 44px', textAlign: 'center',
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontWeight: 400, fontSize: 22, lineHeight: 1.5,
            color: palette.ink, letterSpacing: '0.01em', pointerEvents: 'none',
          }}>
            Una celebración para festejar<br/>
            la vida, la familia y los<br/>
            momentos compartidos.
          </div>
        </Reveal>
      </div>

      {/* Content below the floral frame — paper card aesthetic */}
      <FadeStack opened={opened}>

        {/* Date — elegant typographic lockup, staggered subreveal (time-based) */}
        <RevealContext.Provider value={opened}>
          <div style={{ textAlign: 'center', margin: '14px 0 0', padding: '0 28px' }}>
            <Staggered anim="fade" delay={1600} style={{
              fontFamily: 'Jost, sans-serif', fontSize: 10, letterSpacing: '0.5em',
              textTransform: 'uppercase', color: palette.gold, fontWeight: 700,
              paddingLeft: '0.5em', marginBottom: 14,
            }}>el día</Staggered>

            <Staggered anim="fade" delay={1800} style={{
              fontFamily: '"Italiana", "Cormorant Garamond", serif', fontWeight: 400,
              fontSize: 24, color: palette.ink, lineHeight: 1, marginBottom: 10,
              letterSpacing: '0.04em',
            }}>Sábado</Staggered>

            {/* 27 + gold hairlines appear together */}
            <Staggered anim="glow" delay={2000} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 14, marginBottom: 8,
            }}>
              <div style={{
                flex: 1, height: 1, background: palette.gold, opacity: 0.4, maxWidth: 70,
              }}/>
              <div style={{
                fontFamily: '"Italiana", "Cormorant Garamond", serif', fontWeight: 400,
                fontSize: 78, lineHeight: 1, color: palette.ink,
                letterSpacing: '-0.02em',
                animation: tweaks.letterGlow ? 'letterGlow 5.5s ease-in-out 3.5s infinite' : 'none',
              }}>27</div>
              <div style={{
                flex: 1, height: 1, background: palette.gold, opacity: 0.4, maxWidth: 70,
              }}/>
            </Staggered>

            <Staggered anim="fade" delay={2200} style={{
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
              fontWeight: 400, fontSize: 22, color: palette.ink,
              letterSpacing: '0.04em', marginBottom: 4,
            }}>de junio · 2026</Staggered>

            {/* Time — designed numeric display */}
            <Staggered anim="fade" delay={2400} style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'center',
              gap: 8, marginTop: 18,
            }}>
              <div style={{
                fontFamily: '"Italiana", "Cormorant Garamond", serif', fontWeight: 400,
                fontSize: 36, color: palette.ink, letterSpacing: '0.02em',
                lineHeight: 1,
              }}>13:00</div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 22, color: palette.inkSoft, fontWeight: 400,
                lineHeight: 1,
              }}>hs</div>
            </Staggered>
          </div>
        </RevealContext.Provider>

        {/* Floral divider between time and countdown */}
        <ScrollReveal anim="fade">
          <div style={{
            display: 'flex', justifyContent: 'center',
            margin: '40px auto 0', padding: '0 24px',
          }}>
            <img src="assets/divider-flower.png" alt="" style={{
              width: '70%', maxWidth: 280, height: 'auto', display: 'block',
              filter: tweaks.palette === 'azulProfundo'
                ? 'saturate(1.08) hue-rotate(-6deg) brightness(0.98)'
                : tweaks.palette === 'azulFrancia'
                  ? 'saturate(1.05) hue-rotate(-10deg)'
                  : 'none',
            }}/>
          </div>
        </ScrollReveal>

        {/* "Faltan" label above countdown */}
        <ScrollReveal anim="fade">
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <div style={{
              fontFamily: 'Jost, sans-serif', fontSize: 10, letterSpacing: '0.5em',
              textTransform: 'uppercase', color: palette.gold, fontWeight: 700,
              paddingLeft: '0.5em',
            }}>faltan</div>
          </div>
        </ScrollReveal>

        {/* Countdown */}
        <ScrollReveal anim="rise">
          <div style={{ margin: '12px 28px 0' }}>
            <Countdown target={target}/>
          </div>
        </ScrollReveal>

        {/* Section divider */}
        <ScrollReveal anim="fade">
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 0' }}>
            <svg width="120" height="10" viewBox="0 0 120 10">
              <line x1="0" y1="5" x2="48" y2="5" stroke={palette.gold} strokeWidth="0.5"/>
              <line x1="72" y1="5" x2="120" y2="5" stroke={palette.gold} strokeWidth="0.5"/>
              <path d="M 56 5 L 60 1 L 64 5 L 60 9 Z" fill="none" stroke={palette.gold} strokeWidth="0.6" className="shimmer"/>
            </svg>
          </div>
        </ScrollReveal>

        {/* Venue */}
        <ScrollReveal anim="rise">
          <div style={{ textAlign: 'center', padding: '34px 32px 0' }}>
            <div style={{
              fontFamily: '"Italiana", "Cormorant Garamond", serif', fontWeight: 400,
              fontSize: 32, color: palette.ink, lineHeight: 1.15,
              letterSpacing: '0.01em',
            }}>Salón El Viejo Oliva</div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, marginTop: 12,
            }}>
              <svg width="20" height="26" viewBox="0 0 22 28" style={{
                flexShrink: 0, color: palette.ink, display: 'block',
              }} aria-hidden="true">
                {/* Teardrop pin outline — fine line to match Cormorant italic */}
                <path d="M 11 1.6 C 5.85 1.6 1.7 5.75 1.7 10.9 C 1.7 18.2 11 26.4 11 26.4 C 11 26.4 20.3 18.2 20.3 10.9 C 20.3 5.75 16.15 1.6 11 1.6 Z"
                  fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Inner circle */}
                <circle cx="11" cy="10.9" r="3.2" fill="none" stroke="currentColor" strokeWidth="0.9"/>
              </svg>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 19, color: palette.ink,
                fontWeight: 400, lineHeight: 1.5, textAlign: 'center',
              }}>Alberto Dura 3693<br/>Montevideo</div>
            </div>

            {/* "Cómo llegar" — refined text link */}
            <a href={maps} target="_blank" rel="noopener" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginTop: 22,
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
              fontSize: 18, color: palette.ink, fontWeight: 400,
              textDecoration: 'none', letterSpacing: '0.04em',
              paddingBottom: 4,
              borderBottom: `0.5px solid ${palette.gold}`,
              transition: 'all 300ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.gap = '14px'; e.currentTarget.style.borderBottomColor = palette.ink; }}
            onMouseLeave={e => { e.currentTarget.style.gap = '10px'; e.currentTarget.style.borderBottomColor = palette.gold; }}
            >
              Cómo llegar al salón
              <svg width="14" height="10" viewBox="0 0 14 10" style={{ display: 'block' }}>
                <path d="M 0 5 L 12 5 M 8 1 L 12 5 L 8 9" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </ScrollReveal>

        {/* Spacer through the gradient transition */}
        <div style={{ height: 0 }}/>

        {/* ─── RSVP + CTA section with corner florals ─── */}
        <ScrollReveal anim="rise">
          <div style={{
            position: 'relative',
            padding: '120px 40px 100px',
            textAlign: 'center',
            margin: '0 0',
            overflow: 'visible',
            minHeight: 480,
          }}>
            {/* Top-left corner floral — new bouquet, flipped vertically so roses hang from the top. Subtle sway. */}
            <img src="assets/corner-flower-top.png" alt="" style={{
              position: 'absolute', top: 19, left: -30,
              width: 420, height: 'auto',
              transform: 'scaleY(-1)',
              animation: 'swayTopLeft 9s ease-in-out infinite',
              pointerEvents: 'none', zIndex: 0,
              filter: tweaks.palette === 'azulProfundo'
                ? 'saturate(1.08) hue-rotate(-6deg) brightness(0.98)'
                : tweaks.palette === 'azulFrancia'
                  ? 'saturate(1.05) hue-rotate(-10deg)'
                  : 'none',
            }}/>
            {/* Bottom-right corner floral — new bouquet mirrored to face the right side. Subtle sway. */}
            <img src="assets/corner-flower-bottom.png" alt="" style={{
              position: 'absolute', bottom: 40, right: -30,
              width: 340, height: 'auto',
              transform: 'scaleX(-1)',
              animation: 'swayBottomRight 11s ease-in-out infinite',
              pointerEvents: 'none', zIndex: 0,
              filter: tweaks.palette === 'azulProfundo'
                ? 'saturate(1.08) hue-rotate(-6deg) brightness(0.98)'
                : tweaks.palette === 'azulFrancia'
                  ? 'saturate(1.05) hue-rotate(-10deg)'
                  : 'none',
            }}/>

            {/* Content sits in the safe central band, clear of both flowers */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 19, lineHeight: 1.5,
                color: palette.ink, fontWeight: 400, marginBottom: 24,
              }}>
                Por favor confirmá<br/>
                tu asistencia hasta el<br/>
                <span style={{ fontWeight: 700, color: palette.ink }}>13 de junio de 2026</span>
              </div>

              <a href={wa} target="_blank" rel="noopener" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 18, fontWeight: 400,
                color: palette.ink, letterSpacing: '0.03em',
                textDecoration: 'none', cursor: 'pointer',
                paddingBottom: 5,
                borderBottom: `0.5px solid ${palette.gold}`,
                transition: 'all 350ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = '15px'; e.currentTarget.style.color = palette.flowerCenter; e.currentTarget.style.borderBottomColor = palette.flowerCenter; }}
              onMouseLeave={e => { e.currentTarget.style.gap = '10px'; e.currentTarget.style.color = palette.ink; e.currentTarget.style.borderBottomColor = palette.gold; }}
              >
                Confirmar asistencia
                <svg width="14" height="10" viewBox="0 0 14 10" style={{ display: 'block' }}>
                  <path d="M 0 5 L 12 5 M 8 1 L 12 5 L 8 9" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </FadeStack>

    </div>
  );
}

function FadeStack({ children, opened }) {
  // No longer fade-stacks: each child handles its own entrance via Reveal.
  return (
    <div style={{
      paddingBottom: 40, position: 'relative', zIndex: 2,
      opacity: opened ? 1 : 0,
      transition: 'opacity 600ms ease',
    }}>{children}</div>
  );
}
function DateChunk({ top, bot, gold, ink }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 72,
        lineHeight: 0.95, color: ink, letterSpacing: '-0.01em',
      }}>{top}</div>
      <div style={{
        fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: gold, marginTop: 6, fontWeight: 400,
      }}>{bot}</div>
    </div>
  );
}
function Ornament({ gold, wide }) {
  return (
    <svg width={wide ? 110 : 50} height="14" viewBox={wide ? '0 0 110 14' : '0 0 50 14'} style={{ display: 'block', margin: '8px auto' }}>
      {wide ? (
        <>
          <line x1="0" y1="7" x2="42" y2="7" stroke={gold} strokeWidth="0.7"/>
          <line x1="68" y1="7" x2="110" y2="7" stroke={gold} strokeWidth="0.7"/>
          <circle cx="55" cy="7" r="3" fill={gold}/>
          <circle cx="46" cy="7" r="1.2" fill={gold}/>
          <circle cx="64" cy="7" r="1.2" fill={gold}/>
        </>
      ) : (
        <>
          <line x1="0" y1="7" x2="18" y2="7" stroke={gold} strokeWidth="0.7"/>
          <line x1="32" y1="7" x2="50" y2="7" stroke={gold} strokeWidth="0.7"/>
          <circle cx="25" cy="7" r="2" fill={gold}/>
        </>
      )}
    </svg>
  );
}

function IconHeart() { return <svg width="13" height="13" viewBox="0 0 14 14"><path d="M7 12 C 1 8 1 3.5 4 3 C 5.5 2.7 6.5 3.6 7 4.5 C 7.5 3.6 8.5 2.7 10 3 C 13 3.5 13 8 7 12 Z" fill="currentColor"/></svg>; }
function IconPin() { return <svg width="13" height="13" viewBox="0 0 14 14"><path d="M7 1 C 4 1 2 3 2 6 C 2 9 7 13 7 13 C 7 13 12 9 12 6 C 12 3 10 1 7 1 Z M 7 7.5 A 1.5 1.5 0 1 1 7 4.5 A 1.5 1.5 0 1 1 7 7.5 Z" fill="currentColor"/></svg>; }
function IconCal() { return <svg width="13" height="13" viewBox="0 0 14 14"><rect x="1.5" y="2.5" width="11" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><line x1="1.5" y1="5.5" x2="12.5" y2="5.5" stroke="currentColor" strokeWidth="1.2"/><line x1="4.5" y1="1" x2="4.5" y2="3.5" stroke="currentColor" strokeWidth="1.2"/><line x1="9.5" y1="1" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.2"/></svg>; }

// ───────────── Palettes ─────────────
const PALETTES = {
  azulFrancia: {
    label: 'Azul Francia',
    bg: '#fbf7ee',          // warm pearl
    bgWarm: '#f7eedd',
    ink: '#1a2240',
    inkSoft: '#5a6480',
    gold: '#c89b3b',
    flowerCenter: '#1a4ea3',  // azul Francia
    flowerMid:    '#4a7cc8',
    flowerEdge:   '#a8c1e6',
    vein:         '#0e2a66',
  },
  periwinkle: {
    label: 'Periwinkle (referencia)',
    bg: '#fbf6ee',
    bgWarm: '#f5ecda',
    ink: '#2a2f55',
    inkSoft: '#6b6f90',
    gold: '#c89b3b',
    flowerCenter: '#5a64b8',
    flowerMid:    '#8a96d8',
    flowerEdge:   '#c5cdee',
    vein:         '#3a3f7a',
  },
  azulProfundo: {
    label: 'Azul profundo',
    bg: '#f8f4e8',
    bgWarm: '#efe5cc',
    ink: '#0a1430',
    inkSoft: '#414a6e',
    gold: '#b8862c',
    flowerCenter: '#0a2a78',
    flowerMid:    '#2c50a8',
    flowerEdge:   '#7d96cc',
    vein:         '#06184e',
  },
};

// ───────────── App ─────────────
function App() {
  const defaults = /*EDITMODE-BEGIN*/{
    "palette": "azulFrancia",
    "intensity": "medium",
    "layout": "top",
    "particles": true,
    "drift": true,
    "shootingStars": true,
    "letterGlow": true,
    "skipEnvelope": false
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = window.useTweaks(defaults);
  const [opened, setOpened] = useState(false);
  const music = useYouTubeAudio('mX2Y9yWfHBI');

  useEffect(() => {
    if (tweaks.skipEnvelope) setOpened(true);
  }, [tweaks.skipEnvelope]);

  // Envelope needs to know container height (was 797px in the iOS frame). Use vh on mobile.
  // We let the Envelope component size to its parent.

  const handleOpen = () => {
    setOpened(true);
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: '#e8e4d6',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      {/* Responsive card — phone-portrait width on desktop, full width on mobile */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        // While envelope is showing, lock to viewport height so it doesn't grow
        // with the (invisible) card content beneath it. Once opened, allow natural flow.
        height: opened ? 'auto' : '100vh',
        minHeight: '100vh',
        background: '#f6efde',
        boxShadow: '0 20px 60px rgba(40,30,15,0.18)',
        overflow: opened ? 'visible' : 'hidden',
        fontFamily: 'Jost, sans-serif',
      }}>
        {/* Persistent music toggle — sticks to top while scrolling */}
        <div style={{ position: 'sticky', top: 18, height: 0, zIndex: 200, pointerEvents: 'none' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (music.playing) music.pause();
              else { music.play(); if (!opened) handleOpen(); }
            }}
            style={{
              position: 'absolute', right: 18, top: 0,
              width: 36, height: 36, padding: 0,
              border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', pointerEvents: 'auto',
              color: PALETTES[tweaks.palette].ink,
              opacity: 0.55,
              transition: 'opacity 200ms ease, transform 200ms ease',
              filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.7))',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.95'; e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.55'; e.currentTarget.style.transform = 'scale(1)'; }}
            title={music.playing ? 'Pausar música' : 'Activar música'}
            aria-label={music.playing ? 'Pausar música' : 'Activar música'}
          >
            {music.playing
              ? <svg width="18" height="18" viewBox="0 0 18 18"><rect x="4" y="3" width="3" height="12" rx="0.5" fill="currentColor"/><rect x="11" y="3" width="3" height="12" rx="0.5" fill="currentColor"/></svg>
              : <svg width="18" height="18" viewBox="0 0 18 18"><path d="M5 3 L15 9 L5 15 Z" fill="currentColor"/></svg>}
          </button>
        </div>
        {!opened && <Envelope palette={PALETTES[tweaks.palette]} onOpen={handleOpen} onClickStart={music.play}/>}
        <InvitationCard tweaks={tweaks} opened={opened} music={music}/>
      </div>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Paleta">
          <window.TweakRadio label="Color" value={tweaks.palette} onChange={v => setTweak('palette', v)}
            options={[
              { value: 'azulFrancia', label: 'Francia' },
              { value: 'periwinkle', label: 'Periwinkle' },
              { value: 'azulProfundo', label: 'Profundo' },
            ]}/>
        </window.TweakSection>
        <window.TweakSection label="Flor">
          <window.TweakRadio label="Intensidad" value={tweaks.intensity} onChange={v => setTweak('intensity', v)}
            options={[
              { value: 'subtle', label: 'Sutil' },
              { value: 'medium', label: 'Media' },
              { value: 'dramatic', label: 'Dramática' },
            ]}/>
          <window.TweakRadio label="Posición" value={tweaks.layout} onChange={v => setTweak('layout', v)}
            options={[
              { value: 'top', label: 'Centro' },
              { value: 'side', label: 'Lateral' },
            ]}/>
          <window.TweakToggle label="Movimiento pétalos" value={tweaks.drift} onChange={v => setTweak('drift', v)}/>
        </window.TweakSection>
        <window.TweakSection label="Atmósfera">
          <window.TweakToggle label="Partículas doradas" value={tweaks.particles} onChange={v => setTweak('particles', v)}/>
          <window.TweakToggle label="Estrellas fugaces" value={tweaks.shootingStars} onChange={v => setTweak('shootingStars', v)}/>
          <window.TweakToggle label="Brillo en las letras" value={tweaks.letterGlow} onChange={v => setTweak('letterGlow', v)}/>
          <window.TweakToggle label="Saltar pantalla sobre" value={tweaks.skipEnvelope} onChange={v => setTweak('skipEnvelope', v)}/>
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
