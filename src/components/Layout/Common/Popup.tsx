import { ClickAwayListener, Grow, Paper, Popper, PopperPlacementType } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import { Property } from "csstype";
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
            bottom: props.bottom,
            left: props.left,
            right: props.right,
            top: props.top,
            width: 10,
            height: 10,
            backgroundColor: props.background,
            boxShadow: theme.shadows[2],
            transform: `translate(${props.translateX}, ${props.translateY}) rotate(${props.rotation}deg)`,
            border: "1px solid #CCC",
            clipPath: "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
        },
    }),
    popper: {
        zIndex: 10
    }
}));

interface Props {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    rotation: number;
    translateX: string;
    translateY: string;
    className?: string;
    background: string;
    anchor: HTMLElement | undefined;
    onClose: () => void;
    placement: PopperPlacementType;
    transformOrigin: Property.TransformOrigin;
    children: ((props: {
        close: () => void;
    }) => React.ReactNode);
}

const Popup: React.FC<Props> = props => {
    const classes = useStyles(props);

    return (
        <Popper
            disablePortal
            transition
            open={!!props.anchor}
            anchorEl={props.anchor}
            placement={props.placement}
            className={clsx(classes.popper, props.className)}>

            {({ TransitionProps }) => (

                <ClickAwayListener onClickAway={props.onClose}>
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: props.transformOrigin }}>

                        <Paper
                            className={classes.paper}
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
