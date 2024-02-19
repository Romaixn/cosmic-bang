import { create } from 'zustand';

const useStore = create((set) => ({
    selectedPlanet: null,
    controlsEnabled: true,
    bigBang: false,
    startBigBang: () => set({ bigBang: true }),
    setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
    setControlsEnabled: (enabled) => set({ controlsEnabled: enabled }),
    onPlanetClick: (planet) => set({ selectedPlanet: planet, controlsEnabled: false }),
    onCanvasClick: () => set((state) => {
        if(state.selectedPlanet !== null) {
            return { selectedPlanet: null, controlsEnabled: true }
        }
    }),
}));

export default useStore;
