import { TextField } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "../../theme";

interface Props {
    onSearch: (value: string) => void;
    primary: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        alignItems: "center"
    },
    container: {
        width: "250px",
        opacity: 1,
        display: "flex",
        marginRight: "1rem"
    },
    input: {
        flexGrow: 1,
        "&>div": {
            opacity: 0.75,
            transition: theme.transitions.create("opacity"),
        },
        "&>div:hover": {
            opacity: 1
        },
        "&>div.Mui-focused": {
            opacity: 1
        },
        "&>div>fieldset": {
            transition: theme.transitions.create("border-color"),
            // borderWidth: "1px !important"
        },
        "&:hover>div>fieldset": {
            borderColor: `${THEME.pageHeader.action.primary.hover} !important`
        },
        "&>div.Mui-focused>fieldset": {
            borderColor: `${THEME.pageHeader.action.primary.active} !important`
        }
    },
    inputActive: {
        "&>div": {
            opacity: 1
        },
        "&>div>fieldset": {
            borderWidth: "2px !important",
            borderColor: `${THEME.pageHeader.action.primary.active} !important`
        }
    }
}));

const SearchButton: React.FC<Props> = props => {
    const classes = useStyles();

    const { t } = useTranslation("common");

    const [search, setSearch] = useState("");

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <TextField
                    size="small"
                    value={search}
                    className={clsx(classes.input, search && classes.inputActive)}
                    onChange={e => {
                        setSearch(e.target.value);
                        props.onSearch(e.target.value);
                    }}
                    placeholder={t("action.search")}
                    variant="outlined" />
            </div>
        </div>
    );
};

export default SearchButton;
