import { useAuth0 } from "@auth0/auth0-react";
import { Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    AccountCircle,
    BarChart,
    Book,
    Brush,
    Help,
    Home,
    PowerSettingsNew,
    Widgets
} from "@material-ui/icons";
import React, { useCallback, useRef, useState } from "react";
import MenuSpacer from "../../Menu/MenuSpacer";
import DrawerApp from "./AppMenu/DrawerApp";
//Drawerpaper: 84px breit
const useStyles = makeStyles((theme) => ({
    button: {
        textTransform: "none",
        fontFamily: "Arial",
        fontSize: "0.9rem",
        margin: "0 0.5rem",
        minWidth: 0,
        height: "28px",
        width: "28px",
        color: "white"
    },
    activeButton: {
        color: "black"
    },
    hiddenTitle: {
        display: "none"
    },
    drawerPaper: {
        boxShadow: theme.shadows[24],
        width: "65px",
        padding: "0px",
        background: theme.palette.primary.main,
        overflow: "hidden",
        transition: "width .3s",
        border: "none",
        "&:hover": {
            width: "400px"
        }
    },

    drawerBackdrop: {
        backgroundColor: "rgba(0, 0, 0, 0)"
    },
    drawerTitle: {
        margin: "2.5rem 13px 0 13px",
        fontSize: "1.5rem",
        fontWeight: 600,

    },
    drawerSubtitle: {
        margin: "0.5rem 13px 1.5rem 13px",
        fontSize: "1.2rem",
        fontWeight: 300
    },
    drawerContent: {
        marginTop: "44px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    }

}));

const AppMenu: React.FC = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(true);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const handleClose = useCallback((event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    }, []);

    const { logout, user } = useAuth0();

    return (
        <>


            <Drawer
                classes={{ paper: classes.drawerPaper }}
                variant="permanent"
                BackdropProps={{
                    className: classes.drawerBackdrop
                }}
                anchor="left"
                open={open}
                onClose={handleClose}>


                <div className={classes.drawerContent}>

                    <DrawerApp
                        active
                        title="Home"
                        onClick={() => window.open("/", "_self")}
                        icon={Home} />

                    <DrawerApp
                        title="Repositories"
                        onClick={() => window.open("/repositories", "_self")}
                        icon={Book} />

                    <DrawerApp
                        title="Modeler"
                        onClick={() => window.open("/modeler", "_self")}
                        icon={Brush} />

                    <DrawerApp
                        title="Building Blocks"
                        onClick={() => window.open("/blocks", "_self")}
                        icon={Widgets} />

                    <DrawerApp
                        title="FlowCov"
                        onClick={() => window.open("https://flowcov.miragon.cloud/", "_self")}
                        icon={BarChart} />

                    <MenuSpacer />

                    <DrawerApp
                        dense
                        title="Contact Support"
                        description="info@flowsquad.io"
                        icon={Help} />

                    <DrawerApp
                        dense
                        title="Your Account"
                        description={user.email}
                        icon={AccountCircle} />

                    <DrawerApp
                        dense
                        title="Sign Out"
                        onClick={logout}
                        icon={PowerSettingsNew} />

                </div>

            </Drawer>
        </>
    );
};

/*
 before drawercontent div:


 <Typography
 className={classes.drawerTitle}
 variant="h1">
 miragon.cloud
 </Typography>

 <Typography
 className={classes.drawerSubtitle}
 variant="h2">
 {user.email}
 </Typography>
 */

export default AppMenu;
