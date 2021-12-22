import { Avatar, ClickAwayListener, Grow, Paper, Popper } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { THEME } from "../../../theme";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        height: "80px",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        "&:hover>div:first-child": {
            backgroundColor: THEME.menu.avatar.hover.background,
            color: THEME.menu.avatar.hover.text
        }
    },
    avatar: {
        textTransform: "uppercase",
        backgroundColor: THEME.menu.avatar.default.background,
        color: THEME.menu.avatar.default.text,
        transition: theme.transitions.create(["background-color", "color"])
    },
    paper: {
        padding: "1rem",
        backgroundColor: THEME.menu.background,
        overflowX: "unset",
        overflowY: "unset",
        // Arrow
        "&::before": {
            // eslint-disable-next-line
            content: '""',
            position: "absolute",
            bottom: 16,
            left: 0,
            width: 10,
            height: 10,
            backgroundColor: THEME.menu.background,
            boxShadow: theme.shadows[4],
            transform: "translate(-50%, -100%) rotate(225deg)",
            clipPath: "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
        },
    },
    popper: {
        marginLeft: "-0.5rem"
    }
}));

interface Props {
    name: string | undefined;
    children: ((props: {
        close: () => void;
    }) => React.ReactNode);
}

const MenuAvatar: React.FC<Props> = props => {
    const classes = useStyles();

    const [menuAnchor, setMenuAnchor] = useState<HTMLDivElement>();

    return (
        <div
            onClick={e => setMenuAnchor(e.currentTarget)}
            className={classes.root}>
            <Avatar className={classes.avatar}>
                {props.name?.substr(0, 1) ?? "?"}
            </Avatar>
            {props.children && (
                <Popper
                    disablePortal
                    transition
                    open={!!menuAnchor}
                    anchorEl={menuAnchor}
                    className={classes.popper}
                    placement="right">

                    {({ TransitionProps }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: "left" }}>

                            <Paper
                                className={classes.paper}
                                elevation={4}>

                                <ClickAwayListener onClickAway={() => setMenuAnchor(undefined)}>

                                    {props.children({ close: () => setMenuAnchor(undefined) })}

                                </ClickAwayListener>

                            </Paper>

                        </Grow>
                    )}

                </Popper>
            )}
        </div>
    );
};

export default MenuAvatar;
