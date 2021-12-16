import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ArtifactApi, UserApi } from "../../api";
import { CURRENT_USER_INFO, FILETYPES } from "../../constants/Constants";
import RegisterNewUserScreen from "../../screens/RegisterNewUserScreen";
import Menu from "./Menu";
import Router from "./Router";
import { getClientConfig } from "../../api/config";

const useStyles = makeStyles((theme: Theme) => ({
    contentWrapper: {
        flexGrow: 1,
        display: "flex",
        maxHeight: "calc(100vh - 60px)",
        overflowY: "auto"
    },
    content: {
        display: "flex",
        flexGrow: 1,
        padding: "2rem 0",
        flexDirection: "column",
        maxWidth: "1200px",
        margin: "0 auto"
    }
}));

const Layout: React.FC = () => {
    const dispatch = useDispatch();

    const classes = useStyles();

    const [userDoesExist, setUserDoesExist] = useState<boolean>();
    const [fileConfigFetched, setFileConfigFetched] = useState(false);

    useEffect(() => {
        const config = getClientConfig();
        new UserApi().getUserInfo(config)
            .then(response => {
                if (response.data) {
                    setUserDoesExist(true);
                    dispatch({ type: CURRENT_USER_INFO, currentUserInfo: response.data });
                } else {
                    setUserDoesExist(false);
                }
            })
            .catch(() => setUserDoesExist(false));
    }, [dispatch]);

    useEffect(() => {
        if (!fileConfigFetched) {
            const config = getClientConfig();
            new ArtifactApi().getAllFileTypes(config).then(response => {
                if (response.data) {
                    dispatch({ type: FILETYPES, fileTypes: response.data });
                    setFileConfigFetched(true);
                }
            });
        }
    }, [dispatch, fileConfigFetched]);

    if (userDoesExist === undefined) {
        return null;
    }

    if (!userDoesExist) {
        return <RegisterNewUserScreen />;
    }

    return (
        <>
            <Menu />
            <div className={classes.contentWrapper}>
                <div className={classes.content}>
                    <Router />
                    <ToastContainer />
                </div>
            </div>
        </>
    );
};

export default Layout;
