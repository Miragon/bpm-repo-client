import {makeStyles} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ToastContainer} from "react-toastify";
import {ArtifactApi, UserApi} from "../../api";
import helpers from "../../util/helperFunctions";
import RegisterNewUserScreen from "../../screens/RegisterNewUserScreen";
import {CURRENT_USER_INFO, FILETYPES} from "../../constants/Constants";
import Menu from "./Menu";
import Router from "./Router";

const useStyles = makeStyles((theme: Theme) => ({
    contentWrapper: {
        flexGrow: 1,
        display: "flex",
        paddingLeft: "32px",
        transition: theme.transitions.create("margin")
    },
    contentWrapperShift: {
        marginLeft: "350px"
    },
    content: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        maxHeight: "calc(100vh - 60px)",
        padding: "20px 25px",
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
 * Die primäre Aufgabe des Layouts ist die einheitliche
 * Darstellung des globalen Menüs sowie das Routing.
 *
 * Die Komponente bietet keine Anpassungsmöglichkeiten und besitzt
 * keine Parameter.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = (): any => {
    const [open, setOpen] = useState(true);
    const dispatch = useDispatch();


    const classes = useStyles();
    const [userController] = useState<UserApi>(new UserApi());

    const [userDoesExist, setUserDoesExist] = useState<boolean | undefined>(undefined);
    const [fileConfigFetched, setFileConfigFetched] = useState<boolean>(false);

    useEffect(() => {
        const config = helpers.getClientConfig();
        userController.getUserInfo(config)
            .then(response => {
                if (response.data) {
                    setUserDoesExist(true);
                    dispatch({type: CURRENT_USER_INFO, currentUserInfo: response.data});


                } else {
                    setUserDoesExist(false);
                }
            })
            .catch(() => setUserDoesExist(false));
    }, [userController, dispatch]);


    const [artifactController] = useState<ArtifactApi>(new ArtifactApi());

    useEffect(() => {
        if(!fileConfigFetched){
            const config = helpers.getClientConfig();
            artifactController.getAllFileTypes(config).then(response2 => {
                if(response2.data){
                    dispatch({type: FILETYPES, fileTypes: response2.data});
                    setFileConfigFetched(true);
                }
            })

        }
    }, [artifactController, dispatch, fileConfigFetched])



    if (userDoesExist === undefined) {
        return null;
    }

    if (!userDoesExist) {
        return <RegisterNewUserScreen/>;
    }


    return (
        <>
            <Menu
                open={open}
                setOpen={setOpen}/>
            <div className={clsx(
                open && classes.contentWrapperShift,
                classes.contentWrapper
            )}>
                <div className={classes.content}>
                    <Router/>
                    <ToastContainer/>
                </div>
            </div>
        </>
    );
};

export default Layout;
