import { ClickAwayListener, Grow, Paper, Popper, PopperPlacementType } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    paper: (props: Props) => ({
        backgroundColor: props.background,
        overflowX: "unset",
        overflowY: "unset",
        borderRadius: "8px",
        border: "1px solid #CCC",
        // Arrow
        "&::before": {
            // eslint-disable-next-line
            content: '""',
            position: "absolute",
            width: 10,
            height: 10,
            backgroundColor: props.background,
            boxShadow: theme.shadows[2],
            border: "1px solid #CCC",
            clipPath: "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
        },
    }),
    arrowTop: {
        "&::before": {
            top: "1px",
            transform: "translate(0%, -50%) rotate(315deg)",
        }
    },
    arrowBottom: {
        "&::before": {
            bottom: "1px",
            transform: "translate(0%, 50%) rotate(135deg)",
        }
    },
    arrowLeft: {
        "&::before": {
            left: "1px",
            transform: "translate(-50%, 0%) rotate(225deg)",
        }
    },
    arrowRight: {
        "&::before": {
            right: "1px",
            transform: "translate(50%, 0%) rotate(45deg)",
        }
    },
    arrowCenterH: {
        "&::before": {
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0
        }
    },
    arrowStartH: (props: Props) => ({
        "&::before": {
            left: `calc(${props.arrowInset ?? 0}px + 10px)`,
        }
    }),
    arrowEndH: (props: Props) => ({
        "&::before": {
            right: `calc(${props.arrowInset ?? 0}px + 10px)`,
        }
    }),
    arrowCenterV: {
        "&::before": {
            marginTop: "auto",
            marginBottom: "auto",
            top: 0,
            bottom: 0
        }
    },
    arrowStartV: (props: Props) => ({
        "&::before": {
            top: `calc(${props.arrowInset ?? 0}px + 10px)`,
        }
    }),
    arrowEndV: (props: Props) => ({
        "&::before": {
            bottom: `calc(${props.arrowInset ?? 0}px + 10px)`,
        }
    }),
    popper: {
        zIndex: 10
    }
}));

interface Props {
    background: string;
    arrowInset?: number;
    className?: string;
    anchor: HTMLElement | undefined;
    onClose: () => void;
    placement: PopperPlacementType;
    children: ((props: { close: () => void; }) => React.ReactNode);
}

const transformOrigins: { [key in PopperPlacementType]: string } = {
    "bottom-end": "right top",
    "bottom-start": "left top",
    "bottom": "top",
    "left-end": "right bottom",
    "left-start": "right top",
    "left": "right",
    "right-end": "left bottom",
    "right-start": "left top",
    "right": "left",
    "top-end": "right bottom",
    "top-start": "left bottom",
    "top": "bottom"
};

const Popup: React.FC<Props> = props => {
    const classes = useStyles(props);

    return (
        <Popper
            transition
            disablePortal
            open={!!props.anchor}
            anchorEl={props.anchor}
            placement={props.placement}
            className={clsx(classes.popper, props.className)}>

            {({ TransitionProps, placement }) => (
                <ClickAwayListener onClickAway={props.onClose}>
                    <Grow
                        style={{ transformOrigin: transformOrigins[placement] }}
                        {...TransitionProps}>
                        <Paper
                            className={clsx(classes.paper, {
                                [classes.arrowTop]: placement.startsWith("bottom"),
                                [classes.arrowBottom]: placement.startsWith("top"),
                                [classes.arrowLeft]: placement.startsWith("right"),
                                [classes.arrowRight]: placement.startsWith("left"),
                                [classes.arrowCenterH]: placement === "top" || placement === "bottom",
                                [classes.arrowStartH]: placement === "top-start" || placement === "bottom-start",
                                [classes.arrowEndH]: placement === "top-end" || placement === "bottom-end",
                                [classes.arrowCenterV]: placement === "left" || placement === "right",
                                [classes.arrowStartV]: placement === "left-start" || placement === "right-start",
                                [classes.arrowEndV]: placement === "left-end" || placement === "right-end"
                            })}
                            elevation={2}>
                            {props.children({ close: props.onClose })}
                        </Paper>
                    </Grow>
                </ClickAwayListener>
            )}

        </Popper>
    );
};

export default Popup;
