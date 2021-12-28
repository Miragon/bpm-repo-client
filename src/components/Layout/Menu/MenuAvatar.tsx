import { Avatar } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ExitToAppOutlined, PersonOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "../../../theme";
import Popup from "../Common/Popup";
import MenuList, { MenuListConfig } from "../MenuList/MenuList";
import MenuListTitle from "../MenuList/MenuListTitle";

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
    },
    popup: {
        cursor: "default"
    },
    option: {
        minWidth: "180px"
    }
}));

interface Props {
    name: string | undefined;
}

const MenuAvatar: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [menuAnchor, setMenuAnchor] = useState<HTMLDivElement>();

    const options: MenuListConfig = useMemo(() => [[
        {
            label: t("menu.accountMenu.account"),
            value: "account",
            icon: PersonOutlined,
            className: classes.option
        },
        {
            label: t("menu.accountMenu.logout"),
            value: "logout",
            icon: ExitToAppOutlined,
            className: classes.option
        }
    ]], [t, classes]);

    const onAction = useCallback((action: string) => {
        console.log(action);
    }, []);

    return (
        <div
            onClick={e => setMenuAnchor(e.currentTarget)}
            className={clsx(classes.root, !!menuAnchor && classes.rootActive)}>

            <Avatar className={classes.avatar}>
                {props.name?.substr(0, 1) ?? "?"}
            </Avatar>
            <span className={classes.menuItemText}>
                Account
            </span>

            <Popup
                background="#FFFFFF"
                anchor={menuAnchor}
                className={classes.popup}
                onClose={() => setMenuAnchor(undefined)}
                placement="right-end"
                arrowInset={10}>
                {({ close }) => (
                    <MenuList
                        title={<MenuListTitle title={props.name || "Unbekannter Benutzer"} />}
                        options={options}
                        onClick={value => {
                            setTimeout(close);
                            onAction(value);
                        }} />
                )}
            </Popup>
        </div>
    );
};

export default MenuAvatar;
