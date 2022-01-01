import { alpha, IconButton, makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { Close } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { THEME } from "../../../theme";
import { PopupToast } from "./PopupToast";

interface Props {
    open: boolean;
    title: string;
    error?: string;
    small?: boolean;
    danger?: boolean;
    disabled?: boolean;
    className?: string;
    firstTitle?: string;
    onFirst?: () => void;
    firstDisabled?: boolean;
    icon?: React.ReactNode;
    onCloseError?: () => void;
    onClose?: () => void;
    secondTitle?: string;
    onSecond?: () => void;
    secondDisabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    children: {
        display: "flex",
        flexDirection: "column",
        padding: "0.5rem"
    },
    childrenWrapper: {
        margin: "0.5em",
        padding: "0px 24px"
    },
    backdropBlur: {
        backdropFilter: "blur(4px)"
    },
    paper: {
        margin: "-0.5rem",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        maxWidth: "600px",
        width: "calc(100vw - 0.2rem)",
        position: "static"
    },
    paperSmall: {
        maxWidth: "400px"
    },
    title: {
        fontSize: "1.35rem",
        fontWeight: 700,
        color: THEME.dialog.text,
        fontFamily: theme.typography.h1.fontFamily,
        textAlign: "center",
        margin: 0
    },
    buttons: {
        margin: "0px 16px 16px 16px",
        justifyContent: "center"
    },
    disabledButton: {
        color: `${alpha(theme.palette.primary.contrastText, 0.6)}!important`
    },
    button: {
        margin: "4px 8px",
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: 600,
        textTransform: "none",
        padding: "8px 24px",
        transition: theme.transitions.create(["border", "color", "background-color"]),
        minWidth: "144px"
    },
    titleWrapper: {
        padding: "16px 24px",
    },
    error: {
        margin: "0 1rem",
        "&>div>div>div": {
            margin: "1rem 0 0 0"
        },
        "&>div>div>div>div": {
            fontWeight: "bold"
        }
    },
    headerContainer: {
        display: "flex",
        height: "3rem",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    headerIcon: {
        width: "6rem",
        height: "6rem",
        borderRadius: "3rem",
        // Only works with position:static on paper because of overflow:hidden
        transform: "translateY(-2rem)",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: theme.shadows[2],
        backgroundSize: "8rem",
        backgroundImage: "url(\"data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3Csvg xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128' preserveAspectRatio='xMaxYMax slice'%3E%3Cg transform='scale(0.13559322033898305)'%3E%3Crect x='0' y='0' width='944' height='944' fill='%2303a9f4'/%3E%3Crect x='0' y='0' width='118' height='118' fill='%2325b5f6'/%3E%3Cpolygon points='118,0 118,118 0,118' fill='%2325b5f6'/%3E%3Crect x='118' y='0' width='118' height='118' fill='%2319b1f5'/%3E%3Cpolygon points='236,0 236,118 118,118' fill='%2304a9f4'/%3E%3Crect x='236' y='0' width='118' height='118' fill='%2312aef5'/%3E%3Cpolygon points='236,0 354,118 236,118' fill='%2321b3f6'/%3E%3Crect x='354' y='0' width='118' height='118' fill='%2312aef5'/%3E%3Cpolygon points='354,0 472,118 354,118' fill='%2324b4f6'/%3E%3Crect x='472' y='0' width='118' height='118' fill='%2303a9f4'/%3E%3Cpolygon points='472,0 590,0 472,118' fill='%2325b5f6'/%3E%3Crect x='590' y='0' width='118' height='118' fill='%231db2f5'/%3E%3Cpolygon points='708,0 708,118 590,118' fill='%231bb1f5'/%3E%3Crect x='708' y='0' width='118' height='118' fill='%2325b5f6'/%3E%3Cpolygon points='708,0 826,118 708,118' fill='%231db2f5'/%3E%3Crect x='826' y='0' width='118' height='118' fill='%230aabf4'/%3E%3Cpolygon points='826,0 944,0 944,118' fill='%2314aff5'/%3E%3Crect x='0' y='118' width='118' height='118' fill='%2312aef5'/%3E%3Cpolygon points='0,118 118,118 118,236' fill='%2314aff5'/%3E%3Crect x='118' y='118' width='118' height='118' fill='%231cb1f5'/%3E%3Cpolygon points='118,118 236,118 236,236' fill='%230fadf5'/%3E%3Crect x='236' y='118' width='118' height='118' fill='%2329b6f6'/%3E%3Cpolygon points='236,118 354,236 236,236' fill='%2320b3f6'/%3E%3Crect x='354' y='118' width='118' height='118' fill='%230fadf5'/%3E%3Cpolygon points='354,118 472,236 354,236' fill='%2327b5f6'/%3E%3Crect x='472' y='118' width='118' height='118' fill='%231fb3f5'/%3E%3Cpolygon points='590,118 590,236 472,236' fill='%2307aaf4'/%3E%3Crect x='590' y='118' width='118' height='118' fill='%2309abf4'/%3E%3Cpolygon points='708,118 708,236 590,236' fill='%2307aaf4'/%3E%3Crect x='708' y='118' width='118' height='118' fill='%2310adf5'/%3E%3Cpolygon points='708,118 826,236 708,236' fill='%2317b0f5'/%3E%3Crect x='826' y='118' width='118' height='118' fill='%230cacf4'/%3E%3Cpolygon points='826,118 944,118 944,236' fill='%2323b4f6'/%3E%3Crect x='0' y='236' width='118' height='118' fill='%2309abf4'/%3E%3Cpolygon points='0,236 118,236 118,354' fill='%2327b5f6'/%3E%3Crect x='118' y='236' width='118' height='118' fill='%2328b6f6'/%3E%3Cpolygon points='118,236 236,354 118,354' fill='%2328b6f6'/%3E%3Crect x='236' y='236' width='118' height='118' fill='%231fb3f5'/%3E%3Cpolygon points='236,236 354,354 236,354' fill='%230bacf4'/%3E%3Crect x='354' y='236' width='118' height='118' fill='%2328b6f6'/%3E%3Cpolygon points='354,236 472,236 472,354' fill='%2307aaf4'/%3E%3Crect x='472' y='236' width='118' height='118' fill='%2314aff5'/%3E%3Cpolygon points='472,236 590,236 590,354' fill='%231cb1f5'/%3E%3Crect x='590' y='236' width='118' height='118' fill='%2321b3f6'/%3E%3Cpolygon points='590,236 708,236 708,354' fill='%2303a9f4'/%3E%3Crect x='708' y='236' width='118' height='118' fill='%2322b3f6'/%3E%3Cpolygon points='826,236 826,354 708,354' fill='%2326b5f6'/%3E%3Crect x='826' y='236' width='118' height='118' fill='%231eb2f5'/%3E%3Cpolygon points='826,236 944,354 826,354' fill='%231eb2f5'/%3E%3Crect x='0' y='354' width='118' height='118' fill='%2320b3f6'/%3E%3Cpolygon points='0,354 118,354 0,472' fill='%2317b0f5'/%3E%3Crect x='118' y='354' width='118' height='118' fill='%230aabf4'/%3E%3Cpolygon points='118,354 236,354 118,472' fill='%2328b6f6'/%3E%3Crect x='236' y='354' width='118' height='118' fill='%2308abf4'/%3E%3Cpolygon points='354,354 354,472 236,472' fill='%2328b6f6'/%3E%3Crect x='354' y='354' width='118' height='118' fill='%2312aef5'/%3E%3Cpolygon points='354,354 472,354 354,472' fill='%2309abf4'/%3E%3Crect x='472' y='354' width='118' height='118' fill='%2305aaf4'/%3E%3Cpolygon points='472,354 590,472 472,472' fill='%2314aff5'/%3E%3Crect x='590' y='354' width='118' height='118' fill='%2306aaf4'/%3E%3Cpolygon points='590,354 708,472 590,472' fill='%231cb2f5'/%3E%3Crect x='708' y='354' width='118' height='118' fill='%2312aef5'/%3E%3Cpolygon points='708,354 826,354 826,472' fill='%230fadf5'/%3E%3Crect x='826' y='354' width='118' height='118' fill='%230cacf4'/%3E%3Cpolygon points='826,354 944,354 826,472' fill='%2325b5f6'/%3E%3Crect x='0' y='472' width='118' height='118' fill='%231cb2f5'/%3E%3Cpolygon points='118,472 118,590 0,590' fill='%2308abf4'/%3E%3Crect x='118' y='472' width='118' height='118' fill='%2319b1f5'/%3E%3Cpolygon points='236,472 236,590 118,590' fill='%2309abf4'/%3E%3Crect x='236' y='472' width='118' height='118' fill='%231db2f5'/%3E%3Cpolygon points='236,472 354,590 236,590' fill='%2303a9f4'/%3E%3Crect x='354' y='472' width='118' height='118' fill='%2305aaf4'/%3E%3Cpolygon points='354,472 472,590 354,590' fill='%2327b5f6'/%3E%3Crect x='472' y='472' width='118' height='118' fill='%2323b4f6'/%3E%3Cpolygon points='472,472 590,590 472,590' fill='%231db2f5'/%3E%3Crect x='590' y='472' width='118' height='118' fill='%2320b3f6'/%3E%3Cpolygon points='590,472 708,472 590,590' fill='%2319b0f5'/%3E%3Crect x='708' y='472' width='118' height='118' fill='%230bacf4'/%3E%3Cpolygon points='708,472 826,590 708,590' fill='%231ab1f5'/%3E%3Crect x='826' y='472' width='118' height='118' fill='%2326b5f6'/%3E%3Cpolygon points='944,472 944,590 826,590' fill='%231fb3f5'/%3E%3Crect x='0' y='590' width='118' height='118' fill='%2323b4f6'/%3E%3Cpolygon points='0,590 118,708 0,708' fill='%2316b0f5'/%3E%3Crect x='118' y='590' width='118' height='118' fill='%2328b6f6'/%3E%3Cpolygon points='118,590 236,590 118,708' fill='%231fb3f5'/%3E%3Crect x='236' y='590' width='118' height='118' fill='%231db2f5'/%3E%3Cpolygon points='236,590 354,590 236,708' fill='%2310adf5'/%3E%3Crect x='354' y='590' width='118' height='118' fill='%230aabf4'/%3E%3Cpolygon points='354,590 472,590 354,708' fill='%230eadf5'/%3E%3Crect x='472' y='590' width='118' height='118' fill='%2327b5f6'/%3E%3Cpolygon points='472,590 590,590 590,708' fill='%2309abf4'/%3E%3Crect x='590' y='590' width='118' height='118' fill='%2321b3f6'/%3E%3Cpolygon points='708,590 708,708 590,708' fill='%2318b0f5'/%3E%3Crect x='708' y='590' width='118' height='118' fill='%2323b4f6'/%3E%3Cpolygon points='826,590 826,708 708,708' fill='%2325b5f6'/%3E%3Crect x='826' y='590' width='118' height='118' fill='%230cacf4'/%3E%3Cpolygon points='944,590 944,708 826,708' fill='%230fadf5'/%3E%3Crect x='0' y='708' width='118' height='118' fill='%2303a9f4'/%3E%3Cpolygon points='0,708 118,826 0,826' fill='%231bb1f5'/%3E%3Crect x='118' y='708' width='118' height='118' fill='%2314aff5'/%3E%3Cpolygon points='236,708 236,826 118,826' fill='%231fb2f5'/%3E%3Crect x='236' y='708' width='118' height='118' fill='%2325b5f6'/%3E%3Cpolygon points='236,708 354,708 236,826' fill='%2312aef5'/%3E%3Crect x='354' y='708' width='118' height='118' fill='%2309abf4'/%3E%3Cpolygon points='354,708 472,708 472,826' fill='%231cb2f5'/%3E%3Crect x='472' y='708' width='118' height='118' fill='%2306aaf4'/%3E%3Cpolygon points='472,708 590,708 590,826' fill='%2324b4f6'/%3E%3Crect x='590' y='708' width='118' height='118' fill='%230eadf5'/%3E%3Cpolygon points='708,708 708,826 590,826' fill='%2313aef5'/%3E%3Crect x='708' y='708' width='118' height='118' fill='%2316b0f5'/%3E%3Cpolygon points='826,708 826,826 708,826' fill='%2329b6f6'/%3E%3Crect x='826' y='708' width='118' height='118' fill='%2326b5f6'/%3E%3Cpolygon points='826,708 944,708 826,826' fill='%231db2f5'/%3E%3Crect x='0' y='826' width='118' height='118' fill='%2326b5f6'/%3E%3Cpolygon points='0,826 118,826 0,944' fill='%2311aef5'/%3E%3Crect x='118' y='826' width='118' height='118' fill='%2328b6f6'/%3E%3Cpolygon points='118,826 236,826 118,944' fill='%231ab1f5'/%3E%3Crect x='236' y='826' width='118' height='118' fill='%2323b4f6'/%3E%3Cpolygon points='236,826 354,826 354,944' fill='%2307aaf4'/%3E%3Crect x='354' y='826' width='118' height='118' fill='%2321b3f6'/%3E%3Cpolygon points='354,826 472,826 354,944' fill='%2305aaf4'/%3E%3Crect x='472' y='826' width='118' height='118' fill='%231cb1f5'/%3E%3Cpolygon points='472,826 590,826 472,944' fill='%2306aaf4'/%3E%3Crect x='590' y='826' width='118' height='118' fill='%230bacf4'/%3E%3Cpolygon points='590,826 708,826 590,944' fill='%2325b5f6'/%3E%3Crect x='708' y='826' width='118' height='118' fill='%231fb3f5'/%3E%3Cpolygon points='826,826 826,944 708,944' fill='%231eb2f5'/%3E%3Crect x='826' y='826' width='118' height='118' fill='%2307aaf4'/%3E%3Cpolygon points='826,826 944,826 826,944' fill='%2313aef5'/%3E%3C/g%3E%3C/svg%3E\")"
    },
    headerIconDanger: {
        backgroundColor: THEME.dialog.icon.danger.background,
        backgroundImage: "none"
    },
    closeButton: {
        marginRight: "1.5rem",
        marginTop: "2rem",
        placeSelf: "flex-end"
    }
}));

