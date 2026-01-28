# Thunderbolt Dispatch - Design System

This document describes the enhanced UI design system inspired by thunderbolt.ca, implementing a professional, modern look and feel across the entire application.

## Overview

The design system includes:
- Professional color palette with deep blues and vibrant greens
- Consistent typography system
- Reusable components
- Standardized spacing and shadows
- Background images and modern layouts

## Color Palette

### Primary Colors
- **Primary**: `#1e3a5f` - Deep professional blue (main brand color)
- **Primary Dark**: `#152945` - Darker variant
- **Primary Light**: `#2d5a8f` - Lighter variant

### Secondary Colors
- **Secondary**: `#10b981` - Vibrant green (accents and CTAs)
- **Secondary Dark**: `#059669`
- **Secondary Light**: `#34d399`

### Accent Colors
- **Accent**: `#f59e0b` - Gold/amber (highlights and warnings)
- **Accent Dark**: `#d97706`
- **Accent Light**: `#fbbf24`

### Status Colors
- **Pending**: `#f59e0b` (Orange/amber)
- **En Route**: `#3b82f6` (Blue)
- **Completed**: `#10b981` (Green)
- **Cancelled**: `#ef4444` (Red)

### Neutral Colors
- **Background**: `#f9fafb` - Light gray background
- **Surface**: `#ffffff` - White cards/surfaces
- **Text Primary**: `#111827` - Dark text
- **Text Secondary**: `#6b7280` - Medium gray text
- **Text Light**: `#9ca3af` - Light gray text

## Typography

### Font System
- Uses system fonts (System on iOS, Roboto on Android)
- Font weights: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)

### Type Scale
- **h1**: 32px, Bold - Main page titles
- **h2**: 24px, Bold - Section titles
- **h3**: 20px, Semibold - Subsection titles
- **h4**: 18px, Semibold - Card titles
- **body**: 16px, Regular - Standard text
- **bodySmall**: 14px, Regular - Secondary text
- **caption**: 12px, Regular - Smallest text
- **button**: 16px, Semibold - Button labels
- **label**: 14px, Medium - Form labels

## Spacing System

Consistent spacing scale:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

## Border Radius

- **sm**: 4px - Small elements
- **md**: 8px - Standard components
- **lg**: 12px - Cards
- **xl**: 16px - Large containers
- **full**: 9999px - Circular elements

## Shadows

Four elevation levels:
- **sm**: Light shadow for subtle depth
- **md**: Medium shadow for cards
- **lg**: Large shadow for elevated elements
- **xl**: Extra large shadow for modals/dialogs

## Components

### Button Component
Location: `frontend/src/components/Button.tsx`

**Variants**:
- `primary`: Solid blue button (default)
- `secondary`: Solid green button
- `outline`: Outlined button with transparent background
- `text`: Text-only button

**Sizes**:
- `small`: 36px height
- `medium`: 48px height (default)
- `large`: 56px height

**Props**:
- `title`: Button text
- `onPress`: Click handler
- `variant`: Button style variant
- `size`: Button size
- `disabled`: Disable state
- `loading`: Loading state with spinner

### TextInput Component
Location: `frontend/src/components/TextInput.tsx`

**Features**:
- Label support
- Error message display
- Consistent styling
- Placeholder color
- Multiline support

**Props**:
- `label`: Field label
- `error`: Error message
- `containerStyle`: Container style override
- All standard TextInput props

## Screens

### LoginScreen
**Features**:
- Background image with overlay
- Centered login form card
- Professional logo presentation
- Demo user information
- Thunderbolt tagline in footer

**Design Elements**:
- ImageBackground with landscaping imagery
- Semi-transparent overlay for readability
- White form card with shadow elevation
- Large thunderbolt emoji as logo

### DriverDashboard
**Features**:
- Colored header with gradient
- Statistics card showing daily jobs
- Job cards with status badges
- Expandable job information
- Professional card-based layout

**Design Elements**:
- Blue header with rounded bottom corners
- Color-coded status badges
- Shadow elevation for cards
- Icon-based information display

### AdminDashboard
**Features**:
- Stats grid with key metrics
- Quick action buttons
- Recent activity timeline
- Professional information display

**Design Elements**:
- Four-stat grid with colored indicators
- Icon-based quick actions
- Timeline with colored dots
- Branded info section at bottom

### OrderEntry
**Features**:
- Service type selection with cards
- Multi-section form layout
- Information boxes with tips
- Professional form design

**Design Elements**:
- Service type cards with icons
- Selectable cards with highlight state
- Info boxes with colored borders
- Clear section separation

### JobDetail
**Features**:
- Job information display
- Status update interface
- Action buttons (call, directions, notes)
- Activity timeline
- Professional information layout

**Design Elements**:
- Status badges with colors and icons
- Interactive status selection grid
- Timeline with progress indicators
- Multiple action buttons

## Background Images

The LoginScreen uses a background image from Unsplash:
- URL: `https://images.unsplash.com/photo-1621905252472-a1e2dc8f11e4?w=1200`
- Shows landscaping/construction equipment
- Applied with blur radius for readability
- Dark overlay for better contrast

**Note**: For production, replace with actual Thunderbolt.ca images or licensed stock photos.

## Inspiration from thunderbolt.ca

Design elements inspired by the Thunderbolt.ca website:
- **Color Scheme**: Professional blue/green palette matching landscaping industry
- **Typography**: Bold, impactful headings with clear hierarchy
- **Statistics Display**: Prominent numbers showcasing company achievements
- **Service Cards**: Visual representation of different service offerings
- **Professional Aesthetic**: Trust-building design emphasizing quality and experience
- **Tagline**: "Built on Dedication. Driven by Experience." incorporated throughout

## Usage

### Importing Theme
```typescript
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
```

### Using Components
```typescript
import Button from '../components/Button';
import TextInput from '../components/TextInput';

<Button 
  title="Submit" 
  onPress={handleSubmit} 
  variant="primary" 
  size="large" 
/>

<TextInput
  label="Name"
  placeholder="Enter your name"
  value={name}
  onChangeText={setName}
/>
```

## Future Enhancements

- Add custom fonts (e.g., Montserrat, Open Sans)
- Implement dark mode support
- Add animation library (Reanimated)
- Create more reusable components (Card, Badge, etc.)
- Add loading skeletons
- Implement responsive breakpoints
- Add accessibility features (ARIA labels, screen reader support)

## Testing

To test the enhanced UI:
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the app: `npm start` or `npx expo start`
4. Test all screens with different user types (admin, driver, customer)

## Maintenance

When updating the design system:
1. Update theme files in `frontend/src/theme/`
2. Update this documentation
3. Test all screens for consistency
4. Update components as needed
5. Commit changes with clear description
