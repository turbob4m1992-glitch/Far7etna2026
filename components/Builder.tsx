import React, { useState } from 'react';
import { InvitationData, ScheduleItem } from '../types';
import { Sparkles, Save, Wand2, Calendar, MapPin, Heart, Clock, Trash2, Plus, Palette, Users, ArrowRight } from 'lucide-react';
import { generateLoveStory } from '../services/gemini';

interface BuilderProps {
  data: InvitationData;
  onUpdate: (data: InvitationData) => void;
  onLaunch: () => void;
}

const Builder: React.FC<BuilderProps> = ({ data, onUpdate, onLaunch }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field: keyof InvitationData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleStatChange = (stat: keyof typeof data.stats, value: string) => {
    const parsed = parseInt(value);
    onUpdate({
      ...data,
      stats: { ...data.stats, [stat]: isNaN(parsed) ? undefined : parsed }
    });
  };

  const handleGenerateStory = async () => {
    if (!data.storyPoints) return;
    setIsGenerating(true);
    const story = await generateLoveStory(data.partner1, data.partner2, data.storyPoints);
    handleChange('storyNarrative', story);
    setIsGenerating(false);
  };

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    const newSchedule = [...data.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    handleChange('schedule', newSchedule);
  };

  const addScheduleItem = () => {
    const newItem: ScheduleItem = { time: '', event: '', description: '', icon: 'circle' };
    handleChange('schedule', [...data.schedule, newItem]);
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = data.schedule.filter((_, i) => i !== index);
    handleChange('schedule', newSchedule);
  };

  // --- Dynamic Theme Styles for Builder UI ---
  const getThemeStyles = () => {
    switch (data.theme) {
      case 'ethereal':
        return {
          wrapper: 'bg-[#f5f5f4] text-stone-800',
          panel: 'bg-white/80 backdrop-blur-xl border border-stone-200 shadow-sm',
          input: 'bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-stone-800 placeholder:text-stone-400 outline-none transition-all',
          label: 'text-stone-500 font-serif italic text-sm',
          headerTitle: 'from-emerald-600 to-teal-600',
          subHeader: 'text-stone-500 font-serif italic',
          buttonPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-200/50 rounded-lg',
          buttonAction: 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg',
          icon: 'text-emerald-600',
          accent: 'text-emerald-500',
          cardSelected: 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500',
          cardUnselected: 'border-stone-200 bg-white text-stone-500 hover:border-emerald-300',
          scheduleItem: 'bg-white border border-stone-200',
        };
      case 'minimalist':
        return {
          wrapper: 'bg-white text-black',
          panel: 'bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
          input: 'bg-white border-2 border-black rounded-none focus:bg-gray-50 text-black placeholder:text-gray-400 outline-none transition-all font-mono text-sm',
          label: 'text-black font-bold uppercase tracking-widest text-xs',
          headerTitle: 'from-black to-gray-800',
          subHeader: 'text-gray-600 font-mono text-xs uppercase tracking-widest',
          buttonPrimary: 'bg-black hover:bg-gray-800 text-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-black',
          buttonAction: 'bg-white border-2 border-black text-black hover:bg-gray-100 rounded-none',
          icon: 'text-black',
          accent: 'text-black',
          cardSelected: 'border-2 border-black bg-black text-white',
          cardUnselected: 'border-2 border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black rounded-none',
          scheduleItem: 'bg-white border-2 border-black rounded-none',
        };
      case 'cyberpunk':
      default:
        return {
          wrapper: 'bg-slate-900 text-white',
          panel: 'bg-slate-900/60 backdrop-blur-xl border border-slate-700',
          input: 'bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder:text-slate-500 outline-none transition-all',
          label: 'text-slate-400 text-sm font-medium',
          headerTitle: 'from-cyan-400 to-fuchsia-500',
          subHeader: 'text-slate-400',
          buttonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)] rounded-full',
          buttonAction: 'bg-slate-800 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg',
          icon: 'text-cyan-500',
          accent: 'text-cyan-400',
          cardSelected: 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]',
          cardUnselected: 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600',
          scheduleItem: 'bg-slate-800/50 border border-slate-700',
        };
    }
  };

  const s = getThemeStyles();

  return (
    <div className={`min-h-screen ${s.wrapper} p-6 md:p-12 overflow-y-auto transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        <header className="space-y-2">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${data.theme === 'minimalist' ? 'bg-black text-white' : data.theme === 'ethereal' ? 'bg-emerald-100 text-emerald-600' : 'bg-cyan-500/20 text-cyan-400'}`}>
                <Sparkles className="h-6 w-6" />
             </div>
             <h1 className={`text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r ${s.headerTitle}`}>
                Vow.AI Builder
            </h1>
          </div>
          <p className={s.subHeader}>Design your futuristic experience.</p>
        </header>

        {/* Section: Visual Theme Selection (Moved to top for immediate impact) */}
        <div className={`${s.panel} p-6 rounded-2xl space-y-6 transition-all duration-300`}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Palette className={s.icon} /> Visual Theme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['cyberpunk', 'ethereal', 'minimalist'] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleChange('theme', t)}
                className={`p-4 transition-all text-left group ${data.theme === 'minimalist' ? 'rounded-none' : 'rounded-xl'} ${
                  data.theme === t ? s.cardSelected : s.cardUnselected
                }`}
              >
                <span className="capitalize font-bold block mb-1 text-lg group-hover:scale-105 transition-transform origin-left">
                  {t === 'cyberpunk' ? 'Neon Future' : t === 'ethereal' ? 'Botanical Dream' : 'Swiss Modern'}
                </span>
                <span className="text-xs opacity-70 block">
                    {t === 'cyberpunk' && 'Glitch effects, high contrast, neon aesthetic.'}
                    {t === 'ethereal' && 'Soft gradients, floating elements, dreamy vibes.'}
                    {t === 'minimalist' && 'Stark typography, monochrome, bold structure.'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: The Couple */}
        <div className={`${s.panel} p-6 rounded-2xl space-y-6 transition-all duration-300`}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className={`text-pink-500`} /> The Couple
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${s.label} block mb-2`}>Partner 1</label>
              <input
                type="text"
                value={data.partner1}
                onChange={(e) => handleChange('partner1', e.target.value)}
                className={`w-full p-3 ${s.input}`}
              />
            </div>
            <div>
              <label className={`${s.label} block mb-2`}>Partner 2</label>
              <input
                type="text"
                value={data.partner2}
                onChange={(e) => handleChange('partner2', e.target.value)}
                className={`w-full p-3 ${s.input}`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logistics */}
        <div className={`${s.panel} p-6 rounded-2xl space-y-6 transition-all duration-300`}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className={s.icon} /> Logistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${s.label} block mb-2`}>Date</label>
              <input
                type="date"
                value={data.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full p-3 ${s.input}`}
              />
            </div>
            <div>
              <label className={`${s.label} block mb-2`}>Venue Name</label>
              <input
                type="text"
                value={data.venueName}
                onChange={(e) => handleChange('venueName', e.target.value)}
                className={`w-full p-3 ${s.input}`}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`${s.label} block mb-2`}>Full Location Address</label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full p-3 ${s.input}`}
              />
            </div>
             <div className="md:col-span-2">
              <label className={`${s.label} block mb-2 flex items-center gap-2`}>
                <Users className="h-4 w-4" /> Max Guests Allowed (per invitation)
              </label>
              <div className={`flex items-center gap-4 p-4 rounded-lg ${data.theme === 'minimalist' ? 'border-2 border-black bg-gray-50' : data.theme === 'ethereal' ? 'bg-stone-100 border border-stone-200' : 'bg-slate-800 border border-slate-700'}`}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.maxGuests || 2}
                    onChange={(e) => handleChange('maxGuests', parseInt(e.target.value))}
                    className={`flex-1 ${data.theme === 'minimalist' ? 'accent-black' : data.theme === 'ethereal' ? 'accent-emerald-600' : 'accent-cyan-500'}`}
                  />
                  <span className={`text-xl font-bold w-12 text-center rounded p-2 ${s.input}`}>{data.maxGuests || 2}</span>
              </div>
            </div>
          </div>
        </div>

         {/* Section 3: Schedule Builder */}
         <div className={`${s.panel} p-6 rounded-2xl space-y-6 transition-all duration-300`}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className={`text-yellow-500`} /> Mission Timeline (Schedule)
          </h2>
          <div className="space-y-4">
            {data.schedule.map((item, index) => (
              <div key={index} className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-start p-4 rounded-xl ${s.scheduleItem}`}>
                <div className="md:col-span-2">
                  <label className={`${s.label} block mb-1 text-xs`}>Time</label>
                  <input
                    type="time"
                    value={item.time}
                    onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                    className={`w-full p-2 text-sm ${s.input}`}
                  />
                </div>
                <div className="md:col-span-4">
                  <label className={`${s.label} block mb-1 text-xs`}>Event</label>
                  <input
                    type="text"
                    value={item.event}
                    onChange={(e) => handleScheduleChange(index, 'event', e.target.value)}
                    placeholder="e.g. Ceremony"
                    className={`w-full p-2 text-sm ${s.input}`}
                  />
                </div>
                <div className="md:col-span-5">
                  <label className={`${s.label} block mb-1 text-xs`}>Description</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleScheduleChange(index, 'description', e.target.value)}
                    placeholder="e.g. Bring your dancing shoes"
                    className={`w-full p-2 text-sm ${s.input}`}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end pt-5">
                   <button 
                     onClick={() => removeScheduleItem(index)}
                     className="text-red-400 hover:text-red-500 transition-colors p-2"
                     title="Remove Item"
                   >
                     <Trash2 className="h-4 w-4" />
                   </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={addScheduleItem}
              className={`w-full py-3 border border-dashed rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium ${data.theme === 'minimalist' ? 'border-black text-black hover:bg-gray-50' : data.theme === 'ethereal' ? 'border-stone-300 text-stone-500 hover:bg-white hover:border-emerald-400 hover:text-emerald-600' : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800'}`}
            >
              <Plus className="h-4 w-4" /> Add Timeline Event
            </button>
          </div>
        </div>

        {/* Section 4: Story & AI */}
        <div className={`${s.panel} p-6 rounded-2xl space-y-6 transition-all duration-300`}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Wand2 className={`text-purple-500`} /> AI Story Generator
          </h2>
          <div>
            <label className={`${s.label} block mb-2`}>Key Story Points</label>
            <textarea
              value={data.storyPoints}
              onChange={(e) => handleChange('storyPoints', e.target.value)}
              className={`w-full p-3 h-24 ${s.input}`}
              placeholder="e.g. Met at a coffee shop in Tokyo 2024, bonded over sci-fi movies, proposed under the northern lights..."
            />
          </div>
          
          <button
            onClick={handleGenerateStory}
            disabled={isGenerating || !data.storyPoints}
            className={`flex items-center gap-2 px-6 py-2 font-medium transition-all disabled:opacity-50 ${data.theme === 'minimalist' ? 'bg-black text-white hover:bg-gray-800' : data.theme === 'ethereal' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg'}`}
          >
            {isGenerating ? <Sparkles className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {isGenerating ? 'Weaving Magic...' : 'Generate Narrative'}
          </button>

          <div>
            <label className={`${s.label} block mb-2`}>Generated Narrative</label>
            <textarea
              value={data.storyNarrative}
              onChange={(e) => handleChange('storyNarrative', e.target.value)}
              className={`w-full p-3 h-32 font-serif italic ${s.input}`}
            />
          </div>
        </div>

        {/* Section 5: Statistics */}
        <div className={`${s.panel} p-6 rounded-2xl space-y-6 transition-all duration-300`}>
          <h2 className="text-xl font-semibold">Relationship Stats (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
               <label className={`${s.label} block mb-2`}>Days Together</label>
               <input 
                 type="number" 
                 value={data.stats.daysTogether ?? ''} 
                 onChange={(e) => handleStatChange('daysTogether', e.target.value)} 
                 className={`w-full p-2 ${s.input}`}
                 placeholder="Leave empty to hide"
               />
             </div>
             <div>
               <label className={`${s.label} block mb-2`}>Miles Traveled</label>
               <input 
                 type="number" 
                 value={data.stats.milesTraveled ?? ''} 
                 onChange={(e) => handleStatChange('milesTraveled', e.target.value)} 
                 className={`w-full p-2 ${s.input}`}
                 placeholder="Leave empty to hide"
               />
             </div>
             <div>
               <label className={`${s.label} block mb-2`}>Coffees Shared</label>
               <input 
                 type="number" 
                 value={data.stats.coffeesShared ?? ''} 
                 onChange={(e) => handleStatChange('coffeesShared', e.target.value)} 
                 className={`w-full p-2 ${s.input}`}
                 placeholder="Leave empty to hide"
               />
             </div>
          </div>
        </div>

      </div>

      {/* Sticky Footer */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg border-t flex justify-end gap-4 z-50 ${data.theme === 'minimalist' ? 'bg-white/90 border-black' : data.theme === 'ethereal' ? 'bg-[#fafaf9]/90 border-stone-200' : 'bg-slate-900/90 border-slate-700'}`}>
        <button 
           onClick={onLaunch}
           className={`${s.buttonPrimary} font-bold px-8 py-3 transition-all flex items-center gap-2`}
        >
          <Save className="h-5 w-5" /> Launch Invitation <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Builder;