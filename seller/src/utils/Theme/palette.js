import Theme from './theme.json';

const palette = {
    common: {
        black: '#000',
        white: '#fff',
        fontColor: Theme.fontColor,
        disableColor: Theme.disableColor,
    },
    text: {
        primary: '#e0e0e0',
        secondary: '#8888aa',
        success: Theme.successColor,
        disabled: '#555566',
    },
    primary: {
        main: Theme.primaryColor,
        light: Theme.primaryColorLight,
        dark: Theme.primaryColorDark,
        contrastText: Theme.primaryContrastTextColor,
    },
    secondary: {
        main: Theme.secondaryColor,
        light: Theme.secondaryColorLight,
        dark: Theme.secondaryColorDark,
        contrastText: Theme.secondaryContrastTextColor,
    },
    success: {
        main: Theme.successColor,
        light: Theme.successColorLight,
        dark: Theme.successColorDark,
        contrastText: Theme.successContrastTextColor,
    },
    warning: {
        main: Theme.warningColor,
        light: Theme.warningColorLight,
        dark: Theme.warningColorDark,
        contrastText: Theme.warningContrastTextColor,
    },
    error: {
        main: Theme.errorColor,
        light: Theme.errorColorLight,
        dark: Theme.errorColorDark,
        contrastText: Theme.errorContrastTextColor,
    },
    background: {
        default: '#0a0a0f',
        paper: "#12121a",
    },
    action: {
        disabled: Theme.disableColor,
        active: Theme.linkColor,
    },
    divider: Theme.divider
};

export default palette;