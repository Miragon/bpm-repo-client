import { useAuth0 } from "@auth0/auth0-react";
import { Button, Drawer, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    AccountCircle,
    Add,
    Apartment,
    Apps,
    BarChart,
    Brush,
    Help,
    PowerSettingsNew,
    Widgets
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import MenuSpacer from "../../Menu/MenuSpacer";
import DrawerApp from "./AppMenu/DrawerApp";
import DrawerDivider from "./AppMenu/DrawerDivider";

const useStyles = makeStyles(() => ({
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
    drawerPaper: {
        width: "84px",
        padding: "0px"

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
        padding: "13px",
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
                variant={"permanent"}
                BackdropProps={{
                    className: classes.drawerBackdrop
                }}
                anchor="left"
                open={open}
                onClose={handleClose}>




                <div className={classes.drawerContent}>

                    <DrawerApp
                        title="Building Blocks"
                        onClick={() => window.open("https://modeler.miragon.cloud/", "_self")}
                        description="View, create, and edit BPMN and DMN models, save them in
                            the cloud, or download them onto your local computer."
                        icon={Brush} />
                    <DrawerApp title="New Diagram"
                               onClick={() => window.open("https://modeler.miragon.cloud/", "_blank")}
                               description="Create a new BPMN diagram"
                               icon={Add} />

                    <DrawerApp
                        title="FlowCov"
                        onClick={() => window.open("https://flowcov.miragon.cloud/", "_self")}
                        description="Improve your workflow and decision models by testing them
                            and tracking coverage across all your processes."
                        icon={BarChart} />

                    <DrawerApp
                        active
                        title="Diagrams"
                        onClick={() => setOpen(false)}
                        description="Create element templates to define shared building blocks
                            that are reused across all your processes."
                        icon={Widgets} />

                    <MenuSpacer />

                    <DrawerApp
                        dense
                        title="Contact Support"
                        description="info@flowsquad.io"
                        icon={Help} />

                    <DrawerDivider />

                    <DrawerApp
                        dense
                        title="Your Account"
                        description={user.email}
                        icon={AccountCircle} />

                    <DrawerApp
                        title="Your Organization"
                        icon={Apartment} />

                    <DrawerDivider />

                    <DrawerApp
                        dense
                        title="Sign Out"
                        description={user.email}
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
