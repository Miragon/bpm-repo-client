import {createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";

const theme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            primary: {
                dark: "#000000",
                main: "#333333",
                light: "#545454",
                contrastText: "rgba(255, 255, 255, 0.87)"
            },
            secondary: {
                dark: "#E5B700",
                main: "#FFCC00",
                light: "#FFD119",
                contrastText: "rgba(0, 0, 0, 0.87)"
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
