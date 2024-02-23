import { EffectComposer, Bloom } from "@react-three/postprocessing"

export function Effects() {
    return <EffectComposer disableNormalPass multisampling={4}>
        <Bloom luminanceThreshold={1.2} />
    </EffectComposer>
}
