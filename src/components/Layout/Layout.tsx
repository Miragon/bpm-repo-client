import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import RegisterNewUserScreen from "../../screens/RegisterNewUserScreen";
import { RootState } from "../../store/Store";
import { loadUserInfo } from "../../store/UserInfoState";
import { THEME } from "../../theme";
import Menu from "../Menu/Menu";
import ContentLayout from "./ContentLayout";
import Router from "./Router";

const useStyles = makeStyles((theme: Theme) => ({
    contentWrapper: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh",
        overflowY: "auto",
        backgroundColor: THEME.content.background
    }
}));

const Layout: React.FC = () => {
    const dispatch = useDispatch();

    const classes = useStyles();

    const userInfo = useSelector((state: RootState) => state.userInfo);

    useEffect(() => {
        dispatch(loadUserInfo());
    }, [dispatch]);

    if (userInfo.initialLoading) {
        return null;
    }

    // TODO: Backend should give more detailed information - how are we supposed to detect errors?
    if (userInfo.error) {
        return (
            <RegisterNewUserScreen />
        );
    }

    return (
        <>
            <Menu />
            <div className={classes.contentWrapper}>
                <Router />
                <ContentLayout>
                    <ToastContainer />
                </ContentLayout>
            </div>
        </>
    );
};

export default Layout;


