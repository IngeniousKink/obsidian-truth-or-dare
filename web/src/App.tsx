import React, { useEffect, useState } from 'react'

import '../../styles.css'

import { PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { ReactBaseView } from '@obsidian-truth-or-dare/obsidian/ReactBaseView.js';
import { WebAppProvider } from './hooks.web.js';
import { MultiplayerActiveFile } from '@obsidian-truth-or-dare/react/components/MultiplayerActiveFile.js';
import { TextareaBackedActiveFile } from './TextareaBackedActiveFile.js';
import { MultiplayerProvider } from '@obsidian-truth-or-dare/react/components/useMultiplayer.js';

function App() {

  useEffect(() => {
    return () => {
      console.log('App component unmounting');
    };
  }, []);

  return (
    <WebAppProvider>
      <MultiplayerProvider>
        <div className="game-source">
          <TextareaBackedActiveFile />
          <MultiplayerActiveFile />
        </div>

        <div className="game-play">
          <ReactBaseView GameView={PlayView} />
        </div>
      </MultiplayerProvider>
    </WebAppProvider>
  )
}

export default App
