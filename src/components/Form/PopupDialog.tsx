import {fade, makeStyles, Theme} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React, {ReactNode} from "react";
import {Toast} from "./Toast";

interface Props {
    open: boolean;
    title: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    firstTitle?: string;
    onFirst?: () => void;
    secondTitle?: string;
    onSecond?: () => void;
    errorClassName?: string;
    firstDisabled?: boolean;
    paperClassName?: string;
    secondDisabled?: boolean;
    onCloseError?: () => void;
    backdropClassName?: string;
    buttons?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
    children: {
        display: "flex",
        flexDirection: "column",
        padding: "0.5rem"
    },
    childrenWrapper: {
        margin: "0.5em",
        padding: "0px 24px",
        "&::-webkit-scrollbar": {
            width: "12px"
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)"
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            borderRadius: "6px"
        }
    },
    backdrop: {
        backgroundColor: "rgba(0,0,0,0.25)"
    },
    backdropBlur: {
        backdropFilter: "blur(3px)"
    },
    paper: {
        margin: "-0.5rem",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        maxWidth: "600px",
        width: "calc(100vw - 0.2rem)"
    },
    title: {
        fontFamily: theme.typography.h1.fontFamily,
        fontSize: "1.5rem",
        fontWeight: 500,
        textAlign: "center",
        marginTop: "0.5rem",
        marginBottom: "1rem"
    },
    buttons: {
        margin: "16px",
        justifyContent: "center"
    },
    disabledButton: {
        color: `${fade(theme.palette.primary.contrastText, 0.6)}!important`
    },
    button: {
        margin: "4px 8px",
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: 600,
        textTransform: "none",
        padding: "8px 24px",
        transition: theme.transitions.create(["border", "color", "background-color"]),
        minWidth: "144px",
        border: "none !important"
    },
    titleWrapper: {
        padding: "16px 24px 0px 24px"
    },
    error: {
        margin: "calc(0.5rem + 3px)"
    }
}));

const PopupDialog: React.FC<Props> = props => {
    const classes = useStyles(props);
    return (
        <Dialog
            BackdropProps={{ className: clsx(classes.backdrop, props.backdropClassName) }}
            PaperProps={{
                className: clsx(classes.paper, props.paperClassName),
                elevation: 16
            }}
            open={props.open}
            disableBackdropClick>

            <DialogTitle
                disableTypography
                className={classes.titleWrapper}>

                <Typography className={classes.title}>
                    {props.title}
                </Typography>

                <Toast
                    message={props.error}
                    onClose={props.onCloseError}
                    className={clsx(classes.error, props.errorClassName)} />

            </DialogTitle>

            <DialogContent className={classes.childrenWrapper}>

                <div className={classes.children}>

                    {props.children}

                </div>

            </DialogContent>

            {props.buttons && (
                <DialogActions className={classes.buttons}>
                    {props.buttons}
                </DialogActions>
            )}

            {(props.onFirst || props.onSecond) && (
                <DialogActions className={classes.buttons}>

                    {props.onSecond && (
                        <Button
                            classes={{
                                disabled: classes.disabledButton
                            }}
                            className={classes.button}
                            onClick={props.onSecond}
                            variant="contained"
                            color="secondary"
                            disabled={props.disabled || props.secondDisabled}>
                            {props.secondTitle || "Abbrechen"}
                        </Button>
                    )}

                    {props.onFirst && (
                        <Button
                            classes={{
                                disabled: classes.disabledButton
                            }}
                            className={classes.button}
                            onClick={props.onFirst}
                            color="secondary"
                            variant="contained"
                            disabled={props.disabled || props.firstDisabled}>
                            {props.firstTitle || "Fertig"}
                        </Button>
                    )}

                </DialogActions>
            )}

        </Dialog>
    );
};

export default PopupDialog;
