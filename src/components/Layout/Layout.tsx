import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import Menu from "./Menu";
import Router from "./Router";

const useStyles = makeStyles(() => ({
    contentWrapper: {
        flexGrow: 1,
        display: "flex",
        paddingLeft: "65px"
    },
    content: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        maxHeight: "calc(100vh - 60px)",
        padding: "40px 16px",
        maxWidth: "1232px",
        margin: "0 auto"
    },
    loadingScreen: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        width: "100%",
        paddingTop: "40vh",
    },
    loadingCircle: {
        color: "green",
    }
}));

/**
 * Diese Komponente erzeugt das Layout auf oberster Ebene der Anwendung.
 * Es enthält sowohl das Menü als auch sämtlichen Inhalt der Anwendung.
 * Die primäre Aufgabe des Layouts ist die einheitliche Darstellung des
 * globalen Menüs sowie das Routing.
 *
 * Die Komponente bietet keine Anpassungsmöglichkeiten und besitzt
 * keine Parameter.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = (): any => {

    const classes = useStyles();

    //const [securityIsOn, setSecurityIsOn] = useState<boolean>(true);
    const [initializing, setInitializing] = useState<boolean>(false);
    const [initialized, setInitialized] = useState<boolean>(false);
    const {
        loginWithRedirect,
        isAuthenticated,
        isLoading,
        error,
        getAccessTokenSilently
    } = useAuth0();


    if (isLoading) {
        return (
            <div className={classes.loadingScreen}>
                <h1>Developer Platform it@M</h1>
                <CircularProgress className={classes.loadingCircle} />
            </div>
        );
    }

    if (error) {
        return <div>Oops... {error.message}</div>;
    }

    if (!isAuthenticated) {
        return loginWithRedirect();
    }

    if (!initialized) {
        if (!initializing) {
            setInitializing(true);
            getAccessTokenSilently().then((token) => {
                localStorage.setItem("oauth_token", "Bearer " + token)

            });
            setInitialized(true)
            setInitializing(false)
        }
        //return null;
    }


    return (
        <>
            <Menu />
            <div className={classes.contentWrapper}>
                <div className={classes.content}>
                    <Router />
                </div>
            </div>
        </>
    );
};

export default Layout;
