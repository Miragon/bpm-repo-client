import {makeStyles} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import React from "react";
import Theme from "../../theme";
import Layout from "./Layout";


const useStyles = makeStyles(() => ({
    root: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
    }
}));


const App: React.FC = () => {
    const classes = useStyles();

    return (
        <ThemeProvider theme={Theme}>
                    <div className={classes.root}>
                        <CssBaseline/>
                        <Layout/>
                    </div>
        </ThemeProvider>
    );
};

export default App;
