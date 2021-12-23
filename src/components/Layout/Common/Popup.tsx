import { ClickAwayListener, Grow, Paper, Popper, PopperPlacementType } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import { Property } from "csstype";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    paper: (props: Props) => ({
        backgroundColor: props.popupStyle.background,
        overflowX: "unset",
        overflowY: "unset",
        borderRadius: "8px",
        border: "1px solid #CCC",
        // Arrow
        "&::before": {
            // eslint-disable-next-line
            content: '""',
            position: "absolute",
            bottom: props.popupStyle.bottom,
            left: props.popupStyle.left,
            right: props.popupStyle.right,
            top: props.popupStyle.top,
            width: 10,
            height: 10,
            backgroundColor: props.popupStyle.background,
            transform: `translate(${props.popupStyle.translateX}, ${props.popupStyle.translateY}) rotate(${props.popupStyle.rotation}deg)`,
            boxShadow: theme.shadows[2],
            border: "1px solid #CCC",
            clipPath: "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
        },
    }),
    paperFlip: (props: Props) => ({
        backgroundColor: props.popupStyleFlip?.background,
        // Arrow
        "&::before": {
            bottom: props.popupStyleFlip?.bottom,
            left: props.popupStyleFlip?.left,
            right: props.popupStyleFlip?.right,
            top: props.popupStyleFlip?.top,
            backgroundColor: props.popupStyleFlip?.background,
            transform: props.popupStyleFlip ? `translate(${props.popupStyleFlip.translateX}, ${props.popupStyleFlip.translateY}) rotate(${props.popupStyleFlip.rotation}deg)` : undefined
        },
    }),
    popper: {
        zIndex: 10
    }
}));

interface Props {
    popupStyle: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
        rotation: number;
        translateX: string;
        translateY: string;
        background: string;
        transformOrigin: Property.TransformOrigin;
    };
    popupStyleFlip?: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
        rotation?: number;
        translateX?: string;
        translateY?: string;
        background?: string;
        transformOrigin: Property.TransformOrigin;
    };
    className?: string;
    anchor: HTMLElement | undefined;
    onClose: () => void;
    placement: PopperPlacementType;
    children: ((props: {
        close: () => void;
        placement: PopperPlacementType;
    }) => React.ReactNode);
}

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

            {popperProps => (
                <ClickAwayListener onClickAway={props.onClose}>
                    <Grow
                        style={{
                            transformOrigin: popperProps.placement === props.placement
                                ? props.popupStyle.transformOrigin
                                : props.popupStyleFlip?.transformOrigin ?? props.popupStyle.transformOrigin
                        }}
                        {...popperProps.TransitionProps}>
                        <Paper
                            className={clsx(
                                classes.paper,
                                props.placement !== popperProps.placement && classes.paperFlip
                            )}
                            elevation={2}>
                            {props.children({
                                placement: popperProps.placement,
                                close: props.onClose
                            })}
                        </Paper>
                    </Grow>
                </ClickAwayListener>
            )}

        </Popper>
    );
};

export default Popup;
