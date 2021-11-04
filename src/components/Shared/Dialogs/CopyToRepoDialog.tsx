import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {copyToRepo, fetchRepositories} from "../../../store/actions";
import {RootState} from "../../../store/reducers/rootReducer";
import {REPOSITORIES, SYNC_STATUS_ARTIFACT, SYNC_STATUS_REPOSITORY} from "../../../constants/Constants";
import PopupDialog from "../Form/PopupDialog";
import SettingsForm from "../Form/SettingsForm";
import SettingsSelect from "../Form/SettingsSelect";
import {ArtifactTO, RepositoryTO} from "../../../api";
import SettingsTextField from "../Form/SettingsTextField";
import {makeErrorToast, makeSuccessToast} from "../../../util/toastUtils";

interface Props {
    repoId: string;
    open: boolean;
    onCancelled: () => void;
    artifact: ArtifactTO | undefined;
}

const CopyToRepoDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [repoId, setRepoId] = useState<string>(props.repoId);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");


    useEffect(() => {
        setTitle(`${props.artifact?.name}_copy`)
        setDescription(props.artifact?.description || "")
    }, [props.artifact?.description, props.artifact?.name])

    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );
    const repoSynced: boolean = useSelector((state: RootState) => state.dataSynced.repoSynced)

    const onCopy = useCallback(async () => {
        if (!props.artifact) {
            return;
        }

        copyToRepo(repoId, props.artifact.id, title, description).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                makeSuccessToast(t("action.copied"))
                setRepoId("")
                props.onCancelled();
                dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false})
            } else {
                makeErrorToast(t(response.data.toString()), () => onCopy())
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onCopy())
        })
    }, [props, repoId, title, description, t, dispatch]);

    const fetchRepos = useCallback(() => {
        fetchRepositories().then(response => {
            if (Math.floor(response.status / 100) !== 2) {
                makeErrorToast(t(response.data.toString()), () => fetchRepos());
                return;
            }
            
            dispatch({type: REPOSITORIES, repos: response.data});
            dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: true});
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchRepos())
        })
    }, [dispatch, t]);

    useEffect(() => {
        if (!repoSynced) {
            fetchRepos()
        }
    }, [fetchRepos, repoSynced])

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.copy", {artifactName: props.artifact?.name})}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.copy")}
            onFirst={onCopy}>

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={repoId}
                    label={t("repository.target")}
                    onChanged={setRepoId}>
                    {allRepos?.map(repo => (
                        <MenuItem
                            key={repo.id}
                            value={repo.id}>
                            {repo.name}
                        </MenuItem>
                    ))}
                </SettingsSelect>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle}/>

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription}/>

            </SettingsForm>
        </PopupDialog>
    );
};
export default CopyToRepoDialog;
