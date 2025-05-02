import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllPlantsFetch } from '@/api/supabaseFunctions';

// Define the Plant interface
export interface Plant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  price?: number;
  category_id?: number;
  stock_quantity?: number;
  care_level: string;
  light_requirements?: string;
  water_frequency?: string;
  pet_friendly?: boolean;
  added_at?: string; // When the user added this plant to their collection
  last_watered?: string; // Last time the plant was watered
  health_score?: number; // Health score from 0-100
  light_level?: string; // Current light level (Low, Medium, Sunny, Bright)
  humidity_level?: number; // Current humidity level percentage
}

// Define the UserPlantsContextType
interface UserPlantsContextType {
  plants: Plant[];
  addPlant: (plant: Plant) => void;
  removePlant: (plantId: string) => void;
  getAllPlants: () => Promise<Plant[]>;
  userHasPlant: (plantId: string) => boolean;
  updatePlantDetails: (plantId: string, details: Partial<Plant>) => void;
}

// Create the UserPlantsContext
const UserPlantsContext = createContext<UserPlantsContextType | undefined>(undefined);

// Create the UserPlantsProvider component
export const UserPlantsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);

  // Load plants from AsyncStorage on mount
  useEffect(() => {
    const loadPlants = async () => {
      try {
        const savedPlants = await AsyncStorage.getItem('user_plants');
        if (savedPlants) {
          setPlants(JSON.parse(savedPlants));
        }
      } catch (error) {
        console.error('Error loading plants from storage:', error);
      }
    };

    loadPlants();
    fetchAllAvailablePlants();
  }, []);

  // Fetch all available plants from the database
  const fetchAllAvailablePlants = async () => {
    try {
      const allPlants = await AllPlantsFetch();
      setAvailablePlants(allPlants || []);
    } catch (error) {
      console.error('Error fetching all plants:', error);
    }
  };

  // Save plants to AsyncStorage whenever it changes
  useEffect(() => {
    const savePlants = async () => {
      try {
        await AsyncStorage.setItem('user_plants', JSON.stringify(plants));
      } catch (error) {
        console.error('Error saving plants to storage:', error);
      }
    };

    savePlants();
  }, [plants]);

  // Add a plant to the user's collection
  const addPlant = (plant: Plant) => {
    setPlants((prevPlants) => {
      // Check if the plant is already in the collection
      const existingPlant = prevPlants.find((p) => p.id === plant.id);

      if (existingPlant) {
        // If the plant is already in the collection, don't add it again
        return prevPlants;
      } else {
        // If the plant is not in the collection, add it with current date
        const now = new Date().toISOString();
        return [...prevPlants, { 
          ...plant, 
          added_at: now,
          last_watered: now,
          health_score: 78 // Default health score
        }];
      }
    });
  };

  // Remove a plant from the user's collection
  const removePlant = (plantId: string) => {
    setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== plantId));
  };

  // Get all available plants
  const getAllPlants = async (): Promise<Plant[]> => {
    if (availablePlants.length === 0) {
      await fetchAllAvailablePlants();
    }
    return availablePlants;
  };

  // Check if user has a specific plant
  const userHasPlant = (plantId: string): boolean => {
    return plants.some(plant => plant.id === plantId);
  };

  // Update plant details
  const updatePlantDetails = (plantId: string, details: Partial<Plant>) => {
    setPlants(prevPlants => 
      prevPlants.map(plant => 
        plant.id === plantId 
          ? { ...plant, ...details } 
          : plant
      )
    );
  };

  return (
    <UserPlantsContext.Provider
      value={{
        plants,
        addPlant,
        removePlant,
        getAllPlants,
        userHasPlant,
        updatePlantDetails
      }}
    >
      {children}
    </UserPlantsContext.Provider>
  );
};

// Create a custom hook to use the user plants context
export const useUserPlants = () => {
  const context = useContext(UserPlantsContext);
  if (context === undefined) {
    throw new Error('useUserPlants must be used within a UserPlantsProvider');
  }
  return context;
};
