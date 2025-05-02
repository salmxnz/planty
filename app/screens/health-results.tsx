import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { PlantHealthReport, PlantHealthIssue } from '../../api/plantIdentificationAPI';
import { useImage } from '../../store/hooks';

export default function HealthResults() {
  const params = useLocalSearchParams();
  const { plantHealthCheckImage } = useImage();
  const [healthReport, setHealthReport] = useState<PlantHealthReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (params.healthData) {
        const parsedData = JSON.parse(params.healthData as string) as PlantHealthReport;
        setHealthReport(parsedData);
      }
    } catch (error) {
      console.error('Error parsing health data:', error);
    } finally {
      setLoading(false);
    }
  }, [params.healthData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading health report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!healthReport) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Health Report Unavailable</Text>
          <Text style={styles.errorMessage}>
            We couldn't generate a health report for this plant. Please try again with a clearer image.
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

  // Helper function to get color based on health status
  const getHealthColor = (isHealthy: boolean) => {
    return isHealthy ? '#22c55e' : '#ef4444';
  };

  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#f9a825';
      case 'medium': return '#fb8c00';
      case 'high': return '#d32f2f';
      default: return '#757575';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Plant Health Report</Text>
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
          styles.overallHealthContainer, 
          { backgroundColor: getHealthColor(healthReport.isHealthy) + '20' }
        ]}>
          <Text style={[styles.healthStatusText, { color: getHealthColor(healthReport.isHealthy) }]}>
            {healthReport.isHealthy ? 'Healthy Plant' : 'Health Issues Detected'}
          </Text>
          <View style={styles.healthMeterContainer}>
            <View style={styles.healthMeterBackground}>
              <View 
                style={[
                  styles.healthMeterFill, 
                  { 
                    width: `${Math.max(5, healthReport.overallHealth * 100)}%`,
                    backgroundColor: getHealthColor(healthReport.isHealthy)
                  }
                ]} 
              />
            </View>
            <Text style={styles.healthPercentText}>
              {Math.round(healthReport.overallHealth * 100)}% health
            </Text>
          </View>
        </View>

        {healthReport.issues && healthReport.issues.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Detected Issues</Text>
            {healthReport.issues.map((issue: PlantHealthIssue, index: number) => (
              <View key={index} style={styles.issueCard}>
                <View style={styles.issueHeader}>
                  <Text style={styles.issueName}>{issue.name}</Text>
                  <View style={[
                    styles.severityBadge, 
                    { backgroundColor: getSeverityColor(issue.severity) }
                  ]}>
                    <Text style={styles.severityText}>
                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.probabilityText}>
                  Confidence: {Math.round(issue.probability * 100)}%
                </Text>
                
                {issue.description && (
                  <Text style={styles.issueDescription}>{issue.description}</Text>
                )}
                
                {issue.solutions && issue.solutions.length > 0 && (
                  <View style={styles.solutionsContainer}>
                    <Text style={styles.solutionsTitle}>Solutions:</Text>
                    {issue.solutions.map((solution, solutionIndex) => (
                      <View key={solutionIndex} style={styles.solutionItem}>
                        <Text style={styles.solutionBullet}>•</Text>
                        <Text style={styles.solutionText}>{solution}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.noIssuesContainer}>
            <Text style={styles.noIssuesText}>
              No health issues detected! Your plant appears to be in good condition.
            </Text>
            <Text style={styles.noIssuesTips}>
              Continue with proper care: appropriate watering, adequate light, and regular maintenance.
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Camera</Text>
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
  overallHealthContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  healthStatusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  healthMeterContainer: {
    marginTop: 8,
  },
  healthMeterBackground: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  healthMeterFill: {
    height: '100%',
    borderRadius: 5,
  },
  healthPercentText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  issueCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  probabilityText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  issueDescription: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 22,
  },
  solutionsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  solutionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  solutionItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  solutionBullet: {
    fontSize: 16,
    color: '#4b5563',
    marginRight: 8,
  },
  solutionText: {
    fontSize: 15,
    color: '#4b5563',
    flex: 1,
    lineHeight: 22,
  },
  noIssuesContainer: {
    backgroundColor: '#22c55e20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  noIssuesText: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noIssuesTips: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});