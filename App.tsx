import React, { useState } from 'react';
import Builder from './components/Builder.tsx';
import GuestView from './components/GuestView.tsx';
import { InvitationData, AppMode } from './types.ts';

const initialData: InvitationData = {
  partner1: "Omar",
  partner2: "Laila",
  date: "2026-06-15",
  location: "Cairo Opera House - Grand Ballroom",
  venueName: "The Royal Pavilion",
  storyPoints: "We met under the stars of the Nile. Our first journey was a desert sunrise.",
  storyNarrative: "Across dunes of time and rivers of fate, Omar and Laila's paths merged into a single horizon. A love that echoes in the sands of eternity.",
  themeColor: "cyan",
  theme: 'cyberpunk',
  maxGuests: 2,
  stats: {
    daysTogether: 1500,
    milesTraveled: 12000,
    coffeesShared: 2400,
  },
  schedule: [
    { time: "18:00", event: "Welcome Reception", description: "Arrival of guests at the main gate.", icon: "cocktail" },
    { time: "19:30", event: "Zaffa & Ceremony", description: "Traditional entrance and vows.", icon: "heart" },
    { time: "21:00", event: "Gala Dinner", description: "Royal banquet served.", icon: "utensils" },
    { time: "23:00", event: "Celestial Celebration", description: "Dancing under the moonlight.", icon: "music" },
  ]
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('BUILDER');
  const [data, setData] = useState<InvitationData>(initialData);

  return (
    <div className="antialiased">
      {mode === 'BUILDER' ? (
        <Builder 
          data={data} 
          onUpdate={setData} 
          onLaunch={() => setMode('PREVIEW')} 
        />
      ) : (
        <GuestView 
          data={data} 
          onEdit={() => setMode('BUILDER')}
        />
      )}
    </div>
  );
};

export default App;