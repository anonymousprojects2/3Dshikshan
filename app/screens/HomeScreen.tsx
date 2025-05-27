import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DynamicBlogsSection from '../components/DynamicBlogsSection';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { WEBSITES, Website } from '../constants/urls';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - (SPACING.md * 4)) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.15;

type TabType = 'websites' | 'blogs';

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('websites');
  const [pressedCard, setPressedCard] = useState<string | null>(null);

  const handleWebsitePress = async (website: Website) => {
    const url = website.sections.main;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    } catch (error) {
      console.error("An error occurred while opening the URL:", error);
    }
  };

  const handleLinkOpen = (url: string) => {
    Linking.openURL(url).catch(err => 
      console.error("An error occurred while opening the URL:", err)
    );
  };

  const renderWebsiteCard = (site: Website, index: number) => {
    const isPressed = pressedCard === site.title;

    return (
      <TouchableOpacity
        key={site.title}
        style={[
          styles.gridCard,
          index % 2 === 0 ? { marginRight: SPACING.md } : {},
          isPressed && styles.gridCardPressed,
        ]}
        onPressIn={() => setPressedCard(site.title)}
        onPressOut={() => setPressedCard(null)}
        onPress={() => handleWebsitePress(site)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.card, COLORS.cardGradient]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.gridCardTitle}>{site.title}</Text>
              <Text style={styles.gridCardDescription}>{site.description}</Text>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.iconContainer}>
                <Ionicons name="globe-outline" size={18} color={COLORS.primary} />
                <Text style={styles.learnMoreText}>Learn More</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandName}>3D Shikshan</Text>
        <Text style={styles.subtitle}>Explore 3D Printing Resources</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'websites' && styles.activeTab]}
          onPress={() => setActiveTab('websites')}
        >
          <Text style={[styles.tabText, activeTab === 'websites' && styles.activeTabText]}>
            Websites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'blogs' && styles.activeTab]}
          onPress={() => setActiveTab('blogs')}
        >
          <Text style={[styles.tabText, activeTab === 'blogs' && styles.activeTabText]}>
            Latest Blogs
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'websites' ? (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.cardsGrid}>
            {WEBSITES.map((site, index) => renderWebsiteCard(site, index))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <DynamicBlogsSection onBlogPress={handleLinkOpen} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? SPACING.lg : SPACING.xl,
    marginBottom: SPACING.sm,
  },
  brandName: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.lg * 1.2,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: FONT_SIZES.lg * 1.5,
  },
  subtitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
    fontWeight: '400',
    opacity: 0.9,
    lineHeight: FONT_SIZES.md,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activeTab: {
    backgroundColor: COLORS.primaryTransparent,
  },
  tabText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    alignItems: 'flex-start',
  },
  gridCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: SPACING.md,
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
  gridCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardGradient: {
    flex: 1,
    padding: SPACING.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridCardTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  gridCardDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.sm * 1.4,
    opacity: 0.9,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryTransparent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  learnMoreText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});

export default HomeScreen; 