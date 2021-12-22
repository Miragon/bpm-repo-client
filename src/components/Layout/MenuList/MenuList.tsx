import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "../../../theme";

export declare type MenuListConfig = MenuListGroup[];
export declare type MenuListGroup = MenuListItem[];
export declare type MenuListItem = {
    label: string,
    value: string,
    icon: React.ElementType
};

interface Props {
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
            {props.options.map((group, index) => (
                <div className={classes.optionGroup}>
                    {group.map(option => (
                        <ListItem
                            dense
                            button
                            onClick={() => props.onClick(option.value)}>
                            <ListItemIcon className={classes.optionIconContainer}>
                                {React.createElement(option.icon, {
                                    className: classes.optionIcon,
                                    fontSize: "small"
                                })}
                            </ListItemIcon>
                            <ListItemText primary={t(option.label)} />
                        </ListItem>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MenuList;
