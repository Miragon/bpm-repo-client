import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
    drawerAppContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "64px",
        color: "white",
        justifyContent: "flex-start",
        margin: "0px 0",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)"
        }
    },
    drawerAppContainerActive: {
        backgroundColor: "rgba(255, 255, 255, 0.1) !important",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1) !important"
        }
    },
    drawerAppIcon: {
        marginLeft: "8px",
        marginRight: "0px",
        width: "32px",
        height: "32px",
        color: "white"
    },
    drawerAppIconActive: {
        color: theme.palette.secondary.main
    },
    drawerAppTitle: {
        color: "white",
        textTransform: "none",
        whiteSpace: "nowrap",
        fontSize: "1.1rem",
        textAlign: "left",
        marginLeft: "10px",
        top: "2px",
        fontWeight: 600
    },
    drawerAppTitleActive: {
        color: theme.palette.secondary.main
    },
    drawerAppDescription: {
        fontSize: "0.85rem",
        color: "white",
        textTransform: "none",
        wordWrap: "break-word",
        marginLeft: "10px",
        whiteSpace: "pre",
        textAlign: "left"
    },
    drawerAppDescriptionActive: {
        color: theme.palette.secondary.main,
        fontWeight: 400
    },
    drawerText: {
        color: "white",
        display: "flex",
        paddingRight: "16px",
        paddingLeft: "10px",
        flexDirection: "column"
    }
}));

interface Props {
    title: string;
    description?: string;
    icon: React.ElementType;
    active?: boolean;
    dense?: boolean;
    onClick?: () => void;
}

const DrawerApp: React.FC<Props> = props => {
    const classes = useStyles(props);

    return (
        <Button
            onClick={props.onClick}
            className={clsx(
                classes.drawerAppContainer,
                props.active && classes.drawerAppContainerActive
            )}>

            {React.createElement(props.icon, {
                className: clsx(
                    classes.drawerAppIcon,
                    props.active && classes.drawerAppIconActive
                )
            })}
            <div className={classes.drawerText}>
                <div className={clsx(classes.drawerAppTitle,
                    props.active && classes.drawerAppTitleActive)}>{props.title}</div>
                <div className={clsx(classes.drawerAppDescription,
                    props.active && classes.drawerAppDescriptionActive)}>{props.description}</div>
            </div>
        </Button>
    );
};
//            <div className={classes.drawerAppDescription}>{props.description}</div>
/*
 Removed - was in front of button close tag
 {props.description && (
 <div className={classes.drawerText}>
 {title}
 <Typography
 className={clsx(
 classes.drawerAppDescription,
 props.active && classes.drawerAppDescriptionActive
 )}
 variant="body2">
 {props.description}
 </Typography>
 </div>
 )}

 {!props.description && title}


 */
export default DrawerApp;
