import {makeStyles} from "@material-ui/core";
import React from "react";

interface Props {
    onClick: () => void,
}

const useStyles = makeStyles(() => ({
    logo: {
        color: "white",
        fontSize: "1.25rem",
        letterSpacing: "-0.05rem",
        fontWeight: 500,
        fontFamily: "neo-sans, sans-serif",
        cursor: "pointer"
    },
}));

const MenuLogo: React.FC<Props> = props => {
    const classes = useStyles();
    return (
        <span
            onClick={props.onClick}
            className={classes.logo}>
            Developer Platform | it@M
        </span>
    );
};

export default MenuLogo;
