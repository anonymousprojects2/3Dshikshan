import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import BlogService, { BlogPost } from '../services/BlogService';

interface DynamicBlogsSectionProps {
  onBlogPress?: (url: string) => void;
}

const DynamicBlogsSection: React.FC<DynamicBlogsSectionProps> = ({ onBlogPress }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogs = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const blogPosts = await BlogService.fetchAllContent();
      setBlogs(blogPosts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Failed to load blog content. Please try again later.');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleBlogPress = (blog: BlogPost) => {
    if (onBlogPress) {
      onBlogPress(blog.url);
    } else {
      Linking.openURL(blog.url).catch(err => 
        console.error('An error occurred opening the URL:', err)
      );
    }
  };

  const renderBlogItem = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      style={styles.blogCard}
      activeOpacity={0.9}
      onPress={() => handleBlogPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.blogImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.blogContent}>
        <View>
          <Text style={styles.blogTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.blogMeta}>
            <Text style={styles.blogSource}>{item.source}</Text>
            <Text style={styles.blogDate}>{item.date}</Text>
          </View>
          <Text style={styles.blogExcerpt} numberOfLines={2}>
            {item.excerpt}
          </Text>
        </View>
        <View style={styles.readMoreContainer}>
          <Ionicons name="newspaper-outline" size={16} color={COLORS.primary} />
          <Text style={styles.readMoreText}>Read Article</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading latest blog posts...</Text>
      </View>
    );
  }

  if (error && blogs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => fetchBlogs()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={blogs}
      renderItem={renderBlogItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={() => fetchBlogs(true)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
  },
  errorText: {
    marginTop: SPACING.sm,
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  blogCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    width: 120,
    height: 120,
  },
  blogImage: {
    width: '100%',
    height: '100%',
  },
  blogContent: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  blogTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  blogSource: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  blogDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  blogExcerpt: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZES.sm * 1.4,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primaryTransparent,
    alignSelf: 'flex-start',
    borderRadius: BORDER_RADIUS.sm,
  },
  readMoreText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs / 2,
  },
});

export default DynamicBlogsSection; 