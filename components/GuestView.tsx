import React, { useState, useEffect, useRef } from 'react';
import { InvitationData, ChatMessage } from '../types.ts';
import { getConciergeResponse } from '../services/gemini.ts';
import { 
  Calendar, MapPin, MessageSquare, Send, Clock, 
  Coffee, Globe, X, ChevronDown, Play, Pause, CheckCircle, Users,
  Share2, Copy, ExternalLink, Lock, Fingerprint, Instagram, 
  Facebook, Twitter, MessageCircle, Volume2, Volume1, VolumeX
} from 'lucide-react';

type ThemeType = 'cyberpunk' | 'ethereal' | 'minimalist';

const themes: Record<ThemeType, {
  id: ThemeType;
  label: string;
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  panel: string;
  fontHeading: string;
  button: string;
  buttonSecondary: string;
  icon: string;
  nav: string;
  audioUrl: string;
}> = {
  cyberpunk: {
    id: 'cyberpunk',
    label: 'Neon Future',
    bg: 'bg-[#020617]',
    text: 'text-white',
    textMuted: 'text-slate-400',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    panel: 'bg-slate-900/60 backdrop-blur-xl border border-white/10',
    fontHeading: 'font-display',
    button: 'bg-white text-black hover:bg-cyan-400',
    buttonSecondary: 'bg-slate-800 text-white',
    icon: 'text-cyan-400',
    nav: 'border-b border-white/5 bg-[#020617]/80 backdrop-blur-md',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 
  },
  ethereal: {
    id: 'ethereal',
    label: 'Botanical Dream',
    bg: 'bg-[#fafaf9]', 
    text: 'text-stone-800',
    textMuted: 'text-stone-500',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-600',
    panel: 'bg-white/70 backdrop-blur-md border border-stone-200',
    fontHeading: 'font-serif italic',
    button: 'bg-emerald-700 text-white',
    buttonSecondary: 'bg-stone-100 text-stone-700',
    icon: 'text-emerald-600',
    nav: 'border-b border-stone-200 bg-[#fafaf9]/80 backdrop-blur-md',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  minimalist: {
    id: 'minimalist',
    label: 'Swiss Modern',
    bg: 'bg-white',
    text: 'text-black',
    textMuted: 'text-gray-500',
    accent: 'text-black',
    accentBg: 'bg-black',
    panel: 'bg-transparent border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    fontHeading: 'font-sans tracking-tighter font-black uppercase',
    button: 'bg-black text-white rounded-none border-2 border-black',
    buttonSecondary: 'bg-white text-black border-2 border-black rounded-none',
    icon: 'text-black',
    nav: 'border-b-2 border-black bg-white/95',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  }
};

const HolographicText = ({ text, theme, className = "" }: { text: string, theme: ThemeType, className?: string }) => {
  if (theme === 'minimalist') return <span className={className}>{text}</span>;
  return (
    <span className={`relative inline-block ${className} group`}>
      <span className="absolute inset-0 text-cyan-500 blur-sm opacity-0 group-hover:opacity-50 transition-opacity">{text}</span>
      <span className="relative z-10">{text}</span>
    </span>
  );
};

const GuestView: React.FC<{ data: InvitationData; onEdit: () => void }> = ({ data, onEdit }) => {
  const t = themes[data.theme];
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update volume separately
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const startInteraction = () => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
      // Force load to ensure source is fresh
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch(err => console.warn("Audio autoplay blocked or failed:", err));
    }
    setIsOpened(true);
    window.scrollTo(0,0);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch(err => console.error("Manual play error:", err));
    }
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-700 font-sans selection:bg-cyan-500 selection:text-white`}>
      {/* Robust Audio Implementation */}
      <audio 
        key={data.theme} // Force re-mount on theme change to reset source state
        ref={audioRef} 
        loop 
        preload="auto"
        onCanPlay={() => console.log(`Audio ready for theme: ${data.theme}`)}
        onError={(e) => console.error("Audio Load Error:", (e.target as any).error)}
      >
        <source src={t.audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {!isOpened && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-6">
          <div className={`${t.panel} max-w-md w-full p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-500`}>
            <Lock className="h-12 w-12 mx-auto text-cyan-500 animate-pulse" />
            <h2 className="text-2xl font-display font-bold uppercase tracking-widest">{data.partner1} & {data.partner2}</h2>
            <div className="h-px bg-white/10 w-full my-4"></div>
            <p className="text-slate-400 text-sm font-mono tracking-tighter">SECURE INVITATION DETECTED<br/>BIOMETRIC SCAN IN PROGRESS...</p>
            <button 
              onClick={startInteraction}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-3 active:scale-95"
            >
              <Fingerprint className="h-5 w-5" /> Initialize Access
            </button>
          </div>
        </div>
      )}

      {isOpened && (
        <div className="animate-in fade-in duration-1000">
          <nav className={`fixed top-0 w-full z-40 transition-all ${scrolled ? `${t.nav} py-3 shadow-lg` : 'py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
              <div className={`${t.fontHeading} font-bold text-xl tracking-wider`}>{data.partner1} & {data.partner2}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1 border border-white/5">
                   <button onClick={toggleMusic} className="p-1 hover:text-cyan-400 transition-colors">
                     {musicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                   </button>
                   <div className="w-16 h-1 bg-white/10 rounded-full relative overflow-hidden group">
                      <div className="absolute inset-0 bg-cyan-500" style={{ width: `${musicVolume * 100}%` }}></div>
                   </div>
                </div>
                <button onClick={onEdit} className="text-xs uppercase opacity-50 hover:opacity-100 transition-opacity">Edit Suite</button>
              </div>
            </div>
          </nav>

          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
            <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-[10px] tracking-[0.3em] uppercase text-cyan-400 mb-8 animate-pulse">
               Synchronizing Invitation Data
            </div>
            <h1 className="text-6xl md:text-9xl font-display font-black leading-none uppercase mb-8 tracking-tighter">
              <HolographicText text={data.partner1} theme={data.theme} /><br/>
              <span className="text-4xl md:text-6xl italic font-serif opacity-30">&</span><br/>
              <HolographicText text={data.partner2} theme={data.theme} />
            </h1>
            <div className="space-y-6 max-w-2xl mt-8">
              <div className="flex items-center justify-center gap-4 text-xl opacity-80 group">
                <Calendar className="h-6 w-6 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="font-light tracking-wide">{new Date(data.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xl opacity-80 group">
                <MapPin className="h-6 w-6 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="font-light tracking-wide">{data.venueName}</span>
              </div>
            </div>
            <div className="mt-20 animate-bounce opacity-20"><ChevronDown className="h-8 w-8" /></div>
          </section>

          <section className="py-32 px-6 max-w-4xl mx-auto">
            <div className={`${t.panel} p-8 md:p-16 rounded-[2rem] relative overflow-hidden group`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              <h2 className="text-xs font-display font-bold mb-10 uppercase tracking-[0.5em] text-cyan-500/60">Our Shared Vector</h2>
              <p className="text-2xl md:text-4xl leading-relaxed font-serif italic opacity-90 relative z-10">{data.storyNarrative}</p>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 blur-[40px] rounded-full"></div>
            </div>
          </section>

          <section className="py-24 px-6 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            <div className="space-y-12">
              <h2 className="text-2xl font-display font-bold uppercase tracking-[0.2em] border-l-4 border-cyan-500 pl-4">Mission Timeline</h2>
              <div className="space-y-10 relative">
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/10"></div>
                {data.schedule.map((item, i) => (
                  <div key={i} className="flex gap-8 items-start group">
                    <div className="h-3 w-3 rounded-full bg-cyan-500 mt-2 relative z-10 group-hover:scale-150 transition-transform"></div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-4 mb-1">
                         <span className="font-mono text-cyan-400 text-sm">{item.time}</span>
                         <h4 className="text-2xl font-bold">{item.event}</h4>
                      </div>
                      <p className="opacity-50 text-sm leading-relaxed max-w-md">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
               <div className={`${t.panel} p-10 rounded-[2.5rem] flex flex-col justify-center text-center space-y-8 border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.05)]`}>
                <h2 className="text-3xl font-display font-bold uppercase tracking-widest">Transmit RSVP</h2>
                <p className="opacity-60 font-light">Presence confirmation required for atmospheric entry and seating allocation.</p>
                <div className="space-y-4">
                   <button className={`${t.button} w-full py-5 font-bold uppercase tracking-widest rounded-xl shadow-xl hover:shadow-cyan-500/20 active:scale-95 transition-all`}>
                      Confirm Credentials
                   </button>
                   <p className="text-[10px] opacity-30 uppercase font-mono tracking-widest">End of transmission</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-20 text-center opacity-20 text-xs font-mono uppercase tracking-[1em]">
            Far7etna 2026 // v2.0.4
          </footer>
        </div>
      )}
    </div>
  );
};

export default GuestView;