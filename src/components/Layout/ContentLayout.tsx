import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    contentWrapper: {
        flexGrow: 1,
        display: "flex"
    },
    content: {
        display: "flex",
        flexGrow: 1,
        padding: "2rem 0",
        flexDirection: "column",
        maxWidth: "960px",
        margin: "0 auto"
    }
}));

interface Props {
    wrapperClassName?: string;
    className?: string;
}

const ContentLayout: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.contentWrapper, props.wrapperClassName)}>
            <div className={clsx(classes.content, props.className)}>
                {props.children}
            </div>
        </div>
    );
};

export default ContentLayout;


