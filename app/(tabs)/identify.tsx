import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraCapturedPicture,
} from 'expo-camera'
import React, { useState, useRef, useCallback } from 'react'
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert
} from 'react-native'
import { icons } from '@/constants/cameraIcon'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { useImage } from '../../store/hooks'
import { identifyPlant, assessPlantHealth } from '../../api/plantIdentificationAPI'

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000',
  },
  centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      padding: 20,
  },
  loadingText: {
      color: '#fff',
      marginTop: 10,
      fontSize: 16,
  },
  message: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
  },
  permissionButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 3,
  },
  permissionButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
  },
  camera: {
      flex: 1,
  },
  overlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-end',
  },
  controlsContainer: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 120 : 140,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 20,
  },
  controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
  captureButtonDisabled: {
      opacity: 0.7,
  },
  previewContainer: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
  },
  previewImageContainer: {
      width: '80%',
      aspectRatio: 1,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 20,
  },
  previewImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f0f0f0',
  },
  previewButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginTop: 20,
  },
  previewButton: {
      flex: 0.48,
      paddingVertical: 12,
      borderRadius: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      justifyContent: 'center',
      alignItems: 'center',
  },
  retakeButton: {
      backgroundColor: '#ef4444',
  },
  saveButton: {
      backgroundColor: '#22c55e',
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
  },
  spacer: {
      width: 50,
  },
  // Frame overlay styles
  frameContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingBottom: 120,
  },
  frameBorder: {
      width: '78%',
      aspectRatio: 1,
      position: 'relative',
  },
  cornerTopLeft: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 40,
      height: 40,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderColor: '#FFDE59',
      borderTopLeftRadius: 12,
  },
  cornerTopRight: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 40,
      height: 40,
      borderTopWidth: 4,
      borderRightWidth: 4,
      borderColor: '#FFDE59',
      borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 40,
      height: 40,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderColor: '#FFDE59',
      borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 40,
      height: 40,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: '#FFDE59',
      borderBottomRightRadius: 12,
  },
})

export default function CameraComponent() {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permissionCamera, requestCameraPermission] = useCameraPermissions()
  const [picture, setPicture] = useState<CameraCapturedPicture | undefined>()
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { height, width } = useWindowDimensions()
  const camera = useRef<CameraView | null>(null)
  const { updateNewPlantImage, updatePlantHealthCheckImage } = useImage()

  const params = useLocalSearchParams()
  const previousScreen = params.from // Add the "from" parameter when navigating to identify

  const handleTakePicture = useCallback(async () => {
      if (!camera.current || isCapturing) return

      setIsCapturing(true)
      try {
          const photo = await camera.current.takePictureAsync({
              quality: 1,
              base64: true,
              exif: false,
          })

          if (!photo?.uri) {
              throw new Error('Failed to capture image: URI is undefined')
          }

          setPicture(photo)
      } catch (error) {
          console.error('Error taking picture:', error)
      } finally {
          setIsCapturing(false)
      }
  }, [isCapturing])

  const handleToggleCameraFacing = useCallback(() => {
      setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }, [])

  const handleSavePicture = useCallback(async () => {
    if (!picture?.uri || !picture.base64) {
      Alert.alert('Error', 'No picture data available');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const pictureURI = picture.uri;
      const imageBase64 = `data:image/jpeg;base64,${picture.base64}`;
      
      // Get the mode parameter (default to 'identify')
      const mode = params.mode as 'identify' | 'health' || 'identify';
      
      // Store image based on the source screen
      if (previousScreen === 'addPlant') {
        updateNewPlantImage(pictureURI);
      } else {
        updatePlantHealthCheckImage(pictureURI);
      }
      
      // Process based on mode
      if (mode === 'health') {
        // Health check mode
        const healthData = await assessPlantHealth(imageBase64);
        
        // Navigate to health results screen with data
        router.push({
          pathname: '/(screens)/health-results',
          params: { healthData: JSON.stringify(healthData) }
        });
      } else {
        // Default: Plant Identification mode
        const plants = await identifyPlant(imageBase64);
        
        // Navigate to identification results screen with data
        router.push({
          pathname: '/(screens)/identification-results',
          params: { plants: JSON.stringify(plants) }
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert(
        'Processing Error',
        'There was an error processing your image. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [picture, params, previousScreen, updateNewPlantImage, updatePlantHealthCheckImage]);

  const handleRetake = useCallback(() => {
      setPicture(undefined)
  }, [])

  if (!permissionCamera) {
      return (
          <View style={styles.centered}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Initializing camera...</Text>
          </View>
      )
  }

  if (!permissionCamera.granted) {
      return (
          <View style={styles.centered}>
              <Text style={styles.message}>
                  Camera access is required to take photos
              </Text>
              <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={requestCameraPermission}
              >
                  <Text style={styles.permissionButtonText}>
                      Grant Camera Permission
                  </Text>
              </TouchableOpacity>
          </View>
      )
  }

  if (picture) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <View style={styles.previewImageContainer}>
            <Image
              source={{ uri: picture.uri }}
              style={styles.previewImage}
              contentFit="cover"
              transition={200}
            />
          </View>
          <View className='items-center justify-center gap-4'>
            {isProcessing ? (
              <View className='w-[80vw] h-32 justify-center items-center'>
                <ActivityIndicator size="large" color="#fff" />
                <Text className='text-white font-pmedium text-center text-lg mt-4'>
                  {params.mode === 'health' ? 'Analyzing plant health...' : 'Identifying plant...'}
                </Text>
              </View>
            ) : (
              <>
                <TouchableOpacity 
                  onPress={handleSavePicture} 
                  disabled={isProcessing}
                  className='w-[80vw] h-16 justify-center items-center border rounded-lg bg-accent-dark'
                >
                  <Text className='text-black font-pmedium text-center text-lg'>
                    {params.mode === 'health' ? 'Check Health' : 'Identify Plant'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRetake} disabled={isProcessing}>
                  <View className='w-[78vw] h-16'>
                    <Text className='text-center text-white font-pmedium text-lg'>Tap to retake</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
      <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <CameraView
              style={[styles.camera, { height, width }]}
              facing={facing}
              ref={camera}
          >
              <View style={styles.overlay}>
                  {/* Frame overlay with corner brackets */}
                  <View style={styles.frameContainer}>
                      <View style={styles.frameBorder}>
                          <View style={styles.cornerTopLeft} />
                          <View style={styles.cornerTopRight} />
                          <View style={styles.cornerBottomLeft} />
                          <View style={styles.cornerBottomRight} />
                      </View>
                  </View>
                  
                  <View style={styles.controlsContainer}>
                      <TouchableOpacity
                          style={styles.controlButton}
                          onPress={handleToggleCameraFacing}
                          disabled={isCapturing}
                      >
                          {icons['flipCamera']()}
                      </TouchableOpacity>

                      <TouchableOpacity
                          style={[
                              styles.captureButton,
                              isCapturing && styles.captureButtonDisabled,
                          ]}
                          onPress={handleTakePicture}
                          disabled={isCapturing}
                      >
                          {isCapturing ? (
                              <ActivityIndicator color="#000" />
                          ) : (
                              icons['takePhoto']()
                          )}
                      </TouchableOpacity>
                      
                      {/* Empty view for balanced layout */}
                      <View style={styles.spacer} />
                  </View>
              </View>
          </CameraView>
      </SafeAreaView>
  )
}