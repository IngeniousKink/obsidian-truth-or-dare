import React, { useEffect } from 'react'

import '../../styles.css'

import { PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { ReactBaseView } from '@obsidian-truth-or-dare/obsidian/ReactBaseView.js';
import { WebAppProvider } from './hooks.web.js';
import { MultiplayerActiveFile } from '@obsidian-truth-or-dare/react/components/MultiplayerActiveFile.js';
import { TextareaBackedActiveFile } from './TextareaBackedActiveFile.js';

function App() {

  useEffect(() => {
    return () => {
      console.log('App component unmounting');
    };
  }, []);

  return (
    <WebAppProvider>
      <ReactBaseView GameView={PlayView} />
      <MultiplayerActiveFile />
      <TextareaBackedActiveFile />
    </WebAppProvider>
  )
}

export default App
