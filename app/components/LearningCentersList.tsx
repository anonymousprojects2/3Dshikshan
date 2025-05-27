import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { LearningCenter } from '../data/learningCenters';

interface LearningCentersListProps {
  centers: LearningCenter[];
  onCenterPress?: (center: LearningCenter) => void;
}

const LearningCentersList: React.FC<LearningCentersListProps> = ({ centers, onCenterPress }) => {
  const handleContactPress = (type: 'phone' | 'email' | 'website', value?: string) => {
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
  };

  const renderCenterItem = ({ item }: { item: LearningCenter }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardAddress}>{item.address}</Text>
          <Text style={styles.cardDistrict}>{item.district} | {item.node}</Text>
        </View>
        
        <View style={styles.contactsContainer}>
          {item.contact.phone && (
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContactPress('phone', item.contact.phone)}
            >
              <Ionicons name="call-outline" size={20} color={COLORS.white} />
              <Text style={styles.contactText}>Call</Text>
            </TouchableOpacity>
          )}
          {item.contact.email && (
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContactPress('email', item.contact.email)}
            >
              <Ionicons name="mail-outline" size={20} color={COLORS.white} />
              <Text style={styles.contactText}>Email</Text>
            </TouchableOpacity>
          )}
          {item.contact.website && item.contact.website.length > 0 && (
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContactPress('website', item.contact.website)}
            >
              <Ionicons name="globe-outline" size={20} color={COLORS.white} />
              <Text style={styles.contactText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={centers}
      renderItem={renderCenterItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
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
  cardContent: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  cardAddress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  cardDistrict: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  contactsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  contactText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});

export default LearningCentersList; 