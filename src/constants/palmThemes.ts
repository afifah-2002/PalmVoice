export type Theme = 'Dark Blue' | 'Blue' | 'Lavender' | 'Pink' | 'Beige';

export interface PalmTheme {
  // Screen colors
  screenBackground: string;
  screenBorder: string;
  
  // Header colors
  headerBackground: string;
  headerBorder: string;
  headerText: string;
  
  // Grid/Box colors
  gridBoxBackground: string;
  gridBoxBorder: string;
  gridBoxOverlay: string;
  
  // Icon colors
  iconCircleBackground: string;
  iconCircleBorder: string;
  iconText: string;
  
  // Empty slot colors
  emptySlotBackground: string;
  emptySlotBorder: string;
  emptySlotText: string;
  
  // Graffiti area colors
  graffitiBackground: string;
  graffitiBorder: string;
  graffitiLabel: string;
  graffitiCursor: string;
  
  // Side icon colors
  sideIconBackground: string;
  sideIconBorder: string;
  
  // Modal colors
  modalBackground: string;
  modalHeaderBackground: string;
  modalBorder: string;
  modalHeaderBorder: string;
  modalText: string;
  
  // Dropdown colors
  dropdownBackground: string;
  dropdownBorder: string;
  dropdownActiveBackground: string;
  dropdownItemBorder: string;
  dropdownText: string;
}

