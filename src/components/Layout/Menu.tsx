import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import i18next from "i18next";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import MenuBar from "./MenuBar";
import DropdownButton, { DropdownButtonItem } from "../Shared/Form/DropdownButton";
import Identity from "../Shared/Identity";

const useStyles = makeStyles((theme: Theme) => ({
    menu: {
        display: "flex"
    },
    menuContent: {
        flexGrow: 1,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
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
    window.localStorage.setItem("language", language);
    i18next.changeLanguage(language);
};

const Menu: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation("common");

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
        <MenuBar className={classes.menu}>
            <div className={classes.menuContent}>
                <div className={classes.logo}>
                    <Typography
                        className={classes.logoText}
                        variant="h6">
                        DigitalWF-Modellverwaltung
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
    );
};

export default Menu;
