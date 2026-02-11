import React, { useState } from 'react';
import Builder from './components/Builder';
import GuestView from './components/GuestView';
import { InvitationData, AppMode } from './types';

// Default initial state
const initialData: InvitationData = {
  partner1: "Alex",
  partner2: "Jordan",
  date: "2025-10-24",
  location: "Neo-Tokyo Skyline Gardens",
  venueName: "The Celestial Deck",
  storyPoints: "We met at a robotics hackathon. Our first date was watching a meteor shower. We love synthwave music and spicy noodles.",
  storyNarrative: "In the neon glow of a digital frontier, Alex and Jordan's code intertwined. Sparks flew not from circuits, but from souls, igniting a supernova of affection beneath a meteor-streaked sky.",
  themeColor: "cyan",
  theme: 'cyberpunk',
  maxGuests: 2,
  stats: {
    daysTogether: 1240,
    milesTraveled: 45000,
    coffeesShared: 892,
  },
  schedule: [
    { time: "16:00", event: "Arrival & Cocktails", description: "Check in at the bio-scanner and enjoy a neutron star martini.", icon: "cocktail" },
    { time: "17:30", event: "Ceremony", description: "Exchange of quantum vows under the holographic arch.", icon: "heart" },
    { time: "19:00", event: "Galactic Feast", description: "Fusion cuisine from across the galaxy.", icon: "utensils" },
    { time: "21:00", event: "Dance Protocol Initiated", description: "Activate gravity boots and hit the floor.", icon: "music" },
  ]
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.BUILDER);
  const [data, setData] = useState<InvitationData>(initialData);

  const toggleMode = () => {
    setMode(prev => prev === AppMode.BUILDER ? AppMode.PREVIEW : AppMode.BUILDER);
  };

  return (
    <div className="antialiased">
      {mode === AppMode.BUILDER ? (
        <Builder 
          data={data} 
          onUpdate={setData} 
          onLaunch={() => setMode(AppMode.PREVIEW)} 
        />
      ) : (
        <GuestView 
          data={data} 
          onEdit={() => setMode(AppMode.BUILDER)}
        />
      )}
    </div>
  );
};

export default App;