export const PALM_THEMES: Record<Theme, PalmTheme> = {
  'Dark Blue': {
    screenBackground: '#4A6FA5', // Dark blue screen
    screenBorder: '#505050',
    headerBackground: '#3A5F8F', // Darker blue header
    headerBorder: '#2A4F7F',
    headerText: '#0A1F3F', // Very dark blue text
    gridBoxBackground: '#4A6FA5',
    gridBoxBorder: '#1A2F5F',
    gridBoxOverlay: 'rgba(10, 31, 63, 0.05)',
    iconCircleBackground: '#0A1F3F',
    iconCircleBorder: '#050F1F',
    iconText: '#0A1F3F',
    emptySlotBackground: '#6A8FC5',
    emptySlotBorder: '#4A6FA5',
    emptySlotText: '#0A1F3F',
    graffitiBackground: '#4A6FA5',
    graffitiBorder: '#2A4F7F',
    graffitiLabel: '#2A4F7F',
    graffitiCursor: '#0A1F3F',
    sideIconBackground: '#2A3F5F',
    sideIconBorder: '#0A1F3F',
    modalBackground: '#4A6FA5',
    modalHeaderBackground: '#3A5F8F',
    modalBorder: '#0A1F3F',
    modalHeaderBorder: '#2A4F7F',
    modalText: '#0A1F3F',
    dropdownBackground: '#4A6FA5',
    dropdownBorder: '#0A1F3F',
    dropdownActiveBackground: '#3A5F8F',
    dropdownItemBorder: '#2A4F7F',
    dropdownText: '#0A1F3F',
  },
  'Blue': {
    screenBackground: '#6BA3D4', // Bright blue screen
    screenBorder: '#505050',
    headerBackground: '#5B93C4', // Medium blue header
    headerBorder: '#4B83B4',
    headerText: '#1A3F6F', // Dark blue text
    gridBoxBackground: '#6BA3D4',
    gridBoxBorder: '#2A5F9F',
    gridBoxOverlay: 'rgba(26, 63, 111, 0.05)',
    iconCircleBackground: '#1A3F6F',
    iconCircleBorder: '#0A2F5F',
    iconText: '#1A3F6F',
    emptySlotBackground: '#8BC3E4',
    emptySlotBorder: '#6BA3D4',
    emptySlotText: '#1A3F6F',
    graffitiBackground: '#6BA3D4',
    graffitiBorder: '#4B83B4',
    graffitiLabel: '#4B83B4',
    graffitiCursor: '#1A3F6F',
    sideIconBackground: '#3A6F9F',
    sideIconBorder: '#1A3F6F',
    modalBackground: '#6BA3D4',
    modalHeaderBackground: '#5B93C4',
    modalBorder: '#1A3F6F',
    modalHeaderBorder: '#4B83B4',
    modalText: '#1A3F6F',
    dropdownBackground: '#6BA3D4',
    dropdownBorder: '#1A3F6F',
    dropdownActiveBackground: '#5B93C4',
    dropdownItemBorder: '#4B83B4',
    dropdownText: '#1A3F6F',
  },
  'Lavender': {
    screenBackground: '#B8A5D4', // Lavender screen
    screenBorder: '#505050',
    headerBackground: '#A895C4', // Medium lavender header
    headerBorder: '#9885B4',
    headerText: '#4A2F6F', // Dark purple text
    gridBoxBackground: '#B8A5D4',
    gridBoxBorder: '#6A4F9F',
    gridBoxOverlay: 'rgba(74, 47, 111, 0.05)',
    iconCircleBackground: '#4A2F6F',
    iconCircleBorder: '#3A1F5F',
    iconText: '#4A2F6F',
    emptySlotBackground: '#D8C5E4',
    emptySlotBorder: '#B8A5D4',
    emptySlotText: '#4A2F6F',
    graffitiBackground: '#B8A5D4',
    graffitiBorder: '#9885B4',
    graffitiLabel: '#9885B4',
    graffitiCursor: '#4A2F6F',
    sideIconBackground: '#8A75A4',
    sideIconBorder: '#4A2F6F',
    modalBackground: '#B8A5D4',
    modalHeaderBackground: '#A895C4',
    modalBorder: '#4A2F6F',
    modalHeaderBorder: '#9885B4',
    modalText: '#4A2F6F',
    dropdownBackground: '#B8A5D4',
    dropdownBorder: '#4A2F6F',
    dropdownActiveBackground: '#A895C4',
    dropdownItemBorder: '#9885B4',
    dropdownText: '#4A2F6F',
  },
  'Pink': {
    screenBackground: '#E4A5C4', // Pink screen
    screenBorder: '#505050',
    headerBackground: '#D495B4', // Medium pink header
    headerBorder: '#C485A4',
    headerText: '#6F2F4F', // Dark pink text
    gridBoxBackground: '#E4A5C4',
    gridBoxBorder: '#9F4F7F',
    gridBoxOverlay: 'rgba(111, 47, 79, 0.05)',
    iconCircleBackground: '#6F2F4F',
    iconCircleBorder: '#5F1F3F',
    iconText: '#6F2F4F',
    emptySlotBackground: '#F4B5D4',
    emptySlotBorder: '#E4A5C4',
    emptySlotText: '#6F2F4F',
    graffitiBackground: '#E4A5C4',
    graffitiBorder: '#C485A4',
    graffitiLabel: '#C485A4',
    graffitiCursor: '#6F2F4F',
    sideIconBackground: '#B47594',
    sideIconBorder: '#6F2F4F',
    modalBackground: '#E4A5C4',
    modalHeaderBackground: '#D495B4',
    modalBorder: '#6F2F4F',
    modalHeaderBorder: '#C485A4',
    modalText: '#6F2F4F',
    dropdownBackground: '#E4A5C4',
    dropdownBorder: '#6F2F4F',
    dropdownActiveBackground: '#D495B4',
    dropdownItemBorder: '#C485A4',
    dropdownText: '#6F2F4F',
  },
  'Beige': {
    screenBackground: '#D4C4A5', // Beige screen
    screenBorder: '#505050',
    headerBackground: '#C4B495', // Medium beige header
    headerBorder: '#B4A485',
    headerText: '#6F5F2F', // Dark beige/brown text
    gridBoxBackground: '#D4C4A5',
    gridBoxBorder: '#9F8F5F',
    gridBoxOverlay: 'rgba(111, 95, 47, 0.05)',
    iconCircleBackground: '#6F5F2F',
    iconCircleBorder: '#5F4F1F',
    iconText: '#6F5F2F',
    emptySlotBackground: '#E4D4B5',
    emptySlotBorder: '#D4C4A5',
    emptySlotText: '#6F5F2F',
    graffitiBackground: '#D4C4A5',
    graffitiBorder: '#B4A485',
    graffitiLabel: '#B4A485',
    graffitiCursor: '#6F5F2F',
    sideIconBackground: '#A49575',
    sideIconBorder: '#6F5F2F',
    modalBackground: '#D4C4A5',
    modalHeaderBackground: '#C4B495',
    modalBorder: '#6F5F2F',
    modalHeaderBorder: '#B4A485',
    modalText: '#6F5F2F',
    dropdownBackground: '#D4C4A5',
    dropdownBorder: '#6F5F2F',
    dropdownActiveBackground: '#C4B495',
    dropdownItemBorder: '#B4A485',
    dropdownText: '#6F5F2F',
  },
};

