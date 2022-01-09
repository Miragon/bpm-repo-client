import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Folder } from "@material-ui/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RepositoryTO } from "../../api";
import { RootState } from "../../store/Store";
import { THEME } from "../../theme";
import AvatarList from "../Avatars/AvatarList";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        width: "calc((100% - 3rem) / 3)",
        margin: "0.5rem",
        borderRadius: "8px",
        padding: "1.25rem",
        cursor: "pointer",
        justifyContent: "space-between",
        transition: theme.transitions.create("box-shadow"),
        boxShadow: "rgba(0, 0, 0, 0.1) -4px 9px 25px -6px",
        border: "1px solid #EAEAEA",
        "&:hover": {
            boxShadow: "rgba(0, 0, 0, 0.25) -4px 9px 25px -6px"
        }
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between"
    },
    cardHeaderIcon: {
        fontSize: "2.5rem",
        fill: THEME.content.primary
    },
    cardHeaderAvatars: {},
    cardBody: {
        display: "flex",
        flexDirection: "column"
    },
    title: {
        marginTop: "1.5rem",
        fontSize: "0.9rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    subtitle: {
        fontSize: "0.8rem",
        fontWeight: 400,
        color: "rgba(0, 0, 0, 0.54)"
    }
}));

interface Props {
    repository: RepositoryTO;
    onClick?: () => void;
}

const RepositoryCard: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const currentUser = useSelector((state: RootState) => state.userInfo)
    const names = [t("repository.avatarYou", { name: currentUser.value?.username })];
    names.push(...Array.from({ length: props.repository.assignedUsers - 1 })
        .map((v, i) => String(i)));

    return (
        <Card
            onClick={props.onClick}
            className={classes.root}
            title={props.repository.name}>

            <div className={classes.cardHeader}>
                <Folder className={classes.cardHeaderIcon} />
                <AvatarList
                    max={1}
                    names={names} />
            </div>

            <div className={classes.cardBody}>
                <Typography
                    variant="subtitle1"
                    className={classes.title}>
                    {props.repository.name}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className={classes.subtitle}>
                    {t("repository.fileCount", { count: props.repository.existingArtifacts })}
                </Typography>
            </div>

        </Card>
    );
};

export default RepositoryCard;
