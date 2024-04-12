import React, { useEffect } from 'react'

import '../../styles.css'

import { PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { ReactBaseView } from '@obsidian-truth-or-dare/obsidian/ReactBaseView.js';
import { InMemoryTemplateProvider } from '../../src/InMemoryTemplateContext.js';
import { MultiplayerActiveFile } from '@obsidian-truth-or-dare/react/components/MultiplayerActiveFile.js';
import { TextareaBackedActiveFile } from './TextareaBackedActiveFile.js';
import { MultiplayerProvider } from '@obsidian-truth-or-dare/react/components/MultiplayerProvider.js';
import { WindowLocationHashManager } from '@obsidian-truth-or-dare/react/components/WindowLocationHashManager.js';
import { DispatchGameEventContext, publishEventToMultiplayer } from '@obsidian-truth-or-dare/react/dispatchEvent.js';

function App() {

  useEffect(() => {
    return () => {
      console.log('App component unmounting');
    };
  }, []);

  return (
    <InMemoryTemplateProvider>
      <MultiplayerProvider>
        <DispatchGameEventContext.Provider value={publishEventToMultiplayer}>
          <WindowLocationHashManager />
          <div className="grid_parent">

            <div className="grid_web_sidebar">
              <TextareaBackedActiveFile />
              <MultiplayerActiveFile />
            </div>

            <ReactBaseView GameView={PlayView} />
          </div>
        </DispatchGameEventContext.Provider>
      </MultiplayerProvider>
    </InMemoryTemplateProvider>
  )
}

export default App
