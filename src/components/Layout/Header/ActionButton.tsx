import { IconButton } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { MouseEventHandler } from "react";
import { THEME } from "../../../theme";

interface Props {
    label: string;
    icon: React.ElementType;
    primary: boolean;
    active: boolean;
    iconClassName?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const useStyles = makeStyles((theme: Theme) => ({
    actionButton: {
        zIndex: 1
    },
    actionButtonIcon: {
        transition: theme.transitions.create("fill")
    },
    actionButtonPrimary: {
        "&:hover>span>svg": {
            fill: THEME.pageHeader.action.primary.hover
        }
    },
    actionButtonPrimaryActive: {},
    actionButtonDefault: {
        "&:hover>span>svg": {
            fill: THEME.pageHeader.action.default.hover
        }
    },
    actionButtonDefaultActive: {},
    actionButtonIconDefault: {
        fill: THEME.pageHeader.action.default.default
    },
    actionButtonIconDefaultActive: {
        fill: `${THEME.pageHeader.action.default.active} !important`
    },
    actionButtonIconPrimary: {
        fill: THEME.pageHeader.action.primary.default
    },
    actionButtonIconPrimaryActive: {
        fill: `${THEME.pageHeader.action.primary.active} !important`
    }
}));

const ActionButton: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <IconButton
            title={props.label}
            onClick={props.onClick}
            className={clsx(
                classes.actionButton,
                props.primary ? classes.actionButtonPrimary : classes.actionButtonDefault,
                props.active && props.primary && classes.actionButtonPrimaryActive,
                props.active && !props.primary && classes.actionButtonDefaultActive
            )}>
            {React.createElement(props.icon, {
                className: clsx(
                    classes.actionButtonIcon,
                    props.primary ? classes.actionButtonIconPrimary : classes.actionButtonIconDefault,
                    props.active && props.primary && classes.actionButtonIconPrimaryActive,
                    props.active && !props.primary && classes.actionButtonIconDefaultActive,
                    props.iconClassName
                )
            })}
        </IconButton>
    );
};

export default ActionButton;
