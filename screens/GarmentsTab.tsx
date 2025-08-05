import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  RefreshControl, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { getGarments } from '../lib/databaseFunctions';
import { Garment } from '../types/database';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2;

const GarmentsTab: React.FC = () => {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to view garments.");

      const result = await getGarments(user.id);
      
      if (result.success && result.data) {
        setGarments(result.data);
      } else {
        throw result.error || new Error("Failed to load garments");
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGarments();
    setRefreshing(false);
  };
  
  const handleGarmentPress = (garment: Garment) => { 
    Alert.alert(
      garment.name,
      `Category: ${garment.category}\nColor: ${garment.color}${garment.brand ? `\nBrand: ${garment.brand}` : ''}${garment.notes ? `\nNotes: ${garment.notes}` : ''}`,
      [{ text: 'OK' }]
    ); 
  };
  
  const renderGarmentItem = ({ item }: { item: Garment }) => ( 
    <TouchableOpacity 
      style={styles.garmentItem}
      onPress={() => handleGarmentPress(item)}
      activeOpacity={0.7}
    > 
      {item.image_url ? ( 
        <Image source={{ uri: item.image_url }} style={styles.garmentImage} /> 
      ) : ( 
        <View style={[styles.garmentImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>📷</Text>
        </View> 
      )} 
      <Text style={styles.garmentName} numberOfLines={2}>{item.name}</Text> 
      <Text style={styles.garmentCategory}>{item.category} • {item.color}</Text> 
      {item.brand && (<Text style={styles.garmentBrand}>{item.brand}</Text>)} 
    </TouchableOpacity> 
  );
  
  const renderEmptyState = () => ( 
    <View style={styles.emptyContainer}> 
      <Text style={styles.emptyEmoji}>👗</Text> 
      <Text style={styles.emptyTitle}>No garments yet</Text> 
      <Text style={styles.emptyText}>Tap the camera button to start adding clothes to your digital closet!</Text> 
    </View> 
  );

  const renderHeader = () => ( 
    <View style={styles.header}> 
      <Text style={styles.headerTitle}>Your Garments</Text> 
      <Text style={styles.headerSubtitle}>{garments.length} {garments.length === 1 ? 'item' : 'items'}</Text> 
    </View> 
  );

  if (loading && !refreshing) { 
    return ( 
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading your wardrobe...</Text>
      </View> 
    ); 
  }

  return ( 
    <View style={styles.container}> 
      <FlatList 
        data={garments} 
        renderItem={renderGarmentItem} 
        keyExtractor={(item) => item.id} 
        numColumns={2} 
        contentContainerStyle={styles.listContainer} 
        ListHeaderComponent={renderHeader} 
        ListEmptyComponent={renderEmptyState} 
        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A4845']} tintColor="#4A4845" /> } 
        showsVerticalScrollIndicator={false} 
      /> 
    </View> 
  );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F5F3F0', }, centerContent: { justifyContent: 'center', alignItems: 'center', }, header: { padding: 20, paddingBottom: 10, }, headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#4A4845', marginBottom: 4, }, headerSubtitle: { fontSize: 16, color: '#7A7672', }, listContainer: { paddingHorizontal: 10, paddingBottom: 20, }, garmentItem: { backgroundColor: '#FAF9F8', borderRadius: 12, padding: 12, margin: 5, width: ITEM_WIDTH, shadowColor: '#5A5856', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#EFEDEA', }, garmentImage: { width: '100%', height: ITEM_WIDTH - 24, borderRadius: 8, marginBottom: 8, backgroundColor: '#E8E5E1', }, placeholderImage: { justifyContent: 'center', alignItems: 'center', }, placeholderText: { fontSize: 32, opacity: 0.5, }, garmentName: { fontSize: 14, fontWeight: '600', color: '#4A4845', marginBottom: 4, textAlign: 'center', lineHeight: 18, }, garmentCategory: { fontSize: 12, color: '#7A7672', textAlign: 'center', marginBottom: 2, }, garmentBrand: { fontSize: 11, color: '#9A9692', textAlign: 'center', fontStyle: 'italic', }, emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, marginTop: 50, }, emptyEmoji: { fontSize: 64, marginBottom: 16, opacity: 0.6, }, emptyTitle: { fontSize: 20, fontWeight: '600', color: '#4A4845', marginBottom: 8, textAlign: 'center', }, emptyText: { fontSize: 16, color: '#7A7672', textAlign: 'center', lineHeight: 22, }, loadingText: { fontSize: 16, color: '#7A7672', textAlign: 'center', }, });

export default GarmentsTab;