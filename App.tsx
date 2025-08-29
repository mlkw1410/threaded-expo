import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Closet: undefined;
  Camera: undefined;
  Auth: undefined;
  AddGarment: { photoUri: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();


import ClosetScreen from './screens/ClosetScreen';
import CameraScreen from './Components/Camera/CameraScreen';
import AuthScreen from './Components/Auth/AuthScreen';
import AddGarmentScreen from './screens/AddGarmentScreen';
import { supabase } from './lib/supabase';

const { width: screenWidth } = Dimensions.get('window');


import { useState as useStateReact, useRef as useRefReact } from 'react';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useStateReact(false);
  const menuButtonRef = useRefReact(null);

  const handleLogout = async () => {
    setMenuVisible(false);
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F5" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Threaded</Text>
        <Text style={styles.headerSubtitle}>Your Digital Closet</Text>
        <TouchableOpacity
          ref={menuButtonRef}
          style={styles.moreButton}
          onPress={() => setMenuVisible((v) => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.moreButtonText}>⋮</Text>
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Camera' as never)}>
                <Text style={styles.actionEmoji}>📷</Text>
                <Text style={styles.actionTitle}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Closet' as never)}>
                <Text style={styles.actionEmoji}>👗</Text>
                <Text style={styles.actionTitle}>View Closet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionEmoji}>👔</Text>
                <Text style={styles.actionTitle}>Stylist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionEmoji}>🌙</Text>
                <Text style={styles.actionTitle}>Date Night</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionEmoji}>💼</Text>
                <Text style={styles.actionTitle}>Office</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionEmoji}>🥐</Text>
                <Text style={styles.actionTitle}>Weekend Brunch</Text>
              </TouchableOpacity>
            </View>
          </View>

          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) setSession(data.session);
      setLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3F0' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return <AuthScreen onAuthSuccess={async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Closet"
          component={ClosetScreen}
          options={{
            headerTitle: 'Your Closet',
            headerStyle: {
              backgroundColor: '#F8F7F5',
            },
            headerTintColor: '#4A4845',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Camera"
          options={{
            headerTitle: 'Camera',
            headerStyle: { backgroundColor: '#F8F7F5' },
            headerTintColor: '#4A4845',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
          children={({ navigation }) => (
            <CameraScreen
              onClose={() => navigation.goBack()}
              onPhotoSaved={() => {}}
            />
          )}
        />
        <Stack.Screen
          name="AddGarment"
          component={AddGarmentScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#F8F7F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5E1',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4845',
    marginBottom: 2,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7A7672',
    textAlign: 'center',
    flex: 1,
  },
  moreButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 8,
    zIndex: 10,
  },
  moreButtonText: {
    fontSize: 24,
    color: '#4A4845',
    fontWeight: 'bold',
  },
  menuDropdown: {
    position: 'absolute',
    right: 10,
    top: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 120,
    zIndex: 20,
  },
  menuItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEDEA',
  },
  menuItemText: {
    fontSize: 16,
    color: '#4A4845',
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4845',
    marginBottom: 15,
  },
  carouselContainer: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  stackedCarousel: {
    height: 200,
    width: screenWidth * 0.9,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackedCard: {
    position: 'absolute',
    width: screenWidth * 0.75,
    height: (screenWidth * 0.75) * (468 / 461),
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  activeCard: {
    zIndex: 4,
    transform: [{ scale: 1 }],
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  nextCard: {
    zIndex: 3,
    transform: [{ scale: 0.92 }, { translateX: 20 }],
  },
  previousCard: {
    zIndex: 3,
    transform: [{ scale: 0.92 }, { translateX: -20 }],
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemEmoji: {
    fontSize: 48,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A4845',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemSubtitle: {
    fontSize: 16,
    color: '#6A6663',
    opacity: 0.9,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionCard: {
    width: '30%',
    backgroundColor: '#FAF9F8',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#5A5856',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEDEA',
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A4845',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#FAF9F8',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#5A5856',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEDEA',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEC',
  },
  activityText: {
    fontSize: 14,
    color: '#4A4845',
    flex: 1,
  },
  activityTime: {
    fontSize: 12,
    color: '#7A7672',
  },
});

export default App;