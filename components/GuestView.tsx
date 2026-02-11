import React, { useState, useEffect, useRef } from 'react';
import { InvitationData, ChatMessage } from '../types';
import { getConciergeResponse } from '../services/gemini';
import { 
  Calendar, MapPin, MessageSquare, Send, Clock, 
  Coffee, Globe, X, ChevronDown, Play, Pause, CheckCircle, Users,
  Share2, Copy, Sparkles, Box, ExternalLink,
  Lock, Fingerprint, Instagram, Facebook, Twitter, MessageCircle,
  Volume2, Volume1, VolumeX
} from 'lucide-react';

// --- Theme Definitions ---
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
  fontBody: string;
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
    panel: 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(14,165,233,0.1)]',
    fontHeading: 'font-display',
    fontBody: 'font-sans',
    button: 'bg-white text-black hover:bg-cyan-400 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    buttonSecondary: 'bg-slate-800 text-white hover:bg-slate-700',
    icon: 'text-cyan-400',
    nav: 'border-b border-white/5 bg-[#020617]/80 backdrop-blur-md',
    // Ultra stable test MP3
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
    panel: 'bg-white/70 backdrop-blur-md border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-500',
    fontHeading: 'font-serif italic',
    fontBody: 'font-sans',
    button: 'bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-lg hover:-translate-y-1',
    buttonSecondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200',
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
    panel: 'bg-transparent border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all',
    fontHeading: 'font-sans tracking-tighter font-black uppercase',
    fontBody: 'font-mono',
    button: 'bg-black text-white hover:bg-gray-800 rounded-none border-2 border-black hover:shadow-none transition-all',
    buttonSecondary: 'bg-white text-black border-2 border-black hover:bg-gray-100 rounded-none',
    icon: 'text-black',
    nav: 'border-b-2 border-black bg-white/95',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
};

// --- Sub-Components ---

