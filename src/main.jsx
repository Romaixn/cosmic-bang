import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Experience from './Experience'
import './index.css'

const debug = /[?&]debug=/.test(window.location.search)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Leva hidden={!debug} />
    <Canvas>
        <Experience />
    </Canvas>
  </React.StrictMode>,
)
