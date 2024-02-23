import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, useEffect, useState } from "react"
import { Sparkles, useTexture } from "@react-three/drei"
import { button, useControls } from "leva"
import * as THREE from "three"

import useStore from "./stores/useStore"
import vertexShader from './shaders/sun/vertex.glsl'
import fragmentShader from './shaders/sun/fragment.glsl'
import atmosphereFragmentShader from './shaders/sun/atmosphereFragment.glsl'
import distortWaveVertexShader from './shaders/distortWave/vertex.glsl'
import distortWaveFragmentShader from './shaders/distortWave/fragment.glsl'

export const Sun = () => {
    const sun = useRef()
    const sparkles = useRef()
    const [hovered, setHovered] = useState(false)
    const bigBang = useStore((state) => state.bigBang)
    const startBigBang = useStore((state) => state.startBigBang)
    const explode = useStore((state) => state.explode)
    const isExploding = useStore((state) => state.isExploding)
    const noise = useTexture('/noise.png')
    const uniforms = useMemo(
        () => ({
            uTime: new THREE.Uniform(0),
            uScale: new THREE.Uniform(new THREE.Vector3(1, 1, 1)),
            uNoise: new THREE.Uniform(noise),
            uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
            uBigBang: new THREE.Uniform(bigBang ? 1.0 : 0.0),
        }),
        [bigBang]
    )

    const launchBigBang = () => {
        startBigBang()
        sun.current.material.uniforms.uBigBang.value = 1.0
    }

    useControls({
        startSupernova: button(() => launchBigBang(), { label: 'Launch Big Bang' })
    })

    useFrame((state) => {
        const clock = state.clock

        sun.current.material.uniforms.uTime.value = clock.getElapsedTime()
        sun.current.material.uniforms.uScale.value = sun.current.scale

        if(sun.current.scale.x < 0) {
            explode()
            if(sparkles.current) {
                sparkles.current.scale.x += (1 - sun.current.scale.x) * 0.015
                sparkles.current.scale.y += (1 - sun.current.scale.y) * 0.015
                sparkles.current.scale.z += (1 - sun.current.scale.z) * 0.015
                console.log(sparkles.current.scale);
            }
        }

        if(bigBang) {
            sun.current.scale.x -= 0.003
            sun.current.scale.y -= 0.003
            sun.current.scale.z -= 0.003
            return
        }

        sun.current.rotation.y += 0.0005
    })

    useEffect(() => {
        if(bigBang) {
            document.body.style.cursor = 'auto'
            return
        }

        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered, bigBang])

    return <>
        <Atmosphere x={0} z={0} size={4} />
        <DistortWave x={0} z={0} size={1} />
        <mesh ref={sun} onClick={launchBigBang} onPointerOver={() => setHovered(true) } onPointerOut={() => setHovered(false) }>
            <sphereGeometry args={[4, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
        {isExploding && <Sparkles ref={sparkles} color='#5ABBF1' count={300} size={6} speed={0.001} opacity={0.8} noise={0} /> }
    </>
}

export const Atmosphere = ({ x, z, size }) => {
    const atmosphere = useRef()
    const bigBang = useStore((state) => state.bigBang)
    const uniforms = useMemo(
        () => ({
            uAtmosphereColor: new THREE.Uniform(new THREE.Color('#F85E29')),
            uBigBang: new THREE.Uniform(bigBang ? 1.0 : 0.0),
            uScale: new THREE.Uniform(new THREE.Vector3(1, 1, 1)),
        }),
        []
    )

    useFrame(() => {
        atmosphere.current.material.uniforms.uScale.value = atmosphere.current.scale

        let atmosphereChanged = false
        if(atmosphere.current.scale.x < 0) {
            if (!atmosphereChanged) {
                atmosphereChanged = true
                atmosphere.current.material.uniforms.uAtmosphereColor.value = new THREE.Color('#5ABBF1')
            }
        }

        if(bigBang) {
            atmosphere.current.scale.x -= 0.0037
            atmosphere.current.scale.y -= 0.0037
            atmosphere.current.scale.z -= 0.0037
            return
        }
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
                depthWrite={false}
            />
        </mesh>
    )
}

export const DistortWave = ({ x, z, size }) => {
    const distortWave = useRef()
    const bigBang = useStore((state) => state.bigBang)
    const isExploding = useStore((state) => state.isExploding)
    const uniforms = useMemo(
        () => ({
            uTime: new THREE.Uniform(0),
            uBigBang: new THREE.Uniform(bigBang ? 1.0 : 0.0),
            uScale: new THREE.Uniform(new THREE.Vector3(1, 1, 1)),
            uShockwaveRadius: new THREE.Uniform(1.0),
            uShockwaveWidth: new THREE.Uniform(0.2),
        }),
        []
    )

    useFrame((state) => {
        const clock = state.clock

        if(distortWave.current) {
            distortWave.current.material.uniforms.uTime.value = clock.getElapsedTime()
            distortWave.current.material.uniforms.uScale.value = distortWave.current.scale

            if(isExploding) {
                distortWave.current.scale.x += 0.15
                distortWave.current.scale.y += 0.15
                distortWave.current.scale.z += 0.15
                return
            }
        }
    })

    return (
        isExploding && (
            <mesh ref={distortWave}>
                <sphereGeometry args={[size, 64, 64]} />
                <shaderMaterial
                    vertexShader={distortWaveVertexShader}
                    fragmentShader={distortWaveFragmentShader}
                    uniforms={uniforms}
                    side={THREE.BackSide}
                    transparent
                    depthWrite={false}
                />
            </mesh>
        )
    )
}


export default Sun
