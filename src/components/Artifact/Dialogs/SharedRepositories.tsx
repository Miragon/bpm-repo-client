import {Icon, IconButton, List, ListItem, Paper} from "@material-ui/core";
import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {AxiosResponse} from "axios";
import {ArtifactTO, SharedRepositoryTO, SharedRepositoryTORoleEnum, ShareWithRepositoryTORoleEnum,} from "../../../api";
import {SYNC_STATUS_SHARED} from "../../../constants/Constants";
import {makeErrorToast, makeSuccessToast} from "../../../util/toastUtils";

const useStyles = makeStyles(() => ({

    listItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    leftPanel: {},
    middlePanel: {},
    rightPanel: {},
    removeIcon: {
        color: "grey",
    }
}))

export interface SharedListItem {
    repoName: string;
    targetId: string;
    artifactName: string;
    artifactId: string;
    role: SharedRepositoryTORoleEnum;
    onClick: () => void;
    editable?: boolean;
}

interface Props {
    entity: "repository" | "team";
    artifact: ArtifactTO;
    getSharedMethod: (id: string) => Promise<AxiosResponse>;
    unshareMethod: (artifactId: string, shareTargetId: string) => Promise<AxiosResponse>;
    updateMethod: (artifactId: string, targetId: string, role: ShareWithRepositoryTORoleEnum) => Promise<AxiosResponse>;
}

const SharedRepositories: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const [shareTarget, setShareTarget] = useState<Array<SharedRepositoryTO>>([]);
    const [options, setOptions] = useState<Array<SharedListItem>>([])


    const getShared = useCallback(async () => {

        props.getSharedMethod(props.artifact.id).then(response => {
            if (Math.floor(response.status / 100) !== 2) {
                makeErrorToast(t(response.data.toString()), () => getShared())
                return;
            }
            setShareTarget(response.data)
            dispatch({type: SYNC_STATUS_SHARED, sharedSynced: true});
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getShared())
        })
    }, [dispatch, props, t])

    const unshare = useCallback((repoId: string, targetName: string) => {
        props.unshareMethod(props.artifact.id, repoId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SYNC_STATUS_SHARED, sharedSynced: false})
                makeSuccessToast(t("share.removed", {targetName}))
            } else {
                makeErrorToast(t("share.failed"), () => unshare(repoId, targetName))
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => unshare(repoId, targetName))
        })
    }, [dispatch, props, t])


    useEffect(() => {
        getShared()
    }, [getShared])

    useEffect(() => {
        const opts: SharedListItem[] = [];
        shareTarget.forEach(sharedElement => {
            if ("repositoryId" in sharedElement) {
                (sharedElement.repositoryId !== props.artifact?.repositoryId) && opts.push(
                    {
                        repoName: sharedElement.repositoryName || "unknown Repository",
                        targetId: sharedElement.repositoryId,
                        artifactName: sharedElement.artifactName || "unknown Artifact",
                        artifactId: sharedElement.artifactId,
                        role: sharedElement.role,
                        onClick: () => {
                            unshare(sharedElement.repositoryId, sharedElement.repositoryName || "Project")
                        }
                    }
                )
            }
        })
        setOptions(opts)
    }, [props.artifact, shareTarget, unshare])


    return (
        <List>
            <Paper>
                {options.map(option => (
                    <ListItem className={classes.listItem} button key={option.repoName}>
                        <div className={classes.leftPanel}>
                            <IconButton onClick={() => option.onClick()}>
                                <Icon color={"secondary"}>
                                    {"shareIcon"}
                                </Icon>
                            </IconButton>
                        </div>
                        <div className={classes.middlePanel}>
                            {option.repoName}
                        </div>
                        <div>

                        </div>

                    </ListItem>
                ))}
            </Paper>
        </List>
    );
};

export default SharedRepositories;