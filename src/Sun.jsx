import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import vertexShader from './shaders/sun/vertex.glsl'
import fragmentShader from './shaders/sun/fragment.glsl'
import { useTexture } from "@react-three/drei"

export const Sun = () => {
    const sun = useRef()
    const noise = useTexture('/noise.png')
    const uniforms = useMemo(
        () => ({
            uTime: new THREE.Uniform(0),
            uNoise: new THREE.Uniform(noise),
            uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight))
        }),
        []
    )

    useFrame((state) => {
        const clock = state.clock

        sun.current.rotation.y += 0.0005
        sun.current.material.uniforms.uTime.value = clock.getElapsedTime()
    })

    return <>
        <mesh ref={sun}>
            <sphereGeometry args={[2, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    </>
}

export default Sun
