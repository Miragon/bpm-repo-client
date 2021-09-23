import {Icon, IconButton, List, ListItem, Paper} from "@material-ui/core";
import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import SelectRoleDropdown from "./SelectShareWithRepositoryRoleDropDown";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {AxiosResponse} from "axios";
import {
    ArtifactTO,
    SharedRepositoryTO,
    SharedRepositoryTORoleEnum,
    SharedTeamTO,
    SharedTeamTORoleEnum
} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import {SUCCESS, SYNC_STATUS_SHARED} from "../../../constants/Constants";
import helpers from "../../../util/helperFunctions";

const useStyles = makeStyles(() => ({

    listItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    leftPanel: {
    },
    middlePanel: {
    },
    rightPanel: {
    },
    removeIcon: {
        color: "grey",
    }
}))

export interface SharedListItem {
    repoName: string;
    targetId: string;
    artifactName: string;
    artifactId: string;
    role: SharedRepositoryTORoleEnum | SharedTeamTORoleEnum;
    onClick: () => void;
    editable?: boolean;
}

interface Props {
    entity: "repository" | "team";
    artifact: ArtifactTO;
    getSharedMethod: (id: string) => Promise<AxiosResponse>;
    unshareMethod: (artifactId: string, shareTargetId: string) => Promise<AxiosResponse>;
    updateMethod: (artifactId: string, targetId: string, role: any) => Promise<AxiosResponse>;
}



const SharedRepositories: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const sharedSynced: boolean = useSelector((state: RootState) => state.dataSynced.sharedSynced);

    const [shareTarget, setShareTarget] = useState<Array<SharedRepositoryTO | SharedTeamTO>>([]);
    const [options, setOptions] = useState<Array<SharedListItem>>([])


    const getShared = useCallback(async () => {

        props.getSharedMethod(props.artifact.id).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                console.log(response.data)
                setShareTarget(response.data)
                dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getShared())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getShared())
        })
    }, [dispatch, props, t])

    const unshare = useCallback((repoId: string, targetName: string) => {
        props.unshareMethod(props.artifact.id, repoId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "share.successful" });
                dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: false })
                helpers.makeSuccessToast(t("share.removed", {targetName}))
            } else {
                helpers.makeErrorToast(t("share.failed"), () => unshare(repoId, targetName))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => unshare(repoId, targetName))
        })
    }, [dispatch, props, t])


    useEffect(() => {
        if (!sharedSynced) {
            getShared()
        }
    }, [getShared, sharedSynced])

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
            } else {
                console.log(sharedElement)
                opts.push(
                    {
                        repoName: sharedElement.teamName || "unknown Team",
                        targetId: sharedElement.teamId,
                        artifactName: sharedElement.artifactName || "unknown Artifact",
                        artifactId: sharedElement.artifactId,
                        role: sharedElement.role,
                        onClick: () => {
                            unshare(sharedElement.teamId, sharedElement.teamId || "Team")
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
                        <SelectRoleDropdown
                            option={option}
                            updateMethod={props.updateMethod}/>

                    </ListItem>
                ))}
            </Paper>
        </List>
    );
};

export default SharedRepositories;
