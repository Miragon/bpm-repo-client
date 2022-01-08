import { Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

interface Props {
    title: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #CCC"
    },
    text: {
        fontSize: "0.85rem",
        fontWeight: "bold"
    }
}));

const MenuListTitle: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography
                variant="subtitle1"
                className={classes.text}>
                {props.title}
            </Typography>
        </div>
    );
};

export default MenuListTitle;
