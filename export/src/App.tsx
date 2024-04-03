import React from 'react'

import { useState } from 'react'
import './App.css'
import { JsonStringifyOutput } from '@obsidian-truth-or-dare/react/components/JsonStringifyOutput.js';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <JsonStringifyOutput javascriptObject={{'a': 1}}/>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
