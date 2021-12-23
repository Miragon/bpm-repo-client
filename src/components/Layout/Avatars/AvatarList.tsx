import { Avatar, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AvatarGroup } from "@material-ui/lab";
import clsx from "clsx";
import React from "react";
import { THEME } from "../../../theme";

const useStyles = makeStyles(theme => ({
    cardHeaderAvatars: {},
    avatar: {
        height: "32px",
        width: "32px",
        fontSize: "0.9rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        marginLeft: "-4px",
        borderRadius: "8px"
    },
    avatar0: {
        backgroundColor: THEME.avatar.background[0]
    },
    avatar1: {
        backgroundColor: THEME.avatar.background[1]
    },
    avatar2: {
        backgroundColor: THEME.avatar.background[2]
    },
    avatar3: {
        backgroundColor: THEME.avatar.background[3]
    },
    avatar4: {
        backgroundColor: THEME.avatar.background[4]
    },
    tooltip: {
        backgroundColor: THEME.tooltip.background,
        color: THEME.tooltip.text,
        fontSize: THEME.tooltip.fontSize
    },
    tooltipArrow: {
        color: THEME.tooltip.background
    },
    tooltipName: {
        display: "block"
    }
}));

interface Props {
    className?: string;
    names: string[];
    max?: number;
}

const AvatarList: React.FC<Props> = props => {
    const classes = useStyles();

    if (props.names.length === 0) {
        return null;
    }

    const namesToShow = props.names.slice(0, props.max ?? 3);
    const moreCount = props.names.length - namesToShow.length;

    const avatarClasses = [
        classes.avatar0,
        classes.avatar1,
        classes.avatar2,
        classes.avatar3,
        classes.avatar4
    ];
    const startIndex = Math.floor(Math.random() * avatarClasses.length);

    return (
        <AvatarGroup className={clsx(classes.cardHeaderAvatars, props.className)}>
            {namesToShow.map((name, index) => (
                <Tooltip
                    arrow
                    placement="top"
                    classes={{
                        arrow: classes.tooltipArrow,
                        tooltip: classes.tooltip
                    }}
                    title={(<span className={classes.tooltipName}>{name}</span>)}>
                    <Avatar
                        className={clsx(
                            classes.avatar,
                            avatarClasses[(startIndex + index) % avatarClasses.length]
                        )}
                        variant="rounded"
                        alt={name}>
                        {name.substr(0, 1)}
                    </Avatar>
                </Tooltip>
            ))}
            {moreCount > 0 && (
                <Tooltip
                    arrow
                    placement="top"
                    classes={{
                        arrow: classes.tooltipArrow,
                        tooltip: classes.tooltip
                    }}
                    title={props.names.slice(props.max ?? 3).map(name => (
                        <span className={classes.tooltipName}>{name}</span>
                    ))}>
                    <Avatar
                        className={clsx(
                            classes.avatar,
                            avatarClasses[(startIndex + namesToShow.length) % avatarClasses.length]
                        )}
                        variant="rounded"
                        alt={`+${moreCount}`}>
                        {`+${moreCount}`}
                    </Avatar>
                </Tooltip>
            )}
        </AvatarGroup>
    );
};

export default AvatarList;
