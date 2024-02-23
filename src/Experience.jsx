import { OrbitControls, Stars } from "@react-three/drei"
import Planet from "./Planet"
import { useMemo } from "react"
import Sun from "./Sun"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import useStore from "./stores/useStore"

const Experience = () => {
    const totalPlanets = 6
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
            '/planets/habitable/Alpine.png',
            '/planets/habitable/Savannah.png',
            '/planets/habitable/Swamp.png',
            '/planets/habitable/Tropical.png',
            // Gas
            '/planets/gaseous/Gaseous1.jpg',
            '/planets/gaseous/Gaseous2.jpg',
            '/planets/gaseous/Gaseous3.jpg',
            '/planets/gaseous/Gaseous4.jpg',
            // Inhospitable
            '/planets/inhospitable/Icy.png',
            '/planets/inhospitable/Martian.png',
            '/planets/inhospitable/Venusian.png',
            '/planets/inhospitable/Volcanic.png',
            // Terrestrial
            '/planets/terrestrial/Terrestrial1.png',
            '/planets/terrestrial/Terrestrial2.png',
            '/planets/terrestrial/Terrestrial3.png',
            '/planets/terrestrial/Terrestrial4.png',
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
            texture: textures[index],
          });
        }

        return planets
    }, [])

    const { onPlanetClick, selectedPlanet, controlsEnabled } = useStore()

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

        <OrbitControls maxDistance={totalPlanets * 10} enabled={controlsEnabled} />
    </>
}

export default Experience
