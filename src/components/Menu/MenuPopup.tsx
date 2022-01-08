import { ClickAwayListener, Grow, Paper, Popper } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { THEME } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        backgroundColor: THEME.navigation.background,
        overflowX: "unset",
        overflowY: "unset",
        borderRadius: "8px",
        border: "1px solid #CCC",
        // Arrow
        "&::before": {
            // eslint-disable-next-line
            content: '""',
            position: "absolute",
            bottom: "15%",
            left: 1,
            width: 10,
            height: 10,
            backgroundColor: THEME.navigation.background,
            boxShadow: theme.shadows[2],
            transform: "translate(-50%, -100%) rotate(225deg)",
            border: "1px solid #CCC",
            clipPath: "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
        },
    },
    popper: {
        marginLeft: "-0.5rem",
        cursor: "default"
    }
}));

interface Props {
    anchor: HTMLElement | undefined;
    onClose: () => void;
    children: ((props: {
        close: () => void;
    }) => React.ReactNode);
}

const MenuAvatar: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Popper
            disablePortal
            transition
            open={!!props.anchor}
            anchorEl={props.anchor}
            className={classes.popper}
            placement="right-end">

            {({ TransitionProps }) => (

                <ClickAwayListener onClickAway={props.onClose}>
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: "left" }}>

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

export default MenuAvatar;
