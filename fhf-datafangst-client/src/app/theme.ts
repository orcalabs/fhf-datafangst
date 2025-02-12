import { nbNO } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

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

  interface PaletteColor {
    alt?: string;
  }

  interface SimplePaletteColorOptions {
    alt?: string;
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

const theme = createTheme(
  {
    typography: {
      ...fontStyle,
      h1: {
        fontWeight: fontStyle.fontWeightBold,
        fontSize: "3.25rem",
      },
      h2: {
        fontWeight: fontStyle.fontWeightBold,
        fontSize: "2.3rem",
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
        main: "#111C4E",
        light: "#404971",
        dark: "#0B1336",
        alt: "#373F62",
        contrastText: "#fff",
      },
      secondary: {
        main: "#5E9BAC",
        light: "#9BCEDE",
        dark: "#286477",
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
        main: "#FFB340",
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
        500: "rgba(0, 0, 0, 0.6)",
        600: "#BCC1CF",
        700: "#818799",
        // Grey (menu, unselected filter)
        A100: "#80888C",
        // Water color map
        A200: "#b5ced9",
        A400: "#3B8786",
        A700: "#A46200",
      },
      action: {
        selected: "#F1F3F8",
      },
      // divider: '#E0E3EB',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1600,
        lg: 1920,
        xl: 2560,
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
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "rgba(128, 136, 140, 1)",
            "--TextField-brandBorderHoverColor": "#4F9D95",
            "--TextField-brandBorderFocusedColor": "#6FB7AF",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&:before": {
              borderBottom: "1px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "1px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "1px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  },
  nbNO,
);

export default theme;
