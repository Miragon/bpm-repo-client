import { makeStyles, Theme } from "@material-ui/core/styles";
import { Done, TranslateOutlined } from "@material-ui/icons";
import clsx from "clsx";
import i18next from "i18next";
import React, { useMemo, useState } from "react";
import { THEME } from "../../theme";
import Popup from "../Common/Popup";
import MenuList, { MenuListConfig } from "../MenuList/MenuList";
import MenuListTitle from "../MenuList/MenuListTitle";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({
    menuItem: {
        display: "flex",
        flexDirection: "row",
        height: "80px",
        cursor: "pointer",
        "&:hover": {
            "&>div>svg": {
                fill: THEME.navigation.hover.icon
            },
            "&>div>span": {
                color: THEME.navigation.hover.text,
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
            fill: `${THEME.navigation.active.icon} !important`
        },
        "&>div>span": {
            color: `${THEME.navigation.active.text} !important`,
            fontWeight: 500
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
    },
    option: {
        minWidth: "200px"
    },
    popup: {
        cursor: "default"
    }
}));

const MenuAvatar: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [menuAnchor, setMenuAnchor] = useState<HTMLDivElement>();
    const [activeLanguage, setActiveLanguage] = useState(
        localStorage.getItem("language") || "default"
    );

    const changeLanguage = async (languageKey: string) => {
        // Does not work without setTimeout
        setMenuAnchor(undefined);
        setActiveLanguage(languageKey);
        localStorage.setItem("language", languageKey);
        await i18next.changeLanguage(languageKey);
    };

    const options: MenuListConfig = useMemo(() => [[
        {
            label: "Deutsch",
            value: "custom",
            className: classes.option,
            right: activeLanguage === "custom" ? <Done /> : undefined
        },
        {
            label: "English",
            value: "default",
            className: classes.option,
            right: activeLanguage === "default" ? <Done /> : undefined
        }
    ]], [activeLanguage, classes]);

    return (
        <div
            onClick={e => setMenuAnchor(e.currentTarget)}
            className={clsx(classes.menuItem, !!menuAnchor && classes.menuItemActive)}>

            <div className={classes.menuItemContent}>
                <TranslateOutlined className={classes.menuItemIcon} />
                <span className={classes.menuItemText}>
                    {t("menu.language")}
                </span>
            </div>

            <Popup
                background="#FFFFFF"
                anchor={menuAnchor}
                className={classes.popup}
                onClose={() => setMenuAnchor(undefined)}
                placement="right-end"
                arrowInset={10}>
                {({ close }) => (
                    <MenuList
                        title={<MenuListTitle title="Choose Language" />}
                        options={options}
                        onClick={value => {
                            setTimeout(close);
                            changeLanguage(value);
                        }} />
                )}
            </Popup>
        </div>
    );
};

export default MenuAvatar;
