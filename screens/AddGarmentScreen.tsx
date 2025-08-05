import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import GarmentForm from '../Components/Camera/GarmentForm';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  AddGarment: { photoUri: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddGarment'>;

export function AddGarmentScreen({ route, navigation }: Props) {
  const { photoUri } = route.params;
  const formRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (garmentDetails: {
    name: string;
    category: string;
    colour: string;
    brand: string;
    notes: string;
  }) => {
    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save garments');
        return;
      }

      // Insert the garment into the database
      const { data, error } = await supabase
        .from('garments')
        .insert({
          user_id: user.id,
          name: garmentDetails.name,
          category: garmentDetails.category,
          colour: garmentDetails.colour,
          brand: garmentDetails.brand,
          notes: garmentDetails.notes,
          image_url: photoUri, // This is the local URI, you might want to upload to storage first
        });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // Success! Navigate back
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while saving the garment');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A4845" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Garment</Text>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={() => !isLoading && formRef.current?.handleSubmit()}
        >
          <Ionicons name="checkmark" size={24} color={isLoading ? '#C8C6C4' : '#8B45C3'} />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <GarmentForm ref={formRef} onSubmit={handleSave} onCancel={handleCancel} photoUri={photoUri} />
      </KeyboardAvoidingView>
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
  saveButton: {
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default AddGarmentScreen;
