import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactApi } from "../../../../api";
import FileIcon from "../../../../components/Files/FileIcon";
import FileUploadField from "../../../../components/Form/FileUploadField";
import FileDownloadOutlined from "../../../../components/Icons/FileDownloadOutlined";
import { THEME } from "../../../../theme";
import { apiExec, hasFailed } from "../../../../util/ApiUtils";
import { makeSuccessToast } from "../../../../util/ToastUtils";
import ArtifactDialog, { SimpleArtifact } from "./ArtifactDialog";
import { FileDescription } from "../../../../components/Files/FileListEntry";

interface Props {
    artifact: FileDescription;
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

    const { artifact, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [file, setFile] = useState<string>();
    const [fileName, setFileName] = useState<string>();
    const [description, setDescription] = useState<string>();

    useEffect(() => {
        setFileName(artifact.name);
        setDescription(artifact.description);
    }, [artifact.description, artifact.name, file])

    const onFileChanged = useCallback((file: File) => {
        const reader = new FileReader();
        reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
            if (typeof event.target?.result === "string") {
                setFile(event.target?.result);
            }
        });
        reader.readAsText(file);
    }, []);

    const onUpdate = useCallback(async (updatedArtifact: SimpleArtifact) => {
        if (!file) {
            setError(t("validation.noFile"));
            return;
        }

        setError(undefined);
        setDisabled(true);

        const response = await apiExec(ArtifactApi, api => api.updateArtifact(artifact.id, {
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
        setFileName(undefined);
        setDescription(undefined)
    }, [file, t, onClose, artifact.id]);

    return (
        <ArtifactDialog
            dialogTitleLabel={t("artifact.upload")}
            dialogSaveButtonLabel={t("dialog.applyChanges")}
            action="upload-edit"
            repositories={[]}
            types={[]}
            artifactRepository={artifact.repository?.id}
            artifactType={artifact.fileType}
            artifactTitle={fileName}
            artifactDescription={description}
            disabled={disabled}
            open={open}
            errorMsg={error}
            onSave={onUpdate}
            onClose={() => onClose(null)} >
            <FileUploadField
                onChanged={onFileChanged}
                onError={setError}
                value={fileName}
                prompt={t("properties.file")}
                promptIcon={artifact.fileType && file ? (
                    <FileIcon
                        className={classes.uploadIcon}
                        type={artifact.fileType}
                        color={THEME.content.primary}
                        iconColor="white" />
                ) : (
                    <FileDownloadOutlined className={classes.uploadIcon} />
                )} />

        </ArtifactDialog>
    );
};

export default WrapperUploadArtifactDialog;
