import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { usePlantIdentification } from '@/store/identificationHooks';
import { useImage } from '@/store/hooks';

export default function IdentificationResultsScreen() {
  const {
    identifiedPlants,
    selectedPlantIndex,
    setSelectedPlantIndex,
    isIdentifying,
    identificationError,
  } = usePlantIdentification();
  const { plantHealthCheckImage } = useImage();

  const selectedPlant = identifiedPlants[selectedPlantIndex];

  const handleBackPress = () => {
    router.back();
  };

  const handleLearnMore = (index: number) => {
    setSelectedPlantIndex(index);
    router.push({
        pathname: '/plant-details' as any,
        params: {
          scientificName: identifiedPlants[index].scientificName
        }
      });
  };

  if (isIdentifying) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Identifying plant...</Text>
      </SafeAreaView>
    );
  }

  if (identificationError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Identification Failed</Text>
        <Text style={styles.errorMessage}>{identificationError}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBackPress}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!identifiedPlants.length) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>No Plants Identified</Text>
        <Text style={styles.errorMessage}>We couldn't identify any plants in the image. Please try taking another photo.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBackPress}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Plant Identification</Text>
      </View>

      {plantHealthCheckImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: plantHealthCheckImage }}
            style={styles.plantImage}
            contentFit="cover"
          />
        </View>
      )}

      <Text style={styles.resultsTitle}>
        {identifiedPlants.length === 1
          ? 'We identified your plant!'
          : `Top ${identifiedPlants.length} matches`}
      </Text>

      <ScrollView style={styles.resultsContainer}>
        {identifiedPlants.map((plant, index) => (
          <TouchableOpacity
            key={`${plant.scientificName}-${index}`}
            style={[
              styles.resultItem,
              selectedPlantIndex === index && styles.selectedItem,
            ]}
            onPress={() => setSelectedPlantIndex(index)}
          >
            <View style={styles.resultContent}>
              <View style={styles.resultTextContainer}>
                <Text style={styles.plantName}>{plant.commonName}</Text>
                <Text style={styles.scientificName}>{plant.scientificName}</Text>
                <Text style={styles.family}>Family: {plant.family}</Text>
                <Text style={styles.probability}>
                  Match confidence: {Math.round(plant.probability * 100)}%
                </Text>
              </View>

              <TouchableOpacity
                style={styles.learnMoreButton}
                onPress={() => handleLearnMore(index)}
              >
                <Text style={styles.learnMoreButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#e5e7eb',
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    color: '#111',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  selectedItem: {
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  resultContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTextContainer: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 6,
  },
  family: {
    fontSize: 14,
    color: '#4b5563',
  },
  probability: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
    marginTop: 4,
  },
  learnMoreButton: {
    backgroundColor: '#e9effc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  learnMoreButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ef4444',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#4b5563',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});