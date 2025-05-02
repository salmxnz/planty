import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { IdentifiedPlant } from '../../api/plantIdentificationAPI';
import { useImage } from '../../store/hooks';

export default function IdentificationResults() {
  const params = useLocalSearchParams();
  const { plantHealthCheckImage } = useImage();
  const [plants, setPlants] = useState<IdentifiedPlant[]>([]);
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (params.plants) {
        const parsedData = JSON.parse(params.plants as string) as IdentifiedPlant[];
        setPlants(parsedData);
      }
    } catch (error) {
      console.error('Error parsing plant data:', error);
    } finally {
      setLoading(false);
    }
  }, [params.plants]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading identification results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plants || plants.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Identification Failed</Text>
          <Text style={styles.errorMessage}>
            We couldn't identify this plant. Please try again with a clearer image of the plant's leaves, flowers, or overall structure.
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const selectedPlant = plants[selectedPlantIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Plant Identification Results</Text>
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

        {/* Top matches section */}
        <View style={styles.matchesContainer}>
          <Text style={styles.sectionTitle}>Possible Matches</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.matchesScrollContent}
          >
            {plants.map((plant, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.matchCard,
                  selectedPlantIndex === index && styles.selectedMatchCard
                ]}
                onPress={() => setSelectedPlantIndex(index)}
              >
                <Text style={[
                  styles.matchProbability,
                  selectedPlantIndex === index && styles.selectedMatchText
                ]}>
                  {Math.round(plant.probability * 100)}%
                </Text>
                <Text style={[
                  styles.matchName,
                  selectedPlantIndex === index && styles.selectedMatchText
                ]} numberOfLines={2}>
                  {plant.commonName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selected plant details */}
        <View style={styles.plantDetailsCard}>
          <Text style={styles.plantCommonName}>{selectedPlant.commonName}</Text>
          <Text style={styles.plantScientificName}>{selectedPlant.scientificName}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Family</Text>
              <Text style={styles.detailValue}>{selectedPlant.family}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Match Confidence</Text>
              <View style={styles.confidenceMeterContainer}>
                <View style={styles.confidenceMeterBackground}>
                  <View 
                    style={[
                      styles.confidenceMeterFill, 
                      { width: `${Math.max(5, selectedPlant.probability * 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.confidenceText}>
                  {Math.round(selectedPlant.probability * 100)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Plant care tips - these would be dynamic in a full implementation */}
          <View style={styles.careTipsContainer}>
            <Text style={styles.careTipsTitle}>General Care Tips</Text>
            <View style={styles.careTipItem}>
              <Text style={styles.careTipIcon}>💧</Text>
              <Text style={styles.careTipText}>Water when the top inch of soil feels dry</Text>
            </View>
            <View style={styles.careTipItem}>
              <Text style={styles.careTipIcon}>☀️</Text>
              <Text style={styles.careTipText}>Place in bright, indirect light</Text>
            </View>
            <View style={styles.careTipItem}>
              <Text style={styles.careTipIcon}>🌡️</Text>
              <Text style={styles.careTipText}>Keep in temperatures between 65-80°F (18-27°C)</Text>
            </View>
            <View style={styles.careTipItem}>
              <Text style={styles.careTipIcon}>🌱</Text>
              <Text style={styles.careTipText}>Fertilize monthly during growing season</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
       
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              // Navigate to health check with the current image
              router.push({
                pathname: '/identify',
                params: { mode: 'health' }
              });
            }}
          >
            <Text style={styles.secondaryButtonText}>Check Plant Health</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Camera</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#4b5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  matchesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  matchesScrollContent: {
    paddingRight: 16,
  },
  matchCard: {
    width: 100,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMatchCard: {
    backgroundColor: '#2563eb',
  },
  matchProbability: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
  },
  selectedMatchText: {
    color: 'white',
  },
  plantDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  plantCommonName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  plantScientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
  },
  confidenceMeterContainer: {
    marginTop: 4,
  },
  confidenceMeterBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceMeterFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  confidenceText: {
    marginTop: 4,
    fontSize: 14,
    color: '#4b5563',
  },
  careTipsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  careTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  careTipItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  careTipIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  careTipText: {
    fontSize: 15,
    color: '#4b5563',
    flex: 1,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});