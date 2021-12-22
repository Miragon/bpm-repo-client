import { Avatar } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useState } from "react";
import { THEME } from "../../../theme";
import MenuPopup from "./MenuPopup";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "80px",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        "&:hover>div:first-child": {
            backgroundColor: THEME.navigation.avatar.hover.background,
            color: THEME.navigation.avatar.hover.text
        },
        "&:hover>span": {
            color: THEME.navigation.hover.text,
            fontWeight: 500
        }
    },
    rootActive: {
        "&>div:first-child": {
            backgroundColor: THEME.navigation.avatar.hover.background,
            color: THEME.navigation.avatar.hover.text
        },
        "&>span": {
            color: THEME.navigation.hover.text,
            fontWeight: 500
        }
    },
    avatar: {
        textTransform: "uppercase",
        backgroundColor: THEME.navigation.avatar.default.background,
        color: THEME.navigation.avatar.default.text,
        transition: theme.transitions.create(["background-color", "color"])
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
    name: string | undefined;
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
            className={clsx(classes.root, !!menuAnchor && classes.rootActive)}>
            <Avatar className={classes.avatar}>
                {props.name?.substr(0, 1) ?? "?"}
            </Avatar>
            <MenuPopup
                anchor={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}>
                {props.children}
            </MenuPopup>
            <span className={classes.menuItemText}>
                Account
            </span>
        </div>
    );
};

export default MenuAvatar;
