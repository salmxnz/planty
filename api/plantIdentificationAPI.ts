import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

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
    
    console.log('Base64 size:', base64Data.length);

    // The Kindwise (Plant.id) API expects certain parameters
    const requestData = {
      images: [`data:image/jpeg;base64,${base64Data}`], // Include the prefix in the format they expect
      // Include only valid parameters according to error messages
     
      // Remove plant_language and plant_details for now to test basic functionality
    };
    
    // Log the request body structure for debugging
    console.log('Request structure:', JSON.stringify(requestData).substring(0, 100) + '...');
    
    const response = await axios.post(
      'https://plant.id/api/v3/identification',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': KINDWISE_IDENTIFY_KEY,
        }
      }
    );
    
    console.log('Kindwise response status:', response.status);
    if (
  !response.data ||
  !response.data.result ||
  !response.data.result.classification ||
  !Array.isArray(response.data.result.classification.suggestions)
) {
  console.log('Unexpected API response format:', JSON.stringify(response.data, null, 2));
  throw new Error('Invalid response format from Kindwise API');
}

const results = response.data.result.classification.suggestions.map((item: any) => ({
  scientificName: item.name || 'Unknown',
  commonName: item.name || 'Unknown', // Kindwise doesn't provide common name separately in this response
  probability: item.probability || 0,
  family: 'Unknown', // No family info in this structure
  imageUrl: response.data.input?.images?.[0] || undefined
}));
    
    
    return results;
  } catch (error: unknown) {
    console.error('Kindwise identification error:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw new Error(`Failed to identify plant with Kindwise: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Function to identify plants with PlantNet (backup)
export const identifyPlantWithPlantNet = async (imageBase64: string): Promise<IdentifiedPlant[]> => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    // Create a simplified FormData object
    const formData = new FormData();
    
    // Create a file object for React Native
    const fileUri = Platform.OS === 'ios' 
      ? imageBase64  // iOS can sometimes handle the full data URI
      : `data:image/jpeg;base64,${base64Data}`;
      
    // Create a simple file object
    const file = {
      uri: fileUri,
      name: 'plant.jpg',
      type: 'image/jpeg',
    };
    
    // Add file to FormData
    // @ts-ignore
    formData.append('images', file);
    
    // Add other required parameters
    formData.append('organs', 'auto');
    
    console.log('Sending request to PlantNet...');
    
    // Make the request with query parameters for the API key
    const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANT_NET_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // Let fetch set the correct Content-Type with boundary
      },
    });
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PlantNet API error:', response.status, errorText);
      throw new Error(`PlantNet API error: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    console.log('PlantNet response:', JSON.stringify(data).substring(0, 200));
    
    // Check if we have valid results
    if (!data || !data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from PlantNet');
    }
    
    // Process the results
    const results = data.results.map((item: any) => {
      const species = item?.species || {};
      const imageUrl = item?.images?.[0]?.url?.o;
    
      return {
        scientificName: species.scientificNameWithoutAuthor || 'Unknown',
        commonName: species.commonNames?.[0] || species.scientificNameWithoutAuthor || 'Unknown',
        probability: item?.score || 0,
        family: species.family?.scientificNameWithoutAuthor || 'Unknown',
        imageUrl: imageUrl || undefined
      };
    });
    
    return results;
  } catch (error: any) {
    console.error('PlantNet identification error:', error);
    if (error.response) {
      console.error('Error response:', JSON.stringify(error.response));
    }
    throw new Error(`Failed to identify plant with PlantNet: ${error.message}`);
  }
};

// Function to check plant health with Kindwise
export const checkPlantHealthWithKindwise = async (imageBase64: string): Promise<PlantHealthReport> => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    const requestData = {
      images: [`data:image/jpeg;base64,${base64Data}`]
    };

    const response = await axios.post(
      'https://crop.kindwise.com/api/v1',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': KINDWISE_HEALTH_KEY
        }
      }
    );

    console.log('Kindwise health response:', JSON.stringify(response.data, null, 2));

    const healthData = response.data.result?.disease?.suggestions || [];

    const report: PlantHealthReport = {
      isHealthy: healthData.length === 0,
      overallHealth: 1 - (healthData[0]?.probability ?? 0), // assume highest probability reflects severity
      issues: healthData.map((issue: any) => ({
        name: issue.name,
        probability: issue.probability,
        description: issue.details?.description || '',
        solutions: issue.details?.treatment || [],
        severity: issue.probability > 0.7 ? 'high' : issue.probability > 0.4 ? 'medium' : 'low'
      }))
    };

    return report;
  } catch (error) {
    console.error('Kindwise health check error:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response data:', error.response.data);
    }
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