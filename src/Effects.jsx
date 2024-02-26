import { EffectComposer, Bloom, GodRays, LensFlare, Noise } from "@react-three/postprocessing"
import useStore from "./stores/useStore"
import { forwardRef } from "react"
import { useEffect } from "react"

export function Effects() {
    const sun = useStore((state) => state.sun)
    const isExplode = useStore((state) => state.isExploding)

    useEffect(() => {
        if(sun && sun.current) {
            sun.current.material.transparent = false
        }
    }, [sun, isExplode])

    return <>
        {sun && (
            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom luminanceThreshold={1.2} />
                {!isExplode && <GodRays sun={sun} decay={0.85} exposure={0.2} />}
            </EffectComposer>
        )}
    </>
}

const FakedSun = forwardRef(function FakedSun(props, forwardRef) {
    return <mesh ref={forwardRef} {...props}>
        <sphereGeometry args={[4.1, 64, 64]} />
        <meshBasicMaterial color="#FFA138" />
    </mesh>
})
