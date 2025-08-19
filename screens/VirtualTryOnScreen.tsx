import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, ActivityIndicator, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// This is a mock function. In a real application, you would replace this
// with your actual API call to a service like Hugging Face.
// It simulates a network request and returns a placeholder image URL.
const runVirtualTryOn = async (personImageUrl: string, garmentImageUrl: string): Promise<string> => {
  console.log("Starting virtual try-on with:", { personImageUrl, garmentImageUrl });
  // In a real app, you would use FormData to send the images to your server/API.
  return new Promise(resolve => {
    setTimeout(() => {
      // This would be the URL returned from your API
      const resultUrl = `https://placehold.co/400x600/CCCCCC/FFFFFF?text=Result`;
      console.log("Virtual try-on complete. Result:", resultUrl);
      resolve(resultUrl);
    }, 3000); // Simulate a 3-second API call
  });
};


const VirtualTryOnScreen: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to request permissions and select an image from the device's library
  const selectImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    // Request media library permissions if not on the web
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
    }

    // Launch the image picker UI
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 5], // Corrected: Provided a valid aspect ratio
          quality: 1,
        });

        if (!result.canceled) {
          setImage(result.assets[0].uri);
          setResultImage(null); // Clear previous result when a new image is selected
          setError(null); // Clear previous errors
        }
    } catch (e) {
        console.error("ImagePicker Error: ", e);
        Alert.alert("Error", "Could not select image.");
    }
  };

  // Function to handle the "Try On" action
  const handleTryOn = async () => {
    if (personImage && garmentImage) {
      setIsLoading(true);
      setResultImage(null);
      setError(null);
      try {
        // Call the mock API function
        const result = await runVirtualTryOn(personImage, garmentImage);
        setResultImage(result);
      } catch (e) {
        console.error("Failed to run virtual try-on:", e);
        setError('Failed to generate the try-on image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
        setError('Please select both a person and a garment image.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Virtual Try-On</Text>
            <Text style={styles.subtitle}>Select an image of a person and a garment to see the magic!</Text>

            {/* Person Image Selection */}
            <View style={styles.imageContainer}>
                {personImage ? (
                    <Image source={{ uri: personImage }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder]}><Text>Person</Text></View>
                )}
                <TouchableOpacity style={styles.button} onPress={() => selectImage(setPersonImage)}>
                    <Text style={styles.buttonText}>Select Person Image</Text>
                </TouchableOpacity>
            </View>

            {/* Garment Image Selection */}
            <View style={styles.imageContainer}>
                {garmentImage ? (
                    <Image source={{ uri: garmentImage }} style={styles.image} />
                ) : (
                     <View style={[styles.image, styles.placeholder]}><Text>Garment</Text></View>
                )}
                <TouchableOpacity style={styles.button} onPress={() => selectImage(setGarmentImage)}>
                    <Text style={styles.buttonText}>Select Garment Image</Text>
                </TouchableOpacity>
            </View>

            {/* Try On Button */}
            <TouchableOpacity style={[styles.button, styles.tryOnButton]} onPress={handleTryOn} disabled={isLoading}>
                <Text style={styles.buttonText}>Try On</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Result Section */}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A4845" />
                    <Text style={styles.loadingText}>Generating your image...</Text>
                </View>
            )}

            {resultImage && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Result</Text>
                    <Image source={{ uri: resultImage }} style={styles.image} />
                </View>
            )}
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F3F0',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  imageContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: '#4A4845',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  tryOnButton: {
    backgroundColor: '#2E8B57', // A different color for the main action
    paddingVertical: 15,
    marginVertical: 20,
    width: '90%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    width: 250,
    height: 350,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A4845',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  }
});

export default VirtualTryOnScreen;
