import {makeStyles, Theme} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import React from "react";

interface Props {
    title: string;
    disabled: boolean;
    onClicked: () => void;
    size?: "small" | "medium" | "large";
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        marginRight: "auto",
        marginTop: "0.5rem",
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: theme.typography.button.fontWeight,
        textTransform: "none",
        padding: "8px 24px",
        transition: theme.transitions.create(["border", "color", "background-color"]),
        minWidth: "144px",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        }
    },
    small: {
        padding: "4px 12px",
        minWidth: "100px"
    },
    large: {
        padding: "12px 36px",
        minWidth: "168px"
    },
    disabled: {
        color: `${theme.palette.primary.contrastText} !important`,
        "&>span": {
            opacity: "0.7"
        }
    }
}));

const SettingsButton: React.FC<Props> = props => {
    const classes = useStyles();
    return (
        <Button
            disableElevation
            className={clsx(classes.button, {
                [classes.small]: props.size === "small",
                [classes.large]: props.size === "large",
                [classes.disabled]: props.disabled
            }, props.className)}
            onClick={props.onClicked}
            variant="outlined"
            size={props.size || "medium"}
            disabled={props.disabled}>
            {props.title}
        </Button>
    );
};

export default SettingsButton;
