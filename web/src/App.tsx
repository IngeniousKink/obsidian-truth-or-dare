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
import AnimatedContent from '@obsidian-truth-or-dare/react/components/AnimatedContent.js';

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

  const gridClasses = `grid grid-rows-[10%,60%,30%] duration-1000 grid-flow-col h-screen w-screen grid-cols-[0%,25%,75%]`;

  return (
    <InMemoryTemplateProvider>
      <MultiplayerProvider>
        <DispatchGameEventContext.Provider value={publishEventToMultiplayer}>
          <WindowLocationHashManager />

          <div className={gridClasses}>
            <div className="row-start-1 col-start-1 row-end-1 col-end-1">
              <Button className='absolute top-4 left-4' onClick={toggleMenu}>
                {menuVisible ? 'hide menu' : 'show menu'}
              </Button>
            </div>

            <div className="absolute w-1/4 top-20 bg-blue-200">
              <AnimatedContent direction="left" showFirstChild={!!menuVisible}>
                <div>
                  <h2 className='text-2xl'>Settings</h2>
                  <br/>
                  <TextareaBackedActiveFile />
                  <MultiplayerActiveFile />
                </div>
                <span />
              </AnimatedContent>
            </div>
            <ReactBaseView GameView={PlayView} />
          </div>

        </DispatchGameEventContext.Provider>
      </MultiplayerProvider>
    </InMemoryTemplateProvider>
  )
}


export default App
