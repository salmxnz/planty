import React from 'react'
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function HealthCheckResultScreen() {
  const { result, image, species } = useLocalSearchParams()
  const healthResult = result ? JSON.parse(result as string) : null

  if (!healthResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No result data provided.</Text>
      </View>
    )
  }

  const suggestions = healthResult.disease?.suggestions || []
  const isHealthy = healthResult.is_healthy

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image && (
        <Image source={{ uri: image as string }} style={styles.image} resizeMode="cover" />
      )}

      {species && (
        <Text style={styles.speciesText}>Identified Species: {species}</Text>
      )}

      <Text style={styles.title}>Plant Health Check Results</Text>

      <Text style={styles.cardText}>
        Is Plant Healthy: {isHealthy?.binary ? 'Yes' : 'No'} ({(isHealthy?.probability * 100).toFixed(2)}%)
      </Text>

      {suggestions.length > 0 ? (
        suggestions.map((s: any, index: number) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{s.name}</Text>
            <Text style={styles.cardText}>
              Probability: {(s.probability * 100).toFixed(2)}%
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.cardText}>No diseases detected!</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  speciesText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e7d32',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
})
