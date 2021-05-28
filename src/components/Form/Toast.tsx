import {makeStyles, Theme} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Refresh from "@material-ui/icons/Refresh";
import Alert, {Color} from "@material-ui/lab/Alert";
import clsx from "clsx";
import React from "react";

export interface ToastAction {
    icon: React.ElementType;
    onClick: () => void;
}

interface Props {
    message: string | undefined | false;
    severity?: Color;
    className?: string;
    onClose?: () => void;
    alertClassName?: string;
    action?: ToastAction;
    noIcon?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    actionButton: {
        "&:hover": {
            backgroundColor: "transparent"
        }
    },
    actionButtonIcon: {
        color: theme.palette.primary.contrastText,
        marginRight: "0.5rem"
    },
    alert: {
        marginTop: "1rem",
        marginBottom: "1rem"
    }
}));

export const Toast: React.FC<Props> = props => {
    const classes = useStyles();

    if (props.action && props.onClose) {
        throw new Error("Only action or onClose must be passed!");
    }

    return (
        <Collapse
            in={!!props.message}
            className={props.className}>

            <Alert
                icon={props.noIcon ? false : undefined}
                variant="filled"
                onClose={props.onClose}
                severity={props.severity || "error"}
                className={clsx(classes.alert, props.alertClassName)}
                action={props.action && (

                    <IconButton
                        disableRipple
                        disableFocusRipple
                        disableTouchRipple
                        className={classes.actionButton}
                        size="small"
                        onClick={props.action.onClick}>

                        {React.createElement(props.action.icon, {
                            fontSize: "small",
                            className: classes.actionButtonIcon
                        })}

                    </IconButton>

                )}>

                {props.message}

            </Alert>

        </Collapse>
    );
};

export const retryAction = (onRetry: () => void): ToastAction => ({
    onClick: onRetry,
    icon: Refresh
});

export const closeAction = (onClose: () => void): ToastAction => ({
    onClick: onClose,
    icon: Close
});
