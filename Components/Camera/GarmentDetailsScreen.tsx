import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import GarmentForm from './GarmentForm';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface GarmentDetailsScreenProps {
  photoUri: string;
  onSave: (
    photoUri: string,
    garmentDetails: {
      name: string;
      category: string;
      colour: string;
      brand: string;
      notes: string;
    }
  ) => void;
  onCancel: () => void;
}

export function GarmentDetailsScreen({ photoUri, onSave, onCancel }: GarmentDetailsScreenProps) {
  const handleSave = (garmentDetails: {
    name: string;
    category: string;
    colour: string;
    brand: string;
    notes: string;
  }) => {
    onSave(photoUri, garmentDetails);
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A4845" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Garment</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Photo Preview */}
      <View style={styles.photoContainer}>
        <Image source={{ uri: photoUri }} style={styles.photo} />
      </View>
      
      {/* Form */}
      <View style={styles.formContainer}>
        <GarmentForm photoUri={photoUri} onSubmit={handleSave} onCancel={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FAF9F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEDEA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4845',
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40,
  },
  photoContainer: {
    padding: 16,
    backgroundColor: '#FAF9F8',
    alignItems: 'center',
  },
  photo: {
    width: width * 0.5,
    height: width * 0.5 * 1.33,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  formContainer: {
    flex: 1,
  },
});

export default GarmentDetailsScreen;
