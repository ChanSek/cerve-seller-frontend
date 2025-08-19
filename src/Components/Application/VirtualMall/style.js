import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    homeContainer: {
        padding: '60px 100px',
    },
    activeCategoryCard: {
        border: '2px solid #4CAF50', // Green border for active stores
    },
    cardBase: {
        borderRadius: 8,
        padding: '24px 16px',
        boxShadow: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'space-between',
        textAlign: 'center',
        overflow: 'hidden', // contains image zoom effect
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        minHeight: '100px', // Added to reserve space for images and prevent layout shifts
        '& img': {
            maxHeight: '100px', // Increased image size
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
                transform: 'scale(1.1)',
            },
        },
    },
    categoryTitle: {
        // textShadow: '1px 1px 2px rgba(0,0,0,0.1)', // Subtle text shadow
        // letterSpacing: '0.5px', // Slightly increased letter spacing for emphasis
        // backgroundImage: 'linear-gradient(45deg, #FF6B6B, #FFD166, #06D6A0, #118AB2, #073B4C)', // Vibrant gradient
        // WebkitBackgroundClip: 'text', // Clip background to text for Webkit browsers
        // WebkitTextFillColor: 'transparent', // Make text transparent to show gradient
        // backgroundClip: 'text', // Clip background to text for other browsers
       // color: 'transparent', // Make text transparent for non-webkit browsers
    },
    fashionCategory: {
        background: 'linear-gradient(180deg, #DCE6F9 0%, #ADCDFE 100%)',
    },
    electronicsCategory: {
        background: 'linear-gradient(180deg, #DCF9F2 0%, #ADEFFE 100%)',
    },
    groceryCategory: {
        background: 'linear-gradient(180deg, #F9E3DC 0%, #FECAAD 100%)',
    },
    foodCategory: {
        background: 'linear-gradient(180deg, #FFE1C1 0%, #FED092 100%)',
    },
    healthCategory: {
        background: 'linear-gradient(180deg, #CDFFD2 0%, #C2DDD8 100%)',
    },
    homeCategory: {
        background: 'linear-gradient(180deg, #F9F2E2 0%, #D9C9A8 100%)',
    },
    bpcCategory: {
        background: 'linear-gradient(180deg, #F7DCF9 0%, #C7ADFE 100%)',
    },
    agricultureCategory: {
        background: 'linear-gradient(180deg, #E7F9DC 0%, #BFF2C1 100%)',
    },

    addButton: {
        '&:hover': {
           // background: '#45a049', // Slightly darker green on hover
            transform: 'none',
            boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)', // More pronounced shadow
        },
        '&:focus': {
            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.5)', // Green outline
            outline: 'none',
        },
        '&:active': {
            transform: 'none',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
        },
        '&:disabled': {
            background: '#a5d6a7', // Lighter green for disabled state
            cursor: 'not-allowed',
            transform: 'none',
            boxShadow: 'none',
        },
    },

    updateButton: {
        '&:hover': {
         //   background: '#1976D2', // Slightly darker blue on hover
            transform: 'none',
            boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)', // More pronounced shadow
        },
        '&:focus': {
            boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.5)', // Blue outline
            outline: 'none',
        },
        '&:active': {
            transform: 'none',
            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)',
        },
        '&:disabled': {
            background: '#90caf9', // Lighter blue for disabled state
            cursor: 'not-allowed',
            transform: 'none',
            boxShadow: 'none',
        },
    },

}));

export default useStyles;
