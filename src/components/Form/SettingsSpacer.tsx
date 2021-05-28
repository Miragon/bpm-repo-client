import {makeStyles} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
    root: {
        flex: "1 1 auto"
    }
}));

const SettingsSpacer: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root} />
    );
};

export default SettingsSpacer;
