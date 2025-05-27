import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import LearningCentersList from '../components/LearningCentersList';
import MapErrorBoundary from '../components/MapErrorBoundary';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { DISTRICTS, LEARNING_CENTERS, LearningCenter } from '../data/learningCenters';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 160;

const initialRegion: Region = {
  latitude: 19.5,
  longitude: 74.0,
  latitudeDelta: 3,
  longitudeDelta: 3,
};

const MapScreen = () => {
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [filteredCenters, setFilteredCenters] = useState(LEARNING_CENTERS);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Use refs instead of state for map-related data to prevent re-renders
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  const regionRef = useRef<Region>(initialRegion);
  const animationInProgressRef = useRef<boolean>(false);
  const locationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get user location only once on component mount
  useEffect(() => {
    let isMounted = true;
    
    const getLocation = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;
        
        setLocationPermission(status === 'granted');
        
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          
          if (!isMounted) return;
          setUserLocation(location);
          
          // Store region in ref instead of state
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          };
          regionRef.current = newRegion;
          
          // Prevent multiple animations
          if (!animationInProgressRef.current && mapRef.current) {
            animationInProgressRef.current = true;
            mapRef.current.animateToRegion(newRegion, 1000);
            // Reset animation flag after animation completes
            setTimeout(() => {
              animationInProgressRef.current = false;
            }, 1100);
          }
        }
      } catch (error) {
        console.error('Error getting location:', error);
        if (isMounted) {
          Alert.alert(
            'Location Error',
            'Unable to get your current location. Showing default map view.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getLocation();
    
    return () => {
      isMounted = false;
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  // Memoized district filter effect
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = LEARNING_CENTERS.filter(center => center.district === selectedDistrict);
      setFilteredCenters(filtered);
      
      // Calculate the center point of the filtered centers
      if (filtered.length > 0 && !animationInProgressRef.current) {
        const latitudes = filtered.map(c => c.coordinates.latitude);
        const longitudes = filtered.map(c => c.coordinates.longitude);
        
        const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
        
        // Find the bounds
        const maxLat = Math.max(...latitudes);
        const minLat = Math.min(...latitudes);
        const maxLng = Math.max(...longitudes);
        const minLng = Math.min(...longitudes);
        
        // Calculate appropriate zoom level based on the area size
        const latDistance = maxLat - minLat;
        const lngDistance = maxLng - minLng;
        const zoomLevel = Math.min(
          14, // Max zoom level
          Math.max(
            10, // Min zoom level
            Math.floor(14 - Math.log2(Math.max(latDistance, lngDistance) * 100))
          )
        );
        
        regionRef.current = {
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: Math.max(latDistance * 1.5, 0.02),
          longitudeDelta: Math.max(lngDistance * 1.5, 0.02),
        };
        
        // Prevent animation if one is already in progress
        if (mapRef.current && !animationInProgressRef.current) {
          animationInProgressRef.current = true;
          
          // Use animateCamera for smoother animation
          mapRef.current.animateCamera({
            center: {
              latitude: centerLat,
              longitude: centerLng,
            },
            zoom: zoomLevel,
            pitch: 0, // Flat view for district overview
            heading: 0,
          }, { duration: 1000 });
          
          setTimeout(() => {
            animationInProgressRef.current = false;
          }, 1100);
        }
      }
    } else {
      setFilteredCenters(LEARNING_CENTERS);
    }
  }, [selectedDistrict]);

  // Memoized handler functions to prevent recreating on each render
  const handleCenterPress = useCallback((center: LearningCenter) => {
    setSelectedCenter(center.id);
    
    // Don't animate if animation is already in progress
    if (animationInProgressRef.current) return;
    
    // Animate map to the selected center with appropriate zoom for detail view
    const selectedRegion = {
      latitude: center.coordinates.latitude,
      longitude: center.coordinates.longitude,
      latitudeDelta: 0.02, // More zoomed in for better detail view
      longitudeDelta: 0.02,
    };
    
    regionRef.current = selectedRegion;
    
    if (mapRef.current) {
      animationInProgressRef.current = true;
      // Use animateCamera for smoother animation with focus on marker
      mapRef.current.animateCamera({
        center: {
          latitude: center.coordinates.latitude,
          longitude: center.coordinates.longitude,
        },
        zoom: 15, // Higher zoom level for better visibility
        pitch: 25, // Slight angle for better perspective
        heading: 0,
      }, { duration: 1000 });
      
      setTimeout(() => {
        animationInProgressRef.current = false;
      }, 1100);
    }

    // Scroll flatlist to the selected center
    const centerIndex = filteredCenters.findIndex(c => c.id === center.id);
    if (centerIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: centerIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [filteredCenters]);

  const handleMarkerPress = useCallback((center: LearningCenter) => {
    setSelectedCenter(center.id);
    
    // Don't animate if animation is already in progress
    if (animationInProgressRef.current) return;
    
    // Use same animation settings as handleCenterPress for consistency
    if (mapRef.current) {
      animationInProgressRef.current = true;
      // Use animateCamera for smoother animation with focus on marker
      mapRef.current.animateCamera({
        center: {
          latitude: center.coordinates.latitude,
          longitude: center.coordinates.longitude,
        },
        zoom: 15, // Higher zoom level for better visibility
        pitch: 25, // Slight angle for better perspective
        heading: 0,
      }, { duration: 1000 });
      
      setTimeout(() => {
        animationInProgressRef.current = false;
      }, 1100);
    }
    
    // Scroll flatlist to the selected center
    const centerIndex = filteredCenters.findIndex(c => c.id === center.id);
    if (centerIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: centerIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [filteredCenters]);

  const handleContactPress = useCallback((type: 'phone' | 'email' | 'website', value?: string) => {
    if (!value) return;

    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'website':
        Linking.openURL(value);
        break;
    }
  }, []);

  const handleGetDirections = useCallback((center: LearningCenter) => {
    const { latitude, longitude } = center.coordinates;
    const url = Platform.select({
      ios: `maps:0,0?q=${center.name}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${center.name})`,
    });

    if (url) {
      Linking.openURL(url).catch(err => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Could not open maps application');
      });
    }
  }, []);

  const goToUserLocation = useCallback(() => {
    if (!userLocation || animationInProgressRef.current) return;
    
    regionRef.current = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    
    if (mapRef.current) {
      animationInProgressRef.current = true;
      // Use animateCamera for smoother animation with focus on user location
      mapRef.current.animateCamera({
        center: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        zoom: 15, // Higher zoom level for better visibility
        pitch: 25, // Slight angle for better perspective
        heading: 0,
      }, { duration: 1000 });
      
      setTimeout(() => {
        animationInProgressRef.current = false;
      }, 1100);
    }
  }, [userLocation]);

  const handleDistrictFilter = useCallback((district: string | null) => {
    setSelectedDistrict(district);
    setSelectedCenter(null);
  }, []);

  const renderCenterCard = useCallback(({ item }: { item: LearningCenter }) => {
    const isSelected = selectedCenter === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && styles.selectedCard
        ]}
        onPress={() => handleCenterPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardAddress}>{item.address}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.district} | {item.node}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.contactContainer}>
              {item.contact.phone && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContactPress('phone', item.contact.phone)}
                >
                  <Ionicons name="call-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
              {item.contact.email && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContactPress('email', item.contact.email)}
                >
                  <Ionicons name="mail-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
              {item.contact.website && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContactPress('website', item.contact.website)}
                >
                  <Ionicons name="globe-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => handleGetDirections(item)}
            >
              <Ionicons name="navigate-outline" size={16} color={COLORS.white} />
              <Text style={styles.directionsText}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [selectedCenter, handleCenterPress, handleContactPress, handleGetDirections]);

  const renderDistrictFilter = useCallback(() => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedDistrict === null && styles.filterButtonActive
          ]}
          onPress={() => handleDistrictFilter(null)}
        >
          <Text 
            style={[
              styles.filterText,
              selectedDistrict === null && styles.filterTextActive
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {DISTRICTS.map(district => (
          <TouchableOpacity
            key={district}
            style={[
              styles.filterButton,
              selectedDistrict === district && styles.filterButtonActive
            ]}
            onPress={() => handleDistrictFilter(district)}
          >
            <Text 
              style={[
                styles.filterText,
                selectedDistrict === district && styles.filterTextActive
              ]}
            >
              {district}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  ), [selectedDistrict, handleDistrictFilter]);

  const MapFallback = useCallback(() => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>3D Printing Learning Centers</Text>
        <Text style={styles.headerSubtitle}>Find centers near you</Text>
      </View>
      
      {renderDistrictFilter()}
      
      <View style={styles.errorContainer}>
        <Ionicons name="map" size={64} color={COLORS.textSecondary} />
        <Text style={styles.errorTitle}>Map Unavailable</Text>
        <Text style={styles.errorText}>We're having trouble loading the map. Here's a list of all learning centers instead.</Text>
      </View>
      
      <LearningCentersList centers={filteredCenters} />
    </View>
  ), [filteredCenters, renderDistrictFilter]);

  const MapWithCards = useCallback(() => (
    <>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={locationPermission === true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          // Remove onRegionChangeComplete to prevent constant updates
        >
          {filteredCenters.map((center) => (
            <Marker
              key={center.id}
              coordinate={center.coordinates}
              title={center.name}
              description={center.address}
              onPress={() => handleMarkerPress(center)}
              pinColor={selectedCenter === center.id ? COLORS.primary : undefined}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{center.name}</Text>
                  <Text style={styles.calloutAddress}>{center.address}</Text>
                  <Text style={styles.calloutDistrict}>{center.district} | {center.node}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* Location Button */}
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={goToUserLocation}
        >
          <Ionicons name="locate" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <FlatList
          ref={flatListRef}
          data={filteredCenters}
          renderItem={renderCenterCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING.md}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.cardsList}
          onScrollToIndexFailed={() => {}}
          removeClippedSubviews={true}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </View>
    </>
  ), [filteredCenters, selectedCenter, locationPermission, handleMarkerPress, goToUserLocation, renderCenterCard]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>3D Printing Learning Centers</Text>
        <Text style={styles.headerSubtitle}>Find centers near you</Text>
      </View>

      {renderDistrictFilter()}

      <MapErrorBoundary fallback={<MapFallback />}>
        <MapWithCards />
      </MapErrorBoundary>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  errorContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  errorTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    opacity: 0.9,
  },
  filterContainer: {
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.md,
  },
  filterButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.card,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primaryTransparent,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.md,
    margin: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardsContainer: {
    height: CARD_HEIGHT + SPACING.md * 2,
    paddingVertical: SPACING.md,
  },
  cardsList: {
    paddingHorizontal: SPACING.md,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING.sm / 2,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  cardAddress: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZES.sm * 1.4,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  contactContainer: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  directionsText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    marginLeft: SPACING.xs / 2,
  },
  calloutContainer: {
    width: 200,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  calloutTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  calloutAddress: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  calloutDistrict: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
});

export default MapScreen; 