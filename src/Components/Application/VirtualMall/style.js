import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  pageContainer: {
    padding: '30px 20px',
  },

  headerWrapper: {
  textAlign: 'center',
  marginBottom: '32px',
},

headerTitle: {
  fontWeight: 700,
  fontSize: '2.5rem',
  color: '#1a237e', // deep indigo
  marginBottom: '8px',
},

subHeader: {
  fontWeight: 400,
  fontSize: '2.0rem',
  color: '#555',
  '& span': {
    color: '#1976d2',
    fontWeight: 600,
  },
},

headerDivider: {
  width: '80px',
  height: '4px',
  backgroundColor: '#1976d2',
  margin: '16px auto 0',
  borderRadius: '4px',
},

  mainTitle: {
    fontWeight: 700,
    marginBottom: '24px',
    textAlign: 'center',
  },

  cardBase: {
    borderRadius: 16,
    padding: '24px 16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
    textAlign: 'center',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    '&:hover': {
      //transform: 'translateY(-6px)',
      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.12)',
    },
  },

  activeCategoryCard: {
    border: '2px solid #4CAF50',
    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
  },

  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '8px',
    minHeight: '60px'
  },

  categoryTitle: {
    fontWeight: 600,
    fontSize: '1.3rem',
    marginBottom: '8px',
    color: '#333',
  },

  addStoreCard: {
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #F1F1F1 0%, #E4E4E4 100%)',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      //transform: 'translateY(-5px)',
    },
    '& svg': {
      fontSize: '3rem',
      color: '#1976d2',
      marginBottom: '12px',
      transition: 'transform 0.3s ease',
    },
    '&:hover svg': {
      transform: 'rotate(90deg)',
    },
    '& h5': {
      fontWeight: 600,
      fontSize: '1.2rem',
      color: '#444',
    },
  },

  updateButton: {
    background: '#1976d2',
    color: '#fff',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: 8,
    marginTop: '12px',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      background: '#1565c0',
      boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
    },
  },

  // Category Gradients
  fashionCategory: {
    background: 'linear-gradient(135deg, #DCE6F9 0%, #ADCDFE 100%)',
  },
  electronicsCategory: {
    background: 'linear-gradient(135deg, #DCF9F2 0%, #ADEFFE 100%)',
  },
  groceryCategory: {
    background: 'linear-gradient(135deg, #F9E3DC 0%, #FECAAD 100%)',
  },
  healthCategory: {
    background: 'linear-gradient(135deg, #CDFFD2 0%, #C2DDD8 100%)',
  },
  homeCategory: {
    background: 'linear-gradient(135deg, #F9F2E2 0%, #D9C9A8 100%)',
  },
  agricultureCategory: {
    background: 'linear-gradient(135deg, #E7F9DC 0%, #BFF2C1 100%)',
  },
}));

export default useStyles;
