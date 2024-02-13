import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Experience from './Experience'
import './index.css'
import { Suspense } from 'react'
import { Loader } from '@react-three/drei'

const debug = /[?&]debug=/.test(window.location.search)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Leva hidden={!debug} />
    <Canvas camera={{ position: [-15, 15, 15] }}>
        <Suspense fallback={null}>
            <Experience />
        </Suspense>
    </Canvas>
    <Loader />
  </React.StrictMode>,
)
