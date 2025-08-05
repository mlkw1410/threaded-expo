import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface GarmentFormProps {
  onSubmit: (garmentDetails: {
    name: string;
    category: string;
    colour: string;
    brand: string;
    notes: string;
  }) => void;
  onCancel: () => void;
  photoUri: string;
}

export const GarmentForm = forwardRef(({ onSubmit, onCancel, photoUri }: GarmentFormProps, ref) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [colour, setColour] = useState('');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      if (!name || !category || !colour) {
        // TODO: Show validation error
        return;
      }
      onSubmit({
        name,
        category,
        colour,
        brand,
        notes,
      });
    }
  }));

  const handleSubmit = () => {
    if (!name || !category || !colour) {
      // TODO: Show validation error
      return;
    }
    onSubmit({
      name,
      category,
      colour,
      brand,
      notes,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.form}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="E.g., Blue Denim Jacket"
            placeholderTextColor="#9A9692"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category*</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="E.g., Jacket, Pants, Dress"
            placeholderTextColor="#9A9692"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color*</Text>
          <TextInput
            style={styles.input}
            value={colour}
            onChangeText={setColour}
            placeholder="E.g., Blue, Black, Red"
            placeholderTextColor="#9A9692"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="E.g., Levi's, Nike"
            placeholderTextColor="#9A9692"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            placeholderTextColor="#9A9692"
            multiline
            numberOfLines={4}
          />
        </View>
        
        {/* Add padding at the bottom to ensure the last input is visible with keyboard */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  form: {
    padding: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: width * 0.5,
    height: width * 0.5 * 1.33,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A4845',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEDEA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#4A4845',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default GarmentForm;
