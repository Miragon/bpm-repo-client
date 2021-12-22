import { blue, blueGrey, lightBlue } from "@material-ui/core/colors";
import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

export const THEME = {
    navigation: {
        background: "white",
        divider: blueGrey[200],
        icon: blueGrey[500],
        text: "rgba(0, 0, 0, 0.87)",
        active: {
            icon: lightBlue[500],
            text: "rgba(0, 0, 0, 0.87)",
            border: lightBlue[500]
        },
        hover: {
            icon: lightBlue[300],
            text: "rgba(0, 0, 0, 0.87)",
            border: "transparent"
        },
        inactive: {
            icon: blueGrey[200],
            text: "rgba(0, 0, 0, 0.38)",
            border: "transparent"
        },
        avatar: {
            default: {
                background: blueGrey[200],
                text: "rgba(255, 255, 255, 0.87)"
            },
            hover: {
                background: blueGrey[500],
                text: "rgba(255, 255, 255, 0.87)"
            }
        }
    },
    menu: {
        icon: lightBlue[500],
        divider: `${blueGrey[200]}88`,
    },
    content: {
        background: "rgb(241, 247, 252)",
        primary: lightBlue[500]
    },
    pageHeader: {
        text: `${blueGrey[900]}EE`,
        icon: lightBlue[500],
        divider: `${blueGrey[200]}88`,
        action: {
            default: {
                default: blueGrey[200],
                hover: lightBlue[500],
                active: lightBlue[500]
            },
            primary: {
                default: lightBlue[500],
                hover: lightBlue[500],
                active: lightBlue[500]
            }
        }
    },
    avatar: {
        background: [
            "rgb(7, 141, 238)",
            "rgb(160, 81, 184)",
            "rgb(255, 105, 74)",
            "rgb(247, 176, 0)",
            "rgb(52, 216, 112)"
        ],
        text: "rgba(255, 255, 255, 0.87)"
    },
    tooltip: {
        background: "#000000",
        text: "rgba(255, 255, 255, 0.87)",
        fontSize: "0.8rem"
    }
};

const theme = responsiveFontSizes(
    createTheme({
        overrides: {
            MuiTooltip: {
                tooltip: {
                    fontSize: ".9rem",
                    color: "white",
                    backgroundColor: "grey"
                }
            }
        },
        palette: {
            primary: {
                dark: "#000000",
                main: "#333333",
                light: "#545454",
                contrastText: "#FFFFFF"
            },
            secondary: {
                dark: blue[700],
                main: blue[500],
                light: blue[300],
                contrastText: "#FFF"
            },
            error: {
                main: "#D32F2F"
            },
            success: {
                main: "#388E3C"
            },
            info: {
                main: "#448AFF"
            },
            warning: {
                main: "#F57C00"
            },
            text: {
                primary: "rgba(0, 0, 0, 0.87)",
                secondary: "rgba(0, 0, 0, 0.60)",
                hint: "rgba(0, 0, 0, 0.60)",
                disabled: "rgba(0, 0, 0, 0.38)"
            },
            divider: "#E1E4E8",
            background: {
                default: "#FFFFFF",
                paper: "#F6F8FA"
            },
            type: "light"
        }
    })
);

export default theme;
