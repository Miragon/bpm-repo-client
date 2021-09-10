import { blue } from "@material-ui/core/colors";
import {createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";

const theme = responsiveFontSizes(
    createMuiTheme({
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
