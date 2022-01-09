import {
    amber,
    blue,
    blueGrey,
    brown,
    cyan,
    deepPurple,
    green,
    grey,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    pink,
    purple,
    red,
    teal
} from "@material-ui/core/colors";
import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

const avatarIndex = 500;
const avatarIndexDark = 800;

export const THEME = {
    dialog: {
        text: `${blueGrey[900]}EE`,
        icon: {
            danger: {
                background: red[600]
            }
        }
    },
    navigation: {
        background: "white",
        divider: blueGrey[200],
        icon: blueGrey[500],
        text: "rgba(0, 0, 0, 0.87)",
        active: {
            icon: lightBlue[500],
            text: "rgba(0, 0, 0, 1)",
            border: lightBlue[500]
        },
        hover: {
            icon: lightBlue[500],
            text: "rgba(0, 0, 0, 1)",
            border: "transparent"
        },
        inactive: {
            icon: blueGrey[200],
            text: "rgba(0, 0, 0, 0.75)",
            border: "transparent"
        },
        avatar: {
            default: {
                background: blueGrey[300],
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
        default: blueGrey[200],
        primary: lightBlue[500],
        secondary: blueGrey[500],
        backgroundSecondary: blueGrey[50]
    },
    pageHeader: {
        text: `${blueGrey[900]}EE`,
        icon: lightBlue[500],
        divider: `${blueGrey[200]}88`,
        breadcrumb: {
            text: `${blueGrey[900]}EE`,
            separator: `${blueGrey[500]}EE`
        },
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
            red[avatarIndex],
            pink[avatarIndex],
            purple[avatarIndex],
            deepPurple[avatarIndex],
            indigo[avatarIndex],
            blue[avatarIndex],
            lightBlue[avatarIndex],
            cyan[avatarIndex],
            teal[avatarIndex],
            green[avatarIndex],
            lightGreen[avatarIndex],
            lime[avatarIndexDark],
            amber[avatarIndexDark],
            orange[avatarIndex],
            brown[avatarIndex],
            grey[avatarIndex],
            blueGrey[avatarIndex]
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
