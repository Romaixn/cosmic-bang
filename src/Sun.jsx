import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

import vertexShader from './shaders/sun/vertex.glsl'
import fragmentShader from './shaders/sun/fragment.glsl'
import atmosphereFragmentShader from './shaders/sun/atmosphereFragment.glsl'
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
        <Atmosphere x={0} z={0} size={4} />
        <mesh ref={sun}>
            <sphereGeometry args={[4, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    </>
}

export const Atmosphere = ({ x, z, size }) => {
    const atmosphere = useRef()
    const uniforms = useMemo(
        () => ({
            uAtmosphereColor: new THREE.Uniform(new THREE.Color('#F85E29')),
        }),
        []
    )

    useFrame(() => {
        atmosphere.current.position.x = x
        atmosphere.current.position.z = z
    })

    return (
        <mesh ref={atmosphere} scale={[1.2, 1.2, 1.2]} >
            <sphereGeometry args={[size, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={atmosphereFragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide}
                transparent
            />
        </mesh>
    )
}


export default Sun
