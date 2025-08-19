import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, ImageStyle, ViewStyle, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { generateGarmentDesign } from '../../lib/huggingface';

type NavigationProp = NativeStackNavigationProp<{
  AddGarment: { photoUri: string };
}, 'AddGarment'>;

interface PhotoPreviewProps {
  photoUri: string;
  onCancel: () => void;
  onRetake: () => void;
}

const { width, height } = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.7;

function PhotoPreview({ photoUri, onRetake, onCancel }: PhotoPreviewProps) {
  const navigation = useNavigation<NavigationProp>();
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    navigation.navigate('AddGarment', { photoUri });
  };

  const handleGenerateDesign = async () => {
    console.log('Generating design...');
    setLoading(true);
    try {
      const design = await generateGarmentDesign(photoUri);
      if (design) {
        setDesignImage(design);
      }
    } catch (error) {
      console.error('Error generating design:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Photo Display */}
      <View style={styles.photoContainer}>
        <Image source={{ uri: designImage || photoUri }} style={styles.photo} />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
      >
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Generate Design Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateDesign}
        disabled={loading}
      >
        <Text style={styles.nextButtonText}>Generate Design</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  } as ViewStyle,
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  } as ViewStyle,
  photo: {
    width: width - 40,
    height: (width - 40) * 1.33, // 4:3 aspect ratio
    borderRadius: 12,
    resizeMode: 'cover',
  } as ImageStyle,
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cancelButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  generateButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A4845',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  nextButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B45C3',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default PhotoPreview;

