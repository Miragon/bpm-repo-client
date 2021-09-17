import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {ArtifactVersionUploadTOSaveTypeEnum, RepositoryTO} from "../../api";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_VERSION
} from "../../constants/Constants";
import {createArtifact, createVersion} from "../../store/actions";
import {RootState} from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: string;
    repo?: RepositoryTO;
}

const CreateArtifactDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [repoId, setRepoId] = useState<string>("");

    useEffect(() => {
        setRepoId(props.repo?.id || "");
    }, [props.repo]);

    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );

    const onCreate = useCallback(async () => {
        createArtifact(repoId, title, description, props.type)
            .then(response => {
                if (Math.floor(response.status / 100) === 2) {
                    createVersion(response.data.id, "", ArtifactVersionUploadTOSaveTypeEnum.Milestone)
                        .then(response2 => {
                            if (Math.floor(response2.status / 100) === 2) {
                                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                                dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                                dispatch({ type: SYNC_STATUS_RECENT, dataSynced: false })
                                dispatch({ type: SYNC_STATUS_VERSION, dataSynced: false });
                                setTitle("");
                                setDescription("");
                                helpers.makeSuccessToast(t("artifact.created"));
                                props.onCancelled();
                            } else {
                                helpers.makeErrorToast(response2.data.toString(), () => createVersion(response.data.id, "", ArtifactVersionUploadTOSaveTypeEnum.Milestone))
                            }
                        }, error => {
                            helpers.makeErrorToast(t(error.response.data), () => createVersion(response.data.id, "", ArtifactVersionUploadTOSaveTypeEnum.Milestone))
                        })
                } else {
                    helpers.makeErrorToast(t(response.data.toString()), () => onCreate())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => onCreate())

            })
    }, [props, dispatch, repoId, title, description, t]);


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t(`artifact.create${props.type}`)}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}>

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={repoId}
                    label={t("repository.target")}
                    onChanged={setRepoId}>
                    {props.repo
                        ? (
                            <MenuItem
                                key={props.repo?.id}
                                value={props.repo?.id}
                                selected>
                                {props.repo?.name}
                            </MenuItem>
                        )
                        : allRepos?.map(repo => (
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
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>
        </PopupDialog>
    );
};
export default CreateArtifactDialog;
