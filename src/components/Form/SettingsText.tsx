import {makeStyles} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

interface Props {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {
        display: "block",
        margin: "1rem 0 1rem 0",
        "&:first-child": {
            marginTop: "0rem"
        }
    }
}));

const SettingsText: React.FC<Props> = props => {
    const classes = useStyles();
    return (
        <span
            className={clsx(classes.root, props.className)}>
            {props.children}
        </span>
    );
};

export default SettingsText;
