import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { CloudUploadOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactApi, ArtifactTypeTO, MilestoneApi, RepositoryTO } from "../../../api";
import FileUploadField from "../../../components/Form/FileUploadField";
import FileDownloadOutlined from "../../../components/Icons/FileDownloadOutlined";
import FileIcon from "../../../components/Layout/Files/FileIcon";
import PopupDialog from "../../../components/Shared/Form/PopupDialog";
import SettingsForm from "../../../components/Shared/Form/SettingsForm";
import SettingsSelect from "../../../components/Shared/Form/SettingsSelect";
import SettingsTextField from "../../../components/Shared/Form/SettingsTextField";
import { THEME } from "../../../theme";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import helpers from "../../../util/helperFunctions";

interface Props {
    artifactTypes: ArtifactTypeTO[];
    repositories: RepositoryTO[];
    repositoryId?: string;
    open: boolean;
    onClose: (artifact: {
        milestone: number;
        repositoryId: string;
        artifactId: string;
    } | null) => void;
}

const useStyles = makeStyles({
    titleIcon: {
        color: "white",
        fontSize: "3rem"
    },
    uploadIcon: {
        fontSize: "4rem",
        margin: "0 2rem 1rem 2rem",
        color: THEME.content.primary
    }
});

const UploadArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { artifactTypes, repositoryId, repositories, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [file, setFile] = useState<string>();
    const [fileName, setFileName] = useState<string>();
    const [artifactType, setArtifactType] = useState<ArtifactTypeTO>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState("");

    useEffect(() => {
        if (repositoryId) {
            setRepository(repositoryId);
        }
    }, [repositoryId]);

    const onFileChanged = useCallback((file: File) => {
        const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const artifactType = artifactTypes.find(type => type.fileExtension.toLowerCase() === fileExtension);
        if (!artifactType) {
            helpers.makeErrorToast("exception.fileTypeNotSupported", () => onFileChanged)
            return;
        }

        setArtifactType(artifactType);
        const reader = new FileReader();
        reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
            if (typeof event.target?.result === "string") {
                setFile(event.target?.result);
            }
        });
        reader.readAsText(file);
        setFileName(file.name);
    }, [artifactTypes]);

    const onCreate = useCallback(async () => {
        if (title.length < 4) {
            setError("Der Titel ist zu kurz!");
            return;
        }

        if (!file || !artifactType) {
            setError("Keine Datei ausgewählt!");
            return;
        }

        if (!repository) {
            setError("Kein Projekt ausgewählt!");
            return;
        }

        setError(undefined);
        setDisabled(true);

        const artifactResponse = await apiExec(ArtifactApi, api => api.createArtifact(repository, {
            fileType: artifactType.fileExtension,
            description: description,
            name: title
        }));
        if (hasFailed(artifactResponse)) {
            setError(t(artifactResponse.error));
            setDisabled(false);
            return;
        }

        const milestoneResponse = await apiExec(MilestoneApi, api => api.createMilestone(artifactResponse.result.id, { file }));
        if (hasFailed(milestoneResponse)) {
            setError(t(milestoneResponse.error));
            return;
        }

        setDisabled(false);
        helpers.makeSuccessToast(t("artifact.created"));
        onClose({
            milestone: milestoneResponse.result.milestone,
            repositoryId: milestoneResponse.result.repositoryId,
            artifactId: milestoneResponse.result.id
        });
        setTitle("");
        setDescription("");
        setRepository("");
        setFile(undefined);
        setArtifactType(undefined);
    }, [onClose, t, title, file, artifactType, repository, description]);

    const onCancel = useCallback(() => {
        onClose(null);
    }, [onClose]);

    return (
        <PopupDialog
            small
            onClose={onCancel}
            icon={<CloudUploadOutlined className={classes.titleIcon} />}
            disabled={disabled}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("artifact.upload")}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}>

            <SettingsForm>

                <FileUploadField
                    onChanged={onFileChanged}
                    onError={setError}
                    value={fileName}
                    prompt={t("properties.file")}
                    promptIcon={artifactType ? (
                        <FileIcon
                            className={classes.uploadIcon}
                            type={artifactType.name}
                            color={THEME.content.primary}
                            iconColor="white" />
                    ) : (
                        <FileDownloadOutlined className={classes.uploadIcon} />
                    )} />

                <SettingsSelect
                    disabled={disabled}
                    value={repository}
                    label={t("repository.target")}
                    onChanged={setRepository}>
                    <MenuItem value=""><em>{t("properties.notSelected")}</em></MenuItem>
                    {repositories.map(repo => (
                        <MenuItem
                            key={repo.id}
                            value={repo.id}
                            selected={repo.id === repository}>
                            {repo.name}
                        </MenuItem>
                    ))}
                </SettingsSelect>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    disabled={disabled}
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    disabled={disabled}
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>

        </PopupDialog>
    );
};

export default UploadArtifactDialog;
