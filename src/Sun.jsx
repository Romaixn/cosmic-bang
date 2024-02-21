import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import vertexShader from './shaders/sun/vertex.glsl'
import fragmentShader from './shaders/sun/fragment.glsl'
import atmosphereFragmentShader from './shaders/sun/atmosphereFragment.glsl'
import { useTexture } from "@react-three/drei"
import useStore from "./stores/useStore"
import { useEffect } from "react"
import { useState } from "react"

export const Sun = () => {
    const sun = useRef()
    const [hovered, setHovered] = useState(false)
    const bigBang = useStore((state) => state.bigBang)
    const startBigBang = useStore((state) => state.startBigBang)
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

    useFrame((state) => {
        const clock = state.clock

        sun.current.material.uniforms.uTime.value = clock.getElapsedTime()
        sun.current.material.uniforms.uScale.value = sun.current.scale

        if(bigBang) {
            sun.current.scale.x -= 0.002
            sun.current.scale.y -= 0.002
            sun.current.scale.z -= 0.002
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
        <mesh ref={sun} onClick={launchBigBang} onPointerOver={() => setHovered(true) } onPointerOut={() => setHovered(false) }>
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
    const bigBang = useStore((state) => state.bigBang)
    const uniforms = useMemo(
        () => ({
            uAtmosphereColor: new THREE.Uniform(new THREE.Color('#F85E29')),
            uBigBang: new THREE.Uniform(bigBang ? 1.0 : 0.0),
        }),
        []
    )

    useFrame(() => {
        if(bigBang) {
            atmosphere.current.scale.x -= 0.001
            atmosphere.current.scale.y -= 0.001
            atmosphere.current.scale.z -= 0.001
            return
        }

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
