import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { NavLink } from "react-router-dom";
import { THEME } from "../../../theme";

const useStyles = makeStyles((theme: Theme) => ({
    menuItem: {
        display: "flex",
        flexDirection: "row",
        height: "80px",
        textDecoration: "none",
        "&:hover": {
            "&>div>svg": {
                fill: THEME.navigation.hover.icon
            },
            "&>div>span": {
                color: THEME.navigation.hover.text,
                fontWeight: 500
            },
            "&>div:last-child": {
                backgroundColor: THEME.navigation.hover.border
            }
        }
    },
    menuItemContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1
    },
    menuItemBorder: {
        height: "calc(100% - 2rem)",
        width: "3px",
        margin: "1rem 0",
        backgroundColor: THEME.navigation.inactive.border,
        transition: theme.transitions.create("background-color")
    },
    menuItemActive: {
        "&>div>svg": {
            fill: `${THEME.navigation.active.icon} !important`
        },
        "&>div>span": {
            color: `${THEME.navigation.active.text} !important`,
            fontWeight: 500
        },
        "&>div:last-child": {
            backgroundColor: `${THEME.navigation.active.border} !important`
        }
    },
    menuItemIcon: {
        fill: THEME.navigation.inactive.icon,
        transition: theme.transitions.create("fill")
    },
    menuItemText: {
        marginTop: "0.5rem",
        color: THEME.navigation.inactive.text,
        textTransform: "uppercase",
        fontSize: "0.6rem",
        fontWeight: 400,
        transition: theme.transitions.create("color")
    }
}));

interface Props {
    href: string;
    text: string;
    icon: React.ElementType;
    exact?: boolean;
}

const MenuItem: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <NavLink
            exact={props.exact}
            to={props.href}
            activeClassName={classes.menuItemActive}
            className={classes.menuItem}>
            <div className={classes.menuItemContent}>
                {React.createElement(props.icon, {
                    className: classes.menuItemIcon
                })}
                <span className={classes.menuItemText}>
                    {props.text}
                </span>
            </div>
            <div className={classes.menuItemBorder} />
        </NavLink>
    );
};

export default MenuItem;
