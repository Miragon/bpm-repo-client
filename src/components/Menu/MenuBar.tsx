import {makeStyles, Theme} from "@material-ui/core";
import React from "react";
import {createTestAttributes} from "../../util/TestUtils";
import {COLORS} from "../../design";

interface Props {
    testId?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        boxShadow: theme.shadows[4],
        zIndex: theme.zIndex.modal,
        backgroundColor: COLORS.primary,
        padding: "0.5rem calc(0.5rem + 44px) 0.5rem 0.5rem",
        flexDirection: "row",
        alignItems: "center",
        position: "sticky",
        display: "flex",
        top: 0
    }
}));

const MenuBar: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...createTestAttributes(props.testId)}
            className={classes.root}>
            {props.children}
        </div>
    );
};

export default MenuBar;

