import {makeStyles} from "@material-ui/core";
import React from "react";

interface Props {
    className?: string;
    label?: string;
}

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        "&>*": {
            marginRight: "6px",
            marginLeft: "6px",
            flex: "1 1",
            "&:first-child": {
                marginLeft: "0px"
            },
            "&:last-child": {
                marginRight: "0px"
            }
        }
    }
}));

const SettingsFormRow: React.FC<Props> = props => {
    const classes = useStyles();
    return (
        <div
            className={props.className}>
            {props.label && (
                <span>{props.label}</span>
            )}
            <div className={classes.root}>
                {props.children}
            </div>
        </div>
    );
};

export default SettingsFormRow;
