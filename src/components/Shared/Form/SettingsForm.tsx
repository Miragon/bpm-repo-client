import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

interface Props {
    full?: boolean;
    large?: boolean;
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px"
    },
    large: {
        maxWidth: "600px"
    },
    full: {
        maxWidth: "100%",
        flexGrow: 1
    }
}));

const SettingsForm: React.FC<Props> = props => {
    const classes = useStyles();
    return (
        <div
            className={clsx(classes.root, props.large && classes.large, props.full && classes.full, props.className)}>
            {props.children}
        </div>
    );
};

export default SettingsForm;
