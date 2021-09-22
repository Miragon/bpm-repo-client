import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {
    ArtifactTO,
    RepositoryTO,
    SharedRepositoryTO,
    ShareWithRepositoryTORoleEnum,
    ShareWithTeamTORoleEnum
} from "../../../../api";

import PopupDialog from "../../../../components/Form/PopupDialog";
import {MANAGEABLE_REPOS, SUCCESS, SYNC_STATUS_SHARED} from "../../../../constants/Constants";
import {getManageableRepos, searchRepos} from "../../../../store/actions";
import {getSharedRepos, shareWithRepo, shareWithTeam, unshareWithRepo} from "../../../../store/actions/shareAction";
import {RootState} from "../../../../store/reducers/rootReducer";
import helpers from "../../../../util/helperFunctions";
import AddSharingSearchBar from "./AddSharingSearchBar";
import SharedRepositories, {SharedListItem} from "./SharedRepositories";
import {Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {searchTeam} from "../../../../store/actions/teamAction";


const useStyles = makeStyles((theme: Theme) => ({

    tab: {
        flexGrow: 1,
    }

}));


interface Props {
    open: boolean;
    onCancelled: () => void;
    artifact: ArtifactTO | undefined;
}

const SharingManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [options, setOptions] = useState<Array<SharedListItem>>([])
    const [openedTab, setOpenedTab] = useState<string>("0");


    const manageableRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.manageableRepos);
    const sharedSynced: boolean = useSelector((state: RootState) => state.dataSynced.sharedSynced);

    const [sharedRepos, setSharedRepos] = useState<Array<SharedRepositoryTO>>([]);


    const getShared = useCallback(async () => {
        if (!props.artifact) {
            return;
        }

        getSharedRepos(props.artifact.id).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setSharedRepos(response.data)
                dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getShared())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getShared())
        })
    }, [dispatch, props.artifact, t])

    const getManageable = useCallback(async () => {
        getManageableRepos().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: MANAGEABLE_REPOS, manageableRepos: response.data });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getManageable())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getManageable())
        })
    }, [dispatch, t])

    useEffect(() => {
        if (!sharedSynced) {
            getShared()
            getManageable()
        }
    }, [getManageable, getShared, sharedSynced])

    //TODO: Sollten Dateien auch mit Repositories geteilt werden können, die dem nutzer nicht
    // direkt zugewiesen sind?

    const isRepoManageable = useCallback((sharedRepositoryTO: SharedRepositoryTO): boolean => {
        return !!manageableRepos.find(manageableRepo => manageableRepo.id === sharedRepositoryTO.repositoryId)
    }, [manageableRepos])

    const setOpts = (opts: Array<SharedListItem>) => {
        setOptions(opts)
    }


    const unshare = useCallback((repoId: string) => {
        if (!props.artifact) {
            return;
        }
        unshareWithRepo(props.artifact.id, repoId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "share.successful" });
                dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: false })
            } else {
                helpers.makeErrorToast(t("share.failed"), () => unshare(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => unshare(repoId))
        })
    }, [dispatch, props.artifact, t])


    useEffect(() => {
        const opts: SharedListItem[] = [];
        sharedRepos.forEach(sharedRepo => {
            (sharedRepo.repositoryId !== props.artifact?.repositoryId) && opts.push(
                {
                    repoName: sharedRepo.repositoryName || "unknown Repository",
                    repoId: sharedRepo.repositoryId,
                    artifactName: sharedRepo.artifactName || "unknown Artifact",
                    artifactId: sharedRepo.artifactId,
                    role: sharedRepo.role,
                    editable: isRepoManageable(sharedRepo),
                    onClick: () => {
                        unshare(sharedRepo.repositoryId)
                    }
                }
            )
        })
        setOpts(opts)
    }, [isRepoManageable, manageableRepos, props.artifact, sharedRepos, unshare])



    const handleChangeTab = (event: any, newValue: string) => {
        setOpenedTab(newValue)
    }

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.share", { artifactName: props.artifact?.name })}
            firstTitle={t("dialog.close")}
            onFirst={() => props.onCancelled()}>
            
            
            {props.artifact && (
                <>
                    <TabContext value={openedTab} >

                        <TabList onChange={handleChangeTab} >
                            <Tab label={t("repository.repositories")} value="0"  className={classes.tab}/>
                            <Tab label={t("team.teams")} value="1" className={classes.tab}/>
                        </TabList>

                        <TabPanel value="0">
                            <AddSharingSearchBar
                                entity="repository"
                                artifactId={props.artifact.id}
                                roleForNewAssignments={ShareWithRepositoryTORoleEnum.Viewer}
                                searchMethod={searchRepos}
                                shareMethod={shareWithRepo}/>
                            <SharedRepositories
                                options={options}
                                artifactId={props.artifact.id}/>
                        </TabPanel>

                        <TabPanel value="1">
                            <AddSharingSearchBar
                                entity="team"
                                artifactId={props.artifact.id}
                                roleForNewAssignments={ShareWithTeamTORoleEnum.Viewer}
                                searchMethod={searchTeam}
                                shareMethod={shareWithTeam}/>
                            <SharedRepositories
                                options={options}
                                artifactId={props.artifact.id}/>
                        </TabPanel>

                    </TabContext>

                </>
            )}

        </PopupDialog>
    );
};
export default SharingManagementDialog;
