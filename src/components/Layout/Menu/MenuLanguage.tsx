import { makeStyles, Theme } from "@material-ui/core/styles";
import { TranslateOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React, { useState } from "react";
import { THEME } from "../../../theme";
import MenuPopup from "./MenuPopup";

const useStyles = makeStyles((theme: Theme) => ({
    menuItem: {
        display: "flex",
        flexDirection: "row",
        height: "80px",
        cursor: "pointer",
        "&:hover": {
            "&>div>svg": {
                fill: THEME.menu.hover.icon
            },
            "&>div>span": {
                color: THEME.menu.hover.text,
                fontWeight: 500
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
    menuItemActive: {
        "&>div>svg": {
            fill: `${THEME.menu.active.icon} !important`
        },
        "&>div>span": {
            color: `${THEME.menu.active.text} !important`,
            fontWeight: 500
        }
    },
    menuItemIcon: {
        fill: THEME.menu.inactive.icon,
        transition: theme.transitions.create("fill")
    },
    menuItemText: {
        marginTop: "0.5rem",
        color: THEME.menu.inactive.text,
        textTransform: "uppercase",
        fontSize: "0.6rem",
        fontWeight: 400,
        transition: theme.transitions.create("color")
    }
}));

interface Props {
    children: ((props: {
        close: () => void;
    }) => React.ReactNode);
}

const MenuAvatar: React.FC<Props> = props => {
    const classes = useStyles();

    const [menuAnchor, setMenuAnchor] = useState<HTMLDivElement>();

    return (
        <div
            onClick={e => setMenuAnchor(e.currentTarget)}
            className={clsx(classes.menuItem, !!menuAnchor && classes.menuItemActive)}>

            <div className={classes.menuItemContent}>
                <TranslateOutlined className={classes.menuItemIcon} />
                <span className={classes.menuItemText}>
                    Language
                </span>
            </div>

            <MenuPopup
                anchor={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}>
                {props.children}
            </MenuPopup>
        </div>
    );
};

export default MenuAvatar;
