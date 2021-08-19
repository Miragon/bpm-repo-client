import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {RepositoryTO, ShareWithRepositoryTORoleEnum} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";

import PopupDialog from "../../../../components/Form/PopupDialog";
import MultipleSelectionList, {MultipleSelectionListItem} from "./MultipleSelectionList";
import {getSharedRepos, shareWithRepo, unshareArtifact} from "../../../../store/actions/ShareAction";

interface Props {
    open: boolean;
    onCancelled: () => void;
    name: string
    artifactId: string;
    repoId: string;
}


const ShareWithRepoDialog: React.FC<Props> = props => {
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

    const isArtifactSharedWithRepo = useCallback((repo: RepositoryTO): boolean => {
        return repo.sharedArtifacts?.map(artifact => artifact.id).includes(props.artifactId) ? true : false;
    }, [props.artifactId])

    const isRepoManageable = useCallback((repo: RepositoryTO): boolean => {
        return manageableRepos.includes(repo)
    }, [manageableRepos])

    const setOpts= (opts: Array<MultipleSelectionListItem>) => {
        setOptions(opts)
    }

    useEffect(() => {
        const opts: MultipleSelectionListItem[] = [];
        manageableRepos.forEach(repo => {
            (repo.id !== props.repoId) && opts.push(
                {
                    name: repo.name,
                    selected: isArtifactSharedWithRepo(repo),
                    editable: isRepoManageable(repo),
                    onAdd: () => {
                        dispatch(shareWithRepo(props.artifactId, repo.id, ShareWithRepositoryTORoleEnum.Viewer))
                    },
                    onRemove: () => {
                        dispatch(unshareArtifact(props.artifactId, repo.id))
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
                    onAdd: () => {
                        dispatch(shareWithRepo(props.artifactId, repo.id, ShareWithRepositoryTORoleEnum.Viewer))
                    },
                    onRemove: () => {
                        dispatch(unshareArtifact(props.artifactId, repo.id))
                    }
                }
            )
        })

        setOpts(opts)

    }, [dispatch, isArtifactSharedWithRepo, isRepoManageable, props.artifactId, sharedRepos, manageableRepos, props.repoId])






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
export default ShareWithRepoDialog;
