import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DescriptionOutlined, PeopleOutline } from "@material-ui/icons";
import React from "react";
import { RepositoryTO } from "../../../api";
import { COLOR_LINK } from "../../../constants/Constants";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        width: "200px",
        height: "92px",
        marginRight: "0.5rem",
        borderRadius: "4px",
        border: "1px solid #CCC",
        padding: "1rem 0.5rem 0.25rem 1rem",
        cursor: "pointer",
        justifyContent: "space-between",
        transition: theme.transitions.create("box-shadow"),
        "&:hover": {
            boxShadow: theme.shadows[2]
        }
    },
    title: {
        color: COLOR_LINK,
        fontWeight: "bold",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    metadata: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    icon: {
        width: "20px",
        margin: "0 0.25rem 0 0.75rem"
    }
}));

interface RepoProps {
    repository: RepositoryTO;
    onClick?: () => void;
}

const RepoCard: React.FC<RepoProps> = props => {
    const classes = useStyles();

    return (
        <div
            onClick={props.onClick}
            className={classes.root}
            title={props.repository.name}>

            <Typography
                variant="subtitle1"
                className={classes.title}>
                {props.repository.name}
            </Typography>

            <div className={classes.metadata}>
                <DescriptionOutlined className={classes.icon} />
                {props.repository.existingArtifacts}
                <PeopleOutline className={classes.icon} />
                {props.repository.assignedUsers}
            </div>

        </div>
    );
};

export default RepoCard;
