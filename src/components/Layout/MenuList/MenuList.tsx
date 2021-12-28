import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "../../../theme";

export declare type MenuListConfig = MenuListGroup[];
export declare type MenuListGroup = MenuListItem[];
export declare type MenuListItem = {
    label: string;
    value: string;
    right?: React.ReactNode;
    icon?: React.ElementType | null;
    className?: string;
};

interface Props {
    title?: React.ReactNode;
    options: MenuListConfig;
    onClick: (value: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    optionGroup: {
        padding: "0.5rem 0",
        "&:not(:last-child)": {
            borderBottom: "1px solid " + THEME.menu.divider
        }
    },
    option: {
        margin: "0.15rem 0.5rem",
        borderRadius: "8px",
        width: "calc(100% - 1rem)",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    optionIcon: {
        fill: THEME.menu.icon
    },
    optionIconContainer: {
        minWidth: "40px"
    }
}));

const MenuList: React.FC<Props> = props => {
    const classes = useStyles();

    const { t } = useTranslation("common");

    return (
        <div>
            {props.title}
            {props.options.map((group, index) => (
                <div className={classes.optionGroup}>
                    {group.map(option => (
                        <ListItem
                            dense
                            button
                            className={clsx(classes.option, option.className)}
                            onClick={() => props.onClick(option.value)}>
                            {option.icon !== undefined && (
                                <ListItemIcon className={classes.optionIconContainer}>
                                    {option.icon !== null && React.createElement(option.icon, {
                                        className: classes.optionIcon,
                                        fontSize: "small"
                                    })}
                                </ListItemIcon>
                            )}
                            <ListItemText primary={t(option.label)} />
                            {option.right}
                        </ListItem>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MenuList;
