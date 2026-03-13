// AddProductDialog.styles.js

import { styled } from '@mui/system';
import { Box, Typography, Button, IconButton } from "@mui/material";

// Styled TabPanel for consistent internal padding and appearance
export const StyledTabPanel = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
}));

// Styled Box for the Variant Section
export const VariantSectionBox = styled(Box)(({ theme }) => ({
    border: '1px solid #e0e0e0',
    borderRadius: theme.shape.borderRadius, // Use theme's border radius for consistency
    padding: theme.spacing(3), // Increased padding for more space
    marginBottom: theme.spacing(3), // Increased margin-bottom for better separation between variants
    position: 'relative',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)', // More pronounced shadow
    backgroundColor: theme.palette.background.paper, // Use theme's paper background
    transition: 'box-shadow 0.3s ease-in-out', // Smooth transition on hover
    '&:hover': {
        boxShadow: '0 6px 15px rgba(0,0,0,0.12)', // Slightly lift on hover
    }
}));

// Function to return common sx prop styles
export const getAddProductDialogStyles = (theme) => ({
    dialogPaper: {
        borderRadius: 2,
    },
    dialogTitle: {
        m: 0,
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
    },
    dialogTitleText: {
        fontWeight: 'bold',
        color: 'primary.main',
    },
    closeButton: {
        color: theme.palette.grey[500],
        '&:hover': {
            color: theme.palette.error.main,
        },
    },
    dialogContent: {
        p: 0, // p:0 here to allow StyledTabPanel to control padding
    },
    searchVariantSection: {
        p: 3,
        pb: 2,
        bgcolor: 'background.default',
    },
    autocompleteTextField: {
        mb: 2, // Added margin-bottom
    },
    formControlLabel: {
        mb: 2, // Added margin-bottom
    },
    divider: {
        mt: 2,
    },
    tabsBox: {
        // No borderBottom here as the search section has a divider
        borderColor: 'divider',
    },
    productDetailsGridContainer: {
        spacing: 3, // Increased spacing for better separation
    },
    showAllFieldsButtonBox: {
        mt: 3, // Increased margin-top
        textAlign: 'center',
    },
    noVariantsBox: {
        textAlign: 'center',
        p: 4,
        border: '2px dashed', // Use theme color for dashed border
        borderColor: theme.palette.grey[400],
        borderRadius: 2,
        bgcolor: theme.palette.grey[50], // Lighter background for empty state
    },
    addVariantButton: {
        mt: 3, // Increased margin-top
    },
    dialogActions: {
        p: 2.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        justifyContent: 'flex-end',
    },
    actionButton: {
        minWidth: 100,
    },
    variantTitle: {
        mb: 2,
        fontWeight: 'bold',
        color: 'primary.dark',
    },
    variantRemoveButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        color: 'error.main',
        '&:hover': {
            backgroundColor: 'error.light',
            color: 'white',
            transform: 'rotate(90deg)', // Little animation
        },
        transition: 'transform 0.2s ease-in-out',
    },
});