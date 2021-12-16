import { Menu, MenuItem } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React from "react";
import { DropdownButtonItem } from "./DropdownButton";

const useStyles = makeStyles((theme: Theme) => ({
    menuItem: {
        color: theme.palette.secondary.contrastText,
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    menuItemDivider: {
        height: "1px",
        backgroundColor: theme.palette.secondary.contrastText,
        opacity: "1 !important",
        marginTop: "0.25rem",
        marginBottom: "0.25rem",
        padding: 0
    },
    paper: {
        backgroundColor: theme.palette.secondary.main
    },
    list: {
        padding: "4px 0 !important"
    }
}));

interface Props {
    open: boolean;
    reference: Element | null;
    onCancel: () => void;
    options: Array<DropdownButtonItem>;
}

const PopupSettings: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();

    return (
        <Menu
            classes={{
                paper: classes.paper,
                list: classes.list
            }}
            anchorEl={props.reference}
            open={props.open}
            onClose={props.onCancel}>
            {props.options.map(option => (
                <MenuItem
                    key={option.id}
                    disabled={option.disabled || option.type !== "button"}
                    className={clsx(
                        classes.menuItem,
                        option.type === "divider" && classes.menuItemDivider
                    )}
                    onClick={() => {
                        if (option.onClick) {
                            option.onClick();
                        } else {
                            console.log("No Action provided");
                        }
                        props.onCancel();
                    }}>
                    {(option.label)}
                </MenuItem>
            ))}
        </Menu>
    );
});

export default PopupSettings;
