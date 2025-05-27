export const COLORS = {
  primary: '#00BCD4',
  primaryTransparent: 'rgba(0, 188, 212, 0.1)',
  background: '#000000',
  card: '#1E1E1E',
  cardGradient: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#00BCD4',
  error: '#FF5252',
  white: '#FFFFFF'
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 999, // For creating fully rounded elements
} as const;

// Default export for the theme
const theme = {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS
};

export default theme; 