import { post } from './apiFunctions';

export interface IdentifiedPlant {
  scientificName: string;
  commonName: string;
  family: string;
  probability: number;
  similar?: {
    scientificName: string;
    commonName: string;
    probability: number;
  }[];
}

export interface PlantHealthReport {
  isHealthy: boolean;
  issues: {
    name: string;
    probability: number;
    description?: string;
  }[];
  recommendations: string[];
}

// KindWise plant identification
export const identifyPlantWithKindWise = async (
  imageBase64: string
): Promise<IdentifiedPlant[]> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_KINDWISEID_API_KEY;
    if (!apiKey) {
      throw new Error('KINDWISEID_API_KEY not provided in environment variables');
    }

    const response = await post<any>(
      'https://api.kindwise.com/api/v1/identify',
      {
        images: [imageBase64],
      },
      {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      }
    );

    if (response.status !== 200 || !response.data.result) {
      throw new Error(`Failed to identify plant: ${response.message || 'Unknown error'}`);
    }

    return response.data.result.classification.map((item: any) => ({
      scientificName: item.scientificName,
      commonName: item.name,
      family: item.family || 'Unknown',
      probability: item.probability,
    }));
  } catch (error) {
    console.error('Plant identification error:', error);
    throw error;
  }
};

// PlantNet plant identification (as a backup option)
export const identifyPlantWithPlantNet = async (
  imageBase64: string
): Promise<IdentifiedPlant[]> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_PLANTNET_API_KEY;
    if (!apiKey) {
      throw new Error('PLANTNET_API_KEY not provided in environment variables');
    }

    const response = await post<any>(
      'https://my-api.plantnet.org/v2/identify/all',
      {
        images: [imageBase64],
        organs: ['leaf', 'flower', 'fruit', 'bark'],
      },
      {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      }
    );

    if (response.status !== 200 || !response.data.results) {
      throw new Error(`Failed to identify plant: ${response.message || 'Unknown error'}`);
    }

    return response.data.results.map((item: any) => ({
      scientificName: item.species.scientificNameWithoutAuthor,
      commonName: item.species.commonNames?.[0] || 'Unknown',
      family: item.species.family.scientificNameWithoutAuthor,
      probability: item.score,
    }));
  } catch (error) {
    console.error('Plant identification error:', error);
    throw error;
  }
};

// Plant health assessment with KindWise
export const assessPlantHealthWithKindWise = async (
  imageBase64: string
): Promise<PlantHealthReport> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_KINDWISE_API_KEY;
    if (!apiKey) {
      throw new Error('KINDWISE_API_KEY not provided in environment variables');
    }

    const response = await post<any>(
      'https://api.kindwise.com/api/v1/health',
      {
        images: [imageBase64],
      },
      {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      }
    );

    if (response.status !== 200 || !response.data) {
      throw new Error(`Failed to assess plant health: ${response.message || 'Unknown error'}`);
    }

    const healthData = response.data;
    
    return {
      isHealthy: healthData.isHealthy || false,
      issues: (healthData.diseases || []).map((disease: any) => ({
        name: disease.name,
        probability: disease.probability,
        description: disease.description,
      })),
      recommendations: healthData.recommendations || [
        'Ensure proper watering',
        'Check for adequate sunlight',
        'Inspect for pests regularly'
      ],
    };
  } catch (error) {
    console.error('Plant health assessment error:', error);
    throw error;
  }
};