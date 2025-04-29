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

export default function HealthResultsScreen() {
  const {
    healthReport,
    isAssessingHealth,
    healthError,
  } = usePlantIdentification();
  const { plantHealthCheckImage } = useImage();

  const handleBackPress = () => {
    router.back();
  };

  if (isAssessingHealth) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Analyzing plant health...</Text>
      </SafeAreaView>
    );
  }

  if (healthError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Health Assessment Failed</Text>
        <Text style={styles.errorMessage}>{healthError}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBackPress}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!healthReport) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>No Health Data</Text>
        <Text style={styles.errorMessage}>We couldn't assess the health of the plant in the image. Please try taking another photo.</Text>
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
        <Text style={styles.title}>Plant Health Assessment</Text>
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

      <View style={[
        styles.healthStatusContainer,
        healthReport.isHealthy ? styles.healthyContainer : styles.unhealthyContainer
      ]}>
        <Text style={styles.healthStatusText}>
          {healthReport.isHealthy ? '✓ Plant appears healthy' : '⚠ Health issues detected'}
        </Text>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {healthReport.issues.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Detected Issues</Text>
            {healthReport.issues.map((issue, index) => (
              <View key={`issue-${index}`} style={styles.issueContainer}>
                <View style={styles.issueHeader}>
                  <Text style={styles.issueName}>{issue.name}</Text>
                  <Text style={styles.issueProbability}>
                    {Math.round(issue.probability * 100)}%
                  </Text>
                </View>
                {issue.description && (
                  <Text style={styles.issueDescription}>{issue.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {healthReport.recommendations.map((recommendation, index) => (
            <View key={`recommendation-${index}`} style={styles.recommendationItem}>
              <Text style={styles.recommendationBullet}>•</Text>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
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
  healthStatusContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  healthyContainer: {
    backgroundColor: '#dcfce7',
  },
  unhealthyContainer: {
    backgroundColor: '#fee2e2',
  },
  healthStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  issueContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  issueProbability: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  issueDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  recommendationsContainer: {
    marginTop: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#22c55e',
    marginRight: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
    lineHeight: 20,
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