# Modern Styling System

This directory contains a comprehensive, modern styling system for the My Halal App built with React Native.

## Structure

### Core Files
- `theme.ts` - Design system foundation with colors, typography, spacing, and other design tokens
- `common.ts` - Reusable component styles (buttons, inputs, cards, text, etc.)
- `index.ts` - Central export file for easy imports

### Screen-Specific Styles
- `HomeScreen.styles.ts` - Styles for the main home screen
- `LoginScreen.styles.ts` - Styles for the login screen
- `RegisterScreen.styles.ts` - Styles for the registration screen
- `ScannerScreen.styles.ts` - Styles for the barcode scanner screen
- `AdminPanel.styles.ts` - Styles for the admin panel button and full admin screen
- `ProductDetail.styles.ts` - Styles for the product detail screen
- `ProductCreation.styles.ts` - Styles for the product creation screen

## Design System

### Colors
The app uses a modern green-based color palette that aligns with halal/Islamic themes:
- **Primary**: Green shades for main actions and branding
- **Secondary**: Blue shades for secondary actions
- **Neutral**: Gray shades for text and backgrounds
- **Semantic**: Success, warning, error, and info colors
- **Status**: Specific colors for halal, haram, unknown, and pending states

### Typography
- Consistent font sizing using a scale (xs, sm, base, lg, xl, 2xl, etc.)
- Font weights: normal, medium, semibold, bold
- Line heights: tight, normal, relaxed

### Spacing
- Consistent spacing scale using 4px base unit
- Ranges from 0 to 32 (0px to 128px)

### Components
- **Buttons**: Primary, secondary, danger, disabled states with different sizes
- **Inputs**: Consistent styling with focus and error states
- **Cards**: Base, elevated, and flat variants
- **Text**: Heading and body text styles
- **Badges**: Status indicators for halal/haram states

## Usage

### Importing Styles
```typescript
// Import specific screen styles
import { homeScreenStyles } from '../styles/HomeScreen.styles';

// Import common styles
import { buttonStyles, textStyles } from '../styles/common';

// Import theme tokens
import { colors, typography, spacing } from '../styles/theme';
```

### Using Theme Tokens
```typescript
import { colors, spacing, borderRadius } from '../styles/theme';

const customStyle = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing[4],
    borderRadius: borderRadius.base,
  },
});
```

### Using Common Components
```typescript
import { buttonStyles, textStyles } from '../styles/common';

// Use predefined button styles
<TouchableOpacity style={buttonStyles.primary}>
  <Text style={buttonStyles.primaryText}>Click me</Text>
</TouchableOpacity>

// Use text styles
<Text style={textStyles.h1}>Main Heading</Text>
<Text style={textStyles.body}>Body text</Text>
```

## Benefits

1. **Consistency**: All screens use the same design tokens
2. **Maintainability**: Centralized styling makes updates easy
3. **Scalability**: Easy to add new screens and components
4. **Modern Design**: Clean, accessible, and visually appealing
5. **Type Safety**: TypeScript support for all style properties
6. **Performance**: Optimized for React Native with proper StyleSheet usage

## Future Enhancements

- Dark mode support
- Responsive design tokens
- Animation utilities
- Icon system integration
- Accessibility improvements
