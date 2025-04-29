import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import {
  startIdentification,
  setIdentifiedPlants,
  setIdentificationError,
  selectPlant,
  startHealthAssessment,
  setHealthReport,
  setHealthError,
  resetIdentification,
  resetHealth,
} from './identificationSlice';
import {
  identifyPlantWithKindWise,
  identifyPlantWithPlantNet,
  assessPlantHealthWithKindWise,
} from '../api/plantIdentification';

export const usePlantIdentification = () => {
  const dispatch = useAppDispatch();
  const {
    identifiedPlants,
    selectedPlantIndex,
    isIdentifying,
    identificationError,
    healthReport,
    isAssessingHealth,
    healthError,
  } = useAppSelector((state) => state.identification);

  const selectedPlant = identifiedPlants[selectedPlantIndex];

  const identifyPlant = useCallback(async (imageBase64: string, useBackupApi: boolean = false) => {
    try {
      dispatch(startIdentification());
      
      let plants;
      if (!useBackupApi) {
        // Try KindWise first
        plants = await identifyPlantWithKindWise(imageBase64);
      } else {
        // Use PlantNet as backup
        plants = await identifyPlantWithPlantNet(imageBase64);
      }
      
      if (plants && plants.length > 0) {
        dispatch(setIdentifiedPlants(plants));
        return plants;
      } else {
        throw new Error('No plants identified in the image');
      }
    } catch (error) {
      if (!useBackupApi) {
        // If primary API fails, try the backup
        return identifyPlant(imageBase64, true);
      }
      const message = error instanceof Error ? error.message : 'Failed to identify plant';
      dispatch(setIdentificationError(message));
      throw error;
    }
  }, [dispatch]);

  const assessPlantHealth = useCallback(async (imageBase64: string) => {
    try {
      dispatch(startHealthAssessment());
      const report = await assessPlantHealthWithKindWise(imageBase64);
      dispatch(setHealthReport(report));
      return report;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to assess plant health';
      dispatch(setHealthError(message));
      throw error;
    }
  }, [dispatch]);

  const setSelectedPlantIndex = useCallback((index: number) => {
    dispatch(selectPlant(index));
  }, [dispatch]);

  const clearIdentification = useCallback(() => {
    dispatch(resetIdentification());
  }, [dispatch]);

  const clearHealthReport = useCallback(() => {
    dispatch(resetHealth());
  }, [dispatch]);

  return {
    identifiedPlants,
    selectedPlant,
    selectedPlantIndex,
    isIdentifying,
    identificationError,
    healthReport,
    isAssessingHealth,
    healthError,
    identifyPlant,
    assessPlantHealth,
    setSelectedPlantIndex,
    clearIdentification,
    clearHealthReport,
  };
};