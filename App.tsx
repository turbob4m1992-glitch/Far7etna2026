import React, { useState } from 'react';
import Builder from './components/Builder.tsx';
import GuestView from './components/GuestView.tsx';
import { InvitationData, AppMode } from './types.ts';

const initialData: InvitationData = {
  partner1: "Alex",
  partner2: "Jordan",
  date: "2025-10-24",
  location: "Neo-Tokyo Skyline Gardens",
  venueName: "The Celestial Deck",
  storyPoints: "We met at a robotics hackathon. Our first date was watching a meteor shower.",
  storyNarrative: "In the neon glow of a digital frontier, Alex and Jordan's code intertwined. Sparks flew not from circuits, but from souls.",
  themeColor: "cyan",
  theme: 'cyberpunk',
  maxGuests: 2,
  stats: {
    daysTogether: 1240,
    milesTraveled: 45000,
    coffeesShared: 892,
  },
  schedule: [
    { time: "16:00", event: "Arrival & Cocktails", description: "Check in at the bio-scanner.", icon: "cocktail" },
    { time: "17:30", event: "Ceremony", description: "Exchange of quantum vows.", icon: "heart" },
    { time: "19:00", event: "Galactic Feast", description: "Fusion cuisine.", icon: "utensils" },
    { time: "21:00", event: "Dance Protocol", description: "Hit the floor.", icon: "music" },
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