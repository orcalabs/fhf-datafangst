import { createTheme } from "@mui/material/styles";
import { nbNO } from "@mui/material/locale";

declare module "@mui/material/styles" {
  interface Palette {
    third: Palette["primary"];
    fourth: Palette["primary"];
    fifth: Palette["primary"];
  }
  interface PaletteOptions {
    third: PaletteOptions["primary"];
    fourth: PaletteOptions["primary"];
    fifth: PaletteOptions["primary"];
  }
}

export const fontStyle: any = {
  fontFamily: "'Poppins', sans-serif",
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
};
// Create a theme instance.
const theme = createTheme(
  {
    typography: {
      ...fontStyle,
      h1: {
        fontWeight: fontStyle.fontWeightBold,
        fontSize: "3.25rem",
      },
      h3: {
        fontWeight: fontStyle.fontWeightSemiBold,
        fontSize: "2.25rem",
        lineHeight: 1.167,
      },
      h4: {
        fontWeight: fontStyle.fontWeightMedium,
        lineHeight: 1,
        fontSize: "1.5rem",
      },
      h5: {
        fontWeight: fontStyle.fontWeightSemiBold,
        fontSize: "1.125rem",
      },
      h6: {
        fontWeight: fontStyle.fontWeightMedium,
        fontSize: "1.125rem",
      },
    },
    palette: {
      primary: {
        main: "#1A5E63",
        light: "#028090",
        dark: "#154B4F",
        contrastText: "#fff",
      },
      secondary: {
        main: "#498558",
        light: "#42634B",
        dark: "#0F3418",
      },
      third: {
        main: "#E81F76",
        light: "#d36e90",
        dark: "#7D133E",
      },
      fourth: {
        main: "#0071ce",
        light: "#80b8e7",
        dark: "#004075",
      },
      fifth: {
        main: "#f9a976",
        light: "#fcd4bb",
      },
      background: {
        default: "#fff",
      },
      text: {
        primary: "#000000",
        secondary: "#C2D7DF",
        disabled: "rgba(0, 0, 0, 0.38)",
      },
      grey: {
        50: "#F5F7FA",
        100: "#F1F3F8",
        200: "#E7EAF1",
        300: "#E0E3EB",
        400: "#CFD4E0",
        500: "#CFD4E0",
        600: "#BCC1CF",
        700: "#9EA4B5",
        // Blue
        A100: "#0071ce",
        // Light-light primary (filters, haulspopper)
        A200: "#474E6B",
        // Green used for filters
        A400: "#3B8786",
        // Red used for DeliveryPoints
        A700: "#A46200",
      },
      action: {
        selected: "#F1F3F8",
        // hover: '#F5F7FA',
      },
      // divider: '#E0E3EB',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1435,
        xl: 1920,
        // xxl: 2560,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {},
          outlined: {
            textTransform: "unset",
            fontWeight: 500,
          },
          contained: {
            boxShadow: "none",
            textTransform: "unset",
            fontWeight: 600,
          },
          containedPrimary: {
            color: "white",
          },
          containedSizeLarge: {
            fontSize: "0.875rem",
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            borderBottom: "none",
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          grouped: {
            width: "100%",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 0,
          },
        },
      },
    },
  },
  nbNO,
);

export default theme;