const HolographicText = ({ text, className = "", gradient = false, theme }: { text: string, className?: string, gradient?: boolean, theme: ThemeType }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  
  if (theme === 'minimalist') {
    return (
      <span className={`relative inline-block ${className} group cursor-default`}>
         <span className="relative z-10 group-hover:bg-black group-hover:text-white transition-colors duration-200 px-1 -mx-1">
            {text}
         </span>
         <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-black animate-pulse opacity-50"></span>
      </span>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setOffset({ x: x * 15, y: y * 15 });
    setHover(true);
  };

  const reset = () => {
    setOffset({ x: 0, y: 0 });
    setHover(false);
  };

  const transform = hover 
    ? `perspective(800px) rotateY(${offset.x}deg) rotateX(${-offset.y}deg) scale(1.05)` 
    : 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';

  const dynamicColor = theme === 'cyberpunk' 
    ? { filter: hover ? `hue-rotate(${offset.x * 3}deg)` : 'none' }
    : { filter: hover ? `hue-rotate(${offset.x * 2}deg) brightness(1.1)` : 'none' };

  return (
    <div 
      className={`relative inline-block transition-transform duration-200 ease-out select-none cursor-crosshair ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ transform, transformStyle: 'preserve-3d', ...dynamicColor }}
    >
      <span className={`absolute inset-0 ${theme === 'cyberpunk' ? 'text-cyan-400' : 'text-emerald-400'} opacity-20 blur-[8px] select-none pointer-events-none transition-all duration-300 ${hover ? 'opacity-40 scale-110' : ''}`}>
          {text}
      </span>
      <span 
        className={`absolute inset-0 ${theme === 'cyberpunk' ? 'text-red-500' : 'text-rose-300'} opacity-0 mix-blend-screen transition-opacity duration-100 ${hover ? 'opacity-70' : ''} pointer-events-none select-none`}
        style={{ transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)`, filter: 'blur(1px)' }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className={`absolute inset-0 ${theme === 'cyberpunk' ? 'text-blue-500' : 'text-teal-300'} opacity-0 mix-blend-screen transition-opacity duration-100 ${hover ? 'opacity-70' : ''} pointer-events-none select-none`}
        style={{ transform: `translate(${-offset.x * 0.5}px, ${-offset.y * 0.5}px)`, filter: 'blur(1px)' }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span className={`relative z-10 block ${gradient && theme === 'cyberpunk' ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-200' : 'text-inherit'} drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]`}>
        {text}
      </span>
      {theme === 'ethereal' && hover && (
         <span className="absolute -top-2 -right-2 text-yellow-200 animate-ping h-2 w-2 opacity-50">*</span>
      )}
    </div>
  );
};

const CelebrationConfetti = ({ theme }: { theme: ThemeType }) => {
   const [particles, setParticles] = useState<any[]>([]);
   
   useEffect(() => {
     if (theme === 'minimalist') {
       setParticles([]);
       return;
     }
     const newParticles = Array.from({ length: 50 }).map((_, i) => ({
       id: i,
       x: Math.random() * 100,
       y: -10 - Math.random() * 20,
       color: theme === 'cyberpunk' 
         ? ['#06b6d4', '#d946ef', '#8b5cf6'][Math.floor(Math.random() * 3)] 
         : ['#a7f3d0', '#fecdd3', '#e2e8f0'][Math.floor(Math.random() * 3)],
       shape: theme === 'cyberpunk' ? 'square' : 'circle',
       duration: 3 + Math.random() * 4,
       delay: Math.random() * 2,
       rotation: Math.random() * 360
     }));
     setParticles(newParticles);
   }, [theme]);

   if (theme === 'minimalist') return null;

   return (
     <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden h-screen w-screen">
        {particles.map(p => (
           <div 
             key={p.id}
             className={`absolute ${p.shape === 'circle' ? 'rounded-full' : 'rounded-none'}`}
             style={{
               left: `${p.x}vw`,
               top: '-20px',
               width: p.shape === 'circle' ? '12px' : '8px',
               height: p.shape === 'circle' ? '12px' : '8px',
               backgroundColor: p.color,
               transform: `rotate(${p.rotation}deg)`,
               animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
               opacity: 0.8
             }}
           />
        ))}
     </div>
   )
};

const Countdown = ({ targetDate, theme }: { targetDate: string, theme: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className={`flex flex-col items-center p-2 md:p-4 ${theme.panel} ${theme.id === 'minimalist' ? 'rounded-none border-2 border-black' : 'rounded-xl'} min-w-[70px] md:min-w-[90px]`}>
      <span className={`text-2xl md:text-3xl font-bold ${theme.text} ${theme.id === 'cyberpunk' ? 'text-glow' : ''}`}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className={`text-[10px] md:text-xs uppercase tracking-widest ${theme.textMuted}`}>{label}</span>
    </div>
  );

  return (
    <div className="flex gap-2 md:gap-4 justify-center mt-8 md:mt-12 animate-in slide-in-from-bottom-5 fade-in duration-1000">
      <TimeBox value={timeLeft.days} label="Days" />
      <TimeBox value={timeLeft.hours} label="Hrs" />
      <TimeBox value={timeLeft.minutes} label="Mins" />
      <TimeBox value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

// --- Envelope Component ---
const Envelope = ({ theme, onOpen, onStartMusic, partner1, partner2 }: { theme: ThemeType, onOpen: () => void, onStartMusic: () => void, partner1: string, partner2: string }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    onStartMusic(); 
    setIsOpening(true);
    setTimeout(() => {
        window.scrollTo(0,0);
        onOpen();
    }, 1500);
  };

  if (theme === 'cyberpunk') {
    return (
      <div className={`fixed inset-0 z-[100] bg-black h-[100dvh] w-screen flex items-center justify-center transition-all duration-1000 ${isOpening ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
        <div className={`relative w-[90%] max-w-md aspect-[4/3] bg-slate-900 border-2 border-cyan-500/50 p-1 rounded-sm shadow-[0_0_50px_rgba(6,182,212,0.3)] group ${isOpening ? 'animate-ping opacity-0' : ''}`}>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
           <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 animate-[scan_2s_linear_infinite] shadow-[0_0_10px_#06b6d4]"></div>
           <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-mono text-cyan-500/50">SECURE DATA LINK</div>
              <div className="absolute bottom-4 right-4 text-xs font-mono text-cyan-500/50">AES-4096</div>
              <Lock className="h-12 w-12 md:h-16 md:w-16 text-cyan-500 animate-pulse" />
              <div className="text-center space-y-2 z-10 px-4">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-widest uppercase">
                  {partner1} & {partner2}
                </h2>
                <p className="text-cyan-400 font-mono text-xs md:text-sm animate-pulse">Incoming Transmission</p>
              </div>
              <button 
                onClick={handleOpen}
                className="group relative px-6 py-2 md:px-8 md:py-3 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 font-mono font-bold uppercase tracking-wider hover:bg-cyan-500 hover:text-black transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                  <Fingerprint className="h-4 w-4 md:h-5 md:w-5" /> Decrypt
                </span>
                <div className="absolute inset-0 bg-cyan-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (theme === 'ethereal') {
    return (
      <div className={`fixed inset-0 z-[100] bg-[#fafaf9] h-[100dvh] w-screen flex items-center justify-center transition-all duration-1500 ${isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div className="absolute inset-0 overflow-hidden">
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-100 rounded-full blur-[100px] animate-[blob-pulse_8s_ease-in-out_infinite]"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-100 rounded-full blur-[100px] animate-[blob-pulse_10s_ease-in-out_infinite_reverse]"></div>
         </div>
         <div 
           onClick={handleOpen}
           className={`relative w-[90%] max-w-lg aspect-[1.4/1] bg-white shadow-2xl flex items-center justify-center cursor-pointer transform transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${isOpening ? 'scale-150 opacity-0 blur-xl' : ''}`}
         >
            <div className="absolute top-0 left-0 w-full h-1/2 bg-stone-50 border-b border-stone-100 clip-path-polygon-[0_0,100%_0,50%_100%] shadow-sm z-10"></div>
            <div className="text-center z-20 transform transition-all duration-500 group-hover:-translate-y-2">
               <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-700 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 border-4 border-double border-emerald-800 text-white font-serif italic text-2xl">
                 <span className="opacity-90">{partner1.charAt(0)}&{partner2.charAt(0)}</span>
               </div>
               <p className="text-stone-500 font-serif italic tracking-widest text-sm">Tap to unseal</p>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-white h-[100dvh] w-screen flex items-center justify-center overflow-hidden pointer-events-none`}>
       <div className={`absolute top-0 left-0 w-1/2 h-full bg-black border-r border-white flex items-center justify-end pr-4 transition-transform duration-1000 ease-in-out ${isOpening ? '-translate-x-full' : 'translate-x-0'} pointer-events-auto`}>
          <h1 className="text-white font-black text-4xl md:text-8xl tracking-tighter uppercase writing-vertical-rl rotate-180">
            {partner1}
          </h1>
       </div>
       <div className={`absolute top-0 right-0 w-1/2 h-full bg-white flex items-center justify-start pl-4 transition-transform duration-1000 ease-in-out ${isOpening ? 'translate-x-full' : 'translate-x-0'} pointer-events-auto`}>
          <h1 className="text-black font-black text-4xl md:text-8xl tracking-tighter uppercase writing-vertical-rl">
            {partner2}
          </h1>
       </div>
       <div className={`absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isOpening ? 'opacity-0' : 'opacity-100'} pointer-events-auto`}>
          <button 
            onClick={handleOpen}
            className="bg-white border-2 border-black px-6 py-3 md:px-8 md:py-4 text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base"
          >
            Open
          </button>
       </div>
    </div>
  );
};


// --- Main Component ---

interface GuestViewProps {
  data: InvitationData;
  onEdit: () => void;
}

const GuestView: React.FC<GuestViewProps> = ({ data, onEdit }) => {
  const currentTheme = data.theme;
  const [isOpened, setIsOpened] = useState(false);
  const t = themes[currentTheme];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [showVolume, setShowVolume] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Greetings. I am AURA, the automated concierge. How may I assist you today?`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // RSVP State
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpStep, setRsvpStep] = useState<'form' | 'success'>('form');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attendance, setAttendance] = useState<'attending' | 'declining' | null>(null);

  // Share State
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Audio Handler: Source Change & Auto-resume
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = musicVolume;
        // Force an explicit load to clear any previous source errors
        audioRef.current.load();
        
        if (musicPlaying) {
             const playPromise = audioRef.current.play();
             if (playPromise !== undefined) {
                 playPromise.catch(e => console.warn("Auto-resume failed:", e.message));
             }
        }
    }
  }, [currentTheme]); 

  // Audio Handler: Play/Pause Logic (User Triggered)
  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
             playPromise.catch(e => {
                console.warn("Playback failed:", e.message);
             });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying]);

  // Audio Handler: Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const startMusic = () => {
    setMusicPlaying(true);
    if(audioRef.current) {
        audioRef.current.volume = musicVolume;
        // Explicitly load before play to satisfy interaction requirements
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Initial playback failed:", error.message);
            });
        }
    }
  };
  
  const handleEnvelopeOpen = () => {
    setIsOpened(true);
  };

  useEffect(() => {
    window.scrollTo(0,0);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const aiText = await getConciergeResponse(history, userMsg.text, data);

    setMessages(prev => [...prev, { role: 'model', text: aiText, timestamp: Date.now() }]);
    setIsTyping(false);
  };

  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance || !guestName) return;
    setRsvpStep('success');
  };

  const closeRsvp = () => {
    setRsvpOpen(false);
    setTimeout(() => {
      setRsvpStep('form');
      setGuestName('');
      setGuestCount(1);
      setAttendance(null);
    }, 500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`You are invited to the wedding of ${data.partner1} & ${data.partner2}!`);
    let shareUrl = '';
    switch (platform) {
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
        case 'instagram': handleCopyLink(); return;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const StatCard = ({ icon: Icon, value, label, delay }: any) => (
    <div 
      className={`${t.panel} p-6 ${currentTheme === 'minimalist' ? 'rounded-none' : 'rounded-2xl'} flex flex-col items-center justify-center group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-3 p-3 rounded-full ${currentTheme === 'cyberpunk' ? 'bg-white/5 group-hover:bg-cyan-500/20' : currentTheme === 'ethereal' ? 'bg-stone-100 group-hover:bg-emerald-100 group-hover:scale-110' : 'bg-black text-white group-hover:rotate-12'} transition-all duration-500`}>
        <Icon className={`h-8 w-8 ${currentTheme === 'minimalist' ? 'text-white' : t.icon}`} />
      </div>
      <div className={`text-3xl ${t.fontHeading} font-bold ${t.text} mb-1 ${currentTheme === 'cyberpunk' ? 'group-hover:text-glow' : ''} transition-all`}>{value}</div>
      <div className={`text-sm ${t.textMuted} uppercase tracking-widest`}>{label}</div>
    </div>
  );

  const hasStats = data.stats.daysTogether !== undefined || data.stats.milesTraveled !== undefined || data.stats.coffeesShared !== undefined;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.venueName} ${data.location}`)}`;

  const getEntranceClass = () => {
    if (!isOpened) return 'opacity-0 h-0 overflow-hidden';
    if (currentTheme === 'cyberpunk') return 'entrance-cyberpunk';
    if (currentTheme === 'ethereal') return 'entrance-ethereal';
    if (currentTheme === 'minimalist') return 'entrance-minimalist';
    return 'opacity-100 transition-opacity duration-1000';
  }

  // Common button style for navbar icons
  const navButtonStyle = `p-2 rounded-full ${currentTheme === 'minimalist' ? 'rounded-none border-2 border-black hover:bg-black hover:text-white' : 'bg-current/5 hover:bg-current/10'} transition-all hover:scale-110 flex items-center justify-center`;

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-700 font-sans selection:bg-cyan-500/30 overflow-x-hidden`}>
      <style>{`
        /* Keyframes preserved */
        @keyframes grid-pan { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes blob-pulse { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.1); opacity: 0.6; } }
        @keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        
        .entrance-cyberpunk { animation: cyber-construct 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .entrance-ethereal { animation: bloom-intro 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .entrance-minimalist { animation: minimalist-intro 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes cyber-construct { 0% { opacity: 0; clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); transform: translateY(-50px) scaleY(0); filter: brightness(2) hue-rotate(180deg); } 40% { opacity: 1; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translateY(0) scaleY(1); filter: brightness(1.5) hue-rotate(90deg); } 70% { filter: brightness(1.2) hue-rotate(0deg); } 80% { opacity: 0.8; } 90% { opacity: 1; } 100% { opacity: 1; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: scale(1); filter: none; } }
        @keyframes bloom-intro { 0% { opacity: 0; transform: scale(0.9) translateY(40px); filter: blur(20px) brightness(3) saturate(2); } 40% { opacity: 0.6; transform: scale(0.98) translateY(10px); filter: blur(5px) brightness(1.5); } 100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0) brightness(1) saturate(1); } }
        @keyframes minimalist-intro { 0% { opacity: 0; clip-path: inset(100% 0 0 0); transform: translateY(20px); } 100% { opacity: 1; clip-path: inset(0 0 0 0); transform: translateY(0); } }
        @keyframes text-reveal { 0% { opacity: 0; transform: translateY(15px); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes slide-in-fade { 0% { opacity: 0; transform: translateX(-20px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* 
         Audio Element Configuration:
         - key={currentTheme}: Forces re-mount on theme change for clean source state.
         - Loop and Preload for seamless background ambiance.
      */}
      <audio 
        key={currentTheme}
        ref={audioRef} 
        loop 
        preload="auto"
        onCanPlayThrough={() => console.log('Audio stream established')}
        onError={(e) => console.error("Stream Acquisition Failed:", e.currentTarget.error)}
      >
        <source src={t.audioUrl} type="audio/mpeg" />
      </audio>
      
      {!isOpened && (
        <Envelope 
          theme={currentTheme} 
          onOpen={handleEnvelopeOpen} 
          onStartMusic={startMusic}
          partner1={data.partner1} 
          partner2={data.partner2} 
        />
      )}

      <div className={getEntranceClass()}>
        <CelebrationConfetti theme={currentTheme} />

        {/* Dynamic Backgrounds */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700">
          {currentTheme === 'cyberpunk' && (
            <>
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </>
          )}
          {currentTheme === 'ethereal' && (
            <>
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-rose-200/30 rounded-full blur-[100px] animate-[blob-pulse_10s_ease-in-out_infinite]"></div>
              <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-200/30 rounded-full blur-[100px] animate-[blob-pulse_15s_ease-in-out_infinite_reverse]"></div>
              <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
            </>
          )}
          {currentTheme === 'minimalist' && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem]" style={{ animation: 'grid-pan 60s linear infinite' }}></div>
          )}
        </div>

        {/* Navigation with Enhanced Music Controls */}
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? `${t.nav} py-3 shadow-md` : 'py-6'}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className={`${t.fontHeading} font-bold text-xl tracking-wider ${t.text}`}>
              {data.partner1} & {data.partner2}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShareOpen(true)} className={navButtonStyle} title="Share Invitation">
                <Share2 className="h-4 w-4" />
              </button>

              <div className={`flex items-center ${currentTheme === 'minimalist' ? 'border-2 border-black bg-white' : 'bg-current/5 rounded-full'} transition-all`}>
                  <button 
                    onClick={() => setMusicPlaying(!musicPlaying)}
                    className={`p-2 hover:opacity-70 transition-opacity flex items-center justify-center`}
                    title={musicPlaying ? "Pause" : "Play"}
                  >
                    {musicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  
                  <div className={`h-4 w-px ${currentTheme === 'minimalist' ? 'bg-black' : 'bg-current/20'}`}></div>

                  <div 
                    className="relative flex items-center group"
                    onMouseEnter={() => setShowVolume(true)}
                    onMouseLeave={() => setShowVolume(false)}
                  >
                     <button 
                        onClick={() => setMusicVolume(prev => prev === 0 ? 0.5 : 0)}
                        className={`p-2 hover:opacity-70 transition-opacity`}
                     >
                        {musicVolume === 0 ? <VolumeX className="h-4 w-4" /> : musicVolume < 0.5 ? <Volume1 className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                     </button>
                     
                     <div className={`overflow-hidden transition-all duration-300 ease-out flex items-center ${showVolume ? 'w-32 opacity-100 pr-3' : 'w-0 opacity-0'}`}>
                        <input 
                           type="range" min="0" max="1" step="0.05"
                           value={musicVolume}
                           onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                           className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${currentTheme === 'minimalist' ? 'bg-gray-200 accent-black' : currentTheme === 'ethereal' ? 'bg-stone-200 accent-emerald-600' : 'bg-slate-700 accent-cyan-400'}`}
                        />
                        <span className={`text-[10px] ml-2 w-6 text-right font-mono ${t.textMuted}`}>
                           {Math.round(musicVolume * 100)}%
                        </span>
                     </div>
                  </div>
              </div>

              <button onClick={onEdit} className="text-xs opacity-70 hover:opacity-100 transition-opacity uppercase tracking-widest ml-2">
                Edit
              </button>
            </div>
          </div>
        </nav>
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center z-10 pt-20">
          <div className="text-center space-y-8 px-4 w-full">
            <div className={`inline-block px-4 py-1 ${currentTheme === 'minimalist' ? 'border-2 border-black rounded-none bg-white text-black font-bold' : 'rounded-full border border-current/30 bg-current/5'} text-sm tracking-[0.2em] uppercase mb-4 animate-in fade-in zoom-in duration-1000`}>
              You Are Invited
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl leading-tight flex flex-col items-center">
              <div className={`${t.fontHeading} ${currentTheme === 'cyberpunk' ? '' : t.text}`}>
                <HolographicText text={data.partner1} gradient={currentTheme === 'cyberpunk'} theme={currentTheme} className="py-2" />
              </div>
              <span className={`block text-4xl md:text-6xl ${currentTheme === 'cyberpunk' ? 'text-purple-400' : t.accent} font-serif italic my-4 animate-pulse`}>&</span>
              <div className={`${t.fontHeading} ${currentTheme === 'cyberpunk' ? '' : t.text}`}>
                <HolographicText text={data.partner2} gradient={currentTheme === 'cyberpunk'} theme={currentTheme} className="py-2" />
              </div>
            </h1>
            
            <div className={`flex flex-col md:flex-row items-center justify-center gap-6 text-lg md:text-xl ${t.textMuted} font-light tracking-wide mt-12`}>
              <div className="flex items-center gap-2 group cursor-default">
                <Calendar className={`${t.icon} h-5 w-5 group-hover:scale-110 transition-transform`} />
                <span className="group-hover:text-current transition-colors">{new Date(data.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className={`hidden md:block w-px h-6 ${currentTheme === 'minimalist' ? 'bg-black' : 'bg-current opacity-20'}`}></div>
              <div className="flex items-center gap-2 group cursor-default">
                <MapPin className={`${t.icon} h-5 w-5 group-hover:scale-110 transition-transform`} />
                <span className="group-hover:text-current transition-colors">{data.venueName}</span>
              </div>
            </div>
            
            <Countdown targetDate={data.date} theme={t} />

            <div className="pt-12">
              <ChevronDown className={`h-8 w-8 ${t.textMuted} mx-auto animate-bounce`} />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {hasStats && (
          <section className="relative z-10 py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className={`grid grid-cols-1 ${data.stats.daysTogether && data.stats.milesTraveled && data.stats.coffeesShared ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 justify-center`}>
                {data.stats.daysTogether !== undefined && (
                  <StatCard icon={Clock} value={data.stats.daysTogether} label="Days Together" delay={0} />
                )}
                {data.stats.milesTraveled !== undefined && (
                  <StatCard icon={Globe} value={data.stats.milesTraveled.toLocaleString()} label="Miles Traveled" delay={100} />
                )}
                {data.stats.coffeesShared !== undefined && (
                  <StatCard icon={Coffee} value={data.stats.coffeesShared.toLocaleString()} label="Coffees Shared" delay={200} />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Story Section */}
        <section className={`relative z-10 py-24 px-6 ${currentTheme === 'cyberpunk' ? 'bg-gradient-to-b from-transparent to-slate-900/50' : ''}`}>
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className={`text-4xl md:text-5xl ${t.fontHeading} font-bold`}>Our Saga</h2>
            <div className={`${t.panel} p-8 md:p-12 ${currentTheme === 'minimalist' ? 'rounded-none' : 'rounded-3xl'} relative overflow-hidden group hover:scale-[1.01] transition-transform duration-700`}>
              {currentTheme === 'cyberpunk' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>}
              
              <div className={`text-lg md:text-2xl leading-relaxed ${currentTheme === 'cyberpunk' ? 'text-slate-200' : t.text} font-serif italic relative z-10`}>
                 {(data.storyNarrative || 'Loading our story from the archives...').split(' ').map((word, i) => (
                    <span 
                        key={i} 
                        className={`inline-block mr-[0.25em] ${isOpened ? 'opacity-0 animate-[text-reveal_0.5s_ease-out_forwards]' : ''}`}
                        style={{ animationDelay: `${i * 30 + 300}ms` }}
                    >
                        {word}
                    </span>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className={`${t.panel} ${currentTheme === 'minimalist' ? 'rounded-none p-0' : 'rounded-3xl p-2'} h-[400px] relative overflow-hidden group block hover:shadow-2xl transition-all duration-500 cursor-pointer`}>
              <div className={`absolute inset-0 ${currentTheme === 'minimalist' ? 'bg-gray-100' : 'bg-slate-800'} flex items-center justify-center transition-transform duration-1000 group-hover:scale-105`}>
                <span className="text-slate-500 flex flex-col items-center gap-4">
                  <MapPin className="h-12 w-12 animate-bounce" />
                  <span className="animate-pulse">Click to Navigate</span>
                </span>
              </div>
              <div className={`absolute top-6 left-6 ${currentTheme === 'cyberpunk' ? 'bg-black/60 backdrop-blur-md text-white' : 'bg-white text-black shadow-lg'} p-4 rounded-xl border ${currentTheme === 'minimalist' ? 'border-2 border-black rounded-none shadow-none' : 'border-white/10'} group-hover:scale-105 transition-transform`}>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {data.venueName} 
                  <ExternalLink className="h-4 w-4 opacity-50" />
                </h3>
                <p className={`text-sm ${currentTheme === 'cyberpunk' ? 'text-slate-400' : 'text-gray-500'}`}>Target Coordinates Locked</p>
              </div>
            </a>

            <div className={`${t.panel} ${currentTheme === 'minimalist' ? 'rounded-none' : 'rounded-3xl'} p-8`}>
              <h3 className={`text-3xl ${t.fontHeading} font-bold mb-8 flex items-center gap-3`}>
                <div className={`h-2 w-2 ${t.accentBg} rounded-full animate-pulse`}></div>
                Mission Protocol
              </h3>
              <div className={`space-y-8 relative before:absolute before:left-[19px] before:top-2 before:h-full before:w-[2px] ${currentTheme === 'minimalist' ? 'before:bg-black' : 'before:bg-current before:opacity-10'}`}>
                {data.schedule.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`relative flex items-start gap-6 group ${isOpened ? 'opacity-0 animate-[slide-in-fade_0.6s_ease-out_forwards]' : ''}`}
                    style={{ animationDelay: `${1000 + idx * 200}ms` }}
                  >
                    <div className={`relative z-10 h-10 w-10 rounded-full ${currentTheme === 'minimalist' ? 'bg-white border-2 border-black rounded-none group-hover:bg-black group-hover:text-white' : `bg-slate-900 border border-slate-700 ${currentTheme === 'ethereal' ? 'bg-white border-stone-200' : ''}`} flex items-center justify-center transition-all duration-300`}>
                      <span className={`text-xs font-mono ${t.accent} ${currentTheme === 'minimalist' ? 'group-hover:text-white' : ''}`}>{idx + 1}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`text-xl font-bold ${t.text} transition-colors`}>
                          <HolographicText text={item.event} theme={currentTheme} />
                        </h4>
                        <span className={`font-mono text-sm ${t.textMuted}`}>{item.time}</span>
                      </div>
                      <p className={`text-sm ${t.textMuted}`}>{item.description || 'Proceed to designated sector.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RSVP CTA */}
        <section className="relative z-10 py-32 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className={`text-5xl ${t.fontHeading} font-bold`}>Secure Your Vector</h2>
            <button 
              onClick={() => setRsvpOpen(true)}
              className={`${t.button} font-bold text-lg px-12 py-4 ${currentTheme === 'minimalist' ? 'rounded-none' : 'rounded-full'} transition-all hover:scale-105`}
            >
              Initialize RSVP
            </button>
          </div>
        </section>
      </div>
      
      {/* RSVP Modal & Chat Bubbles preserved ... */}
      {/* RSVP Modal */}
      {rsvpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`${t.panel} ${currentTheme === 'cyberpunk' ? 'bg-slate-900' : 'bg-white'} w-full max-w-md ${currentTheme === 'minimalist' ? 'rounded-none border-2 border-black' : 'rounded-3xl'} p-8 relative shadow-2xl`}>
              <button onClick={closeRsvp} className={`absolute top-4 right-4 ${t.textMuted} hover:${t.text} transition-colors`}><X className="h-6 w-6" /></button>
              {rsvpStep === 'form' ? (
                <form onSubmit={submitRsvp} className="space-y-6">
                  <div className="text-center mb-8"><h3 className={`text-2xl ${t.fontHeading} font-bold`}>Access Clearance</h3></div>
                  <div className="space-y-4">
                    <input type="text" required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Full Name" className={`w-full bg-transparent border ${currentTheme === 'minimalist' ? 'rounded-none border-black' : 'rounded-xl'} p-3 outline-none ${t.text}`} />
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setAttendance('attending')} className={`p-3 border ${attendance === 'attending' ? `${t.accentBg} text-white` : ''} ${currentTheme === 'minimalist' ? 'rounded-none border-black' : 'rounded-xl'}`}>Accept</button>
                        <button type="button" onClick={() => setAttendance('declining')} className={`p-3 border ${attendance === 'declining' ? 'bg-red-500 text-white' : ''} ${currentTheme === 'minimalist' ? 'rounded-none border-black' : 'rounded-xl'}`}>Decline</button>
                    </div>
                  </div>
                  <button type="submit" disabled={!attendance || !guestName} className={`w-full ${t.button} font-bold py-4 ${currentTheme === 'minimalist' ? 'rounded-none' : 'rounded-xl'}`}>Transmit</button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <CheckCircle className={`h-12 w-12 ${t.accent} mx-auto`} />
                  <h3 className={`text-2xl font-bold ${t.text}`}>Transmission Received</h3>
                  <button onClick={closeRsvp} className={`${t.buttonSecondary} px-8 py-2 rounded-xl`}>Close</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Concierge Chat Bubble */}
        <div className="fixed bottom-6 right-6 z-50">
          {!chatOpen && (
            <button onClick={() => setChatOpen(true)} className={`h-16 w-16 ${t.button} rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110`}><MessageSquare className="h-8 w-8 text-white" /></button>
          )}
          {chatOpen && (
            <div className={`${t.panel} ${currentTheme === 'cyberpunk' ? 'bg-slate-900' : 'bg-white'} w-[90vw] md:w-[400px] h-[500px] ${currentTheme === 'minimalist' ? 'rounded-none border-2 border-black' : 'rounded-2xl'} flex flex-col shadow-2xl overflow-hidden`}>
              <div className="p-4 border-b flex justify-between items-center">
                <span className={`${t.fontHeading} font-bold ${t.text}`}>AURA AI</span>
                <button onClick={() => setChatOpen(false)} className={t.textMuted}><X className="h-5 w-5" /></button>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 text-sm ${currentTheme === 'minimalist' ? 'border border-black' : 'rounded-2xl'} ${msg.role === 'user' ? `${t.accentBg} text-white` : `bg-gray-100 ${t.text}`}`}>{msg.text}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask AURA..." className="flex-1 bg-gray-100 p-2 text-sm outline-none" />
                <button onClick={handleSend} className={t.button}><Send className="h-5 w-5" /></button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default GuestView;