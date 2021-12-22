import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AddBoxOutlined } from "@material-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { THEME } from "../../../theme";
import ActionButton from "./ActionButton";
import ActionButtonPopup from "./ActionButtonPopup";

interface Props {
    addOptions: {
        label: string,
        value: string,
        icon: React.ElementType
    }[][];
    onAdd: (value: string) => void;
    primary: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    optionGroup: {
        padding: "0.5rem 0",
        "&:not(:last-child)": {
            borderBottom: "1px solid " + THEME.pageHeader.divider
        }
    },
    optionIcon: {
        fill: THEME.pageHeader.icon
    },
    optionIconContainer: {
        minWidth: "40px"
    }
}));

const ScreenHeader: React.FC<Props> = props => {
    const classes = useStyles();

    const { t } = useTranslation("common");

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();

    return (
        <>
            <ActionButton
                onClick={e => setMenuAnchor(e.currentTarget)}
                label="Hinzufügen"
                icon={AddBoxOutlined}
                primary={props.primary}
                active={false} />
            <ActionButtonPopup
                anchor={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}>
                {({ close }) => props.addOptions.map((group, index) => (
                    <div className={classes.optionGroup}>
                        {group.map(option => (
                            <ListItem
                                dense
                                button
                                onClick={() => {
                                    props.onAdd(option.value);
                                    setTimeout(close);
                                }}>
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
            </ActionButtonPopup>
        </>
    );
};

export default ScreenHeader;
