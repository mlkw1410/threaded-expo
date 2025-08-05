import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  StatusBar
} from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import CameraPermissions from './CameraPermissions';
import PhotoPreview from './PhotoPreview';

interface CameraScreenProps {
  onClose: () => void;
  onPhotoSaved: (photoUri: string) => void;
}

function CameraScreen({ onClose, onPhotoSaved }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0); // 0 = 1x, 0.5 = 2x
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handlePermissionsGranted = () => {
    requestPermission();
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlashMode = () => {
    setFlashMode(current => {
      switch (current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
          return 'off';
        default:
          return 'off';
      }
    });
  };

  const toggleZoom = () => {
    setZoom(current => current === 0 ? 0.1 : 0);
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-outline';
      case 'off':
        return 'flash-off';
      default:
        return 'flash-off';
    }
  };

  const getZoomText = () => {
    return zoom === 0 ? '1x' : '2x';
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleSave = async (photoUri: string) => {
    try {
      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'Could not get user info.');
        return;
      }
      const authId = user.id;

      // 2. Get filename from URI
      const filename = photoUri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const filePath = `${authId}/${filename}`;

      // Method 1: Using ArrayBuffer (Recommended)
      const fileInfo = await FileSystem.getInfoAsync(photoUri);
      if (!fileInfo.exists) {
        Alert.alert('Error', 'Photo file not found.');
        return;
      }

      // Read file as binary data
      const fileData = await FileSystem.readAsStringAsync(photoUri, { 
        encoding: FileSystem.EncodingType.Base64 
      });

      // Convert base64 to ArrayBuffer
      const binaryString = atob(fileData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Upload using ArrayBuffer
      const { error: uploadError } = await supabase.storage
        .from('garments')
        .upload(filePath, bytes.buffer, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        Alert.alert('Upload Error', uploadError.message);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('garments')
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlData?.publicUrl || '';

      // Insert garment into database (using placeholder values for now)
      const { error: insertError } = await supabase
        .from('garments')
        .insert([
          {
            user_id: authId,
            name: 'New Garment', // TODO: prompt user for real values
            category: 'Other',
            colour: 'Unknown',
            brand: '',
            image_url: publicUrl,
            notes: '',
            // created_at will default to now()
          }
        ]);
      if (insertError) {
        console.error('Insert error:', insertError);
        Alert.alert('Database Error', insertError.message);
        return;
      }

      onPhotoSaved(publicUrl);
      onClose();
    } catch (err) {
      console.error('Error uploading photo:', err);
      Alert.alert('Error', 'Failed to upload photo.');
    }
  };


  const handleCancel = () => {
    setCapturedPhoto(null);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <CameraPermissions 
        onPermissionsGranted={handlePermissionsGranted}
        onClose={onClose}
      />
    );
  }

  if (capturedPhoto) {
    return (
      <PhotoPreview
        photoUri={capturedPhoto}
        onCancel={handleCancel}
        onRetake={handleRetake}
        onSave={handleSave}
      />
    );
  }

  // Main camera interface
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flashMode}
        mode="picture"
        zoom={zoom}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.topControls}>
        <TouchableOpacity onPress={toggleFlashMode} style={styles.controlButton}>
          <Ionicons name={getFlashIcon()} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraType} style={styles.controlButton}>
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleZoom} style={styles.controlButton}>
          <Text style={styles.zoomButtonText}>{getZoomText()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.frameGuide}>
        <View style={styles.frameCorner} />
        <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
        <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
        <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Position your clothing item within the frame
        </Text>
      </View>

      <View style={styles.bottomControls}>
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isCapturing}
          >
            <View style={styles.captureButtonInner}>
              {isCapturing && (
                <Text style={styles.capturingText}>📸</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    padding: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 50,
  },
  topControls: {
    position: 'absolute',
    top: 120,
    right: 20,
    flexDirection: 'column',
    gap: 15,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  frameGuide: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    right: '15%',
    bottom: '35%',
    borderWidth: 2,
    borderColor: 'rgba(139, 69, 195, 0.8)', // Threaded purple
    borderRadius: 12,
  },
  frameCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#8B45C3', // Threaded purple
    borderWidth: 3,
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  frameCornerTopRight: {
    top: -2,
    right: -2,
    left: 'auto',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 3,
  },
  frameCornerBottomLeft: {
    bottom: -2,
    top: 'auto',
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  frameCornerBottomRight: {
    bottom: -2,
    right: -2,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#8B45C3', // Threaded purple
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B45C3', // Threaded purple
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturingText: {
    fontSize: 24,
  },
}); 

export default CameraScreen