import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

interface GarmentFormProps {
  onSubmit: (garmentDetails: {
    name: string;
    category: string;
    colour: string;
    brand: string;
    notes: string;
  }) => void;
  onCancel: () => void;
}

export function GarmentForm({ onSubmit, onCancel }: GarmentFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [colour, setColour] = useState('');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.handleBar} />
        <Text style={styles.headerTitle}>Add Garment Details</Text>
      </View>

      <ScrollView style={styles.form}>
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
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEDEA',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E8E5E1',
    borderRadius: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4845',
  },
  form: {
    padding: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EFEDEA',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FAF9F8',
    borderWidth: 1,
    borderColor: '#EFEDEA',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#8B45C3',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#4A4845',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
