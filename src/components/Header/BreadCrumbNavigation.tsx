import { Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { THEME } from "../../theme";
import BreadCrumbItem from "./BreadCrumbItem";

export interface BreadcrumbEntry {
    link: string;
    title: string;
}

interface Props {
    title: BreadcrumbEntry[];
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex"
    },
    divider: {
        fontSize: "1.5rem",
        lineHeight: "1.5rem",
        fontWeight: 700,
        margin: "0 0.5rem",
        color: THEME.pageHeader.breadcrumb.separator
    }
}));

const BreadCrumbNavigation: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.title.length > 0 && (
                <BreadCrumbItem
                    link={props.title[0].link}
                    title={props.title[0].title} />
            )}
            {props.title.slice(1).map(title => (
                <React.Fragment key={title.title}>
                    <Typography
                        variant="h1"
                        className={classes.divider}>
                        &rsaquo;
                    </Typography>
                    <BreadCrumbItem
                        key={title.link}
                        link={title.link}
                        title={title.title} />
                </React.Fragment>
            ))}
        </div>
    );
};

export default BreadCrumbNavigation;
