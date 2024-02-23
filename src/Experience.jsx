import { CameraShake, OrbitControls, Stars } from "@react-three/drei"
import Planet from "./Planet"
import { useMemo } from "react"
import Sun from "./Sun"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import useStore from "./stores/useStore"
import { useControls } from "leva"
import { useRef } from "react"

const Experience = () => {
    const { totalPlanets } = useControls({
        totalPlanets: {
            value: 6,
            min: 1,
            max: 20,
            step: 1
        }
    })
    const planets = useMemo(() => {
        const random = (a, b) => a + Math.random() * b;
        const shuffle = (a) => {
          const temp = a.slice(0);
          for (let i = temp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [temp[i], temp[j]] = [temp[j], temp[i]];
          }
          return temp;
        };

        const textures = shuffle([
            // Habitable
            { texture: '/planets/habitable/Alpine.png', color: '#334635' },
            { texture: '/planets/habitable/Savannah.png', color: '#A8B624' },
            { texture: '/planets/habitable/Swamp.png', color: '#232B06' },
            { texture: '/planets/habitable/Tropical.png', color: '#017DA9' },
            // Gas
            { texture: '/planets/gaseous/Gaseous1.jpg', color: '#655A46' },
            { texture: '/planets/gaseous/Gaseous2.jpg', color: '#AA777D' },
            { texture: '/planets/gaseous/Gaseous3.jpg', color: '#9CBF89' },
            { texture: '/planets/gaseous/Gaseous4.jpg', color: '#D1466D' },
            // Inhospitable
            { texture: '/planets/inhospitable/Icy.png', color: '#AAC3CD' },
            { texture: '/planets/inhospitable/Martian.png', color: '#784233' },
            { texture: '/planets/inhospitable/Venusian.png', color: '#73370B' },
            { texture: '/planets/inhospitable/Volcanic.png', color: '#B6412D' },
            // Terrestrial
            { texture: '/planets/terrestrial/Terrestrial1.png', color: '#00AAFF' },
            { texture: '/planets/terrestrial/Terrestrial2.png', color: '#00AAFF' },
            { texture: '/planets/terrestrial/Terrestrial3.png', color: '#00AAFF' },
            { texture: '/planets/terrestrial/Terrestrial4.png', color: '#00AAFF' },
        ]);

        const planets = [];
        for (let index = 0; index < totalPlanets; index++) {
          planets.push({
            id: index,
            xRadius: (index + 2) * 5,
            zRadius: (index + 2) * 5,
            size: random(0.5, 2),
            speed: random(0.05, 0.1),
            offset: random(0, Math.PI * 2),
            rotationSpeed: random(0.005, 0.02),
            texture: textures[index].texture,
            color: textures[index].color,
          });
        }

        return planets
    }, [totalPlanets])

    const { onPlanetClick, selectedPlanet, controlsEnabled } = useStore()
    const isExploding = useStore((state) => state.isExploding)
    const { orbitControls } = useRef()

    const { camera } = useThree()

    useFrame(() =>  {
        if (selectedPlanet) {
            const zoomDistance = 4

            const direction = selectedPlanet.position.clone().sub(new THREE.Vector3(0, 0, 0)).normalize();
            const zoomPosition = selectedPlanet.position.clone().add(direction.multiplyScalar(-zoomDistance));

            camera.position.lerp(zoomPosition, 0.1);

            camera.lookAt(selectedPlanet.position);
        }
    })

    return <>
        <Sun />
        {planets.map((planet) => (
            <Planet key={planet.id} {...planet} />
        ))}
        <Stars />

        <OrbitControls ref={orbitControls} maxDistance={totalPlanets * 10} enabled={controlsEnabled} makeDefault />
        {isExploding &&
            <CameraShake
                maxYaw={0.002}
                maxPitch={0.002}
                maxRoll={0.002}
                yawFrequency={5}
                pitchFrequency={5}
                controls={orbitControls}
            />
        }
    </>
}

export default Experience
