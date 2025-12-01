# Shop Layout Simplification

## Overview
Removed BUNDLES category and changed shop categories to vertical stack layout.

## Layout Changes

**Before:**
- 2×2 grid (THEMES, PETS, ITEMS, BUNDLES)
- Horizontal wrap layout

**After:**
- Vertical stack (THEMES, PETS, ITEMS)
- One button per row
- BUNDLES removed

## Category Buttons

**Styling:**
- Width: 100% (full width)
- Height: 60px
- Gap: 12px between buttons
- Layout: Column (flexDirection: 'column')
- Pixelated 3D borders
- Theme-aware colors

**Order (Top to Bottom):**
1. THEMES
2. PETS
3. ITEMS

## Reasoning
- Simpler navigation
- Clearer hierarchy
- Bundles not needed for MVP
- More space for each button