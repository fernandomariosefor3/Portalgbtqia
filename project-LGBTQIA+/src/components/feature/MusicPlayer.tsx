import { useState, useEffect, useRef, useCallback } from "react";

const TRACKS = [
  // 80s
  { title: "I Will Survive", artist: "Gloria Gaynor", decade: "80s", id: "CjxugyZCfuw" },
  { title: "It's Raining Men", artist: "Weather Girls", decade: "80s", id: "l5aZJBLAu1E" },
  { title: "YMCA", artist: "Village People", decade: "80s", id: "CS9OO0S5w2k" },
  { title: "I Feel Love", artist: "Donna Summer", decade: "80s", id: "Nmh4MFjFBVg" },
  { title: "Physical", artist: "Olivia Newton-John", decade: "80s", id: "vWz9VN40nCA" },
  { title: "Gloria", artist: "Laura Branigan", decade: "80s", id: "xcVYWAqAsDQ" },
  // 90s
  { title: "Vogue", artist: "Madonna", decade: "90s", id: "GuJQSAiODqI" },
  { title: "Believe", artist: "Cher", decade: "90s", id: "nZXRV4MezEw" },
  { title: "Finally", artist: "CeCe Peniston", decade: "90s", id: "5PfBgibm0FQ" },
  { title: "Show Me Love", artist: "Robin S", decade: "90s", id: "HEYMkNzSRjM" },
  { title: "Dancing Queen", artist: "ABBA", decade: "90s", id: "xFrGuyw1V8s" },
  { title: "Freed from Desire", artist: "Gala", decade: "90s", id: "1BsBBiLiRxo" },
  // 2000s
  { title: "Bad Romance", artist: "Lady Gaga", decade: "2000s", id: "qrO4YZeyl0I" },
  { title: "Born This Way", artist: "Lady Gaga", decade: "2000s", id: "wV1FrqwZyKw" },
  { title: "Toxic", artist: "Britney Spears", decade: "2000s", id: "LOZuxwVk7TU" },
  { title: "Beautiful", artist: "Christina Aguilera", decade: "2000s", id: "eAfyFTzZDMM" },
  { title: "Gimme! Gimme! Gimme!", artist: "ABBA", decade: "2000s", id: "uPudE8nDog0" },
  // Atuais
  { title: "Break My Soul", artist: "Beyoncé", decade: "atual", id: "SRkqkHWCMHY" },
  { title: "Unholy", artist: "Sam Smith", decade: "atual", id: "Uq9gPaIzbe8" },
  { title: "Padam Padam", artist: "Kylie Minogue", decade: "atual", id: "mHbJcKt5d-4" },
  { title: "Murder on the Dancefloor", artist: "Sophie Ellis-Bextor", decade: "atual", id: "wNjZ6sVGvjM" },
  { title: "Escapism", artist: "RAYE", decade: "atual", id: "WXmqNQrzCgk" },
];

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPlayer() {
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const track = TRACKS[currentIdx];

  const nextTrack = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % TRACKS.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (window.YT) {
      setReady(true);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => setReady(true);
  }, []);

  // Create/recreate player when track changes or API ready
  useEffect(() => {
    if (!ready || !containerRef.current) return;

    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch { /* ignore */ }
    }

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: "0",
      width: "0",
      videoId: track.id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (e: any) => {
          e.target.setVolume(70);
          e.target.playVideo();
          setPlaying(true);
        },
        onStateChange: (e: any) => {
          // YT.PlayerState.PLAYING = 1, ENDED = 0, PAUSED = 2
          if (e.data === 0) nextTrack();
          if (e.data === 1) setPlaying(true);
          if (e.data === 2) setPlaying(false);
          // Skip unavailable videos (state 5 = cued but failed, -1 = unstarted after timeout)
        },
        onError: () => nextTrack(),
      },
    });

    return () => {
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
    };
  }, [ready, currentIdx, track.id, nextTrack]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  if (hidden) return null;

  const decadeColors: Record<string, string> = {
    "80s": "from-pink-500 to-purple-600",
    "90s": "from-purple-500 to-blue-600",
    "2000s": "from-blue-500 to-cyan-500",
    "atual": "from-rose-500 to-orange-500",
  };
  const gradient = decadeColors[track.decade] || "from-pink-500 to-purple-600";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        minimized ? "w-14 h-14" : "w-72"
      }`}
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }}
    >
      {/* Hidden YouTube container */}
      <div ref={containerRef} className="hidden" />

      {minimized ? (
        // Minimized pill
        <button
          onClick={() => setMinimized(false)}
          className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg animate-pulse`}
          title="Abrir player"
        >
          <i className="ri-music-2-line text-2xl" aria-hidden="true"></i>
        </button>
      ) : (
        // Full player
        <div className={`rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} text-white`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <div className="flex items-center gap-2">
              <i className="ri-music-2-line text-sm opacity-80" aria-hidden="true"></i>
              <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Gay Dance Radio 🏳️‍🌈
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(true)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                title="Minimizar"
              >
                <i className="ri-subtract-line text-sm" aria-hidden="true"></i>
              </button>
              <button
                onClick={() => setHidden(true)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                title="Fechar"
              >
                <i className="ri-close-line text-sm" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* Track info */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Animated disc */}
              <div
                className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ${
                  playing ? "animate-spin" : ""
                }`}
                style={playing ? { animationDuration: "3s" } : {}}
              >
                <i className="ri-disc-line text-2xl" aria-hidden="true"></i>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight truncate">{track.title}</p>
                <p className="text-xs opacity-80 truncate">{track.artist}</p>
                <span className="text-xs opacity-60 bg-white/20 rounded-full px-2 py-0.5 mt-1 inline-block">
                  {track.decade}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 px-4 pb-4">
            <button
              onClick={prevTrack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <i className="ri-skip-back-fill text-lg" aria-hidden="true"></i>
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/25 hover:bg-white/40 transition-colors"
            >
              <i className={`${playing ? "ri-pause-fill" : "ri-play-fill"} text-2xl`}></i>
            </button>
            <button
              onClick={nextTrack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <i className="ri-skip-forward-fill text-lg" aria-hidden="true"></i>
            </button>
          </div>

          {/* Track dots */}
          <div className="flex justify-center gap-1 pb-3">
            {TRACKS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`rounded-full transition-all ${
                  i === currentIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
