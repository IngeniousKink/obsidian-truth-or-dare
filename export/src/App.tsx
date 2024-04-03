import React from 'react'

import '../../styles.css'

import { PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { ReactBaseView } from '@obsidian-truth-or-dare/obsidian/ReactBaseView.js';
import { WebAppProvider } from './hooks.web.js';
import { TextareaBackedActiveFile } from './TextareaBackedActiveFile.js';

function App() {

  return (
    <>
      <WebAppProvider>
        <ReactBaseView GameView={PlayView} />
        <TextareaBackedActiveFile />
      </WebAppProvider>
    </>
  )
}

export default App
