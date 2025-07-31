import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CameraPermissionsProps {
  onPermissionsGranted: () => void;
  onClose: () => void;
}

function CameraPermissions({ onPermissionsGranted, onClose }: CameraPermissionsProps) {
  const handleRequestPermissions = () => {
    Alert.alert(
      'Camera Access Required',
      'Threaded needs access to your camera to help you photograph your clothing items and build your digital wardrobe.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onClose,
        },
        {
          text: 'Grant Access',
          onPress: onPermissionsGranted,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={80} color="#8B45C3" />
          </View>
          
          <Text style={styles.title}>Camera Access Required</Text>
          
          <Text style={styles.description}>
            To help you build your sustainable digital wardrobe, Threaded needs access to your camera to photograph your clothing items.
          </Text>

          <View style={styles.permissionsList}>
            <View style={styles.permissionItem}>
              <Ionicons name="camera" size={20} color="#8B45C3" />
              <Text style={styles.permissionText}>Camera access to take photos</Text>
            </View>
            <View style={styles.permissionItem}>
              <Ionicons name="image" size={20} color="#8B45C3" />
              <Text style={styles.permissionText}>Photo library access to save images</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.grantButton} 
            onPress={handleRequestPermissions}
          >
            <Text style={styles.grantButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  permissionsList: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  grantButton: {
    backgroundColor: '#8B45C3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 16,
  },
  grantButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8B45C3',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CameraPermissions;