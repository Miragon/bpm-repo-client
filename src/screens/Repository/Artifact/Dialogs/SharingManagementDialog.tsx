import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTO, RepositoryTO, ShareWithRepositoryTORoleEnum } from "../../../../api";

import PopupDialog from "../../../../components/Form/PopupDialog";
import {
    MANAGEABLE_REPOS,
    SHARED_REPOS,
    SUCCESS,
    SYNC_STATUS_SHARED
} from "../../../../constants/Constants";
import { getManageableRepos } from "../../../../store/actions";
import {
    getSharedRepos,
    shareWithRepo,
    unshareWithRepo
} from "../../../../store/actions/ShareAction";
import { RootState } from "../../../../store/reducers/rootReducer";
import helpers from "../../../../util/helperFunctions";
import AddSharingSearchBar from "./AddSharingSearchBar";
import MultipleSelectionList, { MultipleSelectionListItem } from "./MultipleSelectionList";

interface Props {
    open: boolean;
    onCancelled: () => void;
    artifact: ArtifactTO | undefined;
}

const SharingManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [options, setOptions] = useState<Array<MultipleSelectionListItem>>([])

    const manageableRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.manageableRepos);
    const sharedRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.sharedRepos);
    const sharedSynced: boolean = useSelector((state: RootState) => state.dataSynced.sharedSynced);

    const getShared = useCallback(async () => {
        if (!props.artifact) {
            return;
        }

        getSharedRepos(props.artifact.id).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SHARED_REPOS, sharedRepos: response.data });
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

    //TODO: ShareRepos-state does not update (should happen in the getSharedRepos action)
    //TODO: Sollten Dateien auch mit Repositories geteilt werden können, die dem nutzer nicht
    // direkt zugewiesen sind?
    const isArtifactSharedWithRepo = useCallback((repo: RepositoryTO): boolean => {
        return !!sharedRepos.find(sharedRepo => sharedRepo.id === repo.id);
    }, [sharedRepos])

    const isRepoManageable = useCallback((repo: RepositoryTO): boolean => {
        return manageableRepos.includes(repo)
    }, [manageableRepos])

    const setOpts = (opts: Array<MultipleSelectionListItem>) => {
        setOptions(opts)
    }

    const share = useCallback((repoId: string) => {
        if (!props.artifact) {
            return;
        }

        shareWithRepo(props.artifact.id, repoId, ShareWithRepositoryTORoleEnum.Viewer).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SUCCESS, successMessage: "share.successful" });
                dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: false })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => share(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => share(repoId))

        })
    }, [dispatch, props.artifact, t])

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
        const opts: MultipleSelectionListItem[] = [];
        sharedRepos.forEach(repo => {
            (repo.id !== props.artifact?.repositoryId) && opts.push(
                {
                    name: repo.name,
                    selected: isArtifactSharedWithRepo(repo),
                    editable: isRepoManageable(repo),
                    onClick: () => {
                        if (!isArtifactSharedWithRepo(repo)) {
                            share(repo.id)
                        } else {
                            unshare(repo.id)
                        }
                    }
                }
            )
        })


        setOpts(opts)

    }, [isArtifactSharedWithRepo, isRepoManageable, manageableRepos, props.artifact, share, sharedRepos, unshare])

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
                    <AddSharingSearchBar
                        artifactId={props.artifact.id}
                        currentRepoId={props.artifact.repositoryId} />
                    <MultipleSelectionList
                        options={options}
                        artifactId={props.artifact.id}
                        selectIcon={"shareIcon"}
                        removeIcon={"deleteIcon"} />
                </>
            )}

        </PopupDialog>
    );
};
export default SharingManagementDialog;
