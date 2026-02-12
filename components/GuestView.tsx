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

  const startInteraction = () => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(err => console.warn("Audio blocked:", err));
    }
    setIsOpened(true);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(err => console.error("Play error:", err));
    }
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-700 font-sans`}>
      <audio ref={audioRef} src={t.audioUrl} loop preload="auto" />

      {!isOpened && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
          <div className={`${t.panel} max-w-md w-full p-8 text-center space-y-6 shadow-2xl`}>
            <Lock className="h-12 w-12 mx-auto text-cyan-500 animate-pulse" />
            <h2 className="text-2xl font-display font-bold uppercase tracking-widest">{data.partner1} & {data.partner2}</h2>
            <p className="text-slate-400 text-sm">SECURE INVITATION DETECTED</p>
            <button 
              onClick={startInteraction}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest transition-all rounded"
            >
              Initialize Access
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
                <button onClick={toggleMusic} className="p-2 bg-current/10 rounded-full">
                  {musicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button onClick={onEdit} className="text-xs uppercase opacity-50 hover:opacity-100">Edit</button>
              </div>
            </div>
          </nav>

          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
            <h1 className="text-6xl md:text-9xl font-display font-black leading-none uppercase mb-8">
              <HolographicText text={data.partner1} theme={data.theme} /><br/>
              <span className="text-4xl md:text-6xl italic font-serif">&</span><br/>
              <HolographicText text={data.partner2} theme={data.theme} />
            </h1>
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-center gap-4 text-xl opacity-80">
                <Calendar className="h-6 w-6 text-cyan-500" />
                <span>{new Date(data.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xl opacity-80">
                <MapPin className="h-6 w-6 text-cyan-500" />
                <span>{data.venueName}</span>
              </div>
            </div>
            <div className="mt-16 animate-bounce opacity-30"><ChevronDown className="h-10 w-10" /></div>
          </section>

          <section className="py-24 px-6 max-w-4xl mx-auto">
            <div className={`${t.panel} p-8 md:p-16 rounded-3xl`}>
              <h2 className="text-3xl font-display font-bold mb-8 uppercase tracking-tighter">Our Story</h2>
              <p className="text-xl md:text-3xl leading-relaxed font-serif italic opacity-90">{data.storyNarrative}</p>
            </div>
          </section>

          <section className="py-24 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-display font-bold uppercase tracking-tighter">Mission Timeline</h2>
              <div className="space-y-6">
                {data.schedule.map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="font-mono text-cyan-500 pt-1">{item.time}</span>
                    <div>
                      <h4 className="text-xl font-bold">{item.event}</h4>
                      <p className="opacity-60">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${t.panel} p-8 rounded-3xl flex flex-col justify-center text-center space-y-6`}>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tighter">RSVP</h2>
              <p className="opacity-60">Initialize your presence in the future assembly.</p>
              <button className={`${t.button} py-4 font-bold uppercase tracking-widest rounded`}>Submit Credentials</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default GuestView;