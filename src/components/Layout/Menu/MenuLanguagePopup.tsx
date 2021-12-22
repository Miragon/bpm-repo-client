import { ListItem, ListItemText, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Done } from "@material-ui/icons";
import i18next from "i18next";
import React, { useState } from "react";
import { THEME } from "../../../theme";

const useStyles = makeStyles((theme: Theme) => ({
    languageMenu: {
        display: "flex",
        flexDirection: "column",
        paddingTop: "0.5rem",
        minWidth: "200px"
    },
    languageMenuName: {
        padding: "0.5rem 1rem",
        fontWeight: 600,
        fontSize: "0.9rem",
        letterSpacing: 0.5
    },
    languageMenuDivider: {
        width: "100%",
        height: "1px",
        backgroundColor: THEME.menu.divider
    },
    languageMenuItem: {
        display: "flex",
        padding: "0.25rem 1rem",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    languageMenuItemText: {
        color: THEME.menu.text
    }
}));

interface Props {
    onClose: () => void;
}

const LANGUAGES = [
    {
        id: "German",
        label: "Deutsch",
        key: "custom"
    },
    {
        id: "English",
        label: "English",
        key: "default"
    }
];

const MenuLanguagePopup: React.FC<Props> = props => {
    const classes = useStyles();

    const [activeLanguage, setActiveLanguage] = useState(
        localStorage.getItem("language") || "default"
    );

    const changeLanguage = async (languageKey: string) => {
        // Does not work without setTimeout
        setTimeout(props.onClose);
        setActiveLanguage(languageKey);
        localStorage.setItem("language", languageKey);
        await i18next.changeLanguage(languageKey);
    };

    return (
        <div className={classes.languageMenu}>
            <Typography className={classes.languageMenuName}>
                Choose Language
            </Typography>
            <div className={classes.languageMenuDivider} />
            {LANGUAGES.map(language => (
                <ListItem
                    dense
                    key={language.id}
                    className={classes.languageMenuItem}
                    onClick={() => changeLanguage(language.key)}
                    button>
                    <ListItemText
                        className={classes.languageMenuItemText}
                        primary={language.label} />
                    {activeLanguage === language.key && (
                        <Done fontSize="small" />
                    )}
                </ListItem>
            ))}
        </div>
    );
};

export default MenuLanguagePopup;
