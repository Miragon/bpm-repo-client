import { TextField } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CloseOutlined, SearchOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { THEME } from "../../../theme";
import ActionButton from "./ActionButton";

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
        width: "0px",
        opacity: 0,
        display: "flex",
        transition: theme.transitions.create(["width", "opacity"])
    },
    containerOpen: {
        width: "250px",
        opacity: 1
    },
    input: {
        flexGrow: 1,
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
        "&>div>fieldset": {
            borderWidth: "2px !important",
            borderColor: `${THEME.pageHeader.action.primary.active} !important`
        }
    }
}));

const SearchButton: React.FC<Props> = props => {
    const classes = useStyles();

    const searchInputRef = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    return (
        <div className={classes.root}>
            <div className={clsx(
                classes.container,
                open && classes.containerOpen
            )}>
                <TextField
                    size="small"
                    value={search}
                    inputRef={searchInputRef}
                    className={clsx(classes.input, search && classes.inputActive)}
                    onChange={e => {
                        setSearch(e.target.value);
                        props.onSearch(e.target.value);
                    }}
                    placeholder="Suchen..."
                    variant="outlined" />
            </div>
            <ActionButton
                onClick={() => {
                    if(open) {
                        setSearch("");
                        props.onSearch("");
                        searchInputRef.current?.blur();
                        setOpen(false);
                    } else {
                        searchInputRef.current?.focus();
                        setOpen(true);
                    }
                }}
                label={open ? "Fertig" : "Suchen"}
                icon={open ? CloseOutlined : SearchOutlined}
                primary={props.primary}
                active={open} />
        </div>
    );
};

export default SearchButton;
