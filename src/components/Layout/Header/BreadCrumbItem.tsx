import { Link, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";
import { THEME } from "../../../theme";

interface Props {
    link: string;
    title: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        fontSize: "1.25rem",
        fontWeight: 700,
        color: THEME.pageHeader.breadcrumb.text,
        cursor: "pointer"
    }
}));

const BreadCrumbItem: React.FC<Props> = props => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Link onClick={() => history.push(props.link)}>
            <Typography
                variant="h1"
                className={classes.title}>
                {props.title}
            </Typography>
        </Link>
    );
};

export default BreadCrumbItem;
