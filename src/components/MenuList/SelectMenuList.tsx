import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CheckOutlined } from "@material-ui/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "../../theme";

export declare type SelectMenuListConfig = SelectMenuListGroup[];
export declare type SelectMenuListGroup = SelectMenuListItem[];
export declare type SelectMenuListItem = {
    label: string;
    value: string;
};

interface Props {
    active: string[];
    title?: React.ReactNode;
    options: SelectMenuListConfig;
    onChange: (value: string, selected: boolean) => void;
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

const SelectMenuList: React.FC<Props> = props => {
    const classes = useStyles();

    const { t } = useTranslation("common");

    return (
        <div>
            {props.title}
            {props.options.map((group, index) => (
                <div key={index} className={classes.optionGroup}>
                    {group.map(option => {
                        const active = props.active.indexOf(option.value) !== -1;
                        return (
                            <ListItem
                                dense
                                button
                                key={option.value}
                                className={classes.option}
                                onClick={() => props.onChange(option.value, !active)}>
                                <ListItemIcon className={classes.optionIconContainer}>
                                    {active && (
                                        <CheckOutlined
                                            className={classes.optionIcon}
                                            fontSize="small" />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={t(option.label)} />
                            </ListItem>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default SelectMenuList;
