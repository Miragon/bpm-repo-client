import { makeStyles } from "@material-ui/core/styles";
import DescriptionIcon from '@material-ui/icons/Description';
import PeopleIcon from '@material-ui/icons/People';
import React from "react";

const useStyles = makeStyles((theme) => ({
    repoBox: {
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow .3s",
        width: "calc((100% - 2rem) / 5)",
        height: "80px",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        borderRadius: "4px",
        background: `linear-gradient(to bottom, ${theme.palette.primary.main} 40%, ${theme.palette.primary.light} 90%)`,
        cursor: "pointer",
        color: theme.palette.primary.contrastText,
        "&:hover": {
            boxShadow: theme.shadows[4]
        },
        "&:nth-child(5n)": {
            marginRight: 0
        }
    },
    repoHeader: {
        textAlign: "left",
        padding: "1rem 1rem 0.5rem 1rem",
        fontSize: "14px",
        fontWeight: "bold"
    },
    repoDescription: {
        whiteSpace: "normal",
        padding: "0 1rem",
        fontSize: "12px",
    },
    repoInfo: {
        marginTop: "auto",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "0.5rem",
        paddingRight: "0.75rem",
        color: theme.palette.primary.contrastText
    },
    icon: {
        width: "20px",
        margin: "0 0.25rem 0 0.75rem"
    }
}));

interface RepoProps {
    repoTitle: string;
    description: string;
    existingDiagrams: number;
    assignedUsers: number;
}

const RepoCard: React.FC<RepoProps> = props => {
    const classes = useStyles();

    return (
        <div className={classes.repoBox}>
            <div className={classes.repoHeader}>
                {props.repoTitle}
            </div>

            <div className={classes.repoInfo}>
                <DescriptionIcon className={classes.icon} />
                {props.existingDiagrams || 0}
                <PeopleIcon className={classes.icon} />
                {props.assignedUsers || 0}
            </div>

        </div>
    );
};

export default RepoCard;
