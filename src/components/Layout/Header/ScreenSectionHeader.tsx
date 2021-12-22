import { Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { THEME } from "../../../theme";

interface Props {
    title: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        marginTop: "1rem",
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        fontSize: "1.35rem",
        fontWeight: 700,
        color: THEME.pageHeader.text
    }
}));

const ScreenSectionHeader: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.header}>
            <Typography
                variant="h1"
                className={classes.title}>
                {props.title}
            </Typography>
        </div>
    );
};

export default ScreenSectionHeader;
