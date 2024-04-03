import React, { useEffect, useState } from 'react'

import '../../styles.css'

import { PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { ReactBaseView } from '@obsidian-truth-or-dare/obsidian/ReactBaseView.js';
import { WebAppProvider } from './hooks.web.js';
import { MultiplayerActiveFile } from '@obsidian-truth-or-dare/react/components/MultiplayerActiveFile.js';
import { TextareaBackedActiveFile } from './TextareaBackedActiveFile.js';

function App() {

  const [activeTab, setActiveTab] = useState('multiplayer');

  useEffect(() => {
    return () => {
      console.log('App component unmounting');
    };
  }, []);

  return (
    <WebAppProvider>

      <div className="game-source">
        <button onClick={() => setActiveTab('textarea')}>Textarea</button>
        <button onClick={() => setActiveTab('multiplayer')}>Multiplayer</button>
        <br />
        <br />
        {activeTab === 'multiplayer' && <MultiplayerActiveFile />}
        {activeTab === 'textarea' && <TextareaBackedActiveFile />}
      </div>

      <div className="game-play">
        <ReactBaseView  GameView={PlayView} />
      </div>
    </WebAppProvider>
  )
}

export default App
