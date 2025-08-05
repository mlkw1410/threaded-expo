import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { getOutfitsWithGarments } from '../lib/databaseFunctions';
import { OutfitWithGarments } from '../types/database';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 40) / 2; // Adjusted for padding in container

const OutfitsTab: React.FC = () => {
  const [outfits, setOutfits] = useState<OutfitWithGarments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("You must be logged in to view outfits.");

        // Use our new "smart" function
        const result = await getOutfitsWithGarments(user.id);

        if (result.success && result.data) {
          setOutfits(result.data);
        } else {
          throw result.error || new Error("Failed to load outfits.");
        }
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadOutfits();
  }, []);

  const renderOutfitItem = ({ item }: { item: OutfitWithGarments }) => (
    <View style={styles.outfitItem}>
      {/* We'll use the first garment's image as the outfit preview */}
      <Image 
        source={{ uri: item.garments[0]?.image_url || 'https://via.placeholder.com/150' }} 
        style={styles.outfitImage} 
      />
      <Text style={styles.outfitName}>{item.name}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      {outfits.length > 0 ? (
        <FlatList
          data={outfits}
          renderItem={renderOutfitItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.emptyText}>No outfits created yet!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  outfitItem: {
    backgroundColor: '#FAF9F8',
    borderRadius: 12,
    padding: 10,
    margin: 5,
    width: ITEM_WIDTH,
    alignItems: 'center',
    shadowColor: '#5A5856',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEDEA',
  },
  outfitImage: {
    width: '100%',
    height: ITEM_WIDTH,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#E8E5E1',
  },
  outfitName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A4845',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#7A7672',
  },
});

export default OutfitsTab;