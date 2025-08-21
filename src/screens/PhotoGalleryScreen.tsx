import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import colors from '../theme/colors';
import { NativeModules } from 'react-native';

const { SecurityTriggerModule } = NativeModules;

interface SecurityPhoto {
  id: string;
  path: string;
  cameraType: 'back' | 'front' | 'unknown';
  timestamp: string;
  fileName: string;
  storageType: string;
  fileSize: number;
}

const PhotoGalleryScreen = () => {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const [photos, setPhotos] = useState<SecurityPhoto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPhotos = async () => {
    try {
      console.log('Fetching security photos...');
      
      // Call native module to get actual photos
      const photosJson = await SecurityTriggerModule.getSecurityPhotos();
      const photosArray = JSON.parse(photosJson);
      
      const fetchedPhotos: SecurityPhoto[] = photosArray.map((photo: any) => ({
        id: photo.id,
        path: photo.path,
        cameraType: photo.cameraType || 'unknown',
        timestamp: photo.timestamp || 'Unknown',
        fileName: photo.fileName || 'Unknown',
        storageType: photo.storageType || 'unknown',
        fileSize: photo.fileSize || 0,
      }));
      
      setPhotos(fetchedPhotos);
      console.log(`Fetched ${fetchedPhotos.length} security photos`);
      
    } catch (error) {
      console.error('Error fetching photos:', error);
      Alert.alert('Error', 'Failed to fetch security photos');
      // Fallback to empty array
      setPhotos([]);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await SecurityTriggerModule.deleteSecurityPhoto(photoId);
      setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photoId));
      Alert.alert('Deleted', 'Photo has been deleted.');
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo.');
    }
  };

  const renderPhotoItem = ({ item }: { item: SecurityPhoto }) => (
    <View style={[styles.photoItem, { backgroundColor: themeColors.secondary }]}>
      <View style={styles.photoHeader}>
        <Text style={[styles.cameraType, { color: themeColors.primary }]}>
          📸 {item.cameraType.toUpperCase()} Camera
        </Text>
        <Text style={[styles.timestamp, { color: themeColors.primary }]}>
          {item.timestamp}
        </Text>
      </View>
      
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: `file://${item.path}` }}
          style={styles.photo}
          resizeMode="cover"
          onError={() => {
            console.log('Failed to load image:', item.path);
          }}
        />
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: '#d32f2f' }]}
          onPress={() =>
            Alert.alert(
              'Delete Photo',
              'Are you sure you want to delete this photo?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deletePhoto(item.id) },
              ]
            )
          }
        >
          <Text style={[styles.deleteButtonText, { color: '#fff' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.photoFooter}>
        <Text style={[styles.fileName, { color: themeColors.primary }]} numberOfLines={1}>
          {item.fileName}
        </Text>
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: themeColors.primary }]}
          onPress={() => {
            Alert.alert('Photo Details', `Camera: ${item.cameraType}\nTime: ${item.timestamp}\nPath: ${item.path}`);
          }}
        >
          <Text style={[styles.viewButtonText, { color: themeColors.secondary }]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: themeColors.secondary }]}>
      <Text style={[styles.emptyStateTitle, { color: themeColors.primary }]}>
        📸 No Security Photos Yet
      </Text>
      <Text style={[styles.emptyStateText, { color: themeColors.primary }]} numberOfLines={1}>
        Capture security photos using the camera button on the home screen.
      </Text>
      <TouchableOpacity
        style={[styles.refreshButton, { backgroundColor: themeColors.primary }]}
        onPress={fetchPhotos}
      >
        <Text style={[styles.refreshButtonText, { color: themeColors.secondary }]}>
          Refresh
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.secondary }]}>
      <View style={[styles.header, { backgroundColor: themeColors.primary }]}>
        <Text style={[styles.headerTitle, { color: themeColors.secondary }]}>
          🔒 Security Photo Gallery
        </Text>
        <Text style={[styles.headerSubtitle, { color: themeColors.secondary }]}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
        </Text>
      </View>

      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.photoList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  photoList: {
    padding: 16,
    flexGrow: 1,
  },
  photoItem: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    opacity: 0.7,
  },
  photoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  photoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 12,
    flex: 1,
    marginRight: 12,
    opacity: 0.6,
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 2,
    elevation: 4,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default PhotoGalleryScreen;
