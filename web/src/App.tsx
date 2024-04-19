import React, { useEffect, useState } from 'react'

import '../../styles.css'

import { PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { ReactBaseView } from '@obsidian-truth-or-dare/obsidian/ReactBaseView.js';
import { InMemoryTemplateProvider } from '../../src/InMemoryTemplateContext.js';
import { MultiplayerActiveFile } from '@obsidian-truth-or-dare/react/components/MultiplayerActiveFile.js';
import { TextareaBackedActiveFile } from './TextareaBackedActiveFile.js';
import { MultiplayerProvider } from '@obsidian-truth-or-dare/react/components/MultiplayerProvider.js';
import { WindowLocationHashManager } from '@obsidian-truth-or-dare/react/components/WindowLocationHashManager.js';
import { DispatchGameEventContext, publishEventToMultiplayer } from '@obsidian-truth-or-dare/react/dispatchEvent.js';
import { Button } from '@tremor/react';

function App() {
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    return () => {
      console.log('App component unmounting');
    };
  }, []);

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  };

  const gridClasses = `grid grid-rows-[10%,60%,30%] duration-1000 grid-flow-col h-screen w-screen ${
    menuVisible ? 'grid-cols-[30%,0%,80%]' : 'grid-cols-[0%,30%,70%]'
  }`;

  return (
    <InMemoryTemplateProvider>
      <MultiplayerProvider>
        <DispatchGameEventContext.Provider value={publishEventToMultiplayer}>
          <WindowLocationHashManager />

          <Button className='absolute top-4 left-4' onClick={toggleMenu}>
            {menuVisible ? 'hide menu' : 'show menu'}
          </Button>

          <div className={gridClasses}>

            <div className="row-start-1 col-start-1 row-end-4 col-end-1 overflow-hidden mt-16 ml-4">
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
