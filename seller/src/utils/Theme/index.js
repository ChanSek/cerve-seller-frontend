import { createTheme } from '@mui/material/styles';
import palette from './palette';

const theme = createTheme({
    palette: {
        mode: 'dark',
        ...palette,
    },
});

export default theme;
