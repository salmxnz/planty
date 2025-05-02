import axios from 'axios';
import Constants from 'expo-constants';

// Get API keys from environment variables
const KINDWISE_IDENTIFY_KEY = Constants.expoConfig?.extra?.kindwiseIdentifyKey;
const KINDWISE_HEALTH_KEY = Constants.expoConfig?.extra?.kindwiseHealthKey;
const PLANT_NET_API_KEY = Constants.expoConfig?.extra?.plantNetApiKey;

// Types for API responses
export interface IdentifiedPlant {
  scientificName: string;
  commonName: string;
  probability: number;
  family: string;
  imageUrl?: string;
}

export interface PlantHealthIssue {
  name: string;
  probability: number;
  description: string;
  solutions: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface PlantHealthReport {
  isHealthy: boolean;
  issues: PlantHealthIssue[];
  overallHealth: number;
}

// Function to identify plants with Kindwise
export const identifyPlantWithKindwise = async (imageBase64: string): Promise<IdentifiedPlant[]> => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
      const response = await axios.post(
        'https://plant.id/api/v3/identification',
        {
          images: [base64Data],
          organs: ['leaf'], // You can change this to 'flower', 'fruit', etc. as needed
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': 'GQlGnZygKZXUpABE8KAONurqwTK0gCF3dXvr279XqX75qJ9RBa',
          }
        }
      );
      
      
    
    // Transform Kindwise response to our app's format
    const results = response.data.result.classification.map((item: any) => ({
      scientificName: item.scientific_name,
      commonName: item.common_names[0] || item.scientific_name,
      probability: item.probability,
      family: item.taxonomy?.family || 'Unknown',
      imageUrl: item.image_url || undefined
    }));
    
    return results;
  } catch (error) {
    console.error('Kindwise identification error:', error);
    throw new Error('Failed to identify plant with Kindwise');
  }
};

// Function to identify plants with PlantNet (backup)
export const identifyPlantWithPlantNet = async (imageBase64: string): Promise<IdentifiedPlant[]> => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    // Create FormData for PlantNet API
    const formData = new FormData();
    formData.append('organs', 'auto');
    
    // Create a blob and append it to formData
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    const file = new File([blob], 'plant.jpg', { type: 'image/jpeg' });
    // @ts-ignore
    formData.append('images', file);
    
    const plantNetResponse = await axios.post(
      'https://my-api.plantnet.org/v2/identify/all?api-key=${PLANT_NET_API_KEY}',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    // Transform PlantNet response to our app's format
    const results = plantNetResponse.data.results.map((item: any) => ({
      scientificName: item.species.scientificNameWithoutAuthor,
      commonName: (item.species.commonNames && item.species.commonNames.length > 0) 
        ? item.species.commonNames[0] 
        : item.species.scientificNameWithoutAuthor,
      probability: item.score,
      family: item.species.family.scientificNameWithoutAuthor || 'Unknown',
      imageUrl: item.images[0]?.url.o || undefined
    }));
    
    return results;
  } catch (error) {
    console.error('PlantNet identification error:', error);
    throw new Error('Failed to identify plant with PlantNet');
  }
};

// Function to check plant health with Kindwise
export const checkPlantHealthWithKindwise = async (imageBase64: string): Promise<PlantHealthReport> => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    const response = await axios.post(
      'https://crop.kindwise.com/api/v1',
      { image: base64Data },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KINDWISE_HEALTH_KEY}`
        }
      }
    );
    
    // Transform Kindwise health response to our app's format
    const healthData = response.data.result.health_assessment;
    const report: PlantHealthReport = {
      isHealthy: healthData.is_healthy,
      overallHealth: healthData.overall_health || 0,
      issues: healthData.problems.map((problem: any) => ({
        name: problem.name,
        probability: problem.probability,
        description: problem.description || '',
        solutions: problem.solutions || [],
        severity: problem.severity || 'medium'
      }))
    };
    
    return report;
  } catch (error) {
    console.error('Kindwise health check error:', error);
    throw new Error('Failed to assess plant health');
  }
};

// Main function to identify a plant (with fallback)
export const identifyPlant = async (imageBase64: string): Promise<IdentifiedPlant[]> => {
  try {
    // Try Kindwise first
    const plants = await identifyPlantWithKindwise(imageBase64);
    return plants;
  } catch (error) {
    console.log('Kindwise failed, trying PlantNet as backup...');
    try {
      // Fallback to PlantNet
      const plants = await identifyPlantWithPlantNet(imageBase64);
      return plants;
    } catch (backupError) {
      throw new Error('Failed to identify plant with both services');
    }
  }
};

// Function to assess plant health
export const assessPlantHealth = async (imageBase64: string): Promise<PlantHealthReport> => {
  const report = await checkPlantHealthWithKindwise(imageBase64);
  return report;
};