import { ListItem, ListItemText } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
    ArrowForwardIos,
    ArrowForwardIosOutlined,
    ExitToAppOutlined,
    PersonOutlined, TranslateOutlined
} from "@material-ui/icons";
import React from "react";
import { UserInfoTO } from "../../../api";
import { THEME } from "../../../theme";

const useStyles = makeStyles((theme: Theme) => ({
    avatarMenu: {
        display: "flex",
        flexDirection: "column",
        paddingTop: "0.5rem",
        minWidth: "200px"
    },
    avatarMenuName: {
        padding: "0.5rem 1rem",
        fontWeight: 600,
        fontSize: "0.9rem",
        letterSpacing: 0.5
    },
    avatarMenuDivider: {
        width: "100%",
        height: "1px",
        backgroundColor: THEME.menu.divider
    },
    avatarMenuItem: {
        display: "flex",
        padding: "0.25rem 1rem",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    avatarMenuItemIcon: {
        fill: THEME.menu.icon,
        height: "1.25rem",
        width: "1.25rem",
        marginRight: "1rem"
    },
    avatarMenuItemIconMore: {
        fill: THEME.menu.icon,
        height: "1.25rem",
        width: "1.25rem",
        marginRight: "-0.5rem"
    },
    avatarMenuItemText: {
        color: THEME.menu.text
    }
}));

interface Props {
    onClose: () => void;
    user: UserInfoTO | undefined;
}

const MenuAvatarPopup: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.avatarMenu}>
            <span className={classes.avatarMenuName}>
                {props.user?.username ?? "Unbekannt"}
            </span>
            <div className={classes.avatarMenuDivider} />
            <ListItem
                className={classes.avatarMenuItem}
                button>
                <PersonOutlined
                    className={classes.avatarMenuItemIcon} />
                <ListItemText
                    className={classes.avatarMenuItemText}
                    primary="Account" />
            </ListItem>
            <ListItem
                className={classes.avatarMenuItem}
                button>
                <ExitToAppOutlined
                    className={classes.avatarMenuItemIcon} />
                <ListItemText
                    className={classes.avatarMenuItemText}
                    primary="Logout" />
            </ListItem>
        </div>
    );
};

export default MenuAvatarPopup;
