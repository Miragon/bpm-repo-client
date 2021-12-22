import { MenuList } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
    FolderOutlined,
    HomeOutlined,
    ScheduleOutlined,
    SettingsOutlined,
    StarOutlineOutlined
} from "@material-ui/icons";
import i18next from "i18next";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Flag from "react-world-flags";
import { RootState } from "../../../store/reducers/rootReducer";
import { THEME } from "../../../theme";
import DropdownButton, { DropdownButtonItem } from "../../Shared/Form/DropdownButton";
import Identity from "../../Shared/Identity";
import MenuBar from "../MenuBar";
import MenuAvatar from "./MenuAvatar";
import MenuItem from "./MenuItem";
import MenuSpacer from "./MenuSpacer";

const useStyles = makeStyles((theme: Theme) => ({
    menuBar: {
        display: "flex",
        height: "100vh",
        backgroundColor: THEME.menu.background,
        flexDirection: "column",
        width: "96px",
        padding: "4rem 0 1rem 0"
    },
    menu: {
        display: "none"
    },
    menuContent: {
        flexGrow: 1,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    flagIcon: {
        height: "25px",
        width: "25px",
        marginRight: "10px"
    },
    logo: {
        display: "flex"
    },
    logoText: {
        fontWeight: "bold",
        color: "white"
    },
    languageSelector: {
        minWidth: "200px"
    },
    languageAndIdentity: {
        display: "flex",
        flexDirection: "row",
        gap: "20px"
    }
}));

const changeLanguage = (language: string) => {
    window.localStorage.setItem("language", language)
    i18next.changeLanguage(language);
};

const Menu: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo)

    const options: DropdownButtonItem[] = useMemo(() => ([
        {
            id: "English",
            label: "language.english",
            icon: <Flag className={classes.flagIcon} code="us" />,
            type: "button",
            onClick: () => changeLanguage("default")
        },
        {
            id: "German",
            label: t("language.german"),
            icon: <Flag className={classes.flagIcon} code="de" />,
            type: "button",
            onClick: () => changeLanguage("custom")
        }
    ]), [classes, t]);

    return (
        <div className={classes.menuBar}>
            <MenuItem
                exact
                href="/"
                text="Start"
                icon={HomeOutlined} />
            <MenuItem
                href="/projects"
                text="Projekte"
                icon={FolderOutlined} />
            <MenuItem
                href="/favorites"
                text="Favoriten"
                icon={StarOutlineOutlined} />
            <MenuItem
                href="/recent"
                text="Verlauf"
                icon={ScheduleOutlined} />
            <MenuItem
                href="/settings"
                text="Optionen"
                icon={SettingsOutlined} />
            <MenuSpacer />
            <MenuAvatar name={currentUser?.username}>
                {close => (
                    <MenuList>
                        Text
                    </MenuList>
                )}
            </MenuAvatar>
            <MenuBar className={classes.menu}>
                <div className={classes.menuContent}>
                    <div className={classes.logo}>
                        <Typography
                            className={classes.logoText}
                            variant="h6">
                            Modellverwaltung
                        </Typography>
                    </div>
                    <div className={classes.languageAndIdentity}>
                        <DropdownButton
                            className={classes.languageSelector}
                            type="default"
                            title={t("language.select")}
                            options={options} />
                        <Identity />
                    </div>
                </div>
            </MenuBar>
        </div>
    );
};

export default Menu;
