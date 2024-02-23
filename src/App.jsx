import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Experience from './Experience'
import { Suspense } from 'react'
import { Loader } from '@react-three/drei'
import useStore from './stores/useStore'

export const App = () => {
    const { onCanvasClick } = useStore()

    return (
        <>
        <Leva />
        <Canvas camera={{ position: [-15, 15, 15] }}>
            <Suspense fallback={null}>
                <Experience />
            </Suspense>
        </Canvas>
        <Loader />
        </>
    );
}

export default App
