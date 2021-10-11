import {ArtifactMilestoneTO, ArtifactTO, ArtifactTypeTO, DeploymentTO} from "../../api";
import {makeStyles, Theme} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {Link} from "@material-ui/core";
import helpers from "../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import {COLOR_LINK} from "../../constants/Constants";
import {openFileInTool} from "../../util/Redirections";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        border: "1px solid #CCC",
        "&:not(:last-child)": {
            borderBottom: "none"
        },
        "&:first-child": {
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px"
        },
        "&:last-child": {
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px"
        },
        display: "flex",
        flexDirection: "column"
    },
    summary: {
        height: "60px",
        padding: "4px 8px 4px 4px",
        display: "flex",
    },
    iconContainer: {
        width: "50px",
        color: "rgba(0, 0, 0, 0.54)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        marginTop: "0.5rem",
        fontSize: "1rem",
        color: COLOR_LINK,
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontWeight: "bold",
        textDecoration: "none"
    },
    subtitle: {
        overflow: "hidden",
        fontSize: "0.8rem",
        textOverflow: "ellipsis",
        color: "rgba(0, 0, 0, 0.54)"
    },
    subtitleText: {
        "&:not(:first-child)": {
            marginLeft: "0.25rem"
        },
        "&:not(:last-child)": {
            marginRight: "0.25rem"
        }
    },
    menuContainer: {
        marginLeft: "16px",
        display: "flex",
        alignItems: "center"
    },
    textContainer: {
        flexGrow: 1,
        display: "flex",
        marginLeft: "8px",
        flexDirection: "column",
        justifyContent: "space-between",
        alignSelf: "center"
    },
    deployment: {
        whiteSpace: "nowrap",
        textTransform: "none"
    },
}))


interface Props {
    deployment: DeploymentTO;
    milestone?: ArtifactMilestoneTO;
    artifact?: ArtifactTO;
}

const DeploymentEntry: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");


    const fileTypes: ArtifactTypeTO[] = useSelector((state: RootState) => state.artifacts.fileTypes);


    const icon = useMemo(
        () => fileTypes.find(ft => ft.name === props.artifact?.fileType)?.svgIcon,
        [fileTypes, props.artifact]
    );


    /**
     * Open the file in tool:
     * openFileInTool(fileTypes, props.artifact.fileType, props.artifact.repositoryId, props.artifact.id, t("error.missingTool", props.artifact.fileType), props.milestone.milestone)
     */

    return (
        <>
            <div className={classes.root}>

                <div className={classes.summary}>
                    <div className={classes.iconContainer}>
                        <Icon>{icon}</Icon>
                    </div>

                    <div className={classes.textContainer}>
                        {props.artifact !== undefined &&
                            <Link
                                href="#"
                                onClick={() => openFileInTool(fileTypes, props.artifact?.fileType ? props.artifact.fileType : "", props.artifact?.repositoryId ? props.artifact.repositoryId : "", props.artifact?.id ? props.artifact.id : "", "tool.notFound", props.milestone?.milestone)}
                                className={classes.title}>
                                {props.artifact.name}
                            </Link>
                        }
                        <div className={classes.subtitle}>
                            <span className={classes.subtitleText}>
                                {t("deployment.milestone",{milestoneNumber: props.milestone?.milestone})}
                            </span>
                            &#8226;
                            <span className={classes.subtitleText}>
                                {t(`artifact.type.${props.artifact?.fileType}`)}
                            </span>
                            &#8226;
                            <span className={classes.subtitleText}>
                                {t("deployment.deploymentDuration", { duration: helpers.formatTimeSince(props.deployment.timestamp, t) })}
                            </span>
                        </div>
                    </div>


                    <div className={classes.menuContainer}>
                        <h2>
                            {props.deployment.target}
                        </h2>



                    </div>

                </div>
            </div>

        </>
    )
}

export default DeploymentEntry;