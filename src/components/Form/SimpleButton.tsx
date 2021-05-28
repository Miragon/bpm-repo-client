import {Button} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

interface Props {
    title: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        textTransform: "none",
        fontWeight: 600,
        transition: theme.transitions.create("border-radius"),
        "&:hover": {
            backgroundColor: theme.palette.secondary.main
        }
    }
}));

const DropdownButton: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Button
            color="secondary"
            className={clsx(classes.button, props.className)}
            disabled={props.disabled}
            onClick={props.onClick}
            variant="contained">
            {props.title}
        </Button>
    );
};

export default DropdownButton;
