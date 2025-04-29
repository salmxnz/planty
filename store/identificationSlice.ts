import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IdentifiedPlant, PlantHealthReport } from '../api/plantIdentification';

export interface IdentificationState {
  identifiedPlants: IdentifiedPlant[];
  selectedPlantIndex: number;
  isIdentifying: boolean;
  identificationError: string | null;
  healthReport: PlantHealthReport | null;
  isAssessingHealth: boolean;
  healthError: string | null;
}

const initialState: IdentificationState = {
  identifiedPlants: [],
  selectedPlantIndex: 0,
  isIdentifying: false,
  identificationError: null,
  healthReport: null,
  isAssessingHealth: false,
  healthError: null,
};

export const identificationSlice = createSlice({
  name: 'identification',
  initialState,
  reducers: {
    startIdentification: (state) => {
      state.isIdentifying = true;
      state.identificationError = null;
    },
    setIdentifiedPlants: (state, action: PayloadAction<IdentifiedPlant[]>) => {
      state.identifiedPlants = action.payload;
      state.isIdentifying = false;
    },
    setIdentificationError: (state, action: PayloadAction<string>) => {
      state.identificationError = action.payload;
      state.isIdentifying = false;
    },
    selectPlant: (state, action: PayloadAction<number>) => {
      state.selectedPlantIndex = action.payload;
    },
    startHealthAssessment: (state) => {
      state.isAssessingHealth = true;
      state.healthError = null;
    },
    setHealthReport: (state, action: PayloadAction<PlantHealthReport>) => {
      state.healthReport = action.payload;
      state.isAssessingHealth = false;
    },
    setHealthError: (state, action: PayloadAction<string>) => {
      state.healthError = action.payload;
      state.isAssessingHealth = false;
    },
    resetIdentification: (state) => {
      state.identifiedPlants = [];
      state.selectedPlantIndex = 0;
      state.identificationError = null;
    },
    resetHealth: (state) => {
      state.healthReport = null;
      state.healthError = null;
    }
  },
});

export const {
  startIdentification,
  setIdentifiedPlants,
  setIdentificationError,
  selectPlant,
  startHealthAssessment,
  setHealthReport,
  setHealthError,
  resetIdentification,
  resetHealth,
} = identificationSlice.actions;

export default identificationSlice.reducer;