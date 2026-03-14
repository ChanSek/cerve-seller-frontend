import { createTheme } from '@mui/material/styles';
import palette from './palette';

const theme = createTheme({
    palette: {
        mode: 'dark',
        ...palette,
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                popper: {
                    zIndex: 11111,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    '&::placeholder': {
                        fontSize: 14,
                        fontWeight: 400,
                    },
                },
            },
        },
    },
});

export default theme;
