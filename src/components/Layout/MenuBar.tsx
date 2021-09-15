import {makeStyles, Theme} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import {createTestAttributes} from "../../util/TestUtils";

interface Props {
    className?: string;
    testId?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        boxShadow: theme.shadows[4],
        zIndex: theme.zIndex.modal,
        backgroundColor: theme.palette.primary.main,
        height: "60px",
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
            className={clsx(classes.root, props.className)}>
            {props.children}

        </div>
    );
};

export default MenuBar;
