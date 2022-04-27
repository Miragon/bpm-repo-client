import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactApi, ArtifactTypeTO, RepositoryTO } from "../../../../api";
import FileIcon from "../../../../components/Files/FileIcon";
import FileUploadField from "../../../../components/Form/FileUploadField";
import FileDownloadOutlined from "../../../../components/Icons/FileDownloadOutlined";
import { THEME } from "../../../../theme";
import { apiExec, hasFailed } from "../../../../util/ApiUtils";
import { makeSuccessToast } from "../../../../util/ToastUtils";
import ArtifactDialog, { SimpleArtifact } from "./ArtifactDialog";

interface Props {
    artifactTypes: ArtifactTypeTO[];
    repositories: RepositoryTO[];
    repositoryId?: string;
    open: boolean;
    onClose: (artifact: {
        repositoryId: string;
        artifactId: string;
    } | null) => void;
}

const useStyles = makeStyles({
    uploadIcon: {
        fontSize: "4rem",
        margin: "0 2rem 1rem 2rem",
        color: THEME.content.primary
    }
});

const WrapperUploadArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { artifactTypes, repositoryId, repositories, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [file, setFile] = useState<string>();
    const [fileName, setFileName] = useState<string>();
    const [artifactType, setArtifactType] = useState<ArtifactTypeTO>();

    const onFileChanged = useCallback((file: File) => {
        const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const artifactType = artifactTypes.find(type => type.fileExtension.toLowerCase() === fileExtension);
        if (!artifactType) {
            setError("exception.fileTypeNotSupported");
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

    const onCreate = useCallback(async (updatedArtifact: SimpleArtifact) => {
        if (!file) {
            setError(t("validation.noFile"));
            return;
        }

        setError(undefined);
        setDisabled(true);

        const response = await apiExec(ArtifactApi, api => api.createArtifact(updatedArtifact.repositoryId, {
            fileType: updatedArtifact.type,
            description: updatedArtifact.description || "",
            name: updatedArtifact.title,
            file: file
        }));
        setDisabled(false);
        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast(t("artifact.uploaded"));
        onClose({
            repositoryId: response.result.repositoryId,
            artifactId: response.result.id
        });
        setFile(undefined);
        setArtifactType(undefined);
        setFileName(undefined);
    }, [onClose, t, file]);

    return (
        <ArtifactDialog
            dialogTitleLabel={t("artifact.upload")}
            dialogSaveButtonLabel={t("dialog.create")}
            action="upload"
            repositories={repositories}
            types={artifactTypes}
            artifactRepository={repositoryId}
            artifactType={artifactType?.name}
            disabled={disabled}
            open={open}
            errorMsg={error}
            onSave={onCreate}
            onClose={() => onClose(null)} >
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

        </ArtifactDialog>
    );
};

export default WrapperUploadArtifactDialog;
