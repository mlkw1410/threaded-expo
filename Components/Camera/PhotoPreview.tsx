import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PhotoPreviewProps {
  photoUri: string;
  onRetake: () => void;
  onSave: (uri: string) => void;
  onCancel: () => void;
}

const { width, height } = Dimensions.get('window');

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photoUri,
  onRetake,
  onSave,
  onCancel,
}) => {
  return (
    <View style={styles.container}>
      {/* Photo Display */}
      <View style={styles.photoContainer}>
        <Image source={{ uri: photoUri }} style={styles.photo} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onCancel}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onRetake}>
          <Ionicons name="camera" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]} 
          onPress={() => onSave(photoUri)}
        >
          <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  photo: {
    width: width - 40,
    height: (width - 40) * 1.33, // 4:3 aspect ratio
    borderRadius: 12,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 40,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 50,
    backgroundColor: '#333333',
    minWidth: 80,
  },
  saveButton: {
    backgroundColor: '#8B5CF6', // Purple accent matching your brand
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default PhotoPreview;

