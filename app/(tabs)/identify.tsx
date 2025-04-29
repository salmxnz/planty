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
    Alert,
} from 'react-native'
import { icons } from '@/constants/cameraIcon'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { useImage } from '@/store/hooks'

// This is a temporary mock implementation
export const usePlantIdentification = () => {
  return {
    identifyPlant: async (imageBase64: string) => {},
    assessPlantHealth: async (imageBase64: string) => {},
  };
};

export default function CameraComponent() {
    const [facing, setFacing] = useState<CameraType>('back')
    const [permissionCamera, requestCameraPermission] = useCameraPermissions()
    const [picture, setPicture] = useState<CameraCapturedPicture | undefined>()
    const [isCapturing, setIsCapturing] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const { height, width } = useWindowDimensions()
    const camera = useRef<CameraView | null>(null)
    const { updateNewPlantImage, updatePlantHealthCheckImage } = useImage()
    const { identifyPlant, assessPlantHealth } = usePlantIdentification()

    const params = useLocalSearchParams()
    const previousScreenName = params.from as string || '(tabs)'
    const mode = params.mode as 'identify' | 'health' || 'identify'

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
            Alert.alert('Error', 'Failed to capture image. Please try again.')
        } finally {
            setIsCapturing(false)
        }
    }, [isCapturing])

    const handleToggleCameraFacing = useCallback(() => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'))
    }, [])

    const handleSavePicture = useCallback(async () => {
        if (!picture?.uri || !picture.base64) return
        
        setIsProcessing(true)
        try {
            const pictureURI = picture.uri
            const imageBase64 = `data:image/jpeg;base64,${picture.base64}`
            
            switch (previousScreenName) {
                case '(tabs)':
                case 'index':
                    updatePlantHealthCheckImage(pictureURI)
                    break
                case 'addPlant':
                    updateNewPlantImage(pictureURI)
                    break
                default:
                    updatePlantHealthCheckImage(pictureURI)
                    break
            }
            
            // Process the image based on mode
            if (mode === 'identify') {
                await identifyPlant(imageBase64)
                router.push('/screens/identification-results')
            } else if (mode === 'health') {
                await assessPlantHealth(imageBase64)
                router.push('/screens/health-results')
            } else {
                router.back()
            }
        } catch (error) {
            console.error('Error processing image:', error)
            Alert.alert(
                'Processing Error',
                'There was an error processing your image. Please try again.'
            )
            router.back()
        } finally {
            setIsProcessing(false)
        }
    }, [picture, previousScreenName, mode, updateNewPlantImage, updatePlantHealthCheckImage, identifyPlant, assessPlantHealth])

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
            <SafeAreaView style={styles.previewContainer}>
                <StatusBar barStyle="light-content" />
                <Image
                    source={{ uri: picture.uri }}
                    style={styles.previewImage}
                    contentFit="cover"
                />
                {isProcessing ? (
                    <View style={styles.processingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.processingText}>
                            {mode === 'identify' 
                                ? 'Identifying plant...' 
                                : 'Analyzing plant health...'}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.previewButtons}>
                        <TouchableOpacity
                            style={[styles.previewButton, styles.retakeButton]}
                            onPress={handleRetake}
                        >
                            <Text style={styles.buttonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.previewButton, styles.saveButton]}
                            onPress={handleSavePicture}
                        >
                            <Text style={styles.buttonText}>
                                {mode === 'identify' ? 'Identify' : 'Analyze Health'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.modeIndicator}>
                <Text style={styles.modeText}>
                    {mode === 'identify' ? 'Plant Identification' : 'Plant Health Check'}
                </Text>
            </View>
            <CameraView
                style={[styles.camera, { height, width }]}
                facing={facing}
                ref={camera}
            >
                <View style={styles.overlay}>
                    <View style={styles.controls}>
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
                                <ActivityIndicator color="#fff" />
                            ) : (
                                icons['takePhoto']()
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </SafeAreaView>
    )
}

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
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 40 : 60,
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
    },
    previewImage: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f0f0f0',
    },
    previewButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#000',
        paddingBottom: Platform.OS === 'ios' ? 40 : 60,
    },
    previewButton: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
    processingContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingVertical: 30,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 50 : 70,
    },
    processingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    modeIndicator: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: 'center',
    },
    modeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
})
