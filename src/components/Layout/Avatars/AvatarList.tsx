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

export const getAvatarColor = (name: string): string => {
    const index = name
        .split("")
        .map(letter => letter.charCodeAt(0))
        .reduce((cur, val) => val, 0);
    return THEME.avatar.background[index % THEME.avatar.background.length];
};

const AvatarList: React.FC<Props> = props => {
    const classes = useStyles();

    if (props.names.length === 0) {
        return null;
    }

    const namesToShow = props.names.slice(0, props.max ?? 3);
    const moreCount = props.names.length - namesToShow.length;

    return (
        <AvatarGroup className={clsx(classes.cardHeaderAvatars, props.className)}>
            {namesToShow.map(name => (
                <Tooltip
                    key={name}
                    arrow
                    placement="top"
                    classes={{
                        arrow: classes.tooltipArrow,
                        tooltip: classes.tooltip
                    }}
                    title={(<span className={classes.tooltipName}>{name}</span>)}>
                    <Avatar
                        className={classes.avatar}
                        style={{ backgroundColor: getAvatarColor(name) }}
                        variant="rounded"
                        alt={name}>
                        {name.substr(0, 1)}
                    </Avatar>
                </Tooltip>
            ))}
            {moreCount > 0 && (
                <Avatar
                    className={classes.avatar}
                    style={{ backgroundColor: getAvatarColor("MORE") }}
                    variant="rounded"
                    alt={`+${moreCount}`}>
                    {`+${moreCount}`}
                </Avatar>
            )}
        </AvatarGroup>
    );
};

export default AvatarList;
