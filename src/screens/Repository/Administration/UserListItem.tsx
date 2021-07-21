import React, {useCallback, useRef, useState} from "react";
import {
    ClickAwayListener,
    Divider,
    Grow,
    IconButton,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper
} from "@material-ui/core";
import {Settings} from "@material-ui/icons";
import clsx from "clsx";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import {AssignmentTO, AssignmentUpdateTORoleEnumEnum} from "../../../api/models";
import * as assignmentAction from "../../../store/actions/assignmentAction";
import {useTranslation} from "react-i18next";

interface Props {
    assignmentTO: AssignmentTO;
    hasAdminPermissions: boolean;
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
}));

const UserListItem: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    const changeRole = useCallback((role: AssignmentUpdateTORoleEnumEnum) => {
        try {
            dispatch(assignmentAction.createOrUpdateUserAssignment(
                props.assignmentTO.repositoryId,
                props.assignmentTO.userId,
                props.assignmentTO.username,
                role
            ));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch, props]);

    const removeUser = useCallback(() => {
        try {
            dispatch(assignmentAction.deleteAssignment(
                props.assignmentTO.repositoryId,
                props.assignmentTO.username
            ));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch, props]);

    const options: DropdownButtonItem[] = [
        {
            id: "Owner",
            label: "user.OWNER",
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.OWNER);
            }
        },
        {
            id: "Admin",
            label: "user.ADMIN",
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.ADMIN);
            }
        },
        {
            id: "Member",
            label: "user.MEMBER",
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.MEMBER);
            }
        },
        {
            id: "Viewer",
            label: "user.VIEWER",
            type: "button",
            onClick: () => {
                changeRole(AssignmentUpdateTORoleEnumEnum.VIEWER);
            }
        },
        {
            id: "divider1",
            type: "divider",
            label: "",
            onClick: () => { /* Do nothing */
            }
        },
        {
            id: "Remove",
            label: "user.remove",
            type: "button",
            onClick: () => {
                removeUser();
            }
        }
    ];

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={props.assignmentTO.username}
                    secondary={t(`user.${props.assignmentTO.roleEnum}`)} />
                {props.hasAdminPermissions && (
                    <ListItemSecondaryAction>
                        <IconButton ref={ref} edge="end" onClick={() => setOpen(true)}>
                            <Settings />
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
            <Divider />
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
                                                    // eslint-disable-next-line no-console
                                                    console.log("Some error when clicking");
                                                }
                                                setOpen(false);
                                            }}>
                                            {t( `${option.label}`)}
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
};

export default UserListItem;
