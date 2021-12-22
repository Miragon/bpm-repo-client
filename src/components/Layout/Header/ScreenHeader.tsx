import { Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { THEME } from "../../../theme";
import AddButton from "./AddButton";
import FavoriteButton from "./FavoriteButton";
import SearchButton from "./SearchButton";

interface Props {
    title: string;
    addOptions: {
        label: string,
        value: string,
        icon: React.ElementType
    }[][];
    onAdd: (value: string) => void;
    onSearch: (value: string) => void;
    onFavorite: (value: boolean) => void;
    isFavorite?: boolean;
    showAdd?: boolean;
    showSearch?: boolean;
    showFavorite?: boolean;
    primary: "add" | "search" | "favorite";
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        marginTop: "1rem",
        marginBottom: "1rem"
    },
    header: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "1rem",
        alignItems: "center",
        justifyContent: "space-between"
    },
    divider: {
        height: "1px",
        width: "100%",
        backgroundColor: THEME.pageHeader.divider
    },
    title: {
        fontSize: "1.25rem",
        fontWeight: 700,
        color: THEME.pageHeader.text
    },
    actionContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: "-1rem"
    }
}));

const ScreenHeader: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography
                    variant="h1"
                    className={classes.title}>
                    {props.title}
                </Typography>
                <div className={classes.actionContainer}>
                    {props.showAdd !== false && (
                        <AddButton
                            addOptions={props.addOptions}
                            onAdd={props.onAdd}
                            primary={props.primary === "add"} />
                    )}
                    {props.showSearch !== false && (
                        <SearchButton
                            onSearch={props.onSearch}
                            primary={props.primary === "search"} />
                    )}
                    {props.showFavorite !== false && (
                        <FavoriteButton
                            onFavorite={props.onFavorite}
                            active={props.isFavorite ?? false}
                            primary={props.primary === "favorite"} />
                    )}
                </div>
            </div>
            <div className={classes.divider} />
        </div>
    );
};

export default ScreenHeader;
