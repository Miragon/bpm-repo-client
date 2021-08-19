import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {RepositoryTO, ShareWithRepositoryTORoleEnum} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";

import PopupDialog from "../../../../components/Form/PopupDialog";
import MultipleSelectionList, {MultipleSelectionListItem} from "./MultipleSelectionList";
import {getSharedRepos, shareWithRepo, unshareWithRepo} from "../../../../store/actions/ShareAction";
import {forEach} from "react-bootstrap/ElementChildren";

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

    useEffect(() => {
        if(!sharedSynced){
            dispatch(getSharedRepos(props.artifactId))
        }
    }, [dispatch, props.artifactId, sharedSynced])

    //TODO: ShareRepos-state does not update (should happen in the getSharedRepos action)
    //TODO: Dateien sollten auch mit Repositories geteilt werden können, die dem nutzer nicht direkt zugewiesen sind
    const isArtifactSharedWithRepo = useCallback((repo: RepositoryTO): boolean => {
        return sharedRepos.find(sharedRepo => sharedRepo.id === repo.id) ? true : false;
    }, [sharedRepos])

    const isRepoManageable = useCallback((repo: RepositoryTO): boolean => {
        return manageableRepos.includes(repo)
    }, [manageableRepos])

    const setOpts= (opts: Array<MultipleSelectionListItem>) => {
        setOptions(opts)
    }

    useEffect(()=> {
        const opts: MultipleSelectionListItem[] = [];
        manageableRepos.forEach(repo => {
            (repo.id !== props.repoId) && opts.push(
                {
                    name: repo.name,
                    selected: isArtifactSharedWithRepo(repo),
                    editable: isRepoManageable(repo),
                    onClick: () => {
                        if(!isArtifactSharedWithRepo(repo)){
                            dispatch(shareWithRepo(props.artifactId, repo.id, ShareWithRepositoryTORoleEnum.Viewer))
                        } else{
                            dispatch(unshareWithRepo(props.artifactId, repo.id))
                        }
                    }
                }
            )
        })
        sharedRepos.forEach(repo => {
            ((repo.id !== props.repoId) && !sharedRepos.includes(repo)) && opts.push(
                {
                    name: repo.name,
                    selected: isArtifactSharedWithRepo(repo),
                    editable: isRepoManageable(repo),
                    onClick: () => {
                        if(!isArtifactSharedWithRepo(repo)){
                            dispatch(shareWithRepo(props.artifactId, repo.id, ShareWithRepositoryTORoleEnum.Viewer))
                        } else{
                            dispatch(unshareWithRepo(props.artifactId, repo.id))
                        }
                    }
                }
            )
        })

        setOpts(opts)

    }, [dispatch, isArtifactSharedWithRepo, isRepoManageable, manageableRepos, props.artifactId, props.repoId, sharedRepos])

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.share", {artifactName: props.name})}
            firstTitle={t("dialog.close")}
            onFirst={() => props.onCancelled()} >


            <MultipleSelectionList
                options={options}
                artifactId={props.artifactId}
                selectIcon={"shareIcon"}
                removeIcon={"deleteIcon"} />


        </PopupDialog>
    );
};
export default SharingManagementDialog;
