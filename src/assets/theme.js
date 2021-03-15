import { createMuiTheme } from '@material-ui/core/styles';

// Pick colors on https://material.io/resources/color/#!/

export const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      light: '#88ffff',
      main: '#4dd0e1',
      dark: '#028f9c',
      contrastText: '#000',
    },
    secondary: {
      light: '#ffff81',
      main: '#ffd54f',
      dark: '#c8a415',
      contrastText: '#000',
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#d5d5d5",
      A200: "#aaaaaa",
      A400: "#303030",
      A700: "#616161"
    },
    red: {
      light: '#fa2045',
      main: '#ed052d',
      dark: '#d6062a',
      contrastText: '#000',
    },
    ttl: {
      light: '#454545',
      main: '#303030',
      dark: '#121212',
      contrastText: '#000',
    }
  },
});