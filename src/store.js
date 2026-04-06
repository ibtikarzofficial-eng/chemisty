import { create } from 'zustand';

// THE EXPERIMENT ENGINE CONFIGURATION
export const EXPERIMENTS = {
    neutralization: {
        id: 'neutralization',
        name: 'Acid/Base Neutralization',
        beakerLabel: '0.1M NaOH (Sodium Hydroxide)',
        correctFlaskId: 'hcl',
        availableFlasks: [
            { id: 'h2o', label: 'Distilled Water', color: '#ffffff', reason: 'Adding water simply dilutes the base. No chemical reaction occurs.' },
            { id: 'hcl', label: '0.1M HCl (Acid)', color: '#00ffff', reason: 'The acid (HCl) neutralizes the base (NaOH) to produce salt (NaCl) and water.' },
            { id: 'nacl', label: 'NaCl Solution', color: '#ffffff', reason: 'NaCl is a neutral salt and does not react with a strong base like NaOH.' }
        ],
        reqTemp: { min: 20, max: 30 }, // Room temperature
        equation: 'HCl + NaOH → NaCl + H₂O',
        successMsg: 'Neutralization Complete!',
        errorMsgTemp: 'Reaction failed! Temperature must be at room level (20-30°C).',
        errorMsgChem: 'Reaction failed! Wrong chemical added.',
        color: '#00ffff'
    },
    precipitation: {
        id: 'precipitation',
        name: 'Silver Chloride Precipitation',
        beakerLabel: 'NaCl (Sodium Chloride)',
        correctFlaskId: 'agno3',
        availableFlasks: [
            { id: 'cu', label: 'Copper(II) Sulfate', color: '#3b82f6', reason: 'CuSO4 does not form an insoluble precipitate when mixed with NaCl.' },
            { id: 'kno3', label: 'Potassium Nitrate', color: '#ffffff', reason: 'Alkali metal salts and nitrates are soluble, so no precipitate forms.' },
            { id: 'agno3', label: 'AgNO₃ (Silver Nitrate)', color: '#ffffff', reason: 'Silver ions combine with chloride ions to form an insoluble white precipitate of Silver Chloride (AgCl).' }
        ],
        reqTemp: { min: 70, max: 100 }, // Requires the hot plate!
        equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
        successMsg: 'Precipitation Complete! White solid formed.',
        errorMsgTemp: 'Reaction failed! Solution must be heated (70°C+) to react properly.',
        errorMsgChem: 'Reaction failed! Wrong chemical added.',
        color: '#f8fafc' // White precipitate
    },
    exothermic: {
        id: 'exothermic',
        name: 'Elephant Toothpaste',
        beakerLabel: 'H₂O₂ + Dish Soap',
        correctFlaskId: 'ki',
        availableFlasks: [
            { id: 'nacl', label: 'Sodium Chloride', color: '#ffffff', reason: 'NaCl is not an effective catalyst for the rapid decomposition of hydrogen peroxide.' },
            { id: 'ki', label: 'KI (Potassium Iodide)', color: '#fef08a', reason: 'The iodide ion acts as a catalyst, rapidly decomposing hydrogen peroxide into water and oxygen gas, creating a massive foam eruption!' },
            { id: 'water', label: 'H₂O', color: '#ffffff', reason: 'Adding water only dilutes the hydrogen peroxide solution without causing decomposition.' }
        ],
        reqTemp: { min: 20, max: 40 }, // Normal
        equation: '2 H₂O₂ → 2 H₂O + O₂ (Catalyzed by KI)',
        successMsg: 'Reaction Complete! Massive Foam!',
        errorMsgTemp: 'Reaction failed! Temperature out of bounds.',
        errorMsgChem: 'Reaction failed! Catalyst is required.',
        color: '#fbbf24' // Yellowish foam
    },
    indicator: {
        id: 'indicator',
        name: 'Color Change Indicator',
        beakerLabel: 'NaOH + Phenolphthalein',
        correctFlaskId: 'acid',
        availableFlasks: [
            { id: 'base', label: 'Ammonia', color: '#ffffff', reason: 'Adding more base will keep the phenolphthalein indicator completely pink.' },
            { id: 'water', label: 'Distilled Water', color: '#ffffff', reason: 'Water dilutes the solution but does not lower the pH enough to turn the indicator clear.' },
            { id: 'acid', label: 'HCl (Hydrochloric Acid)', color: '#ffffff', reason: 'The acid neutralizes the base, dropping the pH and causing the phenolphthalein to turn from pink to colorless.' }
        ],
        reqTemp: { min: 20, max: 40 }, 
        equation: 'Clear in Acid, Pink in Base',
        successMsg: 'Color Change Complete! Turned Clear.',
        errorMsgTemp: 'Reaction failed! Unstable temperature.',
        errorMsgChem: 'Reaction failed! Wrong chemical added.',
        color: '#ffffff' // Turns clear
    }
};

export const useLabStore = create((set, get) => ({
    currentExp: EXPERIMENTS.neutralization,
    isMixed: false,
    isPouring: null, // Stores ID of the flask being poured if any
    temperature: 25, // Default room temp
    reactionState: 'idle', // 'idle', 'success', 'failed_temp', 'failed_chem'
    resetKey: 0,
    pouredFlaskId: null,

    // Feature 4: Swapping Modules
    setExperiment: (expId) => set({
        currentExp: EXPERIMENTS[expId],
        isMixed: false,
        isPouring: null,
        temperature: 25,
        reactionState: 'idle',
        pouredFlaskId: null,
        resetKey: get().resetKey + 1
    }),

    // Feature 3: Environmental Variables
    setTemperature: (temp) => set({ temperature: temp }),
    triggerPour: (flaskId) => set({ isPouring: flaskId }),

    // The Logic Gate
    triggerReaction: (flaskId) => {
        const { currentExp, temperature } = get();
        // Check if the current dial temperature is within the required bounds
        const isTempValid = temperature >= currentExp.reqTemp.min && temperature <= currentExp.reqTemp.max;
        const isChemValid = flaskId === currentExp.correctFlaskId;

        let newState = 'success';
        if (!isChemValid) newState = 'failed_chem';
        else if (!isTempValid) newState = 'failed_temp';

        set({
            isMixed: true,
            isPouring: null,
            reactionState: newState,
            pouredFlaskId: flaskId
        });
    },

    resetLab: () => set((state) => ({
        isMixed: false,
        isPouring: null,
        temperature: 25,
        reactionState: 'idle',
        pouredFlaskId: null,
        resetKey: state.resetKey + 1
    }))
}));