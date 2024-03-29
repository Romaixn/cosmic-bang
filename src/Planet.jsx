import { useMemo, useRef, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three'

import vertexShader from './shaders/planet/vertex.glsl'
import fragmentShader from './shaders/planet/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'
import useStore from './stores/useStore'

const Planet = ({
    id = 0,
    xRadius = 6,
    zRadius = 6,
    size = 1,
    speed = 0.1,
    offset = 0,
    rotationSpeed = 0.1,
    texture = '/planets/habitable/Tropical.png',
    color = '#00aaff',
    onClick,
}) => {
    const planetTexture = useLoader(TextureLoader, texture)
    planetTexture.colorSpace = THREE.SRGBColorSpace
    planetTexture.anisotropy = 8

    const planet = useRef()
    const sunScale = useStore((state) => state.sunScale)

    const [isDestroyed, setIsDestroyed] = useState(false)
    const [x, setX] = useState(xRadius)
    const [z, setZ] = useState(zRadius)

    const isExploding = useStore((state) => state.isExploding)

    const uniforms = useMemo(
        () => ({
            uPlanetTexture: new THREE.Uniform(planetTexture),
            uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
            uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(color)),
            uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color('#ff6600')),
            uExploding: new THREE.Uniform(isExploding),
            uTimeAfterExplode: new THREE.Uniform(0),
        }),
        []
    )

    let timeAfterExplode = 0
    useFrame((state) => {
        const { clock } = state

        if(planet.current) {
            const t = clock.getElapsedTime() * speed + offset
            setX(xRadius * Math.cos(t))
            setZ(zRadius * Math.sin(t))
            planet.current.position.x = x
            planet.current.position.z = z

            planet.current.rotation.y = clock.getElapsedTime() * rotationSpeed

            // Sun direction
            const sunDirection = new THREE.Vector3(-x, 0, -z).normalize()
            planet.current.material.uniforms.uSunDirection.value = sunDirection

            if(isExploding) {
                timeAfterExplode += 1
                planet.current.material.uniforms.uExploding.value = 1.0
                planet.current.material.uniforms.uTimeAfterExplode.value = timeAfterExplode
            }

            if(sunScale <= -3 - id * 1.25) {
                setIsDestroyed(true)
            }
        }
    })

    if(!isDestroyed) {
        return <>
            <Atmosphere x={x} z={z} size={size} dayColor={color} twilightColor='#ff6600' />
            <mesh ref={planet} onClick={() => onClick(planet.current) }>
                <sphereGeometry args={[size, 64, 64]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                />
            </mesh>
            <Ecliptic xRadius={xRadius} zRadius={zRadius} />
        </>
    }
}

export const Atmosphere = ({ x, z, size, dayColor, twilightColor }) => {
    const atmosphere = useRef()
    const uniforms = useMemo(
        () => ({
            uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
            uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(dayColor)),
            uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(twilightColor))
        }),
        []
    )

    useFrame(() => {
        atmosphere.current.position.x = x
        atmosphere.current.position.z = z

        // Sun direction
        const sunDirection = new THREE.Vector3(-x, 0, -z).normalize()
        atmosphere.current.material.uniforms.uSunDirection.value = sunDirection
    })

    return (
        <mesh ref={atmosphere} scale={[1.04, 1.04, 1.04]} >
            <sphereGeometry args={[size, 64, 64]} />
            <shaderMaterial
                vertexShader={atmosphereVertexShader}
                fragmentShader={atmosphereFragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide}
                transparent
            />
        </mesh>
    )
}

export const Ecliptic = ({ xRadius = 1, zRadius = 1 }) => {
    const points = useMemo(() => {
        const points = [];
        for (let index = 0; index < 64; index++) {
            const angle = (index / 64) * 2 * Math.PI;
            const x = xRadius * Math.cos(angle);
            const z = zRadius * Math.sin(angle);
            points.push(new THREE.Vector3(x, 0, z));
        }

        points.push(points[0]);
        return points
    }, [xRadius, zRadius]);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color="#393e46" linewidth={2} />
      </line>
    );
  }

export default Planet
