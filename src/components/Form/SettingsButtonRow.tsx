import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

interface Props {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        "&>*": {
            margin: "0 0.25rem",
            "&:last-child": {
                marginRight: 0
            },
            "&:first-child": {
                marginLeft: 0
            }
        }
    }
}));

const SettingsButtonRow: React.FC<Props> = props => {
    const classes = useStyles();
    return (
        <div className={clsx(classes.root, props.className)}>
            {props.children}
        </div>
    );
};

export default SettingsButtonRow;