const PopupDialog: React.FC<Props> = props => {
    const classes = useStyles(props);
    return (
        <Dialog
            BackdropProps={{ className: classes.backdropBlur }}
            PaperProps={{
                className: clsx(classes.paper, props.small && classes.paperSmall),
                elevation: 16
            }}
            open={props.open}>

            <div className={classes.headerContainer}>
                {props.icon && (
                    <div
                        className={clsx(classes.headerIcon, props.danger && classes.headerIconDanger)}>
                        {props.icon}
                    </div>
                )}
                {props.onClose && (
                    <IconButton
                        disabled={props.disabled}
                        className={classes.closeButton}
                        onClick={props.onClose}>
                        <Close />
                    </IconButton>
                )}
            </div>

            <DialogTitle
                disableTypography
                className={classes.titleWrapper}>

                <Typography className={classes.title}>
                    {props.title}
                </Typography>

                <PopupToast
                    message={props.error}
                    onClose={props.onCloseError}
                    className={classes.error} />

            </DialogTitle>

            <DialogContent className={classes.childrenWrapper}>

                <div className={classes.children}>

                    {props.children}

                </div>

            </DialogContent>

            {(props.onFirst || props.onSecond) && (
                <DialogActions className={classes.buttons}>

                    {props.onSecond && (
                        <Button
                            classes={{
                                disabled: classes.disabledButton
                            }}
                            disableElevation
                            className={classes.button}
                            onClick={props.onSecond}
                            variant="outlined"
                            disabled={props.disabled || props.secondDisabled}>
                            {props.secondTitle || "Abbrechen"}
                        </Button>
                    )}

                    {props.onFirst && (
                        <Button
                            classes={{
                                disabled: classes.disabledButton
                            }}
                            disableElevation
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
