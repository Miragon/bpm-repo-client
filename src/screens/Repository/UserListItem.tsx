import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    ClickAwayListener,
    Grow,
    IconButton,
    ListItem,
    ListItemSecondaryAction,
    ListItemText, MenuItem, MenuList,
    Paper,
    Popper
} from "@material-ui/core";
import {AssignmentTO} from "../../api/models";
import {Settings} from "@material-ui/icons";
import clsx from "clsx";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {DropdownButtonItem} from "../../components/Form/DropdownButton";

interface Props {
    assignmentTO: AssignmentTO;
}

const useStyles = makeStyles((theme: Theme) => ({
    list: {
        outline: "none"
    },
    popupContainer: {
        width: "150px",
        zIndex: 1000
    },
    popup: {
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        backgroundColor: theme.palette.secondary.main,
    },
    menuItem: {
        color: theme.palette.secondary.contrastText,
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    menuItemHint: {
        whiteSpace: "break-spaces",
        fontSize: "0.85rem",
        color: "white",
        fontWeight: "normal",
        opacity: "1 !important",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        marginTop: "0.5rem",
        marginBottom: "1rem"
    },
    menuItemDivider: {
        height: "1px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        opacity: "1 !important",
        marginTop: "0.25rem",
        marginBottom: "0.5rem",
        padding: 0
    }
}))


const UserListItem: React.FC<Props> = props => {

    const classes = useStyles();

    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);


    const options: DropdownButtonItem[] = [
        {
            id: "Owner",
            label: "Owner",
            type: "button",
            onClick: () => {
                console.log("Owner");
            }
        },
        {
            id: "Admin",
            label: "Admin",
            type: "button",
            onClick: () => {
                console.log("Admin");
            }
        },
        {
            id: "Member",
            label: "Member",
            type: "button",
            onClick: () => {
                console.log("Member");
            }
        },
        {
            id: "Viewer",
            label: "Viewer",
            type: "button",
            onClick: () => {
                console.log("Viewer");
            }
        },
        {
            id: "divider1",
            type: "divider",
            label: "",
            onClick: () => { /* Do nothing */ }
        },
        {
            id: "Remove",
            label: "Remove from Repo",
            type: "button",
            onClick: () => {
                console.log("Remove")
            }
        }
    ];

    return (
        <>
        <ListItem>
            <ListItemText
                primary={props.assignmentTO.userName}
                secondary={props.assignmentTO.roleEnum} />
            <ListItemSecondaryAction>
                <IconButton ref={ref} edge="end" onClick={() => setOpen(true)}>
                    <Settings/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    <Popper
        open={open}
        anchorEl={ref.current}
        role={undefined}
        transition
        disablePortal
        className={classes.popupContainer}>
        {({ TransitionProps }) => (
            <Grow
                {...TransitionProps}
                style={{ transformOrigin: "top" }}>
                <Paper className={classes.popup}>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <MenuList className={classes.list}>
                            {options.map(option => (
                                <MenuItem
                                    key={option.id}
                                    disabled={option.disabled || option.type !== "button"}
                                    className={clsx(
                                        classes.menuItem,
                                        option.type === "hint" && classes.menuItemHint,
                                        option.type === "divider" && classes.menuItemDivider
                                    )}
                                    onClick={() => {
                                        if (option.onClick) {
                                            option.onClick();
                                        } else {
                                            console.log("Some error when clicking")
                                        }
                                        setOpen(false);
                                    }}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Grow>
        )}
    </Popper>
        </>
    );
}

export default UserListItem;