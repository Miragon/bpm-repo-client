import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {RepositoryTO, ShareWithRepositoryTORoleEnum} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";

import PopupDialog from "../../../../components/Form/PopupDialog";
import MultipleSelectionList, {MultipleSelectionListItem} from "./MultipleSelectionList";
import {getSharedRepos, shareWithRepo, unshareWithRepo} from "../../../../store/actions/ShareAction";
import AddSharingSearchBar from "./AddSharingSearchBar";
import {MANAGEABLE_REPOS, SHARED_REPOS, SUCCESS, SYNC_STATUS_SHARED} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";
import {getManageableRepos} from "../../../../store/actions";

interface Props {
    open: boolean;
    onCancelled: () => void;
    name: string
    artifactId: string;
    repoId: string;
}


const SharingManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [options, setOptions] = useState<Array<MultipleSelectionListItem>>([])

    const manageableRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.manageableRepos);
    const sharedRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.sharedRepos);
    const sharedSynced: boolean = useSelector((state: RootState) => state.dataSynced.sharedSynced);

    const getShared = useCallback(async () => {
        getSharedRepos(props.artifactId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: SHARED_REPOS, sharedRepos: response.data});
                dispatch({type: SYNC_STATUS_SHARED, sharedSynced: true});
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getShared())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getShared())
        })
    }, [dispatch, props.artifactId, t])

    const getManageable = useCallback(async () => {
        getManageableRepos().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: MANAGEABLE_REPOS, manageableRepos: response.data});
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getManageable())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getManageable())
        })
    }, [dispatch, t])

    useEffect(() => {
        if(!sharedSynced){
            getShared()
            getManageable()
        }
    }, [getManageable, getShared, sharedSynced])

    //TODO: ShareRepos-state does not update (should happen in the getSharedRepos action)
    //TODO: Sollten Dateien auch mit Repositories geteilt werden können, die dem nutzer nicht direkt zugewiesen sind?
    const isArtifactSharedWithRepo = useCallback((repo: RepositoryTO): boolean => {
        return sharedRepos.find(sharedRepo => sharedRepo.id === repo.id) ? true : false;
    }, [sharedRepos])

    const isRepoManageable = useCallback((repo: RepositoryTO): boolean => {
        return manageableRepos.includes(repo)
    }, [manageableRepos])

    const setOpts= (opts: Array<MultipleSelectionListItem>) => {
        setOptions(opts)
    }

    const share = useCallback((repoId: string) => {
        shareWithRepo(props.artifactId, repoId, ShareWithRepositoryTORoleEnum.Viewer).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({ type: SUCCESS, successMessage: "share.successful" });
                dispatch({type: SYNC_STATUS_SHARED, sharedSynced: false})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => share(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => share(repoId))

        })
    }, [dispatch, props.artifactId, t])

    const unshare = useCallback((repoId: string) => {
        unshareWithRepo(props.artifactId, repoId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({ type: SUCCESS, successMessage: "share.successful" });
                dispatch({type: SYNC_STATUS_SHARED, sharedSynced: false})
            } else {
                helpers.makeErrorToast(t("share.failed"), () => unshare(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => unshare(repoId))

        })
    }, [dispatch, props.artifactId, t])

    
    useEffect(()=> {
        const opts: MultipleSelectionListItem[] = [];
        sharedRepos.forEach(repo => {
            (repo.id !== props.repoId) && opts.push(
                {
                    name: repo.name,
                    selected: isArtifactSharedWithRepo(repo),
                    editable: isRepoManageable(repo),
                    onClick: () => {
                        if(!isArtifactSharedWithRepo(repo)){
                            share(repo.id)
                        } else{
                            unshare(repo.id)
                        }
                    }
                }
            )
        })


        setOpts(opts)

    }, [isArtifactSharedWithRepo, isRepoManageable, manageableRepos, props.artifactId, props.repoId, share, sharedRepos, unshare])

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.share", {artifactName: props.name})}
            firstTitle={t("dialog.close")}
            onFirst={() => props.onCancelled()} >

            <AddSharingSearchBar
                artifactId={props.artifactId}
                currentRepoId={props.repoId} />

            <MultipleSelectionList
                options={options}
                artifactId={props.artifactId}
                selectIcon={"shareIcon"}
                removeIcon={"deleteIcon"} />


        </PopupDialog>
    );
};
export default SharingManagementDialog;